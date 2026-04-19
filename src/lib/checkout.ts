import type { CartLine } from "./cart";

export interface CheckoutResponse {
  url?: string;
  id?: string;
  error?: string;
}

export async function startCheckout(opts: {
  endpoint: string;
  items: CartLine[];
  customerEmail?: string;
}): Promise<CheckoutResponse> {
  if (!opts.endpoint) {
    return { error: "Checkout is not configured yet. Add STRIPE_SECRET_KEY and redeploy." };
  }
  const origin = window.location.origin;
  const res = await fetch(opts.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: opts.items,
      customerEmail: opts.customerEmail,
      successUrl: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/cart`,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { error: text || `Checkout failed (${res.status})` };
  }
  return (await res.json()) as CheckoutResponse;
}
