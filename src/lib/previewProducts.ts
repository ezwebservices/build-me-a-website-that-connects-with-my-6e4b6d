import type { ProductRecord } from "./client";

function svgImage(bg: string, fg: string, accent: string, body: string): string {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bgg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#0c0a08"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0L0 0 0 40" fill="none" stroke="${accent}" stroke-width="0.4" opacity="0.45"/>
    </pattern>
  </defs>
  <rect width="800" height="1000" fill="url(#bgg)"/>
  <rect width="800" height="1000" fill="url(#grid)"/>
  <g fill="none" stroke="${fg}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${body}</g>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const NOW = new Date().toISOString();

const RAW = [
  {
    id: "preview-walnut-console",
    slug: "walnut-live-edge-console",
    name: "Walnut Live-Edge Console",
    category: "Furniture",
    description:
      "A 60\" hallway console milled from a single walnut slab with hand-finished waterfall edges and tapered blackened-steel legs.",
    story: "Slab found at a local mill — air-dried for two winters. The grain pattern dictated the exact length.",
    priceCents: 248000,
    materials: "Black walnut · cold-rolled steel · hand-rubbed oil",
    dimensions: '60" × 14" × 30" H',
    weightOz: 1280,
    leadTimeDays: 28,
    inventory: 1,
    shippingFlatCents: 14500,
    featured: true,
    images: [
      svgImage("#2a221a", "#c9a172", "#8a6a44", `
        <path d="M120 540 Q140 520 200 522 T440 530 T700 545 L700 600 L120 600 Z"/>
        <path d="M180 600 L200 880"/>
        <path d="M620 600 L640 880"/>
        <path d="M120 540 Q200 535 400 538 T700 545"/>
        <path d="M150 870 L210 870"/>
        <path d="M610 870 L670 870"/>
      `),
      svgImage("#1f1a14", "#d6b489", "#9b7a52", `
        <rect x="160" y="520" width="480" height="80" rx="6"/>
        <line x1="200" y1="600" x2="200" y2="860"/>
        <line x1="600" y1="600" x2="600" y2="860"/>
      `),
    ],
  },
  {
    id: "preview-brass-coasters",
    slug: "machined-brass-coaster-set",
    name: "Machined Brass Coaster Set (4)",
    category: "Tabletop",
    description: 'Four 4" coasters turned from solid brass with concentric record-groove finish and felt base.',
    story: "Toolpath runs outside-in — last pass left raw from the end mill.",
    priceCents: 16800,
    materials: "Solid brass · felt base",
    dimensions: '4" ⌀ × 1/4" thick',
    weightOz: 22,
    leadTimeDays: 5,
    inventory: 12,
    shippingFlatCents: 900,
    featured: true,
    images: [
      svgImage("#2a2218", "#e7c97a", "#a3823a", `
        <g transform="translate(400 500)">
          ${Array.from({ length: 22 }).map((_, i) => `<circle r="${60 + i * 11}" stroke-width="${i === 21 ? 2.4 : 0.8}"/>`).join("")}
        </g>`),
    ],
  },
  {
    id: "preview-ash-bracket",
    slug: "ash-steel-shelf-bracket",
    name: "Ash & Steel Shelf Bracket",
    category: "Hardware",
    description: 'Pair of L-brackets pairing 1/4" hot-rolled steel with hand-shaped white ash caps. 9" deep, 11" tall.',
    story: "Designed for the studio's own shelves before the first pair shipped to a customer.",
    priceCents: 9200,
    materials: "White ash · 1/4\" cold-rolled steel · clear sealer",
    dimensions: '11" H × 9" D',
    weightOz: 36,
    leadTimeDays: 7,
    inventory: 8,
    shippingFlatCents: 1200,
    featured: false,
    images: [
      svgImage("#1c1814", "#b89060", "#5a4630", `
        <path d="M260 320 L260 720 L600 720"/>
        <path d="M260 720 L600 320"/>
        <rect x="240" y="300" width="40" height="80" rx="4"/>
        <rect x="580" y="700" width="80" height="40" rx="4"/>
      `),
    ],
  },
  {
    id: "preview-cherry-board",
    slug: "engraved-cherry-cutting-board",
    name: "Engraved Cherry Cutting Board",
    category: "Kitchen",
    description: 'A 16" × 11" American cherry cutting board with optional CNC-engraved monogram and food-safe wax finish.',
    story: "Tested in the maker's own kitchen — three years in and still flat as the day it left the bench.",
    priceCents: 13400,
    materials: "American cherry · food-safe wax",
    dimensions: '16" × 11" × 1.25"',
    weightOz: 64,
    leadTimeDays: 10,
    inventory: 6,
    shippingFlatCents: 1500,
    featured: false,
    images: [
      svgImage("#221915", "#d99165", "#7a4f30", `
        <rect x="170" y="260" width="460" height="640" rx="40"/>
        <text x="400" y="600" font-family="Georgia, serif" font-size="120" text-anchor="middle" stroke="none" fill="#d99165">M</text>
      `),
    ],
  },
  {
    id: "preview-cascades-map",
    slug: "topographic-wall-map-cascades",
    name: "Topographic Wall Map — Cascades",
    category: "Wall Art",
    description: '24" × 36" five-layer Baltic birch relief map of the Cascade range, hand-stained and shadow-mounted.',
    story: "Elevation data sourced from USGS, sliced into five contour layers and stack-glued by hand.",
    priceCents: 42000,
    materials: "Baltic birch ply · hand stain · shadow mount",
    dimensions: '24" × 36" × 1.5"',
    weightOz: 96,
    leadTimeDays: 21,
    inventory: 2,
    shippingFlatCents: 4200,
    featured: true,
    images: [
      svgImage("#1a1612", "#9bb39b", "#4f6a52", `
        <path d="M100 700 Q260 500 400 600 T700 540"/>
        <path d="M100 760 Q260 580 400 660 T700 620"/>
        <path d="M100 820 Q260 660 400 720 T700 700"/>
        <path d="M100 880 Q260 740 400 780 T700 780"/>
      `),
    ],
  },
  {
    id: "preview-rosewood-box",
    slug: "inlaid-rosewood-jewelry-box",
    name: "Inlaid Rosewood Jewelry Box",
    category: "Gifts",
    description: 'Hinged rosewood box with maple inlay top, soft-close lid, velvet-lined interior. 8" × 5" × 3".',
    story: "Inlay pattern echoes the studio's logo — mirrored across the lid for a hand-cut look.",
    priceCents: 31500,
    materials: "Rosewood · maple inlay · velvet lining · brass hinges",
    dimensions: '8" × 5" × 3"',
    weightOz: 28,
    leadTimeDays: 14,
    inventory: 3,
    shippingFlatCents: 1800,
    featured: false,
    images: [
      svgImage("#22130c", "#d8a26b", "#7a4225", `
        <rect x="200" y="380" width="400" height="240" rx="10"/>
        <path d="M200 460 L600 460"/>
        <path d="M340 380 L460 460 L340 540 Z"/>
        <path d="M460 380 L340 460 L460 540 Z"/>
      `),
    ],
  },
];

export const PREVIEW_PRODUCTS: ProductRecord[] = RAW.map((p) => ({
  ...p,
  currency: "usd",
  freeShippingThresholdCents: 20000,
  active: true,
  weightOz: p.weightOz,
  createdAt: NOW,
  updatedAt: NOW,
})) as unknown as ProductRecord[];

export function findPreviewProductBySlug(slug: string | undefined): ProductRecord | null {
  if (!slug) return null;
  return PREVIEW_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
