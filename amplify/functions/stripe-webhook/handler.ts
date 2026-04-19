import type { Handler } from "aws-lambda";
import Stripe from "stripe";

interface LambdaFunctionUrlEvent {
  body?: string;
  isBase64Encoded?: boolean;
  headers?: Record<string, string | undefined>;
}

export const handler: Handler = async (event: LambdaFunctionUrlEvent) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return { statusCode: 500, body: JSON.stringify({ error: "Stripe webhook not configured" }) };
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" as Stripe.LatestApiVersion });

  const signature =
    event.headers?.["stripe-signature"] ??
    event.headers?.["Stripe-Signature"] ??
    "";

  const rawBody = event.isBase64Encoded && event.body
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body ?? "";

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return { statusCode: 400, body: JSON.stringify({ error: message }) };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const itemsJson = session.metadata?.itemsJson ?? "[]";
    const shipping = session.shipping_details;
    const order = {
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
      customerName: session.customer_details?.name ?? shipping?.name ?? null,
      items: itemsJson,
      subtotalCents: session.amount_subtotal ?? 0,
      shippingCents: session.shipping_cost?.amount_total ?? 0,
      taxCents: session.total_details?.amount_tax ?? 0,
      totalCents: session.amount_total ?? 0,
      currency: (session.currency ?? "usd").toLowerCase(),
      status: "paid",
      shippingName: shipping?.name ?? null,
      shippingLine1: shipping?.address?.line1 ?? null,
      shippingLine2: shipping?.address?.line2 ?? null,
      shippingCity: shipping?.address?.city ?? null,
      shippingState: shipping?.address?.state ?? null,
      shippingPostalCode: shipping?.address?.postal_code ?? null,
      shippingCountry: shipping?.address?.country ?? null,
    };
    console.log("stripe-webhook order", JSON.stringify(order));
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ received: true, type: stripeEvent.type }),
  };
};
