import { NextResponse } from "next/server";
import { sellerApplicationSchema } from "@/lib/validation";
import { sendSellerApplicationEmails } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = sellerApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the form and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const result = await sendSellerApplicationEmails(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: "We couldn't submit your application. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
