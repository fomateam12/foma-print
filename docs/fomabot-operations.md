# FomaBot operations

## Env (server `.env`, read at runtime by docker compose `env_file`)

| Var | Required | Notes |
|---|---|---|
| `CHAT_DEEPSEEK_API_KEY` | yes | Dedicated key, NOT the order-press SKU key. Unset = bot off (no log; `/api/chat/status` returns `enabled:false`). |
| `CHAT_SESSION_SECRET` | yes | 32+ random chars: `openssl rand -base64 48`. Under 32 chars or unset = bot off (no log; `/api/chat/status` returns `enabled:false`). |
| `CHAT_DENYLIST` | yes | Comma-separated store/supplier/tool/team names. Never commit. Empty or unset = bot disabled (log `chat.denylist_missing`). |
| `CHAT_MODEL` | no | Default `deepseek-v4-pro` |
| `CHAT_DAILY_TOKEN_BUDGET` | no | Default 2000000 |
| `CHAT_DEEPSEEK_BASE_URL` | no | Default `https://api.deepseek.com` |
| `TURNSTILE_SECRET_KEY` | conditional | Required in production (`NODE_ENV=production`). Unset in prod = bot disabled (log `chat.turnstile_missing`). Optional in dev. |

After changing `.env` on the server, restart the app container so `getChatConfig()` re-reads it.

## DeepSeek account setup
1. Create a separate API key named `fomabot`.
2. Load a small prepaid balance ($20) and keep auto top-up OFF.
3. If the console has a "do not use my data for training" setting, turn it on.

## Building the denylist
1. Store names from order-press (read-only). The operator runs:
   `! ssh orderpress "cd /home/forge/app && php artisan tinker --execute='echo App\\Models\\Shop::pluck(\"name\")->implode(\",\");'"`
   (adjust the path and model name to the live app before running).
2. Append by hand: supplier names, internal tool names (Forge, Studio, Library, DeepSeek, FomaFlow internals), team first names, internal domains (fomahub.com is already blocked as a foreign URL).
3. Leave generic words in if they come along. `parseDenylist` drops amazon/etsy/walmart/ebay/shopify/foma/fomaprint automatically, plus anything under 3 chars.
4. Save locally as `~/.config/fomabot/denylist.txt` (not in any repo), then put the same one-line value into the server `.env` as `CHAT_DENYLIST=`.
5. Run `CHAT_DENYLIST="$(cat ~/.config/fomabot/denylist.txt)" npm run chat:check`.

## Editing the knowledge pack
Edit `src/chatbot/knowledge/{en,tr}.ts`, keep them in sync, then run `chat:check` and `chat:redteam` before opening the PR. If a denylist term slips in anyway, production disables the bot (log event `chat.knowledge_unsafe`) instead of serving it.

## Logs to watch
`chat.filter_hit` (rule only), `chat.rate_limited`, `chat.budget_exceeded`, `chat.model_error`, `chat.empty_reply`, `chat.knowledge_unsafe`, `chat.denylist_missing`, `chat.turnstile_missing`. Message text is never logged.
