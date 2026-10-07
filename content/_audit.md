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

(fill in as discovered)

## Decision Log

(fill in as discovered)
