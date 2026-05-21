# Shared Agent Rules

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Context
This is the **Oggy Janata Party (OJP)** repository, a satirical Next.js 16 app.

## Development Mandates
- **Surgical Updates**: Maintain the structure of the `SoundEngine` and the game loop in `page.js`.
- **CSS Consistency**: Always use the established CSS variable system in `globals.css` (e.g., `--border-ink`, `--shadow-flat`).
- **Assets**: Prefer inline SVGs for UI components to maintain a lightweight, dependency-free codebase.
- **Verification**: Always run `npm run lint` after changes to ensure compatibility with Next.js 16's strict linting rules.
- **Tone**: Keep user-facing text satirical, humorous, and consistent with the *Oggy and the Cockroaches* universe.
