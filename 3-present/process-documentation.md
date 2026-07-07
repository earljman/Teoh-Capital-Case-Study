# Process Documentation — Slide Content Source

Content for Act V (slides 15–18). Pull from here when building the deck; keep slides visual, this file is the detail layer.

---

## Slide 15 — Appendix bridge

**Headline:** Appendix: build method and controls

| Phase | Goal | Primary output |
|-------|------|----------------|
| **Research** | Ground the bet in market, competitive, and operator reality | `0-research/` artifacts |
| **Planning** | Lock ICP, AI-native bet, top 3 features, roadmap checkpoints | `1-plan/` decisions + briefs |
| **Development** | Ship hi-fi mocks + working prototype; prove builder craft | `2-build/demo/` |
| **Present** | Assemble the reviewer-facing deck and deploy the full site | `3-present/` |

**Thread:** Each phase has explicit prompts/personas and pm-skills; nothing is ad-hoc generation.

---

## Slide 16 — Workflow overview

**Headline:** Research -> Planning -> Development -> Present

**Message:** AI accelerated artifact creation across all four phases, with human gates enforcing decision quality before moving to the next phase.

---

## Slide 17 — Research + Planning workflow

**Inputs**
- `_meta/case-study-prompt.md` and research personas
- Research synthesis + `_meta/advisory-panel.md` routing

**Skills invoked**
- `discover-competitive-analysis` / `discover-market-sizing` / `discover-journey-map` / `discover-stakeholder-summary`
- `foundation-prioritized-action-plan` — cut list, effort allocation
- `define-problem-statement` — single sharp framing for slide 2
- `develop-solution-brief` — one-pager for Week 4 checkpoint
- `deliver-prd` — Phase 1 slice for Week 12 checkpoint

**Advisory panel gates**
- Steps 2–3: lock AI-native bet + market assumption (before mocks)
- Step 4: cut to top 3 (1 AI-native + 2 AI-enhanced)
- Step 5: sequence roadmap + checkpoint rhythm

**Key artifacts** (`1-plan/` — to be populated)
- Solution brief, feature portfolio rationale, checkpoint decision log

---

## Slide 18 — Development + Delivery workflow

**Emphasis:** show toolchain plus quality controls; prove AI usage without surrendering judgment.

**Skills / tools invoked**
- `frontend-slides` / `utility-slideshow-creator` — deck build
- Builder panel lens — fidelity, real data, considered states
- (TBD) Framework, hosting, AI integration pattern

**Prototype checkpoints**
- **Week 4:** static/c clickable mocks, all 3 features, AI surfaces visible
- **Week 12:** working prototype, sample data, error/loading/override paths, demo URL

**Artifacts**
- `2-build/demo/` — app source
- `3-present/` — presentation deck + slide build notes

**Talking point:** AI increased throughput, but humans owned scope decisions, risk tradeoffs, and final story quality.
