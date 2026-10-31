#!/usr/bin/env bash
# Visits referred by AI assistants, from the Caddy access log.
# Run on the Hetzner host:  bash /opt/fomaprint/scripts/ai-referrals.sh [days]
# Counts page views (HTML GETs) whose Referer or utm_source names an AI
# assistant, grouped by source and by landing page.
set -euo pipefail
DAYS="${1:-30}"
DIR=/var/lib/docker/volumes/fomaprint_caddy_data/_data
SINCE=$(( $(date +%s) - DAYS * 86400 ))
AI='chatgpt[.]com|chat[.]openai[.]com|openai|perplexity|copilot[.]microsoft|bing[.]com/chat|gemini[.]google|claude[.]ai'

cat "$DIR"/access*.log 2>/dev/null | jq -r --argjson since "$SINCE" --arg ai "$AI" '
  select(.ts >= $since and .request.method == "GET")
  | select((.request.uri | sub("[?].*"; "") | test("^/(_next|api)/|[.][a-z0-9]+$")) | not)
  | (.request.headers.Referer[0] // "") as $ref
  | (.request.uri | capture("utm_source=(?<u>[^&]+)").u // "") as $utm
  | select(($ref + " " + $utm) | test($ai; "i"))
  | [(if $utm != "" then $utm else ($ref | sub("^https?://"; "") | sub("/.*"; "")) end),
     (.request.uri | sub("[?].*"; ""))] | @tsv' > /tmp/ai-ref.tsv

echo "AI-referred page views, last $DAYS days: $(wc -l < /tmp/ai-ref.tsv)"
echo; echo "By source:";  cut -f1 /tmp/ai-ref.tsv | sort | uniq -c | sort -rn
echo; echo "By landing page:"; cut -f2 /tmp/ai-ref.tsv | sort | uniq -c | sort -rn | head -30
