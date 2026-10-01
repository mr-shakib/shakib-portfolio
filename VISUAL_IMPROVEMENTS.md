# Visual Upgrade & Improvement Plan

> **Status (2026-07-26):** Implemented — 1.1–1.5, 2.1–2.4, 2.6, all §3 items except the
> HallOfFame progress bar, the §4 hero-hover fix, and all §5 items except the OG check.
> Still open (deliberate design decisions): serif usage (2.5), scroll-linked section
> exits (§4), real project screenshots to replace the generated covers (1.1 option 1),
> OG card audit.

An audit of the current design system and page composition, with concrete changes ranked by
impact. File references point at where each change lives.

The identity is already strong — Anton display type, volt `#c6f135` on near-black, the cream
hero, kinetic type, marquees, the pinned Hall of Fame rail. The goal below is not to redesign
but to **tighten**: fix the things that read as unfinished, reduce competing noise, and make
the system consistent everywhere.

---

## 1. High impact — do these first

### 1.1 Replace the `picsum.photos` placeholder covers
`src/components/projects/ProjectCard.tsx:64` falls back to `https://picsum.photos/seed/...`
— random stock photos on a personal portfolio instantly read as "template". Options, best first:

1. Real screenshots/mockups of each project, run through the existing `.img-cinematic`
   treatment (grayscale → color on hover) so they stay on-brand.
2. A generated cover: dark surface + giant outlined project monogram/number + volt accent
   line (you already have `.text-stroke` and the display face — zero assets needed).
3. At minimum, a deterministic gradient per category instead of external photos.

### 1.2 Fix accent-on-cream contrast in the hero
On the cream hero (`#e7e2d4`), volt is used for text: the "Hi, I'm" signature flourish
(`HomeHero.tsx:366`) and the `RoleRotator` (`HomeHero.tsx:98` — `text-accent`). Volt on cream
is roughly 1.6:1 contrast — the rotating role, one of the most important lines on the page, is
the hardest to read. Fix: introduce a dark-olive variant of the accent for light surfaces
(e.g. `--color-accent-ink: #5c6e11` or similar) and use it for text on cream; keep volt for
fills/dots only. Same check applies to the accent underline dots in `StatChip`.

### 1.3 Reduce the hero's competing layers
`HomeHero.tsx` currently stacks: drifting topo field + 2 morphing blobs + 2 counter-rotating
rings + self-drawing constellation + 3 floating chips + parallax name + role rotator + scroll
cue. Each is nice; together they fight the name, which is supposed to be the hero. Suggested
cut: **drop the two dashed rings** (they sit directly behind the type and add the most visual
static) and lower the constellation edge opacity slightly on load-complete. Keep topo + blobs
+ constellation as the three depth layers. Fewer layers will also make the parallax read
cleaner.

### 1.4 Shorten the loader
`src/components/sections/Loader.tsx` runs ~4.2s of steps + 0.8s exit before content appears.
Even once per session, that's a long toll for a portfolio visitor (recruiters bounce fast).
Cut to two steps or reduce the per-step beat from `1.4` to `~0.8` (total ≈ 2s), and start the
hero's own entrance slightly before the panel finishes wiping so the two overlap.

### 1.5 Bridge the cream → dark transition
The jump from the cream hero to the volt marquee to near-black is the harshest cut on the
page. The footer already solves this beautifully with its notched SVG edge
(`Footer.tsx:94-104`). Reuse that idea at the hero's bottom edge (a dark notch rising into
the cream, or the marquee band given an angled/curved top) so the site's one big theme shift
feels designed instead of stacked.

---

## 2. Design-system consistency

### 2.1 Tokenize the hero/light palette
`#16170f` (ink), `#e7e2d4` (cream), `#f3f0e6`, `#ddd8c6`, `#e1dce6`… are hardcoded across
`HomeHero.tsx`, `Navbar.tsx`, `StatChip`, and the footer notch (`#0a0a0a`). Add them to
`globals.css` as `--color-ink`, `--color-cream`, `--color-cream-raised` etc. and expose them
in `tailwind.config.ts`. This makes the light-section palette tunable in one place and stops
the drift that's already visible (three slightly different creams).

### 2.2 Extract an `<Eyebrow>` component
The kicker pattern (`font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent`) is
duplicated ~10× with small inconsistencies — `text-[10px]` vs `[11px]`, `tracking-[0.3em]`
vs `[0.35em]`, accent vs muted. One `<Eyebrow>` in `src/components/shared/` with a
`number`/`label` API ("01 — Research") normalizes all of them.

### 2.3 Make the section numbering coherent
Home currently numbers: Mission `00` → Research `01` → Engineering `02` → Journey `03` →
Toolkit `04` → Contact `05`, but SignatureNote, NumbersBand and PublicationSpotlight sit
between them un-numbered. Either number every full section in visual order or drop the
numbers from all but the "chaptered" ones. Right now it reads as chapters with missing pages.

### 2.4 Standardize the button system
Three different hover grammars coexist:
- `btn-sweep` outline buttons (Lab/Wild sections, footer) — the best one
- `hover:scale-[1.03]` on the ContactCta email button (`ContactCta.tsx:54`)
- `hover:-translate-y-1 + hard shadow` on "Read the paper" (`PublicationSpotlight.tsx:53`)

Pick two tiers and enforce them: **primary** = solid volt with the sweep-to-dark fill,
**ghost** = outlined with `btn-sweep`. Fold this into `ui/Button.tsx` so pages stop
hand-rolling button classes.

### 2.5 Decide what the serif is for
`Instrument Serif` is loaded but used only for two italic words in the footer statement.
Either lean in — italic serif accent words inside the big display headings ("Out in *the
Wild*", "In the *Lab*") is a strong editorial move that would add typographic contrast the
all-caps Anton walls currently lack — or drop the font and save the load. Currently it's a
cost with almost no visible payoff. Same question, milder, for Caveat: it earns its place
(signature moments), keep it.

### 2.6 Off-palette grays
`.text-gradient` in `globals.css:94` fades to `#9ca3af` (Tailwind gray-400) — not one of your
tokens, and slightly blue against the warm `#8a8a85` muted. Point it at
`var(--color-muted)`.

---

## 3. Per-section polish

### Navbar (`src/components/layout/Navbar.tsx`)
- The white hamburger card and volt Resume pill are styled for the cream hero. On dark inner
  pages / after scrolling past the hero, the floating white square looks disconnected. Add a
  scroll-aware state (glass/dark card once past the hero, like the existing `.glass` util).
- There's no wordmark anywhere in the header — on inner pages the brand doesn't appear until
  the footer. A small `SH—` monogram top-left (it already exists in the footer) anchors every
  page and gives a home link above the fold.

### NumbersBand (`src/components/home/NumbersBand.tsx`)
- Solid section. One upgrade: on `md:grid-cols-5` the last-column hairline logic — cells rely
  only on `border-l`, so the grid has no right edge; fine, but the 2-col mobile layout leaves
  the right column un-bordered and slightly ragged. Add `sm:grid-cols-3` intermediate step.

### StackSection (`src/components/home/StackSection.tsx`)
- The absolute row label (`left-gutter top-2`) sits on top of the moving marquee text and
  collides with it at certain scroll positions. Give the label its own hairline strip above
  each band, or a solid chip background.
- Marquee wordmarks at `text-foreground/25` are ghostly to the point of decorative — visitors
  can't actually read your stack. Bump to `/40` and pause the band on hover so items are
  readable and clickable-feeling.

### HallOfFame (`src/components/home/HallOfFame.tsx`)
- On touch/mobile the rail is a plain overflow scroll — add `snap-x snap-mandatory` +
  `snap-start` on cards, and a thin volt progress bar under the rail (you already compute the
  glide distance on desktop) so users know how far along they are.
- The ghost year numeral clips at `-top-6` with no fade; a `mask-image` fade at the card top
  would make the crop look intentional.

### ContactCta (`src/components/home/ContactCta.tsx`)
- The email-as-button label works on desktop but will overflow/wrap awkwardly on ~360px
  screens with `px-8` + `tracking-[0.3em]`. Swap the label to "Say hello" / "Email me" on
  mobile, keep the address visible as plain text below.

### PageHeader / inner pages (`src/components/shared/PageHeader.tsx`)
- Inner pages use a much quieter header than home — good — but they've missed the home page's
  upgrades: no eyebrow numbering, `font-semibold` on Anton (which ignores weight), and no
  outlined-text accent. Give `PageHeader` the same `SplitHeading` treatment (one filled line,
  optional outlined line) so route pages feel like the same site.

### ParticleField (`app/(site)/layout.tsx` + `shared/ParticleField.tsx`)
- A fixed full-viewport canvas repaints every frame for the whole scroll of every page. It's
  well-built (DPR clamp, IO pause), but two visual issues: at `opacity-60` volt lines sit
  behind *reading* sections (SignatureNote's quote, project rows) and compete with body text;
  and it never varies, so it reads as wallpaper by mid-page. Suggest `opacity-40`, plus a
  radial `mask-image` keeping particles denser at the viewport edges and thinner behind the
  content column.

---

## 4. Motion & feel

- **Kinetic name hover** — `HeroWord` letters have `hover:text-accent` per character; with the
  contrast issue (1.2) this also flickers letters to low-contrast volt on cream. Either use
  the ink-accent variant or a `-translate-y` nudge instead of a color swap.
- **Marquee speed on load** — two volt marquees + WordFill + counters all animate within the
  first two viewports. Consider slowing `baseVelocity` on the identity band so the volt strip
  feels premium rather than busy.
- **Scroll-linked exits** — the hero's peel-away (`centerScale`/`centerOpacity`) is great;
  none of the dark sections have an exit treatment, so they just slide off. Even a subtle
  `opacity`/`y` exit on section headings (via one shared wrapper) would carry the hero's
  cinematic feel through the page.
- **Reduced motion** is genuinely well handled everywhere — keep that bar for anything new.

---

## 5. Small fixes & hygiene

| Where | Change |
| --- | --- |
| `globals.css` `.glass` | Uses `rgba(20,20,23,…)` — slightly blue vs the warm neutrals; align with `--color-surface`. |
| `tailwind.config.ts` `darkMode: "class"` | The site is dark-only with `color-scheme: dark`; the class toggle is dead config — remove or actually ship a light theme. |
| `HomeHero` stat chips | `text-[9px]` sub-labels are below comfortable legibility; bump to 10px and loosen tracking. |
| `WildRows` numbers | `.text-stroke` at 1px can disappear on low-DPR screens; use 1.5px for the row numerals. |
| `Loader` | `aria-hidden` on a full-screen blocking element hides progress from AT while still trapping the visual user — add `role="status"` + visually-hidden "Loading" text instead. |
| Favicon/OG | `app/api/og/route.tsx` exists — make sure the OG card uses the volt/ink identity (worth checking before sharing links). |
| `SignatureNote` portrait | Hidden below `md` — on mobile the About beat is text-only. A small inline portrait (even 96px, cinematic-treated) keeps the human element. |

---

## Suggested order of execution

1. **Week 1 (visual credibility):** 1.1 project covers → 1.2 contrast fix → 1.4 loader trim.
2. **Week 2 (cohesion):** 1.5 hero→dark bridge → 2.1 tokens → 2.2/2.3 eyebrow + numbering →
   2.4 buttons → Navbar scroll state + monogram.
3. **Week 3 (polish):** hero layer trim (1.3), StackSection labels, HallOfFame mobile
   snap/progress, PageHeader upgrade, ParticleField masking, motion exits.
