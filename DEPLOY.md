# Deployment Guide: Global Supply Chain Resilience Dashboard

This guide provides reproducible step-by-step instructions for deploying the **Global Supply Chain Resilience & Maritime Connectivity Dashboard** to [Vercel](https://vercel.com) and running it locally.

---

## 1. Prerequisites & Required Software

| Software | Minimum Version | Verification Command | Purpose |
|---|---|---|---|
| **Node.js** | v18.0.0+ (Tested on v22.16.0) | `node --version` | Frontend runtime |
| **npm** | v9.0.0+ (Tested on v11.17.0) | `npm --version` | Package manager |
| **Python** | 3.10+ (Tested on 3.13.5) | `py --version` or `python --version` | Data generation & validation |
| **pandas** | 2.0+ | `py -m pip show pandas` | Dataframe transformation |
| **openpyxl** | 3.1+ | `py -m pip show openpyxl` | Excel ingestion |

---

## 2. Local Setup & Execution Workflow

### Step 1: Install Dependencies
Open your terminal in the project directory (`E:\dashboard\dashboard`):

```bash
# Install frontend dependencies
npm install

# Install Python requirements (for data pipeline updates)
py -m pip install pandas openpyxl
```

### Step 2: Generate & Validate Static Datasets
The pipeline ingests raw UNCTADstat CSVs, WDI Excel, and WGI Excel data, computes ranks and growth, and outputs static JSON to `public/data/`:

```bash
# 1. Run the data build pipeline
npm run data:build
# Or directly: py scripts/build_data.py

# 2. Run the data validation suite (must exit 0)
npm run data:validate
# Or directly: py scripts/validate.py
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Step 4: Run the Production Build & Local Preview
```bash
# Create optimized production bundle in dist/
npm run build

# Preview the production build locally
npm run preview
```
Open `http://localhost:4173` to test the exact production output.

---

## 3. Deploying to Vercel

The application is architected as a **pure-client static web application**. All data is pre-compiled into static JSON in `public/data/`, meaning Vercel does **not** need Python installed during deployment.

### Method A: Git-Based Deployment (Recommended)

1. **Push your code to GitHub, GitLab, or Bitbucket:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete global supply chain resilience dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
   *(Ensure `public/data/*.json` files are included in the commit).*

2. **Connect to Vercel:**
   - Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **"Add New Project"** → **"Import Git Repository"**.
   - Select your repository.
   - Vercel automatically detects Vite settings:
     - **Framework Preset:** `Vite`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
   - Click **"Deploy"**.

3. **Obtain Public URL:**
   - Once the build finishes (usually 30–45 seconds), Vercel provides your live shareable URL (e.g., `https://global-supply-chain-dashboard.vercel.app`).

---

### Method B: Vercel CLI Deployment

1. **Install Vercel CLI globally (if not already installed):**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy a Preview:**
   Run from the project root (`E:\dashboard\dashboard`):
   ```bash
   vercel
   ```
   Follow the CLI prompts:
   - *Set up and deploy?* **`y`**
   - *Which scope?* (Select your account)
   - *Link to existing project?* **`n`**
   - *Project name?* `global-supply-chain-dashboard`
   - *In which directory is your code located?* **`./`**
   - *Want to modify settings?* **`n`**

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```
   The CLI outputs your production public URL.

---

## 4. How to Add New Indicators via Manual CSV

To add or update supplementary indicators (such as World Bank LPI 2.0 import dwell time or maritime partner counts):

1. Open `data/raw/manual/indicators_manual.csv`.
2. Add rows adhering to the required schema:
   ```csv
   iso3,indicator_id,value,unit,period,source,extracted
   IND,lpi_import_dwell_days,3.2,Days,2024,World Bank LPI 2.0,October 2026
   CHN,lpi_import_dwell_days,2.8,Days,2024,World Bank LPI 2.0,October 2026
   SGP,lpi_import_dwell_days,1.9,Days,2024,World Bank LPI 2.0,October 2026
   NLD,lpi_import_dwell_days,2.3,Days,2024,World Bank LPI 2.0,October 2026
   DEU,lpi_import_dwell_days,2.5,Days,2024,World Bank LPI 2.0,October 2026
   ARE,lpi_import_dwell_days,2.4,Days,2024,World Bank LPI 2.0,October 2026
   USA,lpi_import_dwell_days,3.1,Days,2024,World Bank LPI 2.0,October 2026
   ETH,lpi_import_dwell_days,8.5,Days,2024,World Bank LPI 2.0,October 2026
   ```
3. Rebuild and validate the static data:
   ```bash
   npm run data:build
   npm run data:validate
   ```
4. Rebuild the frontend bundle:
   ```bash
   npm run build
   ```
5. Commit and push the updated `public/data/*.json` files to update your live Vercel deployment.
