"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-black/10 p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLocale("ar")}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          locale === "ar" ? "bg-brand-600 text-white" : "text-ink-800/60"
        )}
      >
        عربي
      </button>
      <button
        onClick={() => setLocale("fr")}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          locale === "fr" ? "bg-brand-600 text-white" : "text-ink-800/60"
        )}
      >
        FR
      </button>
    </div>
  );
}
