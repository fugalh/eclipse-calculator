# Plan: Mobile-Responsive Species Comparison

## Problem Summary

The `SpeciesCompare` dialog in `src/components/reference/species-compare.tsx` has two mobile issues:

1. **Portrait**: Table columns too wide, horizontal scrolling required but attribute column not sticky
2. **Landscape**: Dialog is too narrow, not utilizing available horizontal space

## Root Causes

1. Dialog uses `max-w-4xl` override but the base `DialogContent` defaults to `sm:max-w-sm` which kicks in at 640px width
2. Table uses `min-w-[600px]` forcing scroll on narrow screens
3. No landscape-specific styling to expand dialog width
4. No sticky positioning on first column for context while scrolling

## Solution

### Approach: Responsive Dialog + Sticky Column

Rather than switching to a completely different layout (cards) for mobile, improve the existing table pattern:

1. **Expand dialog on landscape mobile** - Use Tailwind's `landscape:` modifier
2. **Make attribute column sticky** - Keep first column visible while scrolling
3. **Optimize column widths** - Make cells more compact on mobile
4. **Improve dialog footer** - Use `DialogFooter` with built-in close button

### Implementation Steps

#### 1. Update DialogContent classes in `species-compare.tsx`

Current:

```tsx
<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
```

Change to:

```tsx
<DialogContent className="max-h-[90vh] max-w-[calc(100%-1rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl overflow-y-auto landscape:max-w-[calc(100%-1rem)]">
```

This provides:

- Mobile portrait: Full width minus small margin
- Mobile landscape: Full width minus small margin (via `landscape:`)
- sm (640px+): 42rem max
- md (768px+): 48rem max
- lg (1024px+): 56rem max (original)

#### 2. Make attribute column sticky

Wrap table in a relative container and add sticky positioning to first column cells:

```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[500px]">
    <thead>
      <tr className="border-b">
        <th className="sticky left-0 bg-background p-2 text-left font-medium z-10">
          Attribute
        </th>
        ...
      </tr>
    </thead>
    <tbody>{/* Each first <td> gets sticky left-0 bg-background */}</tbody>
  </table>
</div>
```

#### 3. Reduce minimum table width

Change from `min-w-[600px]` to `min-w-[400px]` or make it dynamic based on species count.

#### 4. Compact cell padding on mobile

Add responsive padding: `p-1.5 sm:p-2`

#### 5. Use DialogFooter component

Replace custom footer with:

```tsx
<DialogFooter showCloseButton />
```

This removes the manual close button and uses the built-in pattern.

### Files to Modify

1. `src/components/reference/species-compare.tsx` - Main changes

### Testing Checklist

- [ ] Portrait mobile: Dialog fills width, attribute column stays visible on scroll
- [ ] Landscape mobile: Dialog expands to use available width
- [ ] Tablet: Table displays properly with good proportions
- [ ] Desktop: Original experience preserved (max-w-4xl at lg breakpoint)
- [ ] Scrolling works smoothly on touch devices

---

## Completion Summary (2025-12-30)

All implementation steps completed successfully:

1. Updated `DialogContent` with responsive breakpoints and `landscape:` modifier
2. Made all first-column cells (`th` and `td`) sticky with `sticky left-0 z-10 bg-background`
3. Reduced minimum table width from `600px` to `400px`
4. Added responsive padding `p-1.5 sm:p-2` to all table cells
5. Replaced custom footer with `<DialogFooter showCloseButton />`
6. Removed unused `Button` import

`bun check` and `bun format` passed with no errors.
