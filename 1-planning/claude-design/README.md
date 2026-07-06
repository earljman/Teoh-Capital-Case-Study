# Handoff: Meridian WMS — AI-First Operations Dashboard

## Overview
A single-screen, real-time operations dashboard for a mid-market Warehouse Management System (WMS). It surfaces the financial "margin-killer" metrics an executive cares about, the live floor-exception and flow-control signals a supervisor needs, and the AI-engine telemetry that builds trust in the automation. One screen serves all three personas via role tabs that dim the modules irrelevant to the selected role.

The dense **ops-console** visual direction was chosen (light theme, monospace numerals, 1px hairline grid, dark feed panels for the two live logs).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that demonstrate the intended look, layout, data, and live behavior. **They are not production code to copy directly.** They are built as "Design Components" (a custom `.dc.html` format backed by `support.js`) and rely on a bespoke runtime; do not try to ship that runtime.

Your task is to **recreate these designs in the target codebase's existing environment** (React, Vue, Svelte, etc.), using its established component library, styling approach, and data-fetching patterns. If no frontend environment exists yet, choose the most appropriate modern framework (React + TypeScript is a safe default) and implement there. Wire the widgets to real WMS/telemetry data sources in place of the simulated values.

Open either `.dc.html` file directly in a browser to see the design running live.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final and intended to be matched precisely. Recreate the UI pixel-accurately, then swap the simulated data loop for real feeds.

## Design canvas
- Designed at **1512 × 860** (desktop control-room / large monitor). Layout is a full-viewport flex column; it should stretch to fill the available height.
- The `WMS Dashboard Options.dc.html` file additionally contains the two visual directions that were **not** chosen (1a Clean SaaS, 1c Industrial) for reference only. **Implement `Meridian WMS Dashboard.dc.html`** — that is the locked direction.

---

## Screen: Operations Dashboard

### Layout (top → bottom, full-height flex column)
1. **Header bar** — 50px tall, `#f7f8f6` bg, 1px `#cfd3d0` bottom border. Left: logo mark + wordmark + facility badge. Center: role-tab segmented control. Right: feed-status dot + latency, scanner count, live clock.
2. **KPI strip** — 6 equal columns, separated by 1px `#cfd3d0` gaps (achieved with a grid on a `#cfd3d0` background, cells `#f7f8f6`). Fixed height (content-driven, ~64px).
3. **Main grid** — `flex:1`, three columns `1.15fr 1.35fr 1.05fr`, 1px gaps.
   - **Col 1:** Compliance / fine-predictor board (top), Dock-to-stock clock + phantom-inventory summary (fills remaining height).
   - **Col 2:** Aisle congestion heatmap (top), Outbound optimization telemetry (middle, fills), Friction-watch monitors (bottom).
   - **Col 3:** two stacked **dark** (`#141917`) panels of equal height — "Happy path" exception log (top), AI agent log (bottom).
4. **Status footer** — 7px vertical padding, `#f7f8f6`, 1px top border, engine version + active-view label + uptime.

### Components

#### Header
- Logo: 15×15 `#1f7a4d` square, no radius.
- Wordmark: `MERIDIAN` in `#171a18` + `/OPS` in `#5b615c`, IBM Plex Mono 600 13px, letter-spacing .04em.
- Facility badge: `DC-04.RENO · SHIFT-1`, IBM Plex Mono 500 10px, `#5b615c`, 1px `#dfe2df` border, 3px radius, 3px/7px padding.
- Feed status: 6px green (`#1f7a4d`) dot with `pulse` animation + `FEED OK · {latency}ms`.
- Clock: IBM Plex Mono 600 14px, `tabular-nums`, updates every second (24h `HH:MM:SS`).

#### Role tabs (segmented control)
- Container: white bg, 1px `#cfd3d0` border, 4px radius, overflow hidden. Each tab has a 1px `#cfd3d0` right border.
- Tab (idle): IBM Plex Mono 500 10.5px, letter-spacing .06em, `#5b615c`, padding 6px/15px, cursor pointer.
- Tab (active): bg `#1f2b24`, text `#e8f3ec`, weight 600.
- Tabs: `ALL`, `EXEC`, `SUPV`, `SYS`.
- **Behavior:** selecting a role sets `opacity` of non-relevant modules to `0.28` (transition `.3s`). Relevance map:
  - `watch` (KPI strip, compliance board) → relevant to **EXEC**
  - `flow` (dock-to-stock, heatmap, outbound telemetry) → relevant to **SUPV**
  - `frict` (friction monitors, exception log) → relevant to **SUPV, SYS**
  - `ai` (agent log) → relevant to **SYS, EXEC**
  - `ALL` → everything at full opacity.
- Footer view label updates: `ALL-ROLE / EXECUTIVE / SUPERVISOR / SYSTEMS`.

#### KPI strip cells (6)
Each: label (IBM Plex Sans 600 9px, uppercase, letter-spacing .1em, `#7c837d`) + big value (IBM Plex Mono 500 23px, letter-spacing -.01em) + sub-note (IBM Plex Mono 400 10px, `#7c837d`).
1. **Labor saved · today** — value `#1f7a4d`, tabular-nums, live-incrementing USD (e.g. `$4,213.18`); note "travel −26% vs baseline".
2. **Picks / hr / worker** — live value ~112–121; mini progress bar (`#e4e7e4` track, `#1f7a4d` fill at `value/130`) + `72→120` caption.
3. **Chargeback exposure** — `#b3352b`, static `$12,840`; note "2 dispatches flagged".
4. **Air shipped · today** — `#a06e08`, live `$~318`; note "fill 87% · tgt 92%".
5. **Dock-to-stock worst** — `#b3352b`, `26.4h`; note "PO-88213 · limit 24h".
6. **Offline sync queue** — live integer ~41–140; note (amber `#a06e08`) "3 scanners offline".

#### Compliance / fine-predictor board (Col 1 top)
- Header: title "B2B compliance · fine predictor" + right meta `2 FLAGS · $12,840` (`#b3352b`).
- Rows (4), each: 3px-wide colored status bar (26px tall) | vendor name (Plex Sans 600 11.5px) + program (Plex Mono 400 9px `#7c837d`) | due window (Plex Mono 400 10px `#5b615c`) | status pill | risk $ (Plex Mono 600 11px, colored). 1px `#e4e7e4` row separators.
- Status pill: 8.5px Plex Mono 600, letter-spacing .04em, 2.5px/7px padding, 3px radius, colored text on tinted bg.
- Data:
  - Walmart · OTIF · DSP-2214 · today 14:30 · **AT RISK** · $8,400 · red `#b3352b` / bg `rgba(179,53,43,.09)`
  - Target · SQEP · DSP-2209 · today 11:00 · **WATCH** · $4,440 · amber `#a06e08` / bg `rgba(160,110,8,.1)`
  - Home Depot · Routing v3.2 · DSP-2217 · tomorrow 09:00 · **CLEAR** · — · green `#1f7a4d`
  - Lowe's · Label 2.1 · DSP-2220 · Thu 13:00 · **CLEAR** · — · green
- Footer row: `> DSP-2214 pallet cfg × WMT-OTIF cutoff 14:30` + a `RESEQUENCE →` button (green outline `#b9d6c5`, bg `#eaf4ee`, text `#1f7a4d`).

#### Dock-to-stock clock (Col 1 bottom)
- Header: title + `FLAG > 24H · PHANTOM-OOS GUARD`.
- Rows (4): PO label (Plex Mono 400 10.5px, 158px wide) | progress bar (9px, `#e4e7e4` track, colored fill at `pct`) | hours (Plex Mono 600 11px, colored). Optional red note line beneath (indented 166px).
  - PO-88213 · Hasbro — 26.4h — 100% — red — note "⚑ phantom-OOS risk on 3 SKUs"
  - PO-88219 · Spin Master — 18.2h — 76% — amber
  - PO-88224 · Mattel — 9.6h — 40% — green
  - PO-88227 · LEGO — 2.1h — 9% — green
- Footer: two stats — "Phantom inventory rate" `0.83% · 41 SKU RISK` (risk in red) and "Trend · 30d" `↓ 37%` (green).
- Color thresholds: green `#1f7a4d` < ~50%, amber `#a06e08` mid, red `#b3352b` at/over 24h.

#### Aisle congestion heatmap (Col 2 top)
- Header: title "Aisle congestion · live pickers/zone" + `ZONE D–E HOT · 3 REROUTED` (amber).
- Grid: **18 columns × 7 rows** of cells, 15px tall, 2px radius, 3px gap.
- Cell color: interpolate toward hot on a per-cell intensity `v ∈ [0,1]`: `rgba(160+v*40, 160−v*130, 120−v*100, 0.12 + v*0.85)` — i.e. cool translucent green-grey → opaque orange-red.
- Intensity field: sum of Gaussian hotspots at grid coords (4,3), (9,2), (11,5) with a slow per-hotspot sine shimmer (see `heat()` in the source). Multiply by a `heatIntensity` factor (default 1).
- Axis labels beneath: `AISLE A` / `AISLE G` / `AISLE N`.

#### Outbound optimization telemetry (Col 2 middle)
- Title, then 4 stat blocks (each 2px left accent border, Plex Mono 500 21px value + uppercase Plex Sans 9px label):
  - `14` active batches · `23` affinity clusters · `{walk}km` walk saved today (green, live ~41.2↑) · `1,204` cartons packed.
- Two labeled bar rows beneath (label 120px + track + value):
  - CARTONIZATION FILL — 92% green fill, plus a 2px `#171a18` target tick at 92%.
  - PATHING INDEX — 87% green fill, value `0.87`, caption `61.3/53.4 km`.

#### Friction watch (Col 2 bottom)
- Title "Friction watch · floor reality vs software".
- 4 bordered white mini-cards (1px `#e4e7e4`): label (Plex Sans 8.5px uppercase) + value (Plex Mono 600 17px) + note (Plex Mono 9px).
  - force-confirms `4.1%` red · "tgt<2% · P4=11%"
  - wifi AP-07 `9%` amber · "loss · zone C"
  - sku data gaps `62` amber · "dims/wt missing"
  - weight gaps `18` amber · "blocks carton math"

#### Exception log (Col 3 top — dark)
- Panel bg `#141917`. Header: title (Plex Sans 600 10px uppercase, letter-spacing .1em, `#8fa396`) + `STREAMING` + pulsing red (`#e05c4f`) dot.
- Rows: timestamp (Plex Mono 9.5px `#6b7a70`) | tag (34px wide, Plex Mono 600 9.5px, colored) | message (Plex Mono 10.5px `#d7ded9`). 1px `rgba(255,255,255,.06)` separators. New rows animate in via `rowin` keyframe (fade + 4px slide down, .3s).
- Tag colors: `BIN`/`PICK` red `#e05c4f`, `SCAN` amber `#e0a13a`.
- Feed prepends a new random entry every ~5s, capped at 7 rows.

#### AI agent log (Col 3 bottom — dark)
- Same dark styling. Header: title "AI agent log · phase-1" + `GUIDE-PARSER · BATCH-OPT · CARTON-3D`.
- Rows: timestamp (`HH:MM`) | kind (44px, Plex Mono 600 9.5px, green `#7ec49a`) | message (Plex Mono 10.5px `#d7ded9`, line-height 1.5).
- Kinds: `PARSE`, `RULE`, `SLOT`, `MODEL`, `PATH`, `CARTON`. Example seed row: "Parsed 'Home Depot Routing Guide v3.2' → pallet height ≤ 48in set as hard constraint".
- Footer pinned to bottom: "PATHING OPT INDEX · TODAY" + `61.3/53.4km` + `0.87` (green, 17px).
- Feed prepends a new random entry every ~9s, capped at 5 rows.

---

## Interactions & Behavior
- **Role tabs:** click → set active role → dim non-relevant module groups to opacity 0.28 (CSS transition 0.3s) → update footer label. No routing/navigation; pure in-place emphasis.
- **RESEQUENCE button:** styled affordance only in the mock; wire to the dispatch-resequencing action.
- **Live simulation loop (replace with real data):** a `setInterval` at 1000ms updates, each tick:
  - clock → current time; labor += ~0.31–0.56; picks random-walk clamped 112–121; air random-walk 280–360; syncPkgs random-walk 41–140; walk += ~0.005–0.01; latency 28–74; scannersOnline 43–48 (occasional ±1).
  - every 5th tick: prepend a random exception (cap 7). Every 9th tick: prepend a random agent entry (cap 5).
  - Gated by a `liveMotion` flag (pause switch). Heatmap shimmer is driven by an incrementing `phase` counter.
- **Animations:** `pulse` (opacity 1→.2→1, 1.6–1.8s ease-in-out infinite) on live status dots; `rowin` on newly inserted log rows.

## State Management
State variables (in the prototype, `React`-class state — map to your store/signals):
- `role` — 'all' | 'exec' | 'sup' | 'sys'
- `clock`, `latency`, `scannersOnline`
- `labor`, `picks`, `air`, `syncPkgs`, `walk` — live numeric metrics
- `phase` — animation/tick counter
- `exceptions[]` — `{t, tag, msg, c}`, newest first, max 7
- `agent[]` — `{t, k, msg, c}`, newest first, max 5
- Static datasets: `compliance[]`, `docks[]`.

In production these become: a websocket/polling subscription for live metrics + logs, a query for the compliance board and dock queue, and a client-only `role` UI state. Two config knobs exist as component props: `liveMotion` (boolean, default true) and `heatIntensity` (0.2–1.6, default 1).

## Design Tokens
**Colors**
- Surface base `#eef0ee`; panel/light surface `#f7f8f6`; page/outer `#e7eae7`
- Hairline / grid gaps `#cfd3d0`; inner separators `#e4e7e4`; badge border `#dfe2df`
- Text primary `#171a18`; secondary `#39413b`; muted `#5b615c`; faint label `#7c837d`
- Green (positive / brand) `#1f7a4d`; deep-green active tab bg `#1f2b24`, tab text `#e8f3ec`
- Red (critical) `#b3352b`; amber (warning) `#a06e08`
- Dark panel bg `#141917`; dark panel muted `#6b7a70`; dark panel heading `#8fa396`; dark panel body `#d7ded9`; dark-panel green `#7ec49a`
- Feed tag red `#e05c4f`; feed tag amber `#e0a13a`

**Typography**
- Sans: `IBM Plex Sans` (labels, headings) — weights 400/500/600/700
- Mono: `IBM Plex Mono` (all numerals, timestamps, log text, tabs)
- Notable sizes: KPI value 23px; friction value 17px; telemetry stat 21px; section heading 10px uppercase (.1em tracking); log rows 10.5px; labels 9px uppercase (.1em).

**Layout**
- 1px hairline gaps used as dividers (grid on `#cfd3d0` bg). Radii: 2–4px only (tight, technical). No large rounding, minimal shadow.

## Assets
No external images or icon libraries — the logo is a plain colored square, status indicators are CSS dots, and the heatmap is CSS grid cells. Fonts load from Google Fonts (IBM Plex Sans / IBM Plex Mono); use your codebase's font-loading approach or self-host.

## Files
- `Meridian WMS Dashboard.dc.html` — **the design to implement** (locked "ops-console" direction). Template markup + a `Component` logic class defining state, the simulation loop, `heat()`, and `renderVals()`.
- `WMS Dashboard Options.dc.html` — reference only: the three explored directions (1a Clean SaaS, 1b Ops Console = chosen, 1c Industrial) side by side.
- `support.js` — the prototype runtime. **Do not port this**; it only exists so the `.dc.html` files open in a browser.

To read the exact values, open the two HTML files as plain text — all styling is inline and all data lives in the logic class.
