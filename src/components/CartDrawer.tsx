import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/cart";
import { formatCents } from "../lib/format";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { lines, setQuantity, remove, subtotalCents, shippingCents, count } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const totalCents = subtotalCents + shippingCents;

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Cart"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-paper-100 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-ink-900/10">
          <div>
            <div className="eyebrow text-clay-400">Your bench</div>
            <div className="font-display text-xl mt-1">{count} {count === 1 ? "piece" : "pieces"}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-paper-200/60"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l12 12" /><path d="M16 4L4 16" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {count === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-500 mb-6">Nothing on the bench yet.</p>
              <Link to="/shop" onClick={onClose} className="btn-primary">Browse the shop</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-3 items-start">
                  <div className="w-16 h-20 rounded-md overflow-hidden bg-paper-200 flex-shrink-0">
                    {line.image ? (
                      <img src={line.image} alt={line.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/shop/${line.slug ?? ""}`}
                      onClick={onClose}
                      className="font-display text-sm text-ink-900 hover:text-clay-500 line-clamp-2"
                    >
                      {line.name}
                    </Link>
                    <div className="text-xs text-ink-500 mt-1">{formatCents(line.priceCents)}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-ink-900/15 rounded-full overflow-hidden text-sm">
                        <button
                          className="px-2 py-0.5 hover:bg-paper-200/60"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          aria-label="Decrease"
                        >−</button>
                        <span className="w-6 text-center font-mono text-xs">{line.quantity}</span>
                        <button
                          className="px-2 py-0.5 hover:bg-paper-200/60"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          aria-label="Increase"
                        >+</button>
                      </div>
                      <button
                        onClick={() => remove(line.productId)}
                        className="text-[10px] uppercase tracking-widest text-ink-500 hover:text-clay-500"
                      >Remove</button>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCents(line.priceCents * line.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {count > 0 ? (
          <footer className="border-t border-ink-900/10 px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Subtotal</span>
              <span>{formatCents(subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-500">Shipping est.</span>
              <span>{shippingCents > 0 ? formatCents(shippingCents) : "Free"}</span>
            </div>
            <div className="flex justify-between font-display text-lg pt-2 border-t border-ink-900/10">
              <span>Total</span>
              <span className="text-clay-500">{formatCents(totalCents)}</span>
            </div>
            <Link
              to="/cart"
              onClick={onClose}
              className="btn-primary w-full text-center mt-2"
            >
              View cart & checkout
            </Link>
            <p className="text-[11px] text-ink-500 text-center">
              Tax calculated at Stripe checkout.
            </p>
          </footer>
        ) : null}
      </aside>
    </>
  );
}
