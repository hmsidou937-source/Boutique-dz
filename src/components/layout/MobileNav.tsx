"use client";

import Link from "next/link";
import { Home, LayoutGrid, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useCart } from "@/contexts/CartContext";

export function MobileNav() {
  const { dict } = useLanguage();
  const { count } = useCart();

  const items = [
    { href: "/", label: dict.nav.home, icon: Home },
    { href: "/products", label: dict.nav.categories, icon: LayoutGrid },
    { href: "/cart", label: dict.nav.cart, icon: ShoppingCart, badge: count },
    { href: "/account/orders", label: dict.nav.orders, icon: ClipboardList },
    { href: "/account/login", label: dict.nav.account, icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-black/10 bg-white md:hidden">
      {items.map(({ href, label, icon: Icon, badge }) => (
        <Link key={href} href={href} className="relative flex flex-col items-center gap-0.5 py-2 text-[11px] text-ink-800">
          <Icon className="h-5 w-5" />
          {label}
          {!!badge && (
            <span className="absolute top-1 end-6 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white">
              {badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
