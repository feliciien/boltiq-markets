# BoltIQ Markets — E2E Smoke Test Plan

**Purpose:** Verify critical user flows on desktop and mobile before each production deployment.
**Scope:** Phase 1 — Production Foundation (no payment, no live trading, no authentication)
**Test Environment:** Production build (Vercel preview or local `npm run build && npm run preview`)

---

## Desktop Smoke Tests

### 1. Homepage Load
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Navigate to `https://boltiqmarkets.com/` | Page loads without console errors |
| 1.2 | Verify hero section renders | Headline, CTA buttons, demo stats visible |
| 1.3 | Verify navigation | All 6 nav links present and clickable |

### 2. Navigation & Anchor Links
| Step | Action | Expected Result |
|------|--------|-----------------|
| 2.1 | Click "EA Marketplace" nav link | Page scrolls to `#marketplace` section |
| 2.2 | Click "Backtest Lab" nav link | Page scrolls to `#laboratory` section |
| 2.3 | Click "AI Analytics" nav link | Page scrolls to `#analytics` section |
| 2.4 | Click "Prop Evaluation" nav link | Page scrolls to `#prop-evaluation` section |
| 2.5 | Click "Risk Architecture" nav link | Page scrolls to `#risk-framework` section |
| 2.6 | Click "FAQ" nav link | Page scrolls to `#faq` section |
| 2.7 | Click BoltIQ logo | No error (anchor to `#`) |
| 2.8 | Refresh page at any anchor | Page loads at correct position |