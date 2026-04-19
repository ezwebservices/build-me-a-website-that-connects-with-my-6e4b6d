import type { Handler } from "aws-lambda";
import Stripe from "stripe";

interface CartItem {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  image?: string;
  shippingFlatCents?: number;
}

interface Payload {
  items: CartItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export const handler: Handler = async (event: any) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Stripe not configured" }) };
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" as Stripe.LatestApiVersion });

  const payload: Payload = typeof event?.body === "string" ? JSON.parse(event.body) : event;
  const { items, successUrl, cancelUrl, customerEmail } = payload;

  if (!items || items.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Cart is empty" }) };
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i) => ({
    quantity: i.quantity,
    price_data: {
      currency: "usd",
      unit_amount: i.priceCents,
      product_data: {
        name: i.name,
        images: i.image ? [i.image] : undefined,
      },
    },
  }));

  const shippingTotal = items.reduce(
    (sum, i) => sum + (i.shippingFlatCents || 0) * i.quantity,
    0
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    shipping_address_collection: {
      allowed_countries: ["US", "CA"],
    },
    shipping_options:
      shippingTotal > 0
        ? [
            {
              shipping_rate_data: {
                display_name: "Standard Shipping",
                type: "fixed_amount",
                fixed_amount: { amount: shippingTotal, currency: "usd" },
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 5 },
                  maximum: { unit: "business_day", value: 10 },
                },
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                display_name: "Free Shipping",
                type: "fixed_amount",
                fixed_amount: { amount: 0, currency: "usd" },
                delivery_estimate: {
                  minimum: { unit: "business_day", value: 5 },
                  maximum: { unit: "business_day", value: 10 },
                },
              },
            },
          ],
    metadata: {
      itemsJson: JSON.stringify(items.map((i) => ({ id: i.productId, q: i.quantity }))),
    },
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ url: session.url, id: session.id }),
  };
};
