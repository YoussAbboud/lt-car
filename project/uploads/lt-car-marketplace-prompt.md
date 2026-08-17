# Project Prompt: Lithuanian Car Marketplace ("AutoRinka" — working name, rename freely)

Build a production-grade, peer-to-peer + dealer car marketplace targeting the **Lithuanian market**, competing with sites like Autoplius.lt and Autogidas.lt. The business model is **paid listings** (one-time fee per listing) plus a **seller subscription** (monthly/yearly) that waives listing fees and unlocks premium features. The site must be fully **bilingual: English (EN) and Lithuanian (LT)**, with LT as the default locale.

---

## 1. Tech Stack

- **Next.js 15** (App Router, React Server Components, Server Actions)
- **Tailwind CSS v4**
- **Supabase** — Postgres, Auth, Storage (car photos), Realtime (chat + notifications), Row Level Security on every table
- **Stripe** — one-time listing fee payments (Checkout) + recurring subscriptions (Billing), webhooks for fulfillment
- **next-intl** for i18n (EN/LT), locale-prefixed routes: `/lt/...` (default) and `/en/...`
- TypeScript strict mode throughout
- Deployment target: **Vercel**

No other frameworks. Keep dependencies minimal.

---

## 2. Reference Design (two attached screenshots — follow closely)

### Reference A — Landing page (`LandingPage.jpg`)
Replicate this structure:
1. **Hero**: full-width photographic hero of cars, dark overlay, small tagline line ("Shop Online. Pickup Today...") above a large bold headline ("Fast, Simple and Easy" → localize, e.g. LT: "Greita, paprasta ir patogu"). Tabs under headline: **All / New / Used**. Prominent **search bar** with three dropdowns — *Any Make*, *Any Model*, *Price: All Prices* — and a blue pill **Search** button.
2. **Body-type quick-filter strip** below the hero: SUV, Sedan, Hatchback, Coupe, Hybrid, Convertible — each with a small line icon.
3. **"Most Searched" section**: 4-column grid of listing cards. Each card: photo with rounded corners, optional badge top-left ("Great Price" green / "Low Mileage" blue), bookmark icon top-right, title, one-line spec subtitle, a 3-cell spec row (mileage · fuel · transmission, each with icon), price bold bottom-left, "View Details ↗" link bottom-right. "View All" link at section top-right.
4. **Dual CTA banners**: two side-by-side rounded panels — light blue "Are You Looking For a Car?" and light pink "Do You Want to Sell a Car?" — each with short copy, a button (blue / dark navy), and a line illustration.
5. **"We're BIG on what matters to you"**: 2×2 grid of value props with line icons (Special Financing Offers, Trusted Dealers, Transparent Pricing, Expert Car Service — adapt copy to our actual value props: e.g., Verified Sellers, Secure Payments, LT-wide Coverage, Fair Fees).
6. **Popular Makes** section (dark navy background) leading into the footer.

Visual language: clean white background, dark navy `#050B20`-ish text, blue primary accent, generous whitespace, rounded-xl cards with subtle borders/shadows, Inter-style geometric sans.

### Reference B — Browse/Inventory page (`browse_all.jpg`, Tesla inventory style)
Replicate this structure for the **Browse All** page:
- **Left sidebar filter panel** (sticky, scrollable): location (city + "search within X km" radius dropdown), Make/Model (radio or select), Inventory Type (New/Used), Payment (Cash/Lease toggle if relevant → for us: price range slider), Body Type, Trim/Engine, Exterior Color (color swatch dots), Interior Color, Wheels, Options checkboxes, Year range, Mileage range, Fuel type, Gearbox, Drivetrain. Filters update results live via URL search params (shareable/bookmarkable filter state).
- **Right results area**: 2-column card grid (responsive → 1 col mobile). Each card: model name + trim, price top-right (show struck-through original price if seller marked a discount), "€X /mo est. financing" microcopy, large side-profile photo, 3-stat row (e.g., Mileage · Year · Power), then a two-column mini spec list (paint, wheels, interior, notable options).
- Sort dropdown (price ↑↓, newest, mileage, year) + result count. Infinite scroll or "Load more".

---

## 3. Core Pages & Routes

| Route | Page |
|---|---|
| `/` | Landing (Reference A) |
| `/browse` | Browse all with filters (Reference B) |
| `/listing/[id]` | Listing detail: photo gallery (lightbox), full specs table, description, seller card (name, rating, member since, badge if Premium/Dealer), price, contact buttons, similar listings |
| `/sell` | Multi-step listing wizard (see §5) |
| `/pricing` | Listing fees + subscription plans comparison table |
| `/dashboard` | Seller dashboard: my listings (active/pending/expired/sold), stats (views, saves, messages), subscription status, billing history |
| `/messages` | Built-in buyer↔seller chat (Supabase Realtime), per-listing threads |
| `/saved` | Saved/bookmarked listings |
| `/auth/*` | Sign up / sign in (email + Google OAuth) |
| `/admin` | Admin: moderate listings (approve/reject), manage users, view revenue, feature listings |

---

## 4. Monetization (this is central — implement fully)

### 4.1 Listing Fee (pay-per-listing)
- Non-subscribers pay a **one-time fee per listing** via Stripe Checkout before the listing goes live.
- Tiered by listing duration/visibility, configurable in an admin-editable `pricing_config` table. Defaults (EUR):
  - **Standard** — €9.99 / 30 days
  - **Plus** — €19.99 / 30 days + "highlighted" card styling + 1 bump to top
  - **Featured** — €34.99 / 30 days + homepage "Featured" carousel slot + highlighted + 3 bumps
- Listing stays in `draft/pending_payment` until webhook confirms payment → `active`.
- Renewals: expired listings can be reactivated by paying again.

### 4.2 Subscriptions (waive fees + premium features)
Stripe Billing, monthly & yearly (yearly ≈ 2 months free):

| | Free | **Premium** (€24.99/mo or €249/yr) | **Dealer** (€79.99/mo or €799/yr) |
|---|---|---|---|
| Active listings | pay per listing | 10 included, no listing fee | Unlimited, no listing fee |
| Listing tier included | — | Plus-level styling | Featured-level styling |
| Bumps to top | pay | 5/mo | 30/mo |
| Analytics (views, saves, CTR) | — | ✔ | ✔ + export CSV |
| Verified badge on profile | — | ✔ | ✔ "Dealer" badge |
| Dealer storefront page (`/dealer/[slug]`, logo, all inventory) | — | — | ✔ |
| Priority support | — | ✔ | ✔ |

- Handle upgrade/downgrade/cancel via Stripe Customer Portal.
- Webhooks (`checkout.session.completed`, `invoice.paid`, `customer.subscription.updated/deleted`) update a `subscriptions` table; entitlements enforced server-side (never trust the client), with RLS + a `can_create_listing()` Postgres function.

---

## 5. Sell Wizard (multi-step, autosaving draft)

1. **Vehicle** — Make → Model (dependent dropdowns from a seeded `makes`/`models` table), year, body type, fuel (Petrol/Diesel/Hybrid/PHEV/Electric/LPG), gearbox (Manual/Automatic), drivetrain, engine cc & kW, mileage (km), color, VIN (optional), Euro emissions class, **TA (techninė apžiūra) valid until** — Lithuanian roadworthiness date, important locally.
2. **Photos** — drag-and-drop up to 20, Supabase Storage, client-side compression, reorder, first = cover. Require ≥3 photos.
3. **Details** — price (EUR), negotiable toggle, description (EN and/or LT fields), location (Lithuanian city selector: Vilnius, Kaunas, Klaipėda, Šiauliai, Panevėžys, + full list), options checklist (AC, heated seats, parking sensors, etc.).
4. **Package & Pay** — pick Standard/Plus/Featured, or show "Included in your subscription ✔" if entitled → Stripe Checkout or instant publish.
5. Listings go to `pending_review`; admin approves → `active` (auto-approve toggle in admin for later).

---

## 6. i18n Requirements (EN/LT)

- `next-intl` with full message catalogs — **no hardcoded UI strings anywhere**. Provide complete `lt.json` and `en.json` with real, natural Lithuanian (not machine-literal), e.g. Parduoti automobilį, Ieškoti, Kaina, Rida, Kuro tipas, Pavarų dėžė, Metai, Skelbimai, Prenumerata.
- Locale switcher in header (LT/EN flags or text toggle), persisted in cookie; `/lt` default, `hreflang` tags for SEO.
- Currency always **EUR**, formatted per locale (`Intl.NumberFormat`), mileage in **km**, dates in `YYYY-MM-DD`.
- Listing descriptions support both languages (two optional text fields; show the viewer's locale first, fall back to the other).

---

## 7. Database Schema (Supabase / Postgres — create migrations)

`profiles` (id → auth.users, display_name, phone, city, role: user/dealer/admin, avatar_url, verified, created_at)
`makes`, `models` (seed with top ~40 makes and popular models for LT market: VW, BMW, Audi, Toyota, Mercedes, Škoda, Opel, Ford, Volvo, Renault, Peugeot, Nissan, Hyundai, Kia, Mazda...)
`listings` (id, seller_id, make_id, model_id, year, price_eur, mileage_km, fuel, gearbox, drivetrain, body_type, engine_cc, power_kw, color, vin, euro_class, ta_valid_until, city, description_en, description_lt, negotiable, status: draft/pending_payment/pending_review/active/expired/sold/rejected, tier: standard/plus/featured, expires_at, views_count, created_at)
`listing_photos` (listing_id, storage_path, position)
`listing_options` (listing_id, option_key)
`saved_listings` (user_id, listing_id)
`conversations` (listing_id, buyer_id, seller_id) + `messages` (conversation_id, sender_id, body, read_at, created_at)
`payments` (user_id, listing_id nullable, stripe_session_id, amount_eur, kind: listing_fee/subscription, status)
`subscriptions` (user_id, stripe_sub_id, plan: premium/dealer, interval, status, current_period_end, bumps_remaining)
`pricing_config` (key, value_eur, editable via admin)
`listing_bumps` (listing_id, bumped_at)

RLS: users read `active` listings publicly; sellers CRUD only their own; admin full access; messages visible only to participants.

---

## 8. Features Checklist

- Full-text + faceted search, filter state in URL params
- Saved searches with optional email alert (store criteria; stub the email sender)
- View counter (debounced, unique-ish per session)
- "Bump to top" action consuming subscription bumps or a €2.99 one-off payment
- Badges auto-computed: "Great Price" (below median for make/model/year), "Low Mileage" (below median km/year)
- Featured carousel on landing pulls `tier = featured` active listings
- Basic SEO: per-listing metadata, OpenGraph image = cover photo, sitemap, localized titles ("BMW 530d 2019, Vilnius — kaina €18 900")
- Responsive: mobile-first cards, sidebar filters collapse into a slide-over sheet on mobile
- **Mock mode**: `MOCK_MODE=true` env flag seeds ~60 realistic fake LT listings (mixed cities, EUR prices, real make/model combos) and stubs Stripe so the full flow is testable without keys

---

## 9. Build Order

1. Scaffold: Next.js 15 + Tailwind v4 + next-intl + Supabase client, layout shell (header with locale switcher, footer)
2. Migrations + seed script (makes/models, mock listings)
3. Landing page (Reference A) with real data
4. Browse page (Reference B) with working filters/sort/URL state
5. Listing detail page
6. Auth + dashboard shell
7. Sell wizard incl. photo upload
8. Stripe: listing-fee checkout + webhooks
9. Stripe: subscriptions + entitlement enforcement
10. Chat (Realtime)
11. Admin moderation + pricing config
12. SEO, polish, mobile pass

Start with step 1 and proceed sequentially. Ask before deviating from the reference layouts.
