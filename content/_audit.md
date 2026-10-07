# Ski-Hi Stampede Content Audit

**Source:** https://www.skihistampede.com/
**Captured:** 2026-10-07
**Purpose:** Single source of truth for every content element we lift, rewrite, or expand from the current Ski-Hi site. Each page below links to its raw capture, lists images downloaded, and notes decisions.

## Pages

- [x] `/` Homepage: see `content/raw/home.md`
- [x] `/our-sponsors` Sponsors: see `content/raw/sponsors.md`
- [x] `/events` Events: see `content/raw/events.md`
- [x] `/asu-scholorship-application` ASU Scholarship: see `content/raw/scholarship.md`
- [x] `/local-rodeo` Contestants: see `content/raw/contestants.md`
- [x] `/parade` Parade: see `content/raw/parade.md`
- [x] `/general-1` Mutton Busting: see `content/raw/mutton-busting.md`
- [x] `More ▾` dropdown contents: see `content/raw/_more-dropdown.md`
- [x] `/faq` FAQ: see `content/raw/faq.md` (empty on current site)
- [x] `/stampede-comittee` Committee: see `content/raw/committee.md` (14 members)
- [x] `/carnival` Carnival: see `content/raw/carnival.md` (operator: Wrights Amusements)
- [x] `/contact-us` Contact: see `content/raw/contact.md`
- [x] `/general-info` Vendors (not general info): see `content/raw/vendors.md`
- [ ] `/shop` Merch store: 10 products catalogued in `_more-dropdown.md`. Not rebuilt in Plan 1-4 scope.

## Social Media

- Facebook: see `content/raw/_facebook.md`
- Instagram: see `content/raw/_instagram.md`

## Images

Total: 59 unique image files, 15 MB after resize (down from 101 MB raw Wix originals). All stored under `public/images/raw/` with original Wix content-hash filenames preserved for deterministic cross-referencing to the per-page captures.

Pipeline:
1. `scripts/download-images.sh` fetches originals from Wix CDN.
2. `scripts/resize-images.mjs` caps max dimension at 2000 px, re-encodes JPG at quality 85. Keeps PNG as PNG. In-place, idempotent.

Astro's `<Image />` performs final AVIF/WebP optimization at build time in Plan 2 (Design System). Source files are kept at 2000 px for retina/zoom flexibility.

## Open Questions

Items blocking final `/events`, `/sponsors`, `/parade`, `/mutton-busting`, `/scholarship`, `/vendors`, and `/carnival` content. All require Ski-Hi to answer before launch. For the pitch, we use `[CONFIRM]` placeholders.

| # | Question | Blocks (page) | Who answers |
|---|---|---|---|
| 1 | 2027 PRCA performer lineup (bull riders, barrel racers, specialty acts) | /events | Ski-Hi committee |
| 2 | 2027 headliner concert artist (slot historically filled: Chase Rice 2025, Muscadine Bloodline 2024) | /events, /sponsors | Ski-Hi committee |
| 3 | Nightly dance performer 2027 (recurring: Justin Kemp Band) | /events | Ski-Hi committee |
| 4 | Carnival operator 2027 (recurring: Wrights Amusements) | /carnival, /sponsors | Ski-Hi committee |
| 5 | 2027 ticket pricing per performance | /tickets, /events | SeatMaxx + Ski-Hi |
| 6 | Sponsor company names behind each of the 33 logo files | /sponsors | Ski-Hi committee (roster CSV ideal) |
| 7 | Sponsor tier assignments (Platinum / Event / Chute / Specialty / Additional) | /sponsors | Ski-Hi committee |
| 8 | 2027 scholarship application deadline | /scholarship | Ski-Hi + Adams State |
| 9 | 2027 ASU scholarship form filename | /scholarship | Ski-Hi committee |
| 10 | ASU scholarship past recipients (names, years, photos) | /scholarship | Ski-Hi + ASU |
| 11 | 2027 vendor application open/close dates and fees | /vendors | Ski-Hi committee |
| 12 | 2027 parade grand marshal | /parade | Ski-Hi committee |
| 13 | Past parade grand marshals (heritage content) | /parade | Ski-Hi committee |
| 14 | 2027 mutton busting registration day/time (likely Mon July 5 or Tue July 6) | /mutton-busting | Ski-Hi committee |
| 15 | Mutton busting rules: ride duration, scoring, helmet/vest requirements | /mutton-busting | Ski-Hi committee |
| 16 | Mutton busting prizes/awards | /mutton-busting | Ski-Hi committee |
| 17 | Carnival operating hours 2027 (image on current site, not transcribed) | /carnival | Ski-Hi committee |
| 18 | Monte Vista Rotary chuckwagon dinner date, time, ticket info 2027 | /events | Rotary club + Ski-Hi |
| 19 | FAQ answers: bag policy, pet policy, re-entry policy, weather cancellation | /faq | Ski-Hi committee |
| 20 | Parade route (map) and street closures | /parade | Ski-Hi committee + city |
| 21 | 4 additional committee members (page shows 14, text cites "18 volunteers") | /committee | Ski-Hi committee |

## Decision Log

- **2026-10-07**: `/general-info` on current site is actually a vendor applications page. Our replica renames to `/vendors` for clarity.
- **2026-10-07**: Current site slug `/stampede-comittee` contains a typo. Our replica uses `/committee`.
- **2026-10-07**: `/shop` (10-product Wix merch store) deferred outside Plan 1-4 scope. SeatMaxx is not a merch platform. On launch, point `/shop` to a Shopify or kept Wix store rather than rebuild.
- **2026-10-07**: Four pages added to IA post-audit: `/faq`, `/committee`, `/carnival`, `/vendors`. Spec section 3 amended in commit `576c3df`.
- **2026-10-07**: Instagram and Facebook captures deferred as manual follow-up. Automated extraction yields effectively nothing from either platform. Current site imagery (59 files) is sufficient for Plan 2 and 3.
- **2026-10-07**: Images downloaded at Wix original resolution (102 MB total, largest 8 MB), then resized in-place via `scripts/resize-images.mjs` to cap max dimension at 2000 px (final: 15 MB). This was needed because Windows schannel + GitHub HTTPS choked on a 102 MB push. Final AVIF/WebP optimization still happens in Plan 2 via Astro `<Image />`.
- **2026-10-07**: Current site hero says "104 Years" (stale from 2023). Our replica uses "108 Years" for 2027 event (1919 to 2027).
- **2026-10-07**: Current site "Ticket Office OPENING JUNE 22, 2026" is stale. Our replica uses a `[CONFIRM]` placeholder for 2027 opening date.
- **2026-10-07**: Current `/events` page is empty and the current `/faq` page is empty. These are the two biggest pitch opportunities since we fill content Ski-Hi has not written.
- **2026-10-07**: Current `/contact-us` and `/events` have newsletter capture forms. Our replica does not. User explicitly rejected newsletter capture on 2026-10-06.
- **2026-10-07**: Historical sponsor names surfaced from `/event-pages-sitemap.xml`: Pepper Equipment (PRCA), Plant Nutrient Solutions Summit Gold (concert), MV Coop Kubota (after-party), Monte Vista Rotary (chuckwagon), Wrights Amusements (carnival). These are usable on `/sponsors` without `[CONFIRM]` tags.
- **2026-10-07**: Committee page gives 14 named members with high-resolution headshots. "18 volunteers" text claim implies 4 additional members are unnamed or vacant. Flag.
- **2026-10-07**: GitHub repo consolidated to the pre-existing `bgetz-beep/skihi` (not the mistakenly created `skihi-pitch-site`). Railway project `ski-hi` was already pointed at `bgetz-beep/skihi` with domain `skihi-production.up.railway.app`. Orphan `skihi-pitch-site` repo on GitHub needs manual deletion (requires `delete_repo` scope).

## Plan 1 Complete

**Date:** 2026-10-07
**Railway URL:** https://skihi-production.up.railway.app
**GitHub repo:** https://github.com/bgetz-beep/skihi
**Branches on remote:** `main` (merged), `plan-1-foundation` (preserved for review)
**Commits in Plan 1 (on main):** 13 since the design spec

Ready for Plan 2 (Design System + Homepage Vertical Slice).
