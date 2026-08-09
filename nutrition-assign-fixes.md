# Nutrition Plan Assign Flow — Implementation Plan

> **Instructions**: Tasks are ordered by dependency. Implement one task at a time.
> After each task is done, mark it `[x]` and move to the next.
> Do NOT implement the next task until the current one is verified.

---

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done & verified
- `[!]` Blocked

---

## Task Overview (Ordered by Dependency)

| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Fix missing `common` translation keys | P0 | `[x]` |
| 2 | Fix type mismatches: `nutritionPlanId` and `groupId` as numbers | P0 | `[x]` |
| 3 | Fix optional `endDate`: send `null` instead of duplicating `startDate` | P0 | `[x]` |
| 4 | Fix `NutritionPlanAssignment` interface: nullable `endDate`, correct numeric IDs | P1 | `[x]` |
| 5 | Fix the Zod `assignmentSchema` to match real UI/API contract | P1 | `[x]` |
| 6 | Fix Group Assignment response mapping and remove broken modal | P0 | `[x]` |
| 7 | Verify auth/authorization — confirm no 403s on lookup and assignment endpoints | P1 | `[x]` |
| 8 | Wire `AssignmentsList` to the real API (replace all mock data) | P0 | `[x]` |
| 9 | Verify React Query invalidation refreshes the real assignments list | P1 | `[x]` |

---

## TASK 1 — Fix missing `common` translation keys

**Priority**: P0
**Status**: `[x]`

### Files Involved
- `src/translations/en/common.json`
- `src/translations/ar/common.json`

### What Is Currently Wrong
`AssignPlanSlideOver` and `BatchResultPanel` call `t("common:close")`, `t("common:cancel")`, `t("common:processing")`, and `t("common:loading")`. None of these keys exist in `en/common.json`. Every one of them renders the raw key string (e.g. `"common:close"`) to the user instead of readable text.

### What Should Change
Add the following keys to `en/common.json`:
```json
"close": "Close",
"cancel": "Cancel",
"processing": "Processing...",
"loading": "Loading..."
```
Add Arabic equivalents to `ar/common.json`:
```json
"close": "إغلاق",
"cancel": "إلغاء",
"processing": "جارٍ المعالجة...",
"loading": "جارٍ التحميل..."
```

### Dependencies
None — standalone JSON change.

### How to Verify
Open the Assign drawer in the browser. All buttons and loading states must display readable text — no raw key strings visible anywhere in the drawer.

---

## TASK 2 — Fix type mismatches: `nutritionPlanId` and `groupId` must be sent as numbers

**Priority**: P0
**Status**: `[x]`

### Files Involved
- `src/features/nutrition/types/index.ts`
- `src/features/nutrition/hooks/useAssignMultipleAthletes.ts`
- `src/features/nutrition/components/AssignPlanSlideOver.tsx`

### What Is Currently Wrong
The API contract specifies `NutritionPlanId` as `int` and `GroupId` as `int?`. The frontend currently has:
- `AssignPlanToAthletePayload.nutritionPlanId: string` — sends `"42"` instead of `42`
- `AssignPlanToGroupPayload.nutritionPlanId: string` — same problem
- `AssignPlanToGroupPayload.groupId: string` — sends `"15"` instead of `15`
- `AssignMultiplePayload.nutritionPlanId: string` (inside `useAssignMultipleAthletes`)

In `AssignPlanSlideOver`, `GroupRow` calls `onToggle(String(group.id))` converting the numeric ID to a string. `selectedGroupId` is stored as `string`. C# `System.Text.Json` rejects string values for `int` fields with a `400 Bad Request`.

### What Should Change

**`src/features/nutrition/types/index.ts`**
- `AssignPlanToAthletePayload.nutritionPlanId` → `number`
- `AssignPlanToGroupPayload.nutritionPlanId` → `number`
- `AssignPlanToGroupPayload.groupId` → `number`

**`src/features/nutrition/hooks/useAssignMultipleAthletes.ts`**
- `AssignMultiplePayload.nutritionPlanId` → `number`

**`src/features/nutrition/components/AssignPlanSlideOver.tsx`**
- Change `selectedGroupId` state type from `string` to `number | null` (use `null` for "nothing selected")
- `GroupRow.onToggle` prop: `(id: number) => void`
- Inside `GroupRow`: call `onToggle(group.id)` — remove `String()`
- In `handleConfirm` athlete path: `nutritionPlanId: Number(plan.id)`
- In `handleConfirm` group path: `nutritionPlanId: Number(plan.id)`, `groupId: selectedGroupId` (already a number after state fix)
- Update the `selectedGroupId === g.id` comparison (no more `String()` needed)
- Update `groups.find((g) => g.id === selectedGroupId)` (remove `String()` wrapper)
- Update `canSubmit` check: `targetMode === "group" ? selectedGroupId !== null : ...`
- Update `selectionError` check: `!selectedGroupId` → `selectedGroupId === null`

### Dependencies
None — this is the root cause fix for 400 errors.

### How to Verify
Open browser DevTools Network tab. After submitting any assignment, the POST request body must show:
- `"nutritionPlanId": 42` — a number, no quotes
- `"groupId": 15` — a number, no quotes (group path only)
The response must be `200 OK`, not `400`.

---

## TASK 3 — Fix optional `endDate`: send `null` instead of duplicating `startDate`

**Priority**: P0
**Status**: `[x]`

### Files Involved
- `src/features/nutrition/hooks/useAssignMultipleAthletes.ts`
- `src/features/nutrition/components/AssignPlanSlideOver.tsx`
- `src/features/nutrition/types/index.ts`

### What Is Currently Wrong
When the user leaves `endDate` blank (open-ended assignment):

**Athlete path** in `useAssignMultipleAthletes.ts`:
```ts
const effectiveEndDate = endDate.trim() || startDate;  // sends startDate as endDate
```

**Group path** in `AssignPlanSlideOver.tsx`:
```ts
endDate: endDate || startDate,  // sends startDate as endDate
```

Both create a same-day assignment instead of an open-ended one. The API contract declares `EndDate: DateOnly?` — it is optional and should be `null` when not provided.

The payload types also declare `endDate` as required `string`, which is wrong.

### What Should Change

**`src/features/nutrition/types/index.ts`**
- `AssignPlanToAthletePayload.endDate` → `string | null`
- `AssignPlanToGroupPayload.endDate` → `string | null`

**`src/features/nutrition/hooks/useAssignMultipleAthletes.ts`**
- `AssignMultiplePayload.endDate` stays as `string` (empty string = no end date signal from UI)
- Change the fallback line:
  ```ts
  const effectiveEndDate = endDate.trim() ? endDate.trim() : null;
  ```
- `endDate: effectiveEndDate` is then passed to `assignPlanToAthlete` — serializes as `null` correctly

**`src/features/nutrition/components/AssignPlanSlideOver.tsx`** (group path in `handleConfirm`):
```ts
endDate: endDate.trim() ? endDate.trim() : null,
```

### Dependencies
Task 2 (types file is already open for edits).

### How to Verify
Submit an assignment with no end date filled. Network tab must show `"endDate": null` in the request body. The backend response must be `200` and the returned assignment's `endDate` must be `null`.

---

## TASK 4 — Fix `NutritionPlanAssignment` interface: nullable `endDate`, correct numeric IDs

**Priority**: P1
**Status**: `[x]`

### Files Involved
- `src/features/nutrition/types/index.ts`

### What Is Currently Wrong
The `NutritionPlanAssignment` interface does not match the API response shape:
- `id: string` — API returns `int`
- `nutritionPlanId: string` — API returns `int`
- `groupId?: string` — API returns `int?` (number or null)
- `endDate: string` — API returns `DateOnly?` (can be null)
- Missing `nutritionPlanName?: string` — API returns this field
- Missing `assignedAt?: string` — API returns this field (was named `createdAt` in the old type)
- `createdAt?: string` and `assignedBy?: string` — these do not exist in the API response; remove them

### What Should Change
Replace the `NutritionPlanAssignment` interface with:
```ts
export interface NutritionPlanAssignment {
  id: number;
  nutritionPlanId: number;
  nutritionPlanName?: string;
  athleteId?: string;
  groupId?: number | null;
  startDate: string;
  endDate: string | null;
  assignedAt?: string;
}
```

### Dependencies
Tasks 2 and 3 (types file already being edited in those tasks).

### How to Verify
TypeScript build (`tsc --noEmit`) must pass with zero type errors across every file that imports `NutritionPlanAssignment`.

---

## TASK 5 — Fix the Zod `assignmentSchema` to match real UI/API contract

**Priority**: P1
**Status**: `[x]`

### Files Involved
- `src/features/nutrition/constants/validations.ts`

### What Is Currently Wrong
```ts
endDate: z.string().min(1, "End date is required"),
```
This makes `endDate` required. The real flow allows a blank `endDate` for open-ended assignments.

The date-range refinement:
```ts
const end = new Date(data.endDate);  // crashes/invalid if endDate is empty or null
```
Does not guard for the empty case.

Although this schema is currently dead code (not wired to the assign form), it exports `AssignmentFormValues` which is re-exported from `types/index.ts`, making it a shared contract type. Leaving it wrong creates confusion and will break any future wiring.

### What Should Change
In `src/features/nutrition/constants/validations.ts`, update `assignmentSchema`:

1. Change `endDate` to optional:
   ```ts
   endDate: z.string().optional(),
   ```
2. Update the date-range refinement to skip validation when `endDate` is absent:
   ```ts
   .refine(
     (data) => {
       if (!data.endDate || !data.endDate.trim()) return true;
       const start = new Date(data.startDate);
       const end = new Date(data.endDate);
       return end >= start;
     },
     { message: "End date must be on or after the start date", path: ["endDate"] },
   )
   ```

### Dependencies
Task 3 (understanding the null/optional endDate semantics).

### How to Verify
TypeScript build must pass. `AssignmentFormValues` type must have `endDate?: string | undefined`. The Zod schema `assignmentSchema.safeParse({ nutritionPlanId: "1", athleteId: "x", startDate: "2026-08-01" })` must return `success: true` (no endDate, valid).

---

## TASK 6 — Fix Group Assignment response mapping and remove broken modal

**Priority**: P0
**Status**: `[x]`

### Files Involved
- `src/features/nutrition/types/index.ts`
- `src/features/nutrition/services/assignPlanToGroup.service.ts`
- `src/features/nutrition/hooks/useAssignPlanToGroup.ts`
- `src/features/nutrition/components/AssignPlanSlideOver.tsx`
- `src/features/nutrition/components/GroupAssignmentResultModal.tsx`

### What Is Currently Wrong
The API `POST /nutrition-plan-assignments/group` returns:
```json
{ "data": [ { "id": 201, "nutritionPlanId": 42, "athleteId": "...", ... } ] }
```
`data` is a `NutritionPlanAssignment[]` array.

The frontend casts it as `GroupAssignmentResult = { assigned: AssignedAthlete[]; skipped: SkippedAthlete[] }`.
Result: `gr.assigned` and `gr.skipped` are always `undefined`. The modal always shows "0 assigned, 0 skipped" even when the assignment fully succeeded.

Additionally, the API uses a **partial-success model** — conflicting athletes are silently skipped. There is no `skipped` array returned by the backend. `GroupAssignmentResultModal` is architecturally wrong for this API.

### What Should Change

**`src/features/nutrition/types/index.ts`**
- Remove `GroupAssignmentResult`, `AssignedAthlete`, `SkippedAthlete` interfaces
- Add: `export type GroupAssignmentResponse = NutritionPlanAssignment[];`

**`src/features/nutrition/services/assignPlanToGroup.service.ts`**
- Change return type: `Promise<ApiResponse<GroupAssignmentResponse>>`
- Remove `GroupAssignmentResult` import

**`src/features/nutrition/hooks/useAssignPlanToGroup.ts`**
- Remove `GroupAssignmentResult` import
- `onSuccess` callback now receives `ApiResponse<GroupAssignmentResponse>`
- `response.data` is `NutritionPlanAssignment[]` — use `response.data?.length ?? 0` for count in toast

**`src/features/nutrition/components/AssignPlanSlideOver.tsx`**
- Remove `groupResult` state (`GroupAssignmentResult | null`)
- Remove `showGroupResultModal` state
- Remove `GroupAssignmentResultModal` import and its JSX render
- Remove `GroupAssignmentResult` type import
- After group assignment `onSuccess`: show inline result. Add a new state `groupAssignedCount: number | null`. In `onSuccess`: set `groupAssignedCount = response.data?.length ?? 0`, then re-use the existing `BatchResultPanel` pattern or show a simple success screen with the count and "Close".
- Keep `handleClose()` call in `onSuccess` to close the drawer after the result is viewed.

**`src/features/nutrition/components/GroupAssignmentResultModal.tsx`**
- Delete this file. It is architecturally incompatible with the actual API response.

### Dependencies
Task 4 (`NutritionPlanAssignment` type updated first so `GroupAssignmentResponse = NutritionPlanAssignment[]` is correct).

### How to Verify
Submit a group assignment. The `GroupAssignmentResultModal` must never appear. The drawer must show the number of successfully assigned athletes (e.g. "5 athletes assigned"). This number must match the length of `response.data` in the Network tab.

---

## TASK 7 — Verify auth/authorization: confirm no 403s on lookup and assignment endpoints

**Priority**: P1
**Status**: `[x]`

### Files Involved
- `src/features/lookups/services/fetchAthletesLookup.service.ts`
- `src/features/nutrition/components/AssignPlanSlideOver.tsx`

### What Is Currently Wrong

**Problem A**: `fetchAthletesLookup` has a silent `catch {}` around the primary endpoint call. If `GET /groups/available-athletes` returns a `403`, the error is silently swallowed and the fallback is attempted. If the fallback also fails, the error propagates — but the drawer shows "No athletes available" with no visual distinction between an empty list and a server error.

**Problem B**: `AssignPlanSlideOver` only checks `athletesLoading` and `groupsLoading`. It never checks `isError` from either hook. If the groups endpoint returns `403`, the user sees "No groups available" with no explanation.

### What Should Change

**`src/features/lookups/services/fetchAthletesLookup.service.ts`**
- Remove the `catch {}` block. The primary endpoint error should propagate. The fallback is only for a successful-but-empty response:
  ```ts
  export async function fetchAthletesLookup(): Promise<ApiResponse<AthleteLookupItem[]>> {
    const res = await customFetch<ApiResponse<AthleteLookupItem[]>>("/groups/available-athletes");
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      return res;
    }
    return customFetch<ApiResponse<AthleteLookupItem[]>>("/users/athletes-lookup");
  }
  ```

**`src/features/nutrition/components/AssignPlanSlideOver.tsx`**
- Destructure `isError: athletesError` from `useAthletesLookup(open)`
- Destructure `isError: groupsError` from `useGroupsLookup(open)`
- In the athlete list section: if `athletesError` is true, render an error message instead of "No athletes available"
- In the group list section: if `groupsError` is true, render an error message instead of "No groups available"

### Manual Verification Steps
Open browser DevTools Network tab while logged in as a NutritionSpecialist:
1. `GET /groups/available-athletes` → must return `200` with athlete data
2. `GET /groups/groups-lookup` → must return `200` with group data
3. `POST /nutrition-plan-assignments/athlete` → must return `200`
4. `POST /nutrition-plan-assignments/group` → must return `200`

If any endpoint returns `403`, this is a backend role-configuration issue that cannot be fixed from the frontend — it must be escalated to the backend team.

### Dependencies
Tasks 2 and 3 (correct payloads must be sent before testing the assignment POSTs).

### How to Verify
Open the Assign drawer as a NutritionSpecialist. Athletes list and groups list both populate with real data. If either fails, a clear error message is shown (not a silent empty state).

---

## TASK 8 — Wire `AssignmentsList` to the real API (replace all mock data)

**Priority**: P0
**Status**: `[x]`

### Files Involved
- `src/features/nutrition/components/AssignmentsList.tsx`
- `src/features/nutrition/hooks/usePlanAssignments.ts`
- `src/features/lookups/hooks/useAthletesLookup.ts`
- `src/features/lookups/hooks/useGroupsLookup.ts`

### What Is Currently Wrong
The `AssignmentsList` component has three hardcoded mock data functions and never calls `usePlanAssignments`:
```ts
const assignments = getMockAssignments();   // hardcoded 2024 data
const athleteData = getMockAthleteData();   // hardcoded name map
const groupData = getMockGroupData();       // hardcoded group map
```
`usePlanAssignments` is imported but never used. The Assignments tab always shows the same static fake data regardless of what is actually assigned on the server.

Additionally:
- `getAssignmentStatus()` crashes when `assignment.endDate` is `null` — `new Date(null)` returns epoch (Jan 1 1970) making all open-ended assignments show as "Ended"
- `formatDateRange()` does not handle `null` endDate

### What Should Change

1. **Remove** `getMockAssignments()`, `getMockAthleteData()`, `getMockGroupData()` and all their usages.

2. **Data source**: When `planFilter === "all"`, show the translation `t("assignments.selectPlan")` and render nothing. When `planFilter !== "all"`, call:
   ```ts
   const { data: assignmentsRes, isLoading: assignmentsLoading } =
     usePlanAssignments(planFilter, { pageSize: 100 }, planFilter !== "all");
   const assignments = assignmentsRes?.data?.items ?? [];
   ```

3. **Athlete name resolution**: Call `useAthletesLookup()` (always enabled). Build a lookup map:
   ```ts
   const athleteMap = useMemo(() =>
     new Map((athletesRes?.data ?? []).map(a => [a.athleteId, a.fullName])),
     [athletesRes]
   );
   ```
   In the row render: `athleteMap.get(assignment.athleteId) ?? assignment.athleteId`

4. **Group name resolution**: Call `useGroupsLookup()` (always enabled). Build a lookup map:
   ```ts
   const groupMap = useMemo(() =>
     new Map((groupsRes?.data ?? []).map(g => [g.id, g.name])),
     [groupsRes]
   );
   ```
   In the row render: `groupMap.get(assignment.groupId) ?? String(assignment.groupId)`

5. **Fix `getAssignmentStatus`** to handle `null` endDate:
   ```ts
   function getAssignmentStatus(assignment: NutritionPlanAssignment): AssignmentStatus {
     const today = new Date(); today.setHours(0,0,0,0);
     const start = new Date(assignment.startDate); start.setHours(0,0,0,0);
     if (today < start) return "upcoming";
     if (!assignment.endDate) return "active";  // open-ended = always active
     const end = new Date(assignment.endDate); end.setHours(0,0,0,0);
     return today > end ? "ended" : "active";
   }
   ```

6. **Fix `formatDateRange`** signature and body:
   ```ts
   function formatDateRange(startDate: string, endDate: string | null): string {
     const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
     const start = new Date(startDate);
     if (!endDate) return `${fmt(start)} – ongoing`;
     return `${fmt(start)} – ${fmt(new Date(endDate))}`;
   }
   ```

7. **Add loading state**: while `assignmentsLoading` is true, render a skeleton or spinner instead of the empty state message.

8. **Remove** the hardcoded mock variable for `groupedAssignments` that keys on `assignment.groupId` — `groupId` is now a `number | null`, so update the grouping key: `const key = assignment.groupId ?? "individual"`.

### Dependencies
Tasks 4 (correct `NutritionPlanAssignment` type), Task 6 (mock type interfaces removed).

### How to Verify
1. Navigate to the Assignments tab
2. The component shows `t("assignments.selectPlan")` when no plan is selected
3. Select a real plan from the dropdown — a network call to `GET /nutrition-plan-assignments/plan/{id}` fires
4. Real assignments appear with correct athlete names (not GUIDs)
5. Open-ended assignments show "ongoing" in the date column
6. Open-ended assignments show "Active" status badge, not "Ended"
7. Filtering by source and status works correctly on the real data

---

## TASK 9 — Verify React Query invalidation refreshes the real assignments list

**Priority**: P1
**Status**: `[x]`

### Files Involved
- `src/features/nutrition/constants/queryKeys.ts`
- `src/features/nutrition/hooks/useAssignMultipleAthletes.ts`
- `src/features/nutrition/hooks/useAssignPlanToGroup.ts`
- `src/features/nutrition/hooks/usePlanAssignments.ts`

### What Is Currently Wrong
After Task 2, `nutritionPlanId` will be a `number` in the mutation payloads. `NUTRITION_KEYS.assignmentsByPlan` currently accepts a `string`:
```ts
assignmentsByPlan: (planId: string) => [...NUTRITION_KEYS.assignments(), "plan", planId]
```
If the cache entry was stored with `planId = "42"` (string, from `AssignmentsList`'s `planFilter` state which comes from a `<select>` value — always a string) but the invalidation fires with `planId = 42` (number, from `variables.nutritionPlanId` after Task 2), the query keys won't match and the invalidation silently does nothing.

### What Should Change

**`src/features/nutrition/constants/queryKeys.ts`**
- Change `assignmentsByPlan` to accept `string | number` and normalize to string:
  ```ts
  assignmentsByPlan: (planId: string | number) =>
    [...NUTRITION_KEYS.assignments(), "plan", String(planId)] as const,
  ```

**`src/features/nutrition/hooks/usePlanAssignments.ts`**
- Change `planId: string` parameter to `planId: string | number`
- Normalize inside: `getPlanAssignments(String(planId), params)`

**`src/features/nutrition/hooks/useAssignMultipleAthletes.ts`** and **`useAssignPlanToGroup.ts`**
- No changes needed — they already pass `nutritionPlanId` to `NUTRITION_KEYS.assignmentsByPlan()`. After the key normalization above, the number will be correctly converted to string.

### Dependencies
Tasks 2, 8 (the real assignments list must be wired up for invalidation to be testable).

### How to Verify
1. Open the Assignments tab and select a plan — the real list loads
2. WITHOUT navigating away, open the Assign drawer for that same plan
3. Assign one or more athletes
4. Close the drawer / confirm the batch result
5. The Assignments tab list must automatically update to include the new assignment — without any manual page refresh or tab switch
6. Verify in the Network tab that a second `GET /nutrition-plan-assignments/plan/{id}` request fires after the POST completes

---

## Recommended Implementation Order

```
Task 1  (translations)           ← standalone, no deps
  ↓
Task 2  (number types)           ← foundation, fixes 400 errors
  ↓
Task 3  (endDate null)           ← depends on Task 2
  ↓
Task 4  (NutritionPlanAssignment type) ← depends on Tasks 2+3
  ↓
Task 5  (Zod schema)             ← depends on Task 3
  ↓
Task 6  (group result fix)       ← depends on Task 4
  ↓
Task 7  (auth verification)      ← depends on Tasks 2+3 (correct payloads)
  ↓
Task 8  (wire real API)          ← depends on Tasks 4+6
  ↓
Task 9  (query invalidation)     ← depends on Tasks 2+8
```

---

## Final Verification Checklist

Use this after ALL tasks are complete to verify the entire Assign flow end-to-end.

### Pre-conditions
- [ ] Logged in as a NutritionSpecialist with a valid token
- [ ] At least one nutrition plan exists
- [ ] At least one athlete is assigned to this specialist
- [ ] At least one group with athletes exists for this specialist

### Translations (Task 1)
- [ ] Assign drawer cancel button shows "Cancel" — not `"common:cancel"`
- [ ] Confirm button shows "Confirm Assignment"
- [ ] Loading state shows "Processing..." — not `"common:processing"`
- [ ] Athlete list loading shows "Loading..." — not `"common:loading"`
- [ ] Batch result "Done" button shows "Close" — not `"common:close"`

### Data Fetching (Tasks 7, 8)
- [ ] `GET /groups/available-athletes` returns `200` with athlete list when drawer opens
- [ ] `GET /groups/groups-lookup` returns `200` with group list when drawer opens
- [ ] If fetch fails: drawer shows clear error message, not silent empty state

### Individual Athlete Assignment (Tasks 2, 3, 8)
- [ ] Athlete list populates with real athletes from the API
- [ ] Search filters the list by name in real time
- [ ] Multiple athletes can be selected simultaneously
- [ ] Start date is required — error shows if submitted without it
- [ ] End date is optional — leaving blank is valid and submits correctly
- [ ] End date before start date shows inline error and blocks submission
- [ ] POST body: `"nutritionPlanId": 42` — a number, no quotes
- [ ] POST body: `"endDate": null` when no end date entered
- [ ] Response is `200 OK`
- [ ] Batch result panel shows succeeded athletes (green) and failed (amber)
- [ ] "Close" button closes drawer and resets all state

### Group Assignment (Tasks 2, 3, 6)
- [ ] Groups list populates with real groups from the API
- [ ] Only one group can be selected at a time
- [ ] POST body: `"groupId": 15` — a number, no quotes
- [ ] POST body: `"endDate": null` when no end date entered
- [ ] Response is `200 OK` with array of created assignments
- [ ] Drawer shows count of athletes assigned matching `response.data.length`
- [ ] `GroupAssignmentResultModal` is deleted and never appears

### Assignments Tab (Tasks 4, 5, 8, 9)
- [ ] Default state shows "Select a plan to view its assignments"
- [ ] Selecting a plan triggers `GET /nutrition-plan-assignments/plan/{id}`
- [ ] Real assignments appear with athlete names (not raw GUIDs)
- [ ] Group assignments show correct group name
- [ ] Open-ended assignments show "ongoing" in the date column
- [ ] Open-ended assignments show "Active" badge — not "Ended"
- [ ] Source filter (group/individual) works on real data
- [ ] Status filter (active/upcoming/ended) works on real data
- [ ] After successful assignment → list auto-refreshes without page reload

### TypeScript Build
- [ ] `tsc --noEmit` completes with zero errors
- [ ] No `as unknown`, `as any`, or unsafe casts introduced

---

*End of implementation plan. Approve to begin with Task 1.*
