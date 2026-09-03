import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import { SalesChart } from "./SalesChart";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [{ data: orders }, { count: customersCount }] = await Promise.all([
    supabase.from("orders").select("*, order_items(*), wilayas(name_ar)"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
  ]);

  const all = orders ?? [];
  const delivered = all.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const totalSales = delivered.reduce((s, o) => s + Number(o.total), 0);
  const cancelled = all.filter((o) => o.status === "cancelled").length;
  const completionRate = all.length > 0 ? Math.round(((all.length - cancelled) / all.length) * 100) : 0;

  const productSales = new Map<string, number>();
  for (const o of all) {
    for (const item of o.order_items ?? []) {
      productSales.set(item.product_name, (productSales.get(item.product_name) ?? 0) + item.quantity);
    }
  }
  const bestSellers = [...productSales.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const byWilaya = new Map<string, number>();
  for (const o of all) {
    const name = (o as any).wilayas?.name_ar ?? "—";
    byWilaya.set(name, (byWilaya.get(name) ?? 0) + Number(o.total));
  }

  const byDay = new Map<string, number>();
  for (const o of all) {
    const day = new Date(o.created_at).toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + Number(o.total));
  }
  const chartData = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14)
    .map(([date, total]) => ({ date: date.slice(5), total }));

  const stats = [
    { label: "إجمالي المبيعات", value: formatPrice(totalSales) },
    { label: "عدد الطلبات", value: all.length },
    { label: "عدد العملاء", value: customersCount ?? 0 },
    { label: "معدل إتمام الطلبات", value: `${completionRate}%` },
    { label: "الطلبات الملغاة", value: cancelled },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">الإحصائيات</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-black/5 bg-white p-4">
            <p className="text-xs text-ink-800/50">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-ink-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-black/5 bg-white p-4">
        <h2 className="mb-4 font-semibold text-ink-900">المبيعات اليومية (آخر 14 يوم)</h2>
        <SalesChart data={chartData} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-black/5 bg-white p-4">
          <h2 className="mb-3 font-semibold text-ink-900">المنتجات الأكثر مبيعًا</h2>
          <ul className="space-y-2 text-sm">
            {bestSellers.map(([name, qty]) => (
              <li key={name} className="flex justify-between border-b border-black/5 pb-2">
                <span>{name}</span>
                <span className="font-bold">{qty}</span>
              </li>
            ))}
            {bestSellers.length === 0 && <p className="text-ink-800/40">لا توجد بيانات بعد</p>}
          </ul>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-4">
          <h2 className="mb-3 font-semibold text-ink-900">المبيعات حسب الولاية</h2>
          <ul className="space-y-2 text-sm">
            {[...byWilaya.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, total]) => (
              <li key={name} className="flex justify-between border-b border-black/5 pb-2">
                <span>{name}</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </li>
            ))}
            {byWilaya.size === 0 && <p className="text-ink-800/40">لا توجد بيانات بعد</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
