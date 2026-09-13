/**
 * One structured-data block.
 *
 * Every JSON-LD payload on the site goes through here so the `<` escaping
 * (catalog text must never break out of the script tag) is written once.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}
