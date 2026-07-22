import { SUPPORTED_LOCALES } from "@/constants/i18nConfig";
import { en } from "@/translations/en";

// Helper type to extract nested keys with dot notation
type NestedKeys<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}.${NestedKeys<T[K]>}`
    : K;
}[keyof T & (string | number)];

declare global {
  type Locale = (typeof SUPPORTED_LOCALES)[number];
  type LangDir = "ltr" | "rtl";

  // Type to create namespace:key format
  type TranslationKey = {
    [K in keyof typeof en]: NestedKeys<(typeof en)[K]> extends never
      ? never
      : `${K}:${NestedKeys<(typeof en)[K]>}`;
  }[keyof typeof en];
}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof en;
  }
}
