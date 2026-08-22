# TypeScript Errors — Task 10 Audit

> **Status**: AUDIT COMPLETE — awaiting approval before any fixes are implemented.
> Run: `npx tsc --noEmit -p tsconfig.app.json`
> Exit code: 2 | Total errors: 33

---

## Error Index

| # | File | Line | Code | Category | Safe to Fix? |
|---|------|------|------|----------|-------------|
| 1 | `src/features/training-plans/types/index.ts` | 32 | TS1294 | `const enum` / erasableSyntaxOnly | ✅ Yes |
| 2 | `src/features/training-plans/types/index.ts` | 37 | TS1294 | `const enum` / erasableSyntaxOnly | ✅ Yes |
| 3 | `src/features/nutrition/components/PlansList.tsx` | 9 | TS6133 | Unused import `MdCalendarToday` | ✅ Yes |
| 4 | `src/features/nutrition/components/PlansList.tsx` | 44 | TS6133 | Unused function `getMealTypeColor` | ✅ Yes |
| 5 | `src/features/nutrition/components/PlansList.tsx` | 69 | TS6133 | Unused variable `setSearch` | ✅ Yes |
| 6 | `src/features/nutrition/components/PlansList.tsx` | 121 | TS2322 | `refetch` passed as click handler — signature mismatch | ✅ Yes |
| 7 | `src/features/nutrition/components/PlansList.tsx` | 269 | TS6133 | Unused variable `t` in `PlanDetailPanel` | ✅ Yes |
| 8 | `src/features/nutrition/components/PlanWizardSlideOver.tsx` | 66 | TS2322 | Zod resolver generic mismatch (`mealType: unknown` vs `number`) | ✅ Yes |
| 9 | `src/features/nutrition/components/PlanWizardSlideOver.tsx` | 223 | TS2345 | `TFieldValues` not assignable to typed form shape | ✅ Yes (same root as #8) |
| 10 | `src/features/nutrition/components/PlanWizardSlideOver.tsx` | 376 | TS2322 | `mealType: number` not assignable to `MealType` enum | ✅ Yes |
| 11 | `src/features/nutrition/components/RoleSwitcher.tsx` | 2 | TS6133 | Unused import `Badge` | ✅ Yes |
| 12 | `src/features/nutrition/hooks/useNutritionPageManager.ts` | 171 | TS2345 | `mealType: number` not assignable to `MealType` | ✅ Yes |
| 13 | `src/features/nutrition/hooks/useNutritionPageManager.ts` | 176 | TS2345 | `mealType: number` not assignable to `MealType` | ✅ Yes |
| 14 | `src/pages/nutrition.tsx` | 43 | TS6133 | Unused variable `selectedAssignmentPlan` | ⚠️ Needs decision |
| 15 | `src/pages/nutrition.tsx` | 44 | TS6133 | Unused variable `setSelectedAssignmentPlan` | ⚠️ Needs decision |
| 16 | `src/pages/nutrition.tsx` | 68 | TS6133 | Unused parameter `planId` in `handleViewFullPlan` | ✅ Yes |
| 17 | `src/features/training-plans/components/assignments/AssignedPlansView.tsx` | 95 | TS2322 | `Box` doesn't accept `className` prop | ✅ Yes |
| 18 | `src/features/training-plans/components/assignments/AssignedPlansView.tsx` | 180 | TS2322 | `Box` doesn't accept `className` prop | ✅ Yes |
| 19 | `src/features/training-plans/components/assignments/AssignedPlansView.tsx` | 287 | TS2345 | `string \| undefined` passed where `string` required in `formatDate` | ✅ Yes |
| 20 | `src/features/training-plans/components/sessions/CreateSessionSheet.tsx` | 30 | TS2322 | Zod resolver generic mismatch (`trainingPlanId: unknown` vs `number`) | ✅ Yes |
| 21 | `src/features/training-plans/components/sessions/CreateSessionSheet.tsx` | 73 | TS2345 | `TFieldValues` not assignable to typed form shape | ✅ Yes (same root as #20) |
| 22 | `src/features/training-plans/components/sessions/SessionDetailSheet.tsx` | 11 | TS6133 | Unused import `Input` | ✅ Yes |
| 23 | `src/features/training-plans/components/sessions/SessionDetailSheet.tsx` | 63 | TS6133 | Unused variable `sessionId` | ✅ Yes |
| 24 | `src/features/training-plans/components/sessions/SessionDetailSheet.tsx` | 71 | TS6133 | Unused variable `athletesLoading` | ✅ Yes |
| 25 | `src/features/training-plans/components/sessions/SessionsView.tsx` | 27 | TS6133 | Unused import `AttendanceRecord` | ✅ Yes |
| 26 | `src/features/training-plans/components/sessions/SessionsView.tsx` | 205 | TS2322 | `Box` doesn't accept `className` prop | ✅ Yes |
| 27 | `src/features/training-plans/components/sessions/SessionsView.tsx` | 293 | TS2322 | `Box` doesn't accept `className` prop | ✅ Yes |
| 28 | `src/features/training-plans/components/templates/ExerciseRow.tsx` | 279 | TS2741 | `LabelField` missing required `htmlFor` prop | ✅ Yes |
| 29 | `src/features/training-plans/components/templates/Step2Exercises.tsx` | 42 | TS2322 | Zod resolver generic mismatch (`exerciseId: unknown` vs `number`) | ✅ Yes |
| 30 | `src/features/training-plans/components/templates/Step2Exercises.tsx` | 75 | TS2345 | `TFieldValues` not assignable to typed form shape | ✅ Yes (same root as #29) |
| 31 | `src/features/training-plans/components/templates/Step3Assignment.tsx` | 3 | TS6133 | Unused import `MdPerson` | ✅ Yes |
| 32 | `src/features/training-plans/components/templates/Step3Assignment.tsx` | 27 | TS2322 | Zod resolver generic mismatch (optional vs required `boolean`) | ✅ Yes |
| 33 | `src/features/training-plans/components/templates/Step3Assignment.tsx` | 64 | TS2345 | `TFieldValues` not assignable to typed form shape | ✅ Yes (same root as #32) |
| 34 | `src/features/training-plans/components/templates/TemplateTableRow.tsx` | 95 | TS2322 | `asChild` prop missing on `DropdownMenuTrigger` | ✅ Yes |
| 35 | `src/features/training-plans/hooks/useCreateAssignment.ts` | 6 | TS6133 | Unused parameter `planId` | ⚠️ Needs decision |
| 36 | `src/features/training-plans/hooks/useDeleteAssignment.ts` | 6 | TS6133 | Unused parameter `planId` | ⚠️ Needs decision |

---

## GROUP A — `const enum` with `erasableSyntaxOnly` (Errors #1, #2)

**Files**: `src/features/training-plans/types/index.ts` lines 32, 37

**Root Cause**:
`tsconfig.app.json` has `"erasableSyntaxOnly": true`. TypeScript 5.5+ forbids `const enum` with this option because it requires inlining values at compile time — incompatible with bundlers that do type-erasure-only transpilation (like Vite/esbuild).

**Is this a real bug?** Yes.

**Proposed Fix**: Change `const enum` → `enum` in both cases. All callers continue to work identically at runtime.

```ts
// Before:
export const enum AssignedToType { ... }
export const enum AttendanceStatusEnum { ... }

// After:
export enum AssignedToType { ... }
export enum AttendanceStatusEnum { ... }
```

**Priority**: P1

---

## GROUP B — Zod Resolver Generic Type Mismatch (Errors #8–9, #20–21, #29–30, #32–33)

**Files**:
- `PlanWizardSlideOver.tsx` (lines 66, 223)
- `CreateSessionSheet.tsx` (lines 30, 73)
- `Step2Exercises.tsx` (lines 42, 75)
- `Step3Assignment.tsx` (lines 27, 64)

**Root Cause**:
`zodResolver` from `@hookform/resolvers/zod` infers the *input* type of the schema. Fields using `z.coerce.number()` have input type `unknown`. `useForm<OutputType>` expects `OutputType` but the resolver's parameter type is inferred from the input, causing a mismatch.

Example:
- `sessionSchema` uses `z.coerce.number()` for `trainingPlanId`
- Resolver infers input type: `{ trainingPlanId: unknown, ... }`
- `useForm<SessionFormValues>` expects output type: `{ trainingPlanId: number, ... }`
- TypeScript sees incompatible `ResolverOptions` types

**Is this a real bug?** Runtime works correctly — coercion happens at runtime. TypeScript types are mismatched.

**Proposed Fix**: Cast the resolver to the output type explicitly:

```ts
import type { Resolver } from "react-hook-form";

// In each affected component:
resolver: zodResolver(sessionSchema) as Resolver<SessionFormValues>
resolver: zodResolver(nutritionPlanSchema) as Resolver<NutritionPlanFormValues>
resolver: zodResolver(exercisesStepSchema) as Resolver<ExercisesStepFormValues>
resolver: zodResolver(assignmentStepSchema) as Resolver<AssignmentStepFormValues>
```

This cast is safe — the resolver correctly produces the output type at runtime.

**Priority**: P1 — 8 errors across 4 components.

---

## GROUP C — `mealType: number` not assignable to `MealType` (Errors #10, #12, #13)

**Files**:
- `PlanWizardSlideOver.tsx` line 376
- `useNutritionPageManager.ts` lines 171, 176

**Root Cause**:
`MealType` is a const-object-derived union: `1 | 2 | 3 | 4 | 5 | 6`. Zod's `z.coerce.number()` infers type `number`, not `MealType`. Spreading Zod-coerced meals into calls expecting `NutritionPlanMeal[]` fails type-checking.

**Is this a real bug?** Runtime values are always valid `MealType` values. TypeScript just can't narrow `number` to the specific union.

**Proposed Fix**:
In `PlanWizardSlideOver.tsx` line 376 the error is in the `buildResetValues` function return type where `meals` is built with `Number(m.mealType) as MealType`. Ensure this cast is present on every `mealType` assignment.

In `useNutritionPageManager.ts` the cast `Number(m.mealType) as NutritionPlanMeal["mealType"]` is already in `handleEditPlan` and `handleDuplicatePlan`. The error is that after spreading `...apiData` in `handleSubmitPlan`, TypeScript still sees `number` because `NutritionPlanFormValues` has `mealType: number` (from Zod coerce). Fix: assert meals array type when calling `updatePlan`/`createPlan`.

**Priority**: P2

---

## GROUP D — `Box` component missing `className` prop (Errors #17, #18, #26, #27)

**Files**:
- `AssignedPlansView.tsx` lines 95, 180
- `SessionsView.tsx` lines 205, 293
- **Root file**: `src/components/layouts/Box.tsx`

**Root Cause**:
`Box.tsx` defines `BoxProps = { children: ReactNode }` — no `className`. Four call sites pass `className` for layout overrides (`p-0 overflow-hidden`, `p-4 sm:p-5 space-y-4`). The `className` is silently ignored at runtime — this is both a type error AND a real styling bug.

**Proposed Fix**: Add `className?: string` to `BoxProps` and apply via `cn()`:

```ts
interface BoxProps {
  children: ReactNode;
  className?: string;
}
const Box = ({ children, className }: BoxProps) => (
  <div className={cn("flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-xs", className)}>
    {children}
  </div>
);
```

**Priority**: P1 — real styling bug, not just types.

---

## GROUP E — `refetch` passed as click handler (Error #6)

**File**: `src/features/nutrition/components/PlansList.tsx` line 121

**Root Cause**: TanStack Query's `refetch` has signature `(options?: RefetchOptions) => Promise<...>`. Passing it directly to `onClick` which expects `(event: MouseEvent) => void` fails because the parameter types don't overlap.

**Proposed Fix**:
```tsx
<Button onClick={() => refetch()} variant="outline" size="sm">
```

**Priority**: P2

---

## GROUP F — `string | undefined` guard needed (Error #19)

**File**: `src/features/training-plans/components/assignments/AssignedPlansView.tsx` line 287

**Root Cause**: `item.assignedAt` is `string | undefined` on `TrainingPlanAssignment`, but `formatDate(dateStr: string)` requires `string`. If `assignedAt` is `undefined`, `new Date(undefined)` produces `Invalid Date` string.

**Proposed Fix**: Guard at call site:
```tsx
Assigned {item.assignedAt ? formatDate(item.assignedAt) : "—"}
```

**Priority**: P2

---

## GROUP G — `LabelField` missing required `htmlFor` (Error #28)

**File**: `src/features/training-plans/components/templates/ExerciseRow.tsx` line 279

**Root Cause**: `LabelField` requires `htmlFor: string`. The Intensity control (a button group) has no associated `<input>` id, so no meaningful `htmlFor` exists.

**Proposed Fix**: Make `htmlFor` optional in `LabelField`:
```ts
interface LabelFieldProps {
  htmlFor?: string;  // was: htmlFor: string
  ...
}
```
Apply `htmlFor` only when it exists: `<Label htmlFor={htmlFor ?? undefined} ...>`.

**Priority**: P2

---

## GROUP H — `asChild` on `DropdownMenuTrigger` (Error #34)

**File**: `src/features/training-plans/components/templates/TemplateTableRow.tsx` line 95

**Root Cause**: `<DropdownMenuTrigger asChild>` — `asChild` is a Radix `Slot` pattern prop. The local `dropdown-menu.tsx` wrapper may not expose it in its TypeScript props type even though the underlying Radix component accepts it.

**Requires inspection**: Read `src/components/ui/dropdown-menu.tsx` before fixing.

**Priority**: P2

---

## GROUP I — Unused Symbols (Errors #3–5, #7, #11, #22–25, #31, #35–36)

### I-A: Remove unused imports (✅ safe)
- `PlansList.tsx`: remove `MdCalendarToday`
- `RoleSwitcher.tsx`: remove `Badge`
- `SessionDetailSheet.tsx`: remove `Input`
- `SessionsView.tsx`: remove `AttendanceRecord`
- `Step3Assignment.tsx`: remove `MdPerson`

### I-B: Remove unused code (✅ safe)
- `PlansList.tsx`: remove `getMealTypeColor` function (defined but never called)
- `PlansList.tsx`: remove `setSearch` variable (assigned but never referenced)
- `PlansList.tsx`: remove `t` from `useTranslation` destructure in `PlanDetailPanel`
- `SessionDetailSheet.tsx`: remove `sessionId` variable, remove `athletesLoading` from destructure

### I-C: Prefix with `_` (⚠️ needs your decision)
- `useCreateAssignment.ts`: `planId` → `_planId` (preserves API, suppresses error)
- `useDeleteAssignment.ts`: `planId` → `_planId` (preserves API, suppresses error)
- `nutrition.tsx`: `planId` in `handleViewFullPlan` → `_planId`

### I-D: Your decision required
- `nutrition.tsx`: `selectedAssignmentPlan` / `setSelectedAssignmentPlan` — planned feature, never wired up

---

## Decisions Required Before Full Fix

### Decision 1 — `selectedAssignmentPlan` / `setSelectedAssignmentPlan` in `nutrition.tsx`

These are destructured from `useNutritionPageManager` but never used in the page. They exist for a "filter assignments tab by selected plan" feature that was planned but not implemented.

**Options**:
- **A: Remove** — delete from destructure in `nutrition.tsx` AND from the hook's return in `useNutritionPageManager.ts`
- **B: Keep with `_` prefix** — `_selectedAssignmentPlan` to signal planned-but-unused
- **C: Implement** — wire them to `AssignmentsList`'s `planFilter` so clicking a plan on the Plans tab auto-selects it in the Assignments tab

### Decision 2 — `planId` in `useCreateAssignment.ts` and `useDeleteAssignment.ts`

Both hooks receive `planId: number` but don't use it inside.

**Options**:
- **A: Prefix `_planId`** — preserve call signature, suppress error
- **B: Remove** — breaking change for all callers

---

## Summary

| Category | Errors | Priority | Decision needed? |
|----------|--------|----------|-----------------|
| A: `const enum` → `enum` | 2 | P1 | No |
| B: Zod resolver cast | 8 | P1 | No |
| C: `mealType` assertion | 3 | P2 | No |
| D: `Box` className prop | 4 | P1 | No |
| E: `refetch` wrap | 1 | P2 | No |
| F: `assignedAt` guard | 1 | P2 | No |
| G: `LabelField` optional `htmlFor` | 1 | P2 | No |
| H: `asChild` DropdownMenuTrigger | 1 | P2 | Inspect first |
| I: Unused symbols | 13 | P2 | 3 need decision |
| **Total** | **34** | | **3 decisions** |

## Recommended Fix Order

```
1. Group A  (const enum → enum)         ← P1, unblocks bundler
2. Group D  (Box className)             ← P1, real styling bug
3. Group B  (Zod resolver casts)        ← P1, 8 errors at once
4. Group C  (mealType assertions)       ← P2, 3 errors
5. Group E  (refetch wrap)              ← P2, 1 line
6. Group F  (assignedAt guard)          ← P2, 1 line
7. Group G  (LabelField optional)       ← P2, 1 prop
8. Group H  (asChild — inspect first)   ← P2
9. Group I  (unused symbols)            ← P2, after decisions
```

*Awaiting your approval and decisions before implementing any fix.*
