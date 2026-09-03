"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProduct, deleteProduct, type ProductFormData } from "./actions";
import type { Category, Product } from "@/lib/types";

const emptyForm: ProductFormData = {
  sku: "",
  name_ar: "",
  name_fr: "",
  description_ar: "",
  description_fr: "",
  category_id: "",
  price: 0,
  old_price: null,
  stock: 0,
  colors: [],
  sizes: [],
  images: [],
  is_active: true,
  is_featured: false,
};

export function ProductForm({ categories, product, onDone }: { categories: Category[]; product?: Product; onDone: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          id: product.id,
          sku: product.sku ?? "",
          name_ar: product.name_ar,
          name_fr: product.name_fr,
          description_ar: product.description_ar ?? "",
          description_fr: product.description_fr ?? "",
          category_id: product.category_id ?? "",
          price: product.price,
          old_price: product.old_price,
          stock: product.stock,
          colors: product.colors,
          sizes: product.sizes,
          images: product.images,
          is_active: product.is_active,
          is_featured: product.is_featured,
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await saveProduct(form);
    setSaving(false);
    router.refresh();
    onDone();
  }

  async function handleDelete() {
    if (!form.id) return;
    if (!confirm("حذف هذا المنتج نهائيًا؟")) return;
    await deleteProduct(form.id);
    router.refresh();
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">{product ? "تعديل منتج" : "إضافة منتج"}</h2>

        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="الاسم (عربي)" value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} />
          <input className="input" placeholder="Nom (français)" value={form.name_fr} onChange={(e) => set("name_fr", e.target.value)} />
          <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => set("sku", e.target.value)} />
          <select className="input" value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
            <option value="">— بدون تصنيف —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name_ar}</option>
            ))}
          </select>
          <input type="number" className="input" placeholder="السعر" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
          <input
            type="number"
            className="input"
            placeholder="السعر القديم (اختياري)"
            value={form.old_price ?? ""}
            onChange={(e) => set("old_price", e.target.value ? Number(e.target.value) : null)}
          />
          <input type="number" className="input" placeholder="المخزون" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} />
          <input
            className="input"
            placeholder="الألوان (مفصولة بفاصلة)"
            value={form.colors.join(", ")}
            onChange={(e) => set("colors", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
          <input
            className="input"
            placeholder="المقاسات (مفصولة بفاصلة)"
            value={form.sizes.join(", ")}
            onChange={(e) => set("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </div>

        <textarea className="input mt-3" rows={3} placeholder="الوصف (عربي)" value={form.description_ar} onChange={(e) => set("description_ar", e.target.value)} />
        <textarea className="input mt-3" rows={3} placeholder="Description (français)" value={form.description_fr} onChange={(e) => set("description_fr", e.target.value)} />

        <textarea
          className="input mt-3"
          rows={2}
          placeholder="روابط الصور (رابط في كل سطر) — ارفعها إلى Supabase Storage ثم الصق الرابط العام"
          value={form.images.join("\n")}
          onChange={(e) => set("images", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />

        <div className="mt-3 flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} />
            نشط
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
            مميز (يظهر في الأكثر مبيعًا)
          </label>
        </div>

        <div className="mt-6 flex justify-between">
          <div>
            {product && (
              <button onClick={handleDelete} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                حذف
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onDone} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">
              إلغاء
            </button>
            <button disabled={saving} onClick={handleSave} className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? "..." : "حفظ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
