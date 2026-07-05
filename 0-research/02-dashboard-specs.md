---
artifact: dashboard-specs
version: "1.0"
created: 2026-07-06
status: draft
project: ai-first-wms
phase: discover
---

# AI-Powered WMS Dashboard Specs

## Executive Summary

An AI-powered dashboard for a mid-market WMS should prioritize actionable financial metrics, floor exception tracking, and AI-engine telemetry. Below is a breakdown of the key elements, metrics, and widgets to surface.

## 1. The "Big Three" Margin-Killer Watchlist (Executive View)

This section highlights the critical financial leaks that the report explicitly targets. Surfacing these as real-time loss-prevention widgets grabs immediate executive attention.

### Labor Loss vs. Pick Optimization Tracker

- **Metric to surface:** Average picks per hour per worker (Target: 120+ lines/hr via AI; Baseline: 60–80 lines/hr)
- **Visual:** A live financial counter showing "Estimated Labor Capital Saved" based on a 20–30% reduction in travel time

### Retail Vendor Compliance (B2B Fine Predictor)

- **Metric to surface:** Flagged potential chargebacks or at-risk shipments (e.g., Walmart OTIF status, Target SQEP violations)
- **Visual:** A "Risk Status" board (Red/Yellow/Green) for upcoming wholesale dispatches, alerting supervisors if a pallet configuration or label risks violating a retailer's specific routing guide rules

### DIM Weight "Shipping Air" Penalty Gauge

- **Metric to surface:** Volumetric size wastage and unnecessary freight expenditure (Target: Up to 20% freight cost reduction via AI cartonization)
- **Visual:** A cost curve showing how much money is being lost to carriers (UPS/FedEx) by using oversized boxes

## 2. Core Operational Flow Control

These widgets track day-to-day warehouse health, moving from reactive spreadsheets to live predictive insights.

### Inbound & Slotting Metrics

- **Dock-to-Stock Clock:** Tracks the exact hours elapsed from a delivery truck arrival to items being pick-ready. Flags shipments crossing the 12-to-24-hour mark to prevent "phantom out-of-stocks".
- **Phantom Inventory Rate:** A predictive indicator highlighting the estimated volume of data discrepancies (errors logging incorrect SKUs/quantities) causing downstream short-picks.
- **Aisle Congestion Heatmap:** A visual representation of the warehouse floor showing high-density picker zones to alert supervisors of physical bottlenecks.

### Outbound Optimization Telemetry

- **Dynamic Batch Status:** A live look at how the ML engine is grouping orders (e.g., "Active Batches," "SKU Affinity Clusters," "Total Walk Distance Saved Today").
- **Cartonization Engine Efficiency:** A widget showing the volumetric capacity utilized across all packages packed during the shift (e.g., "Average Box Volume Optimization: 92%").

## 3. System Health & Change Management Risk (Friction Watch)

Because software often fails due to real-world floor conditions, the dashboard must feature a "sanity check" section for supervisors to identify worker pushback or technical infrastructure failure.

| Widget / Monitor | Metric to Track | Operational Relevance |
|----------------|-----------------|----------------------|
| Offline Sync Queue Status | Number of local data packages waiting to sync from handheld scanners | Alerts IT/supervisors to WiFi dead zones or network dropouts on the floor before productivity halts |
| Scanner Discipline & Overrides | Rate of manual force-confirms vs. algorithmic scan completions | Catches workers who are bypass-memorizing barcodes or resisting the "scan-verify-confirm" loop |
| The "Happy Path" Exception Log | Real-time flags for "Bin Empty" or "Barcode Unreadable" reports | Surfaces operational entropy instantly, allowing supervisors to fix dynamic routing hitches without pausing workflows |
| Master Data Hygiene Alert | Missing SKU dimensions (length, width, height) or weights in the system | Prevents a "Garbage In, Garbage Out" failure loop where the AI engine can't accurately compute cartonization or pathing |

## 4. Phase 1 AI Agent Logs (The "Under the Hood" Module)

To build trust with buyers and supervisors, the dashboard should explicitly show what the AI is automating in the background:

- **Routing Guide Updates Parsed:** A status stream showing the Agentic LLM actively reading newly uploaded PDF routing guides and converting them into hard constraints (e.g., "Parsed Home Depot Guide v3.2 — Height Limit constraint set to X inches").
- **Pathing Optimization Index:** A daily efficiency score mapping actual kilometers walked by staff versus the optimized metaheuristic route baseline.
