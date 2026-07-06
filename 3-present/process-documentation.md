# Process Documentation — Slide Content Source

Content for Act V (slides 15–18). Pull from here when building the deck; keep slides visual, this file is the detail layer.

---

## Slide 15 — Process overview

**Headline:** Research → Planning → Development

| Phase | Goal | Primary output |
|-------|------|----------------|
| **Research** | Ground the bet in market, competitive, and operator reality | `0-research/` artifacts |
| **Planning** | Lock ICP, AI-native bet, top 3 features, roadmap checkpoints | `1-plan/` decisions + briefs |
| **Development** | Ship hi-fi mocks + working prototype; prove builder craft | `2-build/demo/` + `slides/` |

**Thread:** Each phase has explicit prompts/personas and pm-skills; nothing is ad-hoc generation.

---

## Slide 16 — Research

**Inputs**
- `case-study-prompt.md` — scope, competitors, deliverable format
- `0-research/research-team.md` — three parallel research personas (Market & Competitive Strategist, Operator & Workflow Ethnographer, AI/Product Technologist)

**Skills invoked**
- `discover-competitive-analysis` — five-competitor positioning, AI maturity audit
- `discover-market-sizing` — TAM/SAM/SOM for mid-market AI-first WMS
- `discover-journey-map` — operator journey → Phase 1 feature signals
- `discover-stakeholder-summary` — buyer vs. operator vs. sponsor reads

**Key artifacts** (`0-research/archive/`)
- Competitive analysis, market sizing, journey map, stakeholder summary

**Decision surfaced:** ICP wedge, white space, where incumbents are AI-washed vs. real.

---

## Slide 17 — Planning

**Inputs**
- Research synthesis + `advisory-panel.md` routing

**Skills invoked**
- `define-problem-statement` — single sharp framing for slide 2
- `foundation-prioritized-action-plan` — cut list, effort allocation
- `develop-solution-brief` — one-pager for Week 4 checkpoint
- `deliver-prd` — Phase 1 slice for Week 12 checkpoint
- `deliver-acceptance-criteria` — Given/When/Then per feature
- `deliver-edge-cases` — states the mocks must show

**Advisory panel gates**
- Steps 2–3: lock AI-native bet + market assumption (before mocks)
- Step 4: cut to top 3 (1 AI-native + 2 AI-enhanced)
- Step 5: sequence roadmap + checkpoint rhythm

**Key artifacts** (`1-plan/` — to be populated)
- Solution brief, feature portfolio rationale, checkpoint decision log

---

## Slide 18 — Development

**Emphasis:** Show developer skills — stack choices, real code, deployable demo.

**Skills / tools invoked**
- `frontend-slides` / `utility-slideshow-creator` — deck build
- Builder panel lens — fidelity, real data, considered states
- (TBD) Framework, hosting, AI integration pattern

**Prototype checkpoints**
- **Week 4:** static/c clickable mocks, all 3 features, AI surfaces visible
- **Week 12:** working prototype, sample data, error/loading/override paths, demo URL

**Artifacts**
- `2-build/demo/` — app source
- `slides/` — presentation

**Talking point:** The process used AI to accelerate research and planning; the *product* is AI-first — the deck proves both.
