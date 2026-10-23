# BoltIQ Markets — Production Audit Report

**Generated:** 2026-10-23  
**Auditor:** Principal Software Architect / Senior Full-Stack Engineer / DevSecOps / QA Lead / Technical Product Owner  
**Repository:** https://github.com/feliciien/boltiq-markets  
**Live Site:** https://boltiqmarkets.com  
**Branch:** main  
**Hosting:** Vercel

---

## 1. Current Architecture

### Technology Stack
| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Frontend Framework | React | 19.0.1 | Latest major |
| Build Tool | Vite | 8.3.0 | Requires esbuild ^0.27.0 \|\| ^0.28.0 |
| Language | TypeScript | 7.0.2 | Strict mode enabled |
| Styling | Tailwind CSS | 4.3.3 | Vite plugin integration |
| Animation | Motion | 12.23.24 | Framer Motion successor |
| Icons | Lucide React | 0.546.0 | |
| Analytics | @vercel/analytics | 2.0.1 | Client-side only |
| AI/ML | @google/genai | 2.4.0 | Server-side only (Gemini) |
| Testing | tsx + node:test | 4.21.0 | Native test runner |
| Linting | tsc --noEmit | 7.0.2 | TypeScript type-checking |

### Project Structure
```
boltiq-markets-main/
├── api/
│   ├── waitlist.ts          # Serverless function (Vercel + Vite middleware)
│   └── waitlist.test.ts     # Unit tests
├── src/
│   ├── components/          # 10 React components
│   ├── data/
│   │   └── marketData.ts    # Expert Advisors, backtest presets, FAQ
│   ├── utils/
│   │   ├── quantCalculations.ts      # Pure quantitative functions
│   │   └── quantCalculations.test.ts # Unit tests
│   ├── App.tsx              # Root component, routing via anchors
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind v4 imports
├── public/                  # Static assets
├── vercel.json              # Vercel routing + security headers
├── vite.config.ts           # Vite config + API middleware plugin
├── package.json
├── tsconfig.json
├── .env                     # Environment template (no secrets)
└── .gitignore
```

### Routing Model
- **Frontend:** Single-page application with anchor-based navigation (`#marketplace`, `#laboratory`, `#analytics`, `#prop-evaluation`, `#risk-framework`, `#faq`)
- **API:** `/api/waitlist` serverless function (POST only)
- **Vercel Rewrites:** Catch-all `/*` → `/index.html` (SPA fallback)

---

## 2. Functional Inventory

### Pages & Sections (Single Page Application)

| Section | Component | ID/Anchor | Status | Backend Integration |
|---------|-----------|-----------|--------|---------------------|
| Navigation | Navbar | — | ✅ Functional | None |
| Hero | Hero | — | ✅ Functional | None |
| EA Marketplace | EAMarketplace | `#marketplace` | ✅ Functional (demo) | None |
| Strategy Modal | StrategyModal | — | ✅ Functional (demo) | None |
| Backtest Laboratory | BacktestLaboratory | `#laboratory` | ✅ Functional (simulation) | None |
| Analytics Dashboard | AnalyticsDashboard | `#analytics` | ✅ Functional (demo) | None |
| Prop Evaluation | PropEvaluation | `#prop-evaluation` | ⚠️ Partial | `/api/waitlist` |
| Risk Management | RiskManagementSection | `#risk-framework` | ✅ Functional (static) | None |
| FAQ | FAQSection | `#faq` | ✅ Functional | None |
| Footer | Footer | — | ✅ Functional | None |

### Interactive Controls & CTAs

| Control | Location | Action | Status | Notes |
|---------|----------|--------|--------|-------|
| Nav Links (6) | Navbar | Scroll to section | ✅ Working | Smooth scroll |
| Mobile Menu | Navbar | Toggle drawer | ✅ Working | State managed |
| "Explore EA Marketplace" | Hero | Scroll to `#marketplace` | ✅ Working | |
| "Launch Backtest Simulator" | Hero/Navbar | Scroll to `#laboratory` | ✅ Working | |
| "Prop Evaluation Waitlist" | Hero/Navbar/Footer | Scroll to `#prop-evaluation` | ✅ Working | |
| EA Cards (4) | EAMarketplace | Open StrategyModal | ✅ Working | Click handler |
| Asset Filter Buttons | EAMarketplace | Filter grid | ✅ Working | State managed |
| Search Input | EAMarketplace | Filter grid | ✅ Working | State managed |
| "Presets (.set)" Button | EA Cards | Toast notification | ✅ Working (demo) | No real download |
| "Audit & Specs" Button | EA Cards | Open StrategyModal | ✅ Working | |
| Backtest Preset Selector | BacktestLaboratory | Switch strategy | ✅ Working | 4 presets |
| Capital Buttons | BacktestLaboratory | Set initial capital | ✅ Working | 4 tiers |
| Risk Slider | BacktestLaboratory | Adjust risk % | ✅ Working | 0.5-2.5% |
| Slippage Slider | BacktestLaboratory | Adjust slippage | ✅ Working | 0.2-1.8 pips |
| Timeframe Buttons | BacktestLaboratory | Select TF | ✅ Working | M5/M15/H1/H4 |
| Chart Tabs | BacktestLaboratory | Equity/Underwater/MC | ✅ Working | 3 views |
| "Reset Model" | BacktestLaboratory | Reset controls | ✅ Working | |
| "Export Audit CSV" | BacktestLaboratory | Toast notification | ✅ Working (demo) | No real CSV |
| Analytics Tabs | AnalyticsDashboard | Switch views | ✅ Working | 4 tabs |
| "Refresh Telemetry" | AnalyticsDashboard | Simulated refresh | ✅ Working (demo) | 1s spinner |
| Challenge Step Toggle | PropEvaluation | 1-Step / 2-Step | ✅ Working | Recalculates rules |
| Account Size Buttons | PropEvaluation | Select tier | ✅ Working | 4 tiers |
| Waitlist Form | PropEvaluation | POST `/api/waitlist` | ⚠️ Partial | See defects below |
| FAQ Accordions | FAQSection | Expand/collapse | ✅ Working | Single open |
| Footer Links | Footer | Scroll to sections | ✅ Working | Anchor links |
| External Links | Footer | Navigate to domain | ✅ Working | boltiqmarkets.com |

### API Endpoints

| Endpoint | Method | Handler | Status |
|----------|--------|---------|--------|
| `/api/waitlist` | POST | `api/waitlist.ts` → `handleWaitlistRequest` | ⚠️ Critical defects |
| `/api/waitlist` | GET/OTHER | Returns 405 | ✅ Working |

---

## 3. Capability Classification

| Capability | Classification | Evidence |
|------------|----------------|----------|
| Navigation & Routing | **2. Frontend only** | Anchor scroll, no server routing |
| Hero CTAs | **2. Frontend only** | Scroll handlers |
| EA Marketplace Display | **3. Simulation/Demo** | Static data from `marketData.ts` |
| Strategy Modal | **3. Simulation/Demo** | Static data display |
| Backtest Laboratory | **3. Simulation/Demo** | Deterministic PRNG curves, no real backtest engine |
| Analytics Dashboard | **3. Simulation/Demo** | Static mock data, "Demonstration Environment" label |
| Prop Evaluation Rules | **2. Frontend only** | Calculated via `quantCalculations.ts` |
| Waitlist Submission | **4. Incomplete** | API returns fake success when DB missing |
| Risk Management Display | **2. Frontend only** | Static content |
| FAQ Accordions | **2. Frontend only** | Local state |
| Footer Links | **2. Frontend only** | Anchor + external |
| Quantitative Calculations | **1. Fully functional** | Pure functions, tested, no external deps |

---

## 4. Critical Defects

### 4.1 Waitlist API — Fake Persistence (CRITICAL)
**File:** `api/waitlist.ts` lines 108-120  
**Issue:** When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are not configured, the API returns:
```json
{
  "success": true,
  "persisted": true,
  "provider": "serverless-buffer",
  "message": "Evaluation waitlist application successfully validated and recorded in server queue."
}
```
**Impact:** Users believe their application was saved when it was only held in ephemeral serverless memory (lost on cold start). This is **data integrity fraud**.

### 4.2 Dependency Conflict (HIGH)
**File:** `package.json` line 33  
**Issue:** `"esbuild": "^0.25.0"` but Vite 8.3.0 requires `^0.27.0 || ^0.28.0`  
**Current Workaround:** Vercel runs `npm pkg set devDependencies.esbuild='^0.28.0' && npm install`  
**Impact:** Non-reproducible builds; fails `npm ci` locally.

### 4.3 Vercel Routing — API Interception Risk (HIGH)
**File:** `vercel.json` lines 3-6  
**Issue:** Catch-all rewrite `/*` → `/index.html` may intercept `/api/waitlist` if not ordered correctly. Vercel processes rewrites in order, but the current config has no explicit API route protection.

### 4.4 In-Memory Rate Limiting (MEDIUM)
**File:** `api/waitlist.ts` lines 45-55  
**Issue:** `Map<string, number[]>` resets on every cold start; ineffective in serverless. No persistent rate limiting (Redis, Upstash, Vercel KV).

### 4.5 No Request Size Limits (MEDIUM)
**File:** `api/waitlist.ts`  
**Issue:** No body size validation; vulnerable to large payload DoS.

### 4.6 Client IP Storage (LOW)
**File:** `api/waitlist.ts` line 78  
**Issue:** Stores `clientIp` in waitlist entry — unnecessary PII for a waitlist.

### 4.7 Missing Security Headers for API (LOW)
**File:** `vercel.json`  
**Issue:** Security headers apply to all routes but API responses should also have `Content-Security-Policy`, `X-Content-Type-Options`.

---

## 5. Security Risks

| Risk | Severity | Location | Mitigation |
|------|----------|----------|------------|
| Fake persistence claim | **CRITICAL** | `api/waitlist.ts` | Return 503 when DB unavailable |
| Secrets in client bundle | **HIGH** | `.env` has `VITE_*` prefix risk | Audit all `import.meta.env.VITE_*` usage |
| `GEMINI_API_KEY` exposure | **HIGH** | `.env` template shows it | Must be server-side only (no `VITE_` prefix) |
| `SUPABASE_SERVICE_ROLE_KEY` exposure | **HIGH** | `.env` template shows it | Must be server-side only |
| No CSP header | **MEDIUM** | `vercel.json` | Add `Content-Security-Policy` |
| In-memory rate limiting | **MEDIUM** | `api/waitlist.ts` | Document limitation; plan for Upstash/Vercel KV |
| No request size limit | **MEDIUM** | `api/waitlist.ts` | Add body parser limit |
| IP address logging | **LOW** | `api/waitlist.ts` | Remove or hash |

### Environment Variable Audit
| Variable | Prefix | Exposure | Required | Status |
|----------|--------|----------|----------|--------|
| `VITE_APP_URL` | `VITE_` | Client | Yes | ✅ Safe (public URL) |
| `VITE_CANONICAL_DOMAIN` | `VITE_` | Client | Yes | ✅ Safe |
| `VITE_SECONDARY_DOMAIN` | `VITE_` | Client | Yes | ✅ Safe |
| `GEMINI_API_KEY` | (none) | Server | Phase 2 | ⚠️ Template only |
| `SUPABASE_URL` | (none) | Server | Phase 2 | ⚠️ Template only |
| `SUPABASE_SERVICE_ROLE_KEY` | (none) | Server | Phase 2 | ⚠️ Template only |
| `SUPABASE_ANON_KEY` | (none) | Server | Phase 2 | ⚠️ Template only |
| `NODE_ENV` | (none) | Server | Yes | ✅ Set |

**No secrets committed.** `.env` is a template only (in `.gitignore` presumably).

---

## 6. Deployment Risks

| Risk | Severity | Description |
|------|----------|-------------|
| `npm ci` fails | **HIGH** | esbuild version mismatch prevents clean install |
| No lockfile committed | **HIGH** | `bun.lock` exists but no `package-lock.json`; non-reproducible |
| Vercel install override | **MEDIUM** | Masking dependency issue; not sustainable |
| API route interception | **MEDIUM** | Catch-all rewrite may break API if order changes |
| No health check endpoint | **LOW** | No `/api/health` for monitoring |

---

## 7. Technical Debt

| Item | Location | Effort | Priority |
|------|----------|--------|----------|
| No error boundary | `src/App.tsx` | Low | High |
| No shared loading/error states | All components | Medium | High |
| Inline styles / magic numbers | Multiple components | Medium | Medium |
| No TypeScript strict null checks on some props | Various | Low | Medium |
| Test coverage gaps | `quantCalculations.test.ts`, `waitlist.test.ts` | Medium | High |
| No E2E tests | — | High | Medium |
| Hardcoded demo data in Analytics | `AnalyticsDashboard.tsx` | Low | Low |
| Toast notifications use `setTimeout` not accessible | Multiple | Low | Medium |
| No analytics consent banner | — | Low | Low (GDPR) |

---

## 8. Dependencies & External Integrations

| Dependency | Purpose | Status | Risk |
|------------|---------|--------|------|
| `@google/genai` | Gemini AI (Phase 2) | Installed, unused | Version 2.4.0 |
| `@vercel/analytics` | Web analytics | Active | Client-side only |
| `@tailwindcss/vite` | Tailwind v4 integration | Active | Requires Vite 5+ |
| `lucide-react` | Icons | Active | Stable |
| `motion` | Animations | Active | Stable |
| `dotenv` | Env loading (server) | Active | Only used in API |
| `express` | Type definitions only | Dev dep | Not used in runtime |

**No database, no authentication, no payment processor, no email service currently integrated.**

---

## 9. Prioritized Recommendations

### P0 — Must Fix Before Production (This Phase)
1. **Fix esbuild dependency** → `^0.28.0`, run `npm install`, commit `package-lock.json`
2. **Fix waitlist API** → Return 503 when Supabase not configured; never claim `persisted: true` falsely
3. **Fix Vercel routing** → Explicit API route handling before catch-all
4. **Add request size limit** → `body-parser` or manual check in API
5. **Remove IP storage** from waitlist entry
6. **Generate `package-lock.json`** and commit it

### P1 — Should Fix This Phase
7. **Add error boundary** to `App.tsx`
8. **Add shared UI states** (Loading, Error, Empty, Success components)
9. **Expand test coverage** — waitlist validation, duplicate handling, missing DB, API methods
10. **Add CSP header** in `vercel.json`
11. **Document rate limiting limitation** in code comments
12. **Qualify all performance claims** with "simulated/historical" labels

### P2 — Phase 2 Preparation
13. **Prepare Supabase integration** — schema, migrations, RLS policies
14. **Add authentication** — Supabase Auth or Clerk
15. **Add persistent rate limiting** — Upstash Redis or Vercel KV
16. **Add health check endpoint** — `/api/health`
17. **Add analytics consent** — GDPR/CCPA compliance

---

## 10. Quality Gate Status (Pre-Fix)

| Gate | Status | Notes |
|------|--------|-------|
| Dependencies install cleanly | ❌ FAIL | esbuild version conflict |
| TypeScript validation passes | ✅ PASS | `npm run lint` (tsc --noEmit) |
| Automated tests pass | ⚠️ PARTIAL | Tests exist but waitlist test asserts fake success |
| Production build succeeds | ✅ PASS | `npm run build` works |
| Frontend routing works | ✅ PASS | Anchor navigation |
| API routing works | ⚠️ PARTIAL | Works in dev, risk in prod |
| Unsupported features honest | ❌ FAIL | Waitlist claims fake persistence |
| No credentials exposed | ✅ PASS | `.env` is template only |
| Mobile responsive | ✅ PASS | Tailwind responsive classes |
| No production deployment break | ⚠️ UNKNOWN | Requires Vercel deploy test |

---

## Appendix: File-Level Audit Summary

### `api/waitlist.ts` — **CRITICAL DEFECTS**
- Lines 108-120: Fake persistence response
- Lines 45-55: In-memory rate limiting (serverless-incompatible)
- Line 78: Unnecessary IP storage
- No request body size limit
- No duplicate detection (idempotency)

### `api/waitlist.test.ts` — **INCOMPLETE**
- Tests assert `persisted: true` for fake success
- No tests for: missing DB config, duplicate email, rate limit, invalid methods

### `vercel.json` — **ROUTING RISK**
- No explicit API route protection
- Security headers good but missing CSP

### `package.json` — **DEPENDENCY CONFLICT**
- `esbuild: ^0.25.0` incompatible with Vite 8.3.0
- No `package-lock.json` committed

### `vite.config.ts` — **API MIDDLEWARE**
- Custom plugin serves `/api/waitlist` in dev
- Production relies on Vercel serverless function

### `src/components/PropEvaluation.tsx` — **UI HONESTY**
- Shows waitlist as functional
- Stores registration in localStorage as backup
- No indication that backend may be unavailable

### `src/utils/quantCalculations.ts` — **SOLID**
- Pure functions, well-tested, no external deps
- Deterministic PRNG for reproducible demos

### `src/data/marketData.ts` — **DEMO DATA**
- All EA data is simulated/historical
- Properly labeled in UI (mostly)

---

**End of Audit Report**