"use client";

import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { X, ArrowRight } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { AddToQuoteButton } from "@/components/add-to-quote-button";
import { cloudinary } from "@/lib/format";
import type { Product } from "@/data/types";

/**
 * Quick-view modal: gallery + summary + add-to-quote without leaving the
 * listing page. Trigger lives on ProductCard ("Eye / Quick view" pill).
 * Falls back to the supplier image when the SKU has no curated gallery.
 */
export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [cloudinary(product.imageFull, { width: 900 })];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-[open]:opacity-100 data-[closed]:opacity-0"
        />
        <Dialog.Popup
          className="fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100vh-2rem)] w-[min(100vw-2rem,960px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-background shadow-2xl outline-none transition data-[open]:opacity-100 data-[open]:scale-100 data-[closed]:opacity-0 data-[closed]:scale-95 lg:grid-cols-[5fr_4fr]"
        >
          <Dialog.Close
            aria-label="Close quick view"
            className="absolute right-4 top-4 z-10 rounded-full bg-background/85 p-2 text-muted-foreground shadow-sm backdrop-blur transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </Dialog.Close>

          <div className="p-5 sm:p-7 lg:p-8 lg:pr-4">
            <ProductGallery images={images} alt={product.name} />
          </div>

          <div className="flex flex-col gap-3 p-5 pt-0 sm:p-7 sm:pt-0 lg:p-8 lg:pl-2 lg:pr-12 lg:pt-8">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.subcategoryName}
            </p>
            <Dialog.Title className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {product.name}
            </Dialog.Title>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-mono uppercase tracking-wide">
                SKU: {product.sku}
              </span>
              {product.size ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{product.size}</span>
                </>
              ) : null}
            </div>

            <Dialog.Description className="line-clamp-5 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </Dialog.Description>

            <div className="mt-auto flex flex-col gap-2 pt-4">
              <AddToQuoteButton
                item={{
                  id: product.id,
                  sku: product.sku,
                  name: product.name,
                  image: product.image,
                }}
                variant="full"
                className="w-full"
              />
              <Link
                href={`/product/${product.id}`}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium text-brand-strong transition-colors hover:text-foreground"
              >
                View full details
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
