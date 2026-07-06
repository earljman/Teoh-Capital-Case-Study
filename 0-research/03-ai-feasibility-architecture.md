---
artifact: ai-feasibility-architecture
version: "1.0"
created: 2026-07-06
status: draft
project: ai-first-wms
phase: discover
inputs:
  - 0-research/02-warehouse-ops-features.md
  - 0-research/01-market-competitive-strategy.md
  - 0-research/02-dashboard-specs.md
---

# AI Feasibility & Product Architecture: Phase 1 Technical Brief

## Executive Summary

Phase 1 AI for a mid-market WMS is not a chatbot bolt-on. It is **three tightly scoped optimization engines** (pick-path, cartonization, compliance extraction) wrapped in **floor-native UX** that hides the math and surfaces only blocking decisions. Everything else in the warehouse AI landscape is either table stakes (rules-based min/max, static wave picking dressed as "AI") or Phase 2+ (dynamic slotting, computer vision receiving, predictive labor scheduling).

**Phase 1 shippable (3–6 months, assuming 4–6 engineers + 1 applied scientist):**
1. Dynamic order clustering & pick-path optimization
2. Algorithmic 3D cartonization
3. LLM-driven retail routing guide → hard WMS constraints

**Phase 1 foundation (not "AI features" but prerequisites):**
- Master data hygiene onboarding (SKU dimensions, bin coordinates, location accuracy)
- Offline-first mobile scanner architecture
- Exception recalculation loop (bin empty → reroute in <2s locally)

**Defer to Phase 2+:** Dynamic slotting, CV receiving/dimensioning, demand forecasting, predictive labor scheduling, autonomous multi-agent orchestration, robotics/AMR integration.

---

## 1. Capability Tiering: Table Stakes vs. Differentiators

| Tier | Capability | Market Reality | Our Position |
|------|-----------|----------------|--------------|
| **Table stakes** (buyers expect; not a wedge) | Static wave/batch picking, barcode scan-verify, min/max reorder alerts, basic ABC slotting, carrier rate shopping | Cin7, CartonCloud, WiseWMS all ship variants. Marketing as "AI" is common. | Ship as **baseline WMS**, not differentiated AI. |
| **Table stakes (emerging)** | Basic demand smoothing, reorder point suggestions from 90-day velocity | Cin7 ecosystem integrations; Manhattan at enterprise tier. | Phase 2. Requires 6–12 months clean order history. |
| **Genuine differentiator (Phase 1)** | Real-time dynamic pick-path + order clustering | Gated behind Manhattan/Easy WMS enterprise pricing. Mid-market has static waves. | **Lead wedge.** Metaheuristic routing + affinity clustering; no custom ML training required initially. |
| **Genuine differentiator (Phase 1)** | Routing guide → executable compliance rules | No mid-market WMS does this natively. Manual PDF/spreadsheet interpretation is universal pain. | **Defensible moat** if rules are versioned, auditable, and enforced at scan time—not just summarized in chat. |
| **Genuine differentiator (Phase 1)** | 3D cartonization with pack instructions | Exists as standalone tools (Packsize, Paccurate) but rarely native in mid-market WMS. | **High ROI, buy-first** on algorithm; differentiate on WMS-native enforcement at pack station. |
| **Aspirational (Phase 2)** | Dynamic slotting with nightly re-slot recommendations | Easy WMS, Manhattan ship this; physically disruptive to execute. | Algorithm is buildable; **operational adoption** is the bottleneck. |
| **Aspirational (Phase 2)** | CV receiving (auto-count, dimension capture, damage detect) | Hardware-dependent; lighting/angle failure modes. | Buy dimensioning hardware API; defer custom CV models. |
| **Aspirational (Phase 2+)** | Predictive labor scheduling with engineered standards | Requires time-study data most mid-market ops lack. | Low ROI confidence per ops research. |
| **Aspirational (Phase 3+)** | Autonomous exception resolution agents | Multi-step reasoning across inventory, carrier, customer systems. | Agentic orchestration after exception UX is proven. |
| **Gimmick risk** | Generic "Ask your WMS" copilot | Every legacy vendor adding ChatGPT sidebar. | Only valuable as **query layer over structured ops data**, not primary UX. |

---

## 2. Feature Feasibility Matrix

**Assumptions (state explicitly):**
- Customer has migrated onto our WMS for 2–4 weeks before AI optimization activates (data hygiene gate).
- Bin locations have x/y/z or aisle-bay-level coordinates entered during onboarding.
- 80%+ of SKUs have L×W×H×weight within 60 days (captured at receiving or bulk import).
- Target: Android handheld scanners (Zebra TC series or consumer ruggedized), sub-200ms local UI response.
- No AMR/robotics integration in Phase 1.
- ERP/OMS integrations: Shopify, NetSuite, Cin7 (REST APIs)—not SAP ECC deep integration.

| Feature | Data Required | Data Availability (Early Customer) | Build Complexity | Phase 1 Timeline | Differentiation Tier | Phase |
|---------|---------------|--------------------------------------|------------------|------------------|----------------------|-------|
| **Dynamic pick-path & order clustering** | Bin coordinates, real-time inventory by location, open order queue, picker location (last scan), SKU pick face mapping | **Medium.** Coordinates often missing in legacy migrations; inventory accuracy typically 92–97% pre-WMS. | **Medium.** Algorithm + offline batch assignment + congestion heuristics. No neural net required initially. | **8–12 weeks** (core engine 4w, mobile integration 4w, tuning 2–4w) | **High** — immediate labor ROI | **P1** |
| **3D algorithmic cartonization** | Per-SKU dimensions, weight, fragility flag, orientation constraints, available carton catalog with interior dims | **Low–Medium.** #1 data gap: 30–50% of SKUs lack dims on day 1. | **Low–Medium.** 3D bin-packing is solved; integration + pack-station UX is the work. | **6–10 weeks** (buy SDK 2w, WMS integration 4w, pack UI 2–4w) | **High** — freight ROI | **P1** |
| **Routing guide → compliance rules (LLM extraction)** | PDF routing guides per retailer, retailer/DC/shipment-type metadata, label template specs, ASN/EDI field mappings | **High.** Customers have the PDFs; they don't have structured rules. This is the product's job. | **Medium–High.** Doc ingestion + human review queue + rule engine + version control. | **10–14 weeks** (ingestion 4w, rule schema 3w, enforcement hooks 4w, review UI 3w) | **Very High** — no mid-market equivalent | **P1** |
| **Exception-aware rerouting** | Same as pick-path + exception event stream (bin empty, damaged, short pick) | **Medium.** Depends on scan discipline. | **Medium.** Local recalc on device; must not block on cloud. | **4–6 weeks** (parallel with pick-path) | **Medium** — adoption enabler, not sales wedge | **P1** |
| **Master data hygiene onboarding** | SKU master, location master, initial cycle count | **Variable.** Often messy CSV exports from legacy WMS. | **Low.** Guided import + validation gates + "dim capture" receiving workflow. | **4–6 weeks** | **Low** (prerequisite) | **P1** |
| **Anomaly-triggered cycle counting** | Pick accuracy history, count variance by SKU/location, velocity | **Low** until 30–60 days of scan events in our system. | **Medium.** Simple statistical thresholds first; ML later. | **6–8 weeks** | **Medium** | **P2** |
| **Dynamic slotting recommendations** | 90-day velocity, pick frequency, product affinity, physical move cost model | **Medium** after 60–90 days in system. | **Medium** (algorithm) + **High** (change mgmt) | **8–12 weeks** build; adoption is quarters | **Medium–High** | **P2** |
| **CV receiving / auto-dimensioning** | Camera feeds or dimensioning station API, SKU reference images (optional) | **Low.** Hardware not present at most mid-market sites. | **High.** Hardware procurement, lighting calibration, model edge cases. | **16–24 weeks** | **Medium** | **P2** |
| **Demand forecasting & allocation** | 12+ months order history, channel mix, promo calendar, seasonality | **Low–Medium.** New WMS = cold start. Shopify/ERP history may exist but needs normalization. | **Medium–High.** | **12–16 weeks** after data pipeline mature | **Low** (table stakes at enterprise) | **P2** |
| **Predictive labor scheduling** | Engineered labor standards, shift templates, historical throughput by role | **Low.** Rarely digitized in mid-market. | **High.** | **16+ weeks** | **Low** | **P3** |
| **Conversational ops copilot** | All structured WMS data + user RBAC context | **High** (once on platform). | **Low–Medium** if scoped to query/explain, not act. | **4–6 weeks** (thin) | **Low** (gimmick if standalone) | **P1.5** (supplement) |
| **Autonomous multi-agent orchestration** | Full workflow APIs, approval policies, audit log | **Medium.** | **Very High.** | **6+ months** | **High** (long-term) | **P3+** |

---

## 3. Data Dependency Audit (Per Top Candidate)

### 3.1 Dynamic Pick-Path & Order Clustering

| Data Element | Source | Usable on Day 1? | Mitigation |
|--------------|--------|------------------|------------|
| Bin x/y coordinates | Location master (onboarding) | **Often partial** — legacy systems store aisle-bay-level only | Warehouse profiling wizard; manual floor walk with scanner to confirm |
| Inventory by bin | WMS transactions + initial count | **Moderate** — 3–8% drift typical pre-migration | Mandatory cycle count sprint week 1–2 |
| Open order queue | OMS/Shopify/EDI integration | **Yes** | Real-time webhook + polling fallback |
| Picker position | Last successful scan event | **Yes** after first scan | Default to zone entry point |
| SKU dimensions | Item master | **Not required** for pick-path | N/A |
| Historical pick times | WMS event log | **No** (cold start) | Use industry defaults (e.g., 4s per pick face); refine after 30 days |

**Minimum viable data gate:** ≥95% of active pick faces have coordinates; ≥90% inventory accuracy on A-items before enabling dynamic routing.

### 3.2 3D Cartonization

| Data Element | Source | Usable on Day 1? | Mitigation |
|--------------|--------|------------------|------------|
| SKU L×W×H×weight | Item master, dimensioning scale, supplier data | **30–50% missing** typical | Block cartonization for SKUs without dims; force dim capture at receiving |
| Fragility / orientation | Item master flags | **Rarely exists** | Default non-fragile; supervisor override |
| Carton catalog | WMS config (operator's box SKUs) | **Yes** — operator knows their boxes | Onboarding template: 5–15 standard cartons |
| Carrier DIM rules | Carrier API or static divisor table | **Yes** | Ship with UPS/FedEx published divisors |

**Minimum viable data gate:** Cartonization enabled only when 100% of line items in an order have validated dimensions.

### 3.3 Routing Guide Compliance Extraction

| Data Element | Source | Usable on Day 1? | Mitigation |
|--------------|--------|------------------|------------|
| Routing guide PDFs | Customer compliance team | **Yes** — they have binders of these | Upload portal; version tagging by retailer + effective date |
| Retailer / DC / ship-to mapping | Customer master | **Yes** | Standard onboarding |
| Label printer capabilities | Hardware profile | **Yes** | Zebra ZPL template library per retailer |
| ASN/EDI 856 field specs | EDI provider (SPS Commerce, etc.) | **Partial** — mappings vary | Pre-built templates for top 5 retailers; custom mapping UI |
| Historical chargeback reasons | Customer AP/disputes (optional) | **Sometimes** in spreadsheets | Phase 2 feedback loop for rule prioritization |

**Minimum viable data gate:** Human-reviewed rule set per retailer before enforcement mode (not just extraction).

---

## 4. Build Complexity & Timeline Detail

### Phase 1 Critical Path (24 weeks max, parallel workstreams)

```
Weeks 1–4:   Foundation — location model, offline mobile shell, integration scaffolding
Weeks 3–10:  Pick-path engine + exception reroute (parallel)
Weeks 4–12:  Cartonization (buy SDK, integrate, pack station UI)
Weeks 5–16:  Compliance extraction pipeline + rule engine + enforcement
Weeks 14–20: Data hygiene gates, shadow mode, A/B vs. static waves
Weeks 18–24: Pilot tuning, latency hardening, dashboard telemetry
```

### Under the Hood (What "AI-First" Actually Requires)

| Feature | What's Actually Running | Custom ML? | Latency Budget |
|---------|------------------------|------------|----------------|
| Pick-path | Graph-based warehouse model + metaheuristic TSP variant (or OR-Tools VRP) + order affinity clustering (co-occurrence matrix, updated nightly) | **No** initially; optional ML for affinity weights in P2 | **<500ms** batch assignment; **<2s** local reroute on exception |
| Cartonization | 3D bin packing (first-fit-decreasing + rotation enumeration); DIM weight calc | **No** — deterministic optimization | **<1s** at pack station |
| Compliance | Document pipeline: PDF → layout-aware OCR (or native text) → LLM structured extraction → JSON rule schema → deterministic validator at print/ship | **Fine-tuned prompts + schema validation**, not fine-tuned model | **Async** for ingestion (minutes); **<200ms** for runtime rule check |
| Copilot (if shipped) | RAG over WMS entities + tool calls to read-only APIs | Off-the-shelf LLM | **2–5s** acceptable (supervisor desktop only) |

---

## 5. Interaction Design: AI-Native UX Patterns

**Design principle:** Floor workers get **embedded, deterministic directives**. Supervisors and compliance managers get **review queues and override panels**. Executives get **telemetry dashboards**. Nobody gets a chatbot as primary workflow.

### Pattern Selection Matrix

| Pattern | Best For | Avoid For | Why |
|---------|----------|-----------|-----|
| **Embedded inline suggestion** (next action, box size, path step) | Pick-path, cartonization, scan validation | Compliance rule authoring | Zero cognitive load; matches RF scanner muscle memory |
| **Blocking validation gate** (hard stop with reason + fix action) | Compliance at label print / pallet build | Pick-path (blocks throughput) | Chargebacks are binary pass/fail; must prevent, not suggest |
| **Human-in-the-loop review queue** | Routing guide extraction, new rule activation | Real-time picking | LLM extraction errors are costly; human signs off once per guide version |
| **Autonomous background agent** | Nightly batch clustering, affinity matrix refresh, compliance diff on new PDF upload | Anything picker-facing in real time | Async is fine; user sees result, not process |
| **Conversational copilot panel** | Supervisor ad-hoc queries ("Why was order X held?") | Floor picker UI | Chat adds taps and latency; pickers need one-thumb operation |
| **Fully automated workflow** | DIM weight calc, route recalc after exception | Compliance enforcement before human review period | Automate math; gate policy changes |

### Recommended Interaction Pattern Per Feature

#### 1. Dynamic Pick-Path & Order Clustering

**Pattern:** Embedded inline + autonomous background batching

**Picker mobile UI:**
- Single "Next pick" card: location, SKU, qty, tote slot. No map, no explanation text.
- Subtle progress ring: "4 of 12 stops · ~800m saved vs. single-order"
- On deviation request: long-press → "Skip / Report empty" → instant reroute, no supervisor PIN for empty bin

**Supervisor dashboard:**
- Live batch map: heatmap of active pickers, congestion zones
- "Override batch" only for supervisor role—never picker-facing

**Rationale:** Pickers distrust visible "AI reasoning." Invisible optimization with escape hatches builds trust. Showing kilometers saved gamifies without blocking flow. Matches ops research: veteran pickers rebel against counterintuitive routes unless exceptions are frictionless.

**Mockup inputs:**
- Next-pick card component (large tap target, high contrast)
- Exception bottom sheet (3 options: Empty bin / Damaged / Wrong item)
- Supervisor-only batch assignment timeline

---

#### 2. 3D Cartonization

**Pattern:** Embedded inline directive + visual pack diagram

**Packer station UI:**
- Order scan → **one recommended carton** highlighted (e.g., "Use Box #4 — 12×9×6")
- Static 3D or isometric pack diagram showing item placement (no rotation animation on low-end hardware)
- DIM weight vs. actual weight shown inline: "Est. billable: 2.4 lb ✓"
- Override requires reason code (triggers master data hygiene alert if frequent)

**Rationale:** Packers guess boxes today. Replace guesswork with a single authoritative answer. Override path captures data for missing dims without blocking the line.

**Mockup inputs:**
- Pack station portrait display (tablet or fixed monitor)
- Carton selector with one AI pick pre-selected
- Override reason dropdown

---

#### 3. Routing Guide Compliance (LLM Extraction)

**Pattern:** Autonomous background agent + human-in-the-loop review queue + blocking validation gate

**Compliance manager desktop UI:**
- Upload PDF → processing status stream ("Extracted 47 rules — 3 ambiguous")
- Side-by-side: PDF snippet ↔ structured rule card
- Approve / Edit / Reject per rule; "Activate for Walmart DC #6012" toggle
- Diff view when new guide version uploaded

**Floor enforcement (pack/ship station):**
- At label print: **hard block** if violation — "GS1-128 label position: must be 2–4 in from bottom. [Reprint template]"
- No chat explanation on floor; error message is actionable

**Rationale:** LLM extraction is never trusted day-one. Review queue is the product. Differentiation is **versioned, auditable rules enforced at transaction time**—not a summary chatbot. This is where domain depth matters: rule schema must encode retailer-specific ASN timing, pallet height, label symbology.

**Mockup inputs:**
- Rule review queue (list + detail drawer)
- PDF highlight ↔ rule card split pane
- Pack station blocking modal (red, single fix action)

---

#### 4. Exception-Aware Rerouting (Cross-Cutting)

**Pattern:** Embedded inline recalc

- Picker taps "Bin empty" → 2-second spinner on device → new pick list fragment injected
- No "AI is thinking" copy; show "Rerouted to Reserve B-14"

**Rationale:** Exception handling is the #1 trust-killer if slow or supervisor-dependent.

---

#### 5. Ops Copilot (Phase 1.5 — Supplement Only)

**Pattern:** Conversational panel on supervisor desktop only

**Scoped capabilities (read-only Phase 1.5):**
- "What orders are at compliance risk today?"
- "Why did picks/hour drop in Zone C?"
- "Which SKUs are missing dimensions?"

**Explicitly NOT in scope:** "Rebatch all orders" or free-form workflow mutation via chat.

**Rationale:** Without tool-gated actions and domain schema, copilot is a thin GPT wrapper. Read-only RAG over WMS entities is useful for supervisors already living in dashboards.

---

## 6. Build vs. Buy vs. Fine-Tune

| Feature | Recommendation | Specifics |
|---------|----------------|-----------|
| **Pick-path optimization** | **Build** (algorithm) + **Buy** (OR-Tools or similar solver library) | Commercial WMS routing modules (Lucas, Softeon) are expensive and not composable. OR-Tools VRP or custom A* on warehouse graph is 4–6 week build. Do not train neural route model in P1. |
| **Order affinity clustering** | **Build** (simple) | Co-occurrence counting from order lines; upgrade to ML in P2. |
| **Cartonization** | **Buy** SDK + **Build** integration | Evaluate: Paccurate API, 3DBinPacking.com API, or open-source 3d-bin-container-packing. Build pack UI and DIM calc. Do not train CV for dims in P1. |
| **Routing guide extraction** | **Buy** document AI + **Build** rule engine | Azure Document Intelligence, AWS Textract, or Reducto for layout-aware parse; GPT-4o/Claude for structured extraction into **your** JSON schema with validation. Build the rule executor and version control yourself—that's the moat. |
| **Compliance runtime checks** | **Build** | Deterministic rule engine (not LLM at runtime). LLM only at ingestion. |
| **Mobile offline sync** | **Build** on proven stack | WatermelonDB, SQLite, or Realm on React Native / Flutter. Non-negotiable custom. |
| **ERP integrations** | **Buy** middleware where possible | Celigo, Workato, or native Shopify/NetSuite connectors for Phase 1 ICP. SAP custom per customer. |
| **Demand forecasting** | **Defer; Buy when needed** | Prophet, Amazon Forecast, or NetSuite native—don't build in P1. |
| **Computer vision receiving** | **Defer; Buy hardware+API** | CubiScan / FreightSnap API when customer has hardware. |
| **Ops copilot** | **Buy** LLM API + **Build** RAG/tools | Standard stack; low differentiation alone. |

---

## 7. Differentiation Risk: Thin Wrapper vs. Deep Domain

| Approach | Feels Thin / Gimmicky | Genuinely Differentiating |
|----------|----------------------|---------------------------|
| Chatbot on dashboard | "How many orders today?" | Same query available in reports |
| LLM summarizes routing guide | Pretty summary; no enforcement | Extracted rules → **block non-compliant ship** |
| "AI-powered" static waves | Rebrand of batch job | Sub-second dynamic reroute on exception |
| Generic demand forecast widget | Cold-start garbage | No |
| Cartonization suggestion with 50% override rate | Missing data not gated | 100% dim gate + receiving capture loop |
| Pick-path without offline | WiFi dead zone = dead product | Offline-first with local graph |

**Moat hierarchy (defensibility):**
1. **Compliance rule graph** — retailer × DC × constraint versions, audit trail, chargeback prevention
2. **Warehouse spatial model** — accurate bin graph + congestion feedback loop
3. **Operational event corpus** — pick times, override reasons, exception patterns (compounds over time)
4. **LLM chat interface** — commoditized; do not lead GTM here

---

## 8. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
|----|------|------------|--------|------------|-------|
| R1 | **Master data garbage** — missing dims, wrong bin coords | **High** | Cartonization useless; routes to empty bins | Data hygiene gate; block AI features until thresholds met; dim capture at receiving | Product + CS onboarding |
| R2 | **WiFi dead zones** cause scanner hangs | **High** | Picker revolt, force-confirms | Offline-first mobile; local route graph; background sync queue | Engineering |
| R3 | **Picker trust collapse** after one bad route | **Medium** | Abandonment of dynamic batching | Exception reroute <2s; shadow mode for 2 weeks; show distance-saved metric | Product + Ops |
| R4 | **LLM hallucination on compliance rules** | **Medium** | Chargebacks persist; legal exposure | Human review queue mandatory; never auto-activate; deterministic runtime validator | AI + Compliance SME |
| R5 | **Routing guide version drift** | **High** | Stale rules | Retailer subscription monitoring; customer upload prompts; diff alerts | Product |
| R6 | **Cold-start affinity clustering** | **Medium** | Suboptimal batches weeks 1–4 | Fallback to zone-proximity batching until 30-day co-occurrence matrix | Engineering |
| R7 | **Latency on batch recalc at peak** (10k+ open lines) | **Medium** | Stale assignments | Pre-compute batches every 60–120s; incremental assignment for new orders | Engineering |
| R8 | **Carton catalog mismatch** (operator uses non-standard boxes) | **Medium** | Overrides spike | Onboarding carton audit; allow custom box add with dim entry | Product |
| R9 | **Integration fragility** (Shopify rate limits, NetSuite sandbox drift) | **Medium** | Order queue gaps | Webhook + poll hybrid; dead-letter queue; supervisor alert | Engineering |
| R10 | **"AI surveillance" labor backlash** | **Medium** | Union grievance, sabotage | No individual pace ranking in P1; team-level metrics; position as walk-reduction | GTM + Product |
| R11 | **CV receiving accuracy in poor lighting** | **High** (if pursued P2) | Phantom inventory | Defer; use dimensioning stations not ceiling cameras | Roadmap gate |
| R12 | **Peak season reliability** (BFCM) | **Medium** | Revenue loss, churn | Load test 3× peak; circuit breakers; degrade to static zone pick | SRE |
| R13 | **Override culture** — packers ignore cartonization | **Medium** | No freight ROI | Track override rate; tie supervisor dashboard; DIM cost visibility | Product |
| R14 | **SAP/enterprise ERP expectation creep** | **Medium** | 6-month integration detours | Phase 1 ICP = Shopify + NetSuite; SAP explicit Phase 3 | GTM |

---

## 9. Phase 1 Scope Recommendation (Ship / Hold / Kill)

### Ship (Core AI Trifecta + Foundation)

| Capability | Weeks | Dependency |
|------------|-------|------------|
| Master data onboarding + hygiene gates | 4–6 | None |
| Offline-first scanner app shell | 4–6 | None |
| Dynamic pick-path + clustering | 8–12 | Location + inventory accuracy |
| Exception reroute | 4–6 | Pick-path |
| Cartonization engine + pack UI | 6–10 | SKU dimensions |
| Routing guide ingestion + review + enforcement | 10–14 | Label/ASN integrations |
| Supervisor telemetry dashboard | 4–6 | All above |

**Total engineering:** ~4–6 months with parallel squads (Mobile, Optimization, Compliance/AI, Integrations).

### Hold (Phase 1.5 — Month 4–6 if ahead of schedule)

- Read-only ops copilot for supervisors
- Anomaly-triggered cycle count suggestions (rule-based, not ML)

### Kill / Defer from Phase 1

- Dynamic slotting execution (recommend only in P2)
- Computer vision receiving
- Demand forecasting / reorder automation
- Predictive labor scheduling
- Robotics / AMR orchestration
- Autonomous agents that mutate production data without approval
- Pick-path deep learning model

---

## 10. Mockup / Prototype Priorities

For high-fidelity mocks, build in this order:

1. **Picker mobile — Next Pick + Exception flow** (validates core adoption hypothesis)
2. **Pack station — Cartonization directive** (visual ROI for buyer)
3. **Compliance — Rule review queue + blocking ship modal** (differentiation story)
4. **Supervisor dashboard — Big Three widgets** (per dashboard specs doc)
5. **Onboarding — Data hygiene progress gate** (shows AI readiness, not magic)

**Do not mock first:** Copilot chat panel, demand forecast graphs, computer vision receiving, digital twin floor view.

---

## 11. Answers to Mandate Research Questions (Summary)

1. **Capability tiering:** Table stakes = static picking, min/max, basic slotting. Differentiators = dynamic pick-path, native cartonization, compliance rule extraction + enforcement. Aspirational = CV receiving, dynamic slotting execution, labor scheduling, autonomous agents.

2. **Data dependency:** Pick-path needs coordinates + inventory accuracy (often incomplete). Cartonization needs SKU dims (major gap). Compliance needs PDFs (customers have them) + human review (you build). Assume 30–60 day warm-up before ML-adjacent features shine.

3. **Build complexity:** P1 features are primarily **deterministic optimization + LLM extraction**, not custom model training. 3–6 months realistic with disciplined scope. Integrations and offline mobile are equal risk to algorithms.

4. **Interaction design:** Floor = embedded directives. Compliance = review queue + hard blocks. Supervisors = dashboards + optional read-only copilot. Background agents for async work only.

5. **Differentiation risk:** Chatbot = thin. Rule engine with audit trail + scan-time enforcement = thick. Show the compliance diff and the kilometers-saved counter, not "Powered by AI" badges.

6. **Technical risk flags:** Data hygiene, WiFi/offline, picker trust, LLM extraction accuracy, peak load, override culture. Flag these in sprint 1, not post-pilot.

---

## Sources & Assumptions

**Grounded in:**
- `0-research/02-warehouse-ops-features.md` — workflow pain map, top-3 feature shortlist, adoption failure modes
- `0-research/01-market-competitive-strategy.md` — competitive AI maturity, ICP definition
- `0-research/02-dashboard-specs.md` — telemetry and trust-building UI requirements

**Technical assumptions from industry practice:**
- OR-Tools and commercial 3D bin-packing APIs are production-viable for mid-market scale
- LLM structured extraction achieves 85–95% rule recall with layout-aware document parsing + human review (varies by guide quality)
- Mid-market warehouses typically lack engineered labor standards and CV hardware
- Sub-second mobile UI response is mandatory for picker adoption (general industry knowledge)

**Explicit unknowns requiring customer validation during discovery calls:**
- Actual SKU dimension completeness at migration
- Inventory accuracy baseline pre-WMS
- Retailer mix (% DTC vs. wholesale) determines compliance feature priority
- Handheld hardware fleet (Zebra vs. consumer Android)
