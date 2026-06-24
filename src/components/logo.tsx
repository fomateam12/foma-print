import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="FomaPrint — home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground shadow-sm ring-1 ring-brand/30 transition-transform group-hover:-rotate-3"
      >
        F
      </span>
      <span className="font-heading text-xl font-bold tracking-tight text-foreground">
        Foma<span className="text-brand-strong">Print</span>
      </span>
    </Link>
  );
}
