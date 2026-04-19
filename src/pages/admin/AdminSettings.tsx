import { useEffect, useState } from "react";
import { getClient, type ShopSettingsRecord } from "../../lib/client";
import { useApp } from "../../context/AppContext";

interface Form {
  businessName: string;
  tagline: string;
  about: string;
  heroHeadline: string;
  heroSubheadline: string;
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
}

const EMPTY: Form = {
  businessName: "",
  tagline: "",
  about: "",
  heroHeadline: "",
  heroSubheadline: "",
  email: "",
  phone: "",
  address: "",
  instagramUrl: "",
};

export function AdminSettings() {
  const { setSettings } = useApp();
  const [form, setForm] = useState<Form>(EMPTY);
  const [existing, setExisting] = useState<ShopSettingsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const client = getClient();
    if (!client) return;
    (async () => {
      const { data } = await client.models.ShopSettings.list({ limit: 1 });
      const first = data?.[0] ?? null;
      setExisting(first);
      if (first) {
        setForm({
          businessName: first.businessName ?? "",
          tagline: first.tagline ?? "",
          about: first.about ?? "",
          heroHeadline: first.heroHeadline ?? "",
          heroSubheadline: first.heroSubheadline ?? "",
          email: first.email ?? "",
          phone: first.phone ?? "",
          address: first.address ?? "",
          instagramUrl: first.instagramUrl ?? "",
        });
      }
      setLoading(false);
    })();
  }, []);

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const client = getClient();
      if (!client) throw new Error("Backend unavailable.");
      const payload = {
        businessName: form.businessName.trim() || null,
        tagline: form.tagline.trim() || null,
        about: form.about.trim() || null,
        heroHeadline: form.heroHeadline.trim() || null,
        heroSubheadline: form.heroSubheadline.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        instagramUrl: form.instagramUrl.trim() || null,
      };
      const res = existing
        ? await client.models.ShopSettings.update({ id: existing.id, ...payload })
        : await client.models.ShopSettings.create(payload);
      if (res.data) {
        setExisting(res.data);
        setSettings(res.data);
      }
      setStatus("Saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-ink-500">Loading settings…</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="eyebrow mb-2">Branding</div>
        <h1 className="font-display text-3xl md:text-4xl">Shop settings</h1>
      </div>
      <form onSubmit={save} className="space-y-5">
        <Section title="Business">
          <Grid2>
            <Field label="Business name">
              <input
                className="field"
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="Hearth & Grain"
              />
            </Field>
            <Field label="Tagline">
              <input
                className="field"
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                placeholder="Bespoke Millwork Atelier"
              />
            </Field>
          </Grid2>
          <Field label="About the atelier">
            <textarea
              rows={5}
              className="field resize-y"
              value={form.about}
              onChange={(e) => update("about", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Home page hero">
          <Field label="Headline">
            <input
              className="field"
              value={form.heroHeadline}
              onChange={(e) => update("heroHeadline", e.target.value)}
            />
          </Field>
          <Field label="Subheadline">
            <textarea
              rows={2}
              className="field resize-y"
              value={form.heroSubheadline}
              onChange={(e) => update("heroSubheadline", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Contact">
          <Grid2>
            <Field label="Email">
              <input
                className="field"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input
                className="field"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
          </Grid2>
          <Field label="Address">
            <textarea
              rows={3}
              className="field resize-y"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </Field>
          <Field label="Instagram URL">
            <input
              className="field"
              value={form.instagramUrl}
              onChange={(e) => update("instagramUrl", e.target.value)}
            />
          </Field>
        </Section>

        {status ? (
          <div className="text-sm text-patina-300 bg-patina-500/10 border border-patina-500/30 rounded-lg p-3">
            {status}
          </div>
        ) : null}

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6 space-y-4">
      <h2 className="font-display text-lg">{title}</h2>
      {children}
    </section>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
