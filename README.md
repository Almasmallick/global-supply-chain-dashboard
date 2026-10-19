# Global Supply Chain Resilience & Maritime Connectivity Dashboard

> **Integrating Trade Exposure, Liner Shipping Connectivity, Logistics Performance, and Institutional Context Across Eight Archetype Economies**

An editorial data-journal dashboard built with **Vite, Vanilla JavaScript, and Plotly.js**. Designed for students, supply chain analysts, and academic evaluators to conduct comparative diagnosis across distinct public trade constructs without relying on black-box composite scores.

---

## 1. Core Dimensions & Provenance

The dashboard deliberately keeps four foundational constructs distinct:

| Dimension | Indicator | Primary Source | Reference Period | Base / Unit |
|---|---|---|---|---|
| **Maritime Connectivity** | Liner Shipping Connectivity Index (LSCI) | UNCTADstat | 2006Q01 – 2026Q03 (83 quarters) | Index (Avg Q1 2023 = 100) |
| **Trade Openness** | Merchandise Trade (% of GDP) | World Bank WDI (`TG.VAL.TOTL.GD.ZS`) | 2024 / 2025 | % of GDP |
| **Institutional Governance** | Government Effectiveness & Regulatory Quality | World Bank WGI (`ge`, `rq`) | 2025 | Estimate (-2.5 to +2.5) |
| **Logistics Time Performance** | Container Import Dwell Time & Maritime Partners | World Bank LPI 2.0 | 2023–2024 | Days (lower is better) |

### Strict Analytical Guardrails
1. **LSCI is Network Supply, NOT Port Efficiency:** LSCI measures ship calls, TEU capacity, liner services, vessel sizes, and direct connections. It does *not* capture terminal dwell time, berth waiting, customs clearance speed, or freight rates.
2. **No Composite "Resilience Score":** Each indicator is presented in its natural citable unit.
3. **No Predictive Simulations or Causal Claims:** Descriptive and diagnostic only; associations are phrased as *"associated with"*, never asserting causality.
4. **Base Separation:** Quarterly LSCI (base Q1 2023 = 100) and Monthly LSCI (base M2 2023 = 100) are strictly isolated.
5. **Landlocked Geography:** Ethiopia has no seaport or liner shipping series in UNCTADstat. The Port of Djibouti is surfaced strictly as labelled **gateway context**, never as Ethiopia's domestic score.
6. **UAE Series Break Annotation:** Captures the 40.2% drop from 2026Q01 (317.9) to 2026Q02 (190.0) with explicit factual citation: *"Large decline in source data; cause not established here. Verify on UNCTADstat before interpreting."*

---

## 2. Navigable Dashboard Sections

- `#overview`: **1. Executive Overview** — 6–8 KPI cards, sample rankings, and analytical interpretation callouts.
- `#comparison`: **2. Country Comparison** — Sortable, multi-column scorecard across all eight economies.
- `#connectivity`: **3. Maritime Connectivity (LSCI)** — Interactive Plotly time-series trend (2006–2026) with callout annotations for the UAE break and Djibouti gateway context.
- `#diagnostics`: **4. Diagnostics & Relationships** — Scatter plot examining connectivity vs. trade exposure and governance, handling unpopulated dwell gracefully.
- `#trade-insider`: **5. Country Trade Insider** — 8 dossier cards featuring critical paperwork rules (BIS, CCC, TradeNet, ISF), verified official regulatory domains, and caveats.
- `#methodology`: **6. Methodology & Limitations** — Complete documentation of source metadata, coverage matrices, and interpretation limits.

---

## 3. Technology Stack

- **Data Pipeline:** Python 3.13 (`scripts/build_data.py`, `scripts/validate.py`) with `pandas` and `openpyxl`. Generates committed static JSON in `public/data/`.
- **Frontend Core:** Vite 6 + Vanilla JavaScript (ES Modules). Zero framework overhead, lightning fast load time.
- **Charts:** Plotly.js (`plotly.js-basic-dist-min`).
- **Styling:** Custom Editorial Data-Journal CSS Tokens:
  - Background: `#F6F2EA` (Warm Paper)
  - Primary Accent: `#0F5C63` (Deep Teal)
  - Secondary Accent: `#B5651D` (Ochre)
  - Typography: Display serif headings (`Georgia`, `serif`), clean sans body, tabular numerals.
  - Accessibility: WCAG AA contrast, visible focus rings, `prefers-reduced-motion` compliance.

---

## 4. Quickstart & Command Reference

```bash
# 1. Install frontend dependencies
npm install

# 2. Build & validate static datasets
npm run data:build
npm run data:validate

# 3. Start local development server
npm run dev

# 4. Compile production distribution
npm run build

# 5. Preview production output locally
npm run preview
```

---

## 5. Deployment

For complete Vercel deployment instructions, refer to [DEPLOY.md](file:///E:/dashboard/dashboard/DEPLOY.md).
The application compiles into a pure static bundle in `dist/`, ready for immediate public deployment on Vercel without requiring a Python backend.
