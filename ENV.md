# Environment variables

Names only — **never commit values**. Set these in Vercel (Production + Preview)
and in `.env.local` for local dev. `.env*` is gitignored.

## Public (safe — exposed to the browser, baked at build time)
| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_R2_BASE_URL` | Cloudflare R2 origin for product images |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary fallback cloud name |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (metadata / sitemap / OG) |

## Server-only secrets (NEVER `NEXT_PUBLIC_`, never in the client bundle)
| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key — reseller-application emails |
| `RESELLER_FROM_EMAIL` | Verified sender, e.g. `FomaPrint <noreply@fomaprint.com>` |
| `RESELLER_NOTIFICATION_EMAIL` | Lead destination (`info@fomaprint.com`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | Quote-form email (nodemailer) |
| `EMAIL_FROM` / `EMAIL_TO` | Quote sender / recipient (default to SMTP_USER / site email) |
| `LEAD_WEBHOOK_URL` | Optional — POST each lead to a sheet/CSV endpoint |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Reseller-application Sheets sync — service-account email |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Reseller-application Sheets sync — service-account private key, `\n`-escaped |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Reseller-application Sheets sync — target spreadsheet ID (from its URL) |
| `GOOGLE_SHEETS_TAB_NAME` | Optional — sheet tab name, defaults to `Reseller Applications` |

## Notes
- The codebase reads only the names above (verified via `grep process.env`).
- No Supabase keys (the project does not use Supabase).
- Rotate any secret that was ever pasted into chat, a PR, or committed — assume
  it is public.

## Google Sheets sync setup (reseller applications)

One-time, operator-run setup to enable the automatic row-per-application sync:

1. In Google Cloud Console, create (or reuse) a project, then enable the
   **Google Sheets API** for it (APIs & Services → Enable APIs → search
   "Google Sheets API").
2. Create a service account (IAM & Admin → Service Accounts → Create).
   No project roles are needed — access is granted per-sheet in step 4.
3. Open the service account → Keys → Add key → JSON. Download the key
   file. From it:
   - `client_email` → `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `private_key` → `GOOGLE_SHEETS_PRIVATE_KEY` (paste as-is; the `\n`
     sequences in the JSON file are read literally by the app)
4. Create (or open) the destination Google Sheet, click **Share**, and
   share it with the service account's email (the `client_email` value)
   as **Editor**.
5. Copy the spreadsheet ID from its URL
   (`https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`) into
   `GOOGLE_SHEETS_SPREADSHEET_ID`.
6. Optionally rename the first tab (or add a new one) and set
   `GOOGLE_SHEETS_TAB_NAME` to match — otherwise the app writes to a tab
   literally named `Reseller Applications`, which must exist in the sheet.
7. Set all values in Vercel (Production + Preview) and in `.env.local` for
   local testing. Delete the downloaded JSON key file once the values are
   copied — don't leave it on disk.
