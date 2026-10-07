# "More ▾" Dropdown Contents

**Captured:** 2026-10-07
**Source:** `/sitemap.xml`, `/pages-sitemap.xml`, `/store-products-sitemap.xml`, `/event-pages-sitemap.xml` on skihistampede.com. (The in-page "More" dropdown is JS-generated and not visible in static HTML; sitemaps revealed the full page list.)

## Pages Discovered Outside Primary Nav

| Label (inferred) | URL | Already captured? | Novel content? |
|---|---|---|---|
| FAQ | /faq | no | yes |
| Shop | /shop | no | yes (10 products) |
| Stampede Committee | /stampede-comittee | no | yes |
| Contact Us | /contact-us | no | yes |
| General Info | /general-info | no | yes |
| More (parent page) | /more | no | wrapper or redirect |
| Carnival | /carnival | no | yes |

## Store Product Inventory (from `/store-products-sitemap.xml`)

Ski-Hi runs a Wix merch store with 10 products:

- 100th Anniversary Commemorative 2022 Single Panel Poster Print
- 100th Anniversary 1920 Single Panel Poster
- 100th Anniversary Dual Panel Poster Print
- 1920 Single Panel 3/16 Acrylic Print
- 2022 Single Panel 3/16 Acrylic Print
- Dual Panel 3/16 Acrylic Print
- SHS Cowboy Contest Hoodie
- SHS Team Roper T-Shirt
- SHS Souvenir Rodeo Vintage Crewneck
- SHS Bronc Rider Souvenir T-Shirt

## Event History (from `/event-pages-sitemap.xml`)

Historical sub-events across 2023-2026 (none for 2027 yet). Nightly program pattern:

**PRCA Rodeo performances (presented by Pepper Equipment)**
- Thursday Night PRCA Rodeo
- Friday Night PRCA Rodeo
- Saturday Night PRCA Rodeo
- Sunday Matinee PRCA Rodeo

**Nightly entertainment**
- Nightly Dance Featuring Justin Kemp Band (recurring annual, Thu/Fri/Sat/Sun)
- MV Coop Kubota After Party Featuring Justin Kemp Band (2026 recurrence)
- BFO Dance featuring Zach Neil
- BFO Tailgate Party
- Bullfighters Only (BFO shows)

**Headliner concerts (recurring annual, presented by Plant Nutrient Solutions Summit Gold)**
- 2024-ish: Muscadine Bloodline with special guest Aaron Watson
- 2025-ish: Chase Rice with special guest Joe Nichols

**Standalone events**
- Downtown Parade (Fri + Sat mornings 10:00 AM)
- Local Rodeo
- SLV Resident Amateur Rodeo
- Wrights Amusements Carnival (runs all weekend)
- Monte Vista Rotary Chuckwagon Dinner

## Historical Sponsor Names (surfaced from event titles)

- Pepper Equipment (PRCA Rodeo presenting sponsor)
- Plant Nutrient Solutions Summit Gold (concert presenting sponsor)
- MV Coop Kubota (after-party sponsor)
- Monte Vista Rotary (chuckwagon dinner, community sponsor)
- Wrights Amusements (carnival operator and sponsor)

These are real sponsor names we can use on the sponsor wall without flagging `[CONFIRM]`.

## IA Impact: Spec Amendment Required

Design spec section 3 (IA) planned 12 routes. The More dropdown + sitemaps add 4 routes that materially improve the pitch:

**Add to IA:**
- `/faq` (replaces the FAQ-section-at-end-of-/visit idea with a dedicated page). Strong SEO + AEO value (FAQPage schema).
- `/committee` (board members, replaces current `/stampede-comittee` which has a typo). Heritage + credibility content.
- `/carnival` (Wrights Amusements carnival details). Family audience, independent revenue stream, independent SEO target.

**Merge:**
- `/general-info` content → `/visit` page (venue, directions, parking, lodging). No separate route.

**Defer:**
- `/shop` (merch store). Not in Plan 1-4 scope. SeatMaxx is ticketing, not merch. Keep `/shop` as a link out to a future shop; do not reimplement for pitch.

**New historical content available:**
- Real sub-event names and sponsors we can seed `/events` and `/sponsors` with (no `[CONFIRM]` needed on these).
- Nightly dance performer: Justin Kemp Band (recurring, likely 2027 again).
- Carnival operator: Wrights Amusements (likely 2027 again).
- Headliner concert slot available but 2027 artist not announced; flag `[CONFIRM]`.

## Next Actions

1. Amend `docs/superpowers/specs/2026-10-07-skihi-pitch-site-design.md` section 3 to reflect additions.
2. Fetch `/faq`, `/stampede-comittee`, `/carnival`, `/contact-us`, `/general-info` pages for content.
3. In Plan 2+ page work, build `/faq`, `/committee`, `/carnival` as dedicated routes.
