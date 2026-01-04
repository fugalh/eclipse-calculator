# Plan: Add Graphical Icons to Eclipse Combat Calculator

**Goal**: Integrate PNG icons from the original design into the Next.js UI using a hybrid approach - original icons with modern/flat styling, responsive sizing (compact on mobile, larger on desktop).

## Summary of Changes

| Element           | Current               | After                                       |
| ----------------- | --------------------- | ------------------------------------------- |
| **Stats**         | Text (I, H, C, S, #)  | PNG icons as backgrounds with value overlay |
| **Cannons**       | Solid colored squares | Dice icons showing dots                     |
| **Missiles**      | "M" label on colors   | Missile/rocket icons                        |
| **Ship badges**   | Single letter (C, A)  | Ship silhouette icons                       |
| **Fleet headers** | Text only             | Attacker/Defender icons (desktop)           |

## Files to Modify

- `src/components/calculator/ship-configurator.tsx` - Main icon integration
- `src/components/calculator/fleet-builder.tsx` - Role icons in headers
- `src/components/calculator/preset-manager.tsx` - Ship icons in presets

## Files to Create

- `public/icons/game/` - Reorganized icon structure
- `src/lib/icons.ts` - Icon path constants
- `src/components/ui/game-icon.tsx` - Reusable icon component

---

## Implementation Steps

### Phase 1: Setup Icon Assets

1. Create directory structure:

   ```
   public/icons/game/
   ├── dice/       (yellow.png, orange.png, blue.png, red.png)
   ├── missiles/   (yellow.png, orange.png, blue.png, red.png)
   ├── stats/      (hull.png, initiative.png, number.png)
   ├── ships/      (cruiser.png, interceptor.png, dreadnought.png, etc.)
   └── roles/      (attacker.png, defender.png)
   ```

2. Copy icons from `images/icons/` to new structure, renaming missiles:
   - `missiles_yellow.png` → `missiles/yellow.png`

### Phase 2: Create Icon Infrastructure

3. Create `src/lib/icons.ts`:

   ```typescript
   export const GAME_ICONS = {
     dice: { yellow: "/icons/game/dice/yellow.png", ... },
     missiles: { yellow: "/icons/game/missiles/yellow.png", ... },
     stats: { hull: "/icons/game/stats/hull.png", initiative: "...", number: "..." },
     ships: { Cruiser: "/icons/game/ships/cruiser.png", ... },
     roles: { attacker: "/icons/game/roles/attacker.png", ... },
   } as const;
   ```

4. Create `src/components/ui/game-icon.tsx`:
   - Use Next.js `Image` component for optimization
   - Support sizes: sm (20px), md (24px), lg (32px)
   - Fallback to text when icon is missing

### Phase 3: Update Ship Configurator

5. Modify `AttributeButton` in `ship-configurator.tsx`:
   - Add `icon` and `iconFallback` props
   - Use absolute positioning for icon as background layer
   - Add responsive sizing: `min-w-[40px] h-[44px] md:min-w-[52px] md:h-[56px]`
   - Add text shadow to values for readability over icons

6. Pass icons to each button type:

   ```typescript
   <AttributeButton
     name="hull"
     value={ship.hull}
     onClick={() => handleAttributeClick("hull")}
     icon={GAME_ICONS.stats.hull}
     iconFallback="H"
   />
   ```

7. Update ship card header badge to show ship class icon instead of letter

### Phase 4: Update Fleet Headers

8. In `fleet-builder.tsx`, add role icons next to "Attacker"/"Defender" labels
   - Desktop only (`hidden md:block`)

### Phase 5: Update Preset Manager

9. In `preset-manager.tsx`, show ship class icons in preset list items

### Phase 6: Polish

10. Run `bun check` to fix any TypeScript issues
11. Run `bun format` for consistency
12. Test on mobile viewport and desktop

---

## Styling Details

### Icon Overlay Pattern

Icons render at reduced opacity (50-60%) as background, with bold value text overlaid using `drop-shadow` for contrast.

### Stat Button Colors (from original)

```typescript
const STAT_COLORS = {
  initiative: "bg-gradient-to-b from-[#a7a7a7] to-[#737373] border-[#3a3a3a]",
  hull: "bg-gradient-to-b from-[#a7a7a7] to-[#737373] border-[#3a3a3a]",
  computers: "bg-gradient-to-b from-[#f0f0f0] to-[#cccccc] border-[#8b8b8b]",
  shields:
    "bg-gradient-to-b from-[#252525] to-[#111111] border-black text-white",
  number: "bg-gradient-to-b from-[#d4d4d4] to-[#8b8b8b] border-[#2e2e2e]",
};
```

### Responsive Breakpoints

- Mobile (<768px): 40x44px buttons, icons at 50% opacity
- Desktop (>=768px): 52x56px buttons, icons at 60% opacity

---

## Notes

- **Missing icons**: `computers.png` and `shields.png` don't exist in original assets - will use text fallback (+C, -S) or Lucide icons
- **Dark mode**: PNG icons have transparency; may need filter adjustments for dark backgrounds
- Tap-to-cycle functionality preserved - no changes to click handlers
