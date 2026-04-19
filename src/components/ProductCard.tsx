import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ProductRecord } from "../lib/client";
import { resolveImageUrl } from "../lib/images";
import { formatCents } from "../lib/format";

export function ProductCard({ product }: { product: ProductRecord }) {
  const [imgUrl, setImgUrl] = useState("");
  const firstImage = product.images?.[0] ?? "";

  useEffect(() => {
    let cancelled = false;
    if (!firstImage) {
      setImgUrl("");
      return;
    }
    resolveImageUrl(firstImage).then((u) => {
      if (!cancelled) setImgUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [firstImage]);

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group block card overflow-hidden hover:-translate-y-1 transition-transform duration-500"
    >
      <div className="aspect-[4/5] bg-gradient-to-br from-ink-800 to-ink-900 overflow-hidden relative">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <SilhouettePlaceholder />
        )}
        {product.featured ? (
          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-clay-500/90 text-ink-900 font-semibold">
            Featured
          </span>
        ) : null}
        {(product.inventory ?? 0) <= 0 && product.active ? (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 rounded-full bg-paper-100/90 border border-ink-900/15">
            Made to order
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-3">
          <div>
            {product.category ? (
              <div className="eyebrow mb-2">{product.category}</div>
            ) : null}
            <h3 className="font-display text-lg text-ink-50 group-hover:text-clay-400 transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="text-ink-900 font-medium">{formatCents(product.priceCents, product.currency ?? "usd")}</div>
        </div>
        {product.materials ? (
          <div className="mt-2 text-xs text-ink-500 font-mono truncate">{product.materials}</div>
        ) : null}
      </div>
    </Link>
  );
}

function SilhouettePlaceholder() {
  return (
    <svg viewBox="0 0 200 250" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#332b21" />
          <stop offset="1" stopColor="#0f0c09" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="url(#g1)" />
      <g stroke="#4a3f30" strokeWidth="1" fill="none">
        <circle cx="100" cy="125" r="60" />
        <circle cx="100" cy="125" r="40" />
        <circle cx="100" cy="125" r="20" />
        <path d="M40 125h120M100 65v120" />
      </g>
      <circle cx="100" cy="125" r="4" fill="#e77423" />
    </svg>
  );
}
