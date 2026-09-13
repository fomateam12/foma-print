# Reseller form: two lead-qualifying questions

Date: 2026-08-04
Status: Approved

## Summary

Two required fields are added to the reseller application form (`/sell`,
`SellerApplicationForm`) so an incoming application can be triaged at a
glance:

1. **`currentStatus`** — a single-select "maturity ladder": is this
   applicant already selling, or still researching?
2. **`salesChannels`** — a multi-select chip group: which marketplaces
   they sell on today (Etsy, Amazon, Shopify, …).

Both are required. The purpose is lead qualification, not personalisation:
the operator wants to separate serious applicants from tyre-kickers without
opening each email.

Scope is the reseller application form only. The quote form
(`QuoteRequest`) is deliberately left untouched — see
[Decision: a separate channel constant](#decision-a-separate-channel-constant).

### Non-goals

- No store-URL field. The existing optional `website` field stays as-is.
- No "how long have you been selling" field — it duplicates `currentStatus`.
- No scoring, sorting or automation on top of the new data. The operator
  reads the notification email and the Sheet by eye.

## 1. Fields

### `currentStatus` — single select, required

Label (en): **What best describes you today? \***

Canonical values, ordered hottest-to-coldest so the operator can read
priority off the order alone:

```ts
export const CURRENT_STATUSES = [
  "Already selling print-on-demand products",
  "Selling other products, want to add custom / engraved items",
  "Store is open but not selling yet",
  "Just getting started — no store yet",
  "Something else",
] as const;
```

`Something else` (rather than reusing the existing `Other`) keeps the
dictionary key distinct from the `Other` entry that `BUSINESS_TYPES`,
`HEAR_ABOUT_US` and `SALES_CHANNELS` already share — `sellerForm.options`
is a flat map keyed by the canonical string, so two different meanings
cannot share one key.

There is no free-text "other" companion input. `currentStatus` exists to
be scanned; a free-text escape hatch would defeat that, and the existing
`about` textarea already absorbs anything unusual.

### `salesChannels` — multi-select, at least one required

Label (en): **Where do you sell? \***

Rendered as the chip-checkbox group already used by the quote form
(`quote-request.tsx:360-380`) — a wrapped row of rounded labels using the
`has-[:checked]:` Tailwind variants. No new component.

```ts
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

`Not selling yet` is required for coherence: the field is mandatory with a
`min(1)` rule, so an applicant who sells nowhere would otherwise be forced
to tick a channel they do not use, corrupting the very data the field
exists to provide.

### Decision: a separate channel constant

`SALES_CHANNELS` already exists in `validation.ts` for the quote form and
holds the same 7 values minus `Not selling yet`. It is **not** reused or
extended.

Extending the shared constant would add a `Not selling yet` chip to the
quote form as well, and would require new entries in
`quoteForm.options` in both dictionaries — changing a form this work was
never asked to touch. A second constant costs one array literal and keeps
the blast radius to the reseller form.

Write `RESELLER_SALES_CHANNELS` as an explicit array literal rather than
`[...SALES_CHANNELS, "Not selling yet"] as const`; the spread form widens
to `string[]` under some TS configurations and would break `z.enum`.
Verify with `npx tsc --noEmit` (or `npm run build`) if the literal form is
changed.

## 2. Validation

Both fields go into the existing `resellerApplicationSchema` as required.

```ts
currentStatus: z.enum(CURRENT_STATUSES, {
  message: "Tell us where you are today.",
}),
salesChannels: z
  .array(z.enum(RESELLER_SALES_CHANNELS))
  .min(1, "Select at least one — or 'Not selling yet'.")
  .max(RESELLER_SALES_CHANNELS.length),
```

### Deliberate deviation from the "new fields must be optional" rule

The comment above `hearAboutUs` (`validation.ts:67-68`) states that a new
field must be optional so a submission from a cached, older version of the
form cannot fail validation. These two fields **break that rule on
purpose**.

Rationale: the site has received 15–20 reseller applications in total, the
most recent two days before this spec. The probability of a submission
landing from a stale tab inside a deploy window is negligible, and the
tolerant-server / strict-client schema split that would preserve the rule
costs roughly 20 lines and a second exported type for no practical gain.

The implementation must record this rationale in a comment next to the two
fields, so the inconsistency with the neighbouring `hearAboutUs` comment
reads as a decision rather than an oversight.

The API route (`src/app/api/reseller-application/route.ts`) is
schema-driven and needs **no change**.

## 3. Bilingual copy

Since 28 Jul 2026 no customer-facing string may be hardcoded in a
component. Labels live in `src/dictionaries/{en,tr}.json`; option values
stay canonical English and are translated for display only, via
`optionLabel(value) = t.options[value] ?? value`. A missing key falls back
to the English value rather than throwing, so a partial translation is
safe but still counts as unfinished work.

New keys under `sellerForm`:

| Key | en | tr |
| --- | --- | --- |
| `currentStatus` | What best describes you today? * | Şu an sizi en iyi hangisi tanımlıyor? * |
| `salesChannels` | Where do you sell? * | Nerede satış yapıyorsunuz? * |

New entries under `sellerForm.options` — 12 new keys in each dictionary.
A 13th, `Other`, is listed for completeness but already exists there; the
seven channel values are all new to `sellerForm.options` (they currently
live only under `quoteForm.options`, and the similar-looking
`Etsy or Amazon` key is a `HEAR_ABOUT_US` value, not a channel):

| Canonical value | tr |
| --- | --- |
| Already selling print-on-demand products | Halihazırda print-on-demand ürün satıyorum |
| Selling other products, want to add custom / engraved items | Başka ürünler satıyorum, kişiye özel / lazer işlemeli ürün eklemek istiyorum |
| Store is open but not selling yet | Mağazam açık ama henüz satış yok |
| Just getting started — no store yet | Yeni başlıyorum — henüz mağazam yok |
| Something else | Başka bir durum |
| Etsy | Etsy |
| Shopify | Shopify |
| Amazon | Amazon |
| eBay | eBay |
| Own website | Kendi web sitem |
| In person / retail | Yüz yüze / perakende |
| Not selling yet | Henüz satış yapmıyorum |
| Other | *(already present — "Diğer")* |

Zod validation messages stay hardcoded English, matching every existing
message in `validation.ts`. Translating them is a pre-existing gap across
the whole file and is out of scope here.

## 4. Form placement

Both fields sit between the `businessType` / `monthlyVolume` row and the
`products` input:

```
Your name          | Business name
Email              | Phone
Website or social (optional)
Business type      | Estimated monthly volume
What best describes you today?          <- new, full width
Where do you sell?                      <- new, full width, chips
Which products are you interested in?
Tell us about your business
How did you hear about us?
[consent] [turnstile] [submit]
```

`defaultValues` gains `currentStatus: undefined` and `salesChannels: []`,
matching how `businessType` and the quote form's `channels` are declared.

## 5. Notification email

`src/lib/reseller-email.ts` — two rows in the internal notification table,
placed directly after `Monthly volume` so the qualifying answers read as a
block:

```ts
${row("Status", data.currentStatus)}
${row("Sells on", data.salesChannels?.join(", "))}
```

`row()` returns an empty string for an empty value, so a submission that
predates this change (or somehow omits the fields) renders without a blank
row. The applicant confirmation email is unchanged.

## 6. Google Sheet

`src/lib/google-sheets.ts` — two values in the appended row and a widened
range: **`A:M` → `A:O`**.

The array is currently 13 elements against a 13-column range; adding
elements without widening the range would silently truncate them.

> **Amended 2026-08-06.** This section originally placed the two new values
> after `monthlyVolume`, which required a manual column insert in the sheet.
> That shipped in PR #62 and was reversed in a follow-up: the operator does
> not work from the sheet (the notification email carries everything), so
> the manual step was not worth its cost or its failure mode. The values are
> now **appended after `traceId`**. Columns A–M keep the exact meaning they
> had before this change, historical rows stay readable, and no manual sheet
> work is needed — older rows simply have N and O empty. New fields should
> keep going on the end for the same reason. The subsection below is kept
> for the record; **it no longer describes the code.**

The row is:

```
A submittedAt   B name        C businessName  D email     E phone
F website       G businessType  H monthlyVolume  I products
J hearAboutUs   K hearAboutUsOther  L about   M traceId
N currentStatus   O salesChannels      <- new, appended at the end
```

### Original placement (superseded)

The two new values were inserted **after `monthlyVolume`**, making the row:

```
A submittedAt   B name        C businessName  D email     E phone
F website       G businessType  H monthlyVolume
I currentStatus   J salesChannels        <- new
K products      L hearAboutUs  M hearAboutUsOther  N about  O traceId
```

`salesChannels` is written as a comma-joined string (`join(", ")`), since a
cell holds one value.

### Required manual step — no longer applicable (superseded)

Inserting columns mid-row shifts the meaning of every column to their
right. The existing ~20 rows must shift to match, which Google Sheets does
automatically when columns are inserted **in the sheet**:

1. Open the "Reseller Applications" tab.
2. Right-click column **I** → *Insert 2 columns left*.
   Existing rows shift right and stay aligned; their new I/J cells are blank.
3. Put `Current status` in `I1` and `Sells on` in `J1`.

**Order matters, and neither order is perfectly safe.** A Sheets column
insert shifts *every* row, including rows the new code has already written
correctly. So:

- Insert the columns **first**, then deploy right after. Do not deploy
  first and insert later — that would shift the new-format rows and break
  the rows the change was meant to produce.
- An application arriving in the window between the insert and the deploy
  is written by the *old* code, which emits 13 values: its `products` value
  lands in the new `Current status` column and everything after it sits one
  pair of columns to the left. Fix that single row by hand.

At 15–20 applications total, that window is very unlikely to catch
anything; the point is to know what it would look like, not to engineer
around it.

The append uses `valueInputOption=RAW`, so no new formula-injection
surface is introduced by either field. Both are enum-constrained anyway.

## 7. Verification

This repository has no test suite. Verification is:

1. `npm run lint` — must stay at the known baseline (0 errors; the
   pre-existing react-hooks warnings, one of which is in
   `seller-application-form.tsx`, must not increase).
2. `npm run build` — must pass.
3. Manual submission through the running dev server against the real
   Resend + Sheets configuration, checking all four outputs:
   - form rejects submit with neither new field answered,
   - internal notification email shows both new rows,
   - applicant confirmation still arrives,
   - the Sheet row lands with I/J populated and nothing shifted.
4. The same submission repeated on `/tr` to confirm the Turkish labels
   render and the stored values are still canonical English.

A real submission reaches the live operator inbox and the live Sheet.
Name the test application clearly (e.g. `Qualifying fields test - please
ignore`) and delete the Sheet row afterwards.

## 8. Files touched

| File | Change |
| --- | --- |
| `src/lib/validation.ts` | `CURRENT_STATUSES`, `RESELLER_SALES_CHANNELS`, two schema fields + rationale comment |
| `src/components/seller-application-form.tsx` | Select + chip group, two `defaultValues` |
| `src/dictionaries/en.json` | 2 labels + 12 option entries under `sellerForm` |
| `src/dictionaries/tr.json` | Same keys, Turkish values |
| `src/lib/reseller-email.ts` | Two `row()` calls in the internal template |
| `src/lib/google-sheets.ts` | Two row values, range `A:M` → `A:O` |
| `src/app/api/reseller-application/route.ts` | **No change** — schema-driven |
