"use client";

import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatPrice, discountPercent, localized, cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { locale, dict } = useLanguage();
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const name = localized(product, "name", locale);
  const discount = discountPercent(product.price, product.old_price);
  const image = product.images[0] ?? "/placeholder-product.png";
  const wished = has(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-2 start-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
            {dict.product.outOfStock}
          </span>
        )}
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(product.id);
        }}
        aria-label="wishlist"
        className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
      >
        <Heart className={cn("h-4 w-4", wished ? "fill-red-500 text-red-500" : "text-ink-800/50")} />
      </button>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-medium text-ink-900">
          {name}
        </Link>

        {product.rating_count > 0 && (
          <div className="flex items-center gap-1 text-xs text-ink-800/60">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)} ({product.rating_count})
          </div>
        )}

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-brand-700">{formatPrice(product.price, locale)}</span>
          {product.old_price ? (
            <span className="text-xs text-ink-800/40 line-through">{formatPrice(product.old_price, locale)}</span>
          ) : null}
        </div>

        <button
          disabled={product.stock === 0}
          onClick={() =>
            add({
              productId: product.id,
              name,
              price: product.price,
              image,
              quantity: 1,
              stock: product.stock,
            })
          }
          className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand-600 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-black/40"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {dict.product.addToCart}
        </button>
      </div>
    </div>
  );
}
