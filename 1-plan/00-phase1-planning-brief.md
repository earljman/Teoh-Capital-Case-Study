---
artifact: phase1-planning-brief
version: "1.2"
created: 2026-07-06
status: draft
project: ai-first-wms
phase: plan
inputs:
  - 0-research/02-warehouse-ops-features.md
  - 0-research/03-ai-feasibility-architecture.md
  - 0-research/02-dashboard-specs.md
  - 0-research/01-market-competitive-strategy.md
  - 1-plan/01-dashboard-ia.md
  - _meta/advisory-panel.md
panel_review: approved 2026-07-06
changelog:
  - "1.2: Persona-split dashboards — slide 10 = executive (Big Three); supervisor console separate (see 01-dashboard-ia.md)"
  - "1.1: Dashboard-first presentation arc — full command center before workflow drill-downs"
---

# Phase 1 Planning Brief

Distilled from research + advisory panel review. **This is the input for mocks and deck slides 4–14.** Full technical detail stays in `0-research/03-ai-feasibility-architecture.md` (appendix only).

---

## 1. The Bet (one sentence)

**AI-first WMS means floor workers get embedded directives and compliance is enforced at scan time — not summarized in a chat sidebar.**

Thread this through every slide and mock. Do not lead with OR-Tools, SDK names, or "Powered by AI" badges.

---

## 2. ICP Assumption (lock for Phase 1)

| Field | Call |
|-------|------|
| **Who** | Digitally native mid-market omnichannel brands + independent e-commerce 3PLs |
| **Scale** | 10k–50k orders/month · 2–5 locations · 25–150 floor staff |
| **Budget** | $3k–8k/month SaaS; cannot absorb $50k+ implementation or 9-month enterprise rollout |
| **Switch trigger** | Headcount ceiling — throughput plateaus while order volume grows |

**Open with reviewer:** Commercial SaaS vs. Teoh-owned operator. Until resolved, design for **omnichannel** (DTC + wholesale mix).

**Story emphasis by mix** (executive dashboard on slide 10 — all three shown for omnichannel default):

| Customer mix | Emphasis on slide 10 | Deepest workflow drill-down (slide 11) |
|--------------|----------------------|----------------------------------------|
| Wholesale-heavy 3PL / B2B | Compliance risk card (equal layout; accent) | Compliance review + ship block |
| DTC-heavy brand | DIM waste + labor saved cards | Cartonization or pick-path (either works) |

Default deck order assumes **omnichannel** — executive dashboard shows all three margin killers with equal hero cards; workflow drill-downs follow in portfolio order (compliance → pick-path → cartonization). Layout detail: `1-plan/01-dashboard-ia.md`.

---

## 3. Phase 1 Feature Portfolio

### 3.0 Architecture: three engines + two dashboards

Phase 1 ships **three operational capabilities** and **two role-based dashboards** that surface their impact at different altitudes. Dashboards are not a fourth feature — they are how buyers and supervisors see the trifecta.

```
┌─────────────────────────────────────────┐
│   Executive dashboard (slide 10)         │  ← ROI proof (Big Three + combined impact)
│   Labor saved · Compliance R/Y/G · DIM  │
└──────────────┬──────────────────────────┘
               │ drill into
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 Slide 11   Slide 12   Slide 13
 Compliance Pick-path  Cartonize

┌─────────────────────────────────────────┐
│   Supervisor console (appendix mock)     │  ← floor ops (no Big Three)
│   Action queue · floor ops · friction    │
└─────────────────────────────────────────┘
```

**Presentation arc:** Show the **executive dashboard** first so the buyer sees all three margin killers in one view. Then dial into each workflow mock to prove how the floor experience delivers what the dashboard measures. Supervisor console demonstrates floor-ops depth (appendix or live demo — not slide 10).

### 3.1 Mapping: 1 AI-native + 2 AI-enhanced

| Slot | Feature | Type | Painkiller | How AI shows up | Operator override |
|------|---------|------|------------|-----------------|-------------------|
| **1** | **Routing guide → compliance rules** | **AI-native** | Retail chargebacks devour 2–5% of wholesale revenue; 100+ page PDFs interpreted manually | LLM extracts unstructured routing guides → structured rules; human review queue; **hard block** at label print / ship | Compliance manager approves/edits rules before activation; floor gets fix action, not chat |
| **2** | **Dynamic pick-path & order clustering** | AI-enhanced | 50–70% of labor cost is picking; 40–60% of shift is walking | Metaheuristic route + nightly affinity clustering; invisible on floor; sub-2s reroute on exception | Long-press skip / report empty → instant reroute; supervisor-only batch override |
| **3** | **3D algorithmic cartonization** | AI-enhanced | DIM weight penalties erode DTC margin (~20% freight waste from over-boxing) | Deterministic 3D bin-packing → single carton directive + pack diagram | Override with reason code → feeds master data hygiene alerts |

**Portfolio slide (6) framing:**

> **3 Phase 1 capabilities** (1 AI-native + 2 AI-enhanced)  
> **+ Executive dashboard** (Big Three ROI) **+ Supervisor console** (floor ops)

**Painkiller logic:** All three attack labor walk time, wholesale chargebacks, and DIM freight. Each delivers measurable P&L impact within 60 days of data gate clearance. Executives see $ impact; supervisors see exceptions and floor telemetry.

**Honest framing:** Pick-path and cartonization are **optimization intelligence**, not custom ML in Phase 1. Compliance extraction is genuinely LLM-native. Say this plainly if challenged.

### 3.2 Ship / Hold / Kill

| Ship (Phase 1) | Hold (Phase 1.5) | Kill / defer |
|----------------|------------------|--------------|
| Master data hygiene gates | Read-only ops copilot (supervisor desktop) | Dynamic slotting execution |
| Offline-first scanner shell | Anomaly-triggered cycle count (rule-based) | CV receiving / auto-dimensioning |
| Pick-path + exception reroute | | Demand forecasting |
| Cartonization + pack UI | | Predictive labor scheduling |
| Compliance ingestion + review + enforcement | | Autonomous agents mutating production data |
| Executive dashboard (Big Three + combined impact) | | Copilot as primary floor UX |
| Supervisor console (action queue + floor ops + friction watch) | | |

### 3.3 Timeline (harmonized)

| Checkpoint | Horizon | What "done" means |
|------------|---------|-------------------|
| **Week 4** | Prototype validation | Clickable hi-fi **executive dashboard** + supervisor console + all 3 workflow mocks; happy-path + AI surfaces + override paths; no production integrations |
| **Week 12** | Working demo slice | Deployable prototype; dashboard live-linked to workflow telemetry; real sample data; loading/empty/error states |
| **Week 24** | Production-hardened Phase 1 | Integrations, shadow mode, pilot tuning, peak-load hardening (research realism — not case-study deliverable) |

Data warm-up: assume **4–6 weeks** post-migration before optimization features activate (hygiene gates).

---

## 4. Top Four Risks (deck + sprint 1)

| ID | Risk | Mitigation |
|----|------|------------|
| **R1** | Master data garbage — missing SKU dims, wrong bin coords | Hygiene gates block AI until thresholds met; dim capture at receiving; cartonization requires 100% dims per order |
| **R2** | WiFi dead zones hang scanners | Offline-first mobile; local route graph; background sync queue |
| **R3** | Picker trust collapse after one bad route | Exception reroute <2s; shadow mode; distance-saved metric (no individual pace ranking) |
| **R4** | LLM hallucination on compliance rules | Mandatory human review queue; never auto-activate; deterministic runtime validator at print/ship |

Full register (14 items): `0-research/03-ai-feasibility-architecture.md` §8.

---

## 5. Mock & Deck Order

**Narrative rule:** Executive dashboard first, then drill into each workflow. Each workflow slide references the executive widget it feeds. Full IA: `1-plan/01-dashboard-ia.md`.

Build the **executive dashboard** shell first, then workflow mocks, then supervisor console, then wire drill-down affordances.

### 5.1 Slide map (Act III)

| Slide | Content | Mock |
|-------|---------|------|
| **10** | **Executive dashboard** — Big Three + combined impact | Hi-fi: Layout A (§4 in dashboard IA) |
| **11** | Feature 1 — Compliance (AI-native) | Review queue + ship block |
| **12** | Feature 2 — Pick-path (AI-enhanced) | Picker Next Pick + exception |
| **13** | Feature 3 — Cartonization (AI-enhanced) | Pack station directive |

Slides 14–15: commercial close. Slides 16–18: process section. **Appendix:** supervisor console, 8-week trend chart.

### 5.2 Mock build sequence

| Priority | Screen | Key components | Validates |
|----------|--------|----------------|-----------|
| **1** | **Executive dashboard** | **Big Three (hero row):** labor saved counter; compliance risk board (R/Y/G); DIM waste gauge · **Combined impact band:** est. annual margin protected; AI features 3/3 · Period default: this week · Drill-down on each card → workflow slide | Slide 4 test; buyer ROI proof |
| **2** | **Compliance — Review queue + floor block** | PDF ↔ rule card split pane; approve/edit/reject; activate per retailer/DC; red blocking modal at ship | Feeds compliance card on slide 10 |
| **3** | **Picker mobile — Next Pick + Exception** | Next-pick card; progress ring ("4 of 12 · ~800m saved"); exception bottom sheet; 2s reroute spinner | Feeds labor saved card on slide 10 |
| **4** | **Pack station — Cartonization** | One highlighted carton; isometric pack diagram; DIM vs. actual weight; override reason dropdown | Feeds DIM waste card on slide 10 |
| **5** | **Supervisor console** | **Action queue** · **Floor ops:** batch status, cartonization efficiency, aisle heatmap · **Friction watch:** sync queue, override rate, hygiene gate · **Exception log + AI engine log** · No Big Three | Floor-ops persona |
| **6** | **Onboarding — Data hygiene gate** | Progress toward coord/dim/accuracy thresholds; "AI readiness" meter | Feeds hygiene gate on supervisor console |

**Do not mock on slide 10:** friction watch, exception log, heatmap, trend chart (trend → appendix). **Do not mock anywhere:** Copilot chat panel, demand forecast graphs, CV receiving, digital twin floor view.

### 5.3 Drill-down pattern (slides 10 → 11–13)

Each **executive dashboard card** is tappable/annotated with "see workflow →" linking to its deep dive:

| Executive widget (slide 10) | Drills to | What the workflow mock proves |
|-----------------------------|-----------|-------------------------------|
| Compliance risk board | Slide 11 | Rules are extracted, reviewed, and **enforced** at ship — not summarized |
| Labor saved counter | Slide 12 | Optimization is invisible on floor; exceptions reroute in <2s |
| DIM waste gauge | Slide 13 | Single authoritative box; override captures missing dims |

Supervisor console drill-downs (appendix mock): ship blocks → slide 11; batch status / heatmap → slide 12; cartonization efficiency → slide 13.

### 5.4 Required states per mock

| State | Executive dashboard | Supervisor console | Compliance | Picker | Pack |
|-------|---------------------|-------------------|------------|--------|------|
| Happy path | Big Three live + combined impact | Action queue clear; ops green | Rule approved, ship passes | Next pick displayed | Carton recommended |
| Loading | Card skeletons | Skeleton bar + widgets | PDF processing stream | 2s reroute spinner | Calculating pack… |
| Empty / gated | One card muted; "2/3 active" | Hygiene gate red | No rules activated yet | First scan, no batch | SKU missing dims → block |
| Error / alert | Compliance card red | Sync backlog red; exceptions stacked | — | — | — |
| Error / block | — | Ship blocks in action queue | Red modal, single fix action | — | — |
| Override | — | Override rate flagged | Edit rule before activate | Skip / report empty | Reason code required |

---

## 6. Deck vs. Appendix

| Deck spine (invest hours) | Appendix / imply only |
|---------------------------|------------------------|
| Bet sentence (§1) | Full feasibility matrix |
| Portfolio: 3 capabilities + two dashboards (§3) | Build vs. buy vendor list |
| **Executive dashboard mock (slide 10)** | Latency budgets, OR-Tools detail |
| Supervisor console (appendix) | 14-row risk register |
| Three workflow drill-downs (slides 11–13) | Critical path Gantt |
| Thin vs. thick differentiation | Data dependency audit tables |
| Week 4 + Week 12 checkpoints | Onboarding gate (dedicated screen) |
| Commercial hooks + ROI numbers | 8-week portfolio trend chart |

**Slide 4 test (updated):** If reviewer sees only slides 1, 4, 6, and **10** (executive dashboard) — do they get the bet, the 3-feature model, and measurable ROI? Yes, if Big Three cards show live $ numbers and combined impact band is visible.

---

## 7. Commercial Hooks

| Margin killer | ROI anchor | Executive widget (slide 10) | Workflow proof (slides 11–13) |
|---------------|------------|----------------------------|-------------------------------|
| Picking labor | 20–30% travel reduction | Labor saved counter | Slide 12 — picker mobile |
| Wholesale chargebacks | ~$150K/year on $5M wholesale @ 3% | Compliance risk board | Slide 11 — enforcement modal |
| DIM freight | ~$180K/year at 30K parcels/month | DIM waste gauge | Slide 13 — pack directive |

Moat hierarchy: (1) compliance rule graph → (2) warehouse spatial model → (3) operational event corpus → (4) LLM chat (commoditized).

---

## 8. Next Actions

1. **Lock ICP mix** with reviewer → accent emphasis on slide 10 cards (layout stays equal-width).
2. **Start mock #1** — Executive dashboard (Layout A: Big Three + combined impact).
3. **Draft slide 6** — portfolio table + two-dashboard callout from §3.
4. **Build workflow mocks 2–4** — compliance, picker, pack; wire drill-downs from executive cards.
5. **Build supervisor console** — appendix mock per `01-dashboard-ia.md`.
6. **Draft acceptance criteria** — Given/When/Then per mock state (§5.4).
7. **Freeze research** — iterate in planning + mocks only.

---

*Panel routing: Storyteller + Investor on slide 10 (dashboard-first arc); Builder + Insider on all mocks; Judge validates slide 4 test with dashboard as the proof slide.*
