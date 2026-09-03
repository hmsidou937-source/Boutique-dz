"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localized } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, dict } = useLanguage();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-black/5 bg-white p-3">
      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-lg border border-black/10 px-3 py-2 text-sm"
      >
        <option value="">{dict.filters.category}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {localized(c, "name", locale)}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("sort") ?? ""}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-lg border border-black/10 px-3 py-2 text-sm"
      >
        <option value="">{dict.filters.sort}</option>
        <option value="price_asc">{locale === "ar" ? "السعر: من الأقل" : "Prix croissant"}</option>
        <option value="price_desc">{locale === "ar" ? "السعر: من الأعلى" : "Prix décroissant"}</option>
        <option value="newest">{locale === "ar" ? "الأحدث" : "Plus récent"}</option>
      </select>

      <div className="flex items-center gap-2 text-sm">
        <input
          type="number"
          placeholder={locale === "ar" ? "أدنى سعر" : "Min"}
          defaultValue={searchParams.get("min") ?? ""}
          onBlur={(e) => updateParam("min", e.target.value)}
          className="w-24 rounded-lg border border-black/10 px-2 py-2"
        />
        <span>—</span>
        <input
          type="number"
          placeholder={locale === "ar" ? "أعلى سعر" : "Max"}
          defaultValue={searchParams.get("max") ?? ""}
          onBlur={(e) => updateParam("max", e.target.value)}
          className="w-24 rounded-lg border border-black/10 px-2 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          defaultChecked={searchParams.get("inStock") === "1"}
          onChange={(e) => updateParam("inStock", e.target.checked ? "1" : "")}
        />
        {dict.filters.inStockOnly}
      </label>
    </div>
  );
}
