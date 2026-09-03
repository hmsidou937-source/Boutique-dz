"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Hero({
  title,
  subtitle,
  imageUrl,
}: {
  title: { ar: string; fr: string };
  subtitle: { ar: string; fr: string };
  imageUrl: string;
}) {
  const { locale, dict } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold leading-tight text-ink-900 md:text-5xl">
            {locale === "ar" ? title.ar : title.fr}
          </h1>
          <p className="mt-4 max-w-md text-ink-800/70 md:text-lg">
            {locale === "ar" ? subtitle.ar : subtitle.fr}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center rounded-full bg-brand-600 px-8 py-3 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
          >
            {dict.hero.cta}
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-xl md:aspect-[4/3]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
