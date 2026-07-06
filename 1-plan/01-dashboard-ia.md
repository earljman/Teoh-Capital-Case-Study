---
artifact: dashboard-ia
version: "1.2"
created: 2026-07-06
status: draft
project: ai-first-wms
phase: plan
inputs:
  - 0-research/02-dashboard-specs.md
  - 1-plan/00-phase1-planning-brief.md
  - 0-research/03-ai-feasibility-architecture.md
  - 1-plan/02-main-flows.md
decisions:
  - "Big Three margin-killer widgets are executive-only — not shown on supervisor console"
  - "Supervisor layout locked: Layout A (exception queue first)"
  - "Executive layout locked: Layout A (Big Three hero row + combined impact band)"
  - "Executive time default: This week (MTD/30d available in header selector)"
  - "8-week trend chart: appendix only — not on slide 10 mock"
  - "Slide 10 deck persona: executive dashboard"
changelog:
  - "1.2: Executive + supervisor flows added; dashboard flows live here not main-flows"
  - "1.1: Executive Layout A locked; combined impact band; trend to appendix; slide 10 = exec"
  - "1.0: Persona split + supervisor IA locked; executive layout outlined"
---

# Dashboard Information Architecture

Input for mock #1 (supervisor console) and mock #1b (executive dashboard). Supersedes the conflated "supervisor command center includes Big Three" assumption in `00-phase1-planning-brief.md` §5.2 — **Big Three belongs to the executive view only** (consistent with `02-dashboard-specs.md` §1 title).

---

## 1. Persona split

| Dimension | **Executive dashboard** | **Supervisor console** |
|-----------|-------------------------|------------------------|
| **Primary user** | VP Ops / Supply Chain Director, 3PL owner | Warehouse supervisor, shift lead |
| **Job to be done** | Confirm ROI and margin exposure across sites | Run the shift — triage exceptions, keep the floor moving |
| **Core question** | "Are we winning financially?" | "What needs my attention right now?" |
| **Big Three widgets** | **Hero row** — labor saved, compliance R/Y/G, DIM waste | **Not shown** |
| **Friction watch** | Omitted (delegated to supervisors) | Persistent — sync, overrides, hygiene |
| **Exception log** | Omitted | Primary action surface |
| **Time horizon** | **This week** default (MTD / 30d in header) | Live shift, last 15–60 minutes |
| **Drill-down depth** | Summary sufficient | Required — batch override, ship blocks, zone drill |

Supervisors still interact with the same three Phase 1 capabilities (compliance, pick-path, cartonization), but through **operational surfaces** — not financial counters.

| Capability | Executive sees | Supervisor sees |
|------------|----------------|-----------------|
| Compliance | R/Y/G risk board, chargeback exposure | Ship blocks, compliance holds, at-risk shipment queue |
| Pick-path | Labor capital saved, picks/hr trend | Batch status, congestion heatmap, walk distance saved (operational) |
| Cartonization | DIM waste $ gauge, freight cost curve | Volume utilization %, pack-station efficiency |

---

## 2. Supervisor console — locked layout (Layout A)

**Pattern:** Exception queue first. Floor ops in the main canvas. Friction watch + AI logs in a sticky right rail.

```
┌──────────────────────────────────────────────────────────┬──────────────┐
│  ACTION QUEUE (top — highest visual weight)              │  FRICTION    │
│  ┌────────────────────────────────────────────────────┐  │  WATCH       │
│  │ ⚠ 3 ship blocks · 2 compliance holds · 1 sync dead │  │  (sticky)    │
│  │   zone · 5 open exceptions          [Triage all →] │  │              │
│  └────────────────────────────────────────────────────┘  │ Sync queue 7 │
├──────────────────────────────────────────────────────────│ Override 8%  │
│  FLOOR OPS                                               │ Hygiene 94%  │
│  ┌────────────────────┐  ┌─────────────────────────────┐ │ AI ready ✓   │
│  │ Dynamic batch      │  │ Cartonization efficiency    │ │              │
│  │ 12 active · 3 clust│  │ 92% avg volume utilization│ │              │
│  │ 4.2km saved · [Override batch]                       │ │              │
│  └────────────────────┘  └─────────────────────────────┘ │              │
│  ┌──────────────────────────────────────────────────────┐│              │
│  │ Aisle congestion heatmap                             ││              │
│  │ Zone C bottleneck · 4 pickers · [View zone →]        ││              │
│  └──────────────────────────────────────────────────────┘│              │
├──────────────────────────────────────────────────────────┤              │
│  EXCEPTION LOG (scrollable feed)                         │  AI ENGINE   │
│  09:14 Bin empty · A-12 · auto-rerouted                  │  LOG         │
│  09:11 Ship block · Walmart PO-8842 · label position     │  · Guide     │
│  09:08 Override · force-confirm · Zone B                 │    parsed    │
└──────────────────────────────────────────────────────────┴──────────────┘
```

**Why this layout:** Supervisors open the console to triage, not read P&L. Action queue replaces Big Three as the above-the-fold anchor. Heatmap retains horizontal space. Friction metrics stay visible without competing with floor ops.

### 2.1 Supervisor flow (demo)

Appendix mock only — one happy-path screen is enough for Week 4.

1. Supervisor opens console → action queue shows what needs attention (or "All clear").
2. Scan floor ops widgets (batch status, cartonization, heatmap).
3. Friction watch rail stays visible (sync, overrides, hygiene).
4. Tap a ship block or batch widget → annotated link to workflow mock (slides 11–13).

**Demo states:** All clear · Action queue with ship blocks (red accent).

---

## 3. Supervisor widget inventory

### 3.1 Action queue (hero)

Aggregated count of items requiring supervisor attention. Tapping opens filtered triage view.

| Signal | Source | Default action |
|--------|--------|----------------|
| Ship blocks | Compliance enforcement at print/ship | → Compliance workflow (slide 11) |
| Compliance holds | Pre-ship validation failures | → Compliance workflow |
| Sync dead zones | Handheld offline queue threshold | → Zone / IT alert |
| Open exceptions | Floor exception log (unresolved) | → Exception detail |

**Empty state:** "All clear — 0 items need attention" (green, not hidden).

### 3.2 Floor ops (main canvas)

| Widget | Key metrics | Drill-down |
|--------|-------------|------------|
| **Dynamic batch status** | Active batches, SKU affinity clusters, walk distance saved (shift) | → Pick-path workflow (slide 12) |
| **Cartonization efficiency** | Avg box volume utilization % | → Pack station workflow (slide 13) |
| **Aisle congestion heatmap** | Picker density by zone, bottleneck highlights | → Zone detail (in-console); batch override CTA |

**Supervisor-only action:** "Override batch" on batch status widget — never picker-facing (`03-ai-feasibility-architecture.md` §5.1).

**Deferred from Phase 1 mock** (in specs §2, not yet prioritized): dock-to-stock clock, phantom inventory rate. Revisit Phase 1.5.

### 3.3 Friction watch (right rail — sticky)

| Widget | Metric | Alert threshold (mock) |
|--------|--------|------------------------|
| **Offline sync queue** | Packages waiting to sync from handhelds | >10 = yellow, >25 = red |
| **Scanner override rate** | Manual force-confirms vs. algorithmic scans | Spike vs. 7-day baseline |
| **Master data hygiene gate** | % SKUs with dims + bin coords | <90% blocks AI features |

### 3.4 Exception log (main column, below floor ops)

Real-time feed — bin empty, barcode unreadable, ship blocks, force-confirms, reroute events.

| Field | Example |
|-------|---------|
| Timestamp | 09:14 |
| Type | Bin empty · Ship block · Override |
| Location / entity | A-12 · PO-8842 |
| System action | Auto-rerouted · Blocked · Flagged |

**Interaction:** Tap row → detail drawer with single fix action where applicable.

### 3.5 AI engine log (right rail, below friction watch)

Compact trust-building stream — not a chat panel.

| Entry type | Example |
|------------|---------|
| Guide parsed | "Home Depot Guide v3.2 — height limit constraint set" |
| Pathing index | "87% vs. optimized baseline (shift)" |

Hold for Phase 1.5: read-only ops copilot (`03-ai-feasibility-architecture.md` §5.5).

---

## 4. Executive dashboard — locked layout (Layout A)

**Pattern:** Big Three hero row (equal width). Combined impact band below. No trend chart on primary mock — 8-week portfolio trend lives in **deck appendix only**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Site: All locations ▾]     Week of Jul 1 · Last refreshed 2m ago    │
│  Period: This week ▾  (MTD · 30d available — not default)             │
├─────────────────────────────────────────────────────────────────────────┤
│  BIG THREE — hero row (equal width, largest type on screen)             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐          │
│  │ LABOR SAVED     │ │ COMPLIANCE RISK │ │ DIM WASTE       │          │
│  │ $12,400 this wk │ │ 2R · 5Y · 41G   │ │ $4,200 lost/wk  │          │
│  │ 94 picks/hr ↑18%│ │ ~$2.1K exposure │ │ 18% vs. optimal │          │
│  │ ▁▂▃▅▆ sparkline  │ │ ▁▂▁▃▂ sparkline  │ │ ▁▁▂▃▄ cost curve│          │
│  │ → see pick-path │ │ → see compliance│ │ → see cartonize │          │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘          │
├─────────────────────────────────────────────────────────────────────────┤
│  COMBINED IMPACT                                                        │
│  Est. annual margin protected: $342K  ·  AI features active: 3/3  ✓   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Why this layout:** Cleanest slide 10 screenshot. Passes slide 4 test — three margin killers with live $ numbers and drill-downs. Combined impact band answers "so what?" without a second chart competing for attention.

**Explicitly omitted from slide 10 mock:** exception log, override rate, sync queue, batch override, heatmap, AI engine log stream, multi-site table, 8-week trend chart.

**Deferred layouts (not Phase 1 mock):** ICP-weighted hero (Layout B), portfolio rollup (Layout C), before/after proof (Layout D) — revisit for customized buyer demos or slide 14 companion.

### 4.1 Big Three card spec

| Card | Primary number | Secondary | Visual | Drill-down |
|------|----------------|-----------|--------|------------|
| **Labor saved** | Est. labor capital saved ($/wk) | Avg picks/hr vs. 60–80 baseline | Per-card sparkline | Slide 12 |
| **Compliance risk** | R/Y/G counts + $ exposure | At-risk / OTIF-adjacent count | R/Y/G board + sparkline | Slide 11 |
| **DIM waste** | $ lost to oversize boxes (/wk) | Avg volume utilization % | Cost curve vs. optimal | Slide 13 |

**ROI anchors for mock copy** (from planning brief §7):

| Margin killer | Anchor |
|---------------|--------|
| Picking labor | 20–30% travel reduction |
| Wholesale chargebacks | ~$150K/yr on $5M wholesale @ 3% |
| DIM freight | ~$180K/yr at 30K parcels/mo |

### 4.2 Combined impact band

Single summary row below Big Three — not a fourth widget, not a chart.

| Field | Example |
|-------|---------|
| Est. annual margin protected | $342K (rollup of three cards, annualized from weekly) |
| AI features active | 3/3 ✓ (compliance rules · pick-path · cartonization) |

Optional secondary line (one line max): data hygiene % if any feature gated — keep subtle, not alarm-red unless blocking.

### 4.3 Header chrome

| Control | Default | Notes |
|---------|---------|-------|
| Site selector | All locations | Single-site selectable; no per-site table on slide 10 |
| Time period | **This week** | MTD and 30d in dropdown — not default |
| Last refreshed | Relative timestamp | "2m ago" |

### 4.4 Appendix only (not slide 10 mock)

**8-week trend chart** — stacked or grouped series for labor saved, compliance avoided, DIM recovered. Use in deck appendix or slide 14 commercial close companion. Do not build into primary executive mock viewport.

### 4.5 Executive flow (demo)

Slide 10 hero — static screenshot is sufficient for Week 4; drill-downs can be annotated, not clickable.

1. VP Ops lands on dashboard (default: **This week**, all locations).
2. Big Three cards load with live $ numbers and sparklines.
3. Combined impact band shows annualized margin + "AI features 3/3."
4. Each card has a **"See workflow →"** annotation linking to slides 11–13.

| Card | Fed by workflow |
|------|-----------------|
| Labor saved | Pick-path — walk distance saved, picks/hr |
| Compliance risk | Compliance — at-risk shipments, R/Y/G coverage |
| DIM waste | Cartonization — volume utilization, freight delta |

**Demo states:** Happy (live $) · One card muted if gated ("2/3 active").

---

## 5. Drill-down map (both personas → workflow mocks)

### Executive (slide 10)

| Widget | Drills to | Slide | Proves |
|--------|-----------|-------|--------|
| Labor saved card | Picker Next Pick + exception reroute | 12 | Optimization invisible on floor; measurable ROI |
| Compliance risk card | Compliance review + ship block modal | 11 | Rules enforced at scan time |
| DIM waste card | Pack station directive | 13 | Single authoritative box |

### Supervisor

| Supervisor surface | Drills to | Slide | Proves |
|--------------------|-----------|-------|--------|
| Ship block / compliance hold (action queue or exception log) | Compliance review + ship block modal | 11 | Rules enforced at scan time |
| Batch status · heatmap · walk distance saved | Picker Next Pick + exception reroute | 12 | Invisible optimization; <2s reroute |
| Cartonization efficiency | Pack station directive | 13 | Single authoritative box |

Each drill-down affordance: **"See workflow →"** annotation on mock + tappable hotspot.

---

## 6. Viewport and fold priority

**Target viewport:** 1440×900 (desktop).

### Executive (slide 10 mock)

**Entire layout fits above the fold — no scroll:**

1. Header (site + period + refresh)
2. Big Three hero row
3. Combined impact band

### Supervisor

**Above the fold (no scroll):**

1. Action queue
2. Batch status + cartonization efficiency (side by side)
3. Friction watch rail (full height starts here)
4. Top of heatmap OR top of exception log (accept partial heatmap peek)

**Below the fold:** Heatmap remainder, exception log scroll, AI engine log tail.

**Supervisor header:** Site selector, **today's shift** context (rolling 24h — **open decision**), last refreshed.

---

## 7. Required mock states

### Executive

| State | Big Three | Combined impact |
|-------|-----------|-----------------|
| **Happy path** | Live $ numbers, green/neutral sparklines | $ total + 3/3 active |
| **Loading** | Card skeletons | Band skeleton |
| **Empty / gated** | One card muted if hygiene blocks feature | "2/3 active" + hygiene note |
| **Error / alert** | Compliance card red (at-risk shipments) | Exposure reflected in annualized $ |

### Supervisor

| State | Action queue | Floor ops | Friction rail | Exception log |
|-------|--------------|-----------|---------------|---------------|
| **Happy path** | "All clear" or low counts | Live green metrics | All nominal | Recent auto-resolved items |
| **Loading** | Skeleton bar | Widget skeletons | Rail skeletons | Shimmer rows |
| **Empty / gated** | — | Cartonization blocked if hygiene <90% | Hygiene gate red, "AI not ready" | — |
| **Error / alert** | High counts, red accent | Zone C highlighted on heatmap | Sync backlog red | Unresolved exceptions stacked |
| **Override spike** | — | — | Override rate flagged | Force-confirm entries highlighted |

---

## 8. Deck alignment

**Locked:** Slide 10 = **executive dashboard** (Layout A — Big Three + combined impact). Passes slide 4 test without workflow mocks.

**Deck sequence:**

```
Slide 10: Executive dashboard (Big Three + combined impact)
    ↓ drill into
Slides 11–13: Compliance → Pick-path → Cartonization
Appendix: 8-week trend chart · supervisor console
```

**Aligned:** `00-phase1-planning-brief.md` (v1.2) · `3-present/notes.md`

---

## 9. Open decisions

| # | Decision | Status |
|---|----------|--------|
| 1 | Deck slide 10 persona | **Locked — executive** |
| 2 | Executive time default | **Locked — This week** |
| 3 | Combined impact band | **Locked — yes** |
| 4 | Trend chart on slide 10 | **Locked — appendix only** |
| 5 | Executive layout | **Locked — Layout A** |
| 6 | Supervisor shift context | Open — today's shift vs. rolling 24h |
| 7 | Supervisor exception log depth | Open — inline + drawer vs. full rail |
| 8 | Location switcher | Open — header dropdown (default for both) |

---

## 10. Mock build sequence

| Priority | Screen | Validates |
|----------|--------|-----------|
| **1** | **Executive dashboard** — Layout A, Big Three + combined impact | Slide 4 test, slide 10 hero |
| **2** | Supervisor console — Layout A | Floor-ops persona |
| **3–5** | Workflow mocks (compliance, picker, pack) | Drill-downs from executive cards |
| **6** | Wire drill-down hotspots | Slide 10 → 11–13 |
| **Appendix** | 8-week trend chart | Commercial close / deep dive |

---

*Next: start hi-fi mock #1 (executive dashboard), then supervisor console.*
