import { getCategories, getProducts } from "@/lib/data";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "المنتجات / Produits" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; min?: string; max?: string; inStock?: string; sort?: string };
}) {
  const [categories, products] = await Promise.all([getCategories(), getProducts(searchParams)]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-ink-900">المنتجات / Produits</h1>
      <div className="mb-6">
        <ProductFilters categories={categories} />
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-ink-800/50">لا توجد منتجات مطابقة / Aucun produit trouvé</p>
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
