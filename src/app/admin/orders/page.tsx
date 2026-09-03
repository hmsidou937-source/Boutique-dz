import { createAdminClient } from "@/lib/supabase/admin";
import { OrdersAdminList } from "./OrdersAdminList";

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*), wilayas(name_ar), communes(name_ar)")
    .order("created_at", { ascending: false });

  return <OrdersAdminList orders={(data as any) ?? []} />;
}
