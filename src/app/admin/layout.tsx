import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Truck,
  Settings as SettingsIcon,
} from "lucide-react";
import { SignOutButton } from "./SignOutButton";

const links = [
  { href: "/admin", label: "الإحصائيات", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: Tags },
  { href: "/admin/delivery", label: "التوصيل", icon: Truck },
  { href: "/admin/settings", label: "الإعدادات", icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="flex min-h-screen bg-black/[0.02]">
      <aside className="hidden w-60 shrink-0 flex-col border-e border-black/5 bg-white p-4 md:flex">
        <div className="mb-6 px-2 text-lg font-bold text-ink-900">لوحة التحكم</div>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-700"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </aside>

      <div className="flex-1 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 md:hidden">
          <span className="font-bold">لوحة التحكم</span>
          <SignOutButton compact />
        </div>
        <nav className="flex gap-2 overflow-x-auto border-b border-black/5 bg-white px-2 py-2 md:hidden">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className="shrink-0 rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium">
              {label}
            </Link>
          ))}
        </nav>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
