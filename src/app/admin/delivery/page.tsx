import { createAdminClient } from "@/lib/supabase/admin";
import { DeliveryAdmin } from "./DeliveryAdmin";
import type { Commune, Wilaya } from "@/lib/types";

export default async function AdminDeliveryPage() {
  const supabase = createAdminClient();
  const [{ data: wilayas }, { data: communes }] = await Promise.all([
    supabase.from("wilayas").select("*").order("code"),
    supabase.from("communes").select("*").order("name_ar"),
  ]);

  return <DeliveryAdmin wilayas={(wilayas as Wilaya[]) ?? []} communes={(communes as Commune[]) ?? []} />;
}
