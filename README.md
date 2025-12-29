# Eclipse Combat Calculator

A web application for calculating combat outcomes in the board game *Eclipse: New Dawn for the Galaxy*.

## Provenance

This application was originally hosted at `eclipse-calculator.com` and created in 2014. When the original website was abandoned, the files were preserved on Amazon S3 at `https://s3.amazonaws.com/eclipse-calculator/`.

The current version was retrieved from the Wayback Machine archive on December 29, 2025, and downloaded from the S3 bucket for local hosting and modification.

### Original Copyright

© 2014 Eclipse-Calculator.com

## What This App Does

The Eclipse Combat Calculator allows *Eclipse: New Dawn for the Galaxy* players to:

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

**Current state:**
- Fully functional local copy
- External dependencies (jQuery, Underscore.js) still loaded from CDNs
- No functional changes to the application logic

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
│   ├── battlestats.js
│   └── ui.js
└── index.html
```

## External Dependencies

The following libraries are loaded from CDNs:
- jQuery 2.1.0
- jquery-cookie 1.4.0
- Underscore.js 1.5.2

## Usage

Simply open `index.html` in a web browser. The app is optimized for mobile devices but works on desktop as well.

For the best mobile experience, add the app to your device's home screen.

## Future Modifications

This section will be updated as changes are made to the application.
