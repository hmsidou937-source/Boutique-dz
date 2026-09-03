import { getSettings } from "@/lib/data";

export default async function ReturnsPolicyPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold text-ink-900">سياسة الاستبدال / Politique de retour</h1>
      <div className="space-y-4 whitespace-pre-line text-ink-800/80">
        <p>{settings.return_policy_ar || "لم يتم إضافة سياسة الاستبدال بعد."}</p>
        <hr className="border-black/5" />
        <p dir="ltr">{settings.return_policy_fr || "Aucune politique de retour renseignée pour le moment."}</p>
      </div>
    </div>
  );
}
