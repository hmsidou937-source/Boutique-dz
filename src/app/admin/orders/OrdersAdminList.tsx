"use client";

import { useMemo, useState } from "react";
import { Printer, Download } from "lucide-react";
import { updateOrderStatus } from "./actions";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STATUSES: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "new", label: "جديدة" },
  { value: "confirming", label: "قيد التأكيد" },
  { value: "confirmed", label: "مؤكدة" },
  { value: "shipping", label: "قيد الشحن" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "cancelled", label: "ملغاة" },
  { value: "returned", label: "مرتجعة" },
];

interface OrderRow {
  id: string;
  order_number: string;
  full_name: string;
  phone: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  delivery_method: string;
  wilayas?: { name_ar: string } | null;
  communes?: { name_ar: string } | null;
  order_items: { product_name: string; quantity: number; unit_price: number }[];
}

export function OrdersAdminList({ orders }: { orders: OrderRow[] }) {
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const wilayaOptions = useMemo(
    () => [...new Set(orders.map((o) => o.wilayas?.name_ar).filter(Boolean))] as string[],
    [orders]
  );

  const filtered = orders.filter((o) => {
    if (tab !== "all" && o.status !== tab) return false;
    if (search && !o.phone.includes(search) && !o.order_number.toLowerCase().includes(search.toLowerCase())) return false;
    if (wilayaFilter && o.wilayas?.name_ar !== wilayaFilter) return false;
    if (dateFrom && new Date(o.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(o.created_at) > new Date(dateTo)) return false;
    return true;
  });

  function exportCsv() {
    const header = ["رقم الطلب", "الاسم", "الهاتف", "الولاية", "البلدية", "المجموع", "الحالة", "التاريخ"];
    const rows = filtered.map((o) => [
      o.order_number,
      o.full_name,
      o.phone,
      o.wilayas?.name_ar ?? "",
      o.communes?.name_ar ?? "",
      o.total,
      o.status,
      new Date(o.created_at).toLocaleDateString("ar-DZ"),
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">الطلبات ({filtered.length})</h1>
        <button onClick={exportCsv} className="flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
          <Download className="h-4 w-4" /> تصدير CSV
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setTab(s.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${tab === s.value ? "bg-brand-600 text-white" : "bg-black/5 text-ink-800/60"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input max-w-xs" placeholder="بحث برقم الطلب أو الهاتف" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-xs" value={wilayaFilter} onChange={(e) => setWilayaFilter(e.target.value)}>
          <option value="">كل الولايات</option>
          {wilayaOptions.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        <input type="date" className="input max-w-xs" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" className="input max-w-xs" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-xl border border-black/5 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-brand-700">{o.order_number}</p>
                <p className="text-sm text-ink-800/70">{o.full_name} — {o.phone}</p>
                <p className="text-xs text-ink-800/50">{o.wilayas?.name_ar}, {o.communes?.name_ar} · {new Date(o.created_at).toLocaleString("ar-DZ")}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{formatPrice(o.total)}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                  className="rounded-full border border-black/10 px-2 py-1 text-xs"
                >
                  {STATUSES.filter((s) => s.value !== "all").map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button onClick={() => window.print()} className="text-ink-800/50 hover:text-brand-600">
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ul className="mt-2 border-t border-black/5 pt-2 text-xs text-ink-800/60">
              {o.order_items.map((item, i) => (
                <li key={i}>{item.product_name} × {item.quantity} — {formatPrice(item.unit_price * item.quantity)}</li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length === 0 && <p className="p-8 text-center text-ink-800/40">لا توجد طلبات مطابقة</p>}
      </div>
    </div>
  );
}
