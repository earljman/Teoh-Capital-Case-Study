# Act II Rebuild Outline — Scope & Roadmap

**Source of truth:** `1-plan/03-roadmap.md` (v1.3)  
**Deck change:** Act II grows from 5 slides to 6 (22 → 23 total). Act III starts at slide 12.

---

## Design rules

1. **Workflows first** — each slide answers *what ships when*, not validation gates or ceremony.
2. **One matrix, many views** — slide 7 is canonical; slides 9–11 are column excerpts only.
3. **Demo Architecture = three capabilities** — compliance, pick-path, cartonization only; receiving + cycle count start in Phase 1.
4. **Phases = depth** — 4w / 8w / 12w label maturity, not meetings or sign-offs.
5. **Cut from deck spine:** Meetings · Documents · Decisions lanes · risk badges · gate language ("checkpoint", "validate", "sign off") → `1-plan/03-roadmap.md` or speaker notes.

---

## Anti-overlap (one question per slide)

| Slide | Question | Show | Do not show |
|-------|----------|------|-------------|
| **7** | When does each workflow ship? | Full 7×4 matrix | Capability descriptions, arch diagram |
| **8** | What does the case-study demo prove? | Portfolio arch diagram; **three** capability cards; executive + supervisor blocks | Matrix, Phase 1 build list |
| **9** | What does Phase 1 add beyond demo? | Demo → P1 matrix excerpt (workflow rows only) | Capability cards, arch diagram |
| **10** | What completes the production slice? | P2 column for all seven rows + foundation line | Demo arch, P1 detail |
| **11** | What comes after UAT? | P3+ column + hardening/expansion bullets | P1/P2 scope |

**Order:** Matrix (7) → demo shape (8) → Phase 1 delta (9) → Phase 2 (10) → Phase 3+ (11).

---

## Act II slides

| # | Title | File (target) |
|---|-------|---------------|
| 6 | Act II divider | `05b-act-ii-title.html` |
| 7 | Seven Workflows · Delivery Map | `07-seven-workflows-delivery-map.html` |
| 8 | Demo Architecture | `08-demo-architecture.html` (from `06-phase-1-feature-portfolio.html`) |
| 9 | Phase 1 · Build depth (4w) | `09-phase-1-build-depth.html` |
| 10 | Phase 2 · Production slice (8w) | `10-phase-2-production-slice.html` |
| 11 | Phase 3+ · Harden + expand (12w) | `11-phase-3-harden-expand.html` |

---

## Canonical matrix (slide 7)

| Core workflow | Demo (done) | Phase 1 · 4w | Phase 2 · 8w | Phase 3+ · 12w |
|---------------|-------------|--------------|--------------|----------------|
| **1. Receiving** | — | ASN verify + dim capture (prototype) | Live receiving + dim gate | CV receiving |
| **2. Put-away** | — | — | Directed put-away to bin | Dynamic slotting |
| **3. Picking** | Next pick + exception | Full batch + supervisor override | Pick-path engine + telemetry | — |
| **4. Packing** | Box directive | Override + dim-gate states | Cartonization SDK | — |
| **5. Shipping / compliance** | Ship block | Full review queue + activation | Extraction + enforcement | — |
| **6. Cycle counting** | — | Exception-triggered count | Rule engine + queue | ML anomaly triggers |
| **7. Labor scheduling** | — | — | Shift board + queue visibility | Predictive (defer) |

**Dashboard row (footnote):** Executive in demo → supervisor static in demo → interactive Phase 1 → live Phase 2.

**Slide 7 chrome:** Kicker `Sequenced from Act I pain map` · Headline `Seven core workflows across four delivery stages` · Subhead `Demo proves three margin killers · Phase 1 completes five capabilities · Phase 2 ships all seven`

**Visual:** Demo column shaded done · optional depth icons (— · ◐ prototype · ● production · ○ expand) · thin timeline strip below (labels only)

**Footer:** Data warm-up: 4–6 weeks post-migration before pick-path and cartonization optimization activate.

---

## Slide 6 — Act II divider

**Headline:** Scope & Roadmap  
**Lead:** Five capabilities, seven core workflows — sequenced across demo, Phase 1 (4w), Phase 2 (8w), Phase 3+ (12w).

---

## Slide 8 — Demo Architecture

Rename only from portfolio slide pattern. Chrome label `Demo Architecture`; slide number `08 / 23`.

**Demo shows three capabilities only** (compliance, pick-path, cartonization) — not receiving or cycle count.

Keep: `portfolio-arch` diagram, three capability cards, connector `three capabilities · three margin-killer workflows`, supervisor console block, supervisor note (*Receiving + cycle count in Phase 1 · put-away + labor complete the seven workflows in Phase 2*), footers.

---

## Slide 9 — Phase 1 · Build depth

**Kicker:** Phase 1 · Complete prototypes  
**Headline:** From proof moments to prototype-complete surfaces  
**Subhead:** Five workflow rows deepen; two new rows start (receiving, cycle count)

**Visual:** Matrix excerpt — Demo and Phase 1 columns only. Rows: 1, 3, 4, 5, 6, plus dashboard row. Same table styling as slide 7; demo cells tinted done, P1 cells tinted builds-next.

**Compact line:** *Put-away + labor → Phase 2 (rows 2 & 7)*

**Footer:** Sample data only · no production integrations

---

## Slide 10 — Phase 2 · Production slice

**Kicker:** Phase 2 · Production slice  
**Headline:** All seven workflows on live engines — UAT-ready demo environment  
**Subhead:** Phase 1 prototypes become production; put-away + labor complete the floor

**Visual:** Phase 2 column for all seven workflow rows from canonical matrix. Optional P1 → P2 depth arrow per cell (prototype → production).

**Foundation line (below matrix):** Hygiene gates · offline scaffold · event bus → dashboards

**Footer:** Still out: production ERP cutover, peak-load test, multi-tenant auth → Phase 3+

---

## Slide 11 — Phase 3+ · Harden + expand

**Kicker:** Phase 3+ · Harden + expand  
**Headline:** Pilot-ready product — integrations first, then Act I medium-ROI backlog  
**Subhead:** Weeks 13–24 · cumulative from kickoff

**Visual:** P3+ column for rows 1, 2, 6, 7 from canonical matrix.

**Cross-cutting bullets (not matrix rows):**

| Hardening | Expansion (Act I medium-ROI) |
|-----------|-------------------------------|
| ERP / carrier / EDI integrations | Ops copilot (read-only supervisor) |
| Shadow mode A/B | Demand forecasting |
| Pilot warehouse cutover | |
| Peak-load test (3× BFCM) | |
| Production auth / RBAC | |

**Footer deferrals:** Predictive labor · autonomous agents · SAP / AMR · pick-path deep learning

---

## Implementation checklist

- [x] Create `07-seven-workflows-delivery-map.html`
- [x] Rename/move `06-phase-1-feature-portfolio.html` → `08-demo-architecture.html` (chrome only)
- [x] Rebuild `08-checkpoint-week-4.html` → `09-phase-1-build-depth.html`
- [x] Rebuild `09-checkpoint-week-12.html` → `10-phase-2-production-slice.html`
- [x] Create `11-phase-3-harden-expand.html`
- [x] Update `05b-act-ii-title.html` (slides 06–11)
- [x] Deprecate `07-roadmap-arc.html`
- [x] Update `manifest.json` (+1 slide; renumber Act III+)
- [x] Update `3-present/notes.md` Act II section
- [x] Update `1-plan/03-roadmap.md` deck alignment
- [x] Add CSS: `.workflow-matrix`, `.workflow-matrix--excerpt`, column highlight states

**Build order:** Slide 7 matrix → slide 8 rename → slides 9–11 excerpts.
