import { uploadData } from "aws-amplify/storage";
import { getClient } from "./client";

const SEED_KEY = "products-seeded-v1";

interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  story: string;
  priceCents: number;
  category: string;
  materials: string;
  dimensions: string;
  weightOz: number;
  leadTimeDays: number;
  inventory: number;
  shippingFlatCents: number;
  freeShippingThresholdCents: number;
  featured: boolean;
  svg: string;
}

function wrapSvg(bg: string, fg: string, body: string, accent: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <filter id="g" x="0" y="0">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
    </filter>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.5" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="800" height="800" fill="${bg}"/>
  <rect width="800" height="800" fill="url(#grid)"/>
  <g fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    ${body}
  </g>
  <rect width="800" height="800" filter="url(#g)" opacity="0.5"/>
</svg>`;
}

const PRODUCTS: SeedProduct[] = [
  {
    name: "Hearth & Grain White Oak Address Plaque",
    slug: "hearth-grain-oak-address-plaque",
    description:
      "A low-profile house number sign plasma-cut from 1/8\" hot-rolled steel, hand-sanded and sealed with a matte clear coat. Four hidden standoffs included.",
    story:
      "Drawn on the kitchen table, programmed at 6am, cut while the coffee brewed. Every sign we ship is a one-of-one.",
    priceCents: 14800,
    category: "Signage",
    materials: "1/8\" hot-rolled steel, matte sealer, stainless standoffs",
    dimensions: "18\" × 6\" × 1\" standoff depth",
    weightOz: 72,
    leadTimeDays: 10,
    inventory: 6,
    shippingFlatCents: 1800,
    freeShippingThresholdCents: 20000,
    featured: true,
    svg: wrapSvg(
      "#F5F1EA",
      "#2E2822",
      `<rect x="120" y="280" width="560" height="240" rx="10"/>
       <text x="400" y="440" font-family="Georgia, serif" font-size="140" text-anchor="middle" stroke="none" fill="#2E2822">1924</text>
       <line x1="120" y1="560" x2="680" y2="560"/>
       <text x="400" y="610" font-family="Helvetica, sans-serif" font-size="28" letter-spacing="12" text-anchor="middle" stroke="none" fill="#6E6557">ALDERWOOD LN</text>
       <circle cx="160" cy="320" r="6" fill="#2E2822"/>
       <circle cx="640" cy="320" r="6" fill="#2E2822"/>
       <circle cx="160" cy="480" r="6" fill="#2E2822"/>
       <circle cx="640" cy="480" r="6" fill="#2E2822"/>`,
      "#B8673F"
    ),
  },
  {
    name: "Machined Aluminum Coaster Set (4)",
    slug: "machined-aluminum-coaster-set",
    description:
      "Four 4\" round coasters turned from 6061 aluminum billet with a concentric record-groove finish. Backed with cork to protect fine furniture.",
    story:
      "Tool path runs from the outside in — the rings you see are the last pass, left raw from the end mill.",
    priceCents: 9200,
    category: "Tabletop",
    materials: "6061 aluminum, natural cork backing",
    dimensions: "4\" ⌀ × 1/4\" thick",
    weightOz: 18,
    leadTimeDays: 5,
    inventory: 12,
    shippingFlatCents: 900,
    freeShippingThresholdCents: 20000,
    featured: true,
    svg: wrapSvg(
      "#FAF9F6",
      "#4A4238",
      `<g transform="translate(400 400)">
        ${Array.from({ length: 22 })
          .map((_, i) => `<circle r="${60 + i * 10}" stroke-width="${i === 21 ? 2.2 : 0.8}"/>`)
          .join("\n")}
        <circle r="8" fill="#B8673F" stroke="none"/>
      </g>
      <text x="400" y="740" font-family="Helvetica, sans-serif" font-size="20" letter-spacing="8" text-anchor="middle" stroke="none" fill="#6E6557">6061 — TURNED IN-HOUSE</text>`,
      "#5A6B84"
    ),
  },
  {
    name: "Engraved Walnut Cutting Board",
    slug: "engraved-walnut-cutting-board",
    description:
      "Edge-grain black walnut cutting board with a laser-traced topographic map of the Cascades. Food-safe mineral-oil finish, juice groove, and recessed side handles.",
    story:
      "The topo lines were vectorized from a 1962 USGS quad sheet. Each board is signed and dated on the underside.",
    priceCents: 18500,
    category: "Kitchen",
    materials: "Edge-grain black walnut, food-safe mineral oil & beeswax",
    dimensions: "18\" × 12\" × 1.25\"",
    weightOz: 88,
    leadTimeDays: 14,
    inventory: 4,
    shippingFlatCents: 1400,
    freeShippingThresholdCents: 20000,
    featured: true,
    svg: wrapSvg(
      "#ECE5D8",
      "#4A4238",
      `<rect x="120" y="160" width="560" height="480" rx="18" fill="#DDD3BF" stroke="#4A4238"/>
       <g stroke="#4A4238" stroke-width="1.2" fill="none" opacity="0.75">
         ${Array.from({ length: 10 })
           .map(
             (_, i) =>
               `<path d="M ${160 + i * 8} ${600 - i * 30} Q ${380 + i * 4} ${420 - i * 40} ${
                 640 - i * 6
               } ${580 - i * 20}"/>`
           )
           .join("\n")}
       </g>
       <circle cx="400" cy="380" r="6" fill="#B8673F" stroke="none"/>
       <text x="400" y="700" font-family="Georgia, serif" font-size="22" letter-spacing="6" text-anchor="middle" stroke="none" fill="#4A4238">CASCADES · N 44° 24'</text>`,
      "#763820"
    ),
  },
  {
    name: "Blackened Steel Shelf Brackets (Pair)",
    slug: "blackened-steel-shelf-brackets",
    description:
      "A pair of 10\" L-brackets water-jet cut from 3/16\" mild steel, hot-blackened, and waxed. Pre-drilled for #10 wood screws (hardware not included).",
    story:
      "Inspired by the turn-of-the-century shop corbels in our own garage — simplified, squared, and blackened by hand in a raku pit.",
    priceCents: 6400,
    category: "Hardware",
    materials: "3/16\" mild steel, hot-black oxide, paste wax",
    dimensions: "10\" × 8\" × 3/16\"",
    weightOz: 48,
    leadTimeDays: 7,
    inventory: 20,
    shippingFlatCents: 1100,
    freeShippingThresholdCents: 20000,
    featured: false,
    svg: wrapSvg(
      "#F5F1EA",
      "#1F1B15",
      `<path d="M 200 180 L 620 180 L 620 240 L 280 240 L 280 620 L 200 620 Z" fill="#2E2822"/>
       <path d="M 200 180 L 620 180 L 620 240 L 280 240 L 280 620 L 200 620 Z"/>
       <circle cx="320" cy="210" r="6" fill="#F5F1EA" stroke="#F5F1EA"/>
       <circle cx="420" cy="210" r="6" fill="#F5F1EA" stroke="#F5F1EA"/>
       <circle cx="520" cy="210" r="6" fill="#F5F1EA" stroke="#F5F1EA"/>
       <circle cx="240" cy="320" r="6" fill="#F5F1EA" stroke="#F5F1EA"/>
       <circle cx="240" cy="440" r="6" fill="#F5F1EA" stroke="#F5F1EA"/>
       <circle cx="240" cy="560" r="6" fill="#F5F1EA" stroke="#F5F1EA"/>
       <text x="400" y="720" font-family="Helvetica, sans-serif" font-size="22" letter-spacing="10" text-anchor="middle" stroke="none" fill="#4A4238">PAIR · HOT-BLACKENED</text>`,
      "#9A4E2B"
    ),
  },
  {
    name: "Brass Inlay Drink Tray",
    slug: "brass-inlay-drink-tray",
    description:
      "White oak serving tray with a hand-routed brass inlay compass rose. Hand-planed rim and iron-on felt feet so it never scratches the bar.",
    story:
      "Four evenings of chasing the inlay with a 1/16\" end mill. The brass is polished, then rubbed back with 0000 steel wool for a low sheen.",
    priceCents: 22400,
    category: "Tabletop",
    materials: "White oak, solid brass inlay, hard wax oil finish",
    dimensions: "16\" × 10\" × 1.5\"",
    weightOz: 44,
    leadTimeDays: 18,
    inventory: 3,
    shippingFlatCents: 1600,
    freeShippingThresholdCents: 20000,
    featured: true,
    svg: wrapSvg(
      "#F5F1EA",
      "#4A4238",
      `<rect x="140" y="220" width="520" height="360" rx="14" fill="#DDD3BF" stroke="#4A4238"/>
       <g transform="translate(400 400)" stroke="#9A4E2B" stroke-width="2">
         <circle r="110" fill="none"/>
         <circle r="80" fill="none"/>
         <path d="M 0 -110 L 12 0 L 0 110 L -12 0 Z" fill="#B8673F" stroke="#763820"/>
         <path d="M -110 0 L 0 12 L 110 0 L 0 -12 Z" fill="#EBC9B1" stroke="#763820"/>
         <circle r="8" fill="#763820" stroke="none"/>
       </g>
       <text x="400" y="650" font-family="Georgia, serif" font-size="24" letter-spacing="8" text-anchor="middle" stroke="none" fill="#4A4238">N   ·   E   ·   S   ·   W</text>`,
      "#B8673F"
    ),
  },
  {
    name: "Custom CNC Monogram Commission",
    slug: "custom-cnc-monogram-commission",
    description:
      "Start-to-finish custom monogram: send us a letter pairing, a material preference (steel, aluminum, brass, walnut, cherry), and a size up to 24\". We draw, proof, and cut.",
    story:
      "The work that keeps the garage lit. Turnaround is typically 3–4 weeks including one round of revisions.",
    priceCents: 38000,
    category: "Commissions",
    materials: "Your choice — steel, aluminum, brass, walnut, or cherry",
    dimensions: "Up to 24\" on longest side",
    weightOz: 120,
    leadTimeDays: 28,
    inventory: 0,
    shippingFlatCents: 2400,
    freeShippingThresholdCents: 20000,
    featured: true,
    svg: wrapSvg(
      "#FAF9F6",
      "#2E2822",
      `<g transform="translate(400 400)">
         <circle r="220" fill="none" stroke-width="1.5"/>
         <circle r="180" fill="none" stroke-width="0.8" opacity="0.5"/>
         <text y="40" font-family="Georgia, serif" font-size="260" text-anchor="middle" font-style="italic" stroke="none" fill="#2E2822">A</text>
         <text y="40" font-family="Georgia, serif" font-size="260" text-anchor="middle" font-style="italic" stroke="none" fill="#B8673F" opacity="0.6" transform="translate(40 0)">M</text>
       </g>
       <text x="400" y="720" font-family="Helvetica, sans-serif" font-size="22" letter-spacing="10" text-anchor="middle" stroke="none" fill="#6E6557">COMMISSION · DRAWN TO SCALE</text>`,
      "#6B8A7A"
    ),
  },
  {
    name: "Raw Steel Bookends (Pair)",
    slug: "raw-steel-bookends",
    description:
      "A pair of cold-rolled steel bookends with laser-etched fold lines and a raw mill finish. Self-weighted — no felt pads or ballast needed.",
    story:
      "A study in how far a single sheet of 11-gauge steel can bend before it asks to be welded.",
    priceCents: 7800,
    category: "Desk",
    materials: "11-gauge cold-rolled steel, raw mill finish",
    dimensions: "6\" × 5\" × 5\" (each)",
    weightOz: 56,
    leadTimeDays: 9,
    inventory: 14,
    shippingFlatCents: 1200,
    freeShippingThresholdCents: 20000,
    featured: false,
    svg: wrapSvg(
      "#ECE5D8",
      "#2E2822",
      `<path d="M 200 260 L 380 260 L 380 560 L 480 560" fill="#D6CFC1" stroke="#2E2822" stroke-width="3"/>
       <path d="M 420 260 L 600 260 L 600 560 L 500 560" fill="#D6CFC1" stroke="#2E2822" stroke-width="3"/>
       <line x1="380" y1="260" x2="380" y2="560" stroke="#6E6557" stroke-dasharray="4 6"/>
       <line x1="420" y1="260" x2="420" y2="560" stroke="#6E6557" stroke-dasharray="4 6"/>
       <text x="400" y="690" font-family="Helvetica, sans-serif" font-size="22" letter-spacing="10" text-anchor="middle" stroke="none" fill="#4A4238">BEND · ONCE · WEIGH · ONCE</text>`,
      "#5A6B84"
    ),
  },
];

async function uploadSvg(slug: string, svg: string, index: number): Promise<string> {
  const key = `product-images/seed-${slug}-${index}.svg`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const op = uploadData({
    path: key,
    data: blob,
    options: { contentType: "image/svg+xml" },
  });
  await op.result;
  return key;
}

let seedRunning = false;

export async function seedShopIfNeeded(): Promise<void> {
  if (seedRunning) return;
  const client = getClient();
  if (!client) return;
  seedRunning = true;
  try {
    const existing = await client.models.SeedFlag.list({
      filter: { key: { eq: SEED_KEY } },
      limit: 1,
    });
    if (existing.data && existing.data.length > 0) return;

    const current = await client.models.Product.list({ limit: 1 });
    if (current.data && current.data.length > 0) {
      await client.models.SeedFlag.create({ key: SEED_KEY, value: new Date().toISOString() });
      return;
    }

    for (const p of PRODUCTS) {
      const imageKey = await uploadSvg(p.slug, p.svg, 0);
      await client.models.Product.create({
        name: p.name,
        slug: p.slug,
        description: p.description,
        story: p.story,
        priceCents: p.priceCents,
        currency: "usd",
        images: [imageKey],
        category: p.category,
        materials: p.materials,
        dimensions: p.dimensions,
        weightOz: p.weightOz,
        leadTimeDays: p.leadTimeDays,
        inventory: p.inventory,
        shippingFlatCents: p.shippingFlatCents,
        freeShippingThresholdCents: p.freeShippingThresholdCents,
        active: true,
        featured: p.featured,
      });
    }

    await client.models.SeedFlag.create({ key: SEED_KEY, value: new Date().toISOString() });
  } catch {
    /* ignore — seeding is best-effort */
  } finally {
    seedRunning = false;
  }
}
