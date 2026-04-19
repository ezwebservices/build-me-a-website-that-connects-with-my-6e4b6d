/** @type {import('tailwindcss').Config} */
// Tokens mirror src/styles/theme.ts — keep in sync.
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"New York"', '"Cambria"', '"Hoefler Text"', "Georgia", "ui-serif", "serif"],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", '"SF Mono"', '"Menlo"', '"Cascadia Mono"', '"Consolas"', "monospace"],
      },
      colors: {
        // Paper — page & surface tones (warm off-white / cream)
        paper: {
          50:  "#FDFCFA",
          100: "#FAF9F6",
          200: "#F5F1EA",
          300: "#ECE5D8",
          400: "#DDD3BF",
        },
        // Ink — warm graphite for type
        ink: {
          200: "#D6CFC1",
          300: "#B8AF9F",
          400: "#948B7B",
          500: "#6E6557",
          600: "#4A4238",
          700: "#2E2822",
          800: "#1F1B15",
          900: "#14110D",
        },
        // Clay / terracotta — primary warm accent
        clay: {
          50:  "#FBF1EA",
          200: "#EBC9B1",
          400: "#D18A64",
          500: "#B8673F",
          600: "#9A4E2B",
          700: "#763820",
        },
        // Patina — aged copper, used sparingly
        patina: {
          300: "#BFCFC2",
          500: "#6B8A7A",
          700: "#3E574A",
        },
        // Blueprint — cool ink for technical motifs
        blueprint: {
          300: "#BFC9D6",
          500: "#5A6B84",
          700: "#2B3A52",
        },
        signal: {
          danger: "#B23A2E",
        },
      },
      maxWidth: {
        prose: "68ch",
        page: "1280px",
      },
      borderRadius: {
        card: "10px",
        frame: "18px",
      },
      boxShadow: {
        // Matte-paper lift — no dark halos
        paper:  "0 1px 0 rgba(20,17,13,0.04), 0 8px 24px -12px rgba(20,17,13,0.12)",
        lifted: "0 2px 0 rgba(20,17,13,0.04), 0 18px 40px -18px rgba(20,17,13,0.18)",
        etched: "inset 0 0 0 1px rgba(20,17,13,0.06)",
        hairline: "inset 0 0 0 1px rgba(20,17,13,0.08)",
      },
      letterSpacing: {
        eyebrow: "0.28em",
        display: "-0.02em",
      },
      backgroundImage: {
        // Blueprint grid (24px) — used under hero sections
        "blueprint-grid":
          "linear-gradient(to right, rgba(221,211,191,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(221,211,191,0.5) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid24: "24px 24px",
      },
    },
  },
  plugins: [],
};
