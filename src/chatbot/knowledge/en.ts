import "server-only";

/**
 * FomaBot's entire knowledge. ONLY information a logged-out visitor can
 * already see on fomaprint.com, or that the operator approved as public.
 * Never add: store/customer names, suppliers, costs, prices, volumes, bank
 * details, team names, internal tools, admin URLs, credentials.
 * `npm run chat:check` and the runtime check in config.ts enforce the
 * denylist; this comment is for the humans editing it.
 */
export const KNOWLEDGE_EN = `
# FomaPrint

FomaPrint is a white-label print-on-demand and laser-engraving production partner in the USA. Resellers sell under their own brand; FomaPrint personalizes, produces, quality-checks and blind-ships each order to the reseller's customer.

## Products
- 1,250+ laser-engravable products: drinkware (tumblers, water bottles, mugs, glasses), gifts, frames, leather goods, office goods and more.
- Browse the catalog at fomaprint.com/categories. Each product page shows dimensions, weight, engraving area and downloadable product photos.

## How it works
1. Apply at fomaprint.com/sell. We review and reply the same business day with tiered reseller pricing.
2. We create your seller portal account. You only see your own orders.
3. Load a prepaid balance (wallet). Every order draws from it. No subscription, no monthly fee.
4. Enter the order in the seller portal and upload the artwork.
5. We print, quality-check and package.
6. We ship under your brand. The sender name is your brand; the return address is our US print center. Tracking comes back to you with the order.

## Shipping and turnaround
- Orders placed before 2pm ET are printed and shipped the same day from our US print center. Transit time is additional.
- Packages are blind: no FomaPrint branding, invoices, pricing or inserts.
- If we misprint, mis-engrave or send the wrong item, we remake and reship free. Report it within 30 days with a photo; no return needed. Carrier loss or damage is a carrier claim.

## Pricing
- Pricing is wholesale and quote-based; it is not listed publicly. Rates depend on product, personalization, quantity and options, and are sent after you apply.
- Engraving can add position fees per engraved side; the amounts are in your pricing.
- No minimum order. Start with one unit; bulk orders unlock deeper tiers.
- For a bulk or custom order, add products to a quote at fomaprint.com/quote.

## Artwork
- Upload engraving artwork as vector SVG or DXF in the seller portal: black artwork on a transparent background, sized inside the product's engraving area. Artwork cannot extend outside the engraving area.
- Options per item: one side, two sides (different front and back), or double (the same design on both sides).
- Files are produced exactly as submitted, so spelling, names and sizing are the reseller's responsibility. All orders are final once submitted.
- A full per-product spec sheet comes with the reseller welcome pack.

## Seller portal
- One dashboard for all orders and their status (new, waiting for design, processing, shipped), plus express and redo orders.
- Direct messaging and file sharing with the print center, instead of email or chat apps.
- Wallet with every charge listed per order.
- Profit calculator, engraving size list, shipping box sizes, the reseller agreement and a built-in user guide.
- Coming soon (no dates yet): automatic order import from marketplaces and automatic wallet top-up.

## Marketplaces
- Many resellers sell on Amazon, Etsy and Shopify and route those orders to FomaPrint. The listing, storefront and customer stay the reseller's.

## Contact
- Email info@fomaprint.com. The team replies the same business day.
- FomaBot cannot look up orders, accounts or payments; those questions go to info@fomaprint.com.
`.trim();
