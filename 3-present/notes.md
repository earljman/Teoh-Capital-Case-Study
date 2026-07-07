# Slide Build Notes

*This document is for notes that will be implemented in the building of the slides. It should be cleared and deleted by the end of the project*

**Source of truth:** `1-plan/00-phase1-planning-brief.md` (v1.2) · Dashboard IA: `1-plan/01-dashboard-ia.md`  
**Panel routing:** `_meta/advisory-panel.md`

- add a download slides button to download the slides as pdf
- Show developer skills: tech-stack choices and real code matter, not just mocks.
- Deck target: **18 slides** (core spine below).
- **Narrative arc:** Thesis → portfolio + roadmap → **executive dashboard** → workflow drill-downs → commercial close → process.

---

## The Bet (thread through everything)

> **AI-first WMS means floor workers get embedded directives and compliance is enforced at scan time — not summarized in a chat sidebar.**

Slide 4 owns this sentence. Do not lead with OR-Tools, SDK names, or "Powered by AI" badges.

**Honest framing if challenged:** Compliance extraction is genuinely LLM-native. Pick-path and cartonization are optimization intelligence in Phase 1, not custom ML.

---

## Slide 4 test (before sending)

If the reviewer sees only **slides 1, 4, 6, and 10** — do they get the bet, the 3-feature model, and measurable ROI?

- Slide 10 must show **Big Three cards with live $ numbers** + **combined impact band**.
- They do **not** need a workflow mock to get the whole idea.
- Supervisor console (no Big Three) is appendix / live demo — not slide 10.

---

## Act I — Thesis & positioning (slides 1–5)

| Slide | Content |
|-------|---------|
| **1** | **AI-First WMS** — one-liner: mid-market (10k–50k orders/mo); Phase 1 attacks three money leaks — picking labor, retail compliance fines, oversize-box freight waste |
| **2** | The problem — headcount ceiling; 50–70% labor is picking; chargebacks + DIM waste |
| **3** | Positioning — one view vs. CartonCloud, Cin7, WiseWMS, Easy WMS, Manhattan; where we don't play |
| **4** | The AI-first bet — embedded floor directives + scan-time enforcement; thin (chat summary) vs. thick (hard block) |
| **5** | Market & wedge — missing middle ICP (10k–50k orders/mo, 2–5 locations, 25–150 staff); $3k–8k/mo budget |

**ICP open question:** Commercial SaaS vs. Teoh-owned operator. State as deliberate call on slide 14.

---

## Act II — Scope & roadmap (slides 6–9)

### Slide 6 — Phase 1 feature portfolio

**Framing:** 3 Phase 1 capabilities + **executive dashboard** (ROI proof on slide 10) + **supervisor console** (floor ops — appendix).

| Slot | Feature | Type | Painkiller | AI shows up as |
|------|---------|------|------------|----------------|
| **1** | Routing guide → compliance rules | **AI-native** | Chargebacks = 2–5% of wholesale revenue | LLM extraction → human review → **hard block** at ship |
| **2** | Dynamic pick-path & order clustering | AI-enhanced | 40–60% of picker shift is walking | Invisible optimization; sub-2s reroute on exception |
| **3** | 3D algorithmic cartonization | AI-enhanced | ~20% freight waste from over-boxing | Single carton directive + pack diagram |

Call out operator override on each. Executive dashboard surfaces all three margin killers on slide 10.

### Slide 7 — Roadmap arc

Three checkpoints pace delivery: **Demo** (case-study pack) → **Week 4** (validate direction) → **Week 12** (production-ready Phase 1 slice).

### Slides 8–9 — Checkpoint detail

Each checkpoint slide: four blocks — **Build scope · Meetings · Documents · Decisions**.

**Week 4 — validate direction**
- **Build:** Clickable hi-fi **executive dashboard** + supervisor console + all 3 workflow mocks; happy-path; AI surfaces + override paths; no production integrations
- **Meetings:** Concept review with ops lead + sponsor (60 min); mock walkthrough with 1–2 warehouse personas (45 min each)
- **Documents:** Solution brief, acceptance criteria (Given/When/Then), IA / screen map
- **Decisions:** ICP assumption, AI-native bet, feature priority, Week 12 definition of done

**Week 12 — validate build + Phase 2 gate**
- **Build:** Working prototype; dashboard live-linked to workflow telemetry; real sample data; loading/empty/error states; deployable demo
- **Meetings:** Bi-weekly sprint demo; UAT with ops users; go/no-go for Phase 2
- **Documents:** PRD slice, edge-case catalog, instrumentation spec, release notes draft
- **Decisions:** Phase 2 bets, integration priorities (ERP/carriers/EDI), build-vs-buy on AI infra, packaging hypothesis

Data warm-up: **4–6 weeks** post-migration before AI optimization activates (hygiene gates).

---

## Act III — Executive dashboard + workflow drill-downs (slides 10–13)

**Presentation rule:** Executive dashboard first (ROI proof), then dial into each workflow (the trees). Each workflow slide references the executive card it feeds.

```
Slide 10: Executive dashboard (Big Three + combined impact)
    ↓ drill into
Slides 11–13: Compliance → Pick-path → Cartonization

Appendix: Supervisor console · 8-week trend chart
```

### Slide 10 — Executive dashboard (hi-fi mock #1)

**Layout A** — all above the fold at 1440×900. Period default: **This week**.

**Big Three (hero row — equal width):**
- Labor saved counter — picks/hr + estimated labor capital saved (20–30% travel reduction)
- Compliance risk board — R/Y/G for at-risk wholesale shipments + $ exposure
- DIM waste gauge — freight lost to oversized boxes

**Combined impact band:**
- Est. annual margin protected (rollup of three cards)
- AI features active: 3/3 ✓

**UX:** Drill-down affordance on each card → slides 11–13 ("see workflow →").

**Not on slide 10:** friction watch, exception log, heatmap, trend chart (trend → appendix).

### Supervisor console (appendix mock #2)

**No Big Three.** Action queue first, then floor ops, friction rail, exception + AI logs. See `1-plan/01-dashboard-ia.md` §2–3.

### Slide 11 — Feature 1: Compliance (AI-native)

**Mock:** Review queue (PDF ↔ rule card split pane; approve/edit/reject; activate per retailer/DC) + floor ship block modal (red, single fix action).

**Feeds:** Compliance risk card on slide 10.

**AI loop:** Upload PDF → extract rules → human review → enforce at print/ship → audit trail.

### Slide 12 — Feature 2: Pick-path (AI-enhanced)

**Mock:** Picker mobile — Next Pick card (location, SKU, qty, tote); progress ring ("4 of 12 · ~800m saved"); exception bottom sheet (Empty / Damaged / Wrong item); 2s reroute spinner.

**Feeds:** Labor saved card on slide 10. Batch status lives on supervisor console (appendix).

**Pattern:** Invisible optimization on floor; supervisor-only batch override on supervisor console.

### Slide 13 — Feature 3: Cartonization (AI-enhanced)

**Mock:** Pack station — one highlighted carton; isometric pack diagram; DIM vs. actual weight inline; override reason dropdown.

**Feeds:** DIM waste card on slide 10. Cartonization efficiency lives on supervisor console (appendix).

**Pattern:** Single authoritative answer; override captures missing dims.

### Required states (all mocks)

| State | Executive dashboard | Supervisor console | Compliance | Picker | Pack |
|-------|---------------------|-------------------|------------|--------|------|
| Happy path | Big Three live + combined impact | Action queue clear; ops green | Ship passes | Next pick shown | Carton recommended |
| Loading | Card skeletons | Skeleton bar + widgets | PDF processing | 2s reroute spinner | Calculating… |
| Empty / gated | One card muted; "2/3 active" | Hygiene gate red | No rules active | No batch yet | Missing dims → block |
| Error / block | Compliance card red | Sync backlog; exceptions stacked | Red modal + fix | — | — |
| Override | — | Override rate flagged | Edit before activate | Report empty | Reason code |

---

## Act IV — Commercial close (slides 14–15)

### Slide 14 — Why this wins

| Margin killer | ROI anchor | Proof |
|---------------|------------|-------|
| Picking labor | 20–30% travel reduction | Slide 12 |
| Wholesale chargebacks | ~$150K/yr on $5M wholesale @ 3% | Slide 11 |
| DIM freight | ~$180K/yr at 30K parcels/mo | Slide 13 |

**Moat hierarchy:** (1) compliance rule graph → (2) warehouse spatial model → (3) operational event corpus → (4) LLM chat (commoditized).

Use thin vs. thick table: enforcement at scan time > chat summary.

### Slide 15 — Assumptions & risks

**Open calls:** ICP mix (DTC vs. wholesale), commercial SaaS vs. Teoh-owned operator.

**Top 4 risks (deck only — full register in research appendix):**

| ID | Risk | Mitigation |
|----|------|------------|
| R1 | Master data garbage | Hygiene gates; dim capture at receiving |
| R2 | WiFi dead zones | Offline-first mobile; local route graph |
| R3 | Picker trust collapse | <2s reroute; shadow mode; team metrics only |
| R4 | LLM compliance hallucination | Human review queue; never auto-activate |

---

## Act V — How this deck was built (slides 16–18)

Source detail from `3-present/process-documentation.md`.

| Slide | Content |
|-------|---------|
| **16** | Workflow overview — where acceleration happened and where human gates controlled quality |
| **17** | Research + Planning workflow — tools used, outputs generated, and decisions locked (`0-research/`, `1-plan/`) |
| **18** | Development + Delivery workflow — toolchain plus controls and proof (`2-build/`, `3-present/`) |

Emphasize: this is an appendix-style proof section for interviewer deep dive; AI accelerated *how* the work was built while product judgment stayed human-owned.

---

## Mock build sequence

Build order (deck presents executive dashboard first):

1. **Executive dashboard** — Layout A: Big Three + combined impact
2. **Compliance** — review queue + ship block
3. **Picker mobile** — Next Pick + exception
4. **Pack station** — cartonization directive
5. **Supervisor console** — action queue + floor ops + friction (appendix)
6. Wire drill-downs from executive cards → workflow mocks

**Onboarding data hygiene gate** — feeds supervisor hygiene widget; no dedicated slide unless appendix.

**Do not mock on slide 10:** trend chart (→ appendix), friction watch, heatmap. **Do not mock anywhere:** Copilot chat panel, demand forecast graphs, CV receiving, digital twin floor view.

---

## Deck vs. appendix

| In deck | Appendix only |
|---------|---------------|
| Bet + portfolio + executive dashboard | Full feasibility matrix |
| 3 workflow mocks (slides 11–13) | Build vs. buy vendor list |
| Big Three ROI numbers + combined impact | Latency budgets, OR-Tools |
| Supervisor console mock | 8-week portfolio trend chart |
| Top 4 risks | 14-row risk register |
| Week 4 / 12 checkpoints | Data dependency audit |
| Thin vs. thick differentiation | Competitive teardown tables |

---

## Appendix

Competitive tables, market sizing, integration surface, research citations, full technical architecture (`0-research/03-ai-feasibility-architecture.md`), supervisor console mock, 8-week trend chart.
