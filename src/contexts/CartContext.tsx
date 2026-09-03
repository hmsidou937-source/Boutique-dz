"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/types";
import { trackEvent } from "@/components/analytics/Pixels";

interface CartContextValue {
  lines: CartLine[];
  add: (line: CartLine) => void;
  remove: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dz-cart";

function lineKey(l: Pick<CartLine, "productId" | "color" | "size">) {
  return [l.productId, l.color ?? "", l.size ?? ""].join("::");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function add(line: CartLine) {
    setLines((prev) => {
      const key = lineKey(line);
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l) === key
            ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.stock) }
            : l
        );
      }
      return [...prev, line];
    });
    trackEvent("AddToCart", {
      content_ids: [line.productId],
      content_name: line.name,
      value: line.price * line.quantity,
      currency: "DZD",
    });
  }

  function remove(productId: string, color?: string, size?: string) {
    const key = lineKey({ productId, color, size });
    setLines((prev) => prev.filter((l) => lineKey(l) !== key));
  }

  function updateQuantity(productId: string, quantity: number, color?: string, size?: string) {
    const key = lineKey({ productId, color, size });
    setLines((prev) =>
      prev.map((l) =>
        lineKey(l) === key ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) } : l
      )
    );
  }

  function clear() {
    setLines([]);
  }

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price * l.quantity, 0), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.quantity, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, add, remove, updateQuantity, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
