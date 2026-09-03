"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { saveCategory, deleteCategory } from "./actions";
import type { Category } from "@/lib/types";

export function CategoriesAdmin({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!nameAr || !nameFr) return;
    setSaving(true);
    await saveCategory({ name_ar: nameAr, name_fr: nameFr, image_url: imageUrl, sort_order: categories.length });
    setNameAr("");
    setNameFr("");
    setImageUrl("");
    setSaving(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا التصنيف؟")) return;
    await deleteCategory(id);
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">التصنيفات</h1>

      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-black/5 bg-white p-4">
        <input className="input flex-1" placeholder="الاسم (عربي)" value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
        <input className="input flex-1" placeholder="Nom (français)" value={nameFr} onChange={(e) => setNameFr(e.target.value)} />
        <input className="input flex-1" placeholder="رابط الصورة (اختياري)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button disabled={saving} onClick={handleAdd} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> إضافة
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image_url ?? "/placeholder-product.png"} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-medium">{c.name_ar}</p>
              <p className="text-xs text-ink-800/50">{c.name_fr}</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
