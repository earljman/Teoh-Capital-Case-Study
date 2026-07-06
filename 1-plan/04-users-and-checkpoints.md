---
artifact: users-and-checkpoints
version: "1.0"
created: 2026-07-06
status: draft
project: ai-first-wms
phase: plan
inputs:
  - 1-plan/01-dashboard-ia.md
  - 1-plan/02-main-flows.md
  - 1-plan/03-roadmap.md
  - 1-plan/00-phase1-planning-brief.md
changelog:
  - "1.0: Personas + screen/flow availability per Demo, Week 4, Week 12"
---

# Users & Checkpoint Availability

Who Phase 1 is built for, and what each role can access at **Demo**, **Week 4**, and **Week 12**. Checkpoint definitions: `1-plan/03-roadmap.md`.

**Design principle:** Floor workers get embedded directives. Supervisors triage exceptions. Executives see financial impact. Compliance managers own rule activation — nothing auto-ships without human review.

---

## Who we're building for

**Operator context:** Mid-market omnichannel brands and e-commerce 3PLs · 10k–50k orders/month · 2–5 locations · 25–150 floor staff.

| Persona | Typical title | Core question | Primary surface |
|---------|---------------|---------------|-----------------|
| **Executive buyer** | VP Ops, Supply Chain Director, 3PL owner | "Are we winning financially?" | Executive dashboard (desktop) |
| **Warehouse supervisor** | Shift lead, floor supervisor | "What needs my attention right now?" | Supervisor console (desktop) |
| **Compliance manager** | Vendor compliance, B2B ops lead | "Are retailer rules correct before we enforce them?" | Compliance review queue (desktop) |
| **Picker** | Floor picker | "What's my next pick?" | Pick-path mobile (handheld) |
| **Packer** | Pack-station operator | "Which box? Can I ship?" | Cartonization + ship station (tablet / fixed display) |

**Role overlap:** Packer handles both cartonization and compliance enforcement at label print/ship. Supervisor batch override is **supervisor-only** — never on the picker handheld.

**Not a Phase 1 user:** Generic "ask the WMS" copilot chat — deferred to Phase 1.5 (supervisor desktop, read-only).

---

## Legend

| Symbol | Meaning |
|--------|---------|
| **●** | Clickable in prototype |
| **◐** | Deck screenshot or static only |
| **—** | Not available |
| **+live** | Week 12 only — wired to workflow telemetry |

---

## Availability by persona

### Executive buyer

| Screen / flow | Demo | Week 4 | Week 12 |
|---------------|------|--------|---------|
| Executive dashboard — Big Three + combined impact | ● | ● | ● +live |
| Period selector (This week / MTD / 30d) | ● | ● | ● |
| Drill-down: Labor saved → pick-path | ● | ● | ● |
| Drill-down: Compliance risk → compliance | ● | ● | ● |
| Drill-down: DIM waste → cartonization | ● | ● | ● |
| Gated card ("2/3 active" when hygiene blocks a feature) | — | ● | ● +live |
| Loading / error states on dashboard | — | ◐ | ● +live |
| 8-week trend chart | ◐ (appendix slide) | ◐ | ◐ (appendix) |

---

### Warehouse supervisor

| Screen / flow | Demo | Week 4 | Week 12 |
|---------------|------|--------|---------|
| Supervisor console — action queue | ◐ (deck appendix) | ● | ● +live |
| Floor ops: batch status, cartonization efficiency, heatmap | ◐ | ● | ● +live |
| Friction watch: sync queue, override rate, hygiene gate | ◐ | ● | ● +live |
| Exception log + AI engine log | ◐ | ● | ● +live |
| Drill-down: ship block → compliance workflow | — | ● | ● |
| Drill-down: batch / heatmap → pick-path | — | ● | ● |
| Drill-down: cartonization efficiency → pack station | — | ● | ● |
| **Override batch** (supervisor-only) | — | ● | ● |
| All clear vs. stacked exceptions states | — | ● | ● +live |

---

### Compliance manager

| Screen / flow | Demo | Week 4 | Week 12 |
|---------------|------|--------|---------|
| Upload routing guide PDF | — | ● | ● (real extraction pipeline) |
| PDF processing / extraction status | — | ● | ● |
| Review queue — PDF ↔ rule card split pane | ◐ (deck) | ● | ● |
| Approve / edit / reject per rule | — | ● | ● |
| Activate per retailer/DC (never auto-activate) | — | ● | ● |
| Ship block modal (sees outcome, not primary actor) | ● (demo walks packer view) | ● | ● +live |

---

### Picker

| Screen / flow | Demo | Week 4 | Week 12 |
|---------------|------|--------|---------|
| Next Pick card (location, SKU, qty, tote) | ● | ● | ● |
| Scan → confirm pick (happy path) | ● | ● | ● |
| Progress ring ("4 of 12 · ~800m saved") | ● | ● | ● +live |
| Exception sheet: Empty / Damaged / Wrong item | ● | ● | ● |
| Reroute spinner + new pick injected | ● | ● | ● (<2s target) |
| No batch / first-scan empty state | — | ◐ | ● |
| Maps, batch logic, or "AI reasoning" | — (never) | — | — |

---

### Packer

| Screen / flow | Demo | Week 4 | Week 12 |
|---------------|------|--------|---------|
| Cartonization — scan order, box directive | ● | ● | ● (SDK-backed) |
| Isometric pack diagram + DIM vs. actual | ● | ● | ● |
| Pack confirm (happy path) | ● | ● | ● |
| Override with reason code | ◐ (deck) | ● | ● +live (feeds hygiene alerts) |
| Missing SKU dims → block | — | ◐ | ● |
| Ship / label print — compliance pass | — | ● | ● |
| Ship block modal — single fix action | ● | ● | ● +live |

---

## Cross-persona flows (end-to-end)

What a full shift looks like when all roles are wired together.

| Flow | Demo | Week 4 | Week 12 |
|------|------|--------|---------|
| **Compliance:** guide uploaded → rules approved → ship blocked on violation | Partial (block only) | Full | Full + extraction pipeline |
| **Pick-path:** batch assigned → picks completed → exception rerouted | ● primary moments | Full | Full + route engine |
| **Cartonization:** order scanned → box directive → pack complete | ● primary moments | Full + override | Full + dim gate |
| **Executive sees floor impact** | Static $ on dashboard | Static $ | +live from telemetry |
| **Supervisor triages floor** | Deck only | Full console | +live queue & logs |

**Week 12 golden path (UAT):** Compliance mgr activates Walmart rules → picker completes batch with one exception → packer packs with directive → ship passes or blocks → executive dashboard and supervisor console reflect events.

---

## What's never available (all checkpoints)

| User need | Why out |
|-----------|---------|
| Picker asks WMS in natural language | Copilot not floor UX |
| Supervisor mutates orders via chat | Phase 1.5 read-only copilot at earliest |
| Executive sees exception log / heatmap | Delegated to supervisor console |
| Supervisor sees Big Three $ counters | Executive-only widgets |
| Any role: demand forecast, CV receiving, dynamic slotting execution | Phase 2+ per roadmap |

---

## Quick reference — screens by checkpoint

| Surface | Device | Demo | Week 4 | Week 12 |
|---------|--------|------|--------|---------|
| Executive dashboard | Desktop | ● | ● | ● +live |
| Supervisor console | Desktop | ◐ | ● | ● +live |
| Compliance review queue | Desktop | ◐ | ● | ● |
| Pick-path mobile | Handheld | ● | ● | ● |
| Pack station / cartonization | Tablet / monitor | ● | ● | ● |
| Ship block (packer) | Pack station | ● | ● | ● +live |
| Onboarding / hygiene gate | — | copy only | friction rail | friction rail + gates |
| 8-week trend chart | Desktop | ◐ appendix | ◐ | ◐ appendix |

---

*Dashboard IA: `1-plan/01-dashboard-ia.md` · Workflow detail: `1-plan/02-main-flows.md` · Roadmap: `1-plan/03-roadmap.md`*
