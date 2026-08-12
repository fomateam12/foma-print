"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle2, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  TurnstileWidget,
  TURNSTILE_ENABLED,
} from "@/components/turnstile-widget";
import { PhoneInput } from "@/components/phone-input";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { useDict } from "@/components/i18n-provider";
import {
  resellerApplicationSchema,
  BUSINESS_TYPES,
  MONTHLY_VOLUMES,
  HEAR_ABOUT_US,
  CURRENT_STATUSES,
  RESELLER_SALES_CHANNELS,
  type ResellerApplicationInput,
} from "@/lib/validation";
import { PHONE_COUNTRIES, DEFAULT_PHONE_COUNTRY } from "@/data/phone-countries";

const FIELD = "h-11";
const SELECT =
  "h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-destructive">{msg}</p>;
}

/**
 * Where the bot challenge stands. `pending` is the ordinary opening state:
 * the widget is loading or the visitor has not cleared it yet. `unavailable`
 * means no token is coming — see the fallback notice below.
 */
type TurnstileState = "pending" | "ready" | "unavailable";

/** Mail clients truncate very long URLs; keep the draft well inside that. */
const MAILTO_MAX = 1500;

/**
 * The application as an email draft, for visitors whose browser cannot run
 * the Cloudflare challenge. Field labels stay English because this lands in
 * the same mailbox as the automated notification and is read alongside it.
 */
function fallbackMailto(
  values: ResellerApplicationInput,
  phone: string,
  subject: string,
): string {
  const lines = [
    ["Name", values.name],
    ["Business", values.businessName],
    ["Email", values.email],
    ["Phone", phone],
    ["Website", values.website],
    ["Business type", values.businessType],
    ["Monthly volume", values.monthlyVolume],
    ["Current status", values.currentStatus],
    ["Sells on", (values.salesChannels ?? []).join(", ")],
    ["Products", values.products],
    ["About", values.about],
  ]
    .filter(([, value]) => typeof value === "string" && value.trim() !== "")
    .map(([label, value]) => `${label}: ${String(value).trim()}`)
    .join("\n");

  const body = lines.slice(0, MAILTO_MAX);
  const title = values.businessName?.trim()
    ? `${subject} — ${values.businessName.trim()}`
    : subject;

  return `mailto:${site.email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function SellerApplicationForm() {
  // Time the form has been on screen — sent to the handler as a cheap bot gate.
  // Set in an effect (not during render) so it stays out of the render path.
  const dict = useDict();
  const t = dict.sellerForm;
  // Option values are the API enum; only their labels are translated.
  const optionLabel = (value: string) =>
    (t.options as Record<string, string>)[value] ?? value;
  const mountedAt = useRef<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [phoneCountryIso2, setPhoneCountryIso2] = useState<string>(
    DEFAULT_PHONE_COUNTRY.iso2,
  );

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ResellerApplicationInput>({
    resolver: zodResolver(resellerApplicationSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      phone: "",
      website: "",
      businessType: undefined,
      monthlyVolume: undefined,
      currentStatus: undefined,
      salesChannels: [],
      products: "",
      about: "",
      hearAboutUs: undefined,
      hearAboutUsOther: "",
      consent: false,
      fax: "",
    },
  });

  const hearAboutUs = watch("hearAboutUs");

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileState, setTurnstileState] = useState<TurnstileState>(
    TURNSTILE_ENABLED ? "pending" : "ready",
  );
  const onTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    // A late token overrides an earlier "unavailable": the challenge came
    // through after all, so put the normal path back.
    setTurnstileState("ready");
  }, []);
  // Expiry is routine — the widget refreshes itself. Drop the stale token
  // but leave the state alone, or every five idle minutes would look broken.
  const onTurnstileExpire = useCallback(() => setTurnstileToken(null), []);
  const onTurnstileUnavailable = useCallback(
    () => setTurnstileState("unavailable"),
    [],
  );

  const phoneWithDialCode = (raw: string) => {
    const country =
      PHONE_COUNTRIES.find((c) => c.iso2 === phoneCountryIso2) ??
      DEFAULT_PHONE_COUNTRY;
    return `+${country.dialCode} ${raw}`.trim();
  };

  async function onSubmit(values: ResellerApplicationInput) {
    setSubmitError(null);
    const started = mountedAt.current;
    const elapsedMs = started > 0 ? Date.now() - started : undefined;
    const phone = phoneWithDialCode(values.phone);
    try {
      const res = await fetch("/api/reseller-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          phone,
          elapsedMs,
          cfTurnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      // 403 is the challenge gate and nothing else. Telling someone to
      // "reload and try again" when their browser cannot reach Cloudflare
      // sends them round the same loop, so show the way out instead.
      if (res.status === 403) {
        setTurnstileState("unavailable");
        return;
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? t.errorGeneric);
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : t.errorSubmit,
      );
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-brand-muted text-brand-strong">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
          {t.receivedTitle}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t.receivedBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="space-y-5"
      noValidate
    >
      {/* Honeypot — hidden from people, tempting to bots. Must stay empty. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("fax")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="se-name">{t.fullName}</Label>
          <Input
            id="se-name"
            className={cn(FIELD, "mt-1.5")}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <ErrorText msg={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="se-business">{t.businessName}</Label>
          <Input
            id="se-business"
            className={cn(FIELD, "mt-1.5")}
            aria-invalid={!!errors.businessName}
            {...register("businessName")}
          />
          <ErrorText msg={errors.businessName?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="se-email">{t.email}</Label>
          <Input
            id="se-email"
            type="email"
            className={cn(FIELD, "mt-1.5")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <ErrorText msg={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="se-phone">{t.phone}</Label>
          <PhoneInput
            id="se-phone"
            className="mt-1.5"
            countryIso2={phoneCountryIso2}
            onCountryChange={setPhoneCountryIso2}
            countryLabel={t.phoneCountryCode}
            numberInputProps={register("phone")}
            ariaInvalid={!!errors.phone}
          />
          <ErrorText msg={errors.phone?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="se-website">{t.website}</Label>
        <Input
          id="se-website"
          placeholder="https://"
          className={cn(FIELD, "mt-1.5")}
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="se-type">{t.businessType}</Label>
          <select
            id="se-type"
            className={cn(SELECT, "mt-1.5")}
            defaultValue=""
            aria-invalid={!!errors.businessType}
            {...register("businessType")}
          >
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {optionLabel(bt)}
              </option>
            ))}
          </select>
          <ErrorText msg={errors.businessType?.message} />
        </div>
        <div>
          <Label htmlFor="se-volume">{t.monthlyVolume}</Label>
          <select
            id="se-volume"
            className={cn(SELECT, "mt-1.5")}
            defaultValue=""
            aria-invalid={!!errors.monthlyVolume}
            {...register("monthlyVolume")}
          >
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {MONTHLY_VOLUMES.map((v) => (
              <option key={v} value={v}>
                {optionLabel(v)}
              </option>
            ))}
          </select>
          <ErrorText msg={errors.monthlyVolume?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="se-status">{t.currentStatus}</Label>
        <select
          id="se-status"
          className={cn(SELECT, "mt-1.5")}
          defaultValue=""
          aria-invalid={!!errors.currentStatus}
          {...register("currentStatus")}
        >
          <option value="" disabled>
            {t.selectPlaceholder}
          </option>
          {CURRENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {optionLabel(s)}
            </option>
          ))}
        </select>
        <ErrorText msg={errors.currentStatus?.message} />
      </div>

      <div>
        {/* A <span>, not <Label htmlFor>: this heading covers eight
            checkboxes, and a label can only point at one — clicking it
            would silently toggle whichever chip it named. */}
        <span className="text-sm font-medium text-foreground">
          {t.salesChannels}
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {RESELLER_SALES_CHANNELS.map((c) => (
            <label
              key={c}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-muted has-[:checked]:text-brand-strong"
            >
              <input
                type="checkbox"
                value={c}
                className="size-3.5 rounded border-input accent-primary"
                {...register("salesChannels")}
              />
              {optionLabel(c)}
            </label>
          ))}
        </div>
        <ErrorText msg={errors.salesChannels?.message} />
      </div>

      <div>
        <Label htmlFor="se-interest">{t.products}</Label>
        <Input
          id="se-interest"
          placeholder={t.productsPlaceholder}
          className={cn(FIELD, "mt-1.5")}
          aria-invalid={!!errors.products}
          {...register("products")}
        />
        <ErrorText msg={errors.products?.message} />
      </div>

      <div>
        <Label htmlFor="se-message">{t.about}</Label>
        <Textarea
          id="se-message"
          rows={4}
          placeholder={t.aboutPlaceholder}
          className="mt-1.5"
          {...register("about")}
        />
      </div>

      <div>
        <Label htmlFor="se-hear">{t.hearAboutUs}</Label>
        <select
          id="se-hear"
          className={cn(SELECT, "mt-1.5")}
          defaultValue=""
          aria-invalid={!!errors.hearAboutUs}
          {...register("hearAboutUs")}
        >
          <option value="" disabled>
            {t.selectPlaceholder}
          </option>
          {HEAR_ABOUT_US.map((h) => (
            <option key={h} value={h}>
              {optionLabel(h)}
            </option>
          ))}
        </select>
        <ErrorText msg={errors.hearAboutUs?.message} />
        {hearAboutUs === "Other" ? (
          <Input
            placeholder={t.hearOtherPlaceholder}
            className={cn(FIELD, "mt-2")}
            aria-label={t.hearOtherAria}
            {...register("hearAboutUsOther")}
          />
        ) : null}
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
        onUnavailable={onTurnstileUnavailable}
        className="flex justify-start"
      />

      {turnstileState === "unavailable" ? (
        <div
          role="alert"
          className="rounded-lg border border-border bg-muted/40 px-3.5 py-3 text-sm"
        >
          <p className="flex items-center gap-2 font-medium text-foreground">
            <ShieldAlert className="size-4 shrink-0" />
            {t.verifyUnavailableTitle}
          </p>
          <p className="mt-1.5 leading-relaxed text-muted-foreground">
            {t.verifyUnavailableBody}{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-brand-strong underline underline-offset-2"
              onClick={(event) => {
                // Fill the draft at click time, not at render: the visitor
                // keeps typing after this notice appears, and the mail
                // client should get whatever is on screen when they leave.
                // Rewriting href here rather than navigating by hand keeps
                // copy-link and middle-click working on the bare address.
                const values = getValues();
                event.currentTarget.href = fallbackMailto(
                  values,
                  phoneWithDialCode(values.phone),
                  t.verifyMailSubject,
                );
              }}
            >
              {site.email}
            </a>
          </p>
        </div>
      ) : null}

      {submitError ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive"
        >
          {submitError}
        </p>
      ) : null}

      {/* Disabled only while the challenge is still resolving. Once it is
          declared unavailable the button comes back: a late token may yet
          arrive, and a permanently dead button is the very trap this
          change exists to remove. */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || turnstileState === "pending"}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t.submitting}
          </>
        ) : turnstileState === "pending" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t.verifying}
          </>
        ) : (
          <>
            <Send className="size-4" />
            {t.submit}
          </>
        )}
      </Button>
    </form>
  );
}
