"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatPrice, localized } from "@/lib/utils";
import { createOrder } from "./actions";
import { trackEvent } from "@/components/analytics/Pixels";
import type { Commune, DeliveryMethod, Wilaya } from "@/lib/types";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { locale, dict } = useLanguage();
  const router = useRouter();

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [wilayaId, setWilayaId] = useState<number | "">("");
  const [communeId, setCommuneId] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("home");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/wilayas")
      .then((r) => r.json())
      .then((d) => setWilayas(d.wilayas ?? []))
      .catch(() => {});
    trackEvent("InitiateCheckout", { value: subtotal, currency: "DZD" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!wilayaId) {
      setCommunes([]);
      setCommuneId("");
      return;
    }
    fetch(`/api/communes?wilayaId=${wilayaId}`)
      .then((r) => r.json())
      .then((d) => setCommunes(d.communes ?? []));
  }, [wilayaId]);

  const selectedCommune = communes.find((c) => c.id === communeId);
  const deliveryPrice = selectedCommune
    ? deliveryMethod === "home"
      ? selectedCommune.home_price
      : selectedCommune.office_price
    : 0;
  const total = subtotal + deliveryPrice;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError("");

    const result = await createOrder({
      fullName,
      phone,
      email: email || undefined,
      wilayaId: Number(wilayaId),
      communeId,
      address,
      notes,
      deliveryMethod,
      items: lines.map((l) => ({
        product_id: l.productId,
        product_name: l.name,
        unit_price: l.price,
        quantity: l.quantity,
        color: l.color,
        size: l.size,
      })),
    });

    setSubmitting(false);

    if (!result.success || !result.orderNumber) {
      setError(result.error === "invalid_phone" ? "رقم الهاتف غير صحيح / Numéro invalide" : "حدث خطأ، حاول مجددًا / Une erreur est survenue");
      return;
    }

    trackEvent("Purchase", { value: total, currency: "DZD" });
    clear();
    router.push(`/order-confirmation/${result.orderNumber}`);
  }

  if (lines.length === 0) {
    return <p className="mx-auto max-w-xl px-4 py-20 text-center text-ink-800/60">{dict.cart.empty}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-ink-900">{dict.checkout.title}</h1>

      <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label={dict.checkout.fullName}>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
          </Field>
          <Field label={dict.checkout.phone}>
            <input
              required
              type="tel"
              placeholder="05xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
            />
          </Field>
          <Field label={locale === "ar" ? "البريد الإلكتروني (اختياري، لإرسال تأكيد)" : "Email (optionnel, pour la confirmation)"}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={dict.checkout.wilaya}>
              <select
                required
                value={wilayaId}
                onChange={(e) => setWilayaId(Number(e.target.value))}
                className="input"
              >
                <option value="">—</option>
                {wilayas.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.code} — {localized(w, "name", locale)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={dict.checkout.commune}>
              <select required value={communeId} onChange={(e) => setCommuneId(e.target.value)} className="input" disabled={!wilayaId}>
                <option value="">—</option>
                {communes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {localized(c, "name", locale)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label={dict.checkout.address}>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
          </Field>

          <Field label={dict.checkout.deliveryMethod}>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod("home")}
                className={`rounded-lg border p-3 text-start text-sm ${deliveryMethod === "home" ? "border-brand-600 bg-brand-50" : "border-black/10"}`}
              >
                🏠 {dict.checkout.home}
                {selectedCommune && <div className="mt-1 font-bold text-brand-700">{formatPrice(selectedCommune.home_price, locale)}</div>}
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod("office")}
                className={`rounded-lg border p-3 text-start text-sm ${deliveryMethod === "office" ? "border-brand-600 bg-brand-50" : "border-black/10"}`}
              >
                🏢 {dict.checkout.office}
                {selectedCommune && <div className="mt-1 font-bold text-brand-700">{formatPrice(selectedCommune.office_price, locale)}</div>}
              </button>
            </div>
          </Field>

          <Field label={dict.checkout.notes}>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input" rows={2} />
          </Field>

          <Field label={dict.checkout.payment}>
            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-3 text-sm font-medium">💵 {dict.checkout.cod}</div>
          </Field>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            disabled={submitting || !communeId}
            type="submit"
            className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {submitting ? "..." : dict.checkout.submit}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-black/5 bg-white p-4">
          <h2 className="mb-3 font-semibold text-ink-900">{dict.cart.title}</h2>
          <div className="space-y-2 text-sm">
            {lines.map((l) => (
              <div key={l.productId + (l.color ?? "") + (l.size ?? "")} className="flex justify-between">
                <span className="text-ink-800/70">{l.name} × {l.quantity}</span>
                <span>{formatPrice(l.price * l.quantity, locale)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1 border-t border-black/5 pt-3 text-sm">
            <div className="flex justify-between text-ink-800/70">
              <span>{dict.cart.subtotal}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            <div className="flex justify-between text-ink-800/70">
              <span>{dict.cart.delivery}</span>
              <span>{selectedCommune ? formatPrice(deliveryPrice, locale) : "—"}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink-900">
              <span>{dict.cart.total}</span>
              <span>{formatPrice(total, locale)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-800">{label}</span>
      {children}
    </label>
  );
}
