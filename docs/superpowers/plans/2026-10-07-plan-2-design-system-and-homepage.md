# Plan 2: Design System + Homepage Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the design system (palette, typography, texture, nav, footer, button and image primitives) and then the full homepage end-to-end as a vertical slice that validates the visual direction. On completion, `/` renders the real pitch homepage with hero, countdown, schedule preview, who-we-are, sponsor preview, visit teaser, and SEO/AEO primitives applied. Pattern becomes the reference for Plan 3's remaining page rollout.

**Architecture:** Static Astro pages. Zero client JavaScript except the countdown island on `/`. Design primitives live in `src/components/` and are composed into page sections under `src/components/sections/`. All copy lives inline in page files (no CMS). Config stays in `src/config/`. The showcase page `/_design` is a developer reference, not shipped to users (hidden from nav, no linked-to-from-anywhere, excluded from sitemap in Plan 4).

**Tech Stack:**
- Astro 7+ with islands architecture
- Tailwind CSS 4 via `@tailwindcss/vite`
- TypeScript strict mode
- Google Fonts (Playfair Display + IBM Plex Sans), self-hosted via `@fontsource` packages
- Sharp (for build-time image optimization via Astro `<Image />`)

## Global Constraints

* **No em-dashes in any source file.** Use colons, commas, periods, or restructure. Applies to copy, comments, docs, everything.
* **No gradient backgrounds, no decorative icons, no glow/blur/backdrop-filter effects, no sprinkled Framer Motion animations.** Flat colors or real texture (paper grain) only.
* **No cookie-cutter "hero + 3 feature cards + testimonial + CTA" layouts.** Editorial, asymmetric compositions.
* **Palette locked:** bone `#F2EBDC`, oxblood `#6B1F1A`, dust `#B59470`, denim `#2B3B55`, charcoal `#1A1613`, grit `#0F0C0A`. One accent color per section max. Flat fills only.
* **Typography:** Playfair Display Black for display, IBM Plex Sans for body. Tabular numerals on dates and prices.
* **Zero scripts on all pages except for the countdown island on `/`.** No analytics, no third-party widgets.
* **`site.indexable` stays `false`** throughout Plan 2. Robots gate flips in Plan 4.
* **`ticketing.mode` stays `'placeholder'`.** Buy Tickets CTAs route to `/tickets` (not implemented yet; will 404 until Plan 3). That is acceptable since the pitch landing is `/`.
* **Lighthouse budget on `/`:** Performance >= 95, Accessibility = 100, Best Practices = 100, SEO = 100 (robots gate aside; measured with gate disabled locally).
* **Every image uses Astro `<Image />` with explicit width/height.** No raw `<img>` tags.
* **Every page extends `BaseLayout`.** No ad-hoc `<html>` scaffolding.
* **Content voice:** grounded, generational, matter-of-fact, San Luis Valley pride. Short sentences. Specific nouns. No vague superlatives. See `docs/superpowers/specs/2026-10-07-skihi-pitch-site-design.md` section 5 for the voice guide.
* **Commit frequency:** every task ends with a commit, every commit pushed to `main` (Railway auto-deploys).

---

## Task 1: Palette, Typography, and Paper Grain in Tailwind Theme

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/styles/paper-grain.svg`
- Create: `public/fonts/.gitkeep` (placeholder, fonts are via npm)
- Modify: `package.json` (add font packages)
- Modify: `src/layouts/BaseLayout.astro` (import fonts and set body font)

**Interfaces:**
- Consumes: Plan 1's Tailwind integration and `BaseLayout`.
- Produces:
  - Tailwind theme with named colors (`bone`, `oxblood`, `dust`, `denim`, `charcoal`, `grit`), two font families (`display`, `sans`), and a `bg-paper` utility.
  - Google Fonts self-hosted via `@fontsource/playfair-display` and `@fontsource/ibm-plex-sans` imported from `BaseLayout`.
  - CSS custom property `--paper-grain-url` set to the inlined SVG data URI for use anywhere.

- [ ] **Step 1: Install font packages**

```bash
npm install @fontsource/playfair-display @fontsource/ibm-plex-sans
```

- [ ] **Step 2: Create the paper grain SVG**

Create `src/styles/paper-grain.svg` with a small subtle noise tile. The SVG uses a `feTurbulence` filter so it stays sharp at any size and tiles seamlessly.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed="7"/>
    <feColorMatrix values="0 0 0 0 0.106
                           0 0 0 0 0.086
                           0 0 0 0 0.075
                           0 0 0 0.05 0"/>
  </filter>
  <rect width="200" height="200" filter="url(#n)"/>
</svg>
```

- [ ] **Step 3: Update `src/styles/global.css` with the full theme**

Replace the existing content with:

```css
@import "tailwindcss";

@theme {
  --color-bone: #F2EBDC;
  --color-oxblood: #6B1F1A;
  --color-dust: #B59470;
  --color-denim: #2B3B55;
  --color-charcoal: #1A1613;
  --color-grit: #0F0C0A;

  --font-display: "Playfair Display", Georgia, serif;
  --font-sans: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;

  --tracking-widest: 0.25em;
}

@layer base {
  html {
    background-color: var(--color-bone);
    color: var(--color-charcoal);
    font-family: var(--font-sans);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  /* tabular numerals on time, dates, prices */
  time, .tabular, .price {
    font-variant-numeric: tabular-nums;
  }

  /* Paper grain utility. 5% opacity, tiled, no scroll. */
  .bg-paper {
    background-color: var(--color-bone);
    background-image: url("/paper-grain.svg");
    background-size: 200px 200px;
    background-repeat: repeat;
    background-attachment: fixed;
  }
}
```

- [ ] **Step 4: Copy the paper grain SVG to public for runtime fetch**

Astro cannot inline arbitrary SVGs through CSS from `src/`. Move to `public/`:

```bash
cp src/styles/paper-grain.svg public/paper-grain.svg
```

- [ ] **Step 5: Update `src/layouts/BaseLayout.astro` to import fonts**

Add these imports inside the frontmatter block, before any other imports:

```astro
---
import "@fontsource/playfair-display/900.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@/styles/global.css";
import { site } from "@config/site";
import { organization } from "@config/organization";
// ... rest unchanged
---
```

And change the body class from `font-sans antialiased` to `bg-paper text-charcoal`:

```astro
<body class="bg-paper text-charcoal">
```

- [ ] **Step 6: Verify dev server renders new theme**

```bash
npm run dev
```

Visit `http://localhost:4321/`. Expected:
- Background is bone with a subtle paper grain visible at close inspection.
- Text uses IBM Plex Sans (slightly rounder than default system sans).
- Pitch preview banner still at top in yellow.
- H1 displays. Kill server.

- [ ] **Step 7: Verify production build**

```bash
npm run build
```

Expected: no errors. The built HTML should reference the paper-grain.svg from `/paper-grain.svg`.

- [ ] **Step 8: Commit and push**

```bash
git add -A
git commit -m "feat(design): add palette, fonts, paper grain theme"
git push origin main
```

Railway auto-deploys. Verify at `https://skihi-production.up.railway.app/` after about 90 seconds.

---

## Task 2: Section Header and Button Primitives

**Files:**
- Create: `src/components/SectionHeader.astro`
- Create: `src/components/Button.astro`
- Create: `src/components/BuyTicketsButton.astro`

**Interfaces:**
- Consumes: Task 1's theme (colors, fonts, tracking).
- Produces:
  - `<SectionHeader number label />`: renders `01 · WHO WE ARE` with left vertical rule, small caps, dust-tan.
  - `<Button href variant />`: renders a rectangular button. `variant="primary"` is oxblood block with 2px border; `variant="ghost"` is bone block with oxblood border. Inverts on hover. No pill shape, no rounded corners.
  - `<BuyTicketsButton />`: reads `ticketing` from config. In `placeholder` mode, links to `/tickets`. In `link` mode, links to `ticketing.buyTicketsUrl`. In `embed` mode, scrolls to `#tickets` on the same page.

- [ ] **Step 1: Create `src/components/SectionHeader.astro`**

```astro
---
interface Props {
  number: string;
  label: string;
  class?: string;
}

const { number, label, class: className = "" } = Astro.props;
---
<header class={`flex items-center gap-4 border-l-2 border-dust pl-4 ${className}`}>
  <span class="font-sans text-sm font-medium tabular text-oxblood">{number}</span>
  <span class="font-sans text-sm font-medium uppercase tracking-widest text-charcoal">{label}</span>
</header>
```

- [ ] **Step 2: Create `src/components/Button.astro`**

```astro
---
interface Props {
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
  class?: string;
}

const { href, variant = "primary", external = false, class: className = "" } = Astro.props;

const base = "inline-flex items-center justify-center font-sans text-sm font-medium uppercase tracking-widest px-8 py-4 border-2 transition-colors duration-150";

const variants = {
  primary: "bg-oxblood text-bone border-oxblood hover:bg-bone hover:text-oxblood",
  ghost: "bg-bone text-oxblood border-oxblood hover:bg-oxblood hover:text-bone",
} as const;

const rel = external ? "noopener noreferrer" : undefined;
const target = external ? "_blank" : undefined;
---
<a href={href} rel={rel} target={target} class={`${base} ${variants[variant]} ${className}`}>
  <slot />
</a>
```

- [ ] **Step 3: Create `src/components/BuyTicketsButton.astro`**

```astro
---
import Button from "@components/Button.astro";
import { ticketing } from "@config/ticketing";

interface Props {
  class?: string;
  variant?: "primary" | "ghost";
  label?: string;
}

const { class: className = "", variant = "primary", label = "Buy Tickets" } = Astro.props;

let href = "/tickets";
let external = false;

if (ticketing.mode === "link" && ticketing.buyTicketsUrl) {
  href = ticketing.buyTicketsUrl;
  external = /^https?:\/\//.test(href);
} else if (ticketing.mode === "embed") {
  href = "/tickets#embed";
}
---
<Button href={href} variant={variant} external={external} class={className}>
  {label}
</Button>
```

- [ ] **Step 4: Verify by adding to homepage temporarily and running dev**

Open `src/pages/index.astro` and add imports plus a quick visual check at the top of main:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import SectionHeader from "@components/SectionHeader.astro";
import BuyTicketsButton from "@components/BuyTicketsButton.astro";
import { organization } from "@config/organization";
// ...
---
<BaseLayout title="Home" description={description}>
  <main class="min-h-screen">
    <section class="p-12 space-y-6">
      <SectionHeader number="00" label="Primitives check" />
      <BuyTicketsButton />
      <BuyTicketsButton variant="ghost" label="Learn More" />
    </section>
  </main>
</BaseLayout>
```

Run `npm run dev` and visit `/`. Expected:
- SectionHeader shows `00 · PRIMITIVES CHECK` with left vertical rule and dust-tan tick for number.
- Two rectangular buttons, no pill shape. Primary is oxblood with bone text, ghost is bone with oxblood text. On hover, colors invert. No shadow, no scale, no glow.

If anything looks wrong, fix before continuing. Then revert the temporary primitives block (the real homepage lives in Phase 3 tasks).

- [ ] **Step 5: Revert the temporary primitives check**

Restore `src/pages/index.astro` to the Plan 1 version (just the H1 placeholder) so Task 9 starts from a clean slate.

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import { organization } from "@config/organization";

const description = `${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`;
---
<BaseLayout title="Home" description={description}>
  <main class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold">{organization.name}</h1>
      <p class="mt-4 text-xl">{organization.tagline}</p>
      <p class="mt-2 text-stone-600">{organization.nextEvent.displayDate}</p>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 6: Verify build and commit**

```bash
npm run build
git add -A
git commit -m "feat(design): add section header and button primitives"
git push origin main
```

---

## Task 3: Nav Component

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/layouts/BaseLayout.astro` to render `<Nav />` above the slot.

**Interfaces:**
- Consumes: Task 2's `BuyTicketsButton`.
- Produces:
  - `<Nav />`: desktop renders horizontal links (home, events, tickets, visit, about, contact) in uppercase small-tracking IBM Plex Sans. Right-side Buy Tickets CTA. On mobile (< 768 px) renders a hamburger that opens a full-screen takeover with huge Playfair Display links. Zero icon decoration apart from a plain SVG for menu toggle.

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
import BuyTicketsButton from "@components/BuyTicketsButton.astro";
import { organization } from "@config/organization";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/tickets", label: "Tickets" },
  { href: "/visit", label: "Visit" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
---
<nav class="relative z-30 border-b border-dust/40 bg-bone">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <a href="/" class="font-display text-2xl font-black tracking-tight text-charcoal">
      {organization.name}
    </a>

    {/* Desktop links */}
    <ul class="hidden items-center gap-8 md:flex">
      {links.map((link) => (
        <li>
          <a
            href={link.href}
            class="font-sans text-xs font-medium uppercase tracking-widest text-charcoal hover:text-oxblood"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <div class="hidden md:block">
      <BuyTicketsButton variant="primary" />
    </div>

    {/* Mobile toggle (functional, no decorative icon) */}
    <button
      id="nav-toggle"
      class="md:hidden font-sans text-xs font-medium uppercase tracking-widest text-charcoal"
      aria-controls="mobile-menu"
      aria-expanded="false"
    >
      Menu
    </button>
  </div>

  {/* Mobile full-screen takeover */}
  <div
    id="mobile-menu"
    class="hidden fixed inset-0 z-40 bg-bone p-8 flex flex-col justify-between"
  >
    <div class="flex justify-end">
      <button
        id="nav-close"
        class="font-sans text-xs font-medium uppercase tracking-widest text-charcoal"
      >
        Close
      </button>
    </div>
    <ul class="space-y-6">
      {links.map((link) => (
        <li>
          <a
            href={link.href}
            class="font-display text-5xl font-black text-charcoal hover:text-oxblood"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
    <div>
      <BuyTicketsButton variant="primary" class="w-full" />
    </div>
  </div>
</nav>

<script>
  const toggle = document.getElementById("nav-toggle");
  const close = document.getElementById("nav-close");
  const menu = document.getElementById("mobile-menu");

  function openMenu() {
    menu?.classList.remove("hidden");
    menu?.classList.add("flex");
    toggle?.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden");
  }

  function closeMenu() {
    menu?.classList.remove("flex");
    menu?.classList.add("hidden");
    toggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
  }

  toggle?.addEventListener("click", openMenu);
  close?.addEventListener("click", closeMenu);
</script>
```

- [ ] **Step 2: Update `src/layouts/BaseLayout.astro` to render Nav**

Add the import:

```astro
---
import "@fontsource/playfair-display/900.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@/styles/global.css";
import { site } from "@config/site";
import { organization } from "@config/organization";
import Nav from "@components/Nav.astro";

interface Props {
  title?: string;
  description?: string;
}
// ...
---
```

And render `<Nav />` after the pitch preview banner, before the `<slot />`:

```astro
<body class="bg-paper text-charcoal">
  {!site.indexable && (
    <div class="bg-yellow-200 text-stone-900 text-sm px-4 py-2 text-center border-b border-yellow-400">
      {site.pitchBannerText}
    </div>
  )}
  <Nav />
  <slot />
</body>
```

- [ ] **Step 3: Verify desktop and mobile**

```bash
npm run dev
```

Open `http://localhost:4321/`. Expected desktop: Ski-Hi Stampede wordmark on the left, 6 nav links across, Buy Tickets button on the right. All uppercase small-tracking except the wordmark which is Playfair Display Black.

Resize to under 768 px. Expected: wordmark + Menu button only. Click Menu. Full-screen takeover appears with 6 huge Playfair links stacked vertically. Click Close. Menu disappears, body scroll restored.

- [ ] **Step 4: Verify production build and commit**

```bash
npm run build
git add -A
git commit -m "feat(design): add site nav with mobile takeover"
git push origin main
```

---

## Task 4: Footer Component

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro` to render `<Footer />` after the slot.

**Interfaces:**
- Consumes: `organization` config.
- Produces:
  - `<Footer />`: 3-column grid on desktop (contact | venue | social), stacked on mobile. All NAP reads from `organization.ts` so NAP consistency is enforced structurally. No form, no email signup, no cookie banner.

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import { organization } from "@config/organization";

const nowYear = new Date().getFullYear();
---
<footer class="mt-24 border-t border-dust/40 bg-bone">
  <div class="mx-auto max-w-7xl px-6 py-16">
    <div class="grid gap-12 md:grid-cols-3">
      <section>
        <h2 class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Contact</h2>
        <ul class="mt-4 space-y-2 font-sans text-sm text-charcoal">
          <li>
            <a href={`tel:${organization.contact.phone.replace(/[^0-9+]/g, "")}`} class="hover:text-oxblood">
              {organization.contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${organization.contact.email}`} class="hover:text-oxblood">
              {organization.contact.email}
            </a>
          </li>
          <li class="pt-2 text-charcoal/70">
            {organization.mailingAddress.poBox}<br />
            {organization.mailingAddress.city}, {organization.mailingAddress.region} {organization.mailingAddress.postalCode}
          </li>
        </ul>
      </section>

      <section>
        <h2 class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Venue</h2>
        <address class="mt-4 not-italic font-sans text-sm text-charcoal">
          {organization.venue.name}<br />
          {organization.venue.streetAddress}<br />
          {organization.venue.city}, {organization.venue.region} {organization.venue.postalCode}
        </address>

        <h3 class="mt-6 font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Ticket Office</h3>
        <address class="mt-4 not-italic font-sans text-sm text-charcoal">
          {organization.ticketOffice.streetAddress}<br />
          {organization.ticketOffice.city}, {organization.ticketOffice.region} {organization.ticketOffice.postalCode}<br />
          <span class="text-charcoal/70">{organization.ticketOffice.hours}</span>
        </address>
      </section>

      <section>
        <h2 class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Follow</h2>
        <ul class="mt-4 space-y-2 font-sans text-sm text-charcoal">
          <li>
            <a href={organization.social.facebook} rel="noopener noreferrer" target="_blank" class="hover:text-oxblood">
              Facebook
            </a>
          </li>
          <li>
            <a href={organization.social.instagram} rel="noopener noreferrer" target="_blank" class="hover:text-oxblood">
              Instagram
            </a>
          </li>
        </ul>
      </section>
    </div>

    <div class="mt-16 border-t border-dust/40 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <p class="font-sans text-xs text-charcoal/60">
        {organization.name}. {organization.tagline}. Founded {organization.foundingYear}.
      </p>
      <p class="font-sans text-xs text-charcoal/60">
        &copy; {nowYear} {organization.legalName}.
      </p>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Update `src/layouts/BaseLayout.astro` to render Footer**

Add the import:

```astro
import Footer from "@components/Footer.astro";
```

And render `<Footer />` after the `<slot />`:

```astro
  <Nav />
  <slot />
  <Footer />
</body>
```

- [ ] **Step 3: Verify and commit**

```bash
npm run dev
```

Visit `/`. Expected: footer visible at bottom. Three columns on desktop, stacked on mobile. All contact/venue/ticket-office/social info reads from the config. Phone links to `tel:+17198522055`. Email links to `mailto:info@skihistampede.com`. Social links open in new tab.

```bash
npm run build
git add -A
git commit -m "feat(design): add footer with NAP from config"
git push origin main
```

---

## Task 5: Image Primitives

**Files:**
- Create: `src/components/HeroImage.astro`
- Create: `src/components/SectionImage.astro`
- Create: `src/components/ArchiveImage.astro`
- Create: `src/images/manifest.ts` (centralized map from logical name to source file)

**Interfaces:**
- Consumes: images under `public/images/raw/` from Plan 1.
- Produces:
  - `<HeroImage src alt />`: full-bleed, grit black 50% overlay for text legibility, no treatment on the image itself.
  - `<SectionImage src alt caption?/>`: 4:3 or 3:4 aspect, 1px dust border on all sides, no shadow, no rounded corners. Optional small-caps caption below.
  - `<ArchiveImage src alt caption?/>`: sepia duotone (black-to-dust-tan), 1px dust border, caption styled like a museum label.
  - `src/images/manifest.ts` central map lets code reference logical names (`heroHomepage`, `programBronc`, `greg`) instead of Wix hash filenames, so Plan 3 content doesn't hard-code hashes.

- [ ] **Step 1: Move raw images into Astro's `src/` for build-time optimization**

Astro's `<Image />` component requires sources under `src/`, not `public/`. Move:

```bash
mkdir -p src/images
mv public/images/raw src/images/raw
ls src/images/raw/ | head -5
```

Verify the `src/images/raw/` directory now holds all 59 files.

- [ ] **Step 2: Create `src/images/manifest.ts` central map**

This file is where every image used on the site registers a stable logical name. Add entries as more content pages are built in Plan 3; for Plan 2 we only need the homepage subset.

```ts
// Central image manifest. Importing via logical name means that if we
// ever re-process images, consumers do not need to change.
//
// Image resolution: files live under src/images/raw/. Keeping the
// original Wix content-hash filenames preserves traceability to the
// content audit in content/raw/*.md.

import heroHomepage from "./raw/262ad9_b389e3fe030f46198a4fafb428a57c64~mv2.jpg";
import programBronc from "./raw/262ad9_a7ef6a2f35d84e03abf10cdf70ec0b94~mv2.jpg";
import stampedeLogo from "./raw/262ad9_05d49d906edf4a9295a512d58cc219f6~mv2.png";
import siteLogoWhite from "./raw/262ad9_5bbbac7560d14f359bf96e99955c03ab~mv2.png";
import usa250Strip from "./raw/262ad9_f1998efadf72483ba72377fe1d38e0b3~mv2.png";

// Historical sponsor logos (names inferred from event titles in the sitemap)
// Mapped by sponsor label in sponsors.md
// Note: individual company-to-logo mapping is a [CONFIRM] item.

export const images = {
  heroHomepage,
  programBronc,
  stampedeLogo,
  siteLogoWhite,
  usa250Strip,
} as const;

export type ImageKey = keyof typeof images;
```

If `src/images/raw/...` filenames differ slightly from what's shown above, use `ls src/images/raw/ | grep <partial>` to find the exact filename.

- [ ] **Step 3: Create `src/components/HeroImage.astro`**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  src: ImageMetadata;
  alt: string;
  loading?: "eager" | "lazy";
}

const { src, alt, loading = "eager" } = Astro.props;
---
<div class="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
  <Image
    src={src}
    alt={alt}
    widths={[800, 1200, 1600, 2000]}
    sizes="100vw"
    format="webp"
    loading={loading}
    class="absolute inset-0 h-full w-full object-cover"
  />
  <div class="absolute inset-0 bg-grit/50"></div>
  <div class="relative z-10 h-full">
    <slot />
  </div>
</div>
```

- [ ] **Step 4: Create `src/components/SectionImage.astro`**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  class?: string;
}

const { src, alt, caption, class: className = "" } = Astro.props;
---
<figure class={`space-y-3 ${className}`}>
  <div class="border border-dust">
    <Image
      src={src}
      alt={alt}
      widths={[400, 800, 1200]}
      sizes="(min-width: 1024px) 50vw, 100vw"
      format="webp"
      loading="lazy"
      class="h-auto w-full"
    />
  </div>
  {caption && (
    <figcaption class="font-sans text-xs uppercase tracking-widest text-charcoal/70">
      {caption}
    </figcaption>
  )}
</figure>
```

- [ ] **Step 5: Create `src/components/ArchiveImage.astro`**

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";

interface Props {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  class?: string;
}

const { src, alt, caption, class: className = "" } = Astro.props;
---
<figure class={`space-y-3 ${className}`}>
  <div class="border border-dust bg-charcoal">
    <Image
      src={src}
      alt={alt}
      widths={[400, 800]}
      sizes="(min-width: 1024px) 33vw, 100vw"
      format="webp"
      loading="lazy"
      class="h-auto w-full mix-blend-multiply opacity-90"
      style="filter: sepia(1) saturate(0.8) hue-rotate(-10deg);"
    />
  </div>
  {caption && (
    <figcaption class="font-serif text-xs italic text-charcoal/70">
      {caption}
    </figcaption>
  )}
</figure>
```

- [ ] **Step 6: Verify build processes images**

```bash
npm run build
```

Expected: build succeeds. Check `dist/_astro/` for generated `.webp` files proving Astro processed images. The build output should mention `generating optimized images`.

- [ ] **Step 7: Commit and push**

```bash
git add -A
git commit -m "feat(design): add image primitives and manifest"
git push origin main
```

---

## Task 6: `/_design` Showcase Page

**Files:**
- Create: `src/pages/_design.astro`

**Interfaces:**
- Consumes: all primitives from Tasks 1-5.
- Produces: a single page at `/_design` that renders every primitive in isolation with labels. Developer tool. Not linked from nav, excluded from sitemap in Plan 4.

- [ ] **Step 1: Create `src/pages/_design.astro`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";
import BuyTicketsButton from "@components/BuyTicketsButton.astro";
import HeroImage from "@components/HeroImage.astro";
import SectionImage from "@components/SectionImage.astro";
import ArchiveImage from "@components/ArchiveImage.astro";
import { images } from "@/images/manifest";
---
<BaseLayout title="Design System" description="Internal design primitives reference.">
  <main class="max-w-7xl mx-auto px-6 py-16 space-y-24">

    <section>
      <h1 class="font-display text-5xl font-black">Design System</h1>
      <p class="mt-2 text-charcoal/70 font-sans text-sm max-w-prose">
        Internal reference. Every primitive used across the site, rendered in isolation.
        Shows the component API visually. Not linked from navigation and excluded from sitemap.
      </p>
    </section>

    <section class="space-y-8">
      <SectionHeader number="01" label="Palette" />
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        {["bone", "oxblood", "dust", "denim", "charcoal", "grit"].map((c) => (
          <div class="space-y-2">
            <div class={`h-24 w-full bg-${c} border border-charcoal/20`}></div>
            <p class="font-sans text-xs uppercase tracking-widest">{c}</p>
          </div>
        ))}
      </div>
    </section>

    <section class="space-y-8">
      <SectionHeader number="02" label="Typography" />
      <div class="space-y-6">
        <div>
          <p class="font-sans text-xs uppercase tracking-widest text-oxblood">Display, Playfair Display Black</p>
          <p class="font-display font-black text-6xl leading-none">The quick brown fox jumps over the lazy dog</p>
        </div>
        <div>
          <p class="font-sans text-xs uppercase tracking-widest text-oxblood">Body, IBM Plex Sans</p>
          <p class="font-sans text-base max-w-prose">
            The San Luis Valley Ski-Hi Stampede has run every July since 1919. One hundred eight years. Four PRCA Small Rodeo of the Year nominations.
          </p>
        </div>
        <div>
          <p class="font-sans text-xs uppercase tracking-widest text-oxblood">Tabular numerals</p>
          <p class="font-display font-black text-4xl tabular">July 8 to 11, 2027</p>
        </div>
      </div>
    </section>

    <section class="space-y-8">
      <SectionHeader number="03" label="Buttons" />
      <div class="flex flex-wrap gap-4">
        <Button href="#">Primary Button</Button>
        <Button href="#" variant="ghost">Ghost Button</Button>
        <BuyTicketsButton />
        <BuyTicketsButton variant="ghost" />
      </div>
    </section>

    <section class="space-y-8">
      <SectionHeader number="04" label="Hero image" />
      <HeroImage src={images.heroHomepage} alt="Rodeo bronc rider in action, Ski-Hi Stampede.">
        <div class="h-full flex items-end px-8 pb-12">
          <h2 class="font-display font-black text-bone text-5xl md:text-7xl leading-none">
            Hero overlay sample
          </h2>
        </div>
      </HeroImage>
    </section>

    <section class="space-y-8">
      <SectionHeader number="05" label="Section images" />
      <div class="grid gap-8 md:grid-cols-2">
        <SectionImage src={images.programBronc} alt="Program-era bronc riding photograph." caption="Section image sample" />
        <ArchiveImage src={images.programBronc} alt="Archive treatment on bronc photo." caption="Archive image sample, sepia duotone." />
      </div>
    </section>

  </main>
</BaseLayout>
```

- [ ] **Step 2: Verify in dev**

```bash
npm run dev
```

Visit `http://localhost:4321/_design`. Expected: every primitive renders. Palette swatches visible. Typography samples legible. Buttons work. Hero image is full-bleed with text overlay. Section/archive image pair shows the difference in treatment.

- [ ] **Step 3: Build and commit**

```bash
npm run build
git add -A
git commit -m "feat(design): add /_design showcase page"
git push origin main
```

---

## Task 7: Homepage Hero Section

**Files:**
- Create: `src/components/sections/HeroHome.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `HeroImage`, `BuyTicketsButton`, `organization`, `images.heroHomepage`.
- Produces: a hero section component at the top of `/` with full-bleed cody fire bronc image, grit overlay, H1 in Playfair Display Black at `clamp(3rem, 8vw, 6.5rem)`, event dates as subtitle, Buy Tickets CTA, and a "Scroll to learn more" affordance.

- [ ] **Step 1: Create `src/components/sections/HeroHome.astro`**

```astro
---
import HeroImage from "@components/HeroImage.astro";
import BuyTicketsButton from "@components/BuyTicketsButton.astro";
import { images } from "@/images/manifest";
import { organization } from "@config/organization";
---
<HeroImage src={images.heroHomepage} alt="Bronc rider mid-ride at the Ski-Hi Stampede.">
  <div class="h-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24 max-w-7xl mx-auto">
    <p class="font-sans text-xs md:text-sm font-medium uppercase tracking-widest text-dust">
      Monte Vista, Colorado. Est. {organization.foundingYear}.
    </p>
    <h1
      class="mt-4 font-display font-black text-bone leading-[0.9]"
      style="font-size: clamp(3rem, 8vw, 6.5rem);"
    >
      Colorado's Oldest<br />Pro Rodeo.
    </h1>
    <p class="mt-6 font-sans text-lg md:text-2xl text-bone/90 tabular">
      {organization.nextEvent.displayDate}
    </p>
    <div class="mt-10 flex flex-wrap gap-4">
      <BuyTicketsButton variant="primary" label="Buy Tickets" />
      <a href="#schedule" class="inline-flex items-center font-sans text-xs font-medium uppercase tracking-widest text-bone hover:text-dust">
        See the schedule
      </a>
    </div>
  </div>
</HeroImage>
```

- [ ] **Step 2: Update `src/pages/index.astro` to use the hero**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import HeroHome from "@components/sections/HeroHome.astro";
import { organization } from "@config/organization";

const description = `${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`;
---
<BaseLayout title="Home" description={description}>
  <HeroHome />
  <main class="max-w-7xl mx-auto px-6 py-24">
    {/* Subsequent sections added in Tasks 8-12 */}
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify dev and commit**

```bash
npm run dev
```

Visit `/`. Expected: full-bleed bronc image, dark overlay, dust tagline above a huge Playfair H1 reading "Colorado's Oldest Pro Rodeo." in two lines. "July 8 to 11, 2027" in tabular below. Oxblood Buy Tickets button plus a text link to the schedule.

```bash
npm run build
git add -A
git commit -m "feat(home): hero section with cody fire image and dates"
git push origin main
```

---

## Task 8: Countdown Island

**Files:**
- Create: `src/components/Countdown.astro`
- Modify: `src/pages/index.astro` to render `<Countdown client:idle />`.

**Interfaces:**
- Consumes: `organization.nextEvent.startDate`.
- Produces:
  - `<Countdown />`: an Astro component that renders Days / Hours / Minutes / Seconds as four tabular Playfair numerals, counting down to July 8, 2027 00:00 Mountain Time. Uses `client:idle` so JS only loads after main thread is free.

- [ ] **Step 1: Create `src/components/Countdown.astro`**

```astro
---
import { organization } from "@config/organization";

// Target: 2027-07-08 00:00 America/Denver (Mountain Time).
// We use a fixed ISO string with offset so the initial render is deterministic.
const target = "2027-07-08T00:00:00-06:00";

const now = Date.now();
const targetMs = new Date(target).getTime();
const delta = Math.max(0, targetMs - now);
const sec = Math.floor(delta / 1000);
const days = Math.floor(sec / 86400);
const hours = Math.floor((sec % 86400) / 3600);
const mins = Math.floor((sec % 3600) / 60);
const secs = sec % 60;

const pad = (n: number) => String(n).padStart(2, "0");
---
<section class="border-y border-dust/40 bg-bone/80">
  <div class="max-w-7xl mx-auto px-6 py-10 flex flex-wrap items-end justify-between gap-8">
    <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">
      Countdown to {organization.nextEvent.displayDate}
    </p>
    <div
      id="countdown"
      data-target={target}
      class="flex items-end gap-6 md:gap-10 font-display font-black text-charcoal tabular"
    >
      <div class="flex flex-col items-center">
        <span data-days class="text-5xl md:text-7xl leading-none">{pad(days)}</span>
        <span class="mt-2 font-sans text-[10px] uppercase tracking-widest text-charcoal/60">Days</span>
      </div>
      <div class="flex flex-col items-center">
        <span data-hours class="text-5xl md:text-7xl leading-none">{pad(hours)}</span>
        <span class="mt-2 font-sans text-[10px] uppercase tracking-widest text-charcoal/60">Hours</span>
      </div>
      <div class="flex flex-col items-center">
        <span data-mins class="text-5xl md:text-7xl leading-none">{pad(mins)}</span>
        <span class="mt-2 font-sans text-[10px] uppercase tracking-widest text-charcoal/60">Minutes</span>
      </div>
      <div class="flex flex-col items-center">
        <span data-secs class="text-5xl md:text-7xl leading-none">{pad(secs)}</span>
        <span class="mt-2 font-sans text-[10px] uppercase tracking-widest text-charcoal/60">Seconds</span>
      </div>
    </div>
  </div>
</section>

<script>
  const el = document.getElementById("countdown");
  if (el) {
    const target = new Date(el.dataset.target || "").getTime();
    const days = el.querySelector("[data-days]")!;
    const hours = el.querySelector("[data-hours]")!;
    const mins = el.querySelector("[data-mins]")!;
    const secs = el.querySelector("[data-secs]")!;
    const pad = (n: number) => String(n).padStart(2, "0");

    function tick() {
      const delta = Math.max(0, target - Date.now());
      const s = Math.floor(delta / 1000);
      days.textContent = pad(Math.floor(s / 86400));
      hours.textContent = pad(Math.floor((s % 86400) / 3600));
      mins.textContent = pad(Math.floor((s % 3600) / 60));
      secs.textContent = pad(s % 60);
    }

    tick();
    setInterval(tick, 1000);
  }
</script>
```

- [ ] **Step 2: Add Countdown to the homepage**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import HeroHome from "@components/sections/HeroHome.astro";
import Countdown from "@components/Countdown.astro";
import { organization } from "@config/organization";

const description = `${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`;
---
<BaseLayout title="Home" description={description}>
  <HeroHome />
  <Countdown />
  <main class="max-w-7xl mx-auto px-6 py-24">
    {/* subsequent sections */}
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify ticker runs**

```bash
npm run dev
```

Open `/`. Scroll past hero. Expected: countdown row with 4 tabular numerals ticking down. Watch Seconds change every second. Days should be in the ballpark of (July 8 2027 minus today). Minutes and hours should also tick.

- [ ] **Step 4: Build and commit**

```bash
npm run build
git add -A
git commit -m "feat(home): countdown island to July 8 2027"
git push origin main
```

---

## Task 9: Schedule Preview Section

**Files:**
- Create: `src/components/sections/SchedulePreview.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `SectionHeader`, `Button`, `BuyTicketsButton`.
- Produces: a 4-column grid (Thu / Fri / Sat / Sun) with each night listing date, PRCA Rodeo + nightly dance. Historical details (presenter sponsor, dance band) are shown without `[CONFIRM]` because they are confirmed by the current site. 2027-specific headliner artists are `[CONFIRM]`.

- [ ] **Step 1: Create `src/components/sections/SchedulePreview.astro`**

```astro
---
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";

const nights = [
  {
    label: "Thursday",
    date: "July 8, 2027",
    datetime: "2027-07-08",
    events: [
      { time: "7:00 PM", title: "PRCA Rodeo", detail: "Presented by Pepper Equipment" },
      { time: "9:00 PM", title: "Nightly Dance", detail: "Justin Kemp Band" },
    ],
  },
  {
    label: "Friday",
    date: "July 9, 2027",
    datetime: "2027-07-09",
    events: [
      { time: "10:00 AM", title: "Downtown Parade", detail: "Downtown Monte Vista" },
      { time: "7:00 PM", title: "PRCA Rodeo", detail: "Presented by Pepper Equipment" },
      { time: "9:00 PM", title: "Headliner Concert", detail: "[CONFIRM]" },
    ],
  },
  {
    label: "Saturday",
    date: "July 10, 2027",
    datetime: "2027-07-10",
    events: [
      { time: "10:00 AM", title: "Downtown Parade", detail: "Downtown Monte Vista" },
      { time: "11:00 AM", title: "Local Rodeo", detail: "SLV residents, following PRCA slack" },
      { time: "7:00 PM", title: "PRCA Rodeo", detail: "Presented by Pepper Equipment" },
      { time: "9:00 PM", title: "After Party", detail: "MV Coop Kubota, with Justin Kemp Band" },
    ],
  },
  {
    label: "Sunday",
    date: "July 11, 2027",
    datetime: "2027-07-11",
    events: [
      { time: "1:00 PM", title: "Sunday Matinee PRCA Rodeo", detail: "Presented by Pepper Equipment" },
      { time: "5:00 PM", title: "Awards and Closing", detail: "Stampede Grounds" },
    ],
  },
];
---
<section id="schedule" class="max-w-7xl mx-auto px-6 pt-24">
  <SectionHeader number="01" label="The schedule" />
  <h2 class="mt-6 font-display font-black text-5xl md:text-7xl text-charcoal leading-none">
    Four days.<br />One hundred eight years in the making.
  </h2>
  <p class="mt-6 font-sans text-base md:text-lg text-charcoal/80 max-w-prose">
    The Ski-Hi Stampede runs Thursday through Sunday, July 8 to 11, 2027. PRCA sanctioned rodeo performances every evening, downtown parades Friday and Saturday morning, local rodeo for San Luis Valley residents Saturday, and nightly dancing at the Stampede Grounds.
  </p>

  <div class="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
    {nights.map((night) => (
      <article class="border-t-2 border-oxblood pt-6">
        <header>
          <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">
            {night.label}
          </p>
          <p class="mt-1 font-display text-2xl font-black">
            <time datetime={night.datetime}>{night.date}</time>
          </p>
        </header>
        <ul class="mt-6 space-y-5">
          {night.events.map((event) => (
            <li>
              <p class="font-sans text-xs uppercase tracking-widest text-charcoal/60 tabular">{event.time}</p>
              <p class="font-sans text-base font-medium text-charcoal">{event.title}</p>
              <p class="font-sans text-sm text-charcoal/70">{event.detail}</p>
            </li>
          ))}
        </ul>
      </article>
    ))}
  </div>

  <div class="mt-16 flex flex-wrap gap-4">
    <Button href="/events">Full schedule</Button>
    <Button href="/tickets" variant="ghost">Ticket options</Button>
  </div>
</section>
```

- [ ] **Step 2: Add to homepage**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import HeroHome from "@components/sections/HeroHome.astro";
import Countdown from "@components/Countdown.astro";
import SchedulePreview from "@components/sections/SchedulePreview.astro";
import { organization } from "@config/organization";

const description = `${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`;
---
<BaseLayout title="Home" description={description}>
  <HeroHome />
  <Countdown />
  <SchedulePreview />
</BaseLayout>
```

Remove the empty `<main>` wrapper. Each section manages its own container. The outer `<main>` role is served by the first section's `<section id>`.

Add a `<main>` wrapper around all sections for a11y:

```astro
<BaseLayout title="Home" description={description}>
  <main>
    <HeroHome />
    <Countdown />
    <SchedulePreview />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify dev and commit**

```bash
npm run dev
```

Scroll past hero + countdown. Expected: section header "01 · THE SCHEDULE", huge display heading, intro paragraph, 4-column grid of nights with per-event rows. Click "Full schedule" link routes to `/events` (will 404 until Plan 3 builds that page; acceptable).

```bash
npm run build
git add -A
git commit -m "feat(home): schedule preview with 4-night grid"
git push origin main
```

---

## Task 10: Who We Are Section

**Files:**
- Create: `src/components/sections/WhoWeAre.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `SectionHeader`, `SectionImage`, `Button`, `images.programBronc`, `organization`.
- Produces: a two-column section (image left, text right on desktop) rewriting the current site's "WHO WE ARE" copy in Ski-Hi voice with specific nouns and concrete claims.

- [ ] **Step 1: Create `src/components/sections/WhoWeAre.astro`**

```astro
---
import SectionHeader from "@components/SectionHeader.astro";
import SectionImage from "@components/SectionImage.astro";
import Button from "@components/Button.astro";
import { images } from "@/images/manifest";
import { organization } from "@config/organization";

const yearsRunning = 2027 - organization.foundingYear;
---
<section class="max-w-7xl mx-auto px-6 pt-32">
  <SectionHeader number="02" label="Who we are" />
  <div class="mt-6 grid gap-12 md:grid-cols-12 items-start">

    <div class="md:col-span-5">
      <SectionImage
        src={images.programBronc}
        alt="Bronc rider at the Ski-Hi Stampede, from the official program."
        caption="Program bronc, Ski-Hi Stampede"
      />
    </div>

    <div class="md:col-span-7">
      <h2 class="font-display font-black text-5xl md:text-6xl text-charcoal leading-[0.95]">
        {yearsRunning} Julys.<br />One rodeo.
      </h2>
      <div class="mt-8 space-y-5 font-sans text-lg text-charcoal/90 max-w-prose">
        <p>
          The San Luis Valley Ski-Hi Stampede started in {organization.foundingYear}. We have run it every July since. {organization.name} is PRCA sanctioned. Non-profit. Run by {organization.volunteerCount}+ volunteers from Monte Vista and the valley.
        </p>
        <p>
          Four nominations for PRCA Small Rodeo of the Year. Ten thousand fans every summer. One grounds at {organization.venue.streetAddress}. One town. One week when the whole valley shows up.
        </p>
        <p>
          Thursday through Sunday. Rodeo at seven. Parade at ten. Mutton busting at every performance. Dancing until the lights come down.
        </p>
      </div>

      <div class="mt-10">
        <Button href="/about" variant="ghost">Our history</Button>
      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Add to homepage**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import HeroHome from "@components/sections/HeroHome.astro";
import Countdown from "@components/Countdown.astro";
import SchedulePreview from "@components/sections/SchedulePreview.astro";
import WhoWeAre from "@components/sections/WhoWeAre.astro";
import { organization } from "@config/organization";
// ...
---
<BaseLayout title="Home" description={description}>
  <main>
    <HeroHome />
    <Countdown />
    <SchedulePreview />
    <WhoWeAre />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify, build, commit**

```bash
npm run dev
```

Expected: WhoWeAre section with program bronc image on left, display heading `108 Julys. One rodeo.`, three short grounded paragraphs on the right, ghost "Our history" CTA at bottom.

```bash
npm run build
git add -A
git commit -m "feat(home): who we are section rewritten in ski-hi voice"
git push origin main
```

---

## Task 11: Sponsor Wall Preview

**Files:**
- Create: `src/components/sections/SponsorPreview.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `SectionHeader`, `Button`.
- Produces: a sponsor preview strip listing the 5 historical sponsors by name (no `[CONFIRM]`) with role, plus a "See all sponsors" link to `/sponsors`.

- [ ] **Step 1: Create `src/components/sections/SponsorPreview.astro`**

```astro
---
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";

const historicalSponsors = [
  { name: "Pepper Equipment", role: "PRCA Rodeo presenting sponsor" },
  { name: "Plant Nutrient Solutions, Summit Gold", role: "Headliner concert sponsor" },
  { name: "MV Coop Kubota", role: "After party sponsor" },
  { name: "Monte Vista Rotary", role: "Chuckwagon dinner" },
  { name: "Wrights Amusements", role: "Carnival operator" },
];
---
<section class="max-w-7xl mx-auto px-6 pt-32">
  <SectionHeader number="03" label="Our sponsors" />
  <div class="mt-6 flex flex-wrap items-end justify-between gap-6">
    <h2 class="font-display font-black text-5xl md:text-6xl text-charcoal leading-[0.95] max-w-3xl">
      The people who keep the Stampede running.
    </h2>
    <p class="font-sans text-base text-charcoal/70 max-w-md">
      Over one hundred businesses and families support the Ski-Hi Stampede every year. A sample of long-standing partners below. The full roster lives on the sponsors page.
    </p>
  </div>

  <ul class="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
    {historicalSponsors.map((s, i) => (
      <li class="border-t-2 border-dust pt-5">
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood tabular">
          {String(i + 1).padStart(2, "0")}
        </p>
        <p class="mt-2 font-display text-xl font-black text-charcoal leading-tight">
          {s.name}
        </p>
        <p class="mt-2 font-sans text-sm text-charcoal/70">
          {s.role}
        </p>
      </li>
    ))}
  </ul>

  <div class="mt-16 flex flex-wrap gap-4">
    <Button href="/sponsors">Full sponsor roster</Button>
    <Button href="/sponsors#become-a-sponsor" variant="ghost">Become a sponsor</Button>
  </div>
</section>
```

- [ ] **Step 2: Add to homepage and verify**

Update `src/pages/index.astro`:

```astro
---
import SponsorPreview from "@components/sections/SponsorPreview.astro";
// ...
---
<BaseLayout title="Home" description={description}>
  <main>
    <HeroHome />
    <Countdown />
    <SchedulePreview />
    <WhoWeAre />
    <SponsorPreview />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Build and commit**

```bash
npm run dev  # eyeball
npm run build
git add -A
git commit -m "feat(home): sponsor preview with 5 historical sponsors"
git push origin main
```

---

## Task 12: Plan Your Visit and Press Teaser

**Files:**
- Create: `src/components/sections/VisitTeaser.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `SectionHeader`, `Button`, `organization`.
- Produces: a two-column visit teaser (venue facts left, concrete travel notes right) that drives to `/visit`.

- [ ] **Step 1: Create `src/components/sections/VisitTeaser.astro`**

```astro
---
import SectionHeader from "@components/SectionHeader.astro";
import Button from "@components/Button.astro";
import { organization } from "@config/organization";
---
<section class="max-w-7xl mx-auto px-6 pt-32 pb-24">
  <SectionHeader number="04" label="Plan your visit" />
  <div class="mt-6 grid gap-16 md:grid-cols-2 items-start">

    <div>
      <h2 class="font-display font-black text-5xl md:text-6xl text-charcoal leading-[0.95]">
        Monte Vista sits at seven thousand feet.
      </h2>
      <div class="mt-8 space-y-4 font-sans text-lg text-charcoal/90 max-w-prose">
        <p>
          The Ski-Hi Stampede Complex is at {organization.venue.streetAddress}, {organization.venue.city}, Colorado, 81144. Two and a half hours from Albuquerque. Four hours from Denver. One hour from Alamosa.
        </p>
        <p>
          Gates open two hours before the first event each day. Parking is free at the grounds. Food and drink at the concession, cash and card. No bag policy posted; expect a standard check at the gate.
        </p>
      </div>

      <div class="mt-10 flex flex-wrap gap-4">
        <Button href="/visit">Plan your visit</Button>
        <Button href="/visit#lodging" variant="ghost">Where to stay</Button>
      </div>
    </div>

    <aside class="border border-dust p-8 space-y-6 bg-bone">
      <div>
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">The grounds</p>
        <address class="mt-2 not-italic font-sans text-base text-charcoal">
          {organization.venue.name}<br />
          {organization.venue.streetAddress}<br />
          {organization.venue.city}, {organization.venue.region} {organization.venue.postalCode}
        </address>
      </div>
      <div>
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">Ticket office</p>
        <address class="mt-2 not-italic font-sans text-base text-charcoal">
          {organization.ticketOffice.streetAddress}<br />
          {organization.ticketOffice.city}, {organization.ticketOffice.region} {organization.ticketOffice.postalCode}
        </address>
        <p class="mt-2 font-sans text-sm text-charcoal/70">
          {organization.ticketOffice.hours}
        </p>
      </div>
      <div>
        <p class="font-sans text-xs font-medium uppercase tracking-widest text-oxblood">By the numbers</p>
        <ul class="mt-2 space-y-1 font-sans text-base text-charcoal tabular">
          <li>{organization.foundingYear}: founded</li>
          <li>{organization.volunteerCount}+: volunteers</li>
          <li>{organization.annualAttendance.toLocaleString()}+: fans each summer</li>
          <li>{organization.prcaNominations}: PRCA Small Rodeo of the Year nominations</li>
        </ul>
      </div>
    </aside>

  </div>
</section>
```

- [ ] **Step 2: Add to homepage, build, commit**

```astro
---
import VisitTeaser from "@components/sections/VisitTeaser.astro";
// ...
---
<BaseLayout title="Home" description={description}>
  <main>
    <HeroHome />
    <Countdown />
    <SchedulePreview />
    <WhoWeAre />
    <SponsorPreview />
    <VisitTeaser />
  </main>
</BaseLayout>
```

```bash
npm run dev  # eyeball
npm run build
git add -A
git commit -m "feat(home): visit teaser with grounds + ticket office + facts"
git push origin main
```

---

## Task 13: SEO and AEO Primitives on Homepage

**Files:**
- Create: `src/lib/schema.ts` (schema.org JSON-LD builders)
- Modify: `src/layouts/BaseLayout.astro` (OG tags from props, JSON-LD slot)
- Modify: `src/pages/index.astro` (populate OG + JSON-LD)

**Interfaces:**
- Consumes: `organization`, `site`.
- Produces:
  - `buildEventSchema()`: returns a schema.org Event JSON-LD object for the Ski-Hi Stampede.
  - `buildOrganizationSchema()`: returns schema.org Organization JSON-LD.
  - `buildBreadcrumbSchema(items)`: returns schema.org BreadcrumbList JSON-LD given breadcrumb items.
  - Updated BaseLayout accepts `ogImage`, `ogType`, and a `<slot name="jsonld" />` where pages inject JSON-LD.
  - Homepage includes Event + Organization + BreadcrumbList JSON-LD inline.

- [ ] **Step 1: Create `src/lib/schema.ts`**

```ts
import { organization } from "@config/organization";
import { site } from "@config/site";

export interface JsonLd {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

export function buildOrganizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organization.name,
    "legalName": organization.legalName,
    "foundingDate": `${organization.foundingYear}-01-01`,
    "url": site.baseUrl,
    "sameAs": [organization.social.facebook, organization.social.instagram],
    "telephone": organization.contact.phone,
    "email": organization.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": organization.mailingAddress.poBox,
      "addressLocality": organization.mailingAddress.city,
      "addressRegion": organization.mailingAddress.region,
      "postalCode": organization.mailingAddress.postalCode,
      "addressCountry": "US",
    },
  };
}

export function buildEventSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${organization.name} ${new Date(organization.nextEvent.startDate).getFullYear()}`,
    "description": `${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`,
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
        "postalCode": organization.venue.postalCode,
        "addressCountry": organization.venue.country,
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": organization.venue.latitude,
        "longitude": organization.venue.longitude,
      },
    },
    "organizer": {
      "@type": "Organization",
      "name": organization.legalName,
      "url": site.baseUrl,
    },
  };
}

export function buildBreadcrumbSchema(
  items: ReadonlyArray<{ name: string; url: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
```

- [ ] **Step 2: Update `src/layouts/BaseLayout.astro` to accept OG and JSON-LD**

Replace the Props interface + head block:

```astro
---
import "@fontsource/playfair-display/900.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@/styles/global.css";
import { site } from "@config/site";
import { organization } from "@config/organization";
import Nav from "@components/Nav.astro";
import Footer from "@components/Footer.astro";

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
}

const {
  title,
  description,
  ogImage = `${site.baseUrl}/og-default.jpg`,
  ogType = "website",
} = Astro.props;

const fullTitle = title ? `${title} | ${organization.name}` : organization.name;
const robotsContent = site.indexable ? "index, follow" : "noindex, nofollow";
const canonical = new URL(Astro.url.pathname, site.baseUrl).toString();
---
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content={robotsContent} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonical} />
    <title>{fullTitle}</title>
    {description && <meta name="description" content={description} />}

    {/* Open Graph */}
    <meta property="og:site_name" content={organization.name} />
    <meta property="og:type" content={ogType} />
    <meta property="og:title" content={fullTitle} />
    {description && <meta property="og:description" content={description} />}
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:locale" content="en_US" />

    {/* Twitter card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    {description && <meta name="twitter:description" content={description} />}
    <meta name="twitter:image" content={ogImage} />

    <slot name="jsonld" />
  </head>
  <body class="bg-paper text-charcoal">
    {!site.indexable && (
      <div class="bg-yellow-200 text-stone-900 text-sm px-4 py-2 text-center border-b border-yellow-400">
        {site.pitchBannerText}
      </div>
    )}
    <Nav />
    <slot />
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: Add JSON-LD to the homepage**

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import HeroHome from "@components/sections/HeroHome.astro";
import Countdown from "@components/Countdown.astro";
import SchedulePreview from "@components/sections/SchedulePreview.astro";
import WhoWeAre from "@components/sections/WhoWeAre.astro";
import SponsorPreview from "@components/sections/SponsorPreview.astro";
import VisitTeaser from "@components/sections/VisitTeaser.astro";
import { organization } from "@config/organization";
import { site } from "@config/site";
import {
  buildOrganizationSchema,
  buildEventSchema,
  buildBreadcrumbSchema,
} from "@/lib/schema";

const description = `${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`;

const jsonLd = [
  buildOrganizationSchema(),
  buildEventSchema(),
  buildBreadcrumbSchema([
    { name: "Home", url: site.baseUrl },
  ]),
];
---
<BaseLayout title="Home" description={description}>
  <script type="application/ld+json" slot="jsonld" set:html={JSON.stringify(jsonLd)}></script>

  <main>
    <HeroHome />
    <Countdown />
    <SchedulePreview />
    <WhoWeAre />
    <SponsorPreview />
    <VisitTeaser />
  </main>
</BaseLayout>
```

- [ ] **Step 4: Add a placeholder OG image**

Astro's OG tags expect a URL. Until we design a real OG image (Plan 4), reuse the hero image at a reasonable size.

```bash
cp src/images/raw/262ad9_b389e3fe030f46198a4fafb428a57c64~mv2.jpg public/og-default.jpg
```

Resize via sharp:

```bash
node -e "import('sharp').then(({default:sharp})=>sharp('public/og-default.jpg').resize(1200,630,{fit:'cover',position:'center'}).jpeg({quality:85}).toFile('public/og-default-tmp.jpg').then(()=>{require('fs').renameSync('public/og-default-tmp.jpg','public/og-default.jpg');console.log('ok')}))"
```

- [ ] **Step 5: Verify JSON-LD renders in build output**

```bash
npm run build
grep -o "application/ld+json" dist/index.html
```

Expected: exactly one match (the single `<script type="application/ld+json">` tag).

Open `dist/index.html` and search for `"@type":"Event"`. Should be present. Also `"@type":"Organization"` and `"@type":"BreadcrumbList"`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(seo): add OG tags and schema.org JSON-LD on homepage"
git push origin main
```

---

## Task 14: Lighthouse Pass and Final Deploy Verification

**Files:** none (verification only). Minor fixes may land in `src/components/*.astro` or `src/layouts/BaseLayout.astro`.

**Interfaces:**
- Consumes: everything from Tasks 1-13.
- Produces: a confirmed-working Railway deployment where `/` scores Performance >= 95, Accessibility = 100, Best Practices = 100, SEO = 100 (with robots gate hypothetically disabled). Any sub-threshold scores get fixed inline before the task closes.

- [ ] **Step 1: Wait for Railway deploy to settle after Task 13 commit**

```bash
cd "C:/Users/braxt/Projects/rodeo-ticket-main/Events/skihi-main"
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  status=$(railway status --json 2>/dev/null | node -e "const s=require('fs').readFileSync(0,'utf8');try{const d=JSON.parse(s);const n=d.environments.edges[0].node.serviceInstances.edges[0].node;console.log(n.latestDeployment?.status||'none');}catch(e){console.log('ERR');}" 2>/dev/null)
  echo "[$i] $status"
  if [ "$status" = "SUCCESS" ] || [ "$status" = "FAILED" ] || [ "$status" = "CRASHED" ]; then break; fi
  sleep 15
done
```

- [ ] **Step 2: Verify URL serves the new homepage**

```bash
curl -sS -o /tmp/home.html -w "HTTP %{http_code} | size=%{size_download}B\n" https://skihi-production.up.railway.app/
echo "---"
grep -oE "Colorado's Oldest|Countdown to|Four days|Program bronc|Pepper Equipment|Monte Vista sits|application/ld\+json" /tmp/home.html | sort -u
```

Expected: HTTP 200, size well over 10 KB. All seven expected markers present. If any marker is missing, inspect the corresponding section's render output and fix before continuing.

- [ ] **Step 3: Run Lighthouse against the production URL**

Lighthouse CLI (install if missing):

```bash
npm install -g lighthouse chrome-launcher
lighthouse https://skihi-production.up.railway.app/ \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html \
  --output-path=./lighthouse-home \
  --chrome-flags="--headless=new"
```

- [ ] **Step 4: Review scores**

Open `lighthouse-home.report.html` in a browser or inspect the JSON:

```bash
node -e "const r=require('./lighthouse-home.report.json');for(const [k,v] of Object.entries(r.categories)){console.log(k,':',Math.round(v.score*100));}"
```

Expected minimums:
- performance: 95
- accessibility: 100
- best-practices: 100
- seo: 100 (noindex will show as a warning, that is acceptable while robots gate is on)

- [ ] **Step 5: Fix sub-threshold scores inline**

Common fixes if scores miss:

**Performance under 95:**
- Astro `<Image />` not applied somewhere. Check all `<img>` tags.
- Fonts loading as render-blocking. Add `font-display: swap` to CSS or use the Fontsource `self-host` approach correctly.
- Countdown JS block delaying LCP. Mark `<script>` as `defer` or move to end of body.

**Accessibility under 100:**
- Missing alt text on an image.
- Insufficient color contrast somewhere (unlikely with our palette, worth checking).
- Nav button missing `aria-label` or `aria-expanded` on the mobile menu toggle.

**Best Practices under 100:**
- Mixed content (http on https page). Shouldn't happen since we use site.baseUrl everywhere.
- Console errors from the countdown script. Add null-guards if any.

**SEO under 100 (excluding robots):**
- Missing `<title>` or `<meta description>`. All pages have both via BaseLayout.
- Links without discernible text (check nav icons; we have none decorative).

Apply fixes inline. Rerun Lighthouse. Iterate until all thresholds pass.

- [ ] **Step 6: Save Lighthouse report to the repo for future comparison**

```bash
mkdir -p docs/lighthouse
mv lighthouse-home.report.html docs/lighthouse/2026-10-07-home.html
mv lighthouse-home.report.json docs/lighthouse/2026-10-07-home.json
```

- [ ] **Step 7: Write Plan 2 Complete summary in `content/_audit.md`**

Append to the end of `content/_audit.md`:

```markdown

## Plan 2 Complete

**Date:** <today>
**Live homepage:** https://skihi-production.up.railway.app
**Lighthouse (home):** Performance <P>, Accessibility <A>, Best Practices <BP>, SEO <SEO>
**Reports:** docs/lighthouse/2026-10-07-home.{html,json}

Design system in place: palette, typography, paper grain, nav, footer, button and image primitives, section header pattern, `/_design` showcase.

Homepage vertical slice complete: hero, countdown, 4-night schedule preview, who-we-are rewritten in Ski-Hi voice, 5 historical sponsors listed, plan-your-visit teaser with grounds and ticket office. Event + Organization + BreadcrumbList JSON-LD applied.

Ready for Plan 3 (full page rollout + SeatMaxx integration pattern).
```

- [ ] **Step 8: Commit and push**

```bash
git add -A
git commit -m "docs: lighthouse report and plan 2 complete summary"
git push origin main
```

Wait for Railway auto-deploy to settle. Visit the URL one more time. Done.

---

## Spec Coverage Check

| Spec section | Covered by | Notes |
|---|---|---|
| 4. Visual System: palette, typography, texture | Task 1 | All six colors, two font families, paper grain tile |
| 4. Visual System: layout principles (asymmetric, editorial) | Tasks 7, 9, 10, 11, 12 | 12-col grid used asymmetrically throughout |
| 4. Visual System: section headers, buttons, imagery treatment | Tasks 2, 5 | SectionHeader + three button variants + three image components |
| 4. Visual System: icons rule (functional only) | Task 3 | Mobile nav uses text "Menu" and "Close", no icons |
| 4. Visual System: micro-moments (countdown, sponsor hover, mobile takeover) | Tasks 3, 8 | Countdown island, mobile takeover; sponsor hover is Plan 3 since previews are text-only |
| 5. Content Strategy: voice, specific nouns, no superlatives | Tasks 10, 11, 12 | WhoWeAre, SponsorPreview, VisitTeaser copy respects the voice guide |
| 5. Content Strategy: `[CONFIRM]` tags visible with banner | Task 9 | 2027 headliner marked `[CONFIRM]`; pitch banner already renders via `site.indexable=false` |
| 6. SeatMaxx integration: config-driven BuyTickets button | Task 2 | `BuyTicketsButton` reads `ticketing` config, routes based on mode |
| 7. SEO: canonical, OG, Twitter, title, description | Task 13 | All present in BaseLayout |
| 7. SEO: schema.org JSON-LD | Task 13 | Event + Organization + BreadcrumbList on `/` |
| 7. SEO: Lighthouse 95+/100/100/100 | Task 14 | Measured, fixed inline if needed, report saved |
| 8. AEO: definition sentence early, entity density | Tasks 7, 10, 12 | Hero defines what the Stampede is, WhoWeAre is entity-dense (venue, PRCA, etc.), VisitTeaser specifies elevation, distances |
| 9. Phase Plan: Phase 2 (design system) | Tasks 1-6 | |
| 9. Phase Plan: Phase 3 (homepage vertical slice) | Tasks 7-14 | |

**Deferred to Plan 3:**
- `/tickets`, `/events`, `/sponsors`, `/contestants`, `/parade`, `/mutton-busting`, `/scholarship`, `/about`, `/visit`, `/contact`, `/faq`, `/committee`, `/carnival`, `/vendors`, `/404`
- SeatMaxx embed component with placeholder mode styling
- FAQ sections with FAQPage schema
- Per-event ticketing URLs

**Deferred to Plan 4:**
- `llms.txt` and `llms-full.txt`
- Sitemap + robots.txt + `SITE_INDEXABLE` flip
- Full cross-browser QA and axe pass
- OG image design (we use a resized hero for Plan 2)
- Production go-live
