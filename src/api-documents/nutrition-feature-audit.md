# Nutrition Feature Audit Report

This report documents the full audit of the **Nutrition** feature, analyzing the complete assignment flow, TypeScript type safety, API payloads, and query invalidation.

---

## 1. TypeScript Checks & Errors

A total of **9 TypeScript errors** are present specifically within the Nutrition feature files. They are categorized below:

### Unused Imports & Variables
- **`src/features/nutrition/components/PlansList.tsx`**:
  - **Line 9**: Unused import `MdCalendarToday` (TS6133)
  - **Line 44**: Unused function `getMealTypeColor` (TS6133)
  - **Line 69**: Unused variable `setSearch` (TS6133)
  - **Line 269**: Unused variable `t` in `PlanDetailPanel` (TS6133)
- **`src/features/nutrition/components/RoleSwitcher.tsx`**:
  - **Line 2**: Unused import `Badge` (TS6133)
- **`src/pages/nutrition.tsx`**:
  - **Lines 43-44**: Unused state variables `selectedAssignmentPlan` and `setSelectedAssignmentPlan` (TS6133)
  - **Line 68**: Unused parameter `planId` in `handleViewFullPlan` (TS6133)

### Signature & Type Mismatches
- **`src/features/nutrition/components/PlansList.tsx` (Line 121)**:
  - **Error**: `refetch` query function is passed directly to the `onClick` handler of a button.
  - **Root Cause**: `refetch` expects `(options?: RefetchOptions) => Promise<...>`, while `onClick` expects `(event: MouseEvent) => void`.
- **`src/features/nutrition/components/PlanWizardSlideOver.tsx` (Lines 66, 223)**:
  - **Error**: Zod resolver generic type mismatch.
  - **Root Cause**: `zodResolver` infers output types from the input schema where `z.coerce.number()` creates `unknown` types before coercion.
- **`src/features/nutrition/components/PlanWizardSlideOver.tsx` (Line 376)** and **`useNutritionPageManager.ts` (Lines 171, 176)**:
  - **Error**: `mealType: number` is not assignable to `MealType` enum (which is a strict union of `1 | 2 | 3 | 4 | 5 | 6`).
  - **Root Cause**: Numeric coercion yields a general `number` type instead of the narrower `MealType` type.

---

## 2. Review of the Nutrition Assignment Flow

### A. Assigning a Plan to Specific Athletes (Individual Mode)
- **Mechanism**: Loops over selected athlete IDs in `useAssignMultipleAthletes` and executes sequential POST requests to `/api/nutrition-plan-assignments/athlete`.
- **Payload**:
  ```json
  {
    "nutritionPlanId": 42,
    "athleteId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "startDate": "2026-08-01",
    "endDate": null
  }
  ```
- **Type Requirements**: `nutritionPlanId` must be a `number`, `athleteId` must be a `string` (UUID), and `endDate` must be `string | null` (not duplicated `startDate` when left blank).

### B. Assigning a Plan to a Group (Group Mode)
- **Mechanism**: Fires a single POST to `/api/nutrition-plan-assignments/group`.
- **Payload**:
  ```json
  {
    "nutritionPlanId": 42,
    "groupId": 15,
    "startDate": "2026-08-01",
    "endDate": null
  }
  ```
- **Backend Behavior**: The endpoint maps this request to individual assignments for every active member of the group, inserting the `groupId` to tag the source. Conflicting athletes are silently skipped (partial success).

### C. Assignments List & Display
- **Status**: The list displays assignments grouped by Individual or Group, showing athlete names, plan names, dates, and status badges (Active/Upcoming/Ended).
- **Lookup Maps**: Uses `/users/athletes-lookup` and `/groups/groups-lookup` to resolve names from IDs on the client side.

---

## 3. Why Assigning a Plan Succeeds but Athletes Do Not Appear in the List

There are two major root causes causing this issue:

### Root Cause 1: Response Schema Mismatch (Frontend vs. API Contract)
- **API Behavior**: `GET /api/nutrition-plan-assignments/plan/{nutritionPlanId}` returns a flat array of assignments directly in the `data` envelope:
  ```json
  {
    "success": true,
    "data": [
      { "id": 201, "nutritionPlanId": 42, "athleteId": "...", "groupId": null, ... }
    ]
  }
  ```
- **Frontend Code**: `getPlanAssignments.service.ts` lists the return type as `ApiResponse<PlanAssignmentsPaginatedResponse>` which expects a paginated metadata block with an nested `items` array. In `AssignmentsList.tsx` (line 71), it accesses:
  ```typescript
  const assignments = assignmentsRes?.data?.items ?? [];
  ```
- **Actual vs Expected**: Since `data` is a flat array, `data.items` is `undefined`. Consequently, `assignments` falls back to `[]`, leaving the list completely empty even after a successful API fetch.

### Root Cause 2: Default "All Plans" State (No Eager Fetching)
- **UI Filter**: The `planFilter` dropdown defaults to `"all"`.
- **Conditional Query**: The `usePlanAssignments` hook is called with `enabled: planFilter !== "all"`.
- **Result**: When first loading the tab, no assignments are fetched at all. The user must manually select a specific plan in the filter to trigger a request.

---

## 4. Problem Classification

| Category | Status | Details |
|---|---|---|
| **Frontend** | 🔴 Issue | Mismatch in response mapping (`data.items` instead of `data` array); `planFilter === "all"` disabling the query. |
| **API / Request Payload** | 🟢 Correct | Payloads correctly send numeric IDs and `null` end dates. |
| **Response Mapping** | 🔴 Issue | Mismatch in service type `PlanAssignmentsPaginatedResponse` vs the real flat list returned by the server. |
| **React Query Cache** | 🟢 Correct | Query keys are correctly invalidated but key type normalization (`String(planId)`) is required. |
| **Backend / API Behavior** | 🟢 Correct | Backend works as documented (returning a flat list of assignments). |

---

## 5. Recommended Fixes (Do NOT apply yet)

1. **Fix Response Mapping in `AssignmentsList.tsx`**:
   - Change `assignments = assignmentsRes?.data?.items ?? []` to `assignments = Array.isArray(assignmentsRes?.data) ? assignmentsRes.data : []`.
2. **Fix `getPlanAssignments.service.ts` Types**:
   - Change return type from `Promise<ApiResponse<PlanAssignmentsPaginatedResponse>>` to `Promise<ApiResponse<NutritionPlanAssignment[]>>`.
3. **Handle default "All Plans" state or load assignments**:
   - If a global "Get All Assignments" endpoint exists, use it when `planFilter === "all"`. Otherwise, update the UI helper text to clearly guide the user to select a plan first, or default `planFilter` to the first available plan.
4. **Fix typescript warnings and type assertions**:
   - Clean up unused imports, wrap `refetch` in an anonymous function (`() => refetch()`), and add explicit casts/assertions for Zod schemas and `MealType`.
