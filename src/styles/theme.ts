/**
 * BRAND DIRECTION — "Forge & Folio"
 * CNC Garage × Design Studio × Anthropic-style artsy tech.
 *
 * Mood: a lived-in machinist's studio with drafting tables, warm paper,
 * ink-on-linen, graphite smudges, and the quiet confidence of a craft shop
 * that also ships. Light, warm, editorial. Not corporate. Not rustic cliché.
 *
 * Voice: understated, precise, hand-signed. Serif display headlines paired
 * with a clean neutral sans for UI. Lots of air. Small craft flourishes.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * COLOR TOKENS (exact hex — mirrored in tailwind.config.js)
 * ──────────────────────────────────────────────────────────────────────────
 */

export const palette = {
  // Paper / surface — warm off-whites and creams. #FAF9F6 is the page.
  paper: {
    50:  "#FDFCFA", // lightest wash, modal interiors
    100: "#FAF9F6", // PAGE BACKGROUND (primary)
    200: "#F5F1EA", // cards, raised surfaces
    300: "#ECE5D8", // hairline dividers / muted panels
    400: "#DDD3BF", // blueprint grid lines (light)
  },

  // Ink — deep warm-black headline color. Anthropic-esque graphite.
  ink: {
    900: "#14110D", // headline ink, body max-contrast
    800: "#1F1B15",
    700: "#2E2822",
    600: "#4A4238",
    500: "#6E6557", // body copy
    400: "#948B7B", // secondary copy
    300: "#B8AF9F", // tertiary, captions
    200: "#D6CFC1", // disabled
  },

  // Clay / terracotta — primary warm accent. Kiln-fired, not neon.
  clay: {
    50:  "#FBF1EA",
    200: "#EBC9B1",
    400: "#D18A64", // accent surfaces, hover tint
    500: "#B8673F", // PRIMARY ACCENT
    600: "#9A4E2B",
    700: "#763820", // deep accent, pressed states
  },

  // Patina — aged copper-green, used sparingly (status, success, tags).
  patina: {
    300: "#BFCFC2",
    500: "#6B8A7A",
    700: "#3E574A",
  },

  // Blueprint — cool ink for technical motifs (grid, tool-paths, specs).
  blueprint: {
    300: "#BFC9D6",
    500: "#5A6B84",
    700: "#2B3A52",
  },

  // Signal — used only for destructive / critical.
  signal: {
    danger: "#B23A2E",
  },
} as const;

/**
 * ──────────────────────────────────────────────────────────────────────────
 * TYPOGRAPHY — SYSTEM FONTS ONLY (no CDN, no webfont download)
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Display: native serif stack. On macOS → New York; Windows → Cambria /
 * Georgia; Linux → DejaVu Serif. All have true italics and good numerals.
 * This is the "folio" voice — used for H1/H2, pull-quotes, product names.
 *
 * UI / Body: system-ui neutral sans. SF Pro on Apple, Segoe UI on Windows,
 * Inter/Roboto fallback on Linux. Excellent at 14–16px.
 *
 * Mono: for spec sheets, dimensions, SKUs, tool-path snippets.
 */

export const fontStacks = {
  display:
    '"New York", "Cambria", "Hoefler Text", "Georgia", ui-serif, serif',
  sans:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  mono:
    'ui-monospace, "SF Mono", "Menlo", "Cascadia Mono", "Consolas", monospace',
} as const;

/**
 * TYPE SCALE — modular, 1.25 ratio, optical for editorial hierarchy.
 * (line-height, tracking, weight) tuned per step.
 */
export const typeScale = {
  // Display (serif)
  hero:    { size: "clamp(3.25rem, 6vw, 5.5rem)", line: "0.98", track: "-0.025em", weight: 500, family: "display" },
  h1:      { size: "clamp(2.25rem, 4vw, 3.5rem)",  line: "1.05", track: "-0.02em",  weight: 500, family: "display" },
  h2:      { size: "clamp(1.75rem, 3vw, 2.5rem)",  line: "1.1",  track: "-0.015em", weight: 500, family: "display" },
  h3:      { size: "1.5rem",                       line: "1.2",  track: "-0.01em",  weight: 500, family: "display" },

  // UI (sans)
  lead:    { size: "1.125rem",  line: "1.6",  track: "0",       weight: 400, family: "sans" },
  body:    { size: "1rem",      line: "1.65", track: "0",       weight: 400, family: "sans" },
  small:   { size: "0.875rem",  line: "1.55", track: "0.005em", weight: 400, family: "sans" },
  caption: { size: "0.75rem",   line: "1.5",  track: "0.02em",  weight: 500, family: "sans" },

  // Eyebrow — tiny all-caps wayfinding label (craft-shop signage feel).
  eyebrow: { size: "0.6875rem", line: "1.2",  track: "0.28em",  weight: 600, family: "sans" },

  // Mono
  spec:    { size: "0.8125rem", line: "1.5",  track: "0.01em",  weight: 400, family: "mono" },
} as const;

/**
 * ──────────────────────────────────────────────────────────────────────────
 * SPACING & LAYOUT
 * ──────────────────────────────────────────────────────────────────────────
 * Generous whitespace is non-negotiable. Sections breathe at 120–160px
 * vertical on desktop. Content columns max ~68ch for editorial readability.
 */
export const layout = {
  contentMax: "68ch",
  pageMax: "1280px",
  sectionY: { sm: "4rem", md: "7rem", lg: "10rem" },
  radius: { sm: "6px", md: "10px", lg: "18px", pill: "999px" },
  // Hairline borders over heavy shadows — "drafting line" aesthetic.
  border: "1px solid rgba(20, 17, 13, 0.08)",
} as const;

export const shadows = {
  // Soft paper-lift, no dark halos. Think matte print on cream stock.
  paper:   "0 1px 0 rgba(20,17,13,0.04), 0 8px 24px -12px rgba(20,17,13,0.12)",
  lifted:  "0 2px 0 rgba(20,17,13,0.04), 0 18px 40px -18px rgba(20,17,13,0.18)",
  etched:  "inset 0 0 0 1px rgba(20,17,13,0.06)",
} as const;

/**
 * ──────────────────────────────────────────────────────────────────────────
 * SIGNATURE MOTIFS (3) — for the Engineer to wire in
 * ──────────────────────────────────────────────────────────────────────────
 *
 * 1. BLUEPRINT GRID
 *    A faint 24px square grid in `paper.400` (#DDD3BF) at ~35% opacity,
 *    layered under hero sections and product detail pages. Occasionally
 *    replace one grid cell with a tiny circled dimension tick + mono spec
 *    ("Ø 0.125\""). Built via SVG `<pattern>` — no raster. See
 *    `components/motifs/BlueprintGrid.tsx`.
 *
 * 2. TOOL-PATH LINE ART
 *    Hand-drawn-feeling SVG strokes that trace the outline of a product
 *    (bit, fixture, sign) as if plotted by a CNC pen. 1px clay.500 stroke,
 *    dash-array animated on scroll-reveal (stroke-dashoffset 0→1). Used
 *    as decorative chrome above section titles and on empty states.
 *    Motif keywords: bezier arcs, corner radii, rapid-travel dotted lines.
 *
 * 3. PAPER GRAIN + MARGIN MARK
 *    Subtle SVG fractal-noise grain (2–4% opacity, multiply blend) tiled
 *    over `paper.100` to give the screen the tooth of uncoated stock.
 *    Paired with a small fixed "margin mark" in the bottom-right corner:
 *    a hand-stamped monogram ("CNC · GARAGE ·  EST.") in mono type,
 *    like the colophon on a studio print.
 *
 * Secondary flourishes (use sparingly):
 *   • Drafting tick-marks on section rules (╶┼╴ every 96px).
 *   • Italic serif "drop-folio" page numbers in the footer.
 *   • Hand-signed SVG signature near the About/Shop headers.
 */

/**
 * ──────────────────────────────────────────────────────────────────────────
 * COMPONENT DIRECTION (quick rules for Engineer)
 * ──────────────────────────────────────────────────────────────────────────
 *  • Buttons: pill or slight-radius (md) — primary = clay.500 on paper.100
 *    with ink.900 text; ghost = 1px ink.900/15% border.
 *  • Cards: paper.200 surface, no heavy shadow — `shadows.etched` + 1px
 *    ink hairline. Hover: lift to `shadows.paper`, translate-y -2px.
 *  • Inputs: underline-only on focus (draftsman feel), or paper.50 fill
 *    with hairline border; label is `eyebrow` style above.
 *  • Images: always within a 1px hairline frame, 2–4px inner padding
 *    (matte-board effect). Default aspect 4:5 for product hero, 3:2 for
 *    editorial.
 *  • Motion: 300–500ms ease-out, small distances. No bouncy springs.
 *  • Focus ring: 2px clay.500, 2px paper.100 offset.
 */

export const theme = {
  palette,
  fontStacks,
  typeScale,
  layout,
  shadows,
} as const;

export type Theme = typeof theme;
export default theme;
