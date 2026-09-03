import { createClient } from "@/lib/supabase/server";
import type { Category, Commune, Product, StoreSettings, Wilaya } from "@/lib/types";

const DEFAULT_SETTINGS: StoreSettings = {
  id: 1,
  store_name: "DZ Store",
  logo_url: null,
  favicon_url: null,
  primary_color: "#ea580c",
  currency: "DZD",
  phone: null,
  whatsapp: null,
  email: null,
  address: null,
  facebook_url: null,
  instagram_url: null,
  tiktok_url: null,
  delivery_policy_ar: null,
  delivery_policy_fr: null,
  return_policy_ar: null,
  return_policy_fr: null,
  privacy_policy_ar: null,
  privacy_policy_fr: null,
  meta_pixel_id: null,
  tiktok_pixel_id: null,
};

export async function getSettings(): Promise<StoreSettings> {
  const supabase = createClient();
  const { data } = await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle();
  return (data as StoreSettings) ?? DEFAULT_SETTINGS;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (data as Category[]) ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(10);
  return (data as Product[]) ?? [];
}

export async function getNewProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(10);
  return (data as Product[]) ?? [];
}

export async function getDiscountedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .not("old_price", "is", null)
    .limit(10);
  return (data as Product[]) ?? [];
}

export interface ProductQuery {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  inStock?: string;
  sort?: string;
}

export async function getProducts(query: ProductQuery): Promise<Product[]> {
  const supabase = createClient();
  let builder = supabase.from("products").select("*, categories!inner(slug)").eq("is_active", true);

  if (query.category) builder = builder.eq("categories.slug", query.category);
  if (query.min) builder = builder.gte("price", Number(query.min));
  if (query.max) builder = builder.lte("price", Number(query.max));
  if (query.inStock === "1") builder = builder.gt("stock", 0);
  if (query.q) builder = builder.textSearch("name_ar", query.q, { type: "websearch" });

  switch (query.sort) {
    case "price_asc":
      builder = builder.order("price", { ascending: true });
      break;
    case "price_desc":
      builder = builder.order("price", { ascending: false });
      break;
    default:
      builder = builder.order("created_at", { ascending: false });
  }

  const { data } = await builder;
  return (data as unknown as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  return (data as Product) ?? null;
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string): Promise<Product[]> {
  if (!categoryId) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(6);
  return (data as Product[]) ?? [];
}

export async function getWilayas(): Promise<Wilaya[]> {
  const supabase = createClient();
  const { data } = await supabase.from("wilayas").select("*").order("code");
  return (data as Wilaya[]) ?? [];
}

export async function getCommunesByWilaya(wilayaId: number): Promise<Commune[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("communes")
    .select("*")
    .eq("wilaya_id", wilayaId)
    .eq("is_active", true)
    .order("name_ar");
  return (data as Commune[]) ?? [];
}
