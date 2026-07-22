declare global {
  type NavItem = {
    key: string;
    labelKey: TranslationKey;
    icon: React.ElementType;
    path: string;
    badge?: number;
  };

  type NavGroup = {
    groupKey: string;
    labelKey: TranslationKey;
    items: NavItem[];
  };
}

export {};
