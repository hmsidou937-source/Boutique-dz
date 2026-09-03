"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(locale === "ar" ? "بيانات الدخول غير صحيحة" : "Identifiants incorrects");
      return;
    }
    router.push("/account/orders");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-bold text-ink-900">
        {locale === "ar" ? "تسجيل الدخول" : "Connexion"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input type="password" required placeholder={locale === "ar" ? "كلمة المرور" : "Mot de passe"} value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-brand-600 py-2.5 font-semibold text-white disabled:opacity-50">
          {loading ? "..." : locale === "ar" ? "دخول" : "Se connecter"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-ink-800/60">
        {locale === "ar" ? "ليس لديك حساب؟" : "Pas de compte ?"}{" "}
        <Link href="/account/register" className="font-semibold text-brand-600">
          {locale === "ar" ? "إنشاء حساب" : "Créer un compte"}
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-ink-800/60">
        <Link href="/products" className="text-brand-600">
          {locale === "ar" ? "أو تابع كزائر بدون حساب →" : "Ou continuez en invité →"}
        </Link>
      </p>
    </div>
  );
}
