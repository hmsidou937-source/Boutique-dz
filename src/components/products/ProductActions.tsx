"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Product } from "@/lib/types";
import { localized } from "@/lib/utils";

export function ProductActions({ product }: { product: Product }) {
  const { locale, dict } = useLanguage();
  const { add } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const name = localized(product, "name", locale);
  const image = product.images[0] ?? null;
  const outOfStock = product.stock === 0;

  function buildLine() {
    return {
      productId: product.id,
      name,
      price: product.price,
      image,
      quantity,
      color,
      size,
      stock: product.stock,
    };
  }

  return (
    <div className="space-y-4">
      {product.colors.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm font-medium text-ink-800">{dict.product.color}</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  color === c ? "border-brand-600 bg-brand-50 text-brand-700" : "border-black/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm font-medium text-ink-800">{dict.product.size}</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  size === s ? "border-brand-600 bg-brand-50 text-brand-700" : "border-black/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-800">{dict.product.quantity}</p>
        <div className="flex w-fit items-center rounded-full border border-black/10">
          <button className="p-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <button
            className="p-2"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          disabled={outOfStock}
          onClick={() => add(buildLine())}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-brand-600 py-3 font-semibold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-black/10 disabled:text-black/30"
        >
          <ShoppingCart className="h-4 w-4" />
          {dict.product.addToCart}
        </button>
        <button
          disabled={outOfStock}
          onClick={() => {
            add(buildLine());
            router.push("/checkout");
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-black/10"
        >
          <Zap className="h-4 w-4" />
          {dict.product.buyNow}
        </button>
      </div>
    </div>
  );
}
