# Workspace Architecture Rules & Standards

## 1. Feature-Based Directory Structure
All new application features MUST be created under `src/features/<feature-name>/` with the following structure:

```
src/features/<feature-name>/
├── components/   # Feature-specific UI components
├── hooks/        # TanStack Query hooks (useQuery, useMutation)
├── constants/    # Query keys, Zod validation schemas, enums
├── types/        # ALL feature-specific TypeScript types (named exports, not global declare)
└── services/     # One file per API endpoint, calling customFetch
```

**Types Rule**: Feature-specific types MUST live in `src/features/<feature>/types/index.ts` as regular named exports. Import them explicitly in every file that needs them. NEVER put feature types in `src/types/` global declarations. Only truly cross-feature types (e.g., `ApiResponse<T>`, `PermissionKey`) belong in `src/types/`.

**No Barrel Exports**: Do NOT create `index.ts` barrel re-export files in features. Import directly from the specific source file:
```ts
import { useLogin } from "@/features/auth/hooks/useLogin";
import { loginSchema } from "@/features/auth/constants/validations";
```
## 2. API & Data Fetching (TanStack Query + customFetch)
- **API Client**: Always use `customFetch` from `@/services/customFetch` inside service functions (`src/features/<feature>/services/`).
- **Service Files**: Each API endpoint gets its own service file (e.g., `login.service.ts`, `me.service.ts`). No shared multi-endpoint service files.
- **Endpoint URLs**: Write endpoint strings directly inside the service file. Do NOT create a separate endpoint constants object.
- **Hooks**: Always encapsulate API service calls inside TanStack Query hooks (`useQuery`, `useMutation`) in `src/features/<feature>/hooks/`.
- **Query Keys**: Store in `src/features/<feature>/constants/queryKeys.ts`, not in `hooks/`.
- **Validation**: Use Zod schemas stored in `src/features/<feature>/constants/validations.ts`. Use `zodResolver` from `@hookform/resolvers/zod` for React Hook Form integration.

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

## 5. Comments Rule
- Do NOT write excessive inline comments. Code should be self-explanatory.
- Only add a comment when the "why" is non-obvious (e.g., a workaround, a gotcha, or a deliberate trade-off).
- Never narrate what the code obviously does (e.g., `// save token`, `// return response`).

