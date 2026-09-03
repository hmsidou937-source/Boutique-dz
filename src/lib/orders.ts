"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const ORDER_SELECT =
  "*, order_items(*), wilayas(name_ar, name_fr), communes(name_ar, name_fr)";

/** Used by the order-confirmation page right after checkout. */
export async function getOrderByNumber(orderNumber: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("orders").select(ORDER_SELECT).eq("order_number", orderNumber).maybeSingle();
  return data;
}

/**
 * Used by the "track my order" page for guests: requires BOTH the exact
 * order number and the phone used at checkout, so a stranger can't
 * enumerate other customers' orders.
 */
export async function trackOrder(orderNumber: string, phone: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("order_number", orderNumber.trim())
    .eq("phone", phone.trim())
    .maybeSingle();
  return data;
}
