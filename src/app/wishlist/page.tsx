"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products/by-ids?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-ink-900">المفضلة / Favoris</h1>

      {loading ? (
        <p className="text-ink-800/40">...</p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center text-ink-800/50">لا توجد منتجات في المفضلة / Aucun favori</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
