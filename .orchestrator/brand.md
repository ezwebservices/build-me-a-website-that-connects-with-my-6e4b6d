# Brand Direction — CNC Garage Rebrand

## Final Brand Name
**Hearth & Grain Atelier**
Short form: **Hearth & Grain**
Domain-safe handle: `hearthandgrain`

Rationale: "Hearth" evokes home, warmth, permanence — the lived-in rooms our work goes into. "Grain" ties directly to the material: wood, figure, the hand of the maker. "Atelier" positions the studio above a production shop — a design house that happens to run CNCs. Reads as a refined home-designer brand first, fabrication studio second.

## Tagline
**Bespoke millwork, designed for the way you live.**

Supporting shorter variants:
- "Heirloom millwork for the modern home."
- "Designed. Milled. Made to last."

## Brand Voice (1 paragraph)
Hearth & Grain speaks with the calm confidence of a trusted designer — never loud, never salesy. The voice is warm but precise: we use plain, specific language about materials, dimensions, and craft rather than marketing superlatives. We write the way a thoughtful architect talks to a homeowner over coffee: curious about how you live, deliberate about every decision, unhurried. Sentences are short and clean. We favor nouns over adjectives — "quarter-sawn white oak" does more work than "beautiful wood." We celebrate the hand in the work without fetishizing it, and we treat the CNC as a fine instrument, not a gimmick. Above all: quietly considered.

## Color Palette (Light Theme)
Refined, warm, paper-and-workshop neutrals with one muted botanical accent and one earthen accent.

| Token | Hex | Role |
|---|---|---|
| `--bone` | `#F7F3EC` | Page background (primary) |
| `--ivory` | `#EFE8DC` | Elevated surfaces, cards |
| `--linen` | `#E4DACB` | Dividers, subtle fills |
| `--sage` | `#8A9A82` | Primary accent (muted botanical) |
| `--sage-deep` | `#5E6E58` | Hover / emphasized accent |
| `--clay` | `#B86E4F` | Secondary accent (warm, used sparingly for CTAs / price tags) |
| `--charcoal` | `#2A2724` | Primary text, deep contrast |
| `--graphite` | `#4A4641` | Secondary text |
| `--stone` | `#8C857B` | Tertiary text, captions |
| `--gold-hair` | `#C9A96A` | Micro-accent for hairline underlines / dividers only |

Usage rules:
- Bone dominates. Ivory and linen stack gently on top of it — never pure white, never gray.
- Sage is the single color moment on most pages (links, active states, small inlay shapes).
- Clay appears once per page max — a "Shop" button, a price chip, a soft heading flourish.
- Charcoal for all body text. Never use pure black (`#000`).
- Shadows are warm, low-opacity, long: `0 24px 48px -24px rgba(42, 39, 36, 0.18)`.

## Typography
Elegant serif display paired with a neutral humanist sans.

- **Display / Headings:** *Fraunces* (variable, opsz 72+, wght 300–500). Use the SOFT optical axis slightly relaxed, slight negative tracking (`-0.01em`) at large sizes. For an even more architectural feel, *Canela* or *GT Sectra* are acceptable fallbacks if licensed.
- **Body / UI:** *Inter* (wght 400/500/600) or *Söhne* if licensed. Tracking `0` for body, `+0.08em` uppercase for eyebrows.
- **Eyebrow / Labels:** Inter, 11–12px, uppercase, `letter-spacing: 0.14em`, color `--stone`.
- **Numerals:** Fraunces tabular for prices and specs.

Scale (desktop):
- H1 display: 72–96px, Fraunces 350, line-height 1.04
- H2: 44–56px, Fraunces 400
- H3: 28–32px, Fraunces 450
- Body: 17px / 1.65, Inter 400
- Small: 14px, Inter 500

## Hero / First Section — Light Theme Direction

The hero should feel like the opening spread of an interior design monograph — not a storefront.

**Layout**
- Full-viewport section, `min-height: 92vh`.
- Asymmetric split: left column ~55% for type, right column ~45% for a single, large imagery/visual slot. On mobile, stacks with type first.
- Generous padding: `clamp(32px, 6vw, 96px)` horizontal, `clamp(80px, 10vh, 140px)` top.

**Background**
- Solid `--bone` (`#F7F3EC`) — no gradients, no textures that look digital.
- Optional: a very faint, large-scale wood-grain SVG watermark at 3–5% opacity in the bottom-right quadrant, rendered in `--linen`. It should read as paper, not decoration.

**Type block (left)**
- Eyebrow (uppercase, `--stone`, `--gold-hair` 24px hairline rule above it): "HEARTH & GRAIN — ATELIER NO. 01"
- H1 in Fraunces, 88px, weight 350, `--charcoal`:
  *"Bespoke millwork,*
  *designed for the way you live."*
  Line breaks are intentional — two lines, italic on the second line's final word ("live") for a quiet typographic flourish.
- Sub-paragraph, 18px Inter, `--graphite`, max-width 46ch: one sentence about custom cabinetry, furniture, and architectural millwork from the studio.
- Two CTAs side by side, 48px tall:
  - Primary: solid `--charcoal` background, `--bone` text, Fraunces 16px, label "Commission a Piece" → anchors to contact.
  - Ghost: transparent, `--charcoal` 1px border, label "Shop the Collection" → anchors to products.
- Below the CTAs, a thin `--linen` divider, then a three-column mini-spec row (Inter 12px uppercase, `--stone`): "Designed in-house · CNC-milled locally · Shipped nationwide."

**Visual slot (right)**
- A single tall image card with `border-radius: 2px` (almost square corners — architectural, not playful).
- If no product photo yet, render a placeholder SVG composition on `--ivory`: a minimal line drawing of a cabinet elevation in `--charcoal` hairlines, with a small `--sage` swatch square and a `--clay` swatch square stacked beside it like a material board.
- Caption underneath in Inter 12px `--stone`: "WALNUT CREDENZA / COMMISSION 024 / FIGURED AMERICAN BLACK WALNUT".

**Navigation (above hero)**
- Transparent bar over `--bone`. Wordmark "Hearth & Grain" in Fraunces 22px weight 400, `--charcoal`. Nav links Inter 14px `--graphite`, uppercase with `0.12em` tracking: Work · Shop · Process · Journal · Contact. A single `--sage` 4px dot marks the active link.

**Motion**
- On load: H1 fades up 12px over 700ms with `cubic-bezier(0.2, 0.8, 0.2, 1)`. Eyebrow and CTAs stagger in 120ms after. No parallax, no floating shapes. Restraint is the brand.

## Do / Don't
- **Do:** keep surfaces warm and off-white; use sage sparingly; let typography carry the mood.
- **Don't:** use pure white backgrounds, neon accents, drop shadows that feel "webby," stock CNC/industrial imagery, or multiple competing accent colors. No emoji in UI. No gradients in the hero.
