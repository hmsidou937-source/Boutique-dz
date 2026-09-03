"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionaries } from "./dictionaries";
import type { Locale } from "../types";

interface LanguageContextValue {
  locale: Locale;
  dict: typeof dictionaries["ar"];
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = window.localStorage.getItem("dz-locale") as Locale | null;
    if (saved === "ar" || saved === "fr") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dictionaries[locale].dir;
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    window.localStorage.setItem("dz-locale", l);
  }

  return (
    <LanguageContext.Provider value={{ locale, dict: dictionaries[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
