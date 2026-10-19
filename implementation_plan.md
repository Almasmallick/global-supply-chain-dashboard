# Implementation Plan: Global Supply Chain Resilience & Maritime Connectivity Dashboard

**Project Directory:** `E:\dashboard\dashboard`  
**Date:** 20 October 2026  
**Primary Specification:** `03_implementation_guide.md`  

---

## 1. Verified Data Findings (Direct Inspection & Computation)

All checks were executed with Python against the actual source files in `E:\dashboard\US_LSCI_M.csv\` and `E:\dashboard\`:

### 1.1 UNCTADstat LSCI Quarterly (`US_LSCI.csv`)
- **Total rows:** 15,013 across 181 economies.
- **Coverage span:** Exactly 83 quarters, from `2006Q01` to `2026Q03`.
- **Target economies validation:**
  - **India (UNCTAD 356):** 83 quarters, 0 null index values. Latest 2026Q03 index: 383.07, rank: 9 among 181.
  - **China (UNCTAD 156):** 83 quarters, 0 null index values. Latest 2026Q03 index: 1,341.97, rank: 1 among 181.
  - **Singapore (UNCTAD 702):** 83 quarters, 0 null index values. Latest 2026Q03 index: 625.67, rank: 3 among 181.
  - **Netherlands (UNCTAD 528):** 83 quarters, 0 null index values. Latest 2026Q03 index: 374.91, rank: 11 among 181. Label in source: `"Netherlands (Kingdom of the)"`.
  - **Germany (UNCTAD 276):** 83 quarters, 0 null index values. Latest 2026Q03 index: 326.58, rank: 14 among 181.
  - **UAE (UNCTAD 784):** 83 quarters, 0 null index values. Latest 2026Q03 index: 193.89, rank: 28 among 181. Label in source: `"United Arab Emirates"`.
  - **USA (UNCTAD 840):** 83 quarters, 0 null index values. Latest 2026Q03 index: 511.99, rank: 4 among 181. Label in source: `"United States of America"`.
- **Ethiopia (UNCTAD 231):** **Completely absent** (0 rows). Confirms landlocked status: no liner-network series.
- **Djibouti (UNCTAD 262):** Present with 83 quarters (2006Q01–2026Q03). Index rose from 81.71 (2026Q01) to 102.10 (2026Q03). Handled strictly as *gateway context* for Ethiopia, never as Ethiopia's score.
- **UAE Quarterly Series Break:**
  - 2026Q01: `317.9388`
  - 2026Q02: `190.0257` (a drop of `-127.9131` or `-40.23%`)
  - 2026Q03: `193.8883`
  - Note: Source has no footnote explaining this drop. UI annotation will state: *"Large decline in source data; cause not established here. Verify on UNCTADstat before interpreting."*
- **Base index definition:** `Index (average Q1 2023 = 100)`.

### 1.2 UNCTADstat LSCI Monthly (`US_LSCI_M.csv`)
- **Total rows:** 20,449.
- **Coverage span:** 113 months, from `2006M02` to `2026M09`.
- **Base index definition:** `Index (average M2 2023 = 100)`.
- **UAE Monthly Break:**
  - 2026M03: `319.6390`
  - 2026M04: `182.2120` (a drop of `-137.4270` or `-42.99%`)
- **Critical rule:** Base periods differ (Q1 2023 vs M2 2023). Monthly and quarterly series must **never** be plotted on the same time axis.

### 1.3 UNCTADstat Port LSCI (`US_PLSCI.csv`)
- **Total rows:** 76,003 across 1,354 ports.
- **Djibouti port:** Port `DJJIB` (`"Djibouti, Djibouti"`) is available.
- **Jebel Ali port (AEJEA):** 2026Q01 = `775.4822` → 2026Q02 = `225.6650` (corroborates the country-level drop in UAE).

### 1.4 Additional Indicators in Workspace
- **World Development Indicators (`P_Data_Extract_From_World_Development_Indicators.xlsx`):**
  - Contains `TG.VAL.TOTL.GD.ZS` (*Merchandise trade % of GDP*) for all 8 economies!
  - 2024 values available: India (30.88%), Singapore (168.33%), China (32.88%), Netherlands (143.10%), Germany (65.96%), UAE (208.15%), USA (18.50%), Ethiopia (16.08%).
  - 2025 values available for 7 economies (UAE latest is 2024 at 208.15%).
- **Worldwide Governance Indicators (`wgidataset_with_sourcedata-2026.xlsx`):**
  - Contains Government Effectiveness (`ge`) and Regulatory Quality (`rq`) for all 8 economies up to year 2025!
  - Values extracted:
    - SGP: GE=2.09, RQ=2.11
    - NLD: GE=1.74, RQ=1.44
    - DEU: GE=1.49, RQ=1.22
    - USA: GE=1.19, RQ=1.01
    - ARE: GE=1.13, RQ=1.17
    - CHN: GE=0.62, RQ=-0.11
    - IND: GE=0.50, RQ=-0.17
    - ETH: GE=-0.62, RQ=-0.73
- **World Bank LPI 2.0 (Container import dwell time in days, Maritime partner economies count):**
  - Discussed in `Connecting to Compete 2025.md` but raw tabular dataset is not provided in workspace.
  - Per specification `03_implementation_guide.md §B1 & §C4`, we configure `data/raw/manual/indicators_manual.csv` with standard schema.
  - When dwell time is not loaded, the UI renders explicit **"Data not loaded"** states with informative guidance, rather than blank or zero.

---

## 2. Proposed Architecture

### 2.1 Technology Stack
- **Data Pipeline:** Python 3.13 (`scripts/build_data.py` and `scripts/validate.py`) with `pandas`. Output is pure static JSON committed to `public/data/`, ensuring zero backend and zero Python runtime dependencies for Vercel deployment.
- **Frontend Core:** Vite 6 + Vanilla JavaScript (ES Modules). Fast, lean, no framework overhead.
- **Charting Engine:** Plotly.js (`plotly.js-basic-dist-min` v2.35+) for responsive, interactive, annotated line, bar, and scatter plots.
- **Design & Layout:** Custom CSS following the Editorial Data-Journal direction from `03_implementation_guide.md §E`:
  - Background: `#F6F2EA` (warm paper)
  - Surface: `#FFFFFF` / `#FBF8F2`
  - Text Primary: `#17212B`, Text Secondary: `#4A5560`, Text Muted: `#7A838C`
  - Accent Primary: Deep Teal `#0F5C63`
  - Accent Secondary: Ochre `#B5651D`
  - Borders: `#D9D2C3` (hairline rules)
  - Typography: Display serif headings (`Georgia`, `serif`), clean sans for UI/body (`system-ui`, `-apple-system`, sans-serif), tabular figures for numbers.
  - Full keyboard accessibility, contrast compliance (WCAG AA), and `prefers-reduced-motion` support.

### 2.2 Navigation and Views (Hash Routing `#overview`, `#comparison`, `#connectivity`, `#diagnostics`, `#trade-insider`, `#methodology`)
1. **Overview:**
   - 6–8 KPI cards featuring LSCI latest index, rank among 8, rank among 181, merchandise trade % GDP, governance scores, and dwell time ("Not loaded" state).
   - Interpretive call-outs clearly separated with an `"Interpretation"` tag and associational language.
2. **Country Comparison:**
   - Interactive table with sorting on every column, archetype labels, rank among eight vs rank in UNCTAD 181.
   - Filter bar with country toggles, active filter chips, select all, and reset button.
3. **Maritime Connectivity (LSCI Trend):**
   - Quarterly LSCI trend chart (2006Q01–2026Q03).
   - Explicit annotation of UAE April 2026 decline: *"Large decline in source data; cause not established here. Verify on UNCTADstat before interpreting."*
   - Landlocked callout for Ethiopia: *"No liner-network series (landlocked)"*.
   - Optional gateway context series for Djibouti: *"Gateway context, not Ethiopia's score"*.
4. **Diagnostics (Connectivity vs Dwell):**
   - Interactive scatter plot. Handles unpopulated dwell data gracefully: shows a prominent, informative notice *"Logistics Performance Indicators (LPI 2.0) import dwell data is not loaded in manual indicators file"*, with a preview mode using available trade openness and governance coordinates.
5. **Country Trade Insider:**
   - Dossier-style expandable cards for all 8 economies based on `01_problem_statement_and_research.md §12`.
   - Collapsed by default, keyboard accessible.
   - Each card displays headline, core fact, why it matters, category, verified official source domain, verification note *"Verify with official source — checked October 2026"*, and caveats.
6. **Methodology & Limitations:**
   - Complete documentation of datasets, base periods (quarterly Q1 2023 = 100 vs monthly M2 2023 = 100), coverage matrix, non-claims (LSCI is NOT efficiency/dwell; no composite resilience score; no forecasting; associations only).

---

## 3. Planned Files

```
E:\dashboard\dashboard\
├── package.json
├── vite.config.js
├── vercel.json
├── index.html
├── README.md
├── DEPLOY.md
├── validation_report.md
├── implementation_plan.md
├── scripts/
│   ├── build_data.py
│   └── validate.py
├── data/
│   ├── raw/
│   │   └── manual/
│   │       └── indicators_manual.csv
│   └── processed/
│       └── coverage_report.json
├── public/
│   └── data/
│       ├── countries.json
│       ├── lsci_quarterly.json
│       ├── plsci_context.json
│       ├── indicators.json
│       ├── trade_insider.json
│       └── meta.json
└── src/
    ├── main.js
    ├── state.js
    ├── data.js
    ├── styles/
    │   ├── tokens.css
    │   ├── base.css
    │   └── components.css
    └── components/
        ├── nav.js
        ├── filterBar.js
        ├── kpiCards.js
        ├── comparisonTable.js
        ├── lsciTrend.js
        ├── diagnosticScatter.js
        ├── tradeInsider.js
        ├── methodology.js
        └── notices.js
```

---

## 4. Test Strategy

1. **Data Ingestion & Integrity Validation:**
   - Run `py scripts/build_data.py` and `py scripts/validate.py`.
   - Verify non-zero exit on missing target countries, duplicate quarters, mismatched index base, or corrupted calculations.
   - Cross-check calculated ranks among eight and quarterly growth against independent raw calculations.
2. **Missing Indicator Handling:**
   - Verify that absence of LPI dwell time shows "Data not loaded" rather than 0 or NaN.
   - Verify Ethiopia displays "No liner-network series (landlocked)".
3. **Build & Preview Execution:**
   - `npm install`
   - `npm run build` (verifying clean Vite bundle with no errors)
   - `npm run preview` (verifying production static assets load properly)
4. **Usability & Responsiveness Verification:**
   - Check layouts at 360px, 768px, and 1280px.
   - Verify keyboard tab navigation, aria attributes, and contrast ratios.
   - Verify hash-based routing `#overview`, `#comparison`, `#connectivity`, `#diagnostics`, `#trade-insider`, `#methodology`.
