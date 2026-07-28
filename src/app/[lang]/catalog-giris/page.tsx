import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Unlock page for the shared-password /catalog gate (see src/lib/catalog-gate.ts
 * and middleware.ts). Unlisted and noindexed like the catalog itself.
 */

export const metadata: Metadata = {
  title: "Partner Catalog Access",
  description: `Enter the partner access code to view the ${site.name} wholesale catalog.`,
  robots: { index: false, follow: false },
};

export default async function CatalogUnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; err?: string }>;
}) {
  const params = await searchParams;
  const next = params.next?.startsWith("/catalog") ? params.next : "/catalog";
  const failed = params.err === "1";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Partner Catalog</h1>
            <p className="text-sm text-muted-foreground">Wholesale pricing — partners only</p>
          </div>
        </div>

        <form method="POST" action="/api/catalog-unlock" className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Access code
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
              <p className="mt-2 text-sm text-red-600">Incorrect access code. Please try again.</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            View catalog
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground">
          Don&apos;t have a code? Contact us via the reseller application on {site.name}.
        </p>
      </div>
    </div>
  );
}
