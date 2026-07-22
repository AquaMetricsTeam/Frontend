import { useEffect } from "react";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { LANG_DIR } from "@/constants/i18nConfig";

const RootLayout = () => {
  const { i18n } = useTranslation();
  const langDir = LANG_DIR[i18n.language as Locale];

  // Sync dir to <html> so CSS [dir="rtl"] selectors work on body/descendants
  useEffect(() => {
    document.documentElement.dir = langDir;
    document.documentElement.lang = i18n.language;
  }, [langDir, i18n.language]);

  return <Outlet />;
};

export default RootLayout;
