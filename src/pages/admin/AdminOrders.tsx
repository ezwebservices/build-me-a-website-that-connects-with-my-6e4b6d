import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getClient, type OrderRecord } from "../../lib/client";
import { formatCents, formatDateTime } from "../../lib/format";

const STATUSES = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

type StatusFilter = (typeof STATUSES)[number];

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const client = getClient();
    if (!client) return;
    const sub = client.models.Order.observeQuery().subscribe({
      next: ({ items }: { items: OrderRecord[] }) => setOrders(items),
    });
    return () => sub.unsubscribe();
  }, []);

  const sorted = useMemo(
    () =>
      [...orders]
        .filter((o) => (filter === "all" ? true : o.status === filter))
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        ),
    [orders, filter]
  );

  return (
    <div>
      <div className="mb-8">
        <div className="eyebrow mb-2">Fulfillment</div>
        <h1 className="font-display text-3xl md:text-4xl">Orders</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border transition ${
              filter === s
                ? "border-clay-500 text-clay-400 bg-clay-500/10"
                : "border-ink-900/10/15 text-ink-700 hover:border-ink-900/20"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-ink-500 border-b border-ink-900/10">
            <tr>
              <th className="px-5 py-3">Placed</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200/5">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              sorted.map((o) => {
                const items = Array.isArray(o.items) ? (o.items as { quantity?: number }[]) : [];
                const qty = items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
                return (
                  <tr key={o.id} className="hover:bg-paper-200">
                    <td className="px-5 py-4 text-ink-500">{formatDateTime(o.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div>{o.customerName || o.customerEmail || "Guest"}</div>
                      {o.customerEmail ? (
                        <div className="text-xs text-ink-500">{o.customerEmail}</div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">{qty}</td>
                    <td className="px-5 py-4 font-mono">{formatCents(o.totalCents)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={o.status ?? "pending"} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="text-xs uppercase tracking-widest text-clay-500 hover:text-clay-400"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-paper-300/40 text-ink-700 border-ink-400/30",
    paid: "bg-patina-500/10 text-patina-300 border-patina-500/40",
    processing: "bg-clay-500/10 text-clay-400 border-clay-500/40",
    shipped: "bg-patina-500/15 text-patina-300 border-patina-500/40",
    delivered: "bg-patina-500/20 text-patina-300 border-patina-500/40",
    cancelled: "bg-paper-300/40 text-ink-500 border-ink-400/20",
    refunded: "bg-clay-700/20 text-clay-400 border-clay-500/40",
  };
  const cls = map[status] ?? map.pending;
  return (
    <span className={`px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-widest ${cls}`}>
      {status}
    </span>
  );
}
