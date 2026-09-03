import { createAdminClient } from "@/lib/supabase/admin";
import { ProductsAdminList } from "./ProductsAdminList";
import type { Category, Product } from "@/lib/types";

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return <ProductsAdminList products={(products as Product[]) ?? []} categories={(categories as Category[]) ?? []} />;
}
