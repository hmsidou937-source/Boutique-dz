"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export interface ProductFormData {
  id?: string;
  sku: string;
  name_ar: string;
  name_fr: string;
  description_ar: string;
  description_fr: string;
  category_id: string;
  price: number;
  old_price: number | null;
  stock: number;
  colors: string[];
  sizes: string[];
  images: string[];
  is_active: boolean;
  is_featured: boolean;
}

export async function saveProduct(form: ProductFormData) {
  const supabase = createAdminClient();
  const payload = {
    sku: form.sku || null,
    name_ar: form.name_ar,
    name_fr: form.name_fr,
    slug: slugify(form.name_fr || form.name_ar),
    description_ar: form.description_ar || null,
    description_fr: form.description_fr || null,
    category_id: form.category_id || null,
    price: form.price,
    old_price: form.old_price,
    stock: form.stock,
    colors: form.colors,
    sizes: form.sizes,
    images: form.images,
    is_active: form.is_active,
    is_featured: form.is_featured,
  };

  if (form.id) {
    await supabase.from("products").update(payload).eq("id", form.id);
  } else {
    await supabase.from("products").insert(payload);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}
