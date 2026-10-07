# Plan 3: Full Page Rollout + SeatMaxx Integration Pattern

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 15 remaining routes (`/tickets`, `/events`, `/sponsors`, `/about`, `/visit`, `/parade`, `/mutton-busting`, `/scholarship`, `/committee`, `/contestants`, `/carnival`, `/vendors`, `/faq`, `/contact`, `/404`) and wire up the configurable SeatMaxx integration pattern. On completion the pitch site is content-complete and every CTA in the design routes to a real page.

**Architecture:** Each page extends `BaseLayout` and composes section components from `src/components/sections/`. Routine primitives (PageHero, FAQList, SponsorGrid, CommitteeCard) land in Task 1 so every page uses them consistently. SeatMaxx integration arrives in Task 2 as the three-mode component defined in the spec (`placeholder` / `embed` / `link`). Default mode stays `placeholder` until Braxton has the real snippet. Every page carries its own schema.org JSON-LD matching the table in the spec.

**Tech Stack:** Unchanged from Plan 2. Astro 7, Tailwind CSS 4, TypeScript strict, Playfair Display + IBM Plex Sans, Astro `<Image />` for all images, zero client JS except countdown island and SeatMaxx embed.

## Global Constraints

* **Follow the Plan 2 design system exactly.** Use `SectionHeader`, `Button`, `BuyTicketsButton`, `HeroImage`, `SectionImage`, `ArchiveImage`, and the palette tokens (`bg-bone`, `text-oxblood`, etc.) literally. No ad-hoc colors, no new fonts, no new effects.
* **No em-dashes in any file.** Comma, colon, period, or restructure.
* **No gradients, no decorative icons, no cookie-cutter "hero + 3 cards + CTA" layouts.** Editorial, asymmetric.
* **Every page extends `BaseLayout`.** Every page provides `title`, `description`, and a `<slot name="jsonld">`.
* **Every page has schema.org JSON-LD per the spec table.** Build via `src/lib/schema.ts` and extend that file as needed.
* **FAQ sections on `/visit`, `/tickets`, `/mutton-busting`, `/parade`, `/contestants`** carry FAQPage schema (per spec section 8).
* **All `[CONFIRM]` content stays visible with the pitch banner.** Never hide what is placeholder.
* **`SITE_INDEXABLE` stays `false`.** Robots gate flips in Plan 4.
* **`ticketing.mode` stays `'placeholder'`.** Flip happens whenever Braxton drops in the real SeatMaxx snippet.
* **Images via `src/images/manifest.ts`.** Register new logical names there, do not hard-code Wix hash filenames in page files.
* **Voice:** ground, generational, matter-of-fact, specific nouns, short sentences. Same voice as Plan 2's WhoWeAre and VisitTeaser.
* **Commits:** one per task, Conventional Commits (`feat(tickets):`, `feat(sponsors):`, `feat(integration):`), pushed to `main` for Railway auto-deploy.
* **Lighthouse budget still applies:** Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100 (less `noindex` penalty).

---

## Task 1: Inner-Page Primitives

**Files:**
- Create: `src/components/PageHero.astro`
- Create: `src/components/FAQList.astro`
- Create: `src/components/CommitteeCard.astro`
- Create: `src/components/SponsorGrid.astro`
- Modify: `src/lib/schema.ts` (add `buildFaqSchema`, `buildWebPageSchema` builders)

**Interfaces:**
- Consumes: Plan 2 primitives and `organization` config.
- Produces:
  - `<PageHero title eyebrow? subtitle? />`: smaller than homepage hero. Oxblood background, bone text, 300-400 px tall. Used as the first component on every inner page.
  - `<FAQList items />`: renders a list of `{question, answer}` pairs with proper `<dl>` semantics and ships a FAQPage JSON-LD block as a nested `<script>`.
  - `<CommitteeCard name role photo />`: square portrait card, dust border, name and role under the photo.
  - `<SponsorGrid tiers />`: renders tiered sponsor sections. Each tier gets a heading, grid of sponsor cards (name + role + optional image via manifest).
  - `schema.ts` gains `buildFaqSchema(items)` returning FAQPage JSON-LD, and `buildWebPageSchema({title, description, url})` for generic pages.

- [ ] **Step 1: Create `src/components/PageHero.astro`**

```astro
---
interface Props {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}

const { title, eyebrow, subtitle } = Astro.props;
---
<header class="relative bg-oxblood text-bone">
  <div class="max-w-7xl mx-auto px-6 py-20 md:py-28">
    {eyebrow && (
      <p class="font-sans text-xs md:text-sm font-medium uppercase tracking-widest text-dust">
        {eyebrow}
      </p>
    )}
    <h1
      class="mt-4 font-display font-black leading-[0.9]"
      style="font-size: clamp(2.5rem, 7vw, 5.5rem);"
    >
      {title}
    </h1>
    {subtitle && (
      <p class="mt-6 font-sans text-lg md:text-2xl text-bone/90 max-w-3xl">
        {subtitle}
      </p>
    )}
  </div>
</header>
```

- [ ] **Step 2: Create `src/components/FAQList.astro`**

```astro
---
interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  items: readonly FaqItem[];
  class?: string;
}

const { items, class: className = "" } = Astro.props;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": items.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer,
    },
  })),
};
---
<section class={className}>
  <dl class="space-y-10">
    {items.map((item) => (
      <div class="border-t-2 border-dust pt-6">
        <dt class="font-display font-black text-2xl text-charcoal leading-tight">
          {item.question}
        </dt>
        <dd class="mt-3 font-sans text-base text-charcoal/80 max-w-prose">
          {item.answer}
        </dd>
      </div>
    ))}
  </dl>
  <script type="application/ld+json" set:html={JSON.stringify(faqSchema)}></script>
</section>
```

- [ ] **Step 3: Create `src/components/CommitteeCard.astro`**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  name: string;
  role: string;
  photo: ImageMetadata;
}

const { name, role, photo } = Astro.props;
---
<figure class="space-y-3">
  <div class="aspect-square border border-dust overflow-hidden bg-bone">
    <Image
      src={photo}
      alt={`${name}, ${role}, Ski-Hi Stampede Committee`}
      widths={[200, 400]}
      sizes="(min-width: 1024px) 25vw, 50vw"
      format="webp"
      loading="lazy"
      class="h-full w-full object-cover"
    />
  </div>
  <figcaption>
    <p class="font-display text-lg font-black text-charcoal leading-tight">{name}</p>
    <p class="font-sans text-xs uppercase tracking-widest text-oxblood">{role}</p>
  </figcaption>
</figure>
```

- [ ] **Step 4: Create `src/components/SponsorGrid.astro`**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Sponsor {
  name: string;
  role?: string;
  photo?: ImageMetadata;
}

interface Tier {
  label: string;
  description?: string;
  columns?: 2 | 3 | 4 | 5;
  sponsors: readonly Sponsor[];
}

interface Props {
  tiers: readonly Tier[];
}

const { tiers } = Astro.props;

const columnsClass = (n: number | undefined) => {
  switch (n) {
    case 2: return "md:grid-cols-2";
    case 3: return "md:grid-cols-3";
    case 5: return "md:grid-cols-3 lg:grid-cols-5";
    case 4:
    default: return "md:grid-cols-2 lg:grid-cols-4";
  }
};
---
<div class="space-y-20">
  {tiers.map((tier) => (
    <section>
      <header class="flex flex-wrap items-end justify-between gap-6 border-t-2 border-oxblood pt-6">
        <h2 class="font-display font-black text-3xl md:text-4xl text-charcoal">{tier.label}</h2>
        {tier.description && (
          <p class="font-sans text-sm text-charcoal/70 max-w-md">{tier.description}</p>
        )}
      </header>
      <ul class={`mt-10 grid gap-8 ${columnsClass(tier.columns)}`}>
        {tier.sponsors.map((s) => (
          <li class="space-y-3">
            {s.photo && (
              <div class="aspect-video border border-dust bg-bone p-4 flex items-center justify-center">
                <Image
                  src={s.photo}
                  alt={`${s.name} logo`}
                  widths={[200, 400]}
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  format="webp"
                  loading="lazy"
                  class="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            <p class="font-display text-lg font-black text-charcoal leading-tight">{s.name}</p>
            {s.role && <p class="font-sans text-xs uppercase tracking-widest text-oxblood">{s.role}</p>}
          </li>
        ))}
      </ul>
    </section>
  ))}
</div>
```

- [ ] **Step 5: Extend `src/lib/schema.ts`**

Append to existing file:

```ts
export function buildFaqSchema(
  items: ReadonlyArray<{ question: string; answer: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}

export function buildWebPageSchema(opts: {
  name: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": opts.name,
    "description": opts.description,
    "url": opts.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": organization.name,
      "url": site.baseUrl,
    },
  };
}
```

- [ ] **Step 6: Build and commit**

```bash
npm run build
git add -A
git commit -m "feat(design): add inner-page primitives (PageHero, FAQList, CommitteeCard, SponsorGrid)"
git push origin main
```

---

## Task 2: SeatMaxx Integration Pattern

**Files:**
- Create: `src/components/SeatMaxxEmbed.astro`
- Create: `src/components/SeatMaxxPlaceholder.astro`

**Interfaces:**
- Consumes: `ticketing` config from Plan 1.
- Produces:
  - `<SeatMaxxEmbed />`: top-level ticketing component. Dispatches on `ticketing.mode`:
    - `placeholder` renders `<SeatMaxxPlaceholder />` with a styled block explaining the embed slot plus full placeholder pricing content.
    - `embed` injects a `<script src>` to `ticketing.embedScriptSrc` plus a mount div with the configured id.
    - `link` renders a large Buy Tickets CTA pointing at `ticketing.buyTicketsUrl`.
  - `<SeatMaxxPlaceholder />`: standalone placeholder block styled like a real embed, used by `SeatMaxxEmbed` in placeholder mode and reusable on `/tickets` as its own section.

- [ ] **Step 1: Create `src/components/SeatMaxxPlaceholder.astro`**

```astro
---
import BuyTicketsButton from "@components/BuyTicketsButton.astro";

const priceRows = [
  { label: "Reserved Box, per performance", price: "$45" },
  { label: "Reserved Grandstand, adult", price: "$30" },
  { label: "Reserved Grandstand, child (6 to 12)", price: "$15" },
  { label: "Reserved Grandstand, child (under 6)", price: "Free" },
  { label: "General Admission, adult", price: "$18" },
  { label: "General Admission, child (6 to 12)", price: "$8" },
  { label: "4-Night Package", price: "$140 to $180" },
];
---
<div id="embed" class="border-2 border-oxblood bg-bone p-8 md:p-12">
  <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">
    Ticketing powered by SeatMaxx
  </p>
  <h2 class="mt-3 font-display font-black text-3xl md:text-5xl text-charcoal leading-[0.95]">
    Pick your night. Pick your seat.
  </h2>
  <p class="mt-4 font-sans text-base text-charcoal/80 max-w-prose">
    The SeatMaxx seat picker loads here once the integration is live. Below is the 2027 pricing structure.
  </p>

  <table class="mt-10 w-full border-t-2 border-dust">
    <tbody class="divide-y divide-dust/40">
      {priceRows.map((row) => (
        <tr>
          <td class="py-4 font-sans text-base text-charcoal">{row.label}</td>
          <td class="py-4 font-sans text-base font-medium text-charcoal tabular text-right">{row.price}</td>
        </tr>
      ))}
    </tbody>
  </table>
  <p class="mt-4 font-sans text-xs uppercase tracking-widest text-oxblood">
    [CONFIRM] 2027 pricing based on 2026 structure
  </p>

  <div class="mt-10 flex flex-wrap gap-4">
    <BuyTicketsButton />
    <a href="#faq" class="inline-flex items-center font-sans text-xs font-medium uppercase tracking-widest text-charcoal hover:text-oxblood">
      Ticketing FAQ
    </a>
  </div>
</div>
```

- [ ] **Step 2: Create `src/components/SeatMaxxEmbed.astro`**

```astro
---
import SeatMaxxPlaceholder from "@components/SeatMaxxPlaceholder.astro";
import BuyTicketsButton from "@components/BuyTicketsButton.astro";
import { ticketing } from "@config/ticketing";
---
{ticketing.mode === "placeholder" && <SeatMaxxPlaceholder />}

{ticketing.mode === "embed" && (
  <div id={ticketing.embedContainerId || "seatmaxx-mount"}>
    <noscript>
      <p class="font-sans text-base text-charcoal/80">
        Enable JavaScript to see the SeatMaxx seat picker, or
        <a class="underline text-oxblood" href={ticketing.buyTicketsUrl || "#"}>
          open it in a new tab
        </a>.
      </p>
    </noscript>
    <script
      is:inline
      src={ticketing.embedScriptSrc}
      {...ticketing.embedAttributes}
    ></script>
  </div>
)}

{ticketing.mode === "link" && (
  <div id="embed" class="border-2 border-oxblood bg-bone p-8 md:p-12 text-center space-y-6">
    <h2 class="font-display font-black text-3xl md:text-5xl text-charcoal">
      Buy your tickets.
    </h2>
    <p class="font-sans text-base text-charcoal/80">
      Tickets open in SeatMaxx. You will not leave this site.
    </p>
    <BuyTicketsButton class="mx-auto" />
  </div>
)}
```

- [ ] **Step 3: Build and commit**

```bash
npm run build
git add -A
git commit -m "feat(integration): add SeatMaxx embed with three-mode dispatch"
git push origin main
```

The components are built but not yet consumed; Task 3 renders them on `/tickets`.

---

## Task 3: `/tickets` Page

**Files:**
- Create: `src/pages/tickets.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SeatMaxxEmbed`, `FAQList`, schema builders.
- Produces: `/tickets` route with hero, SeatMaxx integration, ticket-office info, and FAQ with FAQPage schema.

- [ ] **Step 1: Create `src/pages/tickets.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import SeatMaxxEmbed from "@components/SeatMaxxEmbed.astro";
import FAQList from "@components/FAQList.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildEventSchema, buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Buy tickets for the ${organization.name}, ${organization.nextEvent.displayDate}, Monte Vista, Colorado. Reserved and general admission options for every performance.`;
const url = `${site.baseUrl}/tickets`;

const faqItems = [
  {
    question: "When do 2027 tickets go on sale?",
    answer: "The Ski-Hi Stampede ticket office opens for the 2027 event [CONFIRM: date]. The office is at 947 1st Ave, Monte Vista, Colorado, Monday through Friday 9 AM to 5 PM.",
  },
  {
    question: "What is the difference between Reserved Box and Reserved Grandstand?",
    answer: "Reserved Box seats are the front rows and have individual seat assignments. Reserved Grandstand is bench seating in the covered stands with assigned sections. General Admission is open seating in the outer stands.",
  },
  {
    question: "Can I buy a 4-night package?",
    answer: "Yes. The 4-night package includes one ticket for each PRCA performance Thursday through Sunday. Package pricing is lower than buying each night separately.",
  },
  {
    question: "Are children's tickets available?",
    answer: "Yes. Children ages 6 to 12 pay a reduced rate for both Reserved Grandstand and General Admission. Children under 6 are free in General Admission seating when accompanied by a paying adult.",
  },
  {
    question: "Is parking included?",
    answer: "Yes. Parking at the Ski-Hi Complex is free for all ticket holders.",
  },
  {
    question: "Can I buy tickets at the gate?",
    answer: "Yes, pending availability. Advance purchase is recommended for Friday and Saturday performances, which historically sell out.",
  },
];

const jsonLd = [
  buildWebPageSchema({ name: "Tickets", description, url }),
  buildEventSchema(),
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Tickets", url },
  ]),
];
---
<BaseLayout title="Tickets" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow={`${organization.nextEvent.displayDate}`}
    title="Tickets."
    subtitle="Reserved Box, Reserved Grandstand, and General Admission for every performance of the 2027 Ski-Hi Stampede."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section>
      <SectionHeader number="01" label="Buy tickets" />
      <div class="mt-10">
        <SeatMaxxEmbed />
      </div>
    </section>

    <section class="grid gap-12 md:grid-cols-2 items-start">
      <div>
        <SectionHeader number="02" label="Ticket office" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Prefer to buy in person?
        </h2>
        <p class="mt-6 font-sans text-base text-charcoal/80 max-w-prose">
          The ticket office is open Monday through Friday during the lead-up to the event. Cash and card accepted.
        </p>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-4">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Ticket Office</p>
        <address class="not-italic font-sans text-base text-charcoal">
          {organization.ticketOffice.streetAddress}<br />
          {organization.ticketOffice.city}, {organization.ticketOffice.region} {organization.ticketOffice.postalCode}
        </address>
        <p class="font-sans text-sm text-charcoal/80">{organization.ticketOffice.hours}</p>
        <p class="font-sans text-sm text-charcoal/80">
          Opens [CONFIRM: 2027 opening date]
        </p>
        <p class="font-sans text-sm">
          <a href={`tel:${organization.contact.phone.replace(/[^0-9+]/g, "")}`} class="text-oxblood hover:underline">
            {organization.contact.phoneDisplay}
          </a>
        </p>
      </aside>
    </section>

    <section id="faq">
      <SectionHeader number="03" label="Ticketing FAQ" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
        Six questions, six answers.
      </h2>
      <FAQList items={faqItems} class="mt-12" />
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
grep -oE "Buy tickets|Reserved Box|Ticket office|SeatMaxx|FAQPage" dist/tickets/index.html | sort -u
git add -A
git commit -m "feat(tickets): /tickets page with SeatMaxx placeholder, office, FAQ"
git push origin main
```

Expected grep output includes all five markers.

---

## Task 4: `/events` Page

**Files:**
- Create: `src/pages/events.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `Button`, `BuyTicketsButton`, schema builders.
- Produces: `/events` route with 4-night full schedule (richer than the homepage preview), concert slot details, after-party details, standalone events (parade, mutton busting, local rodeo, carnival) linked to their respective pages, Event + BreadcrumbList JSON-LD.

- [ ] **Step 1: Create `src/pages/events.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";
import BuyTicketsButton from "@components/BuyTicketsButton.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildEventSchema, buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Four nights of PRCA rodeo, two downtown parades, nightly dancing, headliner concert, and a carnival. ${organization.nextEvent.displayDate}, Monte Vista.`;
const url = `${site.baseUrl}/events`;

const nights = [
  {
    label: "Thursday Night",
    date: "July 8, 2027",
    datetime: "2027-07-08",
    description: "Opening performance of the 108th Ski-Hi Stampede.",
    events: [
      { time: "5:00 PM", title: "Gates open", detail: "Carnival midway opens, concessions and vendors" },
      { time: "7:00 PM", title: "PRCA Rodeo, Opening Performance", detail: "Presented by Pepper Equipment" },
      { time: "9:00 PM", title: "Nightly Dance", detail: "Justin Kemp Band at the Stampede Grounds" },
    ],
  },
  {
    label: "Friday Night",
    date: "July 9, 2027",
    datetime: "2027-07-09",
    description: "Headliner concert night.",
    events: [
      { time: "10:00 AM", title: "Downtown Parade", detail: "Starts at Chico Avenue, east on First Avenue" },
      { time: "5:00 PM", title: "Gates open", detail: "Carnival midway, Bullfighters Only tailgate" },
      { time: "7:00 PM", title: "PRCA Rodeo, Friday Night Performance", detail: "Presented by Pepper Equipment" },
      { time: "9:30 PM", title: "Headliner Concert", detail: "[CONFIRM: 2027 artist], presented by Plant Nutrient Solutions Summit Gold" },
    ],
  },
  {
    label: "Saturday",
    date: "July 10, 2027",
    datetime: "2027-07-10",
    description: "Local rodeo, PRCA, parade, and the biggest after party.",
    events: [
      { time: "10:00 AM", title: "Downtown Parade", detail: "Repeats Friday route" },
      { time: "11:00 AM", title: "Local Rodeo", detail: "San Luis Valley residents, following PRCA slack" },
      { time: "5:00 PM", title: "Gates open", detail: "Carnival midway, mutton busting weigh-in" },
      { time: "7:00 PM", title: "PRCA Rodeo, Saturday Night Performance", detail: "Presented by Pepper Equipment" },
      { time: "9:00 PM", title: "MV Coop Kubota After Party", detail: "Justin Kemp Band, dance floor open until 1 AM" },
    ],
  },
  {
    label: "Sunday Matinee",
    date: "July 11, 2027",
    datetime: "2027-07-11",
    description: "Final day, afternoon performance, awards.",
    events: [
      { time: "11:00 AM", title: "Gates open", detail: "Carnival midway open last day" },
      { time: "1:00 PM", title: "Sunday Matinee PRCA Rodeo", detail: "Presented by Pepper Equipment" },
      { time: "5:00 PM", title: "Awards Ceremony", detail: "Stampede Grounds, overall champions announced" },
    ],
  },
];

const relatedEvents = [
  { label: "Downtown Parade", href: "/parade", detail: "Friday and Saturday, 10 AM" },
  { label: "Local Rodeo", href: "/contestants", detail: "Saturday 11 AM, SLV residents" },
  { label: "Mutton Busting", href: "/mutton-busting", detail: "Every performance, 5 to 7 year olds" },
  { label: "Wrights Amusements Carnival", href: "/carnival", detail: "All four days" },
  { label: "Rotary Chuckwagon Dinner", href: "/events", detail: "Thursday, Rotary Park [CONFIRM]" },
];

const jsonLd = [
  buildWebPageSchema({ name: "Events and Schedule", description, url }),
  buildEventSchema(),
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Events", url },
  ]),
];
---
<BaseLayout title="Events and Schedule" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow={organization.nextEvent.displayDate}
    title="Four days. One schedule."
    subtitle="Every PRCA performance, every parade, every after party, every carnival hour."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="space-y-12">
      <SectionHeader number="01" label="The schedule" />
      {nights.map((night) => (
        <article class="border-t-2 border-oxblood pt-8 grid gap-8 md:grid-cols-12">
          <header class="md:col-span-4">
            <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">
              {night.label}
            </p>
            <p class="mt-2 font-display font-black text-3xl md:text-4xl">
              <time datetime={night.datetime}>{night.date}</time>
            </p>
            <p class="mt-4 font-sans text-sm text-charcoal/70 max-w-xs">
              {night.description}
            </p>
          </header>
          <ul class="md:col-span-8 space-y-6">
            {night.events.map((event) => (
              <li class="grid grid-cols-[auto_1fr] gap-6">
                <p class="font-sans text-xs uppercase tracking-widest text-charcoal/60 tabular pt-1 w-20">
                  {event.time}
                </p>
                <div>
                  <p class="font-sans text-base font-medium text-charcoal">{event.title}</p>
                  <p class="font-sans text-sm text-charcoal/70">{event.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}

      <div class="flex flex-wrap gap-4 pt-6">
        <BuyTicketsButton />
        <Button href="/tickets" variant="ghost">Ticket options and pricing</Button>
      </div>
    </section>

    <section>
      <SectionHeader number="02" label="Also happening" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
        Beyond the arena.
      </h2>
      <ul class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedEvents.map((e) => (
          <li>
            <a href={e.href} class="block border-t-2 border-dust pt-5 hover:border-oxblood transition-colors">
              <p class="font-display text-xl font-black text-charcoal">{e.label}</p>
              <p class="mt-2 font-sans text-sm text-charcoal/70">{e.detail}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(events): /events page with full 4-night schedule and related events"
git push origin main
```

---

## Task 5: `/sponsors` Page

**Files:**
- Create: `src/pages/sponsors.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `SponsorGrid`, `Button`, schema builders.
- Produces: `/sponsors` route with 5 sponsor tiers (Historical + Platinum + Event + Chute + Specialty) plus "Become a Sponsor" CTA block.

- [ ] **Step 1: Create `src/pages/sponsors.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import SponsorGrid from "@components/SponsorGrid.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildOrganizationSchema, buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Over one hundred businesses and families sponsor the Ski-Hi Stampede. Full roster of 2027 partners by tier and role.`;
const url = `${site.baseUrl}/sponsors`;

const tiers = [
  {
    label: "Named Partners",
    description: "Multi-year sponsors featured across the event's signature moments.",
    columns: 3 as const,
    sponsors: [
      { name: "Pepper Equipment", role: "PRCA Rodeo presenting sponsor" },
      { name: "Plant Nutrient Solutions, Summit Gold", role: "Headliner concert sponsor" },
      { name: "MV Coop Kubota", role: "After party sponsor" },
      { name: "Monte Vista Rotary", role: "Chuckwagon dinner" },
      { name: "Wrights Amusements", role: "Carnival operator" },
      { name: "Justin Kemp Band", role: "Nightly dance" },
    ],
  },
  {
    label: "Platinum Sponsors",
    description: "16 Platinum-tier partners supporting signature event elements.",
    columns: 4 as const,
    sponsors: Array.from({ length: 16 }, (_, i) => ({
      name: `[CONFIRM] Platinum Sponsor ${i + 1}`,
    })),
  },
  {
    label: "Event Sponsors",
    description: "One sponsor for each sanctioned PRCA event.",
    columns: 3 as const,
    sponsors: [
      { name: "[CONFIRM]", role: "Bareback" },
      { name: "[CONFIRM]", role: "Barrel Racing" },
      { name: "[CONFIRM]", role: "Breakaway Roping" },
      { name: "[CONFIRM]", role: "Bull Riding" },
      { name: "[CONFIRM]", role: "Calf Roping" },
      { name: "[CONFIRM]", role: "Mutton Busting" },
      { name: "[CONFIRM]", role: "Tie Down" },
      { name: "[CONFIRM]", role: "Steer Wrestling" },
      { name: "[CONFIRM]", role: "Team Roping" },
    ],
  },
  {
    label: "Chute Sponsors",
    description: "Seven chute-tier partners.",
    columns: 4 as const,
    sponsors: Array.from({ length: 7 }, (_, i) => ({
      name: `[CONFIRM] Chute Sponsor ${i + 1}`,
    })),
  },
  {
    label: "Specialty Sponsors",
    columns: 2 as const,
    sponsors: [
      { name: "[CONFIRM]", role: "Pick Up Man" },
      { name: "[CONFIRM]", role: "Photography" },
    ],
  },
];

const orgSchema = buildOrganizationSchema();
const sponsorNames = tiers.flatMap((t) => t.sponsors.map((s) => s.name)).filter((n) => !n.startsWith("[CONFIRM]"));
(orgSchema as Record<string, unknown>).sponsor = sponsorNames.map((n) => ({
  "@type": "Organization",
  "name": n,
}));

const jsonLd = [
  buildWebPageSchema({ name: "Sponsors", description, url }),
  orgSchema,
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Sponsors", url },
  ]),
];
---
<BaseLayout title="Sponsors" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Our partners"
    title="The people who keep the Stampede running."
    subtitle="Over one hundred businesses and families sponsor the Ski-Hi Stampede every July. The full 2027 roster, by tier."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section>
      <SectionHeader number="01" label="2027 Sponsors" />
      <div class="mt-10">
        <SponsorGrid tiers={tiers} />
      </div>
    </section>

    <section id="become-a-sponsor" class="border-2 border-oxblood p-8 md:p-12 bg-bone">
      <SectionHeader number="02" label="Become a sponsor" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95] max-w-3xl">
        Put your name on the oldest pro rodeo in Colorado.
      </h2>
      <p class="mt-6 font-sans text-base text-charcoal/80 max-w-prose">
        Sponsorship tiers from Chute to Platinum are available for the 2027 Ski-Hi Stampede. Each tier includes signage, program placement, PA mentions, and tickets. Email the committee for the current sponsorship packet and pricing.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <Button href={`mailto:${organization.contact.email}?subject=2027 Ski-Hi Stampede Sponsorship`}>
          Email the committee
        </Button>
        <Button href={`tel:${organization.contact.phone.replace(/[^0-9+]/g, "")}`} variant="ghost">
          Call {organization.contact.phoneDisplay}
        </Button>
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(sponsors): /sponsors page with tiered grid and become-a-sponsor CTA"
git push origin main
```

---

## Task 6: `/about` Page

**Files:**
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `ArchiveImage`, schema builders, `images` manifest.
- Produces: `/about` route with history timeline, PRCA stats, award mentions, archive wall. Organization schema with `foundingDate` and `award`.

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import ArchiveImage from "@components/ArchiveImage.astro";
import Button from "@components/Button.astro";
import { images } from "@/images/manifest";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildOrganizationSchema, buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Founded in 1919, the Ski-Hi Stampede is Colorado's oldest pro rodeo. One hundred and eight years of PRCA rodeo in Monte Vista, Colorado.`;
const url = `${site.baseUrl}/about`;

const milestones = [
  { year: "1919", event: "First Ski-Hi Stampede held in Monte Vista." },
  { year: "1948", event: "RCA (now PRCA) sanctioning begins." },
  { year: "1969", event: "Ski-Hi Stampede celebrates 50 years. [CONFIRM]" },
  { year: "1994", event: "First nomination for PRCA Small Rodeo of the Year. [CONFIRM]" },
  { year: "2019", event: "Centennial Stampede. 100 years." },
  { year: "2027", event: "108th consecutive Ski-Hi Stampede." },
];

const orgSchema = buildOrganizationSchema();
(orgSchema as Record<string, unknown>).award = `${organization.prcaNominations} PRCA Small Rodeo of the Year nominations`;

const jsonLd = [
  buildWebPageSchema({ name: "About", description, url }),
  orgSchema,
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "About", url },
  ]),
];
---
<BaseLayout title="About" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Est. 1919"
    title="Colorado's oldest pro rodeo."
    subtitle="One hundred and eight consecutive Julys of PRCA rodeo in Monte Vista. Run by two hundred volunteers. Watched by ten thousand fans a year."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-16 md:grid-cols-12">
      <div class="md:col-span-7 space-y-5 font-sans text-lg text-charcoal/90 max-w-prose">
        <SectionHeader number="01" label="Our story" />
        <p class="pt-6">
          The San Luis Valley Ski-Hi Stampede started in 1919 as a community rodeo for ranchers, cowboys, and families across the valley. One hundred and eight years later, it is still the same thing: a four-day gathering of Monte Vista and the surrounding counties, with a professional rodeo at the center.
        </p>
        <p>
          Sanctioned by the Professional Rodeo Cowboys Association. Nominated four times for Small Rodeo of the Year. Non-profit. Run by {organization.volunteerCount}+ volunteers who build the chutes in June and tear them down in July.
        </p>
        <p>
          The grounds have not moved. Still at {organization.venue.streetAddress}, {organization.venue.city}, Colorado. Still the same arena. Still the Rockies on the horizon west.
        </p>
      </div>
      <aside class="md:col-span-5">
        <ArchiveImage
          src={images.programBronc}
          alt="Historical bronc riding photograph from the Ski-Hi Stampede program."
          caption="Program bronc, Ski-Hi Stampede archive"
        />
      </aside>
    </section>

    <section>
      <SectionHeader number="02" label="By the decades" />
      <ol class="mt-10 space-y-6">
        {milestones.map((m) => (
          <li class="grid grid-cols-[auto_1fr] gap-6 border-t-2 border-dust pt-5">
            <p class="font-display font-black text-3xl md:text-5xl text-oxblood tabular w-24 md:w-32">
              {m.year}
            </p>
            <p class="font-sans text-base md:text-lg text-charcoal pt-2 md:pt-3">
              {m.event}
            </p>
          </li>
        ))}
      </ol>
    </section>

    <section class="grid gap-10 md:grid-cols-3">
      <div class="md:col-span-1">
        <SectionHeader number="03" label="By the numbers" />
      </div>
      <div class="md:col-span-2 grid gap-6 sm:grid-cols-2">
        <div class="border-t-2 border-oxblood pt-4">
          <p class="font-display font-black text-5xl md:text-7xl text-charcoal tabular leading-none">{2027 - organization.foundingYear}</p>
          <p class="mt-2 font-sans text-sm uppercase tracking-widest text-oxblood">Years running</p>
        </div>
        <div class="border-t-2 border-oxblood pt-4">
          <p class="font-display font-black text-5xl md:text-7xl text-charcoal tabular leading-none">{organization.prcaNominations}</p>
          <p class="mt-2 font-sans text-sm uppercase tracking-widest text-oxblood">PRCA Small Rodeo of the Year nominations</p>
        </div>
        <div class="border-t-2 border-oxblood pt-4">
          <p class="font-display font-black text-5xl md:text-7xl text-charcoal tabular leading-none">{organization.volunteerCount}+</p>
          <p class="mt-2 font-sans text-sm uppercase tracking-widest text-oxblood">Volunteers</p>
        </div>
        <div class="border-t-2 border-oxblood pt-4">
          <p class="font-display font-black text-5xl md:text-7xl text-charcoal tabular leading-none">{organization.annualAttendance.toLocaleString()}+</p>
          <p class="mt-2 font-sans text-sm uppercase tracking-widest text-oxblood">Fans per year</p>
        </div>
      </div>
    </section>

    <section>
      <div class="flex flex-wrap gap-4">
        <Button href="/committee">Meet the committee</Button>
        <Button href="/sponsors" variant="ghost">Our sponsors</Button>
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(about): /about page with history timeline and PRCA stats"
git push origin main
```

---

## Task 7: `/visit` Page

**Files:**
- Create: `src/pages/visit.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `FAQList`, `Button`, schema builders.
- Produces: `/visit` route with venue details, directions, lodging options for Monte Vista and Alamosa, FAQ with FAQPage schema, TouristAttraction + LodgingBusiness JSON-LD.

- [ ] **Step 1: Create `src/pages/visit.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import FAQList from "@components/FAQList.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Plan your visit to the Ski-Hi Stampede. Venue address, directions, parking, gate hours, lodging in Monte Vista and Alamosa, and FAQ.`;
const url = `${site.baseUrl}/visit`;

const lodging = [
  { name: "Best Western Movie Manor", type: "Hotel", distance: "0.6 miles east of grounds", note: "Historic drive-in movie motel. [CONFIRM] rates for Stampede week." },
  { name: "Comfort Inn Monte Vista", type: "Hotel", distance: "1.2 miles east of grounds", note: "[CONFIRM] rates" },
  { name: "Rio Grande County Fairgrounds Campground", type: "Campground", distance: "At the grounds", note: "First-come, first-served tent and RV during Stampede week" },
  { name: "San Luis Lakes State Park", type: "Campground", distance: "35 miles east, near Great Sand Dunes", note: "Reservable through CPW" },
  { name: "Hampton Inn Alamosa", type: "Hotel", distance: "17 miles east on US 160", note: "[CONFIRM] rates and shuttle" },
  { name: "Great Sand Dunes Lodge", type: "Hotel", distance: "40 miles east", note: "Dark skies, 40 min drive to Stampede" },
];

const touristAttraction = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": organization.venue.name,
  "description": `Home of the ${organization.name}, Colorado's Oldest Pro Rodeo. Open year-round for events and July for the Ski-Hi Stampede.`,
  "url": url,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": organization.venue.streetAddress,
    "addressLocality": organization.venue.city,
    "addressRegion": organization.venue.region,
    "postalCode": organization.venue.postalCode,
    "addressCountry": organization.venue.country,
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": organization.venue.latitude,
    "longitude": organization.venue.longitude,
  },
};

const lodgingSchema = lodging.map((l) => ({
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": l.name,
  "description": `${l.distance}. ${l.note}`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": organization.venue.city,
    "addressRegion": organization.venue.region,
    "addressCountry": "US",
  },
}));

const faqItems = [
  {
    question: "Where is the Ski-Hi Stampede held?",
    answer: `The Ski-Hi Stampede Complex at ${organization.venue.streetAddress}, ${organization.venue.city}, Colorado ${organization.venue.postalCode}. One block south of US Highway 160.`,
  },
  {
    question: "How do I get to Monte Vista?",
    answer: "Monte Vista is on US 160 in the San Luis Valley, about four hours southwest of Denver, two and a half hours north of Albuquerque, and one hour west of the Great Sand Dunes.",
  },
  {
    question: "Is there parking at the Ski-Hi Complex?",
    answer: "Yes. Parking is free for all ticket holders. Enter via Sherman Avenue. Overflow parking is west of the grounds.",
  },
  {
    question: "When do gates open?",
    answer: "Gates open two hours before the first scheduled event on each night. For 7 PM PRCA performances, gates open at 5 PM.",
  },
  {
    question: "Where should I stay?",
    answer: "Lodging in Monte Vista fills up during Stampede week. Book early. Alamosa, 17 miles east on US 160, has additional hotels. The Great Sand Dunes Lodge is 40 minutes east.",
  },
  {
    question: "Is the venue accessible?",
    answer: "The grandstands and Reserved Box seating are accessible with assistance. Call the ticket office at (719) 852-2055 to confirm accessible seating ahead of your visit. [CONFIRM] detailed accessibility map.",
  },
  {
    question: "What is the altitude?",
    answer: "Monte Vista sits at 7,664 feet. Expect cool evenings even in July. Hydrate and bring a layer.",
  },
];

const jsonLd = [
  buildWebPageSchema({ name: "Plan Your Visit", description, url }),
  touristAttraction,
  ...lodgingSchema,
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Visit", url },
  ]),
];
---
<BaseLayout title="Plan Your Visit" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Monte Vista, Colorado"
    title="Plan your visit."
    subtitle="Everything you need to drive in, park, find a room, and get to the grounds on time."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-2">
      <div>
        <SectionHeader number="01" label="The grounds" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Seven thousand feet, one hundred eight years.
        </h2>
        <div class="mt-6 space-y-4 font-sans text-base text-charcoal/90 max-w-prose">
          <p>
            The Ski-Hi Complex sits at the edge of Monte Vista, one block south of US Highway 160. The arena has not moved since 1919.
          </p>
          <p>
            Free parking at the grounds. Carnival midway on the east side. Food and drink at the concessions, cash and card. Gates open two hours before the first event.
          </p>
        </div>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-6">
        <div>
          <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Address</p>
          <address class="mt-2 not-italic font-sans text-base text-charcoal">
            {organization.venue.name}<br />
            {organization.venue.streetAddress}<br />
            {organization.venue.city}, {organization.venue.region} {organization.venue.postalCode}
          </address>
        </div>
        <div>
          <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Distances</p>
          <ul class="mt-2 space-y-1 font-sans text-base text-charcoal">
            <li>Denver: 4 hours north</li>
            <li>Albuquerque: 2.5 hours south</li>
            <li>Alamosa: 17 miles east</li>
            <li>Great Sand Dunes: 40 min east</li>
          </ul>
        </div>
        <div>
          <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Elevation</p>
          <p class="mt-2 font-sans text-base text-charcoal tabular">7,664 feet</p>
        </div>
      </aside>
    </section>

    <section id="lodging">
      <SectionHeader number="02" label="Where to stay" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
        Lodging in Monte Vista and nearby.
      </h2>
      <p class="mt-6 font-sans text-base text-charcoal/80 max-w-prose">
        Book early. Stampede week fills every room in town. Alamosa 17 miles east is the next-closest option.
      </p>
      <ul class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lodging.map((l) => (
          <li class="border-t-2 border-dust pt-5">
            <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">{l.type}</p>
            <p class="mt-2 font-display text-xl font-black text-charcoal leading-tight">{l.name}</p>
            <p class="mt-2 font-sans text-sm text-charcoal/70">{l.distance}</p>
            <p class="mt-2 font-sans text-sm text-charcoal/70">{l.note}</p>
          </li>
        ))}
      </ul>
    </section>

    <section>
      <SectionHeader number="03" label="FAQ" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
        The seven questions people ask every year.
      </h2>
      <FAQList items={faqItems} class="mt-12" />
    </section>

    <section>
      <div class="flex flex-wrap gap-4">
        <Button href="/tickets">Buy tickets</Button>
        <Button href="/events" variant="ghost">Full schedule</Button>
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(visit): /visit page with lodging, FAQ, TouristAttraction schema"
git push origin main
```

---

## Task 8: `/parade` Page

**Files:**
- Create: `src/pages/parade.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `FAQList`, `Button`, schema builders.
- Produces: `/parade` route with route details, entry info (3 methods from audit), FAQ, Event + FAQPage JSON-LD.

- [ ] **Step 1: Create `src/pages/parade.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import FAQList from "@components/FAQList.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `The Ski-Hi Stampede Downtown Parade. Friday and Saturday, July 10 and 11, 2027. Downtown Monte Vista. Entry information below.`;
const url = `${site.baseUrl}/parade`;

const entryMethods = [
  { label: "Online form", detail: "Google Forms, open now", href: "https://docs.google.com/forms/d/e/1FAIpQLSdsFWrEmRpWZZ4gPIeLUPxGhsBquHHZlKvFHADOU5-4oiClKQ/viewform", external: true },
  { label: "Downloadable PDF", detail: "Print, fill out, drop off", href: "https://www.skihistampede.com/_files/ugd/262ad9_f27345c57cec4a86b8e0db2e6c786660.pdf", external: true },
  { label: "In person", detail: "Drop at Finer Blessings, Monte Vista", href: null, external: false },
  { label: "Email", detail: "Send to cyvanderpool@gmail.com", href: "mailto:cyvanderpool@gmail.com", external: false },
];

const faqItems = [
  {
    question: "When is the Ski-Hi Stampede parade?",
    answer: "Friday and Saturday mornings, July 10 and July 11, 2027. Both parades start at 10:00 AM.",
  },
  {
    question: "What is the parade route?",
    answer: "The parade starts on Chico Avenue, runs east on First Avenue through downtown Monte Vista, and ends at the Ski-Hi Complex. [CONFIRM] route map.",
  },
  {
    question: "How do I enter a float?",
    answer: "Submit an entry form online, download and print the PDF, drop off at Finer Blessings in Monte Vista, or email cyvanderpool@gmail.com. See entry methods above.",
  },
  {
    question: "Are there entry fees?",
    answer: "[CONFIRM] entry fee structure. Community organizations, youth groups, and valley businesses welcome.",
  },
  {
    question: "Who is the 2027 Grand Marshal?",
    answer: "[CONFIRM] 2027 Grand Marshal announcement.",
  },
  {
    question: "Where should spectators stand?",
    answer: "Anywhere along First Avenue in downtown Monte Vista. Arrive 20 minutes early for a good spot. Chairs welcome.",
  },
];

const parade = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": `${organization.name} Downtown Parade`,
  "description": "Annual community parade through downtown Monte Vista on the Friday and Saturday of Ski-Hi Stampede week.",
  "startDate": "2027-07-10T10:00:00-06:00",
  "endDate": "2027-07-11T12:00:00-06:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Downtown Monte Vista",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Monte Vista",
      "addressRegion": "CO",
      "addressCountry": "US",
    },
  },
};

const jsonLd = [
  buildWebPageSchema({ name: "Parade", description, url }),
  parade,
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Parade", url },
  ]),
];
---
<BaseLayout title="Parade" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Downtown Monte Vista"
    title="The Stampede parade."
    subtitle="Friday and Saturday morning, July 10 and 11, 2027. Floats, horses, high school bands, and the whole valley on First Avenue."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-2 items-start">
      <div>
        <SectionHeader number="01" label="The parade" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Two mornings on First Avenue.
        </h2>
        <div class="mt-6 space-y-4 font-sans text-base text-charcoal/90 max-w-prose">
          <p>
            The Ski-Hi Stampede parade runs twice during the week, Friday morning and Saturday morning, both at 10:00 AM. Same route both days.
          </p>
          <p>
            Starts on Chico Avenue, east on First Avenue through downtown, ends at the Stampede grounds. [CONFIRM] exact route map.
          </p>
        </div>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-4">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">When</p>
        <p class="font-sans text-lg text-charcoal">
          <time datetime="2027-07-10T10:00">Friday, July 10, 10:00 AM</time>
        </p>
        <p class="font-sans text-lg text-charcoal">
          <time datetime="2027-07-11T10:00">Saturday, July 11, 10:00 AM</time>
        </p>
        <p class="pt-4 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Where</p>
        <p class="font-sans text-base text-charcoal">Downtown Monte Vista, First Avenue</p>
      </aside>
    </section>

    <section>
      <SectionHeader number="02" label="Enter a float" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
        Four ways to enter.
      </h2>
      <ul class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {entryMethods.map((e, i) => (
          <li class="border-t-2 border-oxblood pt-5">
            <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood tabular">{String(i + 1).padStart(2, "0")}</p>
            <p class="mt-2 font-display text-xl font-black text-charcoal">{e.label}</p>
            <p class="mt-2 font-sans text-sm text-charcoal/70">{e.detail}</p>
            {e.href && (
              <a href={e.href} rel={e.external ? "noopener noreferrer" : undefined} target={e.external ? "_blank" : undefined} class="mt-3 inline-block font-sans text-xs font-medium uppercase tracking-widest text-oxblood hover:underline">
                Open ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>

    <section>
      <SectionHeader number="03" label="FAQ" />
      <FAQList items={faqItems} class="mt-10" />
    </section>

    <section>
      <div class="flex flex-wrap gap-4">
        <Button href="/events">Full schedule</Button>
        <Button href="/visit" variant="ghost">Plan your visit</Button>
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(parade): /parade page with entry methods and FAQ"
git push origin main
```

---

## Task 9: `/mutton-busting` Page

**Files:**
- Create: `src/pages/mutton-busting.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `FAQList`, `Button`, schema builders.
- Produces: `/mutton-busting` route with eligibility box, registration process, rules, FAQ.

- [ ] **Step 1: Create `src/pages/mutton-busting.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import FAQList from "@components/FAQList.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Mutton Busting at the Ski-Hi Stampede. For kids ages 5 to 7, under 50 pounds, San Luis Valley residents. Registration Monday July 5, 2027.`;
const url = `${site.baseUrl}/mutton-busting`;

const faqItems = [
  {
    question: "Who can enter the Ski-Hi Stampede mutton busting?",
    answer: "Children ages 5 to 7, under 50 pounds, who are San Luis Valley residents. Proof of age and insurance required.",
  },
  {
    question: "When is registration?",
    answer: "Monday, July 5, 2027, from 8:00 AM to 12:00 PM at the Stampede Board Room, 2330 Sherman Avenue, Monte Vista. [CONFIRM] exact 2027 date.",
  },
  {
    question: "Is there a cost to enter?",
    answer: "[CONFIRM] 2027 entry fee. The child must weigh in on-site at registration.",
  },
  {
    question: "How many kids can enter each day?",
    answer: "The limit is 10 mutton busters per day, across the four performances Thursday through Sunday. First come, first served.",
  },
  {
    question: "What should my child wear?",
    answer: "Long pants, closed-toe boots or sturdy shoes, long sleeves. The Stampede provides helmets and protective vests. [CONFIRM] vest sizes available.",
  },
  {
    question: "What are the rules of the ride?",
    answer: "Each child rides a sheep released from a chute. Longest ride wins. The ride ends when the child dismounts or six seconds elapses, whichever comes first. [CONFIRM] exact scoring and re-ride rules.",
  },
  {
    question: "Are prizes awarded?",
    answer: "[CONFIRM] prize structure. Historically, each night's winner gets a trophy buckle, and the overall champion wins a saddle.",
  },
];

const jsonLd = [
  buildWebPageSchema({ name: "Mutton Busting", description, url }),
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Ski-Hi Stampede Mutton Busting",
    "description": "Nightly mutton busting competition for San Luis Valley kids ages 5 to 7, under 50 pounds. Four nights, 10 kids per night.",
    "startDate": organization.nextEvent.startDate,
    "endDate": organization.nextEvent.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "audience": {
      "@type": "PeopleAudience",
      "suggestedMinAge": 5,
      "suggestedMaxAge": 7,
    },
    "location": {
      "@type": "Place",
      "name": organization.venue.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": organization.venue.streetAddress,
        "addressLocality": organization.venue.city,
        "addressRegion": organization.venue.region,
        "addressCountry": organization.venue.country,
      },
    },
  },
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Mutton Busting", url },
  ]),
];
---
<BaseLayout title="Mutton Busting" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Ages 5 to 7, under 50 lbs"
    title="Mutton busting."
    subtitle="Four nights, ten kids a night. The oldest tradition at the youngest end of the arena."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-2 items-start">
      <div>
        <SectionHeader number="01" label="Who can enter" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Three requirements.
        </h2>
        <ul class="mt-6 space-y-3 font-sans text-lg text-charcoal/90">
          <li>Between ages 5 and 7</li>
          <li>Under 50 pounds at weigh-in</li>
          <li>San Luis Valley resident</li>
        </ul>
        <p class="mt-6 font-sans text-sm text-charcoal/70 max-w-prose">
          Proof of age and insurance required at registration. The child must be present and weighed in person.
        </p>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-4">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Registration</p>
        <p class="font-sans text-base text-charcoal">
          Monday, July 5, 2027 [CONFIRM]<br />
          8:00 AM to 12:00 PM
        </p>
        <address class="not-italic font-sans text-base text-charcoal">
          Stampede Board Room<br />
          2330 Sherman Avenue<br />
          Monte Vista, CO 81144
        </address>
        <p class="pt-2 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Limit</p>
        <p class="font-sans text-lg text-charcoal tabular">10 kids per day. Four days total.</p>
      </aside>
    </section>

    <section>
      <SectionHeader number="02" label="FAQ" />
      <FAQList items={faqItems} class="mt-10" />
    </section>

    <section>
      <div class="flex flex-wrap gap-4">
        <Button href="/events">Nightly schedule</Button>
        <Button href={`tel:${organization.contact.phone.replace(/[^0-9+]/g, "")}`} variant="ghost">
          Call {organization.contact.phoneDisplay}
        </Button>
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(mutton-busting): /mutton-busting page with eligibility and rules FAQ"
git push origin main
```

---

## Task 10: `/scholarship` Page

**Files:**
- Create: `src/pages/scholarship.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `Button`, schema builders.
- Produces: `/scholarship` route with details, eligibility, apply CTA, past recipients grid (placeholder), EducationalOccupationalProgram JSON-LD.

- [ ] **Step 1: Create `src/pages/scholarship.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `The $3,500 Ski-Hi Stampede scholarship for San Luis Valley students attending Adams State University. Applications due [CONFIRM 2027 deadline].`;
const url = `${site.baseUrl}/scholarship`;

const criteria = [
  { label: "Residency", detail: "San Luis Valley resident" },
  { label: "Enrollment", detail: "Attending or planning to attend Adams State University" },
  { label: "Status", detail: "Graduating high school senior or current college student" },
  { label: "Values", detail: "Demonstrated academic achievement, community involvement, and SLV western heritage" },
];

const pastRecipients = [
  { name: "[CONFIRM]", year: "2026" },
  { name: "[CONFIRM]", year: "2025" },
  { name: "[CONFIRM]", year: "2024" },
  { name: "[CONFIRM]", year: "2023" },
];

const programSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  "name": "Ski-Hi Stampede Scholarship at Adams State University",
  "description": "$3,500 scholarship ($1,750 Fall and $1,750 Spring) for San Luis Valley residents attending Adams State University, awarded annually by the Ski-Hi Stampede.",
  "provider": {
    "@type": "Organization",
    "name": organization.legalName,
    "url": site.baseUrl,
  },
  "educationalLevel": "Undergraduate",
  "occupationalCategory": "Any",
};

const jsonLd = [
  buildWebPageSchema({ name: "ASU Scholarship", description, url }),
  programSchema,
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Scholarship", url },
  ]),
];
---
<BaseLayout title="ASU Scholarship" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Adams State University"
    title="$3,500 scholarship."
    subtitle="For San Luis Valley students attending Adams State. One award, split evenly across Fall and Spring semesters."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-2 items-start">
      <div>
        <SectionHeader number="01" label="The scholarship" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Three thousand five hundred dollars toward a degree in the valley.
        </h2>
        <p class="mt-6 font-sans text-base text-charcoal/90 max-w-prose">
          The Ski-Hi Stampede awards one scholarship each year to a San Luis Valley resident attending Adams State University in Alamosa. $1,750 is paid toward the Fall semester, $1,750 toward Spring.
        </p>
        <p class="mt-6 font-sans text-base text-charcoal/90 max-w-prose">
          Applications are open to graduating high school seniors and current ASU students. Download the application below and return it by [CONFIRM: 2027 deadline].
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <Button href="/[CONFIRM]-2027-asu-scholarship.docx">Download application</Button>
          <Button href={`mailto:${organization.contact.email}?subject=ASU Scholarship Question`} variant="ghost">
            Email the committee
          </Button>
        </div>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-4">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Eligibility</p>
        <ul class="space-y-3">
          {criteria.map((c) => (
            <li>
              <p class="font-sans text-xs uppercase tracking-widest text-charcoal/60">{c.label}</p>
              <p class="font-sans text-base text-charcoal">{c.detail}</p>
            </li>
          ))}
        </ul>
      </aside>
    </section>

    <section>
      <SectionHeader number="02" label="Past recipients" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
        Students who have carried the Stampede into their degree.
      </h2>
      <ul class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pastRecipients.map((r) => (
          <li class="border-t-2 border-dust pt-5">
            <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood tabular">{r.year}</p>
            <p class="mt-2 font-display text-xl font-black text-charcoal">{r.name}</p>
          </li>
        ))}
      </ul>
      <p class="mt-6 font-sans text-sm text-charcoal/60 italic">
        Full recipient list pending Ski-Hi committee confirmation.
      </p>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(scholarship): /scholarship page with eligibility and application CTA"
git push origin main
```

---

## Task 11: `/committee` Page

**Files:**
- Modify: `src/images/manifest.ts` (add 14 committee headshots)
- Create: `src/pages/committee.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `CommitteeCard`, `images`.
- Produces: `/committee` route with 4-officer top row + 10-director grid. Each entry uses `CommitteeCard` with headshot from manifest.

- [ ] **Step 1: Extend `src/images/manifest.ts` with committee headshots**

Append the 14 import statements, keyed by first name:

```ts
// Committee headshots. Filenames preserve Wix content hash from content audit.
import greg from "./raw/262ad9_7d003b92b1f74413bfd994bd84865f8c~mv2.jpg";
import brandon from "./raw/262ad9_b414dffe2e6a40c9b192800bcaddaa24~mv2.jpg";
import nick from "./raw/262ad9_c47d7e2fe02c4da4acd358aadfc9c064~mv2.jpg";
import eric from "./raw/262ad9_a47753cfa86e4e1f86e733e3bc6431c2~mv2.jpg";
import charlie from "./raw/262ad9_449255ce6c084e6e86a76b9f21174d9a~mv2.jpg";
import ce from "./raw/262ad9_d5f78e7cbd6c4fc49af7aeb3364fb5d3~mv2.jpg";
import keith from "./raw/262ad9_dfd3bf9804c24fab8bd7b9a6c5855f14~mv2.jpg";
import mark from "./raw/262ad9_f4d95e9688034e9d8b545a02ca6a9185~mv2.jpg";
import karla from "./raw/262ad9_be660e020f65456f90ca0e6a64ffe7d7~mv2.jpg";
import derek from "./raw/262ad9_a6d399c7252740329d2db3c782a06deb~mv2.jpg";
import rocky from "./raw/262ad9_8be6647119134ef2928560800ef307d0~mv2.jpg";
import kelsey from "./raw/262ad9_1242ed33a7a04d34988d16cc63fb36ff~mv2.jpg";
import helen from "./raw/262ad9_1fca2adcf27d40e48e0f2b3726f2f990~mv2.jpg";
import ryan from "./raw/262ad9_ef3db0b08b4440e4b11e452b513088f4~mv2.jpg";
```

And add them to the exported object:

```ts
export const images = {
  heroHomepage,
  programBronc,
  stampedeLogo,
  siteLogoWhite,
  usa250Strip,
  committee: {
    greg, brandon, nick, eric, charlie, ce, keith, mark,
    karla, derek, rocky, kelsey, helen, ryan,
  },
} as const;
```

- [ ] **Step 2: Create `src/pages/committee.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import CommitteeCard from "@components/CommitteeCard.astro";
import { images } from "@/images/manifest";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema, buildOrganizationSchema } from "@/lib/schema";

const description = `The Ski-Hi Stampede Committee: 18 volunteers from Monte Vista and the San Luis Valley who run Colorado's oldest pro rodeo.`;
const url = `${site.baseUrl}/committee`;

const officers = [
  { name: "Greg Metz", role: "President", photo: images.committee.greg },
  { name: "Brandon Rogers", role: "Vice President", photo: images.committee.brandon },
  { name: "Nick Malone", role: "Treasurer", photo: images.committee.nick },
  { name: "Eric Kimberling", role: "Secretary", photo: images.committee.eric },
];

const directors = [
  { name: "Charlie Burd", role: "Director", photo: images.committee.charlie },
  { name: "CE Glunz", role: "Director", photo: images.committee.ce },
  { name: "Keith Rogers", role: "Director", photo: images.committee.keith },
  { name: "Mark Deacon", role: "Director", photo: images.committee.mark },
  { name: "Karla Willschau", role: "Director", photo: images.committee.karla },
  { name: "Derek Cooper", role: "Director", photo: images.committee.derek },
  { name: "Rocky Southway", role: "Director", photo: images.committee.rocky },
  { name: "Kelsey Kimberling", role: "Director", photo: images.committee.kelsey },
  { name: "Helen Smith", role: "Director", photo: images.committee.helen },
  { name: "Ryan Rumley", role: "Director", photo: images.committee.ryan },
];

const jsonLd = [
  buildWebPageSchema({ name: "Committee", description, url }),
  buildOrganizationSchema(),
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Committee", url },
  ]),
];
---
<BaseLayout title="Committee" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="18 volunteers, one event"
    title="The Stampede Committee."
    subtitle="Monte Vista and valley volunteers who show up year-round. Officers lead; directors keep the arena running."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-20">

    <section>
      <SectionHeader number="01" label="Officers" />
      <ul class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {officers.map((m) => (
          <li>
            <CommitteeCard name={m.name} role={m.role} photo={m.photo} />
          </li>
        ))}
      </ul>
    </section>

    <section>
      <SectionHeader number="02" label="Directors" />
      <ul class="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {directors.map((m) => (
          <li>
            <CommitteeCard name={m.name} role={m.role} photo={m.photo} />
          </li>
        ))}
      </ul>
      <p class="mt-10 font-sans text-sm text-charcoal/60 italic">
        The committee describes itself as 18 volunteers. The 4 additional members not pictured are [CONFIRM] by the committee.
      </p>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 3: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(committee): /committee page with 14 headshots and officer/director split"
git push origin main
```

---

## Task 12: `/contestants` Page

**Files:**
- Create: `src/pages/contestants.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `FAQList`, `Button`, schema builders.
- Produces: `/contestants` route explaining PRCA sanction, local rodeo signup, entry rules.

- [ ] **Step 1: Create `src/pages/contestants.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import FAQList from "@components/FAQList.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Contestant information for the 2027 Ski-Hi Stampede. PRCA sanction, Local Rodeo for San Luis Valley residents, entry details.`;
const url = `${site.baseUrl}/contestants`;

const prcaEvents = [
  "Bareback Riding",
  "Barrel Racing",
  "Breakaway Roping",
  "Bull Riding",
  "Calf Roping",
  "Steer Wrestling",
  "Team Roping",
  "Tie Down Roping",
];

const faqItems = [
  {
    question: "What is PRCA slack?",
    answer: "PRCA slack is the preliminary performance held before the ticketed night performances. Contestants who did not draw a time in the main performance compete during slack. For the 2027 Ski-Hi Stampede, slack runs the morning of Saturday, July 10, open to the public.",
  },
  {
    question: "What is the Local Rodeo?",
    answer: "A separate, non-PRCA rodeo for San Luis Valley residents, held Saturday, July 10 at 11:00 AM following PRCA slack. Open to amateur contestants from the valley. [CONFIRM] entry rules and payout.",
  },
  {
    question: "How do PRCA pros enter the Ski-Hi Stampede?",
    answer: "Enter through the PRCA central entry system at prorodeo.com. Entries open and close per the standard PRCA schedule. The Ski-Hi Stampede is listed in the Mountain States Circuit.",
  },
  {
    question: "Are there entry fees?",
    answer: "Standard PRCA entry fees apply for the sanctioned events. [CONFIRM] 2027 Local Rodeo entry fees.",
  },
  {
    question: "What is the payout structure?",
    answer: "[CONFIRM] 2027 added money per event. Payouts follow PRCA standard formulas for sanctioned events.",
  },
  {
    question: "Who is the stock contractor?",
    answer: "[CONFIRM] 2027 stock contractor.",
  },
];

const jsonLd = [
  buildWebPageSchema({ name: "Contestant Information", description, url }),
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Contestants", url },
  ]),
];
---
<BaseLayout title="Contestant Information" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="PRCA sanctioned, locally run"
    title="Contestant information."
    subtitle="PRCA pros, San Luis Valley amateurs, and everything in between. Entry details, slack schedule, and local rodeo."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-2 items-start">
      <div>
        <SectionHeader number="01" label="PRCA sanctioned events" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Eight events, four nights.
        </h2>
        <p class="mt-6 font-sans text-base text-charcoal/90 max-w-prose">
          The Ski-Hi Stampede is a Professional Rodeo Cowboys Association sanctioned event in the Mountain States Circuit. Standings count toward the Circuit Finals and the National Finals Rodeo.
        </p>
      </div>
      <ul class="grid grid-cols-2 gap-3">
        {prcaEvents.map((e) => (
          <li class="border-l-2 border-oxblood pl-3 font-sans text-base text-charcoal">{e}</li>
        ))}
      </ul>
    </section>

    <section class="grid gap-12 md:grid-cols-2 items-start border-t-2 border-dust pt-16">
      <div>
        <SectionHeader number="02" label="Local Rodeo" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Saturday, 11 AM. Valley only.
        </h2>
        <p class="mt-6 font-sans text-base text-charcoal/90 max-w-prose">
          The Local Rodeo is a non-PRCA event open to amateur contestants from the San Luis Valley. Held Saturday, July 10, 2027 at 11:00 AM, following PRCA slack. Same arena, same stock contractors, same crowd.
        </p>
        <div class="mt-8">
          <Button href={`mailto:${organization.contact.email}?subject=Local Rodeo Entry`} variant="ghost">
            Email for Local Rodeo entry
          </Button>
        </div>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-3">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">When</p>
        <p class="font-sans text-base text-charcoal">
          <time datetime="2027-07-10T11:00">Saturday, July 10, 11:00 AM</time>
        </p>
        <p class="pt-2 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Where</p>
        <p class="font-sans text-base text-charcoal">
          {organization.venue.name}<br />
          {organization.venue.streetAddress}, {organization.venue.city}
        </p>
        <p class="pt-2 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Who</p>
        <p class="font-sans text-base text-charcoal">
          San Luis Valley residents, amateur contestants
        </p>
      </aside>
    </section>

    <section>
      <SectionHeader number="03" label="FAQ" />
      <FAQList items={faqItems} class="mt-10" />
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(contestants): /contestants page with PRCA + local rodeo info"
git push origin main
```

---

## Task 13: `/carnival` Page

**Files:**
- Create: `src/pages/carnival.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `Button`, schema builders.
- Produces: `/carnival` route with operator info, hours, ride-list placeholder, pricing placeholder.

- [ ] **Step 1: Create `src/pages/carnival.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Wrights Amusements Carnival at the 2027 Ski-Hi Stampede. All four nights, July 8 to 11. Rides, games, food, and midway lights.`;
const url = `${site.baseUrl}/carnival`;

const hours = [
  { day: "Thursday, July 8", open: "5:00 PM", close: "11:00 PM" },
  { day: "Friday, July 9", open: "4:00 PM", close: "12:00 AM" },
  { day: "Saturday, July 10", open: "12:00 PM", close: "12:00 AM" },
  { day: "Sunday, July 11", open: "12:00 PM", close: "9:00 PM" },
];

const jsonLd = [
  buildWebPageSchema({ name: "Carnival", description, url }),
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Wrights Amusements Carnival at Ski-Hi Stampede",
    "description": "Four-day carnival midway on the Ski-Hi Stampede grounds, operated by Wrights Amusements.",
    "startDate": organization.nextEvent.startDate,
    "endDate": organization.nextEvent.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": organization.venue.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": organization.venue.streetAddress,
        "addressLocality": organization.venue.city,
        "addressRegion": organization.venue.region,
        "addressCountry": organization.venue.country,
      },
    },
  },
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Carnival", url },
  ]),
];
---
<BaseLayout title="Carnival" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Wrights Amusements"
    title="The midway."
    subtitle="Four days of rides, games, and funnel cakes on the east side of the Stampede grounds."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-2 items-start">
      <div>
        <SectionHeader number="01" label="Operator" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Wrights Amusements.
        </h2>
        <p class="mt-6 font-sans text-base text-charcoal/90 max-w-prose">
          Wrights Amusements operates the Ski-Hi Stampede carnival midway every year. Family-run carnival outfit, trusted stock of rides and games, same crew most summers.
        </p>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-3">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Pricing</p>
        <p class="font-sans text-base text-charcoal">
          [CONFIRM] 2027 wristband pricing and per-ride ticket pricing.
        </p>
        <p class="pt-2 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Location</p>
        <p class="font-sans text-base text-charcoal">
          East side of the Stampede grounds. Enter via Sherman Avenue.
        </p>
      </aside>
    </section>

    <section>
      <SectionHeader number="02" label="Hours" />
      <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
        Open all four days.
      </h2>
      <table class="mt-10 w-full border-t-2 border-oxblood">
        <thead>
          <tr>
            <th class="py-4 text-left font-sans text-xs uppercase tracking-widest text-oxblood">Day</th>
            <th class="py-4 text-left font-sans text-xs uppercase tracking-widest text-oxblood">Open</th>
            <th class="py-4 text-left font-sans text-xs uppercase tracking-widest text-oxblood">Close</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-dust/40">
          {hours.map((h) => (
            <tr>
              <td class="py-4 font-sans text-base text-charcoal">{h.day}</td>
              <td class="py-4 font-sans text-base text-charcoal tabular">{h.open}</td>
              <td class="py-4 font-sans text-base text-charcoal tabular">{h.close}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p class="mt-4 font-sans text-xs uppercase tracking-widest text-oxblood">[CONFIRM] 2027 carnival hours</p>
    </section>

    <section>
      <div class="flex flex-wrap gap-4">
        <Button href="/events">Full schedule</Button>
        <Button href="/visit" variant="ghost">Plan your visit</Button>
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(carnival): /carnival page with hours and Wrights Amusements operator info"
git push origin main
```

---

## Task 14: `/vendors` Page

**Files:**
- Create: `src/pages/vendors.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `Button`, schema builders.
- Produces: `/vendors` route with requirements, application window, download link.

- [ ] **Step 1: Create `src/pages/vendors.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Vendor applications for the 2027 Ski-Hi Stampede. Food vendors, craft vendors, and merchandisers. Application window [CONFIRM 2027 dates].`;
const url = `${site.baseUrl}/vendors`;

const requirements = [
  "Completed application submitted to the committee",
  "Committee approval of product mix and placement",
  "Current Colorado business license and sales tax account",
  "Vendor-provided tent, tables, generator",
  "Compliance with Rio Grande County health code",
  "Setup Wednesday July 7, teardown Monday July 12",
];

const jsonLd = [
  buildWebPageSchema({ name: "Vendors", description, url }),
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Vendors", url },
  ]),
];
---
<BaseLayout title="Vendors" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Food, craft, merchandise"
    title="Vendor applications."
    subtitle="Set up on the Stampede grounds for four days of foot traffic. Applications open [CONFIRM 2027 window]."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-2 items-start">
      <div>
        <SectionHeader number="01" label="Requirements" />
        <h2 class="mt-6 font-display font-black text-4xl md:text-5xl text-charcoal leading-[0.95]">
          Six things we need.
        </h2>
        <ol class="mt-10 space-y-4 font-sans text-base text-charcoal/90">
          {requirements.map((r, i) => (
            <li class="grid grid-cols-[auto_1fr] gap-4 border-t-2 border-dust pt-4">
              <span class="font-display text-xl font-black text-oxblood tabular w-8">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span class="pt-1">{r}</span>
            </li>
          ))}
        </ol>
      </div>
      <aside class="border border-dust bg-bone p-8 space-y-4">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">2027 window</p>
        <p class="font-sans text-base text-charcoal">
          Applications open: [CONFIRM]<br />
          Applications close: [CONFIRM]
        </p>
        <p class="pt-2 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Fees</p>
        <p class="font-sans text-base text-charcoal">
          [CONFIRM] 2027 vendor fees by category (food, craft, merch, 10x10, 10x20).
        </p>
        <p class="pt-2 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Contact</p>
        <p class="font-sans text-base">
          <a href={`mailto:${organization.contact.email}?subject=Vendor Application`} class="text-oxblood hover:underline">
            {organization.contact.email}
          </a>
        </p>
      </aside>
    </section>

    <section>
      <div class="flex flex-wrap gap-4">
        <Button href={`mailto:${organization.contact.email}?subject=Vendor Application Request`}>
          Request an application
        </Button>
        <Button href="/[CONFIRM]-2027-vendor-application.pdf" variant="ghost">
          Download PDF (when live)
        </Button>
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(vendors): /vendors page with requirements and application window"
git push origin main
```

---

## Task 15: `/faq` Page

**Files:**
- Create: `src/pages/faq.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `FAQList`, schema builders.
- Produces: `/faq` route with 15-20 top-level FAQs covering gate, parking, kids, pets, bag policy, weather, accessibility, food, lodging, parade, mutton busting, scholarship, PRCA entry, sponsorship, vendors. FAQPage schema.

- [ ] **Step 1: Create `src/pages/faq.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import FAQList from "@components/FAQList.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Answers to the most common Ski-Hi Stampede questions. Dates, tickets, parking, gates, mutton busting, parade, scholarship, vendors, and sponsorship.`;
const url = `${site.baseUrl}/faq`;

const theEvent = [
  { question: "When is the 2027 Ski-Hi Stampede?", answer: "July 8 to 11, 2027. Thursday through Sunday. Monte Vista, Colorado." },
  { question: "Where is the Ski-Hi Stampede held?", answer: `${organization.venue.name}, ${organization.venue.streetAddress}, Monte Vista, Colorado ${organization.venue.postalCode}.` },
  { question: "How long has the Stampede been running?", answer: "Since 1919. 2027 is the 108th consecutive Ski-Hi Stampede." },
  { question: "Is this a PRCA event?", answer: "Yes. The Ski-Hi Stampede is sanctioned by the Professional Rodeo Cowboys Association in the Mountain States Circuit." },
];

const gates = [
  { question: "When do gates open?", answer: "Two hours before the first scheduled event on each day. For 7 PM PRCA performances, gates open at 5 PM." },
  { question: "Is parking free?", answer: "Yes. Parking at the Ski-Hi Complex is free for all ticket holders." },
  { question: "What is the bag policy?", answer: "[CONFIRM] 2027 bag policy. Expect a standard check at the gate." },
  { question: "Can I bring food and drinks?", answer: "Outside food and drinks are not permitted. Concessions on site accept cash and card." },
  { question: "Are pets allowed?", answer: "[CONFIRM] 2027 pet policy. Service animals are always welcome." },
  { question: "What if the weather turns?", answer: "The Stampede runs rain or shine. Performances are postponed only for severe weather. Check the Ski-Hi Stampede Facebook page for same-day updates." },
  { question: "Is the venue accessible?", answer: "Grandstand and Reserved Box seating offer accessible options. Call the ticket office at (719) 852-2055 to confirm ahead of your visit. [CONFIRM] detailed ADA map." },
];

const kids = [
  { question: "How do kids enter mutton busting?", answer: "Children ages 5 to 7, under 50 pounds, San Luis Valley residents. Register at the Stampede Board Room on Monday July 5, 2027 from 8 AM to 12 PM. Limited to 10 per night." },
  { question: "Are kids' tickets cheaper?", answer: "Yes. Reduced rates for children 6 to 12. Children under 6 are free in General Admission with a paying adult." },
];

const participation = [
  { question: "How do PRCA pros enter?", answer: "Through PRCA central entry at prorodeo.com, per the standard PRCA schedule." },
  { question: "How do I enter the parade?", answer: "Online form, PDF download, drop-off at Finer Blessings, or email cyvanderpool@gmail.com. See the parade page for links." },
  { question: "How do I apply for the ASU scholarship?", answer: "Download the application from the scholarship page and return it by [CONFIRM: 2027 deadline]. $3,500 for SLV residents attending Adams State University." },
  { question: "How do I become a sponsor?", answer: "Email info@skihistampede.com for the current sponsorship packet. Tiers from Chute to Platinum, including event-specific sponsorships." },
  { question: "How do I apply as a vendor?", answer: "Email info@skihistampede.com during the open application window. Food, craft, and merchandise vendor categories available." },
];
---
<BaseLayout title="FAQ" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify([
    buildWebPageSchema({ name: "FAQ", description, url }),
    buildBreadcrumbSchema([
      { name: "Home", url: site.baseUrl },
      { name: "FAQ", url },
    ]),
  ])}></script>

  <PageHero
    eyebrow="Answers"
    title="Frequently asked questions."
    subtitle="Dates. Tickets. Gates. Mutton busting. Parade. Everything else you want to know before you show up."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-20">

    <section>
      <SectionHeader number="01" label="The event" />
      <FAQList items={theEvent} class="mt-10" />
    </section>

    <section>
      <SectionHeader number="02" label="Gates, parking, policies" />
      <FAQList items={gates} class="mt-10" />
    </section>

    <section>
      <SectionHeader number="03" label="Kids" />
      <FAQList items={kids} class="mt-10" />
    </section>

    <section>
      <SectionHeader number="04" label="Participation" />
      <FAQList items={participation} class="mt-10" />
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(faq): /faq page with four categories and FAQPage schema"
git push origin main
```

---

## Task 16: `/contact` and `/404`

**Files:**
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHero`, `SectionHeader`, `Button`.
- Produces: `/contact` with NAP + mailto only (no form) and "who to contact for what". `/404` as a styled western error.

- [ ] **Step 1: Create `src/pages/contact.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import PageHero from "@components/PageHero.astro";
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

const description = `Contact the Ski-Hi Stampede. Phone, email, mailing address, ticket office hours.`;
const url = `${site.baseUrl}/contact`;

const roles = [
  { label: "Tickets", detail: "Call the ticket office", action: `tel:${organization.contact.phone.replace(/[^0-9+]/g, "")}`, actionLabel: organization.contact.phoneDisplay },
  { label: "General inquiries", detail: "Email the committee", action: `mailto:${organization.contact.email}`, actionLabel: organization.contact.email },
  { label: "Sponsorship", detail: "Email with subject \"Sponsorship\"", action: `mailto:${organization.contact.email}?subject=2027 Ski-Hi Stampede Sponsorship`, actionLabel: "Email the committee" },
  { label: "Parade entry", detail: "Email the parade coordinator", action: "mailto:cyvanderpool@gmail.com", actionLabel: "cyvanderpool@gmail.com" },
  { label: "Vendor applications", detail: "Email with subject \"Vendor\"", action: `mailto:${organization.contact.email}?subject=Vendor Application`, actionLabel: "Email the committee" },
  { label: "Scholarship", detail: "Email with subject \"ASU Scholarship\"", action: `mailto:${organization.contact.email}?subject=ASU Scholarship Question`, actionLabel: "Email the committee" },
];

const jsonLd = [
  buildWebPageSchema({ name: "Contact", description, url }),
  {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "contactType": "customer service",
    "telephone": organization.contact.phone,
    "email": organization.contact.email,
    "availableLanguage": "en",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00",
    },
  },
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
    { name: "Contact", url },
  ]),
];
---
<BaseLayout title="Contact" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <PageHero
    eyebrow="Monte Vista, Colorado"
    title="Contact."
    subtitle="Phone during ticket office hours. Email anytime."
  />

  <main class="max-w-7xl mx-auto px-6 py-20 space-y-24">

    <section class="grid gap-12 md:grid-cols-3">
      <div>
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Phone</p>
        <p class="mt-3 font-display text-3xl font-black">
          <a href={`tel:${organization.contact.phone.replace(/[^0-9+]/g, "")}`} class="hover:text-oxblood">
            {organization.contact.phoneDisplay}
          </a>
        </p>
      </div>
      <div>
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Email</p>
        <p class="mt-3 font-display text-3xl font-black break-words">
          <a href={`mailto:${organization.contact.email}`} class="hover:text-oxblood">
            {organization.contact.email}
          </a>
        </p>
      </div>
      <div>
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Mail</p>
        <address class="mt-3 not-italic font-display text-2xl font-black leading-tight">
          {organization.mailingAddress.poBox}<br />
          {organization.mailingAddress.city}, {organization.mailingAddress.region} {organization.mailingAddress.postalCode}
        </address>
      </div>
    </section>

    <section>
      <SectionHeader number="01" label="Who to contact for what" />
      <ul class="mt-10 grid gap-6 md:grid-cols-2">
        {roles.map((r) => (
          <li class="border-t-2 border-dust pt-5">
            <p class="font-display text-xl font-black">{r.label}</p>
            <p class="mt-2 font-sans text-sm text-charcoal/70">{r.detail}</p>
            <a href={r.action} class="mt-3 inline-block font-sans text-sm text-oxblood hover:underline break-all">
              {r.actionLabel}
            </a>
          </li>
        ))}
      </ul>
    </section>

    <section class="grid gap-12 md:grid-cols-2">
      <aside class="border border-dust bg-bone p-8">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Event address</p>
        <address class="mt-3 not-italic font-sans text-base text-charcoal">
          {organization.venue.name}<br />
          {organization.venue.streetAddress}<br />
          {organization.venue.city}, {organization.venue.region} {organization.venue.postalCode}
        </address>
      </aside>
      <aside class="border border-dust bg-bone p-8">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Ticket office</p>
        <address class="mt-3 not-italic font-sans text-base text-charcoal">
          {organization.ticketOffice.streetAddress}<br />
          {organization.ticketOffice.city}, {organization.ticketOffice.region} {organization.ticketOffice.postalCode}<br />
          <span class="text-charcoal/70">{organization.ticketOffice.hours}</span>
        </address>
      </aside>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import Button from "@components/Button.astro";
---
<BaseLayout title="Page not found" description="Page not found on the Ski-Hi Stampede site.">
  <main class="min-h-[70vh] flex items-center justify-center px-6 py-20">
    <div class="max-w-2xl text-center space-y-6">
      <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Error 404</p>
      <h1 class="font-display font-black text-6xl md:text-8xl text-charcoal leading-none">
        That trail does not lead here.
      </h1>
      <p class="font-sans text-base text-charcoal/80">
        The page you asked for is not on the Ski-Hi Stampede site. Head back to the main grounds or jump to the schedule.
      </p>
      <div class="flex flex-wrap gap-4 justify-center pt-4">
        <Button href="/">Home</Button>
        <Button href="/events" variant="ghost">Schedule</Button>
      </div>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Build, verify, commit**

```bash
npm run build
git add -A
git commit -m "feat(pages): /contact and /404"
git push origin main
```

---

## Task 17: Final Verification and Plan 3 Complete

**Files:**
- Append: `content/_audit.md` (Plan 3 Complete summary)

**Interfaces:** none, verification only.

- [ ] **Step 1: Wait for Railway deploy to settle**

```bash
cd "C:/Users/braxt/Projects/rodeo-ticket-main/Events/skihi-main"
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  status=$(railway status --json 2>/dev/null | node -e "const s=require('fs').readFileSync(0,'utf8');try{const d=JSON.parse(s);const n=d.environments.edges[0].node.serviceInstances.edges[0].node;console.log(n.latestDeployment?.status||'none');}catch(e){console.log('ERR');}" 2>/dev/null)
  echo "[$i] $status"
  if [ "$status" = "SUCCESS" ] || [ "$status" = "FAILED" ] || [ "$status" = "CRASHED" ]; then break; fi
  sleep 20
done
```

- [ ] **Step 2: Smoke-test every route**

```bash
for route in / /tickets /events /sponsors /about /visit /parade /mutton-busting /scholarship /committee /contestants /carnival /vendors /faq /contact /404 /design; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" "https://skihi-production.up.railway.app${route}")
  echo "$code  $route"
done
```

Expected: every route returns 200 except `/404` and (optionally) any truly-nonexistent paths. `/design` returns 200 (showcase stays reachable until Plan 4 excludes it from indexable sitemap).

- [ ] **Step 3: Verify FAQPage schema on 5 target pages**

```bash
for route in /tickets /visit /parade /mutton-busting /contestants /faq; do
  count=$(curl -sS "https://skihi-production.up.railway.app${route}" | grep -c "\"@type\":\"FAQPage\"" || echo 0)
  echo "FAQPage count on $route: $count"
done
```

Expected: each page with FAQ returns 1 or more occurrences. `/tickets`, `/visit`, `/parade`, `/mutton-busting`, `/contestants`, `/faq` all should have at least one.

- [ ] **Step 4: Run Lighthouse on three representative pages**

```bash
for route in / /tickets /committee; do
  slug=$(echo "$route" | tr '/' '-' | sed 's/^-$/home/; s/^-//')
  npx --yes lighthouse "https://skihi-production.up.railway.app${route}" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json \
    --output-path=./docs/lighthouse/2026-10-07-${slug} \
    --chrome-flags="--headless=new" --quiet 2>&1 | tail -3
  mv "./docs/lighthouse/2026-10-07-${slug}" "./docs/lighthouse/2026-10-07-${slug}.report.json" 2>/dev/null || true
  node -e "const r=require('./docs/lighthouse/2026-10-07-${slug}.report.json');console.log('${route}:',Object.entries(r.categories).map(([k,v])=>k+':'+Math.round(v.score*100)).join(', '));"
done
```

- [ ] **Step 5: Fix any sub-threshold scores inline**

Expected: Performance >= 95, Accessibility = 100, Best Practices = 100, SEO around 66 to 85 (because noindex docks SEO). If accessibility is below 100, investigate color-contrast, missing alt text, or heading hierarchy issues.

- [ ] **Step 6: Write Plan 3 Complete summary**

Append to `content/_audit.md`:

```markdown

## Plan 3 Complete

**Date:** <today>
**Live site:** https://skihi-production.up.railway.app
**Pages shipped:** / , /tickets, /events, /sponsors, /about, /visit, /parade, /mutton-busting, /scholarship, /committee, /contestants, /carnival, /vendors, /faq, /contact, /404, /design (dev)
**Lighthouse samples:** reports under docs/lighthouse/

Design system now covers every page. SeatMaxx integration pattern in place and defaulting to `placeholder` mode. 14 committee headshots live. 6 FAQ sections carrying FAQPage schema. Event, Organization, TouristAttraction, LodgingBusiness, EducationalOccupationalProgram, ContactPoint schema deployed as applicable.

Ready for Plan 4 (SEO + AEO hardening + QA + launch).
```

- [ ] **Step 7: Commit and push**

```bash
git add -A
git commit -m "docs: plan 3 complete, lighthouse reports, all pages verified"
git push origin main
```

---

## Spec Coverage Check

| Spec section | Covered by | Notes |
|---|---|---|
| 3. Information Architecture: /tickets, /events, /sponsors, /contestants, /parade, /mutton-busting, /scholarship | Tasks 3, 4, 5, 12, 8, 9, 10 | |
| 3. IA: /about, /visit, /contact, /404 | Tasks 6, 7, 16 | |
| 3. IA: /faq, /committee, /carnival, /vendors (post-audit additions) | Tasks 15, 11, 13, 14 | |
| 4. Visual System: PageHero, FAQList, CommitteeCard, SponsorGrid primitives | Task 1 | |
| 5. Content Strategy: full rewrite in Ski-Hi voice, `[CONFIRM]` for 2027-specific | Every page task | |
| 6. SeatMaxx Integration Pattern: placeholder/embed/link | Task 2 | Default `placeholder` stays until Braxton provides real snippet |
| 7. SEO: schema.org JSON-LD per page | Every page task | |
| 8. AEO: FAQPage schema on 5 pages (plus /faq) | Tasks 3, 7, 8, 9, 12, 15 | 6 pages total with FAQPage |
| 9. Phase Plan: Phase 4 (page rollout) | Tasks 3-16 | |
| 9. Phase Plan: Phase 5 (SeatMaxx integration) | Tasks 1, 2 | |

**Deferred to Plan 4:**
- `llms.txt` and `llms-full.txt` for AEO
- `@astrojs/sitemap` and dynamic `robots.txt`
- `SITE_INDEXABLE` flip
- Google Rich Results validation per page
- AEO extractability test on target queries
- Full cross-browser QA pass (Chrome, Safari, Firefox, mobile Safari, mobile Chrome)
- axe accessibility pass
- Dedicated OG image design (we still use the resized hero)
- Final production handoff README
