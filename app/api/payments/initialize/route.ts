import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_BASE = "https://api.paystack.co";

/**
 * POST /api/payments/initialize
 * Body: { engagementId, amount (in major currency units), currency?, type? }
 *
 * - Verifies the caller is authenticated
 * - Initializes a Paystack transaction
 * - Persists a PENDING payment record
 * - Returns the Paystack authorization_url for client-side redirect
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      engagementId,
      amount,
      currency = "NGN",
      type = "OTHER",
    } = body as {
      engagementId: string;
      amount: number;
      currency?: string;
      type?: "RETAINER" | "SUCCESS" | "OTHER";
    };

    if (!engagementId || !amount) {
      return NextResponse.json(
        { error: "engagementId and amount are required" },
        { status: 400 }
      );
    }

    // Fetch the engagement to get the client's email for Paystack
    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
      include: { client: { include: { user: true } } },
    });

    if (!engagement) {
      return NextResponse.json({ error: "Engagement not found" }, { status: 404 });
    }

    const clientEmail = engagement.client.user.email;

    // Initialize Paystack transaction (amount in kobo/smallest unit)
    const paystackRes = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: clientEmail,
        amount: Math.round(amount * 100), // convert to kobo
        currency,
        metadata: {
          engagementId,
          userId: user.id,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message ?? "Paystack initialization failed" },
        { status: 502 }
      );
    }

    const { authorization_url, reference } = paystackData.data;

    // Persist PENDING payment in DB
    const payment = await prisma.payment.create({
      data: {
        engagementId,
        type: type as "RETAINER" | "SUCCESS" | "OTHER",
        amount,
        currency,
        provider: "PAYSTACK",
        status: "PENDING",
        reference,
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      reference,
      authorizationUrl: authorization_url,
    });
  } catch (err) {
    console.error("[payments/initialize]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
