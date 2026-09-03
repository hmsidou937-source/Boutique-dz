"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export async function saveCategory(data: {
  id?: string;
  name_ar: string;
  name_fr: string;
  image_url: string;
  sort_order: number;
}) {
  const supabase = createAdminClient();
  const payload = {
    name_ar: data.name_ar,
    name_fr: data.name_fr,
    slug: slugify(data.name_fr || data.name_ar),
    image_url: data.image_url || null,
    sort_order: data.sort_order,
  };

  if (data.id) {
    await supabase.from("categories").update(payload).eq("id", data.id);
  } else {
    await supabase.from("categories").insert(payload);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  return { success: true };
}
