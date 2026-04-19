import { useEffect, useState, useCallback } from "react";

export interface CartLine {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  image?: string;
  shippingFlatCents?: number;
  slug?: string;
}

const CART_KEY = "ironwake.cart.v1";

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CartLine =>
        x &&
        typeof x.productId === "string" &&
        typeof x.name === "string" &&
        typeof x.priceCents === "number" &&
        typeof x.quantity === "number"
    );
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
    window.dispatchEvent(new CustomEvent("cart:update"));
  } catch {
    /* ignore */
  }
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(() => readCart());

  useEffect(() => {
    const sync = () => setLines(readCart());
    window.addEventListener("cart:update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart:update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((line: CartLine) => {
    const current = readCart();
    const existing = current.find((l) => l.productId === line.productId);
    let next: CartLine[];
    if (existing) {
      next = current.map((l) =>
        l.productId === line.productId ? { ...l, quantity: l.quantity + line.quantity } : l
      );
    } else {
      next = [...current, line];
    }
    writeCart(next);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const current = readCart();
    const next =
      quantity <= 0
        ? current.filter((l) => l.productId !== productId)
        : current.map((l) => (l.productId === productId ? { ...l, quantity } : l));
    writeCart(next);
  }, []);

  const remove = useCallback((productId: string) => {
    writeCart(readCart().filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => {
    writeCart([]);
  }, []);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotalCents = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
  const shippingCents = lines.reduce(
    (sum, l) => sum + (l.shippingFlatCents ?? 0) * l.quantity,
    0
  );

  return { lines, add, setQuantity, remove, clear, count, subtotalCents, shippingCents };
}
