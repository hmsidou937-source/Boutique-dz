"use client";

import { Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatPrice, discountPercent, localized } from "@/lib/utils";
import type { Product, ProductSpec } from "@/lib/types";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export function ProductInfo({ product, reviews }: { product: Product; reviews: Review[] }) {
  const { locale, dict } = useLanguage();
  const name = localized(product, "name", locale);
  const description = localized(product, "description", locale);
  const discount = discountPercent(product.price, product.old_price);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">{name}</h1>

      {product.rating_count > 0 && (
        <div className="mt-1 flex items-center gap-1 text-sm text-ink-800/60">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)} ({product.rating_count})
        </div>
      )}

      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-2xl font-extrabold text-brand-700">{formatPrice(product.price, locale)}</span>
        {product.old_price ? (
          <>
            <span className="text-base text-ink-800/40 line-through">{formatPrice(product.old_price, locale)}</span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">-{discount}%</span>
          </>
        ) : null}
      </div>

      <p className="mt-2 text-sm font-medium text-emerald-600">
        {product.stock > 0 ? `${dict.product.inStock} (${product.stock})` : dict.product.outOfStock}
      </p>

      {description && (
        <div className="mt-6">
          <h2 className="mb-2 font-semibold text-ink-900">{dict.product.description}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-800/80">{description}</p>
        </div>
      )}

      {product.specs?.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 font-semibold text-ink-900">{dict.product.specs}</h2>
          <table className="w-full text-sm">
            <tbody>
              {product.specs.map((s: ProductSpec, i: number) => (
                <tr key={i} className="border-b border-black/5">
                  <td className="py-1.5 font-medium text-ink-800/70">{locale === "ar" ? s.label_ar : s.label_fr}</td>
                  <td className="py-1.5 text-ink-900">{locale === "ar" ? s.value_ar : s.value_fr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 font-semibold text-ink-900">{dict.product.reviews}</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-black/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{r.customer_name}</span>
                  <span className="flex items-center gap-0.5 text-xs text-amber-500">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-ink-800/70">{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
