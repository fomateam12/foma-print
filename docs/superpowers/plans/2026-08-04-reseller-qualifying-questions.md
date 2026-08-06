# Reseller Qualifying Questions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two required lead-qualifying fields — `currentStatus` (single select) and `salesChannels` (multi-select chips) — to the reseller application form, and carry them through to the notification email and the Google Sheet.

**Architecture:** The form is schema-driven end to end. A Zod schema in `src/lib/validation.ts` types the payload, the API route validates against it and passes the parsed object to two independent dispatchers (Resend email, Google Sheets append). Adding a field therefore means: constant → schema → form control → the two dispatchers. The API route itself needs no change. Customer-facing labels live in `src/dictionaries/{en,tr}.json`; enum *values* stay canonical English and are translated for display only.

**Tech Stack:** Next.js 16 (App Router), React 19, react-hook-form + `@hookform/resolvers/zod`, Zod, Tailwind v4, Resend, Google Sheets REST v4.

## Global Constraints

- **No customer-facing string may be hardcoded in a component.** Every label goes into `src/dictionaries/en.json` **and** `src/dictionaries/tr.json`. (Repo rule since 28 Jul 2026, `AGENTS.md`.)
- **Enum values stay canonical English** in the payload, email and Sheet. Only their display labels are translated, via `optionLabel(value) = t.options[value] ?? value`.
- **Zod validation messages stay hardcoded English** — matches every existing message in `validation.ts`. Do not translate them; that gap is out of scope.
- **This repo has no test suite.** There is no `vitest`/`jest` and none is being added. Per-task verification is `npm run lint` + `npm run build` plus the runnable assertion commands given in each task. Do not invent a test framework.
- **Lint baseline:** 0 errors, and a small number of pre-existing `react-hooks` warnings — one of which is in `seller-application-form.tsx`. The warning count must not increase.
- **Next.js 16:** read `node_modules/next/dist/docs/` before writing Next-specific code. This plan writes none, so no doc read is required.
- **Do not touch** `.env*`, `node_modules`, or `src/data/products.json`.
- **Commit after every task.** Do not push and do not merge to `main` — the operator does that.
- Spec: `docs/superpowers/specs/2026-08-04-reseller-qualifying-questions-design.md`

---

### Task 1: Constants and dictionary entries

Adds the option values and every translated label, without wiring anything into the schema or the UI. Nothing changes on screen; the build stays green. Splitting this out means Task 2 can add the schema field and the form control together as one reviewable unit.

**Files:**
- Modify: `src/lib/validation.ts` (constants block, after `HEAR_ABOUT_US` which ends at line 40)
- Modify: `src/dictionaries/en.json` (`sellerForm` and `sellerForm.options`)
- Modify: `src/dictionaries/tr.json` (same keys)
- Test: none — no test suite (see Global Constraints)

**Interfaces:**
- Consumes: nothing.
- Produces: `CURRENT_STATUSES` and `RESELLER_SALES_CHANNELS`, both `readonly string[]` const tuples exported from `src/lib/validation.ts`. Task 2 uses both in `z.enum(...)` and in `.map()` calls. Dictionary keys `sellerForm.currentStatus`, `sellerForm.salesChannels`, and 12 new `sellerForm.options` entries, all read by Task 2.

- [ ] **Step 1: Add the two constants to `src/lib/validation.ts`**

Insert immediately after the closing `] as const;` of `HEAR_ABOUT_US` (line 40), before `export const resellerApplicationSchema`:

```ts
/**
 * Lead-qualifying ladder, ordered hottest-to-coldest so the operator can
 * read priority off the order alone. `Something else` rather than `Other`:
 * `sellerForm.options` is a flat map keyed by the canonical string, so this
 * cannot share the `Other` key that BUSINESS_TYPES and HEAR_ABOUT_US use.
 */
export const CURRENT_STATUSES = [
  "Already selling print-on-demand products",
  "Selling other products, want to add custom / engraved items",
  "Store is open but not selling yet",
  "Just getting started — no store yet",
  "Something else",
] as const;

/**
 * Sales channels for the reseller form. Deliberately NOT the shared
 * SALES_CHANNELS below: this list adds `Not selling yet`, which the
 * reseller form needs because its channel field is required — without it an
 * applicant who sells nowhere would be forced to tick a channel they do not
 * use. Adding the value to SALES_CHANNELS instead would put a new chip on
 * the quote form, which this change has no business touching.
 *
 * Written as an explicit literal, not `[...SALES_CHANNELS, "…"] as const` —
 * the spread form can widen to string[] and break z.enum.
 */
export const RESELLER_SALES_CHANNELS = [
  "Etsy",
  "Shopify",
  "Amazon",
  "eBay",
  "Own website",
  "In person / retail",
  "Not selling yet",
  "Other",
] as const;
```

Note the em-dash in `"Just getting started — no store yet"` and the en-dashes already used in `MONTHLY_VOLUMES`. These characters are part of the dictionary keys — copy them exactly.

- [ ] **Step 2: Add the two labels to `src/dictionaries/en.json`**

In the `sellerForm` object, after the `"monthlyVolume"` entry:

```json
    "currentStatus": "What best describes you today? *",
    "salesChannels": "Where do you sell? *",
```

- [ ] **Step 3: Add the 12 option entries to `src/dictionaries/en.json`**

In `sellerForm.options`, after the existing `"Trade show"` entry. English display labels are identical to the canonical values:

```json
    "Already selling print-on-demand products": "Already selling print-on-demand products",
    "Selling other products, want to add custom / engraved items": "Selling other products, want to add custom / engraved items",
    "Store is open but not selling yet": "Store is open but not selling yet",
    "Just getting started — no store yet": "Just getting started — no store yet",
    "Something else": "Something else",
    "Etsy": "Etsy",
    "Shopify": "Shopify",
    "Amazon": "Amazon",
    "eBay": "eBay",
    "Own website": "Own website",
    "In person / retail": "In person / retail",
    "Not selling yet": "Not selling yet"
```

`"Other"` is already present in `sellerForm.options` — do not add it again. The existing `"Etsy or Amazon"` key is a `HEAR_ABOUT_US` value, not a channel; leave it alone.

- [ ] **Step 4: Add the same keys to `src/dictionaries/tr.json`**

Two labels in `sellerForm`, after `"monthlyVolume"`:

```json
    "currentStatus": "Şu an sizi en iyi hangisi tanımlıyor? *",
    "salesChannels": "Nerede satış yapıyorsunuz? *",
```

Twelve entries in `sellerForm.options`, after `"Trade show"`. **The keys stay English; only the values are Turkish:**

```json
    "Already selling print-on-demand products": "Halihazırda print-on-demand ürün satıyorum",
    "Selling other products, want to add custom / engraved items": "Başka ürünler satıyorum, kişiye özel / lazer işlemeli ürün eklemek istiyorum",
    "Store is open but not selling yet": "Mağazam açık ama henüz satış yok",
    "Just getting started — no store yet": "Yeni başlıyorum — henüz mağazam yok",
    "Something else": "Başka bir durum",
    "Etsy": "Etsy",
    "Shopify": "Shopify",
    "Amazon": "Amazon",
    "eBay": "eBay",
    "Own website": "Kendi web sitem",
    "In person / retail": "Yüz yüze / perakende",
    "Not selling yet": "Henüz satış yapmıyorum"
```

- [ ] **Step 5: Verify dictionary parity**

Run this from the repo root. It asserts both dictionaries hold exactly the same `sellerForm.options` keys, and that all 12 new keys landed:

```bash
node -e '
const en = require("./src/dictionaries/en.json").sellerForm;
const tr = require("./src/dictionaries/tr.json").sellerForm;
const a = Object.keys(en.options), b = Object.keys(tr.options);
const missing = a.filter(k => !b.includes(k));
const extra = b.filter(k => !a.includes(k));
const needed = [
  "Already selling print-on-demand products",
  "Selling other products, want to add custom / engraved items",
  "Store is open but not selling yet",
  "Just getting started — no store yet",
  "Something else",
  "Etsy", "Shopify", "Amazon", "eBay",
  "Own website", "In person / retail", "Not selling yet",
];
const absent = needed.filter(k => !a.includes(k) || !b.includes(k));
const labels = ["currentStatus", "salesChannels"].filter(k => !en[k] || !tr[k]);
console.log("en options:", a.length, "| tr options:", b.length);
console.log("missing in tr:", missing);
console.log("extra in tr:", extra);
console.log("new keys absent:", absent);
console.log("labels absent:", labels);
const bad = missing.length || extra.length || absent.length || labels.length;
console.log(bad ? "FAIL" : "PASS");
process.exit(bad ? 1 : 0);
'
```

Expected: `en options: 28 | tr options: 28`, all four arrays empty, `PASS`, exit code 0.

If the counts differ from 28, count what is actually there before assuming the plan is wrong — the baseline was 16 keys and this task adds 12.

- [ ] **Step 6: Verify lint and build**

```bash
npm run lint && npm run build
```

Expected: lint reports 0 errors and no *new* warnings; build completes. The two constants are exported but unused at this point — this is expected and does not produce a lint error under the repo's config (`eslint src/` with the default Next config does not flag unused exports).

- [ ] **Step 7: Commit**

```bash
git add src/lib/validation.ts src/dictionaries/en.json src/dictionaries/tr.json
git commit -m "Add qualifying-question constants and bilingual labels

CURRENT_STATUSES and RESELLER_SALES_CHANNELS, plus the English and
Turkish copy for both fields. Not wired into the schema or the form yet.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Schema fields and form controls

Makes the two fields real: required in the schema and rendered in the form. Schema and UI move together because a required schema field with no control would make the form unsubmittable.

**Files:**
- Modify: `src/lib/validation.ts` — `resellerApplicationSchema` (the object literal at lines 42-85; insert after the `monthlyVolume` field)
- Modify: `src/components/seller-application-form.tsx` — import list (line 14-20), `defaultValues` (lines 59-73), and the JSX between the business-type grid and the products input (insert after line 254, before line 256)
- Test: none — no test suite (see Global Constraints)

**Interfaces:**
- Consumes: `CURRENT_STATUSES`, `RESELLER_SALES_CHANNELS` from Task 1; dictionary keys `t.currentStatus`, `t.salesChannels`, and `t.options[…]` via the existing `optionLabel` helper defined at `seller-application-form.tsx:39-40`.
- Produces: `ResellerApplicationInput` gains `currentStatus: (typeof CURRENT_STATUSES)[number]` and `salesChannels: (typeof RESELLER_SALES_CHANNELS)[number][]`. Tasks 3 and 4 read `data.currentStatus` (string) and `data.salesChannels` (array of strings).

- [ ] **Step 1: Add both fields to the schema**

In `src/lib/validation.ts`, inside `resellerApplicationSchema`, directly after the `monthlyVolume` field and before `products`:

```ts
  // Required on purpose, unlike `hearAboutUs` below. The comment there says a
  // new field must be optional so a submission from a cached older form
  // cannot 422. That rule is waived here: the site has taken 15–20 reseller
  // applications in total, so the stale-tab-during-deploy window is not worth
  // a tolerant-server / strict-client schema split. If submission volume ever
  // grows, revisit — the split is the fix, not making these optional.
  currentStatus: z.enum(CURRENT_STATUSES, {
    message: "Tell us where you are today.",
  }),
  salesChannels: z
    .array(z.enum(RESELLER_SALES_CHANNELS))
    .min(1, "Select at least one — or 'Not selling yet'.")
    .max(RESELLER_SALES_CHANNELS.length),
```

- [ ] **Step 2: Verify the schema compiles and rejects an incomplete payload**

This exercises the real schema through the Next-aware TS pipeline. Run from the repo root:

```bash
npx tsx -e '
import { resellerApplicationSchema } from "./src/lib/validation";
const base = {
  name: "Test Person", businessName: "Test Co", email: "a@b.com",
  phone: "+1 5551234567", website: "", businessType: "Online shop",
  monthlyVolume: "51–200 items", products: "tumblers", about: "",
  hearAboutUs: "Instagram", hearAboutUsOther: "", consent: true, fax: "",
};
const missing = resellerApplicationSchema.safeParse(base);
console.log("without new fields -> success:", missing.success, "(want false)");
const empty = resellerApplicationSchema.safeParse({ ...base, currentStatus: "Something else", salesChannels: [] });
console.log("empty channels      -> success:", empty.success, "(want false)");
const good = resellerApplicationSchema.safeParse({ ...base, currentStatus: "Something else", salesChannels: ["Etsy", "Not selling yet"] });
console.log("complete            -> success:", good.success, "(want true)");
const ok = !missing.success && !empty.success && good.success;
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
'
```

Expected: `false`, `false`, `true`, `PASS`, exit 0.

If `tsx` is not installed, run `npx --yes tsx@4 -e '…'`. If the import path fails because of the `@/` alias, note that this snippet uses a relative path on purpose and does not need the alias. Do **not** add `tsx` to `package.json` for this — it is a one-off check.

- [ ] **Step 3: Import the two constants in the form**

In `src/components/seller-application-form.tsx`, extend the existing import from `@/lib/validation` (lines 14-20) to include them:

```ts
import {
  resellerApplicationSchema,
  BUSINESS_TYPES,
  MONTHLY_VOLUMES,
  HEAR_ABOUT_US,
  CURRENT_STATUSES,
  RESELLER_SALES_CHANNELS,
  type ResellerApplicationInput,
} from "@/lib/validation";
```

- [ ] **Step 4: Add both fields to `defaultValues`**

In the `defaultValues` object (lines 59-73), after `monthlyVolume: undefined,`:

```ts
      currentStatus: undefined,
      salesChannels: [],
```

`undefined` for the select matches how `businessType` and `monthlyVolume` are declared (it makes the disabled `Select…` placeholder the initial option); `[]` for the checkbox group matches `channels: []` in `quote-request.tsx:69`.

- [ ] **Step 5: Render both controls**

Insert this JSX after the closing `</div>` of the business-type / monthly-volume grid (line 254) and before the `<div>` that opens the products input (line 256):

```tsx
      <div>
        <Label htmlFor="se-status">{t.currentStatus}</Label>
        <select
          id="se-status"
          className={cn(SELECT, "mt-1.5")}
          defaultValue=""
          aria-invalid={!!errors.currentStatus}
          {...register("currentStatus")}
        >
          <option value="" disabled>
            {t.selectPlaceholder}
          </option>
          {CURRENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {optionLabel(s)}
            </option>
          ))}
        </select>
        <ErrorText msg={errors.currentStatus?.message} />
      </div>

      <div>
        <span className="text-sm font-medium text-foreground">
          {t.salesChannels}
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {RESELLER_SALES_CHANNELS.map((c) => (
            <label
              key={c}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-muted has-[:checked]:text-brand-strong"
            >
              <input
                type="checkbox"
                value={c}
                className="size-3.5 rounded border-input accent-primary"
                {...register("salesChannels")}
              />
              {optionLabel(c)}
            </label>
          ))}
        </div>
        <ErrorText msg={errors.salesChannels?.message} />
      </div>
```

Two details that are easy to get wrong:

- The channel group uses `<span>`, not `<Label htmlFor=…>`. A `<label>` must point at one control, and this is eight of them — pointing it at any single checkbox would make clicking the group heading toggle that one chip. The chip markup and class string are copied verbatim from `quote-request.tsx:360-380`; keep them identical so the two forms stay visually in sync.
- `errors.salesChannels?.message` is the array-level message from `.min(1)`. React-hook-form surfaces it on the array root, which is what this reads.

- [ ] **Step 6: Verify lint and build**

```bash
npm run lint && npm run build
```

Expected: 0 errors, no new warnings, build passes.

- [ ] **Step 7: Verify in the browser, both locales**

```bash
npm run dev
```

Then check, at `http://localhost:3000/sell`:
1. The two new controls appear between "Estimated monthly volume" and "Which products are you interested in?".
2. Submitting with neither answered shows both inline error messages and does not submit.
3. Ticking one chip and choosing a status clears the errors.

Then at `http://localhost:3000/tr/sell`: both labels and all option texts render in Turkish. If any option shows English inside the Turkish page, that key is missing from `tr.json` — `optionLabel` falls back to the English value rather than throwing, so this is the only way it surfaces.

Stop the dev server when done.

- [ ] **Step 8: Commit**

```bash
git add src/lib/validation.ts src/components/seller-application-form.tsx
git commit -m "Collect current status and sales channels on the reseller form

Both fields are required. Deviates from the 'new fields must be optional'
rule documented above hearAboutUs; the rationale is in a comment next to
the fields.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Show the answers in the notification email

**Files:**
- Modify: `src/lib/reseller-email.ts` — the `internalHtml` data table (lines 160-173)
- Test: none — no test suite (see Global Constraints)

**Interfaces:**
- Consumes: `data.currentStatus` (string), `data.salesChannels` (string array) from Task 2.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the two rows**

In `internalHtml`, inside the `<table>` at lines 160-173, directly after `${row("Monthly volume", data.monthlyVolume)}`:

```ts
      ${row("Status", data.currentStatus)}
      ${row("Sells on", data.salesChannels?.join(", "))}
```

`row()` returns `""` for `undefined`, `null` or `""`, so a payload without these fields renders no blank row. Keep the `?.` — it costs nothing and keeps the template honest about the fact that the value is only guaranteed by the schema, not by the type at every call site.

Do not touch `applicantHtml`. The applicant already knows what they answered; the confirmation email stays as-is.

- [ ] **Step 2: Verify the rendered HTML contains both rows**

`internalHtml` is not exported and the only public entry point actually sends mail, so the template cannot be rendered in isolation without dispatching. Assert on the source instead — this checks both rows are present, in the right order, and reading the right properties:

```bash
node -e '
const src = require("fs").readFileSync("src/lib/reseller-email.ts", "utf8");
const i = src.indexOf("Monthly volume");
const status = src.indexOf("row(\"Status\", data.currentStatus)");
const sells = src.indexOf("row(\"Sells on\", data.salesChannels");
const ok = i > -1 && status > i && sells > status;
console.log("monthly volume at", i, "| status at", status, "| sells on at", sells);
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
'
```

Expected: three increasing offsets, `PASS`, exit 0. The email is rendered for real in Task 5 against a live send; this step only guards the ordering.

- [ ] **Step 3: Verify lint and build**

```bash
npm run lint && npm run build
```

Expected: 0 errors, no new warnings, build passes.

- [ ] **Step 4: Commit**

```bash
git add src/lib/reseller-email.ts
git commit -m "Show qualifying answers in the reseller notification email

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Write the answers to the Google Sheet

The one task with a destructive-if-wrong edge: the append range is a fixed column count, and the new values are inserted mid-row.

**Files:**
- Modify: `src/lib/google-sheets.ts` — the `row` array (lines 53-67) and the `range` constant (line 81)
- Test: none — no test suite (see Global Constraints)

**Interfaces:**
- Consumes: `data.currentStatus`, `data.salesChannels` from Task 2.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Insert the two values into the row array**

In `appendResellerApplicationRow`, in the `row` array, directly after `data.monthlyVolume,`:

```ts
    data.currentStatus,
    (data.salesChannels ?? []).join(", "),
```

A cell holds one value, so the array is joined into a single string. `?? []` keeps the join from throwing on a payload that predates this change.

- [ ] **Step 2: Widen the append range**

At line 81, change:

```ts
    const range = encodeURIComponent(`${tabName}!A:M`);
```

to:

```ts
    // A:O — 15 columns, matching the 15-element `row` array above. Widen this
    // whenever a value is added: the API silently drops values past the end of
    // the range, so a stale range loses data without erroring.
    const range = encodeURIComponent(`${tabName}!A:O`);
```

- [ ] **Step 3: Verify the row length matches the range**

```bash
node -e '
const src = require("fs").readFileSync("src/lib/google-sheets.ts", "utf8");
const body = src.slice(src.indexOf("const row = ["), src.indexOf("];", src.indexOf("const row = [")));
const count = body.split("\n").filter(l => l.trim().endsWith(",")).length;
const range = (src.match(/!A:([A-Z])`/) || [])[1];
const width = range ? range.charCodeAt(0) - 64 : -1;
console.log("row elements:", count, "| range width:", width, "(" + range + ")");
const ok = count === 15 && width === 15;
console.log(ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
'
```

Expected: `row elements: 15 | range width: 15 (O)`, `PASS`, exit 0.

If the counts disagree, the row array and the range have drifted — fix before continuing. That mismatch is exactly the silent-truncation failure this step exists to catch.

- [ ] **Step 4: Verify lint and build**

```bash
npm run lint && npm run build
```

Expected: 0 errors, no new warnings, build passes.

- [ ] **Step 5: Commit**

```bash
git add src/lib/google-sheets.ts
git commit -m "Append qualifying answers to the reseller Google Sheet

Row grows to 15 values; the append range widens A:M -> A:O. The new
columns sit after monthlyVolume, which requires inserting two columns in
the sheet itself before this deploys — see the spec.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: End-to-end verification against live services

Nothing before this proves the whole chain works — the two dispatchers are only exercised by a real submission. This task sends one, and it reaches the operator's real inbox and real Sheet.

**Files:** none modified. This task produces evidence, not code.

**Interfaces:**
- Consumes: everything from Tasks 1-4.
- Produces: the verification evidence quoted in the PR description.

- [ ] **Step 1: Confirm the operator has prepared the Sheet**

**Do not run Step 3 until this is confirmed by the operator.** The column insert must happen before any submission written by the new code, because inserting columns shifts every existing row — including rows the new code already wrote correctly.

The operator's steps, in the "Reseller Applications" tab:
1. Right-click column **I** → *Insert 2 columns left*.
2. `I1` = `Current status`, `J1` = `Sells on`.

Verify by asking the operator to confirm both, and by reading the header row: `H1` should be the monthly-volume header, `K1` the products header.

- [ ] **Step 2: Confirm the environment is configured**

```bash
grep -c "RESEND_API_KEY\|RESELLER_FROM_EMAIL\|RESELLER_NOTIFICATION_EMAIL\|GOOGLE_SHEETS_CLIENT_EMAIL\|GOOGLE_SHEETS_PRIVATE_KEY\|GOOGLE_SHEETS_SPREADSHEET_ID" .env.local
```

Expected: `6`. **Print only this count — never print the file or any value.** If it is lower, stop and tell the operator which names are absent (by name only); a missing Resend variable makes the dispatcher log `reseller.email_not_configured` and return a 500 to the applicant, and a missing Sheets variable makes the append fail silently as a logged warning.

- [ ] **Step 3: Submit one real application**

```bash
npm run dev
```

At `http://localhost:3000/sell`, submit with:
- Name: `Qualifying fields test - please ignore`
- Business name: `Qualifying fields test - please ignore`
- Email: an address you can read
- Status: `Already selling print-on-demand products`
- Channels: tick `Etsy` **and** `Own website` (two, to prove the join)
- Everything else: anything valid

Wait for the success panel before checking anything downstream.

- [ ] **Step 4: Check all four outputs**

1. **Internal notification** — arrives at the operator inbox, subject `New reseller application — Qualifying fields test - please ignore`, and the table shows `STATUS: Already selling print-on-demand products` and `SELLS ON: Etsy, Own website`.
2. **Applicant confirmation** — still arrives at the address entered, unchanged.
3. **Sheet row** — a new row where `I` is the status, `J` is `Etsy, Own website`, `K` is the products text, and `O` is the trace id. If the values sit two columns to the left, Step 1 was not completed — stop and fix the sheet.
4. **Turkish locale** — repeat the submission at `http://localhost:3000/tr/sell`, choosing the Turkish labels. The email and the Sheet must still show **English** canonical values. Turkish text in either output means the payload is sending display labels instead of values, which would break the enum on the next schema change.

Record what you actually observed for each of the four. Per the repo's verification rule: if you would write "this should work," show the output instead.

- [ ] **Step 5: Clean up**

Delete both test rows from the Sheet. The two notification emails can stay — they are harmless and they are the delivery evidence.

Stop the dev server.

- [ ] **Step 6: Report**

Summarise for the operator: the four outputs with what was observed for each, both locales, and anything that needed a second attempt. This text becomes the PR description's verification section.

---

## After the plan

Do **not** push or merge. Branch is `feature/reseller-qualifying-questions`, cut from `origin/main`. The operator opens or approves the PR and merges to `main`; merging to `main` is what deploys to production, and the Sheet columns must already be in place when it does.

## Rollback

Nothing in this change is destructive to code — `git revert` on the four commits restores the previous form. The Sheet is the exception: reverting the code while leaving the inserted columns in place makes new rows land in the old 13-column layout under the new headers, misaligned from column I. If the code is reverted, delete columns I and J from the sheet in the same window.
