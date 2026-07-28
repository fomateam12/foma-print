import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { site } from "@/lib/site";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, localizedPath, stripLocale } from "@/lib/i18n";

/**
 * Unlock page for the shared-password /catalog gate (see src/lib/catalog-gate.ts
 * and proxy.ts). Unlisted and noindexed like the catalog itself.
 */

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/catalog-giris">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).catalogGate;

  return {
    title: t.metaTitle,
    description: t.metaDescription.replace("{brand}", site.name),
    robots: { index: false, follow: false },
  };
}

export default async function CatalogUnlockPage({
  params,
  searchParams,
}: PageProps<"/[lang]/catalog-giris">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.catalogGate;

  const sp = await searchParams;
  // `next` arrives locale-prefixed (/tr/catalog/…), so validate the bare path
  // and hand back a path in the locale the visitor is actually browsing.
  const requested = typeof sp.next === "string" ? sp.next : "";
  const bare = stripLocale(requested);
  const next = localizedPath(bare.startsWith("/catalog") ? bare : "/catalog", lang);
  const failed = sp.err === "1";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-lg font-semibold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <form method="POST" action="/api/catalog-unlock" className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              {t.accessCode}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {failed && (
              <p className="mt-2 text-sm text-red-600">{t.wrongCode}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            {t.submit}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground">
          {t.noCode.replace("{brand}", site.name)}
        </p>
      </div>
    </div>
  );
}
