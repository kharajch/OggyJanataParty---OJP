# Oggy Janata Party (OJP) - Project Guide

Satirical fan application and "political front" for cat guardians, built with Next.js 16 (Alpha) and React 19.

## Build & Scripts
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Start**: `npm run start`

## Architecture & Conventions
- **Framework**: Next.js 16 (App Router). Note: APIs may differ from standard Next.js 13/14/15.
- **Styling**: Vanilla CSS in `src/app/globals.css`. Uses a "cartoon-core" aesthetic with heavy borders and offset shadows.
- **Interactive Logic**: Centralized in `src/app/page.js`. Includes a custom `SoundEngine` (Web Audio API) and a game loop.
- **ID Generation**: Uses HTML5 Canvas for generating downloadable PNG licenses.
- **Tone**: Professional senior engineering standard for code; satirical and "cartoonish" for content.

## Key Files
- `src/app/page.js`: Main UI and interactive logic.
- `src/app/globals.css`: Core design system.
- `src/app/layout.js`: Metadata and font loading.

---
See @AGENTS.md for specific cross-agent rules and Next.js 16 warnings.
