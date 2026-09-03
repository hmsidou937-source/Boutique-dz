"use client";

import Link from "next/link";
import { Search, ShoppingCart, Heart, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useCart } from "@/contexts/CartContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { StoreSettings } from "@/lib/types";

export function Header({ settings }: { settings: Pick<StoreSettings, "store_name" | "logo_url"> }) {
  const { dict } = useLanguage();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-ink-900 shrink-0">
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo_url} alt={settings.store_name} className="h-8 w-auto" />
          ) : (
            <span className="rounded-lg bg-brand-600 px-2 py-1 text-white">{settings.store_name?.[0] ?? "D"}</span>
          )}
          <span className="hidden sm:inline">{settings.store_name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-800">
          <Link href="/">{dict.nav.home}</Link>
          <Link href="/products">{dict.nav.categories}</Link>
          <Link href="/account/orders">{dict.nav.orders}</Link>
        </nav>

        <form action="/products" className="ms-auto hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-ink-800/40" />
            <input
              name="q"
              placeholder={dict.search.placeholder}
              className="w-full rounded-full border border-black/10 bg-black/[0.03] py-2 ps-9 pe-4 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </form>

        <div className="ms-auto md:ms-0 flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/account/orders" aria-label="account" className="text-ink-800 hover:text-brand-600">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" aria-label="wishlist" className="text-ink-800 hover:text-brand-600">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/cart" aria-label="cart" className="relative text-ink-800 hover:text-brand-600">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -end-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
