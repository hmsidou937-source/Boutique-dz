"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { ProductForm } from "./ProductForm";
import { formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";

export function ProductsAdminList({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">المنتجات ({products.length})</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> إضافة منتج
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-black/[0.02] text-ink-800/60">
            <tr>
              <th className="p-3 text-start">المنتج</th>
              <th className="p-3 text-start">SKU</th>
              <th className="p-3 text-start">السعر</th>
              <th className="p-3 text-start">المخزون</th>
              <th className="p-3 text-start">الحالة</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-black/5">
                <td className="flex items-center gap-2 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0] ?? "/placeholder-product.png"} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  {p.name_ar}
                </td>
                <td className="p-3 text-ink-800/60">{p.sku ?? "—"}</td>
                <td className="p-3 font-semibold">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-black/5 text-ink-800/50"}`}>
                    {p.is_active ? "نشط" : "معطل"}
                  </span>
                </td>
                <td className="p-3 text-end">
                  <button onClick={() => setEditing(p)} className="text-brand-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-ink-800/40">لا توجد منتجات بعد</p>}
      </div>

      {(showAdd || editing) && (
        <ProductForm
          categories={categories}
          product={editing ?? undefined}
          onDone={() => {
            setShowAdd(false);
            setEditing(undefined);
          }}
        />
      )}
    </div>
  );
}
