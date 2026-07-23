# Aqua Metrics — Frontend Architecture & Standards

This document outlines the architecture, folder structure, component reuse rules, API layer, and coding conventions for all developers and AI agents working on the Aqua Metrics platform.

---

## 1. Architectural Philosophy

- **Feature-Driven Architecture**: Code is co-located by domain feature rather than by technology layer.
- **Component Reuse First**: Always reuse established design system components (`fields/`, `feedbacks/`, `HOCs/`, `common/`, `ui/`) before creating custom ones.
- **API & State Layer**: Use **TanStack Query** for async state management and server synchronization with a lightweight **custom `fetch` client** (`src/services/customFetch.ts`).
- **Design System First**: Use design tokens from `index.css` (`primary`, `secondary`, `neutral`, OKLCH variables) for consistent visual polish.

---

## 2. Directory Structure

```
src/
├── components/          # Shared global UI components
│   ├── fields/          # Reusable Form Fields (RHF + shadcn)
│   ├── feedbacks/       # Feedback & loading states
│   ├── HOCs/            # Higher-Order Components & Wrappers
│   ├── common/          # Reusable UI domain helpers
│   ├── layouts/         # Layout shells
│   ├── ui/              # Primitive shadcn/ui components (Base UI)
│   └── Providers/       # Global React context providers
├── features/            # Domain-driven features
│   ├── athletes/        # Example feature module
│   │   ├── components/  # Feature-specific UI components
│   │   ├── hooks/       # Feature-specific TanStack Query hooks
│   │   ├── constants/   # Query keys, Zod validation schemas, enums
│   │   ├── types/       # ALL feature-specific TypeScript types (not global)
│   │   └── services/    # One file per API endpoint, calling customFetch
│   ├── swimming/
│   ├── fitness/
│   └── auth/
├── constants/           # Global constants (config, i18nConfig, sidebar)
├── hooks/               # Global utility hooks
├── lib/                 # Utility libraries (i18n, utils)
├── pages/               # Route entry pages
├── routes/              # React Router configuration
├── translations/        # i18n resources (en, ar JSON files)
├── types/               # Global TypeScript definitions (cross-feature only)
└── utils/               # Pure helper functions
```

> **No Barrel Exports**: Features do NOT use `index.ts` re-export aggregators. Always import directly from the specific source file:
> ```ts
> import { useLogin } from "@/features/auth/hooks/useLogin";
> import { loginSchema } from "@/features/auth/constants/validations";
> ```
>
> **Types Rule**: Feature-specific types belong in `src/features/<feature>/types/index.ts` as regular named exports. Only truly cross-feature types (e.g., `ApiResponse<T>`, `PermissionKey`) live in `src/types/`.


---

## 3. API & Data Fetching Architecture

We use a 3-layer architecture for all network requests:

```
[UI Component] ---> [TanStack Query Hook] ---> [Feature Service] ---> [customFetch] ---> [Backend API]
```

### Layer 1: Custom Fetch Client (`src/services/customFetch.ts`)
A lightweight, type-safe `customFetch` wrapper handling:
- `BACKEND_BASE_URL` prefixing.
- Automatic JWT Bearer token authorization header injection (`getStoredToken()`).
- Language header synchronization (`accept-language`).
- Silent token refresh on 401 (skipped for auth endpoints).
- Redirect to `/login` on refresh failure.

### API Response Type Envelope (`src/types/api.d.ts`)
All API calls use the global `ApiResponse<TData>` wrapper type:

```ts
import { customFetch } from "@/services/customFetch";
import type { Athlete } from "../types";

export async function fetchAthletes() {
  return customFetch<ApiResponse<Athlete[]>>("/athletes");
}
```

### Layer 2: Feature Services (`src/features/<feature>/services/`)
- **One file per API endpoint**: `login.service.ts`, `me.service.ts`, etc.
- Endpoint URL strings are written **directly inside** each service file — no shared endpoint constants object.
- Import domain types from `../types`, not from global declarations.

### Layer 3: TanStack Query Hooks (`src/features/<feature>/hooks/`)
Encapsulate `useQuery` and `useMutation` calls:

```ts
import { useQuery } from "@tanstack/react-query";
import { fetchAthletes } from "../services/fetchAthletes.service";
import { ATHLETE_KEYS } from "../constants/queryKeys";

export function useAthletes(params: { page?: number }) {
  return useQuery({
    queryKey: ATHLETE_KEYS.list(params),
    queryFn: () => fetchAthletes(params),
  });
}
```

### Query Keys (`src/features/<feature>/constants/queryKeys.ts`)
Query key factories live in `constants/`, never in `hooks/`:

```ts
export const ATHLETE_KEYS = {
  all: ["athletes"] as const,
  list: (filters: object) => [...ATHLETE_KEYS.all, "list", filters] as const,
};
```

### Validation (`src/features/<feature>/constants/validations.ts`)
Use Zod schemas for all form validation. The inferred type replaces manual interface declarations:

```ts
import { z } from "zod";

export const athleteSchema = z.object({ name: z.string().min(1) });
export type AthleteFormValues = z.infer<typeof athleteSchema>;
```

Use `zodResolver` from `@hookform/resolvers/zod` with React Hook Form.

---

## 4. Component Reuse Hierarchy

When creating or modifying UI elements, follow this priority order strictly:

```
1. Global Fields & Feedbacks  -->  src/components/fields/*, src/components/feedbacks/*
2. HOC Wrappers               -->  src/components/HOCs/* (TableLoadingAndError, WithPagination, ErrorBoundary)
3. Primitive shadcn UI        -->  src/components/ui/* (Button, Table, Dialog, Select, Popover)
4. Create New Global/Feature  -->  If no component exists, build a clean reusable component adhering to OKLCH tokens
```

---

## 5. Form Fields & Data Presentation Rules

### Form Fields Rule
All forms must use React Hook Form with Zod validation via `zodResolver`. Use shared field wrappers where possible:
- `InputField` (Text, Number, Email, Password)
- `SelectField` (Searchable Combobox)
- `TextareaField` (Multi-line text)
- `LabelField` (Label with required indicator & tooltip hint)

### Table & Pagination Rule
- Use standard `shadcn/ui` HTML `Table` component (`src/components/ui/table.tsx`).
- Wrap table bodies with `TableLoadingAndError` HOC for clean loading skeletons and error states.
- Wrap tables with `WithPagination` HOC using the global URL-driven `Pagination` component.

---

## 6. Coding Standards & Best Practices

1. **TypeScript**: No `any`. Feature types live in `src/features/<feature>/types/index.ts`. Global types only for cross-feature concerns.
2. **Styling**: Use Tailwind v4 CSS utilities. Apply OKLCH design tokens (`bg-background`, `text-foreground`, `bg-primary`, `bg-card`).
3. **i18n & RTL**:
   - Always use `useTranslation()` with key namespaces (`t("common:...")`).
   - Use Tailwind logical properties (`inset-s-0`, `inset-e-0`, `ms-2`, `me-2`, `ps-3`, `pe-3`).
   - Arabic font **Tajawal** is automatically applied in `[dir="rtl"]`.
4. **Icons**: Use `react-icons/md` (Material Design) for UI consistency.
5. **Comments**: Only comment the "why" — never narrate what the code obviously does.
