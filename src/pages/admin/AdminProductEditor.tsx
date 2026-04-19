import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getClient, type ProductRecord } from "../../lib/client";
import { deleteProductImage, resolveImageUrl, uploadProductImage } from "../../lib/images";
import { slugify } from "../../lib/format";

interface FormState {
  name: string;
  slug: string;
  description: string;
  story: string;
  priceDollars: string;
  currency: string;
  category: string;
  materials: string;
  dimensions: string;
  weightOz: string;
  leadTimeDays: string;
  inventory: string;
  shippingDollars: string;
  freeShippingThresholdDollars: string;
  active: boolean;
  featured: boolean;
  stripeProductId: string;
  stripePriceId: string;
}

const EMPTY: FormState = {
  name: "",
  slug: "",
  description: "",
  story: "",
  priceDollars: "",
  currency: "usd",
  category: "",
  materials: "",
  dimensions: "",
  weightOz: "",
  leadTimeDays: "",
  inventory: "0",
  shippingDollars: "0",
  freeShippingThresholdDollars: "",
  active: true,
  featured: false,
  stripeProductId: "",
  stripePriceId: "",
};

export function AdminProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!id) return;
    const client = getClient();
    if (!client) return;
    (async () => {
      const { data, errors } = await client.models.Product.get({ id });
      if (errors && errors.length > 0) {
        setError(errors[0].message);
        setLoading(false);
        return;
      }
      if (!data) {
        setError("Product not found.");
        setLoading(false);
        return;
      }
      setForm(fromRecord(data));
      const keys = ((data.images ?? []) as (string | null)[]).filter(
        (k: string | null): k is string => Boolean(k)
      );
      setImages(keys);
      const entries = await Promise.all(
        keys.map(async (k: string) => [k, await resolveImageUrl(k)] as const)
      );
      setImageUrls(Object.fromEntries(entries));
      setSlugTouched(true);
      setLoading(false);
    })();
  }, [id]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (val: string) => {
    update("name", val);
    if (!slugTouched) update("slug", slugify(val));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const keys: string[] = [];
      for (const file of Array.from(files)) {
        const key = await uploadProductImage(file);
        keys.push(key);
        const url = await resolveImageUrl(key);
        setImageUrls((prev) => ({ ...prev, [key]: url }));
      }
      setImages((prev) => [...prev, ...keys]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = async (key: string) => {
    setImages((prev) => prev.filter((k) => k !== key));
    await deleteProductImage(key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    const priceCents = Math.round(parseFloat(form.priceDollars || "0") * 100);
    if (!Number.isFinite(priceCents) || priceCents < 0) {
      setError("Price must be a positive number.");
      return;
    }
    setSaving(true);
    try {
      const client = getClient();
      if (!client) throw new Error("Backend unavailable.");
      const payload = {
        name: form.name.trim(),
        slug: slugify(form.slug),
        description: form.description.trim() || null,
        story: form.story.trim() || null,
        priceCents,
        currency: form.currency.trim().toLowerCase() || "usd",
        images: images,
        category: form.category.trim() || null,
        materials: form.materials.trim() || null,
        dimensions: form.dimensions.trim() || null,
        weightOz: form.weightOz ? parseFloat(form.weightOz) : null,
        leadTimeDays: form.leadTimeDays ? parseInt(form.leadTimeDays, 10) : null,
        inventory: parseInt(form.inventory || "0", 10),
        shippingFlatCents: Math.round(parseFloat(form.shippingDollars || "0") * 100),
        freeShippingThresholdCents: form.freeShippingThresholdDollars
          ? Math.round(parseFloat(form.freeShippingThresholdDollars) * 100)
          : null,
        active: form.active,
        featured: form.featured,
        stripeProductId: form.stripeProductId.trim() || null,
        stripePriceId: form.stripePriceId.trim() || null,
      };
      if (id) {
        await client.models.Product.update({ id, ...payload });
      } else {
        await client.models.Product.create(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-ink-500">Loading…</div>;
  }

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/products"
        className="text-xs uppercase tracking-widest text-ink-500 hover:text-clay-500"
      >
        ← Back to products
      </Link>
      <h1 className="font-display text-3xl md:text-4xl mt-4 mb-8">
        {id ? "Edit product" : "New product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="Essentials">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name" required>
              <input
                className="field"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                className="field font-mono"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", e.target.value);
                }}
              />
            </Field>
            <Field label="Category">
              <input
                className="field"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="Signage, Hardware, Gifts…"
              />
            </Field>
            <Field label="Price (USD)" required>
              <input
                type="number"
                step="0.01"
                min="0"
                className="field font-mono"
                value={form.priceDollars}
                onChange={(e) => update("priceDollars", e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Short description">
            <textarea
              className="field resize-y"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </Field>
          <Field label="Maker's note / story">
            <textarea
              className="field resize-y"
              rows={4}
              value={form.story}
              onChange={(e) => update("story", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Photography">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((key) => (
              <div
                key={key}
                className="relative aspect-square rounded-lg overflow-hidden border border-ink-900/10 bg-paper-200 group"
              >
                {imageUrls[key] ? (
                  <img
                    src={imageUrls[key]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-500 text-xs">
                    loading
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(key)}
                  className="absolute top-2 right-2 bg-paper-100/90 text-clay-400 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-ink-900/15 rounded-lg flex items-center justify-center cursor-pointer hover:border-clay-500 transition text-xs text-ink-500 text-center p-4">
              {uploading ? "Uploading…" : "+ Add photos"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </label>
          </div>
          <p className="text-xs text-ink-500 mt-3">
            First image is the hero. Upload as many as you like — JPG, PNG, or WebP.
          </p>
        </Section>

        <Section title="Specs">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Materials">
              <input
                className="field"
                value={form.materials}
                onChange={(e) => update("materials", e.target.value)}
                placeholder="1/4 hot-rolled steel, walnut"
              />
            </Field>
            <Field label="Dimensions">
              <input
                className="field"
                value={form.dimensions}
                onChange={(e) => update("dimensions", e.target.value)}
                placeholder='12" × 8" × 0.25"'
              />
            </Field>
            <Field label="Weight (oz)">
              <input
                type="number"
                step="0.1"
                className="field font-mono"
                value={form.weightOz}
                onChange={(e) => update("weightOz", e.target.value)}
              />
            </Field>
            <Field label="Lead time (days)">
              <input
                type="number"
                className="field font-mono"
                value={form.leadTimeDays}
                onChange={(e) => update("leadTimeDays", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Inventory & shipping">
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Units in stock">
              <input
                type="number"
                className="field font-mono"
                value={form.inventory}
                onChange={(e) => update("inventory", e.target.value)}
              />
            </Field>
            <Field label="Shipping (USD, per unit)">
              <input
                type="number"
                step="0.01"
                min="0"
                className="field font-mono"
                value={form.shippingDollars}
                onChange={(e) => update("shippingDollars", e.target.value)}
              />
            </Field>
            <Field label="Free over (USD, optional)">
              <input
                type="number"
                step="0.01"
                min="0"
                className="field font-mono"
                value={form.freeShippingThresholdDollars}
                onChange={(e) => update("freeShippingThresholdDollars", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Visibility & Stripe">
          <div className="grid md:grid-cols-2 gap-4">
            <Toggle
              label="Active (visible in shop)"
              checked={form.active}
              onChange={(v) => update("active", v)}
            />
            <Toggle
              label="Featured on homepage"
              checked={form.featured}
              onChange={(v) => update("featured", v)}
            />
            <Field label="Stripe product ID (optional)">
              <input
                className="field font-mono"
                value={form.stripeProductId}
                onChange={(e) => update("stripeProductId", e.target.value)}
              />
            </Field>
            <Field label="Stripe price ID (optional)">
              <input
                className="field font-mono"
                value={form.stripePriceId}
                onChange={(e) => update("stripePriceId", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        {error ? (
          <div className="text-sm text-clay-400 bg-clay-500/10 border border-clay-500/30 rounded-lg p-3">
            {error}
          </div>
        ) : null}

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : id ? "Save changes" : "Publish product"}
          </button>
          <Link to="/admin/products" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function fromRecord(p: ProductRecord): FormState {
  return {
    name: p.name ?? "",
    slug: p.slug ?? "",
    description: p.description ?? "",
    story: p.story ?? "",
    priceDollars: p.priceCents != null ? (p.priceCents / 100).toFixed(2) : "",
    currency: p.currency ?? "usd",
    category: p.category ?? "",
    materials: p.materials ?? "",
    dimensions: p.dimensions ?? "",
    weightOz: p.weightOz != null ? String(p.weightOz) : "",
    leadTimeDays: p.leadTimeDays != null ? String(p.leadTimeDays) : "",
    inventory: p.inventory != null ? String(p.inventory) : "0",
    shippingDollars:
      p.shippingFlatCents != null ? (p.shippingFlatCents / 100).toFixed(2) : "0",
    freeShippingThresholdDollars:
      p.freeShippingThresholdCents != null
        ? (p.freeShippingThresholdCents / 100).toFixed(2)
        : "",
    active: p.active ?? true,
    featured: p.featured ?? false,
    stripeProductId: p.stripeProductId ?? "",
    stripePriceId: p.stripePriceId ?? "",
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="font-display text-lg mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">
        {label} {required ? <span className="text-clay-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none py-2">
      <span
        className={`w-11 h-6 rounded-full relative transition ${
          checked ? "bg-clay-500" : "bg-paper-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-ink-50 transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-ink-900">{label}</span>
    </label>
  );
}
