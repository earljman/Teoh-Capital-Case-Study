# Meridian WMS — Phase 1 Demo Prototype

Interactive hi-fi mocks for the Teoh Capital case study deck. Planning IA in `../1-planning/` supersedes the visual layout in `../1-planning/claude-design/` (tokens only).

## Stack

- **SvelteKit 2** + **Svelte 5** (runes)
- **TypeScript**
- **Netlify** adapter (`@sveltejs/adapter-netlify`)

## Screens

| Route | Deck | Persona |
|-------|------|---------|
| `/` | Slide 10 | Executive dashboard — Big Three + combined impact |
| `/supervisor` | Appendix | Supervisor console — action queue, floor ops, friction rail |
| `/compliance` | Slide 11 | Compliance review + ship block |
| `/pick` | Slide 12 | Picker Next Pick + exception reroute |
| `/pack` | Slide 13 | Pack station cartonization |

## Demo states

Append `?state=` to any route:

| State | Use |
|-------|-----|
| `happy` (default) | Nominal metrics and flows |
| `loading` | Skeleton / processing states |
| `gated` | Hygiene gate / feature blocked |
| `alert` | Ship blocks, action queue alerts, compliance red |

Example: `/compliance?state=alert` shows the Walmart PO-8842 ship block modal.

The sticky **dev nav** switches screens and states during build. Remove or hide before final deck screenshots if desired.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run check    # svelte-check
```

## Deploy (Netlify)

```bash
cd prototype
npx netlify deploy --build        # preview
npx netlify deploy --build --prod # production
```

Base directory for Netlify site settings: `prototype`.

## Data & telemetry

- Fixture data: `src/lib/data/`
- Cross-route telemetry (Week 12): `src/lib/telemetry.ts` — picker/pack actions update shared metrics

## Build order (from planning)

1. Executive dashboard ✓
2. Compliance → Pick → Pack ✓
3. Supervisor console ✓
4. Wire drill-down hotspots / screenshot pass
5. Week 12: live telemetry on executive dashboard, optional compliance AI function
