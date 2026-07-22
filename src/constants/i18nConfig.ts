import { en } from "@/translations/en";

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export const DEFAULT_LOCALE: Locale = "en" as const;
export const LANG_DIR: { [key in Locale]: LangDir } = {
  en: "ltr",
  ar: "rtl",
} as const;

export const LOCALE_INFO = {
  en: {
    name: "English",
    icon: "/locale-icons/en.svg",
  },
  ar: {
    name: "العربية",
    icon: "/locale-icons/ar.webp",
  },
} as const;

export const NAMESPACES = Object.keys(en) as (keyof typeof en)[];
