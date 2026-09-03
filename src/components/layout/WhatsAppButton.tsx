import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ phone, message }: { phone?: string | null; message?: string }) {
  if (!phone) return null;
  const clean = phone.replace(/[^\d+]/g, "");
  const text = encodeURIComponent(message ?? "مرحبا، عندي استفسار حول منتج في المتجر");

  return (
    <a
      href={`https://wa.me/${clean}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-20 end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="h-7 w-7" fill="white" />
    </a>
  );
}
