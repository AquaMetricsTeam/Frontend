import type { UserRole } from "@/features/auth/types";

declare global {
  type NavItem = {
    key: string;
    labelKey: TranslationKey;
    icon: React.ElementType;
    path: string;
    badge?: number;
    allowedRoles?: UserRole[];
  };

  type NavGroup = {
    groupKey: string;
    labelKey: TranslationKey;
    items: NavItem[];
  };
}

export {};
