import { Check } from "lucide-react";
import type { EditorialCopy } from "@/data/category-editorial";

/**
 * The prose block on a category or collection page: what the material is, what
 * the engraving looks like, who buys it, and the questions buyers ask.
 *
 * Rendered below the product grid so the tiles stay the first thing a human
 * sees, while the crawler still gets real text on the page.
 */
export function CategoryEditorial({
  copy,
  name,
  headings,
}: {
  copy: EditorialCopy;
  name: string;
  headings: {
    aboutHeading: string;
    highlightsHeading: string;
    faqHeading: string;
  };
}) {
  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <h2 className="text-h2 text-foreground">
            {headings.aboutHeading.replace("{category}", name)}
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            {copy.intro.map((para, i) => (
              <p key={i} className="max-w-prose leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {copy.faqs.length > 0 ? (
            <>
              <h2 className="mt-12 font-heading text-xl font-semibold text-foreground">
                {headings.faqHeading.replace("{category}", name)}
              </h2>
              <dl className="mt-6 space-y-6">
                {copy.faqs.map((faq) => (
                  <div key={faq.q}>
                    <dt className="font-heading text-base font-semibold text-foreground">
                      {faq.q}
                    </dt>
                    <dd className="mt-1.5 max-w-prose leading-relaxed text-muted-foreground">
                      {faq.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}
        </div>

        {copy.highlights.length > 0 ? (
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-heading text-sm font-semibold text-foreground">
              {headings.highlightsHeading}
            </h2>
            <ul className="mt-4 space-y-3">
              {copy.highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-strong" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
