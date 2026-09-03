"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError || !data.user) {
      setLoading(false);
      setError(signUpError?.message ?? (locale === "ar" ? "حدث خطأ" : "Une erreur est survenue"));
      return;
    }

    await supabase.from("customers").insert({
      auth_user_id: data.user.id,
      full_name: fullName,
      phone,
      email,
    });

    setLoading(false);
    router.push("/account/orders");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-bold text-ink-900">
        {locale === "ar" ? "إنشاء حساب" : "Créer un compte"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
        <input required placeholder={locale === "ar" ? "الاسم الكامل" : "Nom complet"} value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
        <input required placeholder={locale === "ar" ? "رقم الهاتف" : "Téléphone"} value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input type="password" required minLength={6} placeholder={locale === "ar" ? "كلمة المرور" : "Mot de passe"} value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-brand-600 py-2.5 font-semibold text-white disabled:opacity-50">
          {loading ? "..." : locale === "ar" ? "إنشاء الحساب" : "Créer le compte"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-800/60">
        {locale === "ar" ? "لديك حساب بالفعل؟" : "Déjà un compte ?"}{" "}
        <Link href="/account/login" className="font-semibold text-brand-600">
          {locale === "ar" ? "دخول" : "Connexion"}
        </Link>
      </p>
    </div>
  );
}
