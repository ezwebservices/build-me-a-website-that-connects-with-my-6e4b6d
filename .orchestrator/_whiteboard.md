# Iteration Whiteboard

**Change request:** the first section isnt updated for light theme, also come up with a better name, should be design inspired, rebrand to better home designer aesthetic

**Subtasks planned:** 3

1. **BrandStrategist**: Rebrand the CNC garage business with a design-inspired name evoking a refined home-designer aesthetic (think artisan atelier, bespoke millwork, modern heritage). Deliver: final brand name, tagline, 1-paragraph brand voice, refined light-theme color palette (warm neutrals, bone/ivory, muted sage or clay accent, deep charcoal text), typography pairing (an elegant serif display + clean sans), and specific guidance on how the hero/first section should look in the light theme. Write results to .orchestrator/brand.md so Engineer can implement.
2. **Engineer**: Apply the rebrand from .orchestrator/brand.md across the site: update site name, logo/wordmark, tagline, meta tags, footer, and any hardcoded brand references. Then fix the first/hero section which currently isn't styled for the light theme — rework its background, text colors, accents, and imagery to match the new home-designer light palette and typography. Ensure contrast, spacing, and responsive layout feel elegant and artsy. Run npm run build until it exits 0.
3. **QA**: Verify: (1) new brand name appears consistently in header, title, footer, meta. (2) Hero/first section fully adopts the light theme (no dark leftovers, correct background, readable text, proper accent colors). (3) No console errors, build passes, responsive at mobile/tablet/desktop. Report any regressions.

---

