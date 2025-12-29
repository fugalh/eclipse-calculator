# Eclipse Combat Calculator

A web application for calculating combat outcomes in the board game *Eclipse: Second Dawn for the Galaxy*.

## Provenance

This application was originally hosted at `eclipse-calculator.com` and created in 2014. When the original website was abandoned, the files were preserved on Amazon S3 at `https://s3.amazonaws.com/eclipse-calculator/`.

The current version was retrieved from the Wayback Machine archive on December 29, 2025, and downloaded from the S3 bucket for local hosting and modification.

### Original Copyright

© 2014 Eclipse-Calculator.com

## What This App Does

The Eclipse Combat Calculator allows *Eclipse: Second Dawn for the Galaxy* players to:

- Calculate victory chances in ship battles
- Simulate combat between attacker and defender forces
- See survival chances for ships in the event of victory
- Save ship configurations as presets for quick access
- Optimize for mobile/smartphone use with progressive web app features

## Modifications

### Initial Setup (2025-12-29)

**Downloaded all assets from S3:**
- HTML, CSS, and JavaScript files
- All image assets (icons, backgrounds, app icons)
- Total of 31 files

**Updated HTML:**
- Changed app icon references from `web.archive.org` URLs to local paths
- Removed Wayback Machine archive comments

**Downloaded dependencies locally (2025-12-29):**
- jQuery 2.1.0, jquery-cookie 1.4.0, and Underscore.js 1.5.2
- Saved to `js/vendor/` directory
- Updated script tags in `index.html` to reference local files

**Current state:**
- Fully functional local copy with no external dependencies
- All assets and libraries stored locally
- No functional changes to the application logic

### Second Dawn Compatibility Update (2025-12-29)

**Updated combat mechanics for Second Dawn rules:**
- Changed missiles from 2 dice per module to 1 die per missile (matching cannon behavior)
- Added blue missiles support (all 4 colors now available: yellow, orange, blue, red)
- Downloaded `missiles_blue.png` icon from S3
- Updated missile damage values to match cannons (yellow=1, orange=2, blue=3, red=4)

**UI improvements:**
- Reorganized ship attributes into three logical rows:
  - Row 1: Initiative, Hull, Computers, Shields, Number
  - Row 2: Missiles (all 4 colors)
  - Row 3: Cannons (all 4 colors)
- Updated legend to be less redundant and reflect new missile mechanics
- Added CSS styling for blue missiles

**Files modified:**
- `js/battlestats.js` - Core combat simulation engine
- `js/ui.js` - Ship configuration UI
- `css/analyzer.css` - Styling for missile icons and layout
- `index.html` - Updated legend and game reference
- `images/icons/missiles_blue.png` - Added icon

## File Structure

```
├── css/
│   ├── analyzer.css
│   └── style.css
├── images/
│   ├── appicons/      # iOS and Android app icons
│   ├── icons/         # Game ship and component icons
│   └── *.png          # Background textures
├── js/
│   ├── vendor/        # Third-party libraries
│   │   ├── jquery-2.1.0.min.js
│   │   ├── jquery.cookie-1.4.0.js
│   │   └── underscore-1.5.2.min.js
│   ├── battlestats.js
│   └── ui.js
└── index.html
```

## Dependencies

The following third-party libraries are included locally in `js/vendor/`:
- jQuery 2.1.0 - DOM manipulation and utilities
- jquery-cookie 1.4.0 - Cookie management for presets
- Underscore.js 1.5.2 - Functional programming utilities

## Usage

Simply open `index.html` in a web browser. The app is optimized for mobile devices but works on desktop as well.

For the best mobile experience, add the app to your device's home screen.

## Future Modifications

Potential improvements to consider:
- Modernize codebase (unminify, convert to ES6+)
- Add TypeScript type definitions
- Update to modern build tooling
- Enhance UI/UX for modern mobile devices
