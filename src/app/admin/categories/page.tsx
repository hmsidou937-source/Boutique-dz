import { createAdminClient } from "@/lib/supabase/admin";
import { CategoriesAdmin } from "./CategoriesAdmin";
import type { Category } from "@/lib/types";

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return <CategoriesAdmin categories={(data as Category[]) ?? []} />;
}
