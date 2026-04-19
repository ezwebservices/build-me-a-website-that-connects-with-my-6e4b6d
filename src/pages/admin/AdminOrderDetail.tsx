import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getClient, type OrderRecord } from "../../lib/client";
import { formatCents, formatDateTime } from "../../lib/format";

const ORDER_STATUS = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

type OrderStatus = (typeof ORDER_STATUS)[number];

interface LineItem {
  productId?: string;
  name?: string;
  priceCents?: number;
  quantity?: number;
}

export function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    const client = getClient();
    if (!client) return;
    (async () => {
      const { data } = await client.models.Order.get({ id });
      setOrder(data);
      setTracking(data?.trackingNumber ?? "");
      setCarrier(data?.trackingCarrier ?? "");
      setNotes(data?.notes ?? "");
      setLoading(false);
    })();
  }, [id]);

  const updateStatus = async (status: OrderStatus) => {
    if (!id) return;
    const client = getClient();
    if (!client) return;
    setSaving(true);
    const { data } = await client.models.Order.update({ id, status });
    if (data) setOrder(data);
    setSaving(false);
    setSavedAt(Date.now());
  };

  const saveFulfillment = async () => {
    if (!id) return;
    const client = getClient();
    if (!client) return;
    setSaving(true);
    const { data } = await client.models.Order.update({
      id,
      trackingCarrier: carrier.trim() || null,
      trackingNumber: tracking.trim() || null,
      notes: notes.trim() || null,
    });
    if (data) setOrder(data);
    setSaving(false);
    setSavedAt(Date.now());
  };

  if (loading) return <div className="text-ink-500">Loading order…</div>;
  if (!order) {
    return (
      <div>
        <p className="text-ink-500 mb-4">Order not found.</p>
        <Link to="/admin/orders" className="btn-ghost">Back to orders</Link>
      </div>
    );
  }

  const items: LineItem[] = Array.isArray(order.items) ? (order.items as LineItem[]) : [];

  return (
    <div className="max-w-5xl">
      <Link
        to="/admin/orders"
        className="text-xs uppercase tracking-widest text-ink-500 hover:text-clay-500"
      >
        ← Back to orders
      </Link>
      <div className="flex items-start justify-between flex-wrap gap-4 mt-4 mb-8">
        <div>
          <div className="eyebrow mb-2">Order</div>
          <h1 className="font-display text-3xl">#{order.id.slice(0, 8)}</h1>
          <div className="text-sm text-ink-500 mt-1">
            Placed {formatDateTime(order.createdAt)}
          </div>
        </div>
        <div className="font-display text-3xl text-clay-500">
          {formatCents(order.totalCents)}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-xl mb-4">Items</h2>
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-widest text-ink-500 border-b border-ink-900/10">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2 text-right">Unit</th>
                  <th className="py-2 text-right">Line</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/5">
                {items.map((it, i) => (
                  <tr key={i}>
                    <td className="py-3">{it.name ?? "Item"}</td>
                    <td className="py-3">{it.quantity ?? 1}</td>
                    <td className="py-3 text-right font-mono">
                      {formatCents(it.priceCents ?? 0)}
                    </td>
                    <td className="py-3 text-right font-mono">
                      {formatCents((it.priceCents ?? 0) * (it.quantity ?? 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-4 border-t border-ink-900/10 space-y-1 text-sm">
              <Row label="Subtotal" value={formatCents(order.subtotalCents)} />
              <Row label="Shipping" value={formatCents(order.shippingCents)} />
              <Row label="Tax" value={formatCents(order.taxCents ?? 0)} />
              <Row label="Total" value={formatCents(order.totalCents)} emphasize />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-xl mb-4">Ship to</h2>
            <div className="text-sm text-ink-700 leading-relaxed">
              <div>{order.shippingName || order.customerName || "—"}</div>
              <div>{order.shippingLine1 ?? "—"}</div>
              {order.shippingLine2 ? <div>{order.shippingLine2}</div> : null}
              <div>
                {[order.shippingCity, order.shippingState, order.shippingPostal]
                  .filter(Boolean)
                  .join(", ")}
              </div>
              <div>{order.shippingCountry}</div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-display text-xl mb-4">Fulfillment</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label>
                <span className="label">Carrier</span>
                <input
                  className="field"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="USPS, UPS, FedEx…"
                />
              </label>
              <label>
                <span className="label">Tracking number</span>
                <input
                  className="field font-mono"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                />
              </label>
            </div>
            <label className="block mt-4">
              <span className="label">Internal notes</span>
              <textarea
                rows={3}
                className="field resize-y"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={saveFulfillment}
                className="btn-primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save fulfillment"}
              </button>
              {savedAt ? (
                <span className="text-xs text-ink-500">Saved {formatDateTime(new Date(savedAt).toISOString())}</span>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="card p-6 h-fit space-y-6">
          <div>
            <div className="eyebrow mb-2">Customer</div>
            <div className="text-sm">
              <div>{order.customerName || "—"}</div>
              <div className="text-ink-500">{order.customerEmail || "—"}</div>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-2">Status</div>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_STATUS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`text-xs uppercase tracking-widest px-2 py-2 rounded-lg border transition ${
                    order.status === s
                      ? "border-clay-500 text-clay-400 bg-clay-500/10"
                      : "border-ink-900/10/15 text-ink-500 hover:border-ink-900/20"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {order.stripeSessionId ? (
            <div>
              <div className="eyebrow mb-2">Stripe</div>
              <div className="text-[11px] font-mono text-ink-500 break-all">
                {order.stripeSessionId}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className={`flex justify-between ${emphasize ? "text-clay-500 font-display text-lg" : ""}`}>
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
