---
artifact: main-flows
version: "1.1"
created: 2026-07-06
status: draft
project: ai-first-wms
phase: plan
inputs:
  - 1-plan/00-phase1-planning-brief.md
  - 1-plan/01-dashboard-ia.md
decisions:
  - "Demo scope: three workflow mocks only (slides 11–13)"
  - "Dashboard flows live in 01-dashboard-ia.md — not here"
  - "One happy path + one exception/override per workflow"
changelog:
  - "1.1: Simplified for demo — workflows only; dashboards moved to dashboard IA"
  - "1.0: Initial flow map from phase 1 planning brief"
---

# Phase 1 Workflow Flows

Three floor workflows for slides 11–13. Dashboard flows (executive + supervisor) are in `1-plan/01-dashboard-ia.md`.

**Bet:** Floor workers get embedded directives; compliance is enforced at scan time — not summarized in a chat sidebar.

---

## What we build

| Slide | Workflow | Actor | One screen to mock |
|-------|----------|-------|-------------------|
| **11** | Compliance | Compliance mgr + packer | Review queue + ship block modal |
| **12** | Pick-path | Picker | Next Pick card + exception sheet |
| **13** | Cartonization | Packer | Box directive + pack diagram |

**Week 4 scope:** Happy path + one exception/override per workflow. Static hi-fi — no live integrations.

**Build order:** Compliance → Pick-path → Cartonization (matches deck drill-down order from slide 10).

---

## Slide 11 — Compliance (AI-native)

**Story:** LLM extracts routing guide → human approves → hard block at ship.

### Review (compliance manager — desktop)

1. Upload routing guide PDF (retailer + DC tagged).
2. System extracts rules — show processing status ("47 rules · 3 ambiguous").
3. Split pane: PDF snippet ↔ rule card.
4. Approve / edit / reject each rule.
5. Activate per retailer/DC — never auto-activate.

### Enforcement (packer — ship station)

1. Packer prints label or confirms ship.
2. Deterministic validator runs (<200ms).
3. **Pass** → label prints, ship proceeds.
4. **Fail** → red modal, one fix action (e.g. "Reprint template") — no chat.

**Demo moment:** Ship block on Walmart PO-8842 (label position violation).

---

## Slide 12 — Pick-path (AI-enhanced)

**Story:** Optimization is invisible on the floor. Trust comes from fast exception handling.

### Happy path (picker — handheld)

1. Picker sees **Next Pick** card: location, SKU, qty, tote slot.
2. Scan bin → scan item → scan tote.
3. Progress ring: "4 of 12 · ~800m saved."
4. Repeat until batch complete.

Picker never sees maps, batch logic, or "AI reasoning."

### Exception

1. Long-press → bottom sheet: Bin empty / Damaged / Wrong item.
2. ~2s spinner → new pick injected ("Rerouted to Reserve B-14").
3. No supervisor PIN required.

**Supervisor batch override** lives on supervisor console only — not on handheld.

---

## Slide 13 — Cartonization (AI-enhanced)

**Story:** One authoritative box replaces packer guesswork.

1. Scan order at pack station.
2. If any SKU missing dims → block with alert (skip for happy-path demo).
3. System recommends **one carton** ("Use Box #4 — 12×9×6").
4. Show isometric pack diagram + "Est. billable: 2.4 lb ✓."
5. Packer packs and confirms.
6. **Override:** reason code required → feeds hygiene alerts (show dropdown, don't build alert system).

---

## Mock states (minimum)

| Workflow | Happy path | Second state for demo |
|----------|------------|----------------------|
| Compliance | Rule approved, ship passes | Red ship block modal |
| Pick-path | Next pick displayed | Exception reroute |
| Cartonization | Box directive shown | Override with reason |

Loading skeletons and empty states are Week 12 — not Week 4.

---

## Out of scope for demo

- Onboarding / data hygiene gate (imply via copy, don't mock)
- Supervisor console (appendix — see dashboard IA)
- Copilot chat, demand forecast, CV receiving
- Clickable drill-downs (annotated hotspots are enough)
- Offline sync behavior (mention in deck, don't simulate)

---

*Dashboard IA: `1-plan/01-dashboard-ia.md` · Planning brief: `1-plan/00-phase1-planning-brief.md`*
