import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "@/translations/resources";
import { DEFAULT_LOCALE, NAMESPACES } from "@/constants/i18nConfig";

const LANG_STORAGE_KEY = "aqua-metrics-lang";

const savedLang = (() => {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) as Locale | null;
  } catch {
    return null;
  }
})();

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang ?? DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  defaultNS: "common",
  ns: NAMESPACES,
  interpolation: {
    escapeValue: false,
  },
});

// Persist language changes to localStorage
i18n.on("languageChanged", (lang) => {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch { }
});

export default i18n;
