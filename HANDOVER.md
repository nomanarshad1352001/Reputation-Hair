# Reputation Hair Extensions — storefront handover (round 2)

## What this is
A fully working, mobile-first **storefront prototype** (React + Vite + Tailwind) built on the client's real content and
catalog from reputationextensions.com. It defines the design system, sections, templates and sales boosters to carry into
the client's **Symmetry** theme. It is not Liquid code and nothing has been published. There is no database; cart, codes,
sign-ups, reviews, pro applications and restock alerts are stored in the visitor's browser only.

## Content sources
| Content | Source |
| --- | --- |
| 59 products — titles, handles, options, prices, compare-at prices, availability, shade notes, descriptions | `reputationextensions.com/products.json` → `src/data/catalog.json`, `src/data/shades.json` |
| Navigation & URLs (collections, `/pages/*`, `/policies/*`, blog handle) | Client header/footer menus; client URLs are preserved (aliases in `PAGE_ALIASES`) |
| Home copy (The Reputation Difference, Confidence in Every Strand, Created Behind the Chair, Find Your Perfect Match, Weekend Collection, VIP Text Club, newsletter) | Client homepage |
| About, methods, education, salons | `/pages/about-us` |
| FAQ, Hair Care Guide, Refund Policy, Black Friday deals, blog posts | Client pages / blog feed |
| Logo | Client logo file (white original + black version for light backgrounds) |
| Founders photo | Client's own photo, **brightened only** (exposure/tone), not AI-altered |
| 39 lifestyle/product images | Generated for this build (sliced from 10 generations) |

## Sales boosters (all editable in `src/theme/settings.ts`)
| Booster | Where | Setting |
| --- | --- | --- |
| Campaign countdowns (bar, hero, deals, mega menu, PDP) | Global | `campaigns[]` — real start/end dates; timers hide when no campaign is live (never fake-reset) |
| Campaign automatic discount (15% off Clip In's) | Cart | `campaigns[].autoDiscounts` → Shopify automatic discount |
| Bundle & Save (2 packs −5%, 3+ packs −10%) | PDP + cart | `offers.bundleTiers` → Shopify automatic discount (quantity tiers) |
| Free U.S. shipping over $300 + progress bar | Cart, PDP hint | `offers.freeShipping` → Shopify shipping rate rule |
| Free gift over $500 (Creaseless Hair Clips) | Cart | `offers.gift` → automatic discount + gift auto-add (theme JS or app) |
| Spin-to-win (email-gated, weighted, real codes) + teaser + exit intent | Global | `offers.wheel`, `offers.codes` |
| Discount codes: WELCOME10, SPIN5, SPIN10, SPIN15, SAVE25 ($300+), SHIPFREE, CLIPSGIFT | Cart | Create the same codes in Shopify admin |
| Shop Pay Installments messaging | PDP, quick add, cart | `offers.installments` (native, free) |
| Delivery estimate with order cutoff | PDP | `offers.shipping` (cutoff 1pm CT, 3–6 business days) |
| Low-stock, sold-out, notify-me | PDP/cards | Inventory driven (see demo note below) |
| Complete-the-install bundles, cross-sell, recently viewed | PDP, cart | Automatic |

**All offer values are PROPOSED** and need the client's written approval (margins). Black Friday end date is set to
Dec 1, 2026 00:00 CT — confirm.

## Decisions to confirm with the client
1. Navigation now follows the client's real catalog (Hybrid Wefts, K-Tips, Tape-Ins, Clip-Ins, Weekend Collection, Holiday Shop, For Pros) instead of the brief's Wigs/Closures/Frontals, which the store doesn't sell.
2. The client's About page describes Kathy & Liv as a **mother-daughter duo** (their salons are "sister salons"). The site uses the client's wording.
3. The client's Black Friday page says "35% off Tape wefts", but its own prices ($595.50 vs $794) work out to 25%. The site shows the computed 25%.
4. The refund policy is **all sales final**, so no "returns" trust badges are used.
5. The charity "making a difference" block from the brief was removed (no client content supports it).

## Placeholders — replace before launch
- Star ratings, review counts and review text (sample) → reviews app (e.g. Judge.me free).
- Low-stock counts ("Only 2 left") are demo values → `variant.inventory_quantity`.
- **Before/after images are AI-generated** → replace with real client transformations (with consent).
- Press strip (BET, Cosmopolitan, CNN, Seventeen, Allure) → only with genuine features + supplied logos.
- Facebook & Pinterest URLs (Instagram, TikTok, YouTube are real).
- Privacy Policy & Terms of Service are short summaries → use the store's Shopify policies.
- Third-party haircare (Kérastase, Oribe) and hot tools were not included; they sync from Shopify with real photos.

## Apps (native/free first)
Search & Discovery (filters, free) · Shopify Email/Forms or Klaviyo free (sign-ups, SMS) · Judge.me free (reviews) ·
Instafeed free (Instagram) · Shop Pay Installments (native). The spin-to-win wheel and gift auto-add can be built in the
theme (no app) — any paid alternative needs written approval.

## Known limitations
- Checkout, accounts and order tracking stop at a labelled preview (Shopify handles these live).
- Images are inlined into a single HTML file for this preview (no srcset); on Shopify use `image_url` + `srcset`.
- Automated QA (390 / 820 / 1440px): no horizontal overflow, one `<h1>` per template, no console errors. Real-device testing is still required.
