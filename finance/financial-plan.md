# CNC Garage — Financial Plan

Prepared: 2026-04-19
Business: Custom CNC fabrication (garage-based, direct-to-consumer via Stripe storefront)

---

## 1. Pricing Strategy

### 1.1 Pricing Philosophy
Position as **artisan-grade custom CNC work**, not commodity machining. Price on perceived craft value, not shop-rate minutes. Keep a tight catalog of signature SKUs plus bespoke commissions.

### 1.2 Cost-Plus Floor (per product)
Every SKU must clear this floor before a markup is applied:

```
Unit Cost = Materials + (Machine Hours × $45) + (Finishing Labor × $35) + Packaging + Payment Fees
Floor Price = Unit Cost × 1.6   (60% gross margin minimum)
Retail Price = max(Floor Price, Market Anchor)
```

- Machine hour rate ($45) covers tooling wear, electricity, amortized CNC depreciation.
- Finishing labor ($35) covers sanding, staining, assembly, QC.
- Payment fees: Stripe 2.9% + $0.30 baked into unit cost.

### 1.3 Product Tiers

| Tier | Example SKUs | Price Band | Target Margin | Lead Time |
|------|--------------|-----------|---------------|-----------|
| **Signature (stock)** | Engraved coasters, small signs, key holders, desk organizers | $25–$95 | 65–72% | Ships in 3 days |
| **Studio (semi-custom)** | House number plaques, address signs, wall art, cutting boards | $95–$350 | 58–65% | 7–10 days |
| **Commission (bespoke)** | Custom furniture inlays, branded corporate gifts, large wall pieces | $350–$2,500 | 50–58% | 3–5 weeks |
| **Digital (design files)** | .svg / .dxf / .f3d download packs | $9–$39 | 92%+ | Instant |

### 1.4 Shipping Strategy
- Flat-rate zones built into Stripe (Small $8, Medium $18, Large $45, Freight quote).
- Free shipping threshold: **$150+** (drives AOV; Signature tier bundles).
- Local pickup option (0 fee) — captures ~10% of local orders, removes shipping risk.
- Oversized commissions: white-glove freight, quoted case-by-case, collected via Stripe invoice.

### 1.5 Discount Policy
- Newsletter signup: 10% off first order (once per email, Stripe coupon).
- No sitewide sales. Maintains premium positioning.
- Trade/wholesale: 30% off MSRP, minimum $500 order, net-15 terms via Stripe invoice.

---

## 2. 12-Month Revenue Projection

Assumptions:
- Launch month = Month 1 (2026-05).
- Marketing: Instagram + Etsy cross-posting + local maker-market booth 1×/month.
- Conversion rate grows from 1.2% → 2.8% as social proof compounds.
- AOV grows from $78 → $132 as commission share rises.

### 2.1 Monthly Revenue Forecast

| Month | Sessions | Conv % | Orders | AOV | **Gross Revenue** | Commission Revenue | **Total Revenue** |
|-------|---------:|-------:|-------:|----:|------------------:|-------------------:|------------------:|
| M1 (May)  |   900 | 1.2% |  11 |  $78 |    $858 |    $0  |    $858 |
| M2 (Jun)  | 1,400 | 1.4% |  20 |  $82 |  $1,640 |  $400  |  $2,040 |
| M3 (Jul)  | 2,000 | 1.6% |  32 |  $86 |  $2,752 |  $850  |  $3,602 |
| M4 (Aug)  | 2,600 | 1.8% |  47 |  $92 |  $4,324 | $1,600  |  $5,924 |
| M5 (Sep)  | 3,200 | 2.0% |  64 |  $98 |  $6,272 | $2,400  |  $8,672 |
| M6 (Oct)  | 4,000 | 2.2% |  88 | $104 |  $9,152 | $3,500  | $12,652 |
| M7 (Nov)  | 5,500 | 2.5% | 138 | $112 | $15,456 | $5,800  | $21,256 |
| M8 (Dec)  | 7,200 | 2.8% | 202 | $118 | $23,836 | $7,200  | $31,036 |
| M9 (Jan)  | 3,400 | 2.4% |  82 | $108 |  $8,856 | $2,800  | $11,656 |
| M10 (Feb) | 3,600 | 2.5% |  90 | $114 | $10,260 | $3,400  | $13,660 |
| M11 (Mar) | 4,200 | 2.6% | 109 | $122 | $13,298 | $4,500  | $17,798 |
| M12 (Apr) | 4,800 | 2.8% | 134 | $132 | $17,688 | $6,200  | $23,888 |
| **Year 1** | **42,800** | **2.2%** | **1,017** | **$109** | **$114,392** | **$38,650** | **$153,042** |

### 2.2 Revenue Mix (Year 1)
- Signature (stock): **38%** ($58,156)
- Studio (semi-custom): **34%** ($52,034)
- Commission (bespoke): **25%** ($38,260)
- Digital files: **3%** ($4,592)

### 2.3 Seasonality Notes
- **Nov–Dec = 34% of annual revenue** — custom holiday gifts drive spike. Plan inventory + shop capacity accordingly.
- Jan dip is structural; use for catalog refresh and design-file releases.
- Mother's Day (May) and wedding season (May–Sep) pull personalized Studio tier up.

---

## 3. Cost Analysis

### 3.1 One-Time Startup Costs

| Item | Cost |
|------|-----:|
| CNC machine (already owned) | $0 |
| Upgraded spindle + dust collection | $1,200 |
| Initial hardwood + MDF inventory | $1,800 |
| Finishing supplies (stains, epoxy, wax) | $450 |
| Shipping supplies (boxes, foam, tape) | $600 |
| Branded packaging / thank-you cards | $350 |
| Photography setup (lightbox, tripod) | $280 |
| Business formation (LLC + EIN) | $150 |
| **Total startup** | **$4,830** |

### 3.2 Monthly Fixed Costs

| Item | Monthly |
|------|--------:|
| AWS Amplify hosting + domain | $35 |
| Stripe (no monthly base) | $0 |
| Shop electricity (allocated) | $85 |
| Shop insurance | $65 |
| Software (Fusion 360, VCarve, Adobe) | $95 |
| Email marketing (Klaviyo starter) | $45 |
| Bookkeeping software | $25 |
| **Total fixed / month** | **$350** |
| **Annual fixed** | **$4,200** |

### 3.3 Variable Costs (% of revenue)

| Cost | % of Rev | Year 1 $ |
|------|---------:|---------:|
| Raw materials (wood, acrylic, metal) | 18% | $27,548 |
| Finishing consumables | 4%  | $6,122  |
| Packaging | 3%  | $4,591  |
| Shipping (net of collected shipping) | 6%  | $9,183  |
| Stripe fees (2.9% + $0.30) | 3.2% | $4,897 |
| Marketing (IG ads, market booth fees) | 8%  | $12,243 |
| Sales tax handling (via Stripe Tax) | 0.5% | $765 |
| **Total variable** | **42.7%** | **$65,349** |

### 3.4 Labor (Owner Draw Basis)
Year 1 labor is owner-operated — tracked but not paid as W-2. Shadow labor cost for planning:

- ~30 hrs/week average × 52 weeks × $40/hr = **$62,400 shadow labor**
- Actual draw Year 1: whatever net cash allows (see P&L below).

### 3.5 Year 1 Profit & Loss

```
Revenue                              $153,042
  Variable costs         (42.7%)    ($65,349)
  ─────────────────────────────────────────────
Gross Profit             (57.3%)     $87,693

  Fixed operating costs              ($4,200)
  Startup amortized (Y1)             ($4,830)
  ─────────────────────────────────────────────
EBITDA / Owner Draw Pool             $78,663

  Effective owner hourly ($78,663 / 1,560 hrs) ≈ $50.42/hr
```

### 3.6 Break-Even
- Monthly fixed + baseline variable at zero rev = **$350/mo**.
- Contribution margin per order (Y1 avg) = $109 × 57.3% = $62.46.
- **Break-even = 6 orders/month.** Cleared from Month 2 onward.

### 3.7 Cash Flow Watch-Points
1. **Nov inventory build** — pre-buy materials in Sep/Oct; ~$6K outlay before Dec revenue lands. Reserve cash in Oct.
2. **Stripe payout delay** — 2-day rolling; not a concern unless a dispute freezes a batch. Keep 30-day operating buffer ($3K minimum).
3. **Commission deposits** — collect 50% upfront via Stripe invoice on all Commission tier orders to fund materials.

---

## 4. Year-2 Targets (directional)

- Revenue: **$240K–$280K** (add wholesale channel + 2 new Signature collections).
- Hire 1 part-time finisher at 15 hrs/week (~$18K/yr) — frees owner to run 2× more commissions.
- Gross margin target: **60%** (volume pricing on hardwood, batch finishing).
- Consider second CNC or upgraded machine once commission backlog sustains 6+ weeks.

---

## 5. Key Metrics to Track Weekly
- Orders, AOV, gross margin %, Stripe refund rate, shipping cost as % of revenue, commission backlog (weeks), IG follower growth, email list size, website conversion %.

Dashboard should live inside the admin area of the site and pull directly from the Stripe API + Amplify Data.
