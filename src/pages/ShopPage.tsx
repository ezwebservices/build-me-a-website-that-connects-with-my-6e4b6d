import { useEffect, useMemo, useState } from "react";
import { getClient, type ProductRecord } from "../lib/client";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { ConfigWarning } from "../components/ConfigWarning";

type SortKey = "newest" | "priceAsc" | "priceDesc" | "name";

export function ShopPage() {
  const { amplifyConfigured } = useApp();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!amplifyConfigured) {
      setLoading(false);
      return;
    }
    const client = getClient();
    if (!client) {
      setLoading(false);
      return;
    }
    const sub = client.models.Product.observeQuery().subscribe({
      next: ({ items }: { items: ProductRecord[] }) => {
        setProducts(items.filter((p: ProductRecord) => p.active !== false));
        setLoading(false);
      },
      error: () => setLoading(false),
    });
    return () => sub.unsubscribe();
  }, [amplifyConfigured]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          (p.materials ?? "").toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    switch (sort) {
      case "priceAsc":
        sorted.sort((a, b) => (a.priceCents ?? 0) - (b.priceCents ?? 0));
        break;
      case "priceDesc":
        sorted.sort((a, b) => (b.priceCents ?? 0) - (a.priceCents ?? 0));
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
    }
    return sorted;
  }, [products, category, sort, query]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="mb-10">
        <div className="eyebrow mb-3">Atelier shop</div>
        <h1 className="font-display text-4xl md:text-6xl">Every piece, cut by hand.</h1>
        <p className="text-ink-500 mt-4 max-w-2xl">
          One-offs and short runs from the garage. Inventory is limited — when it's gone, it's
          gone until the next session at the machine.
        </p>
      </div>

      {!amplifyConfigured ? <ConfigWarning compact /> : null}

      <div className="flex flex-wrap gap-3 items-center mb-8">
        <div className="flex flex-wrap gap-2">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>All</Chip>
          {categories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field max-w-[200px] py-2 text-sm"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field py-2 text-sm max-w-[180px]"
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="priceAsc">Price — low</option>
            <option value="priceDesc">Price — high</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-96 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        !amplifyConfigured ? (
          <PreviewGrid />
        ) : (
          <div className="card p-12 text-center">
            <h3 className="font-display text-2xl mb-2">Nothing to show here yet.</h3>
            <p className="text-ink-500">
              {products.length === 0
                ? "The shop is empty — the maker is probably sweeping chips off the machine."
                : "No matches. Try another filter or search term."}
            </p>
          </div>
        )
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewGrid() {
  const samples = [
    { name: "Walnut Live-Edge Console", category: "Furniture", price: 248000, materials: "Black walnut · hand-rubbed oil finish" },
    { name: "Machined Brass Coaster Set", category: "Tabletop", price: 16800, materials: "Polished brass · felt base" },
    { name: "Ash & Steel Shelf Bracket", category: "Hardware", price: 9200, materials: "White ash · cold-rolled steel" },
    { name: "Engraved Cherry Cutting Board", category: "Kitchen", price: 13400, materials: "American cherry · food-safe wax" },
    { name: "Topographic Wall Map — Cascades", category: "Wall Art", price: 42000, materials: "Baltic birch ply · 5-layer relief" },
    { name: "Inlaid Rosewood Jewelry Box", category: "Gifts", price: 31500, materials: "Rosewood · maple inlay · velvet" },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {samples.map((s, i) => (
        <div key={i} className="card overflow-hidden relative">
          <div className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-clay-500/90 text-ink-900 font-semibold">
            Preview
          </div>
          <div className="aspect-[4/5] bg-gradient-to-br from-ink-800 to-ink-900 overflow-hidden relative">
            <svg viewBox="0 0 200 250" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id={`pg${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#332b21" />
                  <stop offset="1" stopColor="#0f0c09" />
                </linearGradient>
              </defs>
              <rect width="200" height="250" fill={`url(#pg${i})`} />
              <g stroke="#4a3f30" strokeWidth="1" fill="none">
                <circle cx="100" cy="125" r="60" />
                <circle cx="100" cy="125" r="40" />
                <circle cx="100" cy="125" r="20" />
                <path d="M40 125h120M100 65v120" />
              </g>
              <circle cx="100" cy="125" r="4" fill="#e77423" />
            </svg>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="eyebrow mb-2">{s.category}</div>
                <h3 className="font-display text-lg">{s.name}</h3>
              </div>
              <div className="font-medium">${(s.price / 100).toFixed(0)}</div>
            </div>
            <div className="mt-2 text-xs text-ink-500 font-mono truncate">{s.materials}</div>
            <div className="mt-3 text-[10px] uppercase tracking-widest text-clay-400">
              Preview — connect backend to load live products
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full border text-xs uppercase tracking-widest transition ${
        active
          ? "border-clay-500 text-clay-400 bg-clay-500/10"
          : "border-ink-900/10/15 text-ink-700 hover:border-ink-900/20"
      }`}
    >
      {children}
    </button>
  );
}
