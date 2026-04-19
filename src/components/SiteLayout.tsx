import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../lib/cart";
import { useApp } from "../context/AppContext";
import { IronwakeMark } from "./IronwakeMark";

export function SiteLayout() {
  const { count } = useCart();
  const { shopName, tagline } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  const navLinks = [
    { to: "/shop", label: "Collection" },
    { to: "/about", label: "Atelier" },
    { to: "/contact", label: "Commission" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-paper-100/90 backdrop-blur-md border-b border-ink-900/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-3 group">
            <IronwakeMark className="h-9 w-9 text-ink-900 transition-opacity group-hover:opacity-70" />
            <div className="leading-none">
              <div className="font-display text-[1.35rem] tracking-tight text-ink-900">{shopName}</div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-ink-400 mt-1.5">
                {tagline}
              </div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative tracking-wider uppercase text-xs font-medium transition ${
                    isActive ? "text-clay-500" : "text-ink-700 hover:text-clay-400"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ink-900/15 hover:border-clay-500 text-sm transition"
              aria-label={`Cart, ${count} items`}
            >
              <CartIcon />
              <span className="hidden sm:inline text-xs uppercase tracking-widest">Cart</span>
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-clay-500 text-paper-50 text-[10px] font-semibold flex items-center justify-center">
                {count}
              </span>
            </Link>
            <button
              className="md:hidden p-2 rounded border border-ink-900/15"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <BurgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-ink-900/10 px-6 py-4 flex flex-col gap-3 bg-paper-100/95">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `py-2 text-sm tracking-wider uppercase ${
                    isActive ? "text-clay-500" : "text-ink-700"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink-900/10 mt-20 py-14 bg-paper-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <IronwakeMark className="h-7 w-7 text-clay-500" />
              <span className="font-display text-lg">{shopName}</span>
            </div>
            <p className="text-ink-500 text-sm max-w-sm leading-relaxed">
              Bespoke millwork, cabinetry, and architectural woodwork. Designed in-house,
              CNC-milled locally, and hand-finished piece by piece for the homes our clients
              actually live in.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-4">Explore</div>
            <ul className="space-y-2 text-sm text-ink-700">
              <li><Link to="/shop" className="hover:text-clay-500">Collection</Link></li>
              <li><Link to="/about" className="hover:text-clay-500">Atelier</Link></li>
              <li><Link to="/contact" className="hover:text-clay-500">Commission</Link></li>
              <li><Link to="/admin" className="hover:text-clay-500">Studio access</Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow mb-4">Studio</div>
            <p className="text-sm text-ink-500 leading-relaxed whitespace-pre-line">
              {useApp().settings?.address || "Garage 19B\nPortland, OR"}
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-10 pt-6 border-t border-ink-900/10 text-xs text-ink-500 flex flex-wrap justify-between gap-4">
          <span>© {new Date().getFullYear()} {shopName} Atelier. Designed &amp; milled by hand.</span>
          <span className="font-mono tracking-widest">HEARTH · GRAIN · ATELIER</span>
        </div>
      </footer>
    </div>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 4h2l2.6 11.6a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="10" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      {open ? (
        <>
          <path d="M4 4l12 12" />
          <path d="M16 4L4 16" />
        </>
      ) : (
        <>
          <path d="M3 6h14" />
          <path d="M3 10h14" />
          <path d="M3 14h14" />
        </>
      )}
    </svg>
  );
}
