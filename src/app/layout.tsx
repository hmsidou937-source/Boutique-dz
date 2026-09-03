import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Pixels } from "@/components/analytics/Pixels";
import { getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: settings.store_name, template: `%s | ${settings.store_name}` },
    description: settings.store_name + " — Boutique en ligne en Algérie / متجر إلكتروني في الجزائر",
    icons: settings.favicon_url ? [{ url: settings.favicon_url }] : undefined,
    openGraph: {
      title: settings.store_name,
      images: settings.logo_url ? [settings.logo_url] : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.store_name,
    logo: settings.logo_url ?? undefined,
    telephone: settings.phone ?? undefined,
    address: settings.address ?? undefined,
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <Pixels metaPixelId={settings.meta_pixel_id} tiktokPixelId={settings.tiktok_pixel_id} />
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <Header settings={settings} />
              <main className="pb-16 md:pb-0">{children}</main>
              <Footer settings={settings} />
              <MobileNav />
              <WhatsAppButton phone={settings.whatsapp} />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
