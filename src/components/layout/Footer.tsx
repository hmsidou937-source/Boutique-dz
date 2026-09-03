"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { StoreSettings } from "@/lib/types";

export function Footer({ settings }: { settings: StoreSettings }) {
  const { dict, locale } = useLanguage();

  return (
    <footer className="mt-16 border-t border-black/5 bg-ink-900 pb-24 pt-10 text-white/80 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">{settings.store_name}</h3>
          <p className="text-sm">{settings.address}</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">{locale === "ar" ? "روابط" : "Liens"}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products">{dict.nav.categories}</Link></li>
            <li><Link href="/policies/delivery">{locale === "ar" ? "سياسة التوصيل" : "Politique de livraison"}</Link></li>
            <li><Link href="/policies/returns">{locale === "ar" ? "سياسة الاستبدال" : "Politique de retour"}</Link></li>
            <li><Link href="/policies/privacy">{locale === "ar" ? "سياسة الخصوصية" : "Confidentialité"}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">{locale === "ar" ? "تواصل معنا" : "Contact"}</h4>
          <ul className="space-y-2 text-sm">
            {settings.phone && <li>{settings.phone}</li>}
            {settings.email && <li>{settings.email}</li>}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">{locale === "ar" ? "تابعنا" : "Suivez-nous"}</h4>
          <ul className="space-y-2 text-sm">
            {settings.facebook_url && <li><a href={settings.facebook_url}>Facebook</a></li>}
            {settings.instagram_url && <li><a href={settings.instagram_url}>Instagram</a></li>}
            {settings.tiktok_url && <li><a href={settings.tiktok_url}>TikTok</a></li>}
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {settings.store_name}. {locale === "ar" ? "جميع الحقوق محفوظة" : "Tous droits réservés"}.
      </p>
    </footer>
  );
}
