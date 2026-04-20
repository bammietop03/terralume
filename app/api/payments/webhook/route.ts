import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payments/webhook
 *
 * Receives and validates Paystack webhook events.
 * Paystack signs each request with HMAC-SHA512 using your secret key.
 *
 * Handled events:
 *  - charge.success  → mark payment SUCCESS + notify client
 *
 * Set this URL in your Paystack dashboard:
 *   https://yourdomain.com/api/payments/webhook
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Validate HMAC-SHA512 signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event: string;
      data: {
        reference: string;
        status: string;
        amount: number;
        currency: string;
        paid_at: string;
        metadata?: { engagementId?: string; userId?: string };
      };
    };

    if (event.event === "charge.success") {
      const { reference, amount, currency, paid_at } = event.data;

      // Update payment record
      const payment = await prisma.payment
        .update({
          where: { reference },
          data: {
            status: "SUCCESS",
            paidAt: new Date(paid_at),
          },
          include: {
            engagement: {
              include: { user: true },
            },
          },
        })
        .catch(() => null); // payment might not exist if webhook fires before /initialize response

      if (payment) {
        const clientUserId = payment.engagement.userId;

        // Notify client
        await prisma.notification.create({
          data: {
            userId: clientUserId,
            type: "payment_success",
            content: `Payment confirmed: ${currency} ${(amount / 100).toLocaleString()} received.`,
          },
        });
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[payments/webhook]", err);
    // Return 200 even on error — Paystack retries on non-2xx
    return NextResponse.json({ received: true });
  }
}
