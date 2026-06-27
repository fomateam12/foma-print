import { Resend } from "resend";
import { site } from "@/lib/site";
import type { CustomOrderInput, SellerApplicationInput } from "@/lib/validation";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "FomaPrint <onboarding@resend.dev>";
const TO = process.env.EMAIL_TO ?? site.email;

const resend = apiKey ? new Resend(apiKey) : null;

export interface SendResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value?: string | number | null): string {
  if (value === undefined || value === null || value === "") return "";
  return `<tr><td style="padding:6px 12px;color:#6b6257;font-size:13px;vertical-align:top;white-space:nowrap">${esc(
    label,
  )}</td><td style="padding:6px 12px;color:#2a2620;font-size:14px">${esc(
    String(value),
  )}</td></tr>`;
}

function shell(title: string, inner: string): string {
  return `<div style="background:#f6f3ee;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e7e1d8;border-radius:14px;overflow:hidden">
    <div style="background:#2a2620;padding:18px 24px">
      <span style="color:#fff;font-size:18px;font-weight:700">Foma<span style="color:#caa45a">Print</span></span>
    </div>
    <div style="padding:24px">
      <h1 style="margin:0 0 12px;font-size:18px;color:#2a2620">${esc(title)}</h1>
      ${inner}
    </div>
    <div style="padding:16px 24px;border-top:1px solid #e7e1d8;color:#8a8175;font-size:12px">
      ${esc(site.legalName)} · ${esc(site.email)} · ${esc(site.phoneDisplay)}
    </div>
  </div>
</div>`;
}

async function send(args: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping email "${args.subject}" to ${args.to}`,
    );
    return { ok: true, skipped: true };
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to: args.to,
    subject: args.subject,
    html: args.html,
    replyTo: args.replyTo,
  });
  if (error) {
    console.error("[email] send failed:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function sendCustomOrderEmails(
  data: CustomOrderInput,
): Promise<SendResult> {
  const adminInner = `
    <table style="width:100%;border-collapse:collapse;border:1px solid #e7e1d8;border-radius:8px">
      ${row("Name", data.fullName)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Product", data.product)}
      ${row("Category", data.category)}
      ${row("Quantity", data.quantity)}
      ${row("Personalization", data.personalization)}
      ${row("Deadline", data.deadline)}
      ${row("Budget", data.budget)}
      ${row("Details", data.details)}
    </table>`;
  const admin = await send({
    to: TO,
    subject: `New custom order request — ${data.fullName}`,
    html: shell("New custom order request", adminInner),
    replyTo: data.email,
  });

  const customerInner = `
    <p style="font-size:14px;color:#2a2620;line-height:1.6">Hi ${esc(
      data.fullName,
    )},</p>
    <p style="font-size:14px;color:#544c40;line-height:1.6">Thanks for your custom order request! We've received your details and our team will reply within one business day with a free design proof and quote.</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e7e1d8;border-radius:8px;margin-top:8px">
      ${row("Product", data.product || "Custom request")}
      ${row("Quantity", data.quantity)}
      ${row("Personalization", data.personalization)}
    </table>
    <p style="font-size:14px;color:#544c40;line-height:1.6;margin-top:16px">Talk soon,<br/>The ${esc(
      site.name,
    )} team</p>`;
  await send({
    to: data.email,
    subject: `We received your custom order request — ${site.name}`,
    html: shell("Thanks for your request!", customerInner),
  });

  return admin;
}

export async function sendSellerApplicationEmails(
  data: SellerApplicationInput,
): Promise<SendResult> {
  const adminInner = `
    <table style="width:100%;border-collapse:collapse;border:1px solid #e7e1d8;border-radius:8px">
      ${row("Name", data.fullName)}
      ${row("Business", data.businessName)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Website", data.website)}
      ${row("Business type", data.businessType)}
      ${row("Monthly volume", data.monthlyVolume)}
      ${row("Product interest", data.productInterest)}
      ${row("Message", data.message)}
    </table>`;
  const admin = await send({
    to: TO,
    subject: `New reseller application — ${data.businessName}`,
    html: shell("New reseller application", adminInner),
    replyTo: data.email,
  });

  const customerInner = `
    <p style="font-size:14px;color:#2a2620;line-height:1.6">Hi ${esc(
      data.fullName,
    )},</p>
    <p style="font-size:14px;color:#544c40;line-height:1.6">Thank you for applying to become a ${esc(
      site.name,
    )} reseller. We've received your application for <strong>${esc(
      data.businessName,
    )}</strong> and will review it and follow up within two business days.</p>
    <p style="font-size:14px;color:#544c40;line-height:1.6;margin-top:16px">Best,<br/>The ${esc(
      site.name,
    )} team</p>`;
  await send({
    to: data.email,
    subject: `Your reseller application was received — ${site.name}`,
    html: shell("Application received!", customerInner),
  });

  return admin;
}
