"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StoreSettings } from "@/lib/types";

export async function saveSettings(data: Omit<StoreSettings, "id">) {
  const supabase = createAdminClient();
  await supabase.from("store_settings").update(data).eq("id", 1);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}
