# Engrave colour pipeline

What colour does the engraved area turn after lasering? It is a property of
**material + coating**, never a customer choice: black powder-coat reveals
silver steel, white powder-coat reads grey, "Ghost Black" coats reveal black,
black/gold leatherette reveals gold, wood burns brown, glass frosts.

Output consumed by the site: `src/data/engraving-colors.json` (per SKU) and
`src/data/engraving-color-groups.json` (per material x colour group).
`catalog.ts#enrich` attaches `engraveColor / engraveTone / engraveFrost /
engraveOpacity` to each product; the product page shows them as an info chip.

## Method (measured, not guessed)

1. `groups.py` – live SKUs -> (family, colour) from the JDS master CSV
   (`MATERIAL`, `COLOR`; leatherette core parsed from the product name because
   JDS's COLOR hides Black/Gold vs Black/Silver).
2. `download_pairs.py` – for every live SKU with a decorated + `_BLANK` photo
   pair on R2 (644 pairs), download both.
3. `measure.py` – per pair: Lab delta-E between decorated and blank, mask the
   engraved pixels (dE > 14, top 60 % strongest), take the median colour.
   Pairs whose blank is a different shot (`frac > 0.40`) are rejected.
4. `aggregate.py` – group medians + spread. `assign.py` – final per-SKU value:
   SKU measurement > group median > family rule. Glass measured separately
   (frost tint over white, `measured-glass.json`; opacity provisional 0.55
   until a workshop photo on a black card is taken). `qasheet.py` – contact
   sheets for human review.

Scripts expect a work dir with `img/`, `jds-master.csv`; edit `REPO`/paths at
the top. Re-run when SKUs are added — a SKU missing from the JSON simply gets
no chip.

Source photos are the supplier's studio shots, so the numbers are "as
photographed"; workshop validation with real engraved samples is the second
gate (see project memory `kazima-rengi-cetveli`).
