# Teoh Capital Case Study — AI-First WMS

Phase 1 scoping pack for an AI-first warehouse management system: slide deck, hi-fi demo prototype, and planning artifacts.

**Live site:** https://teoh-capital-wms.netlify.app  
Slides at `/` · Demo at `/demo`

## Structure

| Folder | Contents |
|--------|----------|
| `0-research/` | Market and ops research |
| `1-plan/` | IA, roadmap, feature specs |
| `2-build/demo/` | SvelteKit demo prototype |
| `3-present/` | Slide deck and presentation assets |

## Development

```bash
npm install
npm install --prefix 2-build/demo
npm run dev
```

Opens **http://localhost:8888** — slideshow with live reload, demo at `/demo` with Vite HMR.

## Build & deploy

```bash
npm run build
```

Output goes to `dist/` (slides + demo). Pushes to `main` deploy automatically via Netlify.
