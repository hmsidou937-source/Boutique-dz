import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { TrackOrderForm } from "./TrackOrderForm";

export default async function AccountOrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let orders: any[] = [];
  if (user) {
    const { data: customer } = await supabase.from("customers").select("id").eq("auth_user_id", user.id).maybeSingle();
    if (customer) {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false });
      orders = data ?? [];
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink-900">طلباتي / Mes commandes</h1>

      {user ? (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-black/5 bg-white p-4">
              <div className="flex justify-between font-bold text-brand-700">
                <span>{o.order_number}</span>
                <span>{formatPrice(o.total)}</span>
              </div>
              <p className="mt-1 text-sm text-ink-800/60">{o.status} · {new Date(o.created_at).toLocaleDateString("ar-DZ")}</p>
            </div>
          ))}
          {orders.length === 0 && <p className="text-ink-800/50">لا توجد طلبات بعد</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-ink-800/60">
            <Link href="/account/login" className="font-semibold text-brand-600">سجّل الدخول</Link> لمشاهدة طلباتك تلقائيًا، أو تتبّع طلبك كزائر بالأسفل.
          </p>
          <TrackOrderForm />
        </div>
      )}
    </div>
  );
}
