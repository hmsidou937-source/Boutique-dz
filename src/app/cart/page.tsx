"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { lines, remove, updateQuantity, subtotal } = useCart();
  const { locale, dict } = useLanguage();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="mb-4 text-lg text-ink-800/60">{dict.cart.empty}</p>
        <Link href="/products" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white">
          {dict.cart.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-ink-900">{dict.cart.title}</h1>

      <div className="space-y-3">
        {lines.map((l) => (
          <div key={l.productId + (l.color ?? "") + (l.size ?? "")} className="flex gap-3 rounded-xl border border-black/5 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.image ?? "/placeholder-product.png"} alt={l.name} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink-900">{l.name}</p>
                  {(l.color || l.size) && (
                    <p className="text-xs text-ink-800/50">{[l.color, l.size].filter(Boolean).join(" · ")}</p>
                  )}
                </div>
                <button onClick={() => remove(l.productId, l.color, l.size)} className="text-ink-800/40 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center rounded-full border border-black/10">
                  <button className="p-1.5" onClick={() => updateQuantity(l.productId, l.quantity - 1, l.color, l.size)}>
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm">{l.quantity}</span>
                  <button className="p-1.5" onClick={() => updateQuantity(l.productId, l.quantity + 1, l.color, l.size)}>
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-bold text-brand-700">{formatPrice(l.price * l.quantity, locale)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-black/5 bg-white p-4">
        <div className="flex justify-between text-sm text-ink-800/70">
          <span>{dict.cart.subtotal}</span>
          <span>{formatPrice(subtotal, locale)}</span>
        </div>
        <p className="mt-1 text-xs text-ink-800/40">{locale === "ar" ? "يُحسب التوصيل عند إتمام الطلب" : "Livraison calculée à l'étape suivante"}</p>
        <Link
          href="/checkout"
          className="mt-4 block rounded-full bg-brand-600 py-3 text-center font-semibold text-white transition hover:bg-brand-700"
        >
          {dict.cart.checkout}
        </Link>
      </div>
    </div>
  );
}
