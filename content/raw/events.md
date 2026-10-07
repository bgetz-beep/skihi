# /events: Events / Schedule

**URL:** https://www.skihistampede.com/events
**Captured:** 2026-10-07

## Current State

**Page is empty.** The only visible content under the Events heading is "No events at the moment."

Dates in the page header show "July 8-11, 2027" but no per-event schedule, no performer bios, no pricing, no times.

## Newsletter Signup Form (noted, not reused)

The page has a newsletter signup form with:
- Fields: First Name, Last Name, Email, terms checkbox
- Confirmation: "Thanks for subscribing!"

**We do NOT reuse this on the replica.** User explicitly rejected newsletter capture.

## Images Referenced

Only shared assets (logo, wordmark, nav icons). No event-specific imagery.

## Observations

- Massive content gap: the single most important page on a rodeo site is empty.
- Likely populated manually a few weeks before the event; too late for marketing.
- Our replica needs its own schedule content, either:
  (a) Written from the standard 4-night PRCA format with `[CONFIRM]` tags for performers, OR
  (b) Shown as "Full schedule announced spring 2027" placeholder.

## Design implications for replica

- Build a schedule grid component that accepts an array of events with `date`, `time`, `title`, `description`, `price`.
- When no 2027 performer data is confirmed, we populate with 4-night rodeo format (Thu-Sun), kids events, parade, concert, awards. Each performer line is `[CONFIRM: TBD]`.
- Pricing table has to come from somewhere; probably reuse the 2026 structure from the live rodeoticket.com storefront as a `[CONFIRM]` baseline.

## Downloaded Images

(filled in during Task 9)
