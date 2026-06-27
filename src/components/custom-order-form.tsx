"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { customOrderSchema, type CustomOrderInput } from "@/lib/validation";

const FIELD = "h-11";
const SELECT =
  "h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-destructive">{msg}</p>;
}

export function CustomOrderForm({
  defaultProduct = "",
  categories,
}: {
  defaultProduct?: string;
  categories: string[];
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomOrderInput>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      product: defaultProduct,
      category: "",
      quantity: 1,
      personalization: "",
      deadline: "",
      budget: "",
      details: "",
      consent: false,
      company: "",
    },
  });

  async function onSubmit(values: CustomOrderInput) {
    try {
      const res = await fetch("/api/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      toast.success("Request sent! We'll reply within one business day.");
      reset({
        fullName: "",
        email: "",
        phone: "",
        product: "",
        category: "",
        quantity: 1,
        personalization: "",
        deadline: "",
        budget: "",
        details: "",
        consent: false,
        company: "",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't send your request.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("company")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="co-name">Full name *</Label>
          <Input
            id="co-name"
            className={cn(FIELD, "mt-1.5")}
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          <ErrorText msg={errors.fullName?.message} />
        </div>
        <div>
          <Label htmlFor="co-email">Email *</Label>
          <Input
            id="co-email"
            type="email"
            className={cn(FIELD, "mt-1.5")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <ErrorText msg={errors.email?.message} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="co-phone">Phone</Label>
          <Input
            id="co-phone"
            type="tel"
            className={cn(FIELD, "mt-1.5")}
            {...register("phone")}
          />
        </div>
        <div>
          <Label htmlFor="co-category">Category</Label>
          <select
            id="co-category"
            className={cn(SELECT, "mt-1.5")}
            defaultValue=""
            {...register("category")}
          >
            <option value="">Not sure / other</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
        <div>
          <Label htmlFor="co-product">Product or SKU</Label>
          <Input
            id="co-product"
            placeholder="e.g. LTM7201 or a product name"
            className={cn(FIELD, "mt-1.5")}
            {...register("product")}
          />
        </div>
        <div>
          <Label htmlFor="co-qty">Quantity *</Label>
          <Input
            id="co-qty"
            type="number"
            min={1}
            className={cn(FIELD, "mt-1.5")}
            aria-invalid={!!errors.quantity}
            {...register("quantity", { valueAsNumber: true })}
          />
          <ErrorText msg={errors.quantity?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="co-personalization">What should we engrave? *</Label>
        <Textarea
          id="co-personalization"
          rows={3}
          placeholder="Names, dates, monogram, logo, or a short message…"
          className="mt-1.5"
          aria-invalid={!!errors.personalization}
          {...register("personalization")}
        />
        <ErrorText msg={errors.personalization?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="co-deadline">Need it by</Label>
          <Input
            id="co-deadline"
            placeholder="e.g. June 15, or ASAP"
            className={cn(FIELD, "mt-1.5")}
            {...register("deadline")}
          />
        </div>
        <div>
          <Label htmlFor="co-budget">Budget (optional)</Label>
          <Input
            id="co-budget"
            placeholder="e.g. $200"
            className={cn(FIELD, "mt-1.5")}
            {...register("budget")}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="co-details">Anything else?</Label>
        <Textarea
          id="co-details"
          rows={3}
          placeholder="Colors, fonts, artwork details, shipping address, etc."
          className="mt-1.5"
          {...register("details")}
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
            I agree to be contacted about my order by {""}
            <span className="text-foreground">FomaPrint</span>. *
          </span>
        </label>
        <ErrorText msg={errors.consent?.message} />
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send custom order request
          </>
        )}
      </Button>
    </form>
  );
}
