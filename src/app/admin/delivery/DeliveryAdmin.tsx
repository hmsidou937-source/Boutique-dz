"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { saveCommune, deleteCommune, addWilaya } from "./actions";
import type { Commune, Wilaya } from "@/lib/types";

export function DeliveryAdmin({ wilayas, communes }: { wilayas: Wilaya[]; communes: Commune[] }) {
  const router = useRouter();
  const [selectedWilaya, setSelectedWilaya] = useState<number | "">(wilayas[0]?.id ?? "");
  const [newCommune, setNewCommune] = useState({ name_ar: "", name_fr: "", home_price: 0, office_price: 0, carrier: "" });
  const [newWilaya, setNewWilaya] = useState({ code: "", name_ar: "", name_fr: "" });
  const [saving, setSaving] = useState(false);

  const filteredCommunes = communes.filter((c) => c.wilaya_id === selectedWilaya);

  async function handleAddCommune() {
    if (!selectedWilaya || !newCommune.name_ar) return;
    setSaving(true);
    await saveCommune({
      wilaya_id: Number(selectedWilaya),
      name_ar: newCommune.name_ar,
      name_fr: newCommune.name_fr,
      home_price: newCommune.home_price,
      office_price: newCommune.office_price,
      delivery_days_min: 1,
      delivery_days_max: 3,
      carrier: newCommune.carrier,
    });
    setNewCommune({ name_ar: "", name_fr: "", home_price: 0, office_price: 0, carrier: "" });
    setSaving(false);
    router.refresh();
  }

  async function handleUpdatePrice(commune: Commune, field: "home_price" | "office_price", value: number) {
    await saveCommune({ id: commune.id, wilaya_id: commune.wilaya_id, name_ar: commune.name_ar, name_fr: commune.name_fr, home_price: field === "home_price" ? value : commune.home_price, office_price: field === "office_price" ? value : commune.office_price, delivery_days_min: commune.delivery_days_min, delivery_days_max: commune.delivery_days_max, carrier: commune.carrier ?? "" });
    router.refresh();
  }

  async function handleDeleteCommune(id: string) {
    if (!confirm("حذف هذه البلدية؟")) return;
    await deleteCommune(id);
    router.refresh();
  }

  async function handleAddWilaya() {
    if (!newWilaya.code || !newWilaya.name_ar) return;
    await addWilaya(newWilaya);
    setNewWilaya({ code: "", name_ar: "", name_fr: "" });
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">إعدادات التوصيل</h1>

      <div className="mb-6 flex flex-wrap items-end gap-2 rounded-xl border border-black/5 bg-white p-4">
        <div>
          <p className="mb-1 text-xs text-ink-800/50">إضافة ولاية جديدة</p>
          <div className="flex gap-2">
            <input className="input w-20" placeholder="الرمز" value={newWilaya.code} onChange={(e) => setNewWilaya({ ...newWilaya, code: e.target.value })} />
            <input className="input" placeholder="الاسم (عربي)" value={newWilaya.name_ar} onChange={(e) => setNewWilaya({ ...newWilaya, name_ar: e.target.value })} />
            <input className="input" placeholder="Nom (français)" value={newWilaya.name_fr} onChange={(e) => setNewWilaya({ ...newWilaya, name_fr: e.target.value })} />
            <button onClick={handleAddWilaya} className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white">إضافة</button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {wilayas.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedWilaya(w.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selectedWilaya === w.id ? "bg-brand-600 text-white" : "bg-black/5 text-ink-800/60"}`}
          >
            {w.code} — {w.name_ar}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-black/5 bg-white p-4">
        <input className="input flex-1" placeholder="البلدية (عربي)" value={newCommune.name_ar} onChange={(e) => setNewCommune({ ...newCommune, name_ar: e.target.value })} />
        <input className="input flex-1" placeholder="Commune (français)" value={newCommune.name_fr} onChange={(e) => setNewCommune({ ...newCommune, name_fr: e.target.value })} />
        <input type="number" className="input w-32" placeholder="سعر المنزل" value={newCommune.home_price} onChange={(e) => setNewCommune({ ...newCommune, home_price: Number(e.target.value) })} />
        <input type="number" className="input w-32" placeholder="سعر المكتب" value={newCommune.office_price} onChange={(e) => setNewCommune({ ...newCommune, office_price: Number(e.target.value) })} />
        <input className="input w-32" placeholder="شركة التوصيل" value={newCommune.carrier} onChange={(e) => setNewCommune({ ...newCommune, carrier: e.target.value })} />
        <button disabled={saving} onClick={handleAddCommune} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> إضافة بلدية
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-ink-800/60">
            <tr>
              <th className="p-3 text-start">البلدية</th>
              <th className="p-3 text-start">سعر المنزل</th>
              <th className="p-3 text-start">سعر المكتب</th>
              <th className="p-3 text-start">شركة التوصيل</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCommunes.map((c) => (
              <tr key={c.id} className="border-t border-black/5">
                <td className="p-3">{c.name_ar}</td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={c.home_price}
                    onBlur={(e) => handleUpdatePrice(c, "home_price", Number(e.target.value))}
                    className="w-24 rounded border border-black/10 px-2 py-1"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={c.office_price}
                    onBlur={(e) => handleUpdatePrice(c, "office_price", Number(e.target.value))}
                    className="w-24 rounded border border-black/10 px-2 py-1"
                  />
                </td>
                <td className="p-3 text-ink-800/60">{c.carrier ?? "—"}</td>
                <td className="p-3 text-end">
                  <button onClick={() => handleDeleteCommune(c.id)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCommunes.length === 0 && <p className="p-8 text-center text-ink-800/40">لا توجد بلديات لهذه الولاية بعد</p>}
      </div>
    </div>
  );
}
