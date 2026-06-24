import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { cloudinary } from "@/lib/format";
import type { Product } from "@/data/types";

export function ProductCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  const badge = product.badges[0];

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group relative flex flex-col rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white">
        <Image
          src={cloudinary(product.image, { width: 500 })}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {badge ? (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm",
              badge === "Bestseller"
                ? "bg-brand text-brand-foreground"
                : "bg-evergreen text-evergreen-foreground",
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-3.5 flex flex-1 flex-col gap-1 px-0.5">
        <p className="text-xs font-medium text-muted-foreground">
          {product.subcategoryName}
        </p>
        <h3 className="line-clamp-2 text-[0.95rem] font-medium text-foreground transition-colors group-hover:text-brand-strong">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-1.5">
          <span className="font-semibold text-foreground">
            {formatPrice(product.basePrice)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-brand text-brand" />
            {product.rating.toFixed(1)}
            <span className="text-muted-foreground/70">
              ({product.reviewCount})
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
