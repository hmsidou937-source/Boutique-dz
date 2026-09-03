import { getSettings } from "@/lib/data";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsForm settings={settings} />;
}
