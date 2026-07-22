# Workspace Architecture Rules & Standards

## 1. Feature-Based Directory Structure
All new application features MUST be created under `src/features/<feature-name>/` with the following structure:

```
src/features/<feature-name>/
├── components/   # Feature-specific UI components
├── hooks/        # TanStack Query hooks (useQuery, useMutation)
├── constants/    # Feature constants & enums
├── types/        # Feature TypeScript declarations
├── services/     # API services calling customFetch
└── index.ts      # Public barrel export
```

## 2. API & Data Fetching (TanStack Query + customFetch)
- **API Client**: Always use `customFetch` from `@/services/customFetch` inside service functions (`src/features/<feature>/services/`).
- **Hooks**: Always encapsulate API service calls inside TanStack Query hooks (`useQuery`, `useMutation`) in `src/features/<feature>/hooks/`.
- **Query Keys**: Use query key objects (`FEATURE_KEYS.list(...)`) for consistent cache invalidation.

## 3. Component Reuse Hierarchy
Before building any new component, check and reuse existing components in this order:

1. **Form Fields**: Use `src/components/fields/` (`InputField`, `SelectField`, `TextareaField`, `LabelField`) with React Hook Form.
2. **Table & Loading States**: Use `src/components/HOCs/TableLoadingAndError` and `src/components/HOCs/WithPagination`.
3. **Feedbacks**: Use `src/components/feedbacks/` (`ErrorMessage`, `FullPageLoading`).
4. **UI Primitives**: Use `src/components/ui/` (`shadcn/ui` components).
5. **New Component**: If no matching component exists, build a reusable component using design system tokens (`index.css`).

## 4. i18n & RTL Rules
- Always use `useTranslation()` for text labels.
- Use Tailwind logical spacing/positioning (`ms-*`, `me-*`, `ps-*`, `pe-*`, `inset-s-*`, `inset-e-*`).
- Arabic font **Tajawal** is automatically applied in `[dir="rtl"]`.
