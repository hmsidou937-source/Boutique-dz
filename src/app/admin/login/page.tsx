"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
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
      setError("بيانات الدخول غير صحيحة / Identifiants incorrects");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-center text-2xl font-bold text-ink-900">لوحة تحكم المتجر</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-brand-600 py-2.5 font-semibold text-white disabled:opacity-50">
          {loading ? "..." : "دخول / Connexion"}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-ink-800/40">
        أنشئ حساب المدير من Supabase Auth ثم أضف بريده في متغيّر ADMIN_EMAILS
      </p>
    </div>
  );
}
