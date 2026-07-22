import type { resources } from "@/translations/resources";

declare global {
  type PageTitleKey = keyof typeof resources.en.common.pageTitles | "";
}
