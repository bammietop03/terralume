import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_BASE = "https://api.paystack.co";

/**
 * GET /api/payments/verify?reference=xxx
 *
 * Verifies a Paystack transaction server-side.
 * Updates our payment record to SUCCESS or FAILED.
 * Creates a notification for the client on success.
 *
 * IMPORTANT: Always verify on the server — never trust client-side callbacks.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "reference is required" }, { status: 400 });
    }

    // Call Paystack verify endpoint
    const paystackRes = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message ?? "Verification failed" },
        { status: 502 }
      );
    }

    const txData = paystackData.data;
    const txStatus = txData.status === "success" ? "SUCCESS" : "FAILED";

    // Update payment record
    const payment = await prisma.payment.update({
      where: { reference },
      data: {
        status: txStatus,
        paidAt: txStatus === "SUCCESS" ? new Date() : null,
      },
      include: {
        engagement: { include: { client: { include: { user: true } } } },
      },
    });

    // Fire a notification on success
    if (txStatus === "SUCCESS") {
      const clientUserId = payment.engagement.client.userId;
      await prisma.notification.create({
        data: {
          userId: clientUserId,
          type: "payment_success",
          content: `Your payment of ${payment.currency} ${payment.amount.toLocaleString()} has been received.`,
        },
      });
    }

    return NextResponse.json({
      status: txStatus,
      amount: txData.amount / 100,
      currency: txData.currency,
      paidAt: payment.paidAt,
      paymentId: payment.id,
    });
  } catch (err) {
    console.error("[payments/verify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
