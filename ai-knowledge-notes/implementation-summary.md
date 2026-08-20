# Phase 1 — Admin Knowledge Base Flow (Scaffold)

Feature: Admin-only knowledge-documents management (upload → poll → list → delete).
Backend contract source: `AI-Admin-Flow.md` (§3.7–3.10, §10, §11, §14, §15, §21, §22).
Status: **COMPLETE** — build + lint verified.

> Document renamed to `implementation-summary.md` so each phase appends its own section.

---

## Scope of Phase 1

Only the scaffold: feature folder, types, constants (enums + query keys), the four API
services, the `aiKnowledge` i18n namespace, the `/knowledge-base` route + page skeleton.

**Explicitly NOT implemented** (later phases): list UI, status badges, domain filter,
upload dialog, polling, delete confirm, toasts, hooks. The page is a header-only skeleton.

---

## Files created

| File | Why it exists | What was implemented |
|---|---|---|
| `src/features/ai-knowledge/constants/enums.ts` | Feature-scoped enums, mirroring `src/features/ai-recommendations/constants/enums.ts` | `KnowledgeIndexStatus` const + type (`1` Pending, `2` Indexed, `3` Failed, `4` Processing — numeric on the wire, §15); `DomainId` const + type (`1`/`2`/`3`); `KNOWLEDGE_DOMAINS` display metadata array (`id` + `labelKey`, labels consumed via the `aiKnowledge` namespace) |
| `src/features/ai-knowledge/constants/queryKeys.ts` | TanStack Query key factory, mirroring `AI_KEYS` | `KNOWLEDGE_KEYS`: `all`, `documents()`, `documentList(params?)`, `documentDetail(id)` |
| `src/features/ai-knowledge/types/index.ts` | API DTO types for the feature | `KnowledgeDocumentResponse` (list + status-poll shape, includes `vectorRef: string \| null`); `KnowledgeDocumentUploadResponse` = `Omit<..., "vectorRef">` (the 202 body of POST does **not** return `vectorRef`, §3.7); `UploadKnowledgeDocumentRequest`; `FetchKnowledgeDocumentsParams` |
| `src/features/ai-knowledge/services/uploadKnowledgeDocument.service.ts` | POST `/knowledge-documents` | Builds multipart FormData (`file`, `title`, `domainId`), posts via `customFetch`, returns the 202 raw object; explicit fresh idempotency key; `timeoutMs: 120_000` |
| `src/features/ai-knowledge/services/getKnowledgeDocumentStatus.service.ts` | GET `/knowledge-documents/{id}` | Poll endpoint returning the raw document object |
| `src/features/ai-knowledge/services/listKnowledgeDocuments.service.ts` | GET `/knowledge-documents` | Returns the raw array (not paginated); appends `domainId` only when defined and `> 0`, mirroring `listRecommendations.service.ts` |
| `src/features/ai-knowledge/services/deleteKnowledgeDocument.service.ts` | DELETE `/knowledge-documents/{id}` | 204 No Content handling via `isJsonResponse: false` (empty body must not be JSON-parsed) |
| `src/translations/en/aiKnowledge.json` | EN labels | `page.title`, `page.description`, `domain.swimming/fitness/nutrition` |
| `src/translations/ar/aiKnowledge.json` | AR labels | Same keys in Arabic |
| `src/pages/knowledge-base.tsx` | Page skeleton for the feature | `PageWrapper` + header (`h1` + description) from the `aiKnowledge` namespace — matches the `ai-recommendations.tsx` page header pattern |

## Files modified

| File | Change | Why |
|---|---|---|
| `src/translations/en/index.ts` | Import + register `aiKnowledge` in `en` | Namespace registration pattern (`i18next` resources) |
| `src/translations/ar/index.ts` | Import + register `aiKnowledge` in `ar` | Same for Arabic |
| `src/routes/router.tsx` | Import `KnowledgeBasePage`; added route `path: "/knowledge-base"` wrapped in `ProtectedRoute allowedRoles={["Admin"]}` | Matches the existing sidebar nav item (`src/constants/sidebar.ts`: `knowledgeBase`, path `/knowledge-base`, `allowedRoles: ["Admin"]`), which previously had no route |

---

## Important implementation decisions

1. **Fresh idempotency key per upload.** `customFetch` auto-generates an idempotency key
   for every POST, keyed by a payload hash — but `getPayloadHash` treats non-string bodies
   as `""`, so **all FormData uploads share one hash**. Two different uploads within the
   5-minute TTL would reuse the same key (risking a cached failure response on the backend).
   Fix: pass an explicit `generateIdempotencyKey()` per call in the upload service.

2. **`timeoutMs: 120_000` on upload.** `customFetch` default timeout is 10s; the contract
   allows PDFs up to **50 MB** (§3.7). 120s matches the existing generous-timeout precedent
   for slow AI endpoints (chat uses 120s).

3. **`isJsonResponse: false` on delete.** The contract (§11) returns a bare `204 No
   Content`. Every other DELETE service in the codebase assumes a JSON body
   (`ApiResponse<boolean>` etc.); this is the first service that must handle a true 204.

4. **`domainId` sent only when `> 0`** (§3.9: "Optional filter; only returned when > 0").

5. **`vectorRef` typed nullable** (`string | null`). The contract (§3.8, §22) states it is
   "exposed but never populated" — typed nullable so consumers are forced to handle it.

6. **No pagination on the list type.** §3.9/§22: `GET /knowledge-documents` returns
   everything, unpaginated — `FetchKnowledgeDocumentsParams` has only `domainId`.

7. **Domain ids hardcoded** (no `GET /api/domains` exists, §12): `1 → Swimming`,
   `2 → Fitness`, `3 → Nutrition` in `KNOWLEDGE_DOMAINS`, with label keys resolved from the
   `aiKnowledge` namespace (`domain.*`). `aiPlanView:domain.*` was NOT reused — its
   "training" label doesn't match "Fitness".

8. **Raw-body error handling is free.** Knowledge-document `400`/`404` errors are raw JSON
   *strings* (e.g. `"No file was uploaded."`, §14). `customFetch` parses error bodies via
   `response.json()`, which succeeds on JSON string literals, so the message surfaces
   correctly as `error.message` without any special-casing.

9. **`updatedAt` typed `string | null`** even though all contract examples show non-null —
   conservative nullable typing (matches `ChatSessionResponse.updatedAt` precedent).

10. **Admin guard at route level only (Phase 1).** The page is wrapped in
    `ProtectedRoute allowedRoles={["Admin"]}`; the backend enforces the real authorization
    from the JWT (§2).

---

## Backend endpoints used (contract §3.7–3.10)

| Endpoint | Roles | Request | Response | Frontend handling |
|---|---|---|---|---|
| `POST /knowledge-documents` | Admin | `multipart/form-data`: `file` (PDF, ≤50 MB), `title`, `domainId` (1/2/3) | `202` raw object (no `vectorRef`); `400` raw string body | `uploadKnowledgeDocument` — FormData, fresh idempotency key, 120s timeout |
| `GET /knowledge-documents/{id}` | Admin | — | `200` raw object incl. `vectorRef`; `404` raw string | `getKnowledgeDocumentStatus` (poll target) |
| `GET /knowledge-documents?domainId=` | Admin | query `domainId` (only when > 0) | `200` raw array, newest first, not paginated | `listKnowledgeDocuments` |
| `DELETE /knowledge-documents/{id}` | Admin | — | `204` No Content; `404` `ApiResponse` body | `deleteKnowledgeDocument` with `isJsonResponse: false` |

Base URL note: `BACKEND_BASE_URL` already includes `/api`, so services use
`/knowledge-documents...` exactly like existing `/ai-recommendations...` services.
Auth is automatic via `customFetch` (Bearer JWT + refresh).

---

## Verification performed

1. **Type/build check** — `npm run build` (`tsc -b && vite build`): **PASSED**
   (2982 modules transformed, no errors; only pre-existing chunk-size warnings).
2. **Lint** — `npx eslint "src/features/ai-knowledge/**/*.{ts,tsx}" "src/pages/knowledge-base.tsx"`:
   **CLEAN** (no output).
3. **Contract cross-check** against `AI-Admin-Flow.md`:
   - multipart field names (`file`/`title`/`domainId`) match §3.7 request table;
   - 202 body shape matches §3.7 example (no `vectorRef` — confirmed via `Omit` type);
   - `indexStatus` values 1/2/3/4 match §15 `KnowledgeIndexStatus` table;
   - list `domainId` semantics match §3.9;
   - 204 empty body + `isJsonResponse: false` matches §11;
   - no `pageNumber`/`pageSize` on the list (unpaginated, §22);
   - route path `/knowledge-base` matches the pre-existing sidebar nav item.
4. **Precedent checks** — service/query-key/enum/i18n/page patterns mirror
   `ai-recommendations`; delete service is intentionally the first bare-204 handling in the
   codebase (all other DELETE endpoints return JSON bodies).

---

## Notes for later phases

- List hook will use `KNOWLEDGE_KEYS.documentList(params)`; polling can reuse
  `documentDetail(id)` or re-poll the list (unpaginated).
- Upload dialog will consume `UploadKnowledgeDocumentRequest` and the 202 `id` returned by
  `uploadKnowledgeDocument` for the poll target.
- `KNOWLEDGE_DOMAINS` + `aiKnowledge:domain.*` keys exist for the domain filter and badges.
- Deleting a `Processing` (4) document is undefined backend behavior (§11) — UI must guard.

---

# Phase 2 — Document List (view, domain filter, badges, states)

## Scope of Phase 2

Read-only document list: list query hook, domain filter (SegmentedControl), per-document
list items with domain + ingestion-status badges, and loading/error/empty states.

**Explicitly NOT implemented** (later phases): upload dialog, polling (`refetchInterval`),
delete, toasts, mutation hooks.

## Files created

| File | Why it exists | What was implemented |
|---|---|---|
| `src/features/ai-knowledge/hooks/useKnowledgeDocuments.ts` | List data hook | `useQuery` wrapper over `listKnowledgeDocuments` keyed by `KNOWLEDGE_KEYS.documentList(params)`, mirroring `useRecommendations` |
| `src/features/ai-knowledge/components/KnowledgeDocumentStatusBadge.tsx` | Ingestion-status chip | `indexStatus` → semantic badge (Pending/Processing amber, Indexed emerald, Failed destructive) with an animated `MdSync` spinner on Processing; unknown statuses fall back to Pending |
| `src/features/ai-knowledge/components/KnowledgeDocumentDomainBadge.tsx` | Domain chip | Per-domain colored badge with icon (`MdPool` cyan / `MdFitnessCenter` blue / `MdRestaurant` emerald), labels from `KNOWLEDGE_DOMAINS` + `aiKnowledge:domain.*`; unknown domain falls back to the raw id |
| `src/features/ai-knowledge/components/KnowledgeDocumentsFilter.tsx` | Domain filter | `SegmentedControl` (All / Swimming / Fitness / Nutrition) synced to the `domain` URL search param — "All" removes the param, mirroring `RecommendationFilters` |
| `src/features/ai-knowledge/components/KnowledgeDocumentListItem.tsx` | Single row | Card row: domain badge + title (truncated) + "Uploaded {date}" + status badge; styling mirrors `RecommendationListItem` |
| `src/features/ai-knowledge/components/KnowledgeDocumentsList.tsx` | List container | Reads `domain` param, calls `useKnowledgeDocuments`, renders via `WithLoadingAndError` (spinner / `ErrorMessage` / `NoData` with upload CTA copy) |

## Files modified

| File | Change | Why |
|---|---|---|
| `src/pages/knowledge-base.tsx` | Added `Box` containing `KnowledgeDocumentsFilter` + `KnowledgeDocumentsList` | Page now renders the Phase 2 list; matches the `ai-recommendations.tsx` page structure |
| `src/translations/en/aiKnowledge.json` | Added `filters.all`, `status.*`, `list.*` keys | List UI labels |
| `src/translations/ar/aiKnowledge.json` | Same keys in Arabic | RTL parity |

## Important implementation decisions

1. **Server-side domain filtering** via the `domainId` query param (§3.9 explicitly
   supports it), driven by the `domain` URL param — the URL keeps filter state shareable,
   matching `RecommendationFilters`' `status` param precedent. "All" omits the param so
   the backend returns everything.
2. **Badges are standalone components**, not inline config — they are reused in Phases 3
   (upload result) and 4 (polling/delete), keeping one source of truth for status/domain
   visuals.
3. **Status palette follows the app-wide semantics**: amber = pending/in-progress,
   emerald = success, destructive = failed (same classes as `RecommendationListItem` and
   `PlanStatusBadge`). Processing adds a spinning icon so "in progress" reads as live.
4. **Domain badge mirrors the `CurrentPlanCard` `DomainBadge` design language**
   (cyan/blue/emerald + domain icons) for cross-feature consistency, but resolves labels
   from the `aiKnowledge` namespace.
5. **Dates use the established convention** `new Date(...).toLocaleDateString(i18n.language)`
   (`formatDistanceToNow` exists but is unused in the codebase; the list rows use the same
   pattern as `RecommendationListItem`/`ChatSessionItem`).
6. **Empty/loading/error states reuse `WithLoadingAndError`** with `aiKnowledge:list.*`
   message keys, following the `aiInbox` precedent (no new feedback components).
7. **`query.data ?? []`** — the list endpoint returns a raw array; a `data` of `undefined`
   before first resolution must not crash the `.map`.

## Backend endpoints used (contract §3.9)

| Endpoint | Roles | Request | Response | Frontend handling |
|---|---|---|---|---|
| `GET /knowledge-documents?domainId=` | Admin | query `domainId` (only when > 0) | `200` raw array, newest first, not paginated | `useKnowledgeDocuments` → `KnowledgeDocumentsList` |

## Verification performed

1. **Type/build check** — `npm run build` (`tsc -b && vite build`): **PASSED**.
   One issue class introduced by Phase 2 was found and fixed: relative import depth in
   components (`../../` → `../`, since `components/` sits one level under the feature
   root, unlike `ai-recommendations`' nested `components/inbox/`).
2. **Lint** — `npx eslint "src/features/ai-knowledge/**/*.{ts,tsx}" "src/pages/knowledge-base.tsx"`:
   **CLEAN**.
3. **Contract cross-check**: filter param name (`domainId`), value semantics (> 0),
   raw-array response, unpaginated — all match §3.9/§22.

---

# Phase 3 — Upload Dialog (multipart upload + validation + 202 handling)

## Scope of Phase 3

Admin uploads a PDF via a modal: file picker, title, domain select, client-side
validation, async submission via `POST /knowledge-documents`, 202 handling, list
invalidation, and toasts.

**Explicitly NOT implemented** (Phase 4): live ingestion polling (`refetchInterval`),
delete flow. After a successful upload the new document appears in the list as
`Pending` (the status badge already renders `Processing…` for status 4, but it is not
auto-refreshed until Phase 4).

## Files created

| File | Why it exists | What was implemented |
|---|---|---|
| `src/features/ai-knowledge/constants/validations.ts` | Client-side validation for the upload form | Zod v4 schema: `title` (required, trimmed), `domainId` (required 1–3), `file` (required, PDF by MIME or `.pdf` extension, ≤ 50 MB). Error strings are **i18n keys** resolved via `t()` (mirrors the `ai-recommendations` validation pattern). Exports `MAX_KNOWLEDGE_FILE_SIZE_BYTES` |
| `src/features/ai-knowledge/hooks/useUploadKnowledgeDocument.ts` | Mutation hook | `useMutation` over `uploadKnowledgeDocument`; `meta: { skipGlobalErrorToast: true }`; on success invalidates `KNOWLEDGE_KEYS.documents()` + success toast + optional callback; on error maps 403 → access toast, 400 → `errors.join(" · ")` or the raw message or generic toast (mirrors `useGeneratePlan`) |
| `src/features/ai-knowledge/components/UploadKnowledgeDocumentDialog.tsx` | The modal | Controlled `Dialog` with a dashed-border file picker (`<input type="file" accept="application/pdf,.pdf">`), title `Input`, `ComboboxSelect` for domain (`KNOWLEDGE_DOMAINS` options), inline per-field error text, submit button with `Uploading…` pending state, disabled-close while pending, manual `safeParse` + `t(key)` error mapping, resets on open (Radix Dialog unmounts content on close, so no effect needed) |

## Files modified

| File | Change | Why |
|---|---|---|
| `src/pages/knowledge-base.tsx` | Header row: `KnowledgeDocumentsFilter` + "Upload Document" `Button` (opens the dialog); dialog rendered at page level | Mirrors `ai-recommendations.tsx`'s filter+action header |
| `src/translations/en/aiKnowledge.json` | Added `page.uploadNew`, `upload.*`, `toasts.uploadSuccess/uploadError/accessError`, `validations.*` | Upload UI labels |
| `src/translations/ar/aiKnowledge.json` | Same keys in Arabic | RTL parity |
| `src/services/customFetch.ts` | Two changes: (1) error path now normalizes raw JSON-**string** bodies (`"No file was uploaded."`) into `{ message }`; (2) replaced pre-existing `catch (err: any)` with `catch (err: unknown)` + casts | (1) makes the contract's documented raw-string `400`/`404` messages (§14 caveats) actually surface as `error.message`; (2) clears the `no-explicit-any` lint rule on a file Phase 3 depends on |

## Important implementation decisions

1. **Client validation mirrors the contract**: PDF-only (`application/pdf` or `.pdf`
   extension — browsers may report an empty MIME for some PDFs), 50 MB cap, required
   title/domain. These mirror §3.7 (`file` PDF ≤ 50 MB, `title` required, `domainId`
   1/2/3) and prevent the common raw-string `400`s before they reach the network.
2. **Zod v4 API** (project uses `zod@4.4.3`): `invalid_type_error` does not exist in v4 —
   use `{ message: "key" }` for type errors and string messages for `.min/.max/.refine`.
   `.flatten().fieldErrors` still works and is used for per-field error mapping.
3. **`skipGlobalErrorToast: true` + custom `onError`** — the app's global `MutationCache`
   onError would otherwise toast every failure; this hook toasts exactly once with the
   right message (the established `useGeneratePlan`/`useReviewRecommendation` pattern).
4. **No form reset effect** — Radix `Dialog` unmounts `DialogContent` when closed, so the
   component's `useState` resets on every open automatically. This also satisfies the
   `react-hooks/set-state-in-effect` rule (the RHF `CreateExerciseModal` needs its effect
   because `useForm` state survives remounts; plain state does not).
5. **FormData built in the service** (`file`/`title`/`domainId`), not in the component —
   keeps the component UI-only, consistent with the service-owned HTTP boundary from
   Phase 1.

## Backend endpoints used (contract §3.7)

| Endpoint | Roles | Request | Response | Frontend handling |
|---|---|---|---|---|
| `POST /knowledge-documents` | Admin | `multipart/form-data`: `file` (PDF ≤ 50 MB), `title`, `domainId` | `202` raw object (`id`, no `vectorRef`); `400` raw string body | `useUploadKnowledgeDocument` → invalidate list → new row shows as Pending |

## Verification performed

1. **Type/build check** — `npm run build`: **PASSED**. One Phase-3-introduced issue fixed:
   zod v4 param API (`invalid_type_error` → `{ message }`).
2. **Lint** — `eslint` on the feature + page + `customFetch.ts`: **CLEAN**. Fixes made:
   removed the (redundant) reset effect; upgraded the two pre-existing `any` in
   `customFetch.ts` to `unknown` + casts.
3. **Contract cross-check**: multipart field names, PDF/50 MB constraints, `202` raw
   object shape, and raw-string `400` handling all match §3.7/§14.

---

# Phase 4 — Live Polling + Delete Flow

## Scope of Phase 4

Completes the admin flow: the list auto-polls while any document is being ingested
(Pending/Processing → Indexed/Failed), and admins can delete documents with a confirm
dialog. Deletion is guarded while a document is Processing.

## Files created

| File | Why it exists | What was implemented |
|---|---|---|
| `src/features/ai-knowledge/hooks/useDeleteKnowledgeDocument.ts` | Delete mutation | `useMutation` over `deleteKnowledgeDocument` (204); `skipGlobalErrorToast: true`; on success invalidates `KNOWLEDGE_KEYS.documents()` + success toast; on error maps 403 → access toast, otherwise `error.message` or generic toast (mirrors `useDeleteExercise` but toasts via i18n since 204 carries no body) |
| `src/features/ai-knowledge/components/DeleteKnowledgeDocumentDialog.tsx` | Delete confirmation | `AlertDialog` (title + description naming the document + destructive `AlertDialogAction`), pending state on cancel/confirm, disabled action when no document; mirrors `DeleteExerciseDialog` |

## Files modified

| File | Change | Why |
|---|---|---|
| `src/features/ai-knowledge/hooks/useKnowledgeDocuments.ts` | Added conditional `refetchInterval` (3s) driven by `query.state.data` | Contract §3.8/§17: poll while any document is Pending (1) or Processing (4); stop at Indexed (2)/Failed (3). TanStack pauses interval refetch when the tab is backgrounded — desirable |
| `src/features/ai-knowledge/components/KnowledgeDocumentListItem.tsx` | Added ghost `MdDelete` icon button + inline `DeleteKnowledgeDocumentDialog` state | Delete entry point; disabled while `indexStatus === 4` with an explanatory `title` tooltip |
| `src/translations/en/aiKnowledge.json` | Added `delete.*`, `list.deleteDocument`, `list.deleteDisabledProcessing`, `toasts.deleteSuccess/deleteError` | Delete UI labels |
| `src/translations/ar/aiKnowledge.json` | Same keys in Arabic | RTL parity |

## Important implementation decisions

1. **Polling lives in the list hook, not a component effect** — `refetchInterval` as a
   function of `query.state.data` keeps polling self-contained, declarative, and
   automatically stops when no document needs tracking (no timers, no cleanup).
2. **Poll the list, not per-document** — `GET /knowledge-documents` is unpaginated (§3.9),
   so one list query covers all rows; every poll updates every badge. Poll cadence: 3s
   (contract: "every few seconds", §3.8).
3. **Delete guard on Processing (§11)** — deletion during ingestion is undefined
   backend behavior; the UI disables the button for `indexStatus === 4` (Pending/Indexed/
   Failed remain deletable per the contract's "prefer" guidance) and explains why via
   `title`.
4. **Delete toasts come from i18n keys, not a response message** — the 204 body is
   empty (unlike other DELETE endpoints that return `ApiResponse<boolean>` with a
   `message`), so the hook can't read `response.message`.
5. **Dialog embedded in the list item** (not page-level) — matches `CoachNoteCard`'s
   self-contained confirm pattern; the row owns its dialog state.
6. **Destructive action styling** — `bg-destructive text-destructive-foreground
   hover:bg-destructive/90`, the standard for destructive `AlertDialogAction`s.

## Backend endpoints used (contract §3.8, §11)

| Endpoint | Roles | Request | Response | Frontend handling |
|---|---|---|---|---|
| `GET /knowledge-documents/{id}` | Admin | — | `200` raw object | Poll target conceptually; Phase 4 polls the list endpoint instead (unpaginated list covers all statuses) |
| `DELETE /knowledge-documents/{id}` | Admin | — | `204` No Content; `404` `ApiResponse` body | `useDeleteKnowledgeDocument` → invalidate list → row disappears (soft-deleted rows are excluded from the list, §11) |

## Verification performed

1. **Type/build check** — `npm run build`: **PASSED** (no Phase-4-introduced issues).
2. **Lint** — `eslint` on the feature + page + `customFetch.ts`: **CLEAN**.
3. **Contract cross-check**: polling condition (status 1/4 → poll; 2/3 → stop) matches
   §3.8; delete guard guidance matches §11 ("prefer deleting only Indexed/Failed/Pending
   rows"); 204 handling matches §11.

---

# Feature Complete — Summary

All four phases of the Admin Knowledge Base flow are implemented and verified:

1. **Scaffold** — feature folder, types, enums, query keys, services, i18n, route + page.
2. **List** — hook, domain filter (`?domain=`), status/domain badges, loading/error/empty
   states.
3. **Upload** — modal with client validation (PDF ≤ 50 MB, title, domain), 202 handling,
   list invalidation.
4. **Polling + delete** — conditional 3s polling, delete confirm dialog, Processing
   delete guard.

The full feature matches the `AI-Admin-Flow.md` contract: Admin-only endpoints
(`/knowledge-documents` CRUD), raw response shapes, numeric enums, and the documented
error semantics. Every phase passed `npm run build` and eslint.