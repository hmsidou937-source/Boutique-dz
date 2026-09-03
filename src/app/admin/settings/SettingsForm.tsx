"use client";

import { useState } from "react";
import { saveSettings } from "./actions";
import type { StoreSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const { id, ...rest } = form;
    await saveSettings(rest);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-ink-900">إعدادات المتجر</h1>

      <Section title="الهوية">
        <input className="input" placeholder="اسم المتجر" value={form.store_name} onChange={(e) => set("store_name", e.target.value)} />
        <input className="input" placeholder="رابط الشعار Logo" value={form.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value)} />
        <input className="input" placeholder="رابط Favicon" value={form.favicon_url ?? ""} onChange={(e) => set("favicon_url", e.target.value)} />
        <input type="color" className="h-10 w-20 rounded border border-black/10" value={form.primary_color} onChange={(e) => set("primary_color", e.target.value)} />
      </Section>

      <Section title="التواصل">
        <input className="input" placeholder="رقم الهاتف" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        <input className="input" placeholder="رقم WhatsApp (بصيغة دولية مثل 213551234567)" value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
        <input className="input" placeholder="البريد الإلكتروني" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
        <input className="input" placeholder="العنوان" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
      </Section>

      <Section title="الشبكات الاجتماعية">
        <input className="input" placeholder="رابط Facebook" value={form.facebook_url ?? ""} onChange={(e) => set("facebook_url", e.target.value)} />
        <input className="input" placeholder="رابط Instagram" value={form.instagram_url ?? ""} onChange={(e) => set("instagram_url", e.target.value)} />
        <input className="input" placeholder="رابط TikTok" value={form.tiktok_url ?? ""} onChange={(e) => set("tiktok_url", e.target.value)} />
      </Section>

      <Section title="Meta Pixel / TikTok Pixel">
        <input className="input" placeholder="Meta Pixel ID" value={form.meta_pixel_id ?? ""} onChange={(e) => set("meta_pixel_id", e.target.value)} />
        <input className="input" placeholder="TikTok Pixel ID" value={form.tiktok_pixel_id ?? ""} onChange={(e) => set("tiktok_pixel_id", e.target.value)} />
      </Section>

      <Section title="السياسات">
        <textarea className="input" rows={3} placeholder="سياسة التوصيل (عربي)" value={form.delivery_policy_ar ?? ""} onChange={(e) => set("delivery_policy_ar", e.target.value)} />
        <textarea className="input" rows={3} placeholder="Politique de livraison (français)" value={form.delivery_policy_fr ?? ""} onChange={(e) => set("delivery_policy_fr", e.target.value)} />
        <textarea className="input" rows={3} placeholder="سياسة الاستبدال (عربي)" value={form.return_policy_ar ?? ""} onChange={(e) => set("return_policy_ar", e.target.value)} />
        <textarea className="input" rows={3} placeholder="Politique de retour (français)" value={form.return_policy_fr ?? ""} onChange={(e) => set("return_policy_fr", e.target.value)} />
        <textarea className="input" rows={3} placeholder="سياسة الخصوصية (عربي)" value={form.privacy_policy_ar ?? ""} onChange={(e) => set("privacy_policy_ar", e.target.value)} />
        <textarea className="input" rows={3} placeholder="Politique de confidentialité (français)" value={form.privacy_policy_fr ?? ""} onChange={(e) => set("privacy_policy_fr", e.target.value)} />
      </Section>

      <div className="flex items-center gap-3">
        <button disabled={saving} onClick={handleSave} className="rounded-full bg-brand-600 px-8 py-2.5 font-semibold text-white disabled:opacity-50">
          {saving ? "..." : "حفظ الإعدادات"}
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">تم الحفظ ✓</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-4">
      <h2 className="mb-3 font-semibold text-ink-900">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}
