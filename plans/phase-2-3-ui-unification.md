# Unify Phase 2 (Reference) and Phase 3 (Search) UI Patterns

## Summary

Convert all Reference pages from local `useState()` to URL-based state management using existing Phase 3 filter infrastructure. This enables shareable filter links, browser back/forward support, and consistent UI patterns.

## Key Changes

1. **Replace duplicate `SearchFilter`** with shared `SearchInput` (has debounce, clear button, keyboard support)
2. **Replace domain-specific filters** (`TechCategoryFilter`, `PartTypeFilter`, `PartSourceFilter`) with generic `SingleToggleFilter`
3. **Convert all filter state to URL params** via `useSearchParams()` + `router.push()`
4. **Add `ActiveFilters` display** for pages with multiple filter types
5. **Delete deprecated `category-filter.tsx`** after migration

---

## URL Parameter Schema

| Page                     | Parameters                    | Example                                  |
| ------------------------ | ----------------------------- | ---------------------------------------- |
| `/reference/techs`       | `q`, `category`, `view`       | `?q=plasma&category=military&view=table` |
| `/reference/ship-parts`  | `q`, `type`, `source`, `view` | `?type=cannon&source=technology`         |
| `/reference/species`     | `q`, `compare`                | `?compare=terran,hydran,planta`          |
| `/reference/combat`      | `q`, `view`                   | `?view=quick&q=retreat`                  |
| `/reference/differences` | `q`, `view`                   | `?view=table&q=guardian`                 |

**Convention**: `null` (parameter absent) = "All" selected

---

## Implementation Steps

### Step 1: Create Shared Filter Option Builders

**New file**: `src/lib/filters/reference-options.ts`

```typescript
// Converts domain data to FilterOption[] for shared filter components
export function getTechCategoryOptions(counts?): FilterOption<TechCategory>[];
export function getPartTypeOptions(counts?): FilterOption<PartSlotType>[];
export function getPartSourceOptions(counts?): FilterOption<PartSource>[];

// Label/color maps for ActiveFilters display
export const TECH_CATEGORY_LABELS: Record<string, string>;
export const TECH_CATEGORY_BADGE_COLORS: Record<string, string>;
export const PART_TYPE_LABELS: Record<string, string>;
export const PART_SOURCE_LABELS: Record<string, string>;
```

**Update**: `src/lib/filters/index.ts` - add barrel export

---

### Step 2: Extend `SingleToggleFilter` with "All" Option

**File**: `src/components/filters/multi-toggle-filter.tsx`

Add optional props to `SingleToggleFilter`:

- `includeAllOption?: boolean`
- `allLabel?: string` (default: "All")
- `allCount?: number`

When enabled, prepends an "All" button that sets `selected` to `null`.

---

### Step 3: Update `/reference/techs/page.tsx`

**Changes**:

- Import `SearchInput`, `SingleToggleFilter`, `ActiveFilters` from `@/components/filters`
- Import `getTechCategoryOptions`, label/color maps from `@/lib/filters/reference-options`
- Replace `useState` with `useSearchParams()` + `useRouter()`
- Wrap content in `Suspense` with skeleton fallback
- Add `ActiveFilters` showing current query + category

**URL params**: `q` (search), `category` (single), `view` (grid|table)

---

### Step 4: Update `/reference/ship-parts/page.tsx`

**Changes**:

- Same pattern as techs page
- Two filter rows: Type + Source (both use `SingleToggleFilter`)
- `ActiveFilters` shows query + type + source

**URL params**: `q`, `type`, `source`, `view`

---

### Step 5: Update `/reference/species/page.tsx`

**Changes**:

- Replace `SearchFilter` with `SearchInput`
- Convert `selectedIds` state to URL array param `compare`
- Use `serializeArray`/`deserializeArray` from url-helpers
- Wrap in `Suspense`

**URL params**: `q`, `compare` (comma-separated IDs)

**Benefit**: Shareable comparison links!

---

### Step 6: Update `/reference/combat/page.tsx`

**Changes**:

- Replace `SearchFilter` with `SearchInput`
- Convert view mode toggle to URL param
- Wrap in `Suspense`

**URL params**: `q`, `view` (full|quick)

---

### Step 7: Update `/reference/differences/page.tsx`

**Changes**:

- Replace `SearchFilter` with `SearchInput`
- Convert view mode toggle to URL param
- Wrap in `Suspense`

**URL params**: `q`, `view` (sections|table)

---

### Step 8: Cleanup

**Delete**: `src/components/reference/category-filter.tsx`

**Update** `src/components/reference/index.ts`:

```diff
- export { TechCategoryFilter, PartTypeFilter, PartSourceFilter, SearchFilter } from "./category-filter";
```

---

## Files to Modify

| File                                             | Action                                         |
| ------------------------------------------------ | ---------------------------------------------- |
| `src/lib/filters/reference-options.ts`           | Create                                         |
| `src/lib/filters/index.ts`                       | Update exports                                 |
| `src/components/filters/multi-toggle-filter.tsx` | Add `includeAllOption` to `SingleToggleFilter` |
| `src/app/reference/techs/page.tsx`               | Refactor to URL state                          |
| `src/app/reference/ship-parts/page.tsx`          | Refactor to URL state                          |
| `src/app/reference/species/page.tsx`             | Refactor to URL state                          |
| `src/app/reference/combat/page.tsx`              | Refactor to URL state                          |
| `src/app/reference/differences/page.tsx`         | Refactor to URL state                          |
| `src/components/reference/category-filter.tsx`   | Delete                                         |
| `src/components/reference/index.ts`              | Remove deleted exports                         |

---

## Pattern Reference

Follow the existing Search page pattern (`src/app/search/page.tsx`):

```tsx
function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL state
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") as Category | null;

  // URL update helper
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        value ? params.set(key, value) : params.delete(key);
      }
      router.push(params.toString() ? `?${params}` : pathname);
    },
    [router, searchParams],
  );

  // ... handlers call updateUrl({ key: value })
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <PageContent />
    </Suspense>
  );
}
```

---

## Testing Checklist

- [ ] All Reference pages load without errors
- [ ] URL params persist on page refresh
- [ ] Browser back/forward works correctly
- [ ] "All" button clears category filter (sets param to null)
- [ ] Species compare links are shareable
- [x] `bun check` passes
- [x] `bun format` applied

---

## Completion Summary

**Completed: 2025-12-30**

All tasks completed successfully:

1. Created `src/lib/filters/reference-options.ts` with FilterOption builders for tech categories, part types, and part sources
2. Extended `SingleToggleFilter` with `includeAllOption`, `allLabel`, and `allCount` props
3. Refactored all 5 Reference pages to use URL-based state:
   - `/reference/techs` - category, search, view mode in URL
   - `/reference/ship-parts` - type, source, search, view mode in URL
   - `/reference/species` - search, compare selections in URL (shareable comparison links!)
   - `/reference/combat` - search, view mode in URL
   - `/reference/differences` - search, view mode in URL
4. Replaced duplicate `SearchFilter` with shared `SearchInput` (with debounce, clear button, keyboard support)
5. Added `ActiveFilters` display to techs and ship-parts pages
6. Added Suspense boundaries with skeleton loading states to all pages
7. Deleted deprecated `category-filter.tsx`
8. Added `skeleton.tsx` UI component (was missing)
9. All checks pass (`bun check` and `bun format`)
