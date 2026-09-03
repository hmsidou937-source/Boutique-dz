"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function TrackOrderForm() {
  const { locale } = useLanguage();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    const order = await trackOrder(orderNumber, phone);
    setResult(order);
    setNotFound(!order);
    setLoading(false);
  }

  return (
    <div className="rounded-xl border border-black/5 bg-white p-4">
      <h2 className="mb-3 font-semibold text-ink-900">
        {locale === "ar" ? "تتبّع طلبك كزائر" : "Suivre ma commande (invité)"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input required placeholder={locale === "ar" ? "رقم الطلب" : "N° de commande"} value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="input max-w-xs" />
        <input required placeholder={locale === "ar" ? "رقم الهاتف" : "Téléphone"} value={phone} onChange={(e) => setPhone(e.target.value)} className="input max-w-xs" />
        <button disabled={loading} className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "..." : locale === "ar" ? "بحث" : "Rechercher"}
        </button>
      </form>

      {notFound && <p className="mt-3 text-sm text-red-600">{locale === "ar" ? "لم يتم العثور على الطلب" : "Commande introuvable"}</p>}

      {result && (
        <div className="mt-4 rounded-lg border border-black/5 p-3 text-sm">
          <div className="flex justify-between font-bold text-brand-700">
            <span>{result.order_number}</span>
            <span>{formatPrice(result.total, locale)}</span>
          </div>
          <p className="mt-1 text-ink-800/70">{locale === "ar" ? "الحالة" : "Statut"}: {result.status}</p>
        </div>
      )}
    </div>
  );
}
