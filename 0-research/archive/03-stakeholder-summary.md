---
artifact: stakeholder-summary
version: "1.0"
created: 2026-07-04
status: draft
project: ai-first-wms
phase: discover
---

# Stakeholder Summary: AI-First WMS Phase 1 Scoping

## Overview

**Project:** AI-first Warehouse Management System — Phase 1 product scoping pack
**Purpose:** Map who shapes, buys, uses, and blocks an AI-first WMS so Phase 1 features and roadmap serve real decision-makers — not only "the warehouse" as an abstraction.
**Date:** 2026-07-04
**Owner:** Case study discovery pack (Justin)

> **Mode note:** No named internal org was provided (case study brief). Stakeholders below are **archetypal** for a mid-market WMS sale and for a product team building Phase 1. Treat as a working map to validate in interviews.

## Stakeholder Map

```
                    [High Interest]
                          |
        KEEP SATISFIED    |    MANAGE CLOSELY
     IT / Security        |  Warehouse Ops Manager
     Finance (budget)     |  Head of Supply Chain / COO
                          |  Floor Supervisors
                          |  Product Sponsor (build side)
[Low Influence] ----------+---------- [High Influence]
                          |
        MONITOR           |    KEEP INFORMED
     Carriers             |  Pickers / Packers (end users)
     Peripheral apps      |  3PL Clients (if 3PL seller)
                          |  Customer Success / Implementation
                    [Low Interest]
```

### Quadrant Placement

**Manage Closely (High Influence, High Interest):**
- Warehouse Operations Manager (economic buyer often shares with COO)
- Head of Supply Chain / COO
- Floor Supervisors (adoption gate)
- Product / Engineering leadership (build-side prioritization)

**Keep Satisfied (High Influence, Lower day-to-day Interest):**
- IT / Security (integration, data, SSO, uptime)
- Finance / CFO (ROI, contract, payback)

**Keep Informed (Lower formal Influence, High Interest):**
- Pickers, packers, receivers (daily users — informal veto via non-adoption)
- 3PL client stakeholders (service visibility)
- Implementation / Customer Success

**Monitor (Lower Influence, Lower Interest):**
- Carriers and parcel APIs
- Adjacent tool vendors (Shopify, accounting) unless integration-critical

## Stakeholder Profiles

| Stakeholder | Role | Influence | Interest | Alignment | Key Need |
|-------------|------|-----------|----------|-----------|----------|
| Warehouse Ops Manager | Runs site KPIs | High | High | Supportive if ROI clear | Throughput, accuracy, labor productivity |
| Head of Supply Chain / COO | P&L / network decisions | High | High | Neutral→Supportive | Scalable ops, fewer fire drills |
| Floor Supervisor | Day-of execution | Medium–High | High | Resistant if UX slows floor | Simple tools, fewer exceptions |
| Pickers / Packers | Execute tasks | Low formal / High informal | High | Neutral | Fast, clear, handheld-friendly work |
| IT / Security | Systems approval | High | Medium | Cautious | Secure integrations, reliability |
| Finance | Budget approval | High | Medium | Neutral | Payback < 12 months, predictable SaaS |
| 3PL Client (if applicable) | Pays 3PL for service | Medium | Medium–High | Supportive if visibility ↑ | Stock/order truth, proactive alerts |
| Product Sponsor (build) | Ships Phase 1 | High | High | Supportive | Credible Phase 1 scope + mocks |

## Detailed Stakeholder Analysis

### Warehouse Operations Manager

**Role:** Owns site performance (orders/hour, accuracy, OT, inventory integrity)
**Influence Level:** High — often champions or kills WMS selection
**Interest Level:** High — lives inside the problem daily
**Current Alignment:** Supportive *if* AI reduces chaos rather than adding dashboards

**Needs:**
- Real-time control of work on the floor
- Fewer stockouts, mis-picks, and end-of-day surprises
- Success = measurable lift in lines/hour and inventory accuracy within one quarter

**Concerns:**
- "AI" that is vaporware or requires a data science team
- Go-live disruption during peak season
- Training burden on high-turnover labor

**What Motivates Them:**
- Hitting SLA and labor budget; looking competent to leadership

**Preferred Communication:**
- Channel: Live demo on *their* workflow + ROI one-pager
- Frequency: Weekly during evaluation; daily during pilot
- Style: Operational metrics, before/after scenarios

---

### Head of Supply Chain / COO

**Role:** Network and cost structure decisions; signs larger contracts
**Influence Level:** High — budget and strategic vendor choice
**Interest Level:** High at decision points; lower in feature detail
**Current Alignment:** Neutral until risk and ROI are clear

**Needs:**
- A platform that scales across sites without linear headcount
- Reduced dependency on tribal knowledge and hero supervisors
- Success = lower cost-to-serve and predictable fulfillment performance

**Concerns:**
- Multi-year enterprise lock-in (Manhattan-class) vs. underpowered tools
- Integration risk with ERP/commerce stack
- Vendor viability

**What Motivates Them:**
- Margin, customer promises, operational resilience

**Preferred Communication:**
- Channel: Executive briefing + pilot scorecard
- Frequency: Milestone-based
- Style: Business outcomes, risk, roadmap confidence

---

### Floor Supervisor

**Role:** Assigns work, clears exceptions, keeps shifts on plan
**Influence Level:** Medium–High on adoption; Medium on purchase
**Interest Level:** High
**Current Alignment:** Often resistant to systems that add taps or hide problems

**Needs:**
- Instant visibility into blockers (short picks, missing ASN, zone backlog)
- Ability to re-prioritize without rebuilding waves manually
- Success = fewer radio calls and less end-of-shift cleanup

**Concerns:**
- AI recommendations they cannot override or explain to the team
- Alert fatigue

**What Motivates Them:**
- Shift ends clean; team hits rate without burnout

**Preferred Communication:**
- Channel: Hands-on pilot on handheld + supervisor console
- Frequency: Daily in pilot
- Style: Concrete exception scenarios

---

### Pickers / Packers / Receivers

**Role:** Execute directed work
**Influence Level:** Low on purchase; High informal (shadow processes if UX fails)
**Interest Level:** High for usability; Low for strategy
**Current Alignment:** Neutral

**Needs:**
- Clear next action, minimal screens, reliable scans
- Success = less walking, less confusion, fair tasking

**Concerns:**
- Being "managed by AI" punitively (rate surveillance without support)
- Slow devices / dead zones

**What Motivates Them:**
- Finish work, avoid errors that cause blame, reasonable pace

**Preferred Communication:**
- Channel: In-flow product UX (not emails)
- Frequency: Continuous via UI
- Style: Simple language, visual cues

---

### IT / Security

**Role:** Approves architecture, identity, data flows
**Influence Level:** High (can block)
**Interest Level:** Medium
**Current Alignment:** Cautious

**Needs:**
- SSO, role-based access, audit logs, uptime SLAs
- Clean APIs to ERP/commerce; no brittle spreadsheets
- Success = low incident rate, maintainable integrations

**Concerns:**
- Shadow AI tools leaking data; unclear model training on customer data
- Another system of record fighting ERP

**What Motivates Them:**
- Risk reduction and operational stability

**Preferred Communication:**
- Channel: Security questionnaire + architecture review
- Frequency: Evaluation and major releases
- Style: Technical, compliance-oriented

---

### Finance

**Role:** Approves spend and tracks ROI
**Influence Level:** High on deal close
**Interest Level:** Medium
**Current Alignment:** Neutral

**Needs:**
- Clear pricing vs. Cin7-like alternatives and vs. enterprise quotes
- Payback narrative (labor hours, error cost, chargebacks)
- Success = predictable SaaS + proven pilot metrics

**Concerns:**
- Scope creep implementation fees; AI features gated behind expensive tiers

**What Motivates Them:**
- Unit economics and budget certainty

**Preferred Communication:**
- Channel: ROI model + contract summary
- Frequency: Evaluation and renewal
- Style: Numbers-first

## Key Relationships

### Dependencies

| From | To | Dependency Type |
|------|-----|-----------------|
| Ops Manager | Finance / COO | Budget approval |
| IT | Ops Manager | Integration go-live |
| Supervisors | Pickers | Adoption and data quality |
| Product (build) | Ops personas | Problem validation for Phase 1 |
| CS / Implementation | All site roles | Time-to-value |

### Alliances

- **Operations coalition:** Ops Manager + Supervisors + COO when pain is acute (peak failures, labor shortage)
- **Risk coalition:** IT + Finance when vendor or security concerns dominate

### Potential Conflicts

| Parties | Conflict Area | Risk Level |
|---------|---------------|------------|
| Ops Manager vs IT | Speed of rollout vs security/integration rigor | High |
| Supervisors vs AI tasking | Override control vs optimization | High |
| Finance vs Product | Breadth of Phase 1 vs cost/timeline | Medium |
| Pickers vs Labor analytics | Productivity insight vs surveillance fears | Medium |

## Communication Plan

| Stakeholder | Frequency | Channel | Content | Owner |
|-------------|-----------|---------|---------|-------|
| Ops Manager | Weekly in discovery / pilot | Demo + scorecard | KPI movement, exception themes | PM / Sales |
| COO | Milestone | Exec brief | ROI, risk, roadmap | PM / Lead |
| Supervisors | Daily in pilot | Floor walkthrough | Exception UX, override rules | Implementation |
| IT | Evaluation + release | Security pack | Data handling, APIs, SLA | Solutions Eng |
| Finance | Evaluation | ROI sheet | ACV, payback, comparables | Sales |
| End users | Continuous | Product UI | Task clarity, feedback prompt | Product |

## Risk Mitigation

### Resistant Stakeholders

| Stakeholder | Concern | Mitigation Strategy | Owner |
|-------------|---------|---------------------|-------|
| Floor Supervisors | Unexplainable AI | Always-on override + "why this task" rationale in UI | Product |
| IT | Data / model risk | Explicit data-use policy; no training on customer data without contract | Legal + Eng |
| Pickers | Surveillance | Frame AI as path reduction and assist, not only rate policing; transparent metrics | Product + Ops champion |
| Finance | Unclear ROI | Pilot with pre-agreed success metrics (lines/hour, accuracy, exception aging) | PM |

### Political Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Peak-season go-live pressure | Failed pilot becomes permanent "no" | Pilot in shoulder season; limited SKU/zone scope |
| ERP owners defend status quo | Block integration | Position as execution layer, not financial system of record |
| AI hype backlash | Credibility loss | Ship measurable execution features first; avoid chatbot-only demos |

## Action Items

- [ ] Confirm primary economic buyer (Ops Manager vs COO) per ICP segment (3PL vs brand)
- [ ] Schedule supervisor + picker shadow sessions for journey validation
- [ ] Draft security one-pager (data retention, model training, SSO)
- [ ] Define pilot success metrics with Finance-friendly ROI framing
- [ ] Decide Phase 1 feature set against Ops Manager + Supervisor jobs (not only buyer slides)

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2026-07-04 | Initial creation from case study brief (archetypal stakeholders) | Justin / discover phase |

---

*Review and update when real customer names and internal build-side stakeholders are known.*
