import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getClient, type ProductRecord } from "../lib/client";
import { resolveImageUrl } from "../lib/images";
import { formatCents } from "../lib/format";
import { useCart } from "../lib/cart";
import { useApp } from "../context/AppContext";
import { findPreviewProductBySlug } from "../lib/previewProducts";

export function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { amplifyConfigured } = useApp();
  const { add } = useCart();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    if (!amplifyConfigured) {
      const preview = findPreviewProductBySlug(slug);
      setProduct(preview);
      const imgs = (preview?.images?.filter(Boolean) as string[] | undefined) ?? [];
      setImageUrls(imgs);
      setLoading(false);
      return;
    }
    const client = getClient();
    if (!client) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await client.models.Product.list({
          filter: { slug: { eq: slug } },
          limit: 1,
        });
        if (cancelled) return;
        const found = data?.[0] ?? null;
        setProduct(found);
        if (found?.images) {
          const urls = await Promise.all(
            (found.images.filter(Boolean) as string[]).map((k) => resolveImageUrl(k))
          );
          if (!cancelled) setImageUrls(urls);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, amplifyConfigured]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="card aspect-[4/5] animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-paper-200/80 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-paper-200/80 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-paper-200/80 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl mb-4">Piece not found</h1>
        <p className="text-ink-500 mb-6">That listing may have sold or been renamed.</p>
        <Link to="/shop" className="btn-primary">Back to the shop</Link>
      </div>
    );
  }

  const inStock = (product.inventory ?? 0) > 0;
  const heroImg = imageUrls[activeIdx] ?? "";

  const handleAdd = () => {
    add({
      productId: product.id,
      name: product.name,
      priceCents: product.priceCents,
      quantity: qty,
      image: heroImg,
      shippingFlatCents: product.shippingFlatCents ?? 0,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <Link
        to="/shop"
        className="text-xs uppercase tracking-[0.25em] text-ink-500 hover:text-clay-500"
      >
        ← Back to shop
      </Link>
      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div>
          <div className="card overflow-hidden aspect-[4/5] bg-paper-200">
            {heroImg ? (
              <img
                src={heroImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-500 font-mono text-xs">
                no photo yet
              </div>
            )}
          </div>
          {imageUrls.length > 1 ? (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {imageUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`w-20 h-24 rounded-lg overflow-hidden border flex-shrink-0 ${
                    i === activeIdx ? "border-clay-500" : "border-ink-900/10"
                  }`}
                >
                  {url ? (
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          {product.category ? <div className="eyebrow mb-3">{product.category}</div> : null}
          <h1 className="font-display text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-3xl font-display text-clay-500">
              {formatCents(product.priceCents, product.currency ?? "usd")}
            </span>
            <span
              className={`text-xs uppercase tracking-widest ${
                inStock ? "text-patina-300" : "text-clay-400"
              }`}
            >
              {inStock
                ? `${product.inventory} in stock`
                : `Made to order · ${product.leadTimeDays ?? 14}d lead`}
            </span>
          </div>

          {product.description ? (
            <p className="mt-8 text-ink-700 leading-relaxed text-lg">{product.description}</p>
          ) : null}

          {product.story ? (
            <div className="mt-8 card p-6">
              <div className="eyebrow mb-3">Maker's note</div>
              <p className="text-ink-700 leading-relaxed italic">{product.story}</p>
            </div>
          ) : null}

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {product.materials ? <Spec label="Materials" value={product.materials} /> : null}
            {product.dimensions ? <Spec label="Dimensions" value={product.dimensions} /> : null}
            {product.weightOz ? (
              <Spec label="Weight" value={`${product.weightOz} oz`} />
            ) : null}
            {product.leadTimeDays ? (
              <Spec label="Lead time" value={`${product.leadTimeDays} days`} />
            ) : null}
          </dl>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-ink-900/10/15 rounded-full overflow-hidden">
              <button
                className="px-4 py-2 text-lg hover:bg-paper-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-500"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-mono text-lg">{qty}</span>
              <button
                className="px-4 py-2 text-lg hover:bg-paper-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-500"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button onClick={handleAdd} className="btn-ghost">
              {added ? "Added ✓" : "Add to cart"}
            </button>
            <button onClick={handleBuyNow} className="btn-primary">
              Buy now
            </button>
          </div>

          <div className="mt-8 text-xs text-ink-500 flex flex-wrap gap-4">
            <span>
              Shipping:{" "}
              {product.shippingFlatCents && product.shippingFlatCents > 0
                ? formatCents(product.shippingFlatCents)
                : "Free"}
            </span>
            <span>·</span>
            <span>Made in a one-person garage · Small-batch or one-off</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <dt className="eyebrow mb-1">{label}</dt>
      <dd className="text-ink-900 font-mono text-sm">{value}</dd>
    </div>
  );
}
