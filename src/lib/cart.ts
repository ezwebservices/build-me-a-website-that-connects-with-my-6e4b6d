import { useEffect, useState, useCallback, useRef } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { getClient } from "./client";

export interface CartLine {
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  image?: string;
  shippingFlatCents?: number;
  slug?: string;
}

interface MemoryStore {
  lines: CartLine[];
  listeners: Set<() => void>;
}

const memory: MemoryStore = { lines: [], listeners: new Set() };

function notify() {
  memory.listeners.forEach((l) => l());
}

function setMemoryLines(next: CartLine[]) {
  memory.lines = next;
  notify();
}

type ItemRow = {
  id: string;
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
  slug?: string | null;
  image?: string | null;
  shippingFlatCents?: number | null;
};

async function getOrCreateCartId(): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const { data } = await client.models.Cart.list({ limit: 1 });
    if (data && data.length > 0) return data[0].id;
    const created = await client.models.Cart.create({
      updatedAtIso: new Date().toISOString(),
    });
    return created.data?.id ?? null;
  } catch {
    return null;
  }
}

async function loadRemoteLines(): Promise<{ cartId: string | null; rows: ItemRow[] }> {
  const client = getClient();
  if (!client) return { cartId: null, rows: [] };
  const cartId = await getOrCreateCartId();
  if (!cartId) return { cartId: null, rows: [] };
  try {
    const { data } = await client.models.CartItem.list({
      filter: { cartId: { eq: cartId } },
      limit: 500,
    });
    const rows: ItemRow[] = (data ?? []).map((d) => ({
      id: d.id,
      productId: d.productId,
      name: d.name,
      priceCents: d.priceCents,
      quantity: d.quantity,
      slug: d.slug ?? null,
      image: d.image ?? null,
      shippingFlatCents: d.shippingFlatCents ?? null,
    }));
    return { cartId, rows };
  } catch {
    return { cartId, rows: [] };
  }
}

function rowsToLines(rows: ItemRow[]): CartLine[] {
  return rows.map((r) => ({
    productId: r.productId,
    name: r.name,
    priceCents: r.priceCents,
    quantity: r.quantity,
    image: r.image ?? undefined,
    slug: r.slug ?? undefined,
    shippingFlatCents: r.shippingFlatCents ?? undefined,
  }));
}

async function checkSignedIn(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(memory.lines);
  const [signedIn, setSignedIn] = useState(false);
  const rowsRef = useRef<ItemRow[]>([]);
  const cartIdRef = useRef<string | null>(null);

  useEffect(() => {
    const listener = () => setLines([...memory.lines]);
    memory.listeners.add(listener);
    return () => {
      memory.listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      const authed = await checkSignedIn();
      if (cancelled) return;
      setSignedIn(authed);
      if (!authed) {
        rowsRef.current = [];
        cartIdRef.current = null;
        return;
      }
      const { cartId, rows } = await loadRemoteLines();
      if (cancelled) return;
      cartIdRef.current = cartId;
      rowsRef.current = rows;
      setMemoryLines(rowsToLines(rows));
    };

    void sync();

    const unsub = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn" || payload.event === "signedOut") {
        if (payload.event === "signedOut") {
          setMemoryLines([]);
        }
        void sync();
      }
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const add = useCallback(async (line: CartLine) => {
    const existing = memory.lines.find((l) => l.productId === line.productId);
    const next = existing
      ? memory.lines.map((l) =>
          l.productId === line.productId
            ? { ...l, quantity: l.quantity + line.quantity }
            : l
        )
      : [...memory.lines, line];
    setMemoryLines(next);

    if (!signedIn) return;
    const client = getClient();
    if (!client) return;
    let cartId = cartIdRef.current;
    if (!cartId) cartId = await getOrCreateCartId();
    if (!cartId) return;
    cartIdRef.current = cartId;

    const existingRow = rowsRef.current.find((r) => r.productId === line.productId);
    try {
      if (existingRow) {
        const res = await client.models.CartItem.update({
          id: existingRow.id,
          quantity: existingRow.quantity + line.quantity,
        });
        if (res.data) {
          rowsRef.current = rowsRef.current.map((r) =>
            r.id === existingRow.id ? { ...r, quantity: res.data!.quantity } : r
          );
        }
      } else {
        const res = await client.models.CartItem.create({
          cartId,
          productId: line.productId,
          name: line.name,
          priceCents: line.priceCents,
          quantity: line.quantity,
          slug: line.slug,
          image: line.image,
          shippingFlatCents: line.shippingFlatCents,
        });
        if (res.data) {
          rowsRef.current = [
            ...rowsRef.current,
            {
              id: res.data.id,
              productId: res.data.productId,
              name: res.data.name,
              priceCents: res.data.priceCents,
              quantity: res.data.quantity,
              slug: res.data.slug ?? null,
              image: res.data.image ?? null,
              shippingFlatCents: res.data.shippingFlatCents ?? null,
            },
          ];
        }
      }
    } catch {
      /* already reflected in memory */
    }
  }, [signedIn]);

  const setQuantity = useCallback(async (productId: string, quantity: number) => {
    const next =
      quantity <= 0
        ? memory.lines.filter((l) => l.productId !== productId)
        : memory.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l));
    setMemoryLines(next);

    if (!signedIn) return;
    const client = getClient();
    if (!client) return;
    const row = rowsRef.current.find((r) => r.productId === productId);
    if (!row) return;
    try {
      if (quantity <= 0) {
        await client.models.CartItem.delete({ id: row.id });
        rowsRef.current = rowsRef.current.filter((r) => r.id !== row.id);
      } else {
        await client.models.CartItem.update({ id: row.id, quantity });
        rowsRef.current = rowsRef.current.map((r) =>
          r.id === row.id ? { ...r, quantity } : r
        );
      }
    } catch {
      /* ignore */
    }
  }, [signedIn]);

  const remove = useCallback(async (productId: string) => {
    setMemoryLines(memory.lines.filter((l) => l.productId !== productId));
    if (!signedIn) return;
    const client = getClient();
    if (!client) return;
    const row = rowsRef.current.find((r) => r.productId === productId);
    if (!row) return;
    try {
      await client.models.CartItem.delete({ id: row.id });
      rowsRef.current = rowsRef.current.filter((r) => r.id !== row.id);
    } catch {
      /* ignore */
    }
  }, [signedIn]);

  const clear = useCallback(async () => {
    const prevRows = rowsRef.current;
    setMemoryLines([]);
    if (!signedIn) return;
    const client = getClient();
    if (!client) return;
    try {
      await Promise.all(prevRows.map((r) => client.models.CartItem.delete({ id: r.id })));
      rowsRef.current = [];
    } catch {
      /* ignore */
    }
  }, [signedIn]);

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotalCents = lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
  const shippingCents = lines.reduce(
    (sum, l) => sum + (l.shippingFlatCents ?? 0) * l.quantity,
    0
  );

  return { lines, add, setQuantity, remove, clear, count, subtotalCents, shippingCents, signedIn };
}
