#!/usr/bin/env bash
# fomaprint.com deploy: fetch main, build, swap, health-check, roll back on failure.
#
# Installed at /usr/local/bin/fomaprint-deploy on the Hetzner host and pinned as
# the forced command of the GitHub Actions deploy key (see DEPLOY.md), so that
# key can run this script and nothing else. The repo copy is the source of
# truth, but the host does NOT pick up edits automatically — reinstall by hand:
#   scp deploy/hetzner/deploy.sh fomaprint:/usr/local/bin/fomaprint-deploy
set -euo pipefail

APP_DIR=/opt/fomaprint
IMAGE=fomaprint-app
SITE=www.fomaprint.com
LOG=/var/log/fomaprint-deploy.log
DEFAULT_PATHS="/ /quote /sitemap.xml"

# Overrides are for a root shell only (e.g. a rollback drill). sshd sets
# SSH_ORIGINAL_COMMAND when the deploy key's forced command runs us — pin
# everything to the defaults so the key cannot choose what gets deployed.
if [[ -n "${SSH_ORIGINAL_COMMAND+x}" ]]; then
  unset DEPLOY_REF HEALTH_PATHS
fi
REF="${DEPLOY_REF:-origin/main}"
HEALTH_PATHS="${HEALTH_PATHS:-$DEFAULT_PATHS}"

exec > >(tee -a "$LOG") 2>&1
TEE_PID=$!
# Let tee flush the last lines before sshd closes the session.
trap 'exec 1>&- 2>&-; wait "$TEE_PID" 2>/dev/null || true' EXIT
log() { printf '[%s] %s\n' "$(date -u +%FT%TZ)" "$*"; }

# Two quick merges queue up here instead of building over each other.
exec 9>/run/lock/fomaprint-deploy.lock
if ! flock -w 1200 9; then
  log "another deploy held the lock for 20 min — giving up"
  exit 1
fi

cd "$APP_DIR"
[[ -f .env ]] || { log ".env missing in $APP_DIR — refusing to build"; exit 1; }

trigger="${SSH_ORIGINAL_COMMAND:-manual}"
log "trigger=${trigger//[^0-9a-zA-Z]/} ref=$REF"
git fetch --prune origin
git reset --hard "$REF"
SHA=$(git rev-parse --short HEAD)
log "building $SHA: $(git log -1 --format=%s)"

# Keep the image that is serving right now so a failed check can swap back.
if docker image inspect "$IMAGE:latest" >/dev/null 2>&1; then
  docker tag "$IMAGE:latest" "$IMAGE:previous"
fi

if ! docker compose build app; then
  log "build failed — nothing was swapped, the site still serves the previous image"
  exit 1
fi
docker compose up -d
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile \
  || log "WARNING: caddy reload failed — Caddy keeps its last good config"

fetch() {  # $1 = path; body to stdout, fails unless HTTP 2xx, via Caddy on this host
  curl -fsS --max-time 20 --resolve "$SITE:443:127.0.0.1" "https://$SITE$1"
}

healthy() {  # $1 = space-separated paths that must answer 200
  local p body page img
  for p in $1; do
    fetch "$p" >/dev/null || { log "health: $p failed"; return 1; }
  done
  # One real product page, taken from the sitemap so a delisted SKU can't fail the check.
  body=$(fetch /sitemap.xml) || { log "health: /sitemap.xml failed"; return 1; }
  page=$(grep -oE "https://$SITE/product/[^<]+" <<<"$body" | head -1 || true)
  page=${page#"https://$SITE"}
  if [[ -z $page ]] || ! body=$(fetch "$page"); then
    log "health: product page ${page:-<none in sitemap>} failed"
    return 1
  fi
  # The self-hosted image optimizer broke once at cutover (Vercel-only loader) — guard it.
  img=$(grep -oE '/_next/image\?url=[^" ]+' <<<"$body" | head -1 | sed 's/&amp;/\&/g' || true)
  if [[ -z $img ]] || ! fetch "$img" >/dev/null; then
    log "health: image optimizer ${img:-<no /_next/image on page>} failed"
    return 1
  fi
}

wait_healthy() {  # give `next start` up to a minute to come up, then run the full check
  local _
  for _ in $(seq 1 12); do
    fetch / >/dev/null 2>&1 && break
    sleep 5
  done
  healthy "$1"
}

if wait_healthy "$HEALTH_PATHS"; then
  log "deploy OK — $SHA is live"
  docker image prune -f >/dev/null
  exit 0
fi

log "health check failed — rolling back to the previous image"
docker tag "$IMAGE:previous" "$IMAGE:latest"
docker compose up -d --no-build --force-recreate app
if wait_healthy "$DEFAULT_PATHS"; then
  log "rollback OK — previous image is serving again (working tree stays at $SHA)"
else
  log "ROLLBACK ALSO UNHEALTHY — needs a human: ssh fomaprint, docker compose logs app"
fi
exit 1
