import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClient, type ProductRecord } from "../../lib/client";
import { formatCents } from "../../lib/format";

export function AdminProducts() {
  const [items, setItems] = useState<ProductRecord[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const client = getClient();
    if (!client) return;
    const sub = client.models.Product.observeQuery().subscribe({
      next: ({ items: list }: { items: ProductRecord[] }) => setItems(list),
    });
    return () => sub.unsubscribe();
  }, []);

  const filtered = items.filter((p) =>
    query.trim()
      ? p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(query.toLowerCase())
      : true
  );

  const toggleActive = async (p: ProductRecord) => {
    const client = getClient();
    if (!client) return;
    await client.models.Product.update({ id: p.id, active: !p.active });
  };

  const remove = async (p: ProductRecord) => {
    const ok = window.confirm(`Delete "${p.name}"? This cannot be undone.`);
    if (!ok) return;
    const client = getClient();
    if (!client) return;
    await client.models.Product.delete({ id: p.id });
  };

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <div className="eyebrow mb-2">Catalog</div>
          <h1 className="font-display text-3xl md:text-4xl">Products</h1>
        </div>
        <div className="flex gap-3 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="field py-2 max-w-[220px]"
          />
          <Link to="/admin/products/new" className="btn-primary">
            + New product
          </Link>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-ink-500 border-b border-ink-900/10">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Inventory</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-500">
                  No products yet. Add your first piece to get the shop running.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-paper-200">
                  <td className="px-5 py-4">
                    <Link to={`/admin/products/${p.id}`} className="font-medium hover:text-clay-400">
                      {p.name}
                    </Link>
                    {p.featured ? (
                      <span className="ml-2 text-[10px] uppercase tracking-widest text-clay-500">
                        featured
                      </span>
                    ) : null}
                    <div className="text-xs text-ink-500 font-mono mt-1">/shop/{p.slug}</div>
                  </td>
                  <td className="px-5 py-4 text-ink-700">{p.category ?? "—"}</td>
                  <td className="px-5 py-4 font-mono">{formatCents(p.priceCents, p.currency ?? "usd")}</td>
                  <td className="px-5 py-4">{p.inventory ?? 0}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`px-3 py-1 rounded-full border text-xs uppercase tracking-widest ${
                        p.active
                          ? "border-patina-500 text-patina-300"
                          : "border-ink-900/15 text-ink-500"
                      }`}
                    >
                      {p.active ? "Live" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="text-xs uppercase tracking-widest text-clay-500 hover:text-clay-400 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(p)}
                      className="text-xs uppercase tracking-widest text-ink-500 hover:text-clay-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
