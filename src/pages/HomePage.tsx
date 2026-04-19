import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClient, type ProductRecord } from "../lib/client";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { IronwakeMark } from "../components/IronwakeMark";

export function HomePage() {
  const { amplifyConfigured, shopName, settings } = useApp();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

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
        const active = items.filter((p: ProductRecord) => p.active !== false);
        setProducts(active);
        setLoading(false);
      },
      error: () => setLoading(false),
    });
    return () => sub.unsubscribe();
  }, [amplifyConfigured]);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const latest = products.slice(0, 6);
  const showcase = featured.length > 0 ? featured : latest;

  const headline =
    settings?.heroHeadline || "Bespoke millwork, designed for the way you live.";
  const subheadline =
    settings?.heroSubheadline ||
    `${shopName} is a small design atelier drawing, milling, and hand-finishing custom cabinetry, furniture, and architectural millwork for considered homes.`;

  return (
    <div>
      <section className="relative overflow-hidden bg-paper-100">
        <HeroWatermark />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-20 md:pt-28 pb-24 md:pb-32 grid md:grid-cols-12 gap-12 md:gap-16 items-end">
          <div className="md:col-span-7 reveal">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-clay-400/70" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-ink-500 font-medium">
                {shopName} &mdash; Atelier No. 01
              </span>
            </div>
            <h1 className="font-display text-ink-900 text-[2.75rem] sm:text-6xl lg:text-[5.25rem] leading-[1.02] tracking-[-0.02em] max-w-[14ch]">
              {renderHeadline(headline)}
            </h1>
            <p className="mt-10 text-[1.0625rem] md:text-lg text-ink-600 leading-[1.7] max-w-[46ch]">
              {subheadline}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-ink-900 text-paper-50 font-display text-[0.95rem] tracking-wide rounded-[2px] hover:bg-ink-700 transition"
              >
                Commission a Piece
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-ink-900/40 text-ink-900 font-display text-[0.95rem] tracking-wide rounded-[2px] hover:border-ink-900 hover:bg-paper-200 transition"
              >
                Shop the Collection
              </Link>
            </div>
            <div className="mt-12 pt-8 border-t border-ink-900/10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
              <SpecNote>Designed in-house</SpecNote>
              <SpecNote>CNC-milled locally</SpecNote>
              <SpecNote>Shipped nationwide</SpecNote>
            </div>
          </div>

          <div className="md:col-span-5 reveal">
            <HeroVisual />
            <div className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Walnut Credenza &middot; Commission 024 &middot; Figured American Black Walnut
            </div>
          </div>
        </div>

        <div className="border-y border-ink-900/10 overflow-hidden py-5 bg-paper-200/50">
          <div className="marquee">
            <Marquee />
            <Marquee />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="eyebrow mb-3">The collection</div>
            <h2 className="font-display text-3xl md:text-5xl">Pieces currently on the bench</h2>
          </div>
          <Link to="/shop" className="text-sm uppercase tracking-[0.2em] text-clay-500 hover:text-clay-400">
            View everything →
          </Link>
        </div>
        {loading ? (
          <ProductSkeletonGrid />
        ) : showcase.length === 0 ? (
          <EmptyShelf />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcase.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-paper-200 border-y border-ink-900/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow mb-4">The process</div>
            <h2 className="font-display text-3xl md:text-5xl mb-8">Drawn, milled, and hand-finished.</h2>
            <p className="text-ink-700 text-lg leading-relaxed mb-6">
              Every commission starts as a conversation about the room — how you live, what you
              keep, where the light falls. From there it becomes a drawing, a CAD model, a
              tool-path, and finally a piece that is sanded, oiled, and assembled by hand until it
              feels like it has always been there.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-10">
              <Stat label="Years in practice" value="8" />
              <Stat label="Homes furnished" value="120+" />
              <Stat label="Pieces commissioned" value="1.2k" />
            </div>
          </div>
          <div className="relative">
            <ProcessDiagram />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 lg:px-10 py-20 text-center">
        <IronwakeMark className="w-14 h-14 text-clay-500 mx-auto mb-6" />
        <h2 className="font-display text-3xl md:text-5xl mb-6">
          Have something specific in mind?
        </h2>
        <p className="text-ink-500 text-lg mb-10">
          Built-in cabinetry, kitchen millwork, wall panelling, wardrobes, or a single heirloom
          piece of furniture — if it can be drawn to fit your room, we can mill it.
        </p>
        <Link to="/contact" className="btn-primary">Start a commission</Link>
      </section>
    </div>
  );
}

function renderHeadline(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return <>{text}</>;
  const last = words.pop() as string;
  const head = words.join(" ");
  return (
    <>
      {head}{" "}
      <span className="italic font-normal text-ink-800">{last}</span>
    </>
  );
}

function HeroWatermark() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 right-0 w-[62%] h-[70%] opacity-[0.06]"
      viewBox="0 0 800 700"
      fill="none"
      aria-hidden
      preserveAspectRatio="xMaxYMax meet"
    >
      <g stroke="#2A2724" strokeWidth="1">
        {Array.from({ length: 22 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${80 + i * 28} C 200 ${70 + i * 28 + (i % 2 ? 10 : -10)}, 420 ${90 + i * 28 + (i % 3 ? -12 : 8)}, 800 ${75 + i * 28}`}
            fill="none"
            opacity={0.7 - i * 0.015}
          />
        ))}
      </g>
    </svg>
  );
}

function HeroVisual() {
  return (
    <figure className="relative bg-paper-200 border border-ink-900/10 p-5 md:p-7 rounded-[2px] shadow-paper">
      <svg
        viewBox="0 0 400 540"
        className="w-full h-auto"
        fill="none"
        stroke="#2A2724"
        strokeWidth="1"
        aria-hidden
      >
        <rect x="40" y="40" width="320" height="420" className="fill-paper-50" />
        <rect x="40" y="40" width="320" height="420" />
        <path d="M40 200h320M40 320h320" />
        <path d="M200 40v420" opacity="0.6" />
        <g opacity="0.55">
          <circle cx="130" cy="120" r="3" />
          <circle cx="270" cy="120" r="3" />
          <circle cx="130" cy="260" r="3" />
          <circle cx="270" cy="260" r="3" />
          <circle cx="130" cy="390" r="3" />
          <circle cx="270" cy="390" r="3" />
        </g>
        <path d="M40 460h320" strokeWidth="1.2" />
        <path d="M70 470v20M330 470v20" opacity="0.5" />
        <text x="200" y="500" textAnchor="middle" fontSize="9" fill="#8C857B" letterSpacing="3">
          2400 MM
        </text>
        <g stroke="none">
          <rect x="40" y="490" width="22" height="22" fill="#8A9A82" />
          <rect x="72" y="490" width="22" height="22" fill="#B86E4F" />
          <rect x="104" y="490" width="22" height="22" fill="#2A2724" />
        </g>
        <text x="40" y="30" fontSize="8" fill="#8C857B" letterSpacing="2">
          ELEVATION — COMMISSION 024
        </text>
      </svg>
      <figcaption className="sr-only">Walnut credenza elevation study</figcaption>
    </figure>
  );
}

function SpecNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1.5 h-px w-4 bg-ink-400 shrink-0" />
      <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 leading-snug">
        {children}
      </span>
    </div>
  );
}

function Marquee() {
  const words = [
    "WHITE OAK",
    "WALNUT",
    "ASH",
    "CHERRY",
    "MAPLE",
    "RIFT-SAWN",
    "QUARTER-SAWN",
    "FIGURED",
  ];
  return (
    <div className="flex gap-14 pr-14 whitespace-nowrap font-display text-xl md:text-2xl text-ink-500 tracking-[0.04em]">
      {words.map((w, i) => (
        <span key={i} className="flex items-center gap-14">
          {w}
          <span className="text-clay-500 text-base">◆</span>
        </span>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-clay-500">{value}</div>
      <div className="text-xs uppercase tracking-widest text-ink-500 mt-2">{label}</div>
    </div>
  );
}

function ProcessDiagram() {
  return (
    <svg viewBox="0 0 500 500" className="w-full">
      <rect width="500" height="500" fill="#EFE8DC" rx="2" />
      <g fill="none" stroke="#B8AF9F" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx="250" cy="250" r={30 + i * 11} />
        ))}
      </g>
      <g fill="none" stroke="#8A9A82" strokeWidth="1.4" strokeLinecap="round">
        <path d="M250 80a170 170 0 0 1 170 170" />
        <path d="M250 420a170 170 0 0 1 -170 -170" />
      </g>
      <g fill="#2A2724" fontFamily="Georgia, serif" textAnchor="middle" fontSize="15" letterSpacing="1">
        <text x="250" y="64">Draw</text>
        <text x="436" y="256">Mill</text>
        <text x="250" y="446">Finish</text>
        <text x="64" y="256">Install</text>
      </g>
      <g fill="#B86E4F">
        <circle cx="250" cy="80" r="4" />
        <circle cx="420" cy="250" r="4" />
        <circle cx="250" cy="420" r="4" />
        <circle cx="80" cy="250" r="4" />
      </g>
      <g fill="#2A2724" fontFamily="Georgia, serif" textAnchor="middle" fontSize="13" fontStyle="italic">
        <text x="250" y="256">Atelier</text>
        <text x="250" y="274" fontSize="9" fontStyle="normal" letterSpacing="3" fill="#8C857B">NO. 01</text>
      </g>
    </svg>
  );
}

function ProductSkeletonGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-paper-200/60" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-paper-300/60 rounded w-1/3" />
            <div className="h-5 bg-paper-300/60 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyShelf() {
  return (
    <div className="card p-12 text-center">
      <div className="eyebrow mb-3">Shop currently empty</div>
      <h3 className="font-display text-2xl mb-4">Pieces are being finished.</h3>
      <p className="text-ink-500 max-w-lg mx-auto">
        The next batch is still on the bench. Head to the commission page to reserve a custom
        piece in the meantime.
      </p>
      <Link to="/contact" className="btn-ghost mt-8 inline-flex">Commission →</Link>
    </div>
  );
}
