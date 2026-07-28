"use client";

import { Link } from "@/components/locale-link";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Send,
  Minus,
  Plus,
  Trash2,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { useQuote } from "@/components/quote-provider";
import { cn } from "@/lib/utils";
import { useDict } from "@/components/i18n-provider";
import {
  quoteFormSchema,
  quoteSchema,
  SHIP_MODELS,
  SALES_CHANNELS,
  MONTHLY_VOLUMES,
  type QuoteFormInput,
} from "@/lib/validation";

const FIELD = "h-11";
const SELECT =
  "h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-destructive">{msg}</p>;
}

export function QuoteRequest() {
  const dict = useDict();
  const t = dict.quoteForm;
  // Option values are the API enum; only their labels are translated.
  const optionLabel = (value: string) =>
    (t.options as Record<string, string>)[value] ?? value;
  const {
    items,
    count,
    totalQty,
    hydrated,
    updateQuantity,
    updateNote,
    removeItem,
    clear,
  } = useQuote();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormInput>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      website: "",
      channels: [],
      monthlyVolume: "",
      shipModel: undefined,
      deadline: "",
      artworkUrl: "",
      notes: "",
      consent: false,
      company: "",
    },
  });

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const onTurnstileVerify = useCallback(
    (token: string) => setTurnstileToken(token),
    [],
  );
  const onTurnstileExpire = useCallback(() => setTurnstileToken(null), []);

  async function onSubmit(values: QuoteFormInput) {
    const payload = {
      ...values,
      cfTurnstileToken: turnstileToken ?? undefined,
      items: items.map((i) => ({
        sku: i.sku,
        name: i.name,
        quantity: i.quantity,
        note: i.note ?? "",
      })),
    };

    const check = quoteSchema.safeParse(payload);
    if (!check.success) {
      toast.error(t.errorEmpty);
      return;
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(check.data),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? t.errorGeneric);
      }
      toast.success(t.success);
      reset();
      clear();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t.errorSubmit,
      );
    }
  }

  /* ------------------------------ loading ------------------------------ */
  if (!hydrated) {
    return (
      <div className="mt-10 grid min-h-[36vh] place-items-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  /* ------------------------------- empty ------------------------------- */
  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-3xl border border-dashed border-border bg-secondary/30 px-6 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-muted text-brand-strong">
          <FileText className="size-7" />
        </span>
        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {t.emptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t.emptyBodyBefore}{" "}
          <span className="font-medium text-foreground">
            {dict.quoteWidget.add}
          </span>{" "}
          {t.emptyBodyAfter}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/categories" className={cn(buttonVariants({ variant: "brand", size: "lg" }))}>
            {dict.about.ctaBrowse}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/sell"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {dict.header.applyToSell}
          </Link>
        </div>
      </div>
    );
  }

  /* ------------------------------- filled ------------------------------ */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("company")}
      />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* Line items */}
        <div>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {t.yourItems}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {count} {count === 1 ? t.lineOne : t.lineMany} · {totalQty}{" "}
                {totalQty === 1 ? t.unitOne : t.unitMany}
              </span>
            </h2>
            <button
              type="button"
              onClick={clear}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
            >
              {t.clearAll}
            </button>
          </div>

          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4">
                <Link
                  href={`/product/${item.id}`}
                  className="shrink-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    seed={item.sku}
                    width={120}
                    sizes="72px"
                    className="size-[72px] rounded-xl border border-border"
                    imgClassName="p-1.5"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.id}`}
                        className="line-clamp-2 text-sm font-medium text-foreground hover:text-brand-strong"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                        {item.sku}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={dict.quoteWidget.removeAria.replace("{name}", item.name)}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    {/* Quantity stepper */}
                    <div className="inline-flex items-center rounded-lg border border-border">
                      <button
                        type="button"
                        aria-label={t.decrease}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="grid size-8 place-items-center rounded-l-lg text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        aria-label={t.quantityFor.replace("{name}", item.name)}
                        className="h-8 w-12 border-x border-border bg-transparent text-center text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        aria-label={t.increase}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid size-8 place-items-center rounded-r-lg text-muted-foreground transition-colors hover:bg-muted"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.note ?? ""}
                      onChange={(e) => updateNote(item.id, e.target.value)}
                      placeholder={t.notePlaceholder}
                      maxLength={500}
                      className="h-8 min-w-0 flex-1 rounded-lg border border-border bg-transparent px-2.5 text-xs outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/categories"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-strong hover:underline"
          >
            <Plus className="size-4" />
            {t.addMore}
          </Link>
        </div>

        {/* Brief / contact */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-7">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {t.contactTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.requiredNote}
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="q-name">{t.fullName}</Label>
                <Input
                  id="q-name"
                  className={cn(FIELD, "mt-1.5")}
                  aria-invalid={!!errors.fullName}
                  {...register("fullName")}
                />
                <ErrorText msg={errors.fullName?.message} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="q-email">{t.email}</Label>
                  <Input
                    id="q-email"
                    type="email"
                    className={cn(FIELD, "mt-1.5")}
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  <ErrorText msg={errors.email?.message} />
                </div>
                <div>
                  <Label htmlFor="q-phone">{t.phone}</Label>
                  <Input
                    id="q-phone"
                    type="tel"
                    className={cn(FIELD, "mt-1.5")}
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="q-business">{t.businessName}</Label>
                  <Input
                    id="q-business"
                    className={cn(FIELD, "mt-1.5")}
                    {...register("businessName")}
                  />
                </div>
                <div>
                  <Label htmlFor="q-website">{t.website}</Label>
                  <Input
                    id="q-website"
                    placeholder="https://"
                    className={cn(FIELD, "mt-1.5")}
                    {...register("website")}
                  />
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-foreground">
                  {t.whereSell}
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SALES_CHANNELS.map((c) => (
                    <label
                      key={c}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-muted has-[:checked]:text-brand-strong"
                    >
                      <input
                        type="checkbox"
                        value={c}
                        className="size-3.5 rounded border-input accent-primary"
                        {...register("channels")}
                      />
                      {optionLabel(c)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="q-ship">{t.shipModel}</Label>
                  <select
                    id="q-ship"
                    className={cn(SELECT, "mt-1.5")}
                    defaultValue=""
                    aria-invalid={!!errors.shipModel}
                    {...register("shipModel")}
                  >
                    <option value="" disabled>
                      {t.selectPlaceholder}
                    </option>
                    {SHIP_MODELS.map((m) => (
                      <option key={m} value={m}>
                        {optionLabel(m)}
                      </option>
                    ))}
                  </select>
                  <ErrorText msg={errors.shipModel?.message} />
                </div>
                <div>
                  <Label htmlFor="q-volume">{t.monthlyVolume}</Label>
                  <select
                    id="q-volume"
                    className={cn(SELECT, "mt-1.5")}
                    defaultValue=""
                    {...register("monthlyVolume")}
                  >
                    <option value="">{t.notSureYet}</option>
                    {MONTHLY_VOLUMES.map((v) => (
                      <option key={v} value={v}>
                        {optionLabel(v)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="q-deadline">{t.deadline}</Label>
                  <Input
                    id="q-deadline"
                    placeholder={t.deadlinePlaceholder}
                    className={cn(FIELD, "mt-1.5")}
                    {...register("deadline")}
                  />
                </div>
                <div>
                  <Label htmlFor="q-artwork">{t.artwork}</Label>
                  <Input
                    id="q-artwork"
                    placeholder={t.artworkPlaceholder}
                    className={cn(FIELD, "mt-1.5")}
                    {...register("artworkUrl")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="q-notes">{t.notes}</Label>
                <Textarea
                  id="q-notes"
                  rows={3}
                  placeholder={t.notesPlaceholder}
                  className="mt-1.5"
                  {...register("notes")}
                />
              </div>

              <div>
                <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 rounded border-input accent-primary"
                    aria-invalid={!!errors.consent}
                    {...register("consent")}
                  />
                  <span>
                    {t.consentBefore}{" "}
                    <span className="text-foreground">FomaPrint</span>
                    {t.consentAfter}
                  </span>
                </label>
                <ErrorText msg={errors.consent?.message} />
              </div>

              <TurnstileWidget
                onVerify={onTurnstileVerify}
                onExpire={onTurnstileExpire}
                className="flex justify-center"
              />

              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {t.submit}
                  </>
                )}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-brand-strong" />
                {t.assurance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
