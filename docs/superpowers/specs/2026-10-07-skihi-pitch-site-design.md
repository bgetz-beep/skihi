# Ski-Hi Stampede Pitch Site: Design Spec

**Date:** 2026-10-07
**Owner:** Braxton Getz (SeatMaxx)
**Status:** Approved, ready for implementation planning

## 1. Context

SeatMaxx (seatmaxx.com) is pitching the Ski-Hi Stampede rodeo (Monte Vista, Colorado; est. 1919; PRCA-sanctioned; next event July 8-11, 2027) to switch their ticketing from RodeoTicket to SeatMaxx. The deliverable is a replica of skihistampede.com, redesigned and expanded, with the SeatMaxx ticketing platform embedded as the "ticketing experience" they would adopt on signing.

The site is a sales pitch, shared with Ski-Hi as a live URL for review. It is not a public production site at pitch time, though it is engineered so that on sign-off it can graduate to production with minimal changes (flip robots gate, swap SeatMaxx mode from placeholder to embed, resolve `[CONFIRM]` placeholders, add custom domain).

## 2. Non-Goals

* No email capture, newsletter signup, or marketing automation. Explicitly rejected by owner.
* No analytics, tracking pixels, or Google Tag Manager at pitch time.
* No blog, news feed, or content marketing surface.
* No CMS. Content is baked into the codebase.
* No visible SeatMaxx co-branding. SeatMaxx is invisible plumbing in the pitch itself.
* No AI-generated-looking design. See section 4.
* No custom backend, database, or API. Static-only.

## 3. Information Architecture

Full nav parity with the current site, plus two SEO/AEO-valuable additions (`/about`, `/visit`).

| Route | Page | Primary purpose |
|---|---|---|
| `/` | Home | Hero, countdown, nightly schedule preview, buy tickets CTA, who-we-are, sponsor wall preview, plan-your-visit snippet, press/history teaser |
| `/tickets` | Tickets | Full SeatMaxx embed, pricing table, seat map explanation, ticket office hours and address |
| `/events` | Events / Schedule | Full 4-night schedule, performer bios, event descriptions (rodeo, parade, mutton busting, concerts) |
| `/sponsors` | Our Sponsors | Full sponsor wall with tiers, sponsor-us CTA, downloadable sponsorship packet link |
| `/contestants` | Contestant Information | Local rodeo rules, entry info, livestock, PRCA sanctioning info, contact |
| `/parade` | Parade | Route map, time, entry form, grand marshal, parade history |
| `/mutton-busting` | Mutton Busting | Rules, age limits, signup, prizes, past winners |
| `/scholarship` | ASU Scholarship | Scholarship description, eligibility, application link, past recipients |
| `/about` | About / History | 100+ years of heritage, origin story, PRCA history, past champions, archive photo wall |
| `/visit` | Plan Your Visit | Venue address, parking, gate info, lodging in Monte Vista and Alamosa, directions, FAQ |
| `/contact` | Contact | Phone, email, PO Box, ticket office hours, social links, `mailto:` contact |
| `/faq` | FAQ | 15 to 25 structured questions with FAQPage schema |
| `/committee` | Committee | Stampede Committee grid (14+ volunteers, 4 officers + directors) |
| `/carnival` | Carnival | Wrights Amusements carnival details, hours, rides, pricing |
| `/vendors` | Vendors | Vendor application info, requirements, dates, downloadable form |
| `/404` | Not Found | Western-themed error, nav back home |

**Rationale:** The current site funnels everything through a thin `/` and buries key info behind nav. New IA puts the three conversion-critical surfaces (schedule, tickets, visit) one click from `/` with in-page previews. `/about` and `/visit` are new; they score high on both SEO (schema.org `TouristAttraction`, `Event`, `FAQPage`) and AEO (answers common LLM queries like "where is Ski-Hi Stampede held" and "where to stay for Ski-Hi Stampede").

*Amended 2026-10-07 after content audit:* Added `/faq`, `/committee`, `/carnival`, `/vendors` based on pages discovered via `/pages-sitemap.xml`. The current site hides these behind a JS-generated "More ▾" dropdown. All four add SEO or AEO value and are low-effort to build with the data captured. The current site's `/stampede-comittee` has a typo in the slug; our replica uses `/committee`. The current site's `/general-info` is actually a vendor applications page; our replica names it `/vendors` for clarity. The current site's `/shop` (10 merch products on a Wix store) is deferred: SeatMaxx is not a merch platform. If kept at launch, point `/shop` at a Shopify or existing Wix store rather than rebuild.

## 4. Visual System

### Design philosophy

Modern western. The site must feel like a hundred-year-old rodeo rendered with 2026 production values, not an AI-generated site with cowboy flavor. Explicit anti-patterns (owner feedback, 2026-10-06):

* No em-dashes in copy. Use commas, periods, colons, or restructure the sentence.
* No gradient backgrounds. Flat colors or real texture only.
* No decorative Lucide/Heroicons/Feather icons sprinkled through the UI. Icons allowed only when functionally necessary.
* No "hero + 3 feature cards + testimonial strip + CTA" cookie-cutter layouts.
* No glow, blur, backdrop-filter, or frosted-glass effects.
* No fade-in-on-scroll stock animations.
* No pill-shaped buttons everywhere. Rectangular with purposeful shape.
* No perfectly symmetric grids throughout. Editorial, asymmetric compositions.
* No generic AI stock illustrations. Real photography only.
* No AI-flavored buzzword marketing copy.

### Palette

* Bone white `#F2EBDC`: primary background, faded program paper
* Oxblood `#6B1F1A`: primary brand, aged rodeo poster red
* Dust tan `#B59470`: secondary surfaces, dividers, badge backgrounds
* Denim `#2B3B55`: accent, used sparingly for emphasis
* Charcoal `#1A1613`: text, warm-cast near-black
* Grit black `#0F0C0A`: hero overlays only

One accent color, not three. Flat fills only.

### Typography

* Display: **Playfair Display Black** or **Lora Black** (Google Fonts). Serif, high contrast, letterpress feel. H1-H2 and pull quotes.
* Body: **IBM Plex Sans** or **Inter** (Google Fonts). Grotesque sans, workaday. Body, nav, forms.
* Numerals: tabular (`font-variant-numeric: tabular-nums`) on dates and prices.
* Aggressive scale. H1 at `clamp(3rem, 8vw, 6.5rem)` with tight leading. No centered subtitle pattern.

### Texture and material

* Paper grain SVG tile at ~5% opacity on bone backgrounds. One file, reused.
* Oxblood section dividers as 1px solid lines. Occasional double-rule for major breaks (program-style).
* Section labels in small caps with a vertical rule to the left. No icon-plus-card patterns.

### Layout

* 12-column grid, used asymmetrically. Hero captions typically cols 1-5, image bleeds cols 4-12.
* Full-bleed photography, color-untreated. Reused Ski-Hi images stay as-is. Hero overlays only on dark sections, using grit black at 40-60% opacity.
* CTAs are rectangular oxblood blocks, 2px border, tight padding, uppercase small-tracking: `[  BUY TICKETS  ]`.
* Hover inverts the button (bone text on oxblood becomes oxblood text on bone, border stays). No scale, no glow.

### Icons

Allowed only as functional primitives: nav toggle (menu/close), external-link indicator, social-link labels (text, not glyphs, unless necessary). Zero decorative icons. Section headers get a numeric label like `01 · WHO WE ARE`, not a boot SVG.

### Imagery

Reuse Ski-Hi's photos. Pull additional imagery from their Facebook and Instagram (public, event-owned). Treatment tiers:

* Hero: full-bleed, untreated.
* Section photos: thin dust-tan border, mounted-print feel.
* Archive/history: sepia duotone.

### Micro-moments

Deliberately few. The site has three dynamic things total:

1. Three-digit countdown ticker on `/` ticking every second to July 8, 2027.
2. Sponsor logo hover: logo unchanged, caption appears as plain text, no card.
3. Mobile menu: full-screen takeover with large type, not a hamburger slide drawer.

Nothing else moves on scroll.

## 5. Content Strategy

### Approach: full rewrite plus expansion

The current Ski-Hi content is thin. We rewrite everything in Ski-Hi's voice, keep hard facts exact, and add new sections where SEO/AEO value justifies them.

### Content audit (phase 1)

Fetch and inventory:

* All public skihistampede.com pages: `/`, `/our-sponsors`, `/events`, `/asu-scholorship-application`, `/local-rodeo`, `/parade`, `/general-1`, plus "More ▾" dropdown targets.
* Facebook (`/skihistampedeinc`) and Instagram (`/skihistampede_rodeo100`) for additional imagery, past-event photos, sponsor history.

Catalogue into `content/_audit.md` as the single source of truth for the rewrite.

### Image handling

Download every image we plan to use, store under `public/images/`, organize by page. Three reasons:

1. Wix CDN hotlinks can rot or get rate-limited.
2. We re-optimize to AVIF and WebP via Astro's `<Image />` component for Lighthouse scores.
3. We control alt text (currently absent on their site, direct SEO + AEO + accessibility win).

Attribution stays with Ski-Hi since we are building for them.

### Copy voice

Ski-Hi is a 100+ year community rodeo in the San Luis Valley. Voice is grounded, proud, generational, matter-of-fact. Not corporate. Not sarcastic. Not slick. Think a newspaper editor from 1952 who grew up in Monte Vista. Short sentences. Active verbs. Specific nouns (names of former champions, mile markers, mountain ranges, decade dates). Avoid vague superlatives ("amazing," "unforgettable"). Lean on concrete claims ("104 years," "four PRCA Small Rodeo of the Year nominations," "2335 Sherman Avenue").

### Content buckets

* **Verbatim-exact facts** (dates, address, phone, PO Box, PRCA affiliation, founding year, nomination count): copy exactly, never paraphrased.
* **Rewritten in-voice** (every page's narrative content): rewritten from existing copy and public history.
* **New sections requiring research** (`/about` history, `/visit` lodging): pulled from Wikipedia on Monte Vista, PRCA public records, and the three nearest hotel/campground options from public web. Facts verifiable, not invented.
* **Plausible placeholders flagged `[CONFIRM]`** (2027 performer bios, scholarship recipient names, sponsor tier assignments): written to look complete, visibly flagged with inline marker and a dev-only banner at the top of the staging site reading "Pitch preview. Items marked [CONFIRM] are placeholder content pending Ski-Hi review."

### Legal and visibility

Robots-banned until signing. Dev-only banner on every page notes "Internal pitch deliverable, not for distribution." The site is reachable via direct URL only; search engines are blocked via `robots.txt` and `<meta name="robots" content="noindex">`.

### No forms

`/contact` is a `mailto:` link. No form POST, no backend, no analytics.

## 6. SeatMaxx Integration Pattern

### Configuration

All ticketing config lives in `src/config/ticketing.ts`:

```ts
export const ticketing = {
  mode: 'placeholder' | 'embed' | 'link',
  buyTicketsUrl: '',
  embedScriptSrc: '',
  embedContainerId: '',
  embedAttributes: {},
  perEventUrls: {
    'rodeo-thursday': '',
    'rodeo-friday': '',
    'rodeo-saturday': '',
    'rodeo-sunday': '',
    'parade': '',
    'mutton-busting': '',
  },
}
```

Default to `mode: 'placeholder'` until real SeatMaxx values arrive. Switching to `'embed'` or `'link'` is a one-line config change, no code refactor.

### Integration surfaces

**`<BuyTicketsButton>`** (hero, nav, floating mobile bar, event cards): reads config, routes based on mode. In `placeholder`, routes to `/tickets`.

**`<SeatMaxxEmbed>` on `/tickets`**: single Astro island, loads JS only on this page. Three rendering modes:

* `placeholder`: styled block with pricing/seat-map info written as real page content. Page reads complete even without embed.
* `embed`: injects SeatMaxx `<script>` with configured attributes and mount div.
* `link`: prominent CTA to `buyTicketsUrl`, plus full pricing table and content on-page.

**Per-event tickets** on `/events`, `/parade`, `/mutton-busting`: each card has a "Get Tickets" CTA reading `ticketing.perEventUrls[eventKey]`. Falls back to `buyTicketsUrl` if per-event URL missing.

### Pitch behavior

During the pitch, the Buy Tickets CTA stays a placeholder. Clicking it does not funnel Ski-Hi into the current RodeoTicket flow. Owner can flip to `'link'` mode pointing at RodeoTicket after the first demo if an end-to-end click-through is desired.

### Scripts

Zero scripts on all pages except `/tickets`. SeatMaxx embed is the only client JS the site loads, and only on the one page.

## 7. SEO Strategy

### Technical foundations

* `@astrojs/sitemap` auto-generates `sitemap.xml`.
* Dynamic `robots.txt` with sitemap URL.
* `<link rel="canonical">` on every page.
* OpenGraph and Twitter cards per page (title, description, hero image, event dates).
* `hreflang="en-US"`.
* Hand-written `<title>` and `<meta name="description">` per page.
* Astro's `<Image />` on every image: AVIF + WebP + lazy + explicit width/height.
* Preload hero font. Preconnect to SeatMaxx CDN only on `/tickets`.
* Lighthouse budget: 95+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO on every page.

### Pitch-time robots gate

`SITE_INDEXABLE` env var (default `false`) controls both `robots.txt` and the per-page `<meta name="robots">`. Flipping to `true` is the only step needed to make the site indexable at launch.

### Structured data (JSON-LD per page)

| Page | Schema |
|---|---|
| `/` | `Event` (parent), `Organization`, `BreadcrumbList` |
| `/tickets` | `Event` + nested `Offer` with prices |
| `/events` | `Event` entries per sub-event, each a `SubEvent` of parent |
| `/sponsors` | `Organization` with `sponsor` property |
| `/parade` | `Event` with `location`, `eventSchedule` |
| `/mutton-busting` | `Event` with `audience`, `offers` |
| `/scholarship` | `EducationalOccupationalProgram` |
| `/about` | `Organization` with `foundingDate: 1919`, `foundingLocation`, `award` |
| `/visit` | `TouristAttraction` + `LodgingBusiness` list |
| `/contact` | `ContactPoint` with phone, email, hours |

Validated via Google Rich Results Test and schema.org validator in phase 6.

### On-page SEO

* One H1 per page, keyword-aligned.
* Internal linking: every page links to `/tickets` and `/events` with natural anchor text.
* Alt text on every image.
* Human-readable URL slugs (`/mutton-busting`, not `/general-1`).

### Local SEO (geo-critical for this event)

* NAP consistency (name, address, phone) from single source `src/config/organization.ts`.
* Target keywords: "monte vista rodeo", "san luis valley rodeo", "colorado oldest rodeo", "ski hi stampede 2027", "mutton busting monte vista", "monte vista parade july". Natural placement in H1/H2/body/alt where it fits, no stuffing.
* Google Business Profile claim flagged for handoff, out of dev scope.

## 8. AEO Strategy

### `llms.txt` adoption

Plain-text `llms.txt` at site root listing event name, dates, location, phone, email, canonical page URLs with one-line descriptions, short "about" summary. Companion `llms-full.txt` with full site content as markdown. Both hand-written. Standard is emerging but adoption cost is near zero.

### Content structure for extractability

1. **Definition sentences early.** First paragraph of every page is a single declarative sentence usable as a quote. Example on `/`: *"The Ski-Hi Stampede is a PRCA-sanctioned professional rodeo held in Monte Vista, Colorado every July since 1919."*
2. **FAQ sections with FAQPage schema.** `/visit`, `/tickets`, `/mutton-busting`, `/parade`, `/contestants` each end with an FAQ block. Questions phrased as users ask LLMs: "When is the Ski-Hi Stampede 2027?", "Where do I park for the Ski-Hi Stampede?", "What time does the parade start?". Answers 1-3 sentences, self-contained.
3. **Entity density.** Every page names specific entities (San Luis Valley, Monte Vista, PRCA, Rio Grande County, Adams State University, Highway 160, Sherman Avenue, exact years).
4. **Semantic HTML.** `<article>`, `<section>`, `<header>`, `<time datetime="2027-07-08">`, `<address>`.

### Target queries

Primary 10, mapped to destination pages:

| Query | Page |
|---|---|
| when is the ski hi stampede | `/` |
| where is ski hi stampede | `/visit` |
| ski hi stampede tickets price | `/tickets` |
| oldest rodeo in colorado | `/about` |
| monte vista rodeo 2027 | `/events` |
| ski hi stampede parade route | `/parade` |
| mutton busting monte vista | `/mutton-busting` |
| ski hi stampede history | `/about` |
| where to stay for ski hi stampede | `/visit` |
| ski hi stampede scholarship | `/scholarship` |

Each page explicitly answers its target query in H1/first-paragraph with the question verbatim or near-verbatim in an H2.

### Formatting LLMs prefer

* Short paragraphs (2-4 sentences).
* Lists for enumerable facts.
* Tables for structured comparisons.
* Dates in human (`July 8-11, 2027`) and machine (`<time datetime="2027-07-08">`) formats.
* Prices in text, never only in images.

### Validation (phase 7)

1. Paste each page URL into Perplexity, ChatGPT with web search, Google AI Overviews. Ask the 10 target queries. Record citation behavior.
2. Convert each page to markdown via a stripping tool. Verify coherence and quotability without CSS or JS.
3. Confirm `llms.txt` and FAQPage schema render in Google Rich Results.
4. Iterate copy on pages that fail.

Report lives in `content/_aeo-report.md`.

## 9. Phase Plan

| # | Phase | Deliverable | Checkpoint |
|---|---|---|---|
| 0 | Project foundation | GitHub repo, Astro + Tailwind + TypeScript scaffolded, Railway deploy wired up, placeholder landing page live, `organization.ts` and `ticketing.ts` config stubs | URL reachable, placeholder renders |
| 1 | Content audit | All source pages fetched, images downloaded to `public/images/`, `_audit.md` complete, Facebook/Instagram imagery pulled | `_audit.md` reviewed |
| 2 | Design system | Tailwind theme, base layout, nav, footer, button primitives, section-label pattern, paper-grain texture, image treatments. `src/components/README.md` with examples. Isolated preview at `/_design` | Visually reviewed |
| 3 | Homepage vertical slice | `/` built end-to-end: real content in Ski-Hi voice, countdown, schedule preview, who-we-are, sponsor preview, visit preview, SEO/AEO primitives applied. Lighthouse 95+ | Live homepage reviewed, design direction locked |
| 4 | Page rollout | All 10 remaining pages built following homepage pattern. Content rewritten per page. `[CONFIRM]` placeholders visible with top-banner notice | Full site clickable |
| 5 | SeatMaxx integration | `SeatMaxxEmbed` component, `BuyTicketsButton`, per-event URL plumbing, placeholder-mode styled block, mode-switching documented | Placeholder renders, config swap tested |
| 6 | SEO hardening | Sitemap, dynamic robots, canonical, OG, schema.org JSON-LD per page validated via Rich Results, Lighthouse budgets met, alt text everywhere | Rich Results green on every page |
| 7 | AEO hardening | `llms.txt`, `llms-full.txt`, FAQ sections on 5 pages with FAQPage schema, entity density pass, extractability test, `_aeo-report.md` | Validation report filed |
| 8 | QA, deploy, handoff | Cross-browser QA (Chrome, Safari, Firefox, mobile Safari, mobile Chrome), responsive QA (375/768/1024/1440/1920), broken-link check, axe a11y audit, Railway production deploy, handoff README | Pitch URL live, ready to demo |

### Deferred until Ski-Hi signs

* Custom domain (currently `*.railway.app` is fine)
* Real SeatMaxx embed snippet
* Flipping robots gate to indexable
* Resolving `[CONFIRM]` placeholders
* Google Business Profile claim
* Analytics (if ever)

### Slip handling

Each phase is self-contained. If content audit reveals the "More ▾" dropdown holds unexpected content (merch store, history archive, volunteer signup), we amend the IA from section 3 before continuing. No pushing through broken scope.

## 10. Open Questions / Decisions Log

Resolved during brainstorming (2026-10-06 and 2026-10-07):

| Decision | Choice | Rationale |
|---|---|---|
| Scope | Full nav parity (10+ pages) | Owner wants complete pitch |
| Visual direction | Modern western, strict anti-AI | Must feel custom, not templated |
| Framework | Astro + Tailwind | SEO/AEO primitives, zero JS by default, best fit for mostly-static content with one embed slot |
| Hosting | Railway | CLI already installed, owner knows it |
| SeatMaxx visibility | Invisible plumbing | Pitch strategy, strongest emotional sell |
| Copy approach | Full rewrite plus expansion | Owner wants best-in-class, not thin replica |
| Deliverable form | Shared live URL, no CMS | Review and demo, not production handoff |
| Timeline | No deadline, build it complete | Quality over speed |
| Email signup | Rejected | Owner explicit no |
| Placeholder visibility | Visible with `[CONFIRM]` tag + top banner | Transparent, not misleading |
| Pitch Buy Tickets CTA | Placeholder, not live link | Avoid accidental competitor conversion |

Remaining unknowns, to be resolved in the plan or during implementation:

* Contents of the "More ▾" dropdown on current site (phase 1 content audit).
* Final SeatMaxx embed snippet and per-event URLs (arrives from owner mid-project).
* Final `[CONFIRM]` content (Ski-Hi responsibility post-signing).
* GitHub repo location (owner personal or SeatMaxx org).
