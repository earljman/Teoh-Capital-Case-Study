# AI-First WMS Case Study — Advisory Panel & Build Plan

A working reference for the Teoh Capital case study: an eight-member expert panel used to sharpen decisions while building, the routing that puts them to work, and the planned output they're meant to produce.

**Context:** Product scoping pack for an AI-first Warehouse Management System (WMS). Deliverable is a slide/PPT pack covering a near-term roadmap, the top 3 phase-1 features, and high-fidelity mocks. Two questions remain open with the reviewer: target market (commercial SaaS sold to operators vs. the operating system for a Teoh-owned warehousing business) and build/maintenance ownership. The panel is a thinking tool, not deck content — weighted toward the *meta* (what to build, what will impress reviewers) and *delivery* (prototype + slide craft), with domain depth kept deliberately light.

---



## The Panel

Each member is named by function so they can be summoned by role alone ("what does the Editor say about this slide?"). Usage is intentionally uneven — specialists cluster where they matter rather than attending everything.


| #   | Member              | Role                           | Lens                                                                                       | Signature question                                                             |
| --- | ------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| 1   | **The Judge**       | Reviewer's proxy               | Hire-or-not; memorable-or-forgettable, the way Cheffrey and the Teoh partners will read it | *"What's the one idea they'll repeat to each other after you leave the room?"* |
| 2   | **The Storyteller** | Narrative architect            | The deck as a story with a spine an exec can follow at a glance                            | *"If they only see slides 1, 5, and the mock — do they still get it?"*         |
| 3   | **The Builder**     | Prototype craftsperson         | Mocks that read as a real, shipped product — real data, considered states                  | *"Does this look built, or does it look sketched?"*                            |
| 4   | **The Editor**      | Scope editor                   | Light-research / strong-delivery; guards hours, kills filler, enforces the 80/20           | *"Is this earning its place, or are you avoiding the hard part — the mock?"*   |
| 5   | **The Investor**    | Commercial / Teoh lens         | Value, moat, why-now; keeps it commercially literate without becoming a diligence memo     | *"Does the strategy read like an investable thesis, or a feature list?"*       |
| 6   | **The Insider**     | WMS plausibility check (light) | Domain sanity — nothing that makes a logistics person wince                                | *"Would someone who knows WMS nod, or cringe?"*                                |
| 7   | **The Skeptic**     | Dedicated adversary            | Attacks the bet, the market assumption, and the roadmap for weakness                       | *"Where does this fall apart under one hard question?"*                        |
| 8   | **The Closer**      | Live delivery                  | How the pack plays when presented and defended in the next round; Q&A handling             | *"When they push back live, what's your answer?"*                              |


---



## How to Use the Panel

Don't poll everyone on everything. **Route each decision to the four members who genuinely have a stake.** The value isn't the individual notes — it's the *tensions* between members, which mirror the tradeoffs the reviewer will probe.

### The productive tensions

- **The Judge** wants a bold, differentiated swing ↔ **The Insider** wants nothing naïve. Your edge lives in the gap between them.
- **The Investor** wants a sharp niche wedge ↔ **The Editor** caps the total effort. That fight *is* your scope allocation.
- **The Builder** and **Storyteller** want hours poured into craft ↔ **The Editor** protects the budget. That fight *is* your effort allocation.
- **The Skeptic** attacks for weakness ↔ **The Judge** evaluates for appeal. Different jobs; run both.



### Two flags to keep in view

- **With research intentionally light, the Judge and Editor are your most important voices** — one decides the single memorable bet, the other protects the hours to execute it beautifully. Consult them first.
- **The market question rewires seats 5 and 6.** If commercial SaaS: the Investor asks "will customers buy?" and the Insider models an external operator. If Teoh-owned operator: the Investor asks "does this lower cost-to-serve and build an asset?" and the Insider becomes an internal stakeholder. The panel is robust either way — just note which version you're consulting once the reviewer answers.

---



## The Build Process (11 steps, 4 members each)

Steps 2 and 3 are **decisions, not tasks** — everything downstream inherits them. Resolve the top of the list before building mocks, or you'll craft beautiful screens for the wrong product.


| #   | Step                                                                                            | Panel                                 |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1   | Frame the problem — pick the single sharpest framing that hooks in 90 seconds                   | Judge, Storyteller, Investor, Skeptic |
| 2   | **Choose the differentiating bet** — the memorable "AI-first" angle (highest-leverage decision) | Judge, Investor, Skeptic, Insider     |
| 3   | **Lock the market assumption** — state it boldly, make it defensible                            | Investor, Insider, Skeptic, Editor    |
| 4   | Cut to the top 3 features — painkiller-vs-vitamin on every candidate                            | Editor, Investor, Insider, Skeptic    |
| 5   | Sequence the roadmap — as an investable arc (wedge → expand → moat)                             | Storyteller, Investor, Editor, Judge  |
| 6   | Set the depth dial per feature — what to detail vs. plausibly imply                             | Editor, Insider, Builder, Skeptic     |
| 7   | Mock information architecture — screens, states, where AI surfaces and is overridden            | Builder, Insider, Storyteller, Editor |
| 8   | Produce the hi-fi mocks — fidelity where the eye lands                                          | Builder, Insider, Judge, Editor       |
| 9   | Build the slide skeleton — every slide earns its place; research to appendix                    | Storyteller, Editor, Judge, Investor  |
| 10  | Red-team the full draft — mock-review as if ranking you against other candidates                | Skeptic, Judge, Investor, Closer      |
| 11  | Final "one thing they repeat" test — does the memorable idea survive to the last read?          | Judge, Storyteller, Closer, Skeptic   |


**On the asymmetry:** the Skeptic and Judge appear seven times each; the Builder three; the Closer twice. That's deliberate — specialists cluster where they matter. Even coverage would mean padding had crept back in. The Closer is the genuine optional seat (live defense is a late concern); keep him because a next-round interview is coming.

---



## The Planned Output

What the panel is meant to produce before you build a single slide: a **ruthless include/cut list** and a **slide-by-slide skeleton**, both pre-blessed by the relevant members.

### A. Include / Cut / Imply list

**Invest real hours (this is where you win):**

- The differentiating "AI-first" bet — stated once, sharply, and threaded through everything.
- The **3-feature portfolio slide** — 1 AI-native + 2 AI-enhanced priority features; painkiller logic and how AI differs in each.
- The three phase-1 feature mocks — high fidelity, real data, considered empty/error/loading states, visible AI + operator override.
- The **roadmap checkpoint slides** (Week 4 + Week 12) — build scope, meetings, documents, decisions; shows you can run a real delivery rhythm.
- The narrative spine — problem → insight → thesis → portfolio → roadmap → features → why-this-wins.
- The commercial thesis — enough Teoh-flavored value/moat/why-now to read as investable.
- The **process section** (slides 15–18) — Research → Planning → Development with prompts/skills; proves PM + builder craft.

**Imply convincingly (light touch, don't over-build):**

- Competitive landscape — one sharp positioning view, not five teardowns.
- Integration surface (ERP, carriers, e-comm, EDI, hardware) — name them, don't architect them.
- Market sizing — directional and credible, not a full TAM model.

**Cut (risk without reward):**

- Exhaustive feature backlogs.
- Deep technical architecture / model details.
- Domain minutiae that risks a wince without adding memorability.
- Any slide that doesn't advance the one idea they'll repeat.



### B. Slide-by-slide skeleton (core spine, ~18 slides)



#### Act I — Thesis & positioning (slides 1–5)

1. **Title + one-liner** — the memorable thesis in a single sentence.
2. **The problem** — one sharp framing; the pain, not a landscape survey.
3. **Market & wedge** — the stated ICP assumption, owned confidently.
4. **The AI-first bet** — the differentiating idea; why this is *AI-first*, not AI-bolted-on.
5. **Positioning** — one view vs. the five named competitors; where you deliberately don't play.



#### Act II — Phase 1 scope & delivery rhythm (slides 6–9)

1. **Phase 1 feature portfolio** — the 3-feature model, stated explicitly:
  - **1 AI-native feature** — the anchor bet; AI is the product, not a layer on top.
  - **2 priority features** — core WMS workflows that the prototype will focus on; each **AI-enhanced** (suggest, automate, explain — with operator override).
  - Painkiller logic for each; how AI shows up differently in native vs. enhanced.
2. **Roadmap arc** — investable sequence (wedge → expand → moat) plus the **two prototype checkpoints** that pace delivery: **Week 4** (validated prototype) and **Week 12** (production-ready Phase 1 slice).
3. **Checkpoint: Week 4 prototype** — what ships, who signs off, what gets decided:
  - **Build scope:** clickable hi-fi mocks for all 3 features; happy-path flows; AI surfaces visible; no production integrations.
  - **Stakeholder meetings:** concept review with ops lead + sponsor (60 min); mock walkthrough with 1–2 warehouse personas (45 min each).
  - **Documents:** solution brief, feature acceptance criteria (Given/When/Then), IA / screen map.
  - **Decisions to lock:** ICP assumption, the AI-native bet, feature priority order, what “done” looks like at Week 12.
4. **Checkpoint: Week 12 build** — what ships, who signs off, what gets decided:
  - **Build scope:** working prototype covering all 3 features; real sample data; loading/empty/error states; AI + override paths; deployable demo environment.
  - **Stakeholder meetings:** sprint review/demo (bi-weekly); UAT session with ops users; go/no-go for Phase 2 scope.
  - **Documents:** PRD slice, edge-case catalog, instrumentation spec (events to measure), release notes draft.
  - **Decisions to lock:** Phase 2 expansion bets, integration priorities (ERP/carriers/EDI), build-vs-buy on AI infra, commercial packaging hypothesis.



#### Act III — Feature deep dives (slides 10–12)

1. **Feature 1 — AI-native** — deep dive + hi-fi mock. Name the bet; show the AI loop (input → recommendation → action → audit trail); operator override as first-class UI.
2. **Feature 2 — priority + AI-enhanced** — deep dive + hi-fi mock. Core workflow first; call out exactly where AI assists vs. where the operator owns the decision.
3. **Feature 3 — priority + AI-enhanced** — same structure as Feature 2; distinct pain point, same enhancement pattern.



#### Act IV — Commercial close (slides 13–14)

1. **Why this wins** — commercial thesis, moat, why-now (Teoh lens).
2. **Assumptions & risks** — including open market/ownership questions, framed as deliberate calls.



#### Act V — How this deck was built (slides 15–18)

*Meta section — demonstrates PM + builder craft; not filler. Keep tight; one slide per phase.*

1. **Process overview** — Research → Planning → Development pipeline; what each phase produced and how it fed the next.
2. **Research** — inputs (`case-study-prompt.md`, competitor set), research-team personas / prompts, skills used (`discover-competitive-analysis`, `discover-market-sizing`, `discover-journey-map`, `discover-stakeholder-summary`), key artifacts in `0-research/`.
3. **Planning** — advisory panel routing, decisions locked (bet, ICP, top 3), skills used (`foundation-prioritized-action-plan`, `define-problem-statement`, `develop-solution-brief`, `deliver-prd`), artifacts in `1-plan/`.
4. **Development** — tech-stack choices and why; prototype build approach; skills/prompts used (`frontend-slides`, `utility-slideshow-creator`, builder craft); live demo / repo pointer; emphasis on shipped code, not just mocks.

- **Appendix** — full competitive detail, integration surface, market-sizing tables, research citations, anything that would clog the spine.

**Test before sending:** if the reviewer sees only slides 1, 4, 6, and the AI-native feature mock (slide 10), do they still get the whole idea — the bet, the 3-feature model, and why it's AI-first?

---

*Use this as a routing map, not a checklist. The panel earns its keep in the disagreements — resolve the bet and the market first, protect the hours for the mocks, and let the Skeptic hit the draft before the reviewer does.*