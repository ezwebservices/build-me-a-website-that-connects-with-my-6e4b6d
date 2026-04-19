import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getClient, type OrderRecord, type ProductRecord, type InquiryRecord } from "../../lib/client";
import { formatCents, formatDateTime } from "../../lib/format";

export function AdminDashboard() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  useEffect(() => {
    const client = getClient();
    if (!client) return;
    const subs = [
      client.models.Product.observeQuery().subscribe({
        next: ({ items }: { items: ProductRecord[] }) => setProducts(items),
      }),
      client.models.Order.observeQuery().subscribe({
        next: ({ items }: { items: OrderRecord[] }) => setOrders(items),
      }),
      client.models.InquiryMessage.observeQuery().subscribe({
        next: ({ items }: { items: InquiryRecord[] }) => setInquiries(items),
      }),
    ];
    return () => subs.forEach((s) => s.unsubscribe());
  }, []);

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.status && o.status !== "pending" && o.status !== "cancelled");
    const revenue = paid.reduce((sum, o) => sum + (o.totalCents ?? 0), 0);
    const active = products.filter((p) => p.active !== false);
    const inventory = active.reduce((sum, p) => sum + (p.inventory ?? 0), 0);
    return {
      revenue,
      orders: orders.length,
      products: active.length,
      inventory,
      inquiries: inquiries.filter((i) => i.status !== "archived").length,
    };
  }, [orders, products, inquiries]);

  const recentOrders = [...orders]
    .sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 5);

  const newInquiries = inquiries
    .filter((i) => i.status === "new")
    .sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 5);

  return (
    <div>
      <header className="mb-10">
        <div className="eyebrow mb-2">Overview</div>
        <h1 className="font-display text-3xl md:text-4xl">Shop at a glance</h1>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Lifetime revenue" value={formatCents(stats.revenue)} />
        <StatCard label="Orders" value={String(stats.orders)} />
        <StatCard label="Active products" value={String(stats.products)} />
        <StatCard label="Units in stock" value={String(stats.inventory)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-xl">Recent orders</h2>
            <Link to="/admin/orders" className="text-xs uppercase tracking-widest text-clay-500">
              All orders →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-ink-500 text-sm">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-ink-200/5">
              {recentOrders.map((o) => (
                <li key={o.id} className="py-3 flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <Link to={`/admin/orders/${o.id}`} className="hover:text-clay-400 block truncate">
                      {o.customerEmail || "Guest"}
                    </Link>
                    <div className="text-xs text-ink-500 mt-1">
                      {formatDateTime(o.createdAt)} · {o.status ?? "pending"}
                    </div>
                  </div>
                  <div className="font-display text-clay-500">
                    {formatCents(o.totalCents)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-xl">New inquiries</h2>
            <Link
              to="/admin/inquiries"
              className="text-xs uppercase tracking-widest text-clay-500"
            >
              Inbox ({stats.inquiries}) →
            </Link>
          </div>
          {newInquiries.length === 0 ? (
            <p className="text-ink-500 text-sm">No new messages.</p>
          ) : (
            <ul className="divide-y divide-ink-200/5">
              {newInquiries.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex justify-between gap-4">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-ink-500">{formatDateTime(m.createdAt)}</div>
                  </div>
                  <div className="text-xs text-ink-500 mt-1">{m.email}</div>
                  <p className="text-sm text-ink-700 mt-2 line-clamp-2">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="eyebrow mb-2">{label}</div>
      <div className="font-display text-3xl text-clay-500">{value}</div>
    </div>
  );
}
