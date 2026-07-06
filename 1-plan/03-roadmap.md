---
artifact: roadmap
version: "1.1"
created: 2026-07-06
status: draft
project: ai-first-wms
phase: plan
inputs:
  - 1-plan/00-phase1-planning-brief.md
  - 1-plan/01-dashboard-ia.md
  - 1-plan/02-main-flows.md
  - 1-plan/04-users-and-checkpoints.md
  - 0-research/03-ai-feasibility-architecture.md
  - 3-present/notes.md
  - _meta/advisory-panel.md
decisions:
  - "Three checkpoints: Demo (case-study pack) → Week 4 (direction) → Week 12 (build slice)"
  - "Demo ships a clickable prototype — primary features only, not all flows"
  - "Week 24 production-hardened Phase 1 is research realism only — not case-study deliverable"
  - "Data warm-up: 4–6 weeks post-migration before AI optimization activates"
changelog:
  - "1.1: Demo includes clickable prototype (primary features); Week 4 reframed as full-surface validation"
  - "1.0: Initial roadmap — demo, Week 4, Week 12 with scope, out-of-scope, and test matrix"
---

# Phase 1 Roadmap

Investable sequence: **wedge → validate direction → ship a buildable slice.** Three checkpoints pace delivery. Full production Phase 1 (~Week 24) stays in research appendix — this doc covers what the deck promises and what each gate must prove.

**Bet (thread through every checkpoint):** Floor workers get embedded directives; compliance is enforced at scan time — not summarized in a chat sidebar.

**ICP assumption (until reviewer resolves):** Digitally native mid-market omnichannel brands + independent e-commerce 3PLs · 10k–50k orders/month · 2–5 locations · 25–150 floor staff · $3k–8k/month SaaS budget.

---

## Roadmap arc

```
Demo (case-study pack)        Week 4 (direction)           Week 12 (build slice)
────────────────────────     ───────────────────          ─────────────────────
Deck + clickable prototype   All surfaces + all flows     Deployable prototype
Primary features only        Happy-path + override paths  Live telemetry link
Drill-downs wired            Stakeholder walkthroughs     Full state coverage
No integrations              No production integrations   Sample data; no ERP prod
```

**Beyond Week 12 (imply only):** Week 24 production-hardened Phase 1 — integrations, shadow mode, pilot tuning, peak-load hardening (`0-research/03-ai-feasibility-architecture.md` §4). Not part of the case-study pack.

**Data warm-up (all checkpoints):** Assume **4–6 weeks** post-migration before pick-path and cartonization optimization activate. Hygiene gates block AI until coordinate/dimension thresholds are met.

---

## Checkpoint 1 — Demo (case-study pack)

**Horizon:** Now — deliverable for Teoh Capital review (slide/PPT pack per `_meta/case-study-prompt.md`).

**What "done" means:** Reviewer gets the slide deck **and** a clickable prototype that proves the primary features. Passes the **slide 4 test**: slides 1, 4, 6, and 10 alone convey the bet, 3-feature model, and measurable ROI. Live demo walks executive dashboard → key workflow moments — not every screen or state.

### Build scope

| Deliverable | Scope |
|-------------|-------|
| **Slide deck** | ~18 slides: thesis → portfolio + roadmap → executive dashboard → workflow drill-downs → commercial close → process |
| **Clickable prototype** | Hosted demo (shareable URL); primary features wired; real sample data |

#### In the clickable prototype (primary features)

| Surface | What's clickable | Demo moment |
|---------|------------------|-------------|
| **Executive dashboard** (slide 10) | Layout A — Big Three + combined impact; **drill-downs navigate to workflows** | VP Ops sees ROI in one view, taps into proof |
| **Compliance** (slide 11) | Ship block modal — red, single fix action (Walmart PO-8842) | Enforcement at scan time, not chat |
| **Pick-path** (slide 12) | Next Pick card + exception reroute | Invisible optimization; <2s reroute |
| **Cartonization** (slide 13) | Box directive + isometric pack diagram | Single authoritative answer |

**One happy path + one exception per workflow** in the prototype — matches `1-plan/02-main-flows.md`.

#### Deck-only or static (not required clickable at Demo)

| Surface | Treatment |
|---------|-----------|
| **Compliance review queue** | Slide screenshot or single static screen — full approve/edit flow is Week 4 |
| **Cartonization override** | Dropdown visible in deck mock; interaction optional at Demo |
| **Supervisor console** | Appendix — static screenshot in deck; full console is Week 4 |
| **Onboarding / hygiene gate** | Implied via copy on supervisor friction rail |
| **8-week trend chart** | Appendix slide only |

**Portfolio on slide 6:** 3 Phase 1 capabilities (1 AI-native + 2 AI-enhanced) + executive dashboard + supervisor console.

**Build order:** Executive dashboard (with drill-downs) → compliance ship block → pick-path → cartonization → deck screenshots for gaps → deploy prototype URL.

### Meetings

| Meeting | Attendees | Duration | Purpose |
|---------|-----------|----------|---------|
| Internal deck review | PM + builder | 45 min | Slide 4 test; narrative spine; mock fidelity |
| Advisory panel red-team | Judge, Skeptic, Editor, Closer (async or 30 min) | 30 min | Memorable bet survives; scope not bloated |
| Teoh presentation | Reviewer + partners | 45–60 min | Deck + live prototype walkthrough; defend bet and roadmap |

### Documents

| Artifact | Location |
|----------|----------|
| Phase 1 planning brief | `1-plan/00-phase1-planning-brief.md` |
| Dashboard IA | `1-plan/01-dashboard-ia.md` |
| Workflow flows | `1-plan/02-main-flows.md` |
| This roadmap | `1-plan/03-roadmap.md` |
| Users & checkpoints | `1-plan/04-users-and-checkpoints.md` |
| Slide build notes | `3-present/notes.md` |
| Research appendix | `0-research/` |

### Decisions to lock at Demo

| Decision | Options / default |
|----------|-------------------|
| AI-native bet | Compliance extraction + scan-time enforcement (locked) |
| Feature priority order | Compliance → pick-path → cartonization |
| ICP mix emphasis | Omnichannel default; wholesale vs. DTC accent on slide 10 |
| Market assumption | State as open question — commercial SaaS vs. Teoh-owned operator |
| Week 12 definition of done | See Checkpoint 3 below |

### Testing — Demo

| What | By whom | Pass criteria |
|------|---------|---------------|
| **Slide 4 test** | PM (Storyteller lens) | Slides 1, 4, 6, 10 convey bet + portfolio + ROI without workflow mocks |
| **Slide 10 test** | PM + Builder | Big Three show live $ numbers; combined impact band visible; each card drills to correct workflow |
| **Prototype walkthrough** | PM + Builder | Executive dashboard → compliance block → picker exception → carton directive completes without dead ends |
| **Mock fidelity** | Builder | Real warehouse data (SKUs, POs, retailers); no lorem ipsum; happy + one exception per workflow |
| **WMS plausibility** | Insider lens | No chatbot-as-primary-UX; enforcement at scan time; picker never sees "AI reasoning" |
| **Scope discipline** | Editor lens | Primary features only — no scope creep into full flows or supervisor interactivity |
| **Deploy smoke test** | Builder | Prototype URL loads; drill-downs work on presentation device |
| **Live defense** | Closer lens | Top 3 pushback answers rehearsed (thin vs. thick AI, data hygiene, honest ML framing) |
| **Memorable bet** | Judge lens | One sentence repeatable after the room clears |

**Not tested at Demo:** Full compliance review flow, supervisor console interactivity, all override paths, loading/empty/gated states, production integrations, UAT with real warehouse staff.

---

## Checkpoint 2 — Week 4 (validate direction)

**Horizon:** Week 4 from product kickoff (post–case-study Demo).

**What "done" means:** Prototype expands from Demo's primary-feature slice to **all surfaces and flows**. Ops stakeholders validate direction before engineering commits to integrations and production hardening.

### Build scope

| Surface | Scope | States |
|---------|-------|--------|
| **Executive dashboard** | Clickable Layout A; drill-down hotspots navigate to workflow mocks | Happy path + one gated card ("2/3 active") |
| **Supervisor console** | Clickable Layout A — action queue, floor ops, friction rail | All clear + action queue with ship blocks |
| **Compliance** | Full review flow + ship block enforcement | Happy path + block modal + PDF processing loading |
| **Pick-path** | Next Pick + exception reroute | Happy path + exception sheet + 2s reroute spinner |
| **Cartonization** | Pack directive + override | Happy path + override reason + missing-dims block (copy only) |
| **Drill-downs** | Executive cards → workflow mocks; supervisor widgets → workflows | Clickable |
| **Onboarding / hygiene gate** | Implied via copy on supervisor friction rail | Not a dedicated screen |

**Adds on top of Demo prototype:**

| Gap filled at Week 4 | Demo had |
|----------------------|----------|
| Full compliance review queue (PDF ↔ rule card, approve/edit) | Ship block only |
| Cartonization override interaction | Directive only |
| Supervisor console — full Layout A, clickable widgets | Static appendix screenshot |
| Gated dashboard card ("2/3 active") | Happy path only |
| Loading states (PDF processing, reroute spinner) | Not in Demo |
| Supervisor widgets → workflow drill-downs | Executive drill-downs only |

**In scope:** AI surfaces visible; operator override paths on all three workflows; all drill-downs wired.

**Not in scope:** Production ERP/carrier/EDI integrations; real LLM extraction pipeline; OR-Tools runtime; offline sync simulation; live dashboard telemetry.

### Meetings

| Meeting | Attendees | Duration | Purpose |
|---------|-----------|----------|---------|
| Concept review | Ops lead + executive sponsor | 60 min | Validate bet, ICP, and portfolio against floor reality |
| Mock walkthrough | 1–2 warehouse personas (supervisor, compliance mgr or picker) | 45 min each | Task-based walkthrough; capture trust and plausibility signals |
| Sprint 0 close | PM + engineering lead | 30 min | Ratify Week 12 scope; assign workstreams |

### Documents

| Artifact | Owner |
|----------|-------|
| Solution brief | PM |
| Acceptance criteria (Given/When/Then per mock state) | PM |
| IA / screen map (consolidated from planning artifacts) | PM + Builder |
| Walkthrough notes + decision log | PM |

### Decisions to lock at Week 4

| Decision | Notes |
|----------|-------|
| ICP assumption | Commercial SaaS vs. Teoh-owned operator |
| AI-native bet | Confirm or pivot compliance as anchor |
| Feature priority | Confirm portfolio order |
| Week 12 definition of done | Telemetry linkage, state coverage, deploy target |
| Handheld hardware target | Zebra vs. consumer Android (affects mobile mock fidelity) |
| Retailer mix | % DTC vs. wholesale — accents slide 10 emphasis |

### Testing — Week 4

| What | By whom | Pass criteria |
|------|---------|---------------|
| **Concept review** | Ops lead + sponsor | Bet resonates; ROI anchors credible; no blocking feasibility objections |
| **Supervisor walkthrough** | Warehouse supervisor (or proxy) | Action queue reads as triage surface; batch override is supervisor-only; friction watch plausible |
| **Compliance walkthrough** | Compliance manager (or proxy) | Review queue trusted over auto-activate; ship block is actionable, not chatty |
| **Picker walkthrough** | Floor picker (or proxy) | Next Pick is one-thumb simple; exception reroute feels fast; no map/reasoning clutter |
| **Packer walkthrough** | Packer (or proxy) | Single box directive reduces guesswork; override path clear |
| **Executive walkthrough** | VP Ops / 3PL owner (or proxy) | Big Three answers "are we winning financially?" in <30 seconds |
| **Drill-down integrity** | PM + Builder | Every executive card links to correct workflow; supervisor queue links to compliance |
| **Acceptance criteria review** | PM + engineering | Given/When/Then covers §5.4 states in planning brief |
| **Skeptic pass** | PM (Skeptic lens) | Top risks (R1–R4) have visible mitigation in mocks |

**Not tested at Week 4:** Production latency budgets; real PDF extraction accuracy; peak-load behavior; multi-site rollup; 8-week trend chart.

---

## Checkpoint 3 — Week 12 (validate build + Phase 2 gate)

**Horizon:** Week 12 from project kickoff.

**What "done" means:** Deployable prototype covering all Phase 1 surfaces. Dashboard live-linked to workflow telemetry. Real sample data. Full loading/empty/error/override state coverage. Ready for UAT and Phase 2 go/no-go.

### Build scope

| Workstream | Scope |
|------------|-------|
| **Executive dashboard** | Live metrics from workflow event stream; all states (§5.4 planning brief) |
| **Supervisor console** | Live action queue, floor ops, friction watch, exception + AI engine logs |
| **Compliance** | PDF upload → extraction pipeline (document AI + LLM) → review queue → runtime validator at ship | Human review mandatory; never auto-activate |
| **Pick-path** | Route engine (OR-Tools or graph solver) + nightly affinity clustering + exception reroute <2s | Shadow mode optional |
| **Cartonization** | 3D bin-packing SDK + pack station UI + DIM calc | 100% dim gate per order |
| **Foundation** | Master data hygiene gates; offline-first scanner shell (scaffold); sample data seed |
| **Telemetry** | Event bus: picks, overrides, ship blocks, cartonization decisions → dashboard widgets |
| **Deploy** | Hosted demo environment (e.g. Netlify); shareable URL for reviewers and pilot prospects |

**In scope:** Real sample data (representative SKUs, orders, retailers); loading/empty/error states on all surfaces; AI + override paths end-to-end in demo environment.

**Not in scope:** Production customer integrations (Shopify, NetSuite, EDI live); SAP/enterprise ERP; pilot warehouse cutover; peak-season load test; production auth/RBAC hardening.

### Meetings

| Meeting | Attendees | Duration | Purpose |
|---------|-----------|----------|---------|
| Bi-weekly sprint demo | PM + engineering + sponsor | 30 min | Incremental validation against acceptance criteria |
| UAT session | Ops users (supervisor, picker, compliance mgr, packer) | 90 min | Task scenarios across all three workflows + both dashboards |
| Phase 2 go/no-go | Executive sponsor + PM + engineering lead | 60 min | Lock expansion bets, integration priorities, packaging hypothesis |

### Documents

| Artifact | Owner |
|----------|-------|
| PRD slice (Phase 1 scope only) | PM |
| Edge-case catalog | PM + Insider lens |
| Instrumentation spec (events → dashboard widgets) | PM + engineering |
| Release notes draft | PM |
| Build vs. buy decision log (AI infra, cartonization SDK, document AI) | Engineering |

### Decisions to lock at Week 12

| Decision | Notes |
|----------|-------|
| Phase 2 expansion bets | Dynamic slotting recs, ops copilot, anomaly cycle count |
| Integration priorities | ERP (Shopify/NetSuite first), carriers, EDI/ASN |
| Build vs. buy | Document AI provider, cartonization SDK, OR-Tools vs. commercial routing |
| Commercial packaging | Per-site vs. per-order pricing; hygiene gate as onboarding SKU |
| Pilot customer criteria | Minimum data readiness; retailer mix; hardware fleet |

### Testing — Week 12

| What | By whom | Pass criteria |
|------|---------|---------------|
| **End-to-end happy path** | QA / PM | Upload guide → approve rule → pick batch → pack order → executive dashboard reflects all three margin killers |
| **State coverage** | QA | All rows in §5.4 (planning brief) implemented and reachable |
| **Compliance extraction** | Compliance SME + PM | ≥85% rule recall on sample guides; ambiguous rules flagged; zero auto-activate |
| **Runtime enforcement** | QA | Ship block <200ms; single fix action; audit trail on block event |
| **Pick-path reroute** | QA + floor proxy | Exception reroute <2s in demo environment; progress ring updates |
| **Cartonization accuracy** | QA | Correct box for known test orders; dim gate blocks incomplete orders |
| **Dashboard telemetry** | PM + engineering | Executive Big Three update from workflow events; supervisor queue reflects live blocks |
| **Override paths** | Ops users (UAT) | Picker skip, packer override, compliance edit-before-activate all work; reason codes captured |
| **Offline scaffold** | Engineering | Local route graph persists through simulated disconnect (not full prod offline) |
| **Hygiene gate** | PM | Feature muted when thresholds not met; supervisor friction rail shows gate status |
| **Deploy smoke test** | Builder | Demo URL loads; all routes reachable; no console errors |
| **UAT scenarios** | Ops users | Task completion without PM narration; trust signals on picker UX |
| **Phase 2 gate** | Sponsor | Go/no-go with documented gaps |

**Latency targets (validate in demo, not prod):** batch assignment <500ms · exception reroute <2s · cartonization <1s · compliance runtime check <200ms (`0-research/03-ai-feasibility-architecture.md` §4).

---

## Phase 1 ship scope (Week 12+ target)

What Phase 1 ultimately ships when built to production (Week 24 research horizon). Week 12 delivers a **slice** of this.

| Capability | Type | Ships |
|------------|------|-------|
| Routing guide → compliance rules | AI-native | Ingestion + review queue + scan-time enforcement |
| Dynamic pick-path & order clustering | AI-enhanced | Metaheuristic routing + nightly affinity; invisible on floor |
| 3D algorithmic cartonization | AI-enhanced | Single carton directive + pack diagram |
| Executive dashboard | Telemetry | Big Three + combined impact |
| Supervisor console | Telemetry | Action queue + floor ops + friction watch |
| Master data hygiene gates | Foundation | Blocks AI until thresholds met |
| Offline-first scanner shell | Foundation | Local route graph + sync queue |
| Exception-aware reroute | Foundation | <2s local recalc |

### Hold (Phase 1.5)

| Capability | Notes |
|------------|-------|
| Read-only ops copilot | Supervisor desktop; query layer only — no workflow mutation |
| Anomaly-triggered cycle count | Rule-based thresholds; not ML in first release |

---

## Explicitly out of scope

Consolidated from planning brief §3.2, main flows, dashboard IA, and research §9. **Do not build, mock, or imply as Phase 1 deliverables** unless listed in a checkpoint above.

### Product features — Kill / defer

| Item | Earliest phase | Why out |
|------|----------------|---------|
| Dynamic slotting **execution** | Phase 2 | Physically disruptive; adoption bottleneck |
| Computer vision receiving / auto-dimensioning | Phase 2 | Hardware-dependent; lighting failure modes |
| Demand forecasting & reorder automation | Phase 2 | Cold-start; needs 6–12 months clean history |
| Predictive labor scheduling | Phase 3 | Low ROI confidence; rarely digitized in mid-market |
| Autonomous agents mutating production data | Phase 3+ | Requires proven exception UX + approval policies |
| Copilot as **primary** floor UX | Never (floor) | Chat adds taps and latency; pickers need directives |
| Pick-path deep learning model | Phase 2+ | Metaheuristics sufficient in Phase 1 |
| Robotics / AMR orchestration | Phase 3+ | Not in ICP budget or floor reality |
| SAP / enterprise ERP deep integration | Phase 3 | 6-month detour; ICP = Shopify + NetSuite |

### UI / mock — Do not build

| Item | Notes |
|------|-------|
| Copilot chat panel | Phase 1.5 read-only supplement at earliest |
| Demand forecast graphs | Cold-start garbage in deck |
| CV receiving UI | Hardware not present at ICP sites |
| Digital twin floor view | Architecture tour, not wedge |
| 8-week trend chart on slide 10 | Appendix / commercial close only |
| Dock-to-stock clock, phantom inventory rate | Deferred per dashboard IA §3.2 |
| Multi-site rollup table on executive dashboard | Single-site selector only on slide 10 |
### Demo-specific cuts (Checkpoint 1 only)

| Item | In Demo prototype? | Available from |
|------|-------------------|----------------|
| Executive dashboard + drill-downs | ✓ Clickable | — |
| Compliance ship block | ✓ Clickable | — |
| Pick-path Next Pick + exception | ✓ Clickable | — |
| Cartonization directive | ✓ Clickable | — |
| Compliance review queue (full flow) | Deck/static only | Week 4 |
| Supervisor console (interactive) | Deck/static only | Week 4 |
| Cartonization override interaction | Deck optional | Week 4 |
| Loading skeletons | — | Week 4 (partial) · Week 12 (full) |
| Empty / gated states (full set) | — | Week 4 (partial) · Week 12 (full) |
| Onboarding / data hygiene dedicated screen | Copy only | Week 4 (friction rail) |
| Offline sync behavior | Mention in deck | Week 12 scaffold |
| Production integrations | — | Week 24+ |

### Engineering — Out of scope until post–Week 12

| Item | Notes |
|------|-------|
| Production ERP/carrier/EDI integrations | Week 12 uses sample data |
| Shadow mode A/B vs. static waves | Week 14–20 in research critical path |
| Peak-season load test (3× BFCM) | Week 24 hardening |
| Production auth, RBAC, multi-tenant isolation | Pilot prerequisite |
| Real customer data migration | Pilot phase |

---

## Testing summary matrix

| Test type | Demo | Week 4 | Week 12 | Owner |
|-----------|------|--------|---------|-------|
| Slide 4 / narrative spine | ✓ | — | — | PM |
| Mock fidelity & data realism | ✓ | ✓ | ✓ | Builder |
| WMS plausibility (Insider) | ✓ | ✓ | ✓ | PM |
| Concept review (sponsor + ops lead) | — | ✓ | — | Sponsor |
| Persona walkthroughs (floor) | — | ✓ | ✓ (UAT) | PM + ops users |
| Acceptance criteria (Given/When/Then) | — | ✓ | ✓ | PM |
| Prototype walkthrough (primary features) | ✓ | — | — | PM + Builder |
| Clickable drill-down integrity | ✓ (executive → workflows) | ✓ (all surfaces) | ✓ | Builder |
| Deploy smoke test | ✓ | ✓ | ✓ | Builder |
| Full state coverage (§5.4) | — | partial | ✓ | QA |
| E2E workflow + dashboard telemetry | — | — | ✓ | QA + engineering |
| Compliance extraction accuracy | — | — | ✓ | Compliance SME |
| Latency budgets | — | — | ✓ | Engineering |
| Phase 2 go/no-go | — | — | ✓ | Sponsor |

---

## ROI anchors (validate messaging at every checkpoint)

| Margin killer | ROI anchor | Executive widget | Workflow proof |
|---------------|------------|------------------|----------------|
| Picking labor | 20–30% travel reduction | Labor saved counter | Slide 12 — picker mobile |
| Wholesale chargebacks | ~$150K/yr on $5M wholesale @ 3% | Compliance risk board | Slide 11 — enforcement modal |
| DIM freight | ~$180K/yr at 30K parcels/mo | DIM waste gauge | Slide 13 — pack directive |

---

## Top risks to test mitigation for

| ID | Risk | Mitigation to show in mocks / prototype | Test focus |
|----|------|----------------------------------------|------------|
| R1 | Master data garbage | Hygiene gates; dim capture; cartonization 100% dim gate | Gated dashboard card; pack block |
| R2 | WiFi dead zones | Offline-first shell; sync queue on supervisor | Week 12 disconnect scaffold |
| R3 | Picker trust collapse | <2s reroute; team metrics only; distance saved | Picker walkthrough + UAT |
| R4 | LLM compliance hallucination | Human review queue; never auto-activate; deterministic validator | Compliance SME extraction test |

Full register (14 items): `0-research/03-ai-feasibility-architecture.md` §8.

---

## Deck alignment

| Slide | Content | Checkpoint |
|-------|---------|------------|
| 6 | Phase 1 portfolio (3 capabilities + two dashboards) | Demo |
| 7 | Roadmap arc (this doc) | Demo |
| 8 | Week 4 detail | Demo |
| 9 | Week 12 detail | Demo |
| 10 | Executive dashboard mock | Demo (clickable, drill-downs) → Week 12 (live telemetry) |
| 11–13 | Workflow drill-downs | Demo (primary moments) → Week 4 (full flows) → Week 12 (live) |
| Appendix | Supervisor console · 8-week trend chart | Demo (static) → Week 4 (clickable) → Week 12 (live) |
| Live demo URL | Clickable prototype | Demo → Week 4 → Week 12 |

---

## Open questions (carry to Week 4 decisions)

| Question | Impact |
|----------|--------|
| Commercial SaaS vs. Teoh-owned operator | GTM framing, Investor lens, packaging |
| Build / maintain ownership | Engineering staffing assumption |
| ICP mix (DTC vs. wholesale accent) | Slide 10 card emphasis; deepest workflow drill-down |
| Handheld hardware fleet | Mobile mock fidelity |
| Supervisor shift context | Today's shift vs. rolling 24h (dashboard IA §9) |

---

*Panel routing for roadmap: Storyteller + Investor on checkpoint pacing; Builder + Insider on test matrix; Judge validates slide 4 test at Demo; Skeptic attacks Week 12 scope creep.*
