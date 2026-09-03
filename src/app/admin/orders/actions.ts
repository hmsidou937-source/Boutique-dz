"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createAdminClient();
  await supabase.from("orders").update({ status }).eq("id", orderId);
  revalidatePath("/admin/orders");
  return { success: true };
}
