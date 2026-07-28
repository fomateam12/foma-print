import type { ReactNode } from "react";

/**
 * Shared shell for the legal pages (Privacy, Terms).
 *
 * The prose lives in the dictionary as flat numbered keys rather than in JSX,
 * so the Turkish version is a translation of the same document instead of a
 * separate page that can drift. `notice` carries the "the English version
 * prevails" line that only the translated locales render.
 */
export function LegalDocument({
  title,
  updatedLabel,
  notice,
  children,
}: {
  title: string;
  updatedLabel: string;
  notice?: string;
  children: ReactNode;
}) {
  return (
    <article className="mt-6 max-w-3xl">
      <h1 className="text-h2 text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{updatedLabel}</p>
      {notice ? (
        <p className="mt-4 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          {notice}
        </p>
      ) : null}
      <div className="mt-8 space-y-8 text-[0.95rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </article>
  );
}

export function LegalSection({
  heading,
  paragraphs = [],
  bullets = [],
  children,
}: {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  children?: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl font-semibold text-foreground">
        {heading}
      </h2>
      {paragraphs.map((text) => (
        <p key={text} className="mt-3">
          {text}
        </p>
      ))}
      {bullets.length > 0 ? (
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {bullets.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      ) : null}
      {children}
    </section>
  );
}
