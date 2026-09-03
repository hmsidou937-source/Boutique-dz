import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductActions } from "@/components/products/ProductActions";
import { ProductCard } from "@/components/products/ProductCard";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name_ar,
    description: product.description_ar?.slice(0, 160),
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const supabase = createClient();
  const [{ data: reviews }, related] = await Promise.all([
    supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false }),
    getRelatedProducts(product.category_id, product.id),
  ]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_ar,
    image: product.images,
    sku: product.sku ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "DZD",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.rating_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.rating_count,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name_ar} />
        <div>
          <ProductInfo product={product} reviews={reviews ?? []} />
          <div className="mt-6">
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink-900">منتجات قد تعجبك / Vous pourriez aussi aimer</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
