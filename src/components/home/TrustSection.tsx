"use client";

import { Truck, Wallet, Repeat, ShieldCheck, Headset } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function TrustSection() {
  const { dict } = useLanguage();

  const items = [
    { icon: Truck, label: dict.trust.delivery },
    { icon: Wallet, label: dict.trust.cod },
    { icon: Repeat, label: dict.trust.exchange },
    { icon: ShieldCheck, label: dict.trust.secure },
    { icon: Headset, label: dict.trust.support },
  ];

  return (
    <section className="border-y border-black/5 bg-white py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-3 md:grid-cols-5">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium text-ink-800/80">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
