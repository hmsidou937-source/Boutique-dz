"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveCommune(data: {
  id?: string;
  wilaya_id: number;
  name_ar: string;
  name_fr: string;
  home_price: number;
  office_price: number;
  delivery_days_min: number;
  delivery_days_max: number;
  carrier: string;
}) {
  const supabase = createAdminClient();
  const payload = {
    wilaya_id: data.wilaya_id,
    name_ar: data.name_ar,
    name_fr: data.name_fr,
    home_price: data.home_price,
    office_price: data.office_price,
    delivery_days_min: data.delivery_days_min,
    delivery_days_max: data.delivery_days_max,
    carrier: data.carrier || null,
  };

  if (data.id) {
    await supabase.from("communes").update(payload).eq("id", data.id);
  } else {
    await supabase.from("communes").insert(payload);
  }

  revalidatePath("/admin/delivery");
  return { success: true };
}

export async function deleteCommune(id: string) {
  const supabase = createAdminClient();
  await supabase.from("communes").delete().eq("id", id);
  revalidatePath("/admin/delivery");
  return { success: true };
}

export async function addWilaya(data: { code: string; name_ar: string; name_fr: string }) {
  const supabase = createAdminClient();
  await supabase.from("wilayas").insert(data);
  revalidatePath("/admin/delivery");
  return { success: true };
}
