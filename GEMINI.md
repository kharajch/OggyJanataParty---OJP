# GEMINI.md - Oggy Janata Party (OJP)

## Project Overview
**Oggy Janata Party (OJP)** is a satirical, digital-first fan application built as a response to the "Cockroach Janata Party (CJP)" meme trend. It is a visually rich, interactive Next.js application designed to celebrate the classic *Oggy and the Cockroaches* cartoon.

The project serves as a "political front" for cat guardians, featuring:
- **Extermination Zone:** A mini-game where users can swat cockroaches (Joey, Dee Dee, Marky) to earn points.
- **Flyswatter License Registry:** A tool for users to generate and download a personalized OJP membership ID card.
- **Interactive Vision/Manifesto:** Satirical policy points and a "live poll" showing OJP vs. CJP standings.
- **Sound Engine:** A custom Web Audio API implementation for cartoon-style sound effects.

### Main Technologies
- **Framework:** Next.js 15+ (App Router)
- **Library:** React 19
- **Styling:** Vanilla CSS (with CSS Variables and cartoon-inspired aesthetics)
- **Icons/Visuals:** Inline SVG components and local images.
- **Audio:** Custom Web Audio API `SoundEngine`.

## Building and Running
The project uses standard `npm` scripts for development and deployment.

- **Development Server:** `npm run dev` (Runs on `http://localhost:3000`)
- **Build Project:** `npm run build`
- **Production Start:** `npm run start`
- **Linting:** `npm run lint`

## Architecture and Design
The application is a single-page interactive experience (`src/app/page.js`) with a focus on "cartoon-core" aesthetics.

- **Aesthetics:** Uses `Fredoka`, `Outfit`, and `JetBrains Mono` fonts for a playful yet technical feel.
- **Global Styles:** Defined in `src/app/globals.css`, utilizing a "flat" design with heavy borders (`--border-ink`) and offset shadows (`--shadow-flat`).
- **Interactive Logic:**
  - **Game Loop:** Managed via `useEffect` and `requestAnimationFrame` (or `setInterval` in current implementation) for cockroach movement.
  - **State Management:** Uses React `useState` and `useRef` for game score, cockroach positions, and form data.
  - **ID Generation:** Uses a hidden HTML5 Canvas to composite the user's name and rank into a downloadable PNG.

## Development Conventions
- **Surgical Updates:** When modifying `page.js`, maintain the structure of the `SoundEngine` and the game loop.
- **Styling:** Stick to the established CSS variable system in `globals.css` to maintain visual consistency.
- **Assets:** Prefer inline SVGs for icons to keep the project lightweight and dependency-free.
- **Tone:** Maintain a professional, senior software engineering standard for code, but embrace the satirical, "cartoonish" tone for user-facing text.

## Key Files
- `src/app/page.js`: The main entry point containing all interactive logic and UI sections.
- `src/app/globals.css`: Core design system and cartoon-inspired component styles.
- `src/app/layout.js`: Metadata and font configuration.
- `package.json`: Dependency list and scripts.

---
*This file is foundational for Gemini CLI interactions within this repository. Always adhere to these standards.*
