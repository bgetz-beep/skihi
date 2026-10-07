# Plan 1: Foundation + Content Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Astro + Tailwind + TypeScript project, deploy a placeholder to Railway at a shareable URL, and complete the full content audit (text, images, social media assets) so later plans have real source material to design and build against.

**Architecture:** Astro 5 static site, strict TypeScript, Tailwind CSS 4, zero client JS at this stage. Deployed via Railway's Nixpacks static-site handler reading from a GitHub repo. Content audit is a manual gather-and-catalogue phase producing one source-of-truth doc (`content/_audit.md`) plus organized asset directories.

**Tech Stack:**
- Astro 5+
- Tailwind CSS 4+ (via `@astrojs/tailwind` or the new Vite plugin)
- TypeScript strict mode
- Node.js 20+ (local is 26.1.0)
- git, GitHub CLI (`gh`), Railway CLI (`railway`)
- `curl` for image downloads

## Global Constraints

* **Repo already exists locally** at `C:\Users\braxt\Projects\rodeo-ticket-main\Events\skihi-main` with git initialized, main branch, one commit (the design spec). Do not re-initialize.
* **TypeScript must be strict.** `"strict": true`, `"noUncheckedIndexedAccess": true` in `tsconfig.json`.
* **No em-dashes anywhere in source files** (components, config, content, docs). Use colons, commas, periods, or restructure. User rule from 2026-10-06.
* **No analytics, no email signup, no tracking pixels, no third-party JS** at this stage.
* **`SITE_INDEXABLE` env var defaults to `false`.** Robots banned until explicitly flipped.
* **`ticketing.mode` defaults to `'placeholder'`.** No live SeatMaxx or RodeoTicket URLs wired up yet.
* **GitHub repo owner:** `bgetz-beep` (active `gh` account). Confirm before creation.
* **Railway account:** `bgetz@jetaxia.com`. Already logged in.
* **Commit frequency:** every task ends with a commit. Commit messages follow Conventional Commits (`feat:`, `chore:`, `docs:`, `content:`).
* **Dependency floors:** Astro ≥5.0, Tailwind ≥4.0, TypeScript ≥5.5, Node ≥20.
* **No .env secrets committed.** `.env` and `.env.local` are in `.gitignore` already.

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/pages/index.astro`
- Create: `src/env.d.ts`
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a buildable Astro project with `npm run dev`, `npm run build`, `npm run preview` all working.

- [ ] **Step 1: Scaffold Astro into the current empty directory**

Run from `C:\Users\braxt\Projects\rodeo-ticket-main\Events\skihi-main`:

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --git false --yes
```

Flags explained:
- `.` scaffolds in current directory (not a subdir).
- `--template minimal` because we build our own layout.
- `--typescript strict` enables strict mode.
- `--install` runs `npm install` immediately.
- `--git false` because the repo is already initialized.
- `--yes` skips all prompts.

If the command errors on "directory not empty" (because of `README.md`, `docs/`, `.gitignore`, `.claude/`), temporarily move those out, scaffold, then move back. Order:

```bash
mv README.md docs .gitignore .claude ..tmp_safe/
npm create astro@latest . -- --template minimal --typescript strict --install --git false --yes
mv ..tmp_safe/* .
mv ..tmp_safe/.gitignore .
mv ..tmp_safe/.claude .
rmdir ..tmp_safe
```

- [ ] **Step 2: Verify the scaffold runs**

```bash
npm run dev
```

Expected: dev server starts, prints `http://localhost:4321/`. Visit it in a browser; you should see the Astro default page. Kill the dev server (Ctrl+C) before continuing.

- [ ] **Step 3: Verify production build**

```bash
npm run build
```

Expected: builds to `dist/` with no errors.

- [ ] **Step 4: Tighten tsconfig.json**

Open `tsconfig.json` and ensure it extends `astro/tsconfigs/strict` and adds `"noUncheckedIndexedAccess": true`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@content/*": ["content/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Add .gitignore entries if not present**

Verify `.gitignore` contains at minimum:

```
node_modules
.astro
dist
.env
.env.local
.DS_Store
```

Append any missing lines. The existing `.gitignore` created with the design spec already has these; this is a safety check.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ public/ .gitignore
git commit -m "chore: scaffold astro + typescript project"
```

---

## Task 2: Add Tailwind CSS

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json` (via npm install)
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro` (import global.css to prove it works)

**Interfaces:**
- Consumes: Task 1's Astro scaffold.
- Produces: Tailwind utilities working across the project. `global.css` is the one place where custom CSS lives.

- [ ] **Step 1: Add the Tailwind integration**

```bash
npx astro add tailwind --yes
```

This adds `@astrojs/tailwind` (or the Vite plugin for Tailwind 4) and wires up `astro.config.mjs` and installs `tailwindcss`.

- [ ] **Step 2: Create global.css with the Tailwind directives**

Create `src/styles/global.css` with:

```css
@import "tailwindcss";

/* All custom CSS belongs below. Keep this file short. */
```

If Astro added `tailwind.config.mjs` (older v3-style integration), delete it; we drive Tailwind entirely from the Vite plugin + a `@theme` block we add in Task 11 of a future plan. For now, Tailwind defaults are fine.

- [ ] **Step 3: Import global.css in a shared layout stub**

Edit `src/pages/index.astro`:

```astro
---
import "@/styles/global.css";
---
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Ski-Hi Stampede</title>
  </head>
  <body class="bg-stone-100 text-stone-900 font-sans">
    <main class="min-h-screen flex items-center justify-center">
      <p class="text-2xl">Ski-Hi Stampede, coming soon.</p>
    </main>
  </body>
</html>
```

- [ ] **Step 4: Verify Tailwind works**

```bash
npm run dev
```

Visit `http://localhost:4321/`. The page should render on a light stone background with centered text. If utilities don't apply, Tailwind isn't wired up. Fix before committing.

- [ ] **Step 5: Verify build still works**

```bash
npm run build
```

Expected: no errors, `dist/index.html` contains the compiled Tailwind CSS inline or in a linked stylesheet.

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs package.json package-lock.json src/styles/ src/pages/index.astro
git commit -m "chore: add tailwind css"
```

---

## Task 3: Project Folder Layout + Config Stubs

**Files:**
- Create: `src/config/organization.ts`
- Create: `src/config/ticketing.ts`
- Create: `src/config/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/.gitkeep`
- Create: `content/.gitkeep`
- Create: `public/images/.gitkeep`
- Modify: `src/pages/index.astro` to use `BaseLayout`

**Interfaces:**
- Consumes: Task 2's Tailwind + global.css.
- Produces:
  - `organization` object: typed, exported constant with NAP, event dates, PRCA facts.
  - `ticketing` object: typed with `mode: 'placeholder' | 'embed' | 'link'`, URL slots.
  - `site` object: name, baseUrl, SITE_INDEXABLE flag.
  - `BaseLayout.astro`: reusable layout accepting `title`, `description`, slot content; renders head tags including `robots` meta tied to `site.indexable`.

- [ ] **Step 1: Create `src/config/organization.ts`**

```ts
// Single source of truth for all name/address/phone (NAP) data.
// Rendered identically wherever these facts appear: footer, contact page,
// schema.org JSON-LD. Changing a value here changes it everywhere.

export const organization = {
  name: "Ski-Hi Stampede",
  legalName: "San Luis Valley Ski-Hi Stampede",
  tagline: "Colorado's Oldest Pro Rodeo",
  foundingYear: 1919,
  prcaNominations: 4,
  volunteerCount: 200,
  annualAttendance: 10000,

  venue: {
    name: "Ski-Hi Complex",
    streetAddress: "2335 Sherman Ave",
    city: "Monte Vista",
    region: "CO",
    postalCode: "81144",
    country: "US",
    latitude: 37.5786,
    longitude: -106.1483,
  },

  ticketOffice: {
    streetAddress: "947 1st Ave",
    city: "Monte Vista",
    region: "CO",
    postalCode: "81144",
    hours: "9:00 AM to 5:00 PM, Monday through Friday",
    opensDate: "2026-06-22",
  },

  mailingAddress: {
    poBox: "PO Box 391",
    city: "Monte Vista",
    region: "CO",
    postalCode: "81144",
  },

  contact: {
    phone: "+1-719-852-2055",
    phoneDisplay: "(719) 852-2055",
    email: "info@skihistampede.com",
  },

  social: {
    facebook: "https://www.facebook.com/skihistampedeinc/",
    instagram: "https://www.instagram.com/skihistampede_rodeo100/",
  },

  // 2027 event dates. Verified from current skihistampede.com.
  nextEvent: {
    startDate: "2027-07-08",
    endDate: "2027-07-11",
    displayDate: "July 8 to 11, 2027",
  },
} as const;

export type Organization = typeof organization;
```

- [ ] **Step 2: Create `src/config/ticketing.ts`**

```ts
// Ticketing configuration. The site reads these values to decide how to
// render Buy Tickets CTAs and the /tickets page embed slot.
//
// Modes:
//   placeholder: show a styled "SeatMaxx embed loads here" block and
//                static pricing content. No external links clicked.
//   embed:       inject the real SeatMaxx <script> and let it render.
//   link:        render a plain Buy Tickets CTA pointing at buyTicketsUrl.

export type TicketingMode = "placeholder" | "embed" | "link";

export interface TicketingConfig {
  mode: TicketingMode;
  buyTicketsUrl: string;
  embedScriptSrc: string;
  embedContainerId: string;
  embedAttributes: Readonly<Record<string, string>>;
  perEventUrls: Readonly<Record<string, string>>;
}

export const ticketing: TicketingConfig = {
  mode: "placeholder",
  buyTicketsUrl: "",
  embedScriptSrc: "",
  embedContainerId: "",
  embedAttributes: {},
  perEventUrls: {
    "rodeo-thursday": "",
    "rodeo-friday": "",
    "rodeo-saturday": "",
    "rodeo-sunday": "",
    "parade": "",
    "mutton-busting": "",
  },
};
```

- [ ] **Step 3: Create `src/config/site.ts`**

```ts
// Site-wide configuration not tied to the organization or ticketing.

export const site = {
  // Flip to true at launch. When false, every page sets noindex and
  // robots.txt disallows all crawlers.
  indexable: false,

  // The deployed base URL. Updated when Railway assigns the subdomain.
  baseUrl: "https://skihi-pitch.up.railway.app",

  // Pitch preview banner displayed at the top of every page while
  // indexable is false. Hidden on launch.
  pitchBannerText: "Pitch preview. Items marked [CONFIRM] are placeholder content pending Ski-Hi review.",
} as const;

export type Site = typeof site;
```

- [ ] **Step 4: Create `src/layouts/BaseLayout.astro`**

```astro
---
import "@/styles/global.css";
import { site } from "@config/site";
import { organization } from "@config/organization";

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;

const fullTitle = title ? `${title} | ${organization.name}` : organization.name;
const robotsContent = site.indexable ? "index, follow" : "noindex, nofollow";
---
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content={robotsContent} />
    <title>{fullTitle}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body class="bg-stone-100 text-stone-900 font-sans antialiased">
    {!site.indexable && (
      <div class="bg-yellow-200 text-stone-900 text-sm px-4 py-2 text-center border-b border-yellow-400">
        {site.pitchBannerText}
      </div>
    )}
    <slot />
  </body>
</html>
```

- [ ] **Step 5: Update `src/pages/index.astro` to use `BaseLayout`**

```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import { organization } from "@config/organization";
---
<BaseLayout title="Home" description={`${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`}>
  <main class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold">{organization.name}</h1>
      <p class="mt-4 text-xl">{organization.tagline}</p>
      <p class="mt-2 text-stone-600">{organization.nextEvent.displayDate}</p>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 6: Create `.gitkeep` files for empty tracked directories**

```bash
mkdir -p src/components content public/images
touch src/components/.gitkeep content/.gitkeep public/images/.gitkeep
```

- [ ] **Step 7: Verify dev server renders the updated page**

```bash
npm run dev
```

Expected: pitch-preview yellow banner at top, `Ski-Hi Stampede` H1, `Colorado's Oldest Pro Rodeo` tagline, `July 8 to 11, 2027, Monte Vista, CO.` description. Kill server.

- [ ] **Step 8: Verify production build**

```bash
npm run build
```

- [ ] **Step 9: Commit**

```bash
git add src/ content/ public/
git commit -m "feat: add config stubs and base layout"
```

---

## Task 4: Create GitHub Repo and Push

**Files:**
- Modify: `README.md` (brief project description, pitch note, no-distribute warning)

**Interfaces:**
- Consumes: existing local git repo with 4 commits (spec + 3 scaffold tasks).
- Produces: a private GitHub repo under `bgetz-beep`, this local repo pushed to it.

- [ ] **Step 1: Confirm the active gh account**

```bash
gh auth status
```

Expected: `bgetz-beep` is the active account. If not, run `gh auth switch` first.

**Pause point:** confirm with the user that the repo should be created under `bgetz-beep` and not under a SeatMaxx organization or the other personal account `braxtongetz-bit`. Do not proceed to Step 2 until confirmed.

- [ ] **Step 2: Replace `README.md` with a project-specific description**

```markdown
# Ski-Hi Stampede Pitch Site

Private pitch deliverable from SeatMaxx for the Ski-Hi Stampede
(skihistampede.com) rodeo. Shared via staging URL for Ski-Hi review.

**Not for public distribution.** Robots are disallowed; the staging site
sets `noindex` on every page until explicit launch.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Railway handles deploys from the `main` branch. See
`docs/superpowers/specs/2026-10-07-skihi-pitch-site-design.md` for the
full design spec and `docs/superpowers/plans/` for implementation plans.
```

- [ ] **Step 3: Commit the README update**

```bash
git add README.md
git commit -m "docs: project-specific readme"
```

- [ ] **Step 4: Create the private GitHub repo and push**

```bash
gh repo create skihi-pitch-site --private --source=. --remote=origin --push
```

Expected: new repo at `https://github.com/bgetz-beep/skihi-pitch-site`, all local commits pushed, `origin` remote configured.

- [ ] **Step 5: Verify the push**

```bash
gh repo view --web
```

Opens the repo page. Confirm it shows the files and commits.

- [ ] **Step 6: Verify remote is set correctly**

```bash
git remote -v
git log --oneline
```

Expected: `origin` points to the new repo URL; local and remote log match.

---

## Task 5: Deploy to Railway

**Files:**
- Create: `railway.json`
- Create: `nixpacks.toml`

**Interfaces:**
- Consumes: GitHub repo from Task 4; local Railway CLI logged in as `bgetz@jetaxia.com`.
- Produces: a live deployment URL (typically `*.up.railway.app`) rendering the Task 3 placeholder page.

- [ ] **Step 1: Confirm Railway CLI is logged in**

```bash
railway whoami
```

Expected: `bgetz@jetaxia.com`. If not, run `railway login`.

- [ ] **Step 2: Initialize the Railway project**

From the project root:

```bash
railway init
```

Prompts:
- Project name: `skihi-pitch-site`
- Environment: `production` (default)
- Workspace: pick the user's personal workspace unless told otherwise.

This creates a Railway project linked to the local directory.

- [ ] **Step 3: Create `nixpacks.toml` to control the build**

Astro builds to `dist/` as static files. Railway's default Node.js detection runs `npm start`, which Astro's `minimal` template does not define. We tell Nixpacks to build then serve statically via a simple `serve` command.

```toml
# nixpacks.toml
# Build Astro to dist/, then serve the static output.

[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npx -y serve dist -l $PORT -s"
```

- [ ] **Step 4: Create `railway.json` to document build settings**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx -y serve dist -l $PORT -s",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

- [ ] **Step 5: Commit the Railway config**

```bash
git add railway.json nixpacks.toml
git commit -m "chore: add railway deploy config"
git push
```

- [ ] **Step 6: Trigger the first deploy**

```bash
railway up --detach
```

This uploads the current directory to Railway and builds it. The `--detach` flag returns immediately. Progress is viewable in the Railway dashboard or via `railway logs`.

- [ ] **Step 7: Generate a public domain**

```bash
railway domain
```

Picks a `*.up.railway.app` subdomain. Note the URL.

- [ ] **Step 8: Wait for deploy and verify**

```bash
railway logs --deployment
```

Watch until it reports the service is live. Then open the generated URL in a browser. You should see the pitch-preview banner + `Ski-Hi Stampede` H1.

- [ ] **Step 9: Update `src/config/site.ts` with the real URL**

Replace the placeholder `baseUrl` with the actual Railway URL:

```ts
baseUrl: "https://<the-actual-domain>.up.railway.app",
```

- [ ] **Step 10: Commit and redeploy**

```bash
git add src/config/site.ts
git commit -m "chore: set real railway base url"
git push
railway up --detach
```

- [ ] **Step 11: Verify the live URL again**

Reload the URL. Everything should still render. Note the URL in the plan's deliverables section for later tasks.

---

## Task 6: Fetch Current Site Homepage into Audit

**Files:**
- Create: `content/_audit.md`
- Create: `content/raw/home.md`

**Interfaces:**
- Consumes: nothing new (uses external site).
- Produces: `content/raw/home.md` with homepage content captured; initial `_audit.md` structure.

- [ ] **Step 1: Create the audit directory and index**

```bash
mkdir -p content/raw
```

Create `content/_audit.md` with this skeleton:

```markdown
# Ski-Hi Stampede Content Audit

**Source:** https://www.skihistampede.com/
**Captured:** 2026-10-07
**Purpose:** Single source of truth for every content element we lift,
rewrite, or expand from the current Ski-Hi site. Each page below links
to its raw capture, lists images downloaded, and notes decisions.

## Pages

- [ ] `/` Homepage: see `content/raw/home.md`
- [ ] `/our-sponsors` Sponsors: see `content/raw/sponsors.md`
- [ ] `/events` Events: see `content/raw/events.md`
- [ ] `/asu-scholorship-application` ASU Scholarship: see `content/raw/scholarship.md`
- [ ] `/local-rodeo` Contestants: see `content/raw/contestants.md`
- [ ] `/parade` Parade: see `content/raw/parade.md`
- [ ] `/general-1` Mutton Busting: see `content/raw/mutton-busting.md`
- [ ] `More ▾` dropdown contents: see `content/raw/_more-dropdown.md`

## Social Media

- Facebook: see `content/raw/_facebook.md`
- Instagram: see `content/raw/_instagram.md`

## Images

All downloaded images live under `public/images/raw/`. See the per-page
captures for which image belongs to which page.

## Open Questions

(fill in as discovered)

## Decision Log

(fill in as discovered)
```

- [ ] **Step 2: Fetch the homepage content**

Use the WebFetch tool (if executing via subagent) or `curl` + manual read (if executing inline) to capture the homepage. The desired output is a markdown representation of visible content: headings, paragraphs, button labels, image sources.

If using `curl`:

```bash
curl -sL "https://www.skihistampede.com/" -o /tmp/skihi-home.html
```

Then extract visible content into `content/raw/home.md` with this structure:

```markdown
# /: Homepage

**URL:** https://www.skihistampede.com/
**Captured:** 2026-10-07

## Sections (in order)

### Hero
- Image: [URL]
- Alt text: (none)
- Heading: "Welcome to the Ski Hi Stampede - 104 Years of Unforgettable Rodeo Action and Western Tradition!"
- CTA: "Buy Tickets" linking to https://skihistampede.rodeoticket.com/rodeos/slv-ski-hi-stampede/2026/tickets

### Who We Are
- Image: [URL]
- Heading: "WHO WE ARE."
- Body: "The San Luis Valley Ski Hi Stampede Rodeo was founded in 1919..." (full text verbatim)

(continue for every section visible)

## Images Referenced

- (list every <img src> URL)

## Links Found

- (list every <a href> URL)

## Observations
- Platform: Wix
- Ticketing provider: RodeoTicket subdomain
- No visible analytics
- (anything else notable)
```

- [ ] **Step 3: Mark homepage done in `_audit.md`**

Change `- [ ] /` to `- [x] /` in `_audit.md`.

- [ ] **Step 4: Commit**

```bash
git add content/
git commit -m "content: capture homepage audit"
```

---

## Task 7: Fetch All Nav-Linked Pages into Audit

**Files:**
- Create: `content/raw/sponsors.md`
- Create: `content/raw/events.md`
- Create: `content/raw/scholarship.md`
- Create: `content/raw/contestants.md`
- Create: `content/raw/parade.md`
- Create: `content/raw/mutton-busting.md`
- Modify: `content/_audit.md`

**Interfaces:**
- Consumes: Task 6's `_audit.md` structure and the `content/raw/home.md` pattern.
- Produces: a per-page markdown capture for every nav-linked page, each following the Task 6 template structure.

- [ ] **Step 1: Fetch sponsors page**

```bash
curl -sL "https://www.skihistampede.com/our-sponsors" -o /tmp/skihi-sponsors.html
```

Extract content into `content/raw/sponsors.md` following the Task 6 template. Capture every sponsor logo URL and name. Note tier structure if visible.

- [ ] **Step 2: Fetch events page**

```bash
curl -sL "https://www.skihistampede.com/events" -o /tmp/skihi-events.html
```

Extract into `content/raw/events.md`. Capture performer bios, event descriptions, nightly schedule.

- [ ] **Step 3: Fetch scholarship page**

```bash
curl -sL "https://www.skihistampede.com/asu-scholorship-application" -o /tmp/skihi-scholarship.html
```

Extract into `content/raw/scholarship.md`.

- [ ] **Step 4: Fetch contestants page**

```bash
curl -sL "https://www.skihistampede.com/local-rodeo" -o /tmp/skihi-contestants.html
```

Extract into `content/raw/contestants.md`.

- [ ] **Step 5: Fetch parade page**

```bash
curl -sL "https://www.skihistampede.com/parade" -o /tmp/skihi-parade.html
```

Extract into `content/raw/parade.md`.

- [ ] **Step 6: Fetch mutton busting page**

```bash
curl -sL "https://www.skihistampede.com/general-1" -o /tmp/skihi-mutton-busting.html
```

Extract into `content/raw/mutton-busting.md`.

- [ ] **Step 7: Mark pages done in `_audit.md`**

Flip all six checkboxes to `[x]`.

- [ ] **Step 8: Commit**

```bash
git add content/
git commit -m "content: capture six nav-linked pages"
```

---

## Task 8: Audit "More ▾" Dropdown Contents

**Files:**
- Create: `content/raw/_more-dropdown.md`
- Modify: `content/_audit.md`
- Possibly modify: `docs/superpowers/specs/2026-10-07-skihi-pitch-site-design.md` (IA section) if new page types are discovered.

**Interfaces:**
- Consumes: a browser session on skihistampede.com; the design spec IA.
- Produces: a documented list of every page reachable via the "More ▾" dropdown, with per-page captures following the Task 6 template for any that are novel.

- [ ] **Step 1: Open skihistampede.com in a browser and inspect the More ▾ menu**

Hover or click "More ▾" in the nav. List every item. For each item, note:
- Label
- Href
- Whether it's a page we already captured (link duplicate), a page type we already have (another events page), or something new (e.g., merch store, volunteer signup, archive).

Record findings in `content/raw/_more-dropdown.md`:

```markdown
# "More ▾" Dropdown Contents

**Captured:** 2026-10-07
**Source:** https://www.skihistampede.com/ (hover "More ▾" in top nav)

## Items

| Label | Href | Already captured? | Novel content? |
|---|---|---|---|
| (item 1) | (url) | yes/no | yes/no |
| (item 2) | (url) | yes/no | yes/no |
| ... | | | |

## Novel pages (require their own capture)

(if any: follow the Task 6 template for each)

## IA impact

- (does the spec IA need an additional route added? If yes, note which.)
- (does any existing planned route need to be renamed or split? If yes, note which.)
```

- [ ] **Step 2: For each novel page in the dropdown, fetch and capture it**

Use `curl -sL <url>` and create `content/raw/<slug>.md` following the Task 6 template.

- [ ] **Step 3: If the IA needs changes, amend the design spec**

Open `docs/superpowers/specs/2026-10-07-skihi-pitch-site-design.md`, update section 3 (Information Architecture) with the newly discovered pages, and add a one-line note at the bottom of section 3 like:

```markdown
*Amended 2026-10-07 post-content-audit: added `/merch` and `/volunteer` to IA based on "More ▾" dropdown contents.*
```

- [ ] **Step 4: Mark the dropdown item done in `_audit.md`**

Flip `- [ ] More ▾ dropdown contents` to `- [x]`.

- [ ] **Step 5: Commit**

If the spec was amended, make it a separate commit for clarity:

```bash
git add docs/superpowers/specs/2026-10-07-skihi-pitch-site-design.md
git commit -m "docs: amend IA to reflect More dropdown contents"
git add content/
git commit -m "content: capture More dropdown audit"
```

If no spec changes:

```bash
git add content/
git commit -m "content: capture More dropdown audit"
```

---

## Task 9: Download All Referenced Images

**Files:**
- Create: `public/images/raw/*` (one file per source image)
- Create: `scripts/download-images.sh` (helper script, kept for reproducibility)
- Modify: `content/_audit.md` (add image count summary)

**Interfaces:**
- Consumes: image URLs collected across `content/raw/*.md` from Tasks 6-8.
- Produces: every image used on the current Ski-Hi site, downloaded locally under `public/images/raw/`, named deterministically (page-slug + sequence number + original extension).

- [ ] **Step 1: Collect every unique image URL from the audit**

Grep across `content/raw/*.md` for `wixstatic.com` URLs and any other image hosts. Deduplicate.

```bash
grep -hEo 'https://static\.wixstatic\.com/[^ )]+' content/raw/*.md | sort -u > /tmp/image-urls.txt
wc -l /tmp/image-urls.txt
```

- [ ] **Step 2: Create the download helper script**

`scripts/download-images.sh`:

```bash
#!/usr/bin/env bash
# Download every image URL in /tmp/image-urls.txt to public/images/raw/
# Named by sequential index + original extension inferred from URL.
set -euo pipefail

mkdir -p public/images/raw
i=0
while IFS= read -r url; do
  i=$((i + 1))
  ext="${url##*.}"
  ext="${ext%%\?*}"
  if [ "${#ext}" -gt 5 ]; then ext="jpg"; fi
  padded=$(printf '%03d' "$i")
  out="public/images/raw/img-${padded}.${ext}"
  echo "Downloading $url to $out"
  curl -sL "$url" -o "$out"
done < /tmp/image-urls.txt
echo "Downloaded $i images."
```

- [ ] **Step 3: Run the download**

```bash
chmod +x scripts/download-images.sh
./scripts/download-images.sh
ls -la public/images/raw/ | head
```

Expected: `public/images/raw/img-001.jpg`, `img-002.jpg`, etc. Count should match the line count from Step 1.

- [ ] **Step 4: Cross-reference images back to pages in each `content/raw/*.md`**

For each page capture, add a `## Downloaded Images` section at the bottom mapping local filenames to original URLs:

```markdown
## Downloaded Images

- `public/images/raw/img-001.jpg` <= https://static.wixstatic.com/.../cody-fire.jpg (hero)
- `public/images/raw/img-002.jpg` <= https://static.wixstatic.com/.../program-bronc.jpg (section)
```

- [ ] **Step 5: Add image count summary to `_audit.md`**

Under the `## Images` section of `_audit.md`:

```markdown
## Images

Total downloaded: <count>. All stored under `public/images/raw/`.
See per-page captures for the filename-to-page mapping. Images are
re-processed (optimized, resized) in Plan 2 (Design System).
```

- [ ] **Step 6: Commit**

```bash
git add scripts/ public/images/ content/
git commit -m "content: download all current site images"
```

Note: these are reused by permission (we are building for Ski-Hi). The commit message does not need to repeat that.

---

## Task 10: Capture Public Social Media Imagery

**Files:**
- Create: `content/raw/_facebook.md`
- Create: `content/raw/_instagram.md`
- Create: `public/images/raw/social/*` (images saved from each platform)
- Modify: `content/_audit.md`

**Interfaces:**
- Consumes: public Facebook and Instagram pages (anti-scrape protections apply).
- Produces: a documented catalogue of what imagery is available from each platform, with select images saved locally where reliably obtainable.

- [ ] **Step 1: Visit the Facebook page**

Open `https://www.facebook.com/skihistampedeinc/` in a browser. Note:
- Cover photo URL
- Profile photo URL
- Any pinned post images
- Up to 10 recent photo-post images

Record in `content/raw/_facebook.md`:

```markdown
# Facebook: Ski-Hi Stampede Inc

**URL:** https://www.facebook.com/skihistampedeinc/
**Captured:** 2026-10-07
**Access notes:** Facebook pages are JS-rendered. `curl` yields minimal
HTML. Manual browser capture used instead.

## Available imagery

(list every photo noted, with a short description and the direct image URL if obtainable)

## Downloaded

- `public/images/raw/social/fb-cover.jpg` (saved manually from browser)
- `public/images/raw/social/fb-profile.jpg`
- ...

## Not downloaded (available but we chose not to grab)

- (any high-quality shots we noted but didn't save)
```

- [ ] **Step 2: Save usable images from Facebook**

Right-click photos in the browser, "Save image as", drop into `public/images/raw/social/` with filenames prefixed `fb-`.

- [ ] **Step 3: Visit the Instagram page**

Open `https://www.instagram.com/skihistampede_rodeo100/`. Instagram is also JS-rendered and increasingly gated. If accessible without login, note the grid: profile photo, highlighted stories, grid thumbnails for ~20 recent posts.

Record in `content/raw/_instagram.md` using the same template structure as Facebook.

- [ ] **Step 4: Save usable images from Instagram**

Where images are accessible, save to `public/images/raw/social/` with filenames prefixed `ig-`.

If Instagram is login-gated and provides nothing useful, note that in the markdown and move on. The current site provides enough imagery; social is a nice-to-have.

- [ ] **Step 5: Update `_audit.md`**

Under the `## Social Media` section:

```markdown
## Social Media

- Facebook: see `content/raw/_facebook.md`. <N> images downloaded.
- Instagram: see `content/raw/_instagram.md`. <N> images downloaded (or "login-gated, no images obtained").
```

- [ ] **Step 6: Commit**

```bash
git add content/ public/images/raw/social/
git commit -m "content: capture available social media imagery"
```

---

## Task 11: Finalize Audit Document

**Files:**
- Modify: `content/_audit.md`
- Modify: `src/config/organization.ts` (fill in any newly verified facts)

**Interfaces:**
- Consumes: everything from Tasks 6-10.
- Produces: a complete `_audit.md` with every page checkbox marked, image count filled in, open questions listed, and decision log populated. `organization.ts` updated with any facts confirmed during the audit.

- [ ] **Step 1: Verify every page checkbox is marked done**

Open `content/_audit.md`. All page checkboxes should be `[x]`. If any are still `[ ]`, go back and complete them.

- [ ] **Step 2: Populate the `Open Questions` section**

List any content gaps discovered during the audit that need Ski-Hi to answer before launch. Common ones:
- 2027 performer booking confirmation (bull riders, barrel racers, specialty acts)
- Current sponsor tier assignments (title/gold/silver/bronze)
- Grand marshal for parade (if not announced on current site)
- Scholarship recipient names and photos
- Ticket pricing for 2027 (current site has 2026 prices)

Format:

```markdown
## Open Questions

| # | Question | Blocks | Who answers |
|---|---|---|---|
| 1 | 2027 performer lineup confirmed? | /events page | Ski-Hi |
| 2 | Sponsor tier structure (title/gold/silver/bronze) correct? | /sponsors page | Ski-Hi |
| ... | | | |
```

- [ ] **Step 3: Populate the `Decision Log` section**

List any decisions made during the audit, with reasoning. Examples:

```markdown
## Decision Log

- 2026-10-07: Keep Wix image downloads at original resolution. Re-optimize via Astro `<Image />` in Plan 2 rather than pre-processing now.
- 2026-10-07: Instagram access was login-gated. Social imagery relies on Facebook captures only. Design system should not depend on IG assets.
- 2026-10-07: "More ▾" dropdown contained X, Y, Z. IA was/was-not amended (see commit <sha>).
```

- [ ] **Step 4: Update `src/config/organization.ts` with any newly confirmed facts**

The audit may surface facts the stub config did not have exact values for. Update them. Common ones:
- Exact tagline wording (if subtly different from stub)
- Exact nomination count (currently assumed 4)
- Exact year of founding (currently 1919)
- Exact phone format
- Correct 2027 dates (currently 2027-07-08 to 2027-07-11)

Any fact that is in the current site content takes precedence over the stub.

- [ ] **Step 5: Verify project still builds**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add content/_audit.md src/config/organization.ts
git commit -m "content: finalize audit and update verified facts"
```

---

## Task 12: Final Verification and Deploy

**Files:** none (verification only)

**Interfaces:**
- Consumes: everything from Tasks 1-11.
- Produces: a confirmed-working Railway deployment showing the placeholder, with the full audit complete locally and in GitHub.

- [ ] **Step 1: Verify local build is clean**

```bash
rm -rf dist/
npm run build
```

Expected: no errors, no warnings.

- [ ] **Step 2: Verify preview matches dev**

```bash
npm run preview
```

Open the preview URL. Confirm the pitch-preview banner renders and the H1 is correct.

- [ ] **Step 3: Push latest commits**

```bash
git status  # should show "nothing to commit, working tree clean"
git push
```

- [ ] **Step 4: Trigger Railway redeploy**

```bash
railway up --detach
railway logs --deployment
```

Watch logs until deploy completes successfully.

- [ ] **Step 5: Visit the production URL**

Confirm the Railway URL still works and shows the latest version.

- [ ] **Step 6: Write a one-paragraph summary at the bottom of `_audit.md`**

```markdown
## Plan 1 Complete

**Date:** 2026-10-07
**Railway URL:** <the actual URL>
**GitHub repo:** https://github.com/bgetz-beep/skihi-pitch-site
**Commits in Plan 1:** <N>

Ready for Plan 2 (Design System + Homepage Vertical Slice).
```

- [ ] **Step 7: Commit the summary**

```bash
git add content/_audit.md
git commit -m "docs: mark plan 1 complete"
git push
```

---

## Spec Coverage Check

| Spec section | Covered by | Notes |
|---|---|---|
| 2. Non-Goals (no email, no analytics, no CMS, static-only) | Tasks 1-3 (no deps added for any of these) | Enforced structurally by not adding libraries |
| 3. Information Architecture | Tasks 7-8 (page audit, dropdown discovery) | Spec amended if dropdown reveals new routes |
| 4. Visual System (anti-AI, no em-dashes) | Global Constraints | Enforced at task-level in future plans; placeholder page is intentionally plain |
| 5. Content Strategy (audit, image handling, voice) | Tasks 6-11 | Audit output drives Plan 2's content decisions |
| 6. SeatMaxx Integration Pattern (config shape) | Task 3 (`ticketing.ts` stub) | Default mode `placeholder`, URL slots empty |
| 7. SEO Strategy (robots gate, canonical, site config) | Task 3 (`site.ts` + `BaseLayout` robots meta) | Full SEO hardening in Plan 4 |
| 8. AEO Strategy | Not covered in Plan 1 | Plan 4 |
| 9. Phase Plan (phases 0 and 1 of 9) | All tasks | Phase 2+ in future plans |

**Deferred to later plans:**
- Visual system (Plan 2)
- Homepage build (Plan 2)
- All other pages (Plan 3)
- SeatMaxx embed component (Plan 3)
- SEO hardening (Plan 4)
- AEO content (Plan 4)
- QA + launch (Plan 4)

Plan 1 is foundational and content-gathering only. It intentionally defers all design and page work.
