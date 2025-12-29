# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based combat calculator for the board game *Eclipse: New Dawn for the Galaxy*. The application runs entirely in the browser with no build step required. It simulates ship battles using Monte Carlo methods (1000 iterations per calculation) to compute victory probabilities and ship survival rates.

**Key functionality:**
- Configure attacker and defender fleets with customizable ship attributes
- Calculate victory chances through combat simulation
- Display survival probabilities for ships in the winning fleet
- Save/load ship presets using browser cookies
- Mobile-optimized progressive web app

## Running the Application

```bash
# No build step required - just open in a browser
open index.html
```

For local development with a server:
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then navigate to `http://localhost:8000`

## Architecture

### File Structure
- `index.html` - Single-page application with embedded HTML structure
- `js/battlestats-compiled.js` - Combat simulation engine (~270 lines)
- `js/ui-compiled.js` - UI logic and ship management (~494 lines)
- `css/style.css` - Main styles
- `css/analyzer.css` - Combat analyzer specific styles
- `images/` - Game assets (ship icons, backgrounds, app icons)

### Core Components

**Combat Simulation (battlestats-compiled.js)**

The simulation engine implements Eclipse board game combat rules:
1. **Dice Rolling**: `g()` function creates dice objects with damage values (yellow=1, orange=2, blue=3, red=4)
2. **Hit Detection**: `h()` checks if dice hit based on: `value + computer - shields >= 6` or natural 6
3. **Combat Rounds**: `combatRound()` resolves missile phase (first round) then regular combat
4. **Hit Distribution**: `n()` prioritizes killing ships if possible, otherwise targets highest class ships
5. **Victory Calculation**: `calculate()` runs 1000 iterations and aggregates results

**Ship Model (combatant)**
Each ship has attributes:
- Weapons: `yellow`, `orange`, `blue`, `red` (dice counts), `missiles_yellow/orange/red` (missile counts)
- Defense: `shields`, `hull` (HP = hull + 1), `initiative`
- Modifiers: `computers` (hit bonus), `splitter` (converts red dice to 4 yellow), `missile_shield` (+2 shields vs missiles)

**UI Layer (ui-compiled.js)**
- `F()` - Ship object with data model (`D`) and UI elements (`F`)
- `Q()` - Preset manager loading from cookies
- Ship configuration through tap/click to cycle values (0 to max)
- Event delegation for all user interactions

### Important Implementation Details

**Hit Priority Algorithm**
The AI distributes hits using `targetPriority`: "Orbital Ancient GC Interceptor Starbase Cruiser Dreadnought Deathmoon"
- If total damage can kill a ship, it concentrates fire to eliminate it
- Otherwise hits go to highest priority (leftmost) target
- Starbase ranks higher than Dreadnought despite being weaker

**Dice Mechanics**
- Missiles fire only in first round and roll 2 dice each (e.g., 3 ion missiles = 6 yellow dice)
- Natural 6 always hits, natural 1 always misses
- Computer modules add to hit roll: `roll + computers - shields >= 6`
- Antimatter Splitter converts each red die roll into 4 yellow dice with same value

**Initiative System**
- Ships fire in initiative order (higher = earlier)
- Defender gets +0.1 initiative bonus for tie-breaking
- All ships in a group fire simultaneously before next initiative group

**Data Persistence**
Presets stored in browser cookies as JSON (`$.cookie("presets")`). Default presets hardcoded in `m` array (ui-compiled.js:28-109).

## External Dependencies

Loaded via CDN (no local copies):
- jQuery 2.1.0
- jquery-cookie 1.4.0
- Underscore.js 1.5.2

**Note**: Code is minified/compiled from original source. Variable names are obfuscated (single letters like `a`, `b`, `e`). Original source files are not available.

## Modifications from Original

This is a preserved copy from eclipse-calculator.com (2014), retrieved from Wayback Machine/S3 in 2025. See README.md for detailed provenance.

Changes made:
- Converted external image URLs to local paths
- Removed Wayback Machine artifacts
- Added git repository

No functional changes to combat logic or UI behavior.
