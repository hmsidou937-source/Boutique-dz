import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { ProductSection } from "@/components/home/ProductSection";
import { getDiscountedProducts, getFeaturedProducts, getNewProducts } from "@/lib/data";

export default async function HomePage() {
  const [newProducts, featured, discounted] = await Promise.all([
    getNewProducts(),
    getFeaturedProducts(),
    getDiscountedProducts(),
  ]);

  return (
    <div>
      <Hero
        title={{ ar: "كل ما تحتاجه، بضغطة واحدة", fr: "Tout ce dont vous avez besoin, en un clic" }}
        subtitle={{
          ar: "توصيل سريع لجميع الولايات، الدفع عند الاستلام، وجودة مضمونة.",
          fr: "Livraison rapide dans toutes les wilayas, paiement à la livraison, qualité garantie.",
        }}
        imageUrl="/hero-placeholder.jpg"
      />
      <TrustSection />
      <ProductSection title="منتجات جديدة / Nouveautés" products={newProducts} />
      <ProductSection title="الأكثر مبيعًا / Meilleures ventes" products={featured} />
      <ProductSection title="عروض خاصة / Offres spéciales" products={discounted} />
    </div>
  );
}
