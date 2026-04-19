import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { formatCents } from "../lib/format";
import { useApp } from "../context/AppContext";
import { startCheckout } from "../lib/checkout";
import { getClient } from "../lib/client";

export function CartPage() {
  const { lines, setQuantity, remove, clear, subtotalCents, shippingCents, count } = useCart();
  const { stripeCheckoutUrl, amplifyConfigured } = useApp();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const totalCents = subtotalCents + shippingCents;

  const handleCheckout = async () => {
    setError("");
    setBusy(true);
    try {
      if (amplifyConfigured) {
        const client = getClient();
        if (client) {
          await client.models.Order.create({
            customerEmail: email || null,
            items: lines.map((l) => ({
              productId: l.productId,
              name: l.name,
              priceCents: l.priceCents,
              quantity: l.quantity,
            })),
            subtotalCents,
            shippingCents,
            totalCents,
            status: "pending",
          });
        }
      }
      const res = await startCheckout({
        endpoint: stripeCheckoutUrl,
        items: lines,
        customerEmail: email || undefined,
      });
      if (res.error || !res.url) {
        setError(res.error || "Could not start checkout.");
        setBusy(false);
        return;
      }
      window.location.href = res.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setBusy(false);
    }
  };

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="eyebrow mb-4">The cart</div>
        <h1 className="font-display text-4xl mb-4">Empty bench.</h1>
        <p className="text-ink-500 mb-8">
          Nothing loaded in the cart yet. Browse the shop and pick up where the machine left off.
        </p>
        <Link to="/shop" className="btn-primary">Head to the shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
      <div className="eyebrow mb-3">Your bench</div>
      <h1 className="font-display text-4xl md:text-5xl mb-10">The cart</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-4">
          {lines.map((line) => (
            <div
              key={line.productId}
              className="card p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-paper-200 flex-shrink-0">
                {line.image ? (
                  <img src={line.image} alt={line.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/shop/${line.slug ?? ""}`}
                  className="font-display text-xl hover:text-clay-400"
                >
                  {line.name}
                </Link>
                <div className="text-sm text-ink-500 mt-1">
                  {formatCents(line.priceCents)} · ea
                </div>
              </div>
              <div className="flex items-center border border-ink-900/10/15 rounded-full overflow-hidden">
                <button
                  className="px-3 py-1 hover:bg-paper-200/60"
                  onClick={() => setQuantity(line.productId, line.quantity - 1)}
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono">{line.quantity}</span>
                <button
                  className="px-3 py-1 hover:bg-paper-200/60"
                  onClick={() => setQuantity(line.productId, line.quantity + 1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <div className="font-medium min-w-[80px] text-right">
                {formatCents(line.priceCents * line.quantity)}
              </div>
              <button
                onClick={() => remove(line.productId)}
                className="text-xs text-ink-500 hover:text-clay-500 uppercase tracking-widest"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={clear}
            className="text-xs text-ink-500 hover:text-clay-500 uppercase tracking-widest"
          >
            Clear cart
          </button>
        </div>
        <aside className="card p-6 h-fit sticky top-24">
          <div className="eyebrow mb-4">Summary</div>
          <dl className="space-y-3 text-sm">
            <Row label="Subtotal" value={formatCents(subtotalCents)} />
            <Row
              label="Shipping"
              value={shippingCents > 0 ? formatCents(shippingCents) : "Free"}
            />
            <div className="border-t border-ink-900/10 pt-3 flex justify-between">
              <dt className="font-display text-lg">Total</dt>
              <dd className="font-display text-lg text-clay-500">
                {formatCents(totalCents)}
              </dd>
            </div>
          </dl>
          <label className="label mt-6">Email for receipt</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="field"
          />
          {error ? (
            <div className="mt-4 text-sm text-clay-400 bg-clay-500/10 border border-clay-500/30 rounded-lg p-3">
              {error}
            </div>
          ) : null}
          <button
            onClick={handleCheckout}
            disabled={busy}
            className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? "Preparing checkout…" : "Checkout securely with Stripe"}
          </button>
          <p className="text-[11px] text-ink-500 mt-4 leading-relaxed">
            Payments are processed by Stripe. Shipping address is collected at checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-ink-900">{value}</dd>
    </div>
  );
}
