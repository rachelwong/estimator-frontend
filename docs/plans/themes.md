# Themes: Play & Work

Nav switch flips between two visual themes. Styling, imagery and copy only. No change to behaviour, routes, socket, API, favicon or `<title>`.

| Switch | Theme  | Label  | Source                                                                        |
| ------ | ------ | ------ | ----------------------------------------------------------------------------- |
| off    | `play` | "Play" | Round 6 · Fold and Flip (current build, `DESIGN.md`)                          |
| on     | `work` | "Work" | Round 14 · Night Ledger, as built (`NL-*` boards, spec board `NL-Components`) |

Canvas: https://claude.ai/artifact/B8xUuTAY1pmHCQcMD5FKRc. Switch visuals: Round 10 `S10-Toggle` (Play) and Round 14 header (Work).

---

## Decisions

| #   | Decision                                                                                        | Why                                                                                                                                                                                                                                                          |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | React context: `ThemeProvider` + `useTheme()`                                                   | Copy and imagery swaps need a re-render, so CSS alone can't do it. Theme changes rarely, so one context costs nothing. No store library                                                                                                                      |
| 2   | Not persisted. Every load starts on Play                                                        | It's a display toggle. No localStorage, no pre-paint script. Play values are the `:root` default, so there's no flash                                                                                                                                       |
| 3   | `data-theme="work"` on `<html>` while on                                                        | One selector swaps every role token, reaches raw CSS (keyframes, slider) and portalled content (popovers, dialogs), and drives the `work:` variant                                                                                                           |
| 4   | **No i18n package.** One typed `src/content.ts`                                                 | Themes aren't locales. i18next adds a runtime, string keys and namespaces just to serve 2 variants. A typed object fails the build when a key is missing, which string keys don't. Turning it into per-language i18next resources later is a small transform |
| 5   | **One `CONTENT` object, both versions per entry:** `heading: { play: '…', work: '…' }`         | Any string can differ by theme, in the same place. Both versions sit side by side for hand-editing. `satisfies ContentTree` fails the build when either is missing. Seeded identical; Work copy is written by hand later. `useContent()` returns the current theme's resolved object |
| 6   | **Two-tier tokens, shadcn-style.** Primitives → roles. Themes swap role values, not classes     | shadcn's documented pattern, and the repo is already shadcn (`cssVariables: true`). One class per element (`bg-background`), not a `bg-play-x work:bg-work-y` pair on every colour                                                                         |
| 7   | Primitives are plain `:root` vars, **not** in `@theme`                                          | So `bg-grape-500` can't be written in a component. Components only ever see roles                                                                                                                                                                           |
| 8   | Roles split by job (atomic): one role, one job                                                  | `ink` does text, borders, outlines and dark fills today; `selection` colours both the own Square and primary buttons. In Work those jobs take different colours. Each job gets its own role even where Play's values coincide                              |
| 9   | No component tier (`--button-bg`)                                                               | One consumer each. Revisit only if a role turns out to be used by a single component across both themes                                                                                                                                                    |
| 10  | Fonts, shadows and radii swap as tokens too                                                     | No `font-work-*` utilities, no `work:shadow-*` / `work:rounded-*` sprinkled around. Play: hard offset shadows, radius 0. Work: no shadow on controls and cards, soft drop shadow on floating layers, 6–12px radii                                           |
| 11  | `work:` variant only for what a token can't express: border width, gapless grid, layout, hiding Play-only sprites | Inline classes (no `*_CLASS` constants)                                                                                                                                                                                                       |
| 12  | Every colour on the `NL-*` boards becomes a primitive, kept as drawn                            | The boards are the spec. Near-duplicates are flagged below, not merged. Play tokens with no board equivalent take the nearest existing Work primitive (marked _pick_)                                                                                       |
| 13  | Illustration-only colours stay inside their SVGs                                                | Stroke and guide alphas on the house-rules art (`.45`, `.22`, `.05`) and the Welcome step badges have no UI job. svgs-live-in-sprites already hardcodes hex there                                                                                          |
| 14  | Work fonts lazy-load on first switch; later switches instant                                    | Play-only visitors never download Red Hat. First switch shows fallback text briefly (`font-display: swap`). No hover-preload                                                                                                                                |
| 15  | Work has **no motion** except the switch itself                                                 | Logo shake/flip, change flash, confetti, chatter, Reveal diagonal wave and Feedback tile shake/pop are Play only. Pixel loader → plain bar                                                                                                                  |
| 16  | `color-scheme: dark` under `[data-theme='work']`                                                | Native scrollbars, autofill and form controls match the dark page                                                                                                                                                                                            |
| 17  | Switch in `PageLayout` header, same spot on every screen, every breakpoint                      | Phone: next to the hamburger, not in the menu                                                                                                                                                                                                                |
| 18  | `Theme.PLAY` / `Theme.WORK` in `constants.ts`, type in `types/constants.ts`                     | no-magic-strings. The switch's boolean is derived: `isWorkTheme = theme === Theme.WORK`                                                                                                                                                                     |
| 19  | Copy outside React takes it as an argument or returns a code                                     | Grid helpers (`utils/grid.ts`) and `revealChip` take their content slice. Validation returns a boolean; the page shows `validation.*`. Actions return `{ failure: ActionFailure }` and the page words it. Server error messages pass through unchanged in both themes |
| 20  | Smoke checks test behaviour, never wording                                                       | Copy can now change per theme and by hand. Checks that only confirmed words are gone; behaviour checks use `aria-invalid`, `data-square`, `aria-pressed`, h1 count, URLs and hrefs. Buttons and links are still found by their accessible name, so renaming one of those means updating its selector |

---

## Tokens

### Wiring

```css
:root {
  /* tier 1: primitives (Play + Work), never in @theme */
  --plum-950: #1e1b2e;  --cream: #fff6e5;  …
  --night-900: #11161a; --steel-100: #e8edf1; …

  /* tier 2: roles, Play values */
  --background: var(--cream);
  --foreground: var(--plum-950);
  --shadow-control: 4px 4px 0 var(--plum-950);
  --radius-control: 0;
  --font-display: 'Bungee', sans-serif;
  …
}
[data-theme='work'] {
  color-scheme: dark;
  --background: var(--night-900);
  --foreground: var(--steel-100);
  --shadow-control: none;
  --radius-control: 6px;
  --font-display: 'Red Hat Display', sans-serif;
  …
}
@theme inline {
  --color-background: var(--background);
  --shadow-control: var(--shadow-control);
  --radius-control: var(--radius-control);
  …
}
@custom-variant work (&:where([data-theme='work'], [data-theme='work'] *));
```

### Primitives — Play

Today's palette, renamed by hue.

| Primitive   | Hex       | Was            |
| ----------- | --------- | -------------- |
| `plum-950`  | `#1E1B2E` | `ink`          |
| `plum-800`  | `#3E3852` | `text-muted`   |
| `plum-700`  | `#5B5570` | `text-subtle`  |
| `plum-300`  | `#C9C3DA` | `on-ink-muted` |
| `grape-50`  | `#F2EDFF` | `crowd-0`      |
| `grape-100` | `#DCD3FB` | `page-top`     |
| `grape-200` | `#C9BCF7` | `crowd-1`      |
| `grape-400` | `#8E77F2` | `crowd-2`      |
| `grape-500` | `#6A4FF0` | `accent`       |
| `grape-600` | `#5A3FD6` | `crowd-3`      |
| `grape-900` | `#2A1F5C` | `crowd-4`      |
| `cream`     | `#FFF6E5` | `cream`        |
| `butter`    | `#FFE8A8` | `butter`       |
| `mint-100`  | `#D7F2E4` | `copied`       |
| `mint-400`  | `#4CC38A` | `chrome-green` |
| `sun-400`   | `#FFC53D` | `selection`    |
| `coral-400` | `#FF5A5F` | `danger`       |
| `brick-700` | `#B42318` | `abstained`    |
| `white`     | `#FFFFFF` | `white`        |

### Primitives — Work

Swept from all 14 `NL-*` boards.

| Primitive          | Value                     | Board job                                                     |
| ------------------ | ------------------------- | ------------------------------------------------------------- |
| `night-950`        | `#0B0F12`                 | Header, menu sheet, text on yellow buttons and tooltip         |
| `night-900`        | `#11161A`                 | Page, inputs, link field                                      |
| `night-850`        | `#161C21`                 | Empty Square                                                  |
| `night-800`        | `#171D22`                 | Cards, dialog, share bar                                      |
| `night-700`        | `#1F262C`                 | Raised: description, axis strips, admin bar, popover, row hover, progress track |
| `night-600`        | `#2A333B`                 | Secondary button hover, unfilled range track                   |
| `steel-100`        | `#E8EDF1`                 | Text, tooltip background, range thumb, Square hover ring       |
| `steel-200`        | `#C8D3DD`                 | Header nav, icon buttons                                      |
| `steel-300`        | `#A9B4BE`                 | Muted text                                                    |
| `steel-400`        | `#8794A0`                 | Dim text, placeholder, axis numbers, icons                     |
| `sky-200`          | `#7CC4E8`                 | Crowd 4+                                                      |
| `sky-250`          | `#7CC0E0`                 | Links, selected slider tick                                   |
| `sky-400`          | `#5FB2D6`                 | Focus outline, field focus border, caret, section accent bars  |
| `sky-600`          | `#1F7AAD`                 | Primary button, "You" Square, range fill, loader bar, `::selection` |
| `sky-650`          | `#297BA4`                 | Crowd 3                                                       |
| `sky-700`          | `#186A98`                 | Primary hover                                                 |
| `sky-720`          | `#0D7DAE`                 | Switch track hover                                            |
| `sky-750`          | `#0B6E99`                 | Switch track                                                  |
| `sky-800`          | `#245F7D`                 | Crowd 2                                                       |
| `sky-900`          | `#1D3A4A`                 | Crowd 1                                                       |
| `sky-925`          | `#1B2E3A`                 | Area                                                          |
| `sky-975`          | `#0B2230`                 | Text on crowd 4+                                              |
| `amber-400`        | `#F2B134`                 | Mark: logo slash, knob glyph, yellow CTAs                      |
| `amber-500`        | `#E3A21F`                 | Yellow CTA hover                                              |
| `red-300`          | `#FF9592`                 | Error text and icon                                           |
| `red-500`          | `#E5484D`                 | Invalid field border                                          |
| `steel-100-a08`    | `rgba(232,237,241,.08)`   | Card borders, grid lines, dividers                            |
| `steel-100-a16`    | `rgba(232,237,241,.16)`   | Fields, chips, grid frame, dialog, popover, dashed Abstained   |
| `steel-100-a32`    | `rgba(232,237,241,.32)`   | Chip and field hover border                                   |
| `steel-100-a40`    | `rgba(232,237,241,.40)`   | Selected (expanded) chip border                               |
| `white-a06`        | `rgba(255,255,255,.06)`   | Header bottom border, ghost hover background                  |
| `white-a20`        | `rgba(255,255,255,.20)`   | Ghost and icon button border                                  |
| `white-a25`        | `rgba(255,255,255,.25)`   | Loader track inside a button                                  |
| `sky-400-a22`      | `rgba(95,178,214,.22)`    | Field focus halo (`0 0 0 3px`)                                |
| `sky-600-a14`      | `rgba(31,122,173,.14)`    | Selected radio row                                            |
| `red-500-a10`      | `rgba(229,72,77,.10)`     | Error notice background                                       |
| `red-300-a35`      | `rgba(255,149,146,.35)`   | Error notice border                                           |
| `scrim`            | `rgba(5,8,10,.72)`        | Dialog and menu scrim                                         |

Flagged near-duplicates, kept as drawn: `night-850`/`night-800`, `sky-925`/`sky-900`, `sky-250`/`sky-200`, header border `white-a06` vs dividers `steel-100-a08`, two text whites (`white` vs `steel-100`), two blue families (switch `sky-750/720` vs buttons `sky-600/700`).

### Roles — colour

"today" = the Play value the element uses now, confirmed per use in phase 2.

| Role                         | Job                                              | Play         | Work            |
| ---------------------------- | ------------------------------------------------ | ------------ | --------------- |
| `background`                 | Page                                             | `cream`      | `night-900`     |
| `foreground`                 | Body and heading text                            | `plum-950`   | `steel-100`     |
| `muted-foreground`           | Secondary copy                                   | `plum-800`   | `steel-300`     |
| `subtle-foreground`          | Labels, hints, axis numbers                      | `plum-700`   | `steel-400`     |
| `placeholder`                | Input placeholder                                | today        | `steel-400`     |
| `card`                       | Windows, cards, dialog, share bar                | `white`      | `night-800`     |
| `input`                      | Field background                                 | `white`      | `night-900`     |
| `raised`                     | Description panel, axis strips, admin bar, popover | `white`    | `night-700`     |
| `row-hover`                  | List-row hover                                   | today        | `night-700`     |
| `header`                     | Header background                                | today        | `night-950`     |
| `header-border`              | Header bottom rule                               | `plum-950`   | `white-a06`     |
| `nav-foreground`             | Header links, icon buttons                       | `plum-950`   | `steel-200`     |
| `inverse`                    | Dark notice, tooltip in Play                     | `plum-950`   | `steel-100`     |
| `inverse-foreground`         | Text on `inverse`                                | `cream`      | `night-950`     |
| `inverse-muted`              | Secondary text on `inverse`                      | `plum-300`   | `steel-300` _pick_ |
| `page-top`                   | Welcome top band                                 | `grape-100`  | `night-900` _pick_ |
| `border`                     | Fields, chips, grid frame, dialog, popover       | `plum-950`   | `steel-100-a16` |
| `border-subtle`              | Card borders, grid lines, dividers               | `plum-950`   | `steel-100-a08` |
| `border-hover`               | Chip and field hover                             | `plum-950`   | `steel-100-a32` |
| `border-selected`            | Selected chip                                    | `plum-950`   | `steel-100-a40` |
| `ghost-border`               | Ghost and icon buttons                           | `plum-950`   | `white-a20`     |
| `ghost-hover`                | Ghost button hover                               | today        | `white-a06`     |
| `ring`                       | Focus outline                                    | `plum-950`   | `sky-400`       |
| `ring-halo`                  | Field focus halo                                 | none         | `sky-400-a22`   |
| `primary`                    | Window title bars, CTA band, accent text         | `grape-500`  | `sky-600`       |
| `action`                     | Primary buttons                                  | `sun-400`    | `sky-600`       |
| `action-hover`               | Primary button hover                             | `sun-400`    | `sky-700`       |
| `action-foreground`          | Text on primary buttons                          | `plum-950`   | `white`         |
| `secondary-hover`            | Secondary button hover                           | today        | `night-600`     |
| `emphasis`                   | The one decisive CTA ("End session & reveal", "Start a new session"), everywhere it appears: header, admin bar, dialog, every breakpoint. The boards' blue instances (Active-Confirm header, Active-Mobile) are overruled | `coral-400` / today | `amber-400` |
| `emphasis-hover`             | Hover on `emphasis`                              | today        | `amber-500`     |
| `emphasis-foreground`        | Text on `emphasis`                               | `plum-950`   | `night-950`     |
| `link`                       | Inline links                                     | `grape-500`  | `sky-250`       |
| `link-hover`                 | Inline link hover                                | `grape-500`  | `steel-100`     |
| `selection`                  | The Participant's own Square                     | `sun-400`    | `sky-600`       |
| `selection-ring`             | Ring on own / hovered Square                     | `plum-950`   | `steel-100`     |
| `option-selected`            | Selected radio row                               | today        | `sky-600-a14`   |
| `range-track`                | Unfilled slider track                            | `grape-50`   | `night-600`     |
| `range-fill`                 | Filled slider track                              | `grape-500`  | `sky-600`       |
| `progress`                   | Loader fill                                      | `grape-500`  | `sky-600`       |
| `progress-track`             | Loader track                                     | today        | `night-700`     |
| `destructive`                | Invalid field border                             | `coral-400`  | `red-500`       |
| `error-foreground`           | Error message text and icon                      | today        | `red-300`       |
| `error-surface`              | Error notice background                          | today        | `red-500-a10`   |
| `error-border`               | Error notice border                              | today        | `red-300-a35`   |
| `abstained`                  | The word "Abstained"                             | `brick-700`  | `red-300` _pick_ |
| `success`                    | "Copied!", live chip                             | `mint-100`   | `night-700` _pick_ |
| `scrim`                      | Behind dialog and mobile menu                    | today        | `scrim`         |
| `area`                       | Area under the Selection (Active)                | `grape-200`  | `sky-925`       |
| `crowd-0` … `crowd-4`        | Reveal ramp                                      | `grape-50`, `grape-200`, `grape-400`, `grape-600`, `grape-900` | `night-850`, `sky-900`, `sky-800`, `sky-650`, `sky-200` |
| `crowd-foreground`           | Text on crowd 0–2                                | `plum-950`   | `steel-100`     |
| `crowd-3-foreground`         | Text on crowd 3                                  | `white`      | `white`         |
| `crowd-4-foreground`         | Text on crowd 4                                  | `white`      | `sky-975`       |
| `switch-track`               | Theme switch track                               | `grape-200`  | `sky-750`       |
| `switch-track-hover`         | Theme switch hover                               | `grape-200`  | `sky-720`       |
| `chrome-dot`                 | Window chrome middle dot                         | `mint-400`   | `night-700` _pick_ (Work has no chrome) |
| `tint-butter`                | How-to-use card tint                             | `butter`     | `night-800` _pick_ |

### Roles — shadow, radius, font

| Role              | Job                                  | Play                         | Work                                                    |
| ----------------- | ------------------------------------ | ---------------------------- | ------------------------------------------------------- |
| `shadow-control`  | Buttons, icon buttons                | `4px 4px 0 plum-950`         | none                                                    |
| `shadow-card`     | Cards                                | `6px 6px 0 plum-950`         | none                                                    |
| `shadow-window`   | Windows                              | `8px 8px 0 plum-950`         | none                                                    |
| `shadow-float`    | Popover, tooltip, dark notice        | `4px 4px 0 grape-500`        | `0 16px 40px rgba(0,0,0,.45)`                           |
| `shadow-bar`      | Admin bar                            | today                        | `0 2px 4px rgba(0,0,0,.3), 0 16px 40px rgba(0,0,0,.5)`  |
| `shadow-menu`     | Mobile menu                          | today                        | `0 24px 48px rgba(0,0,0,.5)`                            |
| `shadow-dialog`   | End-session dialog                   | today                        | `0 24px 64px rgba(0,0,0,.55)`                           |
| `shadow-knob`     | Switch knob                          | none                         | `0 1px 2px rgba(0,0,0,.3)`                              |
| `shadow-area-preview` | Area preview on hover            | `primary` 15% inset          | `primary` 15% inset                                     |
| `radius-control`  | Buttons, fields, chips, tooltip, grid frame | 0                     | 6px                                                     |
| `radius-panel`    | Description panel, popover, notice   | 0                            | 8px                                                     |
| `radius-bar`      | Admin bar, Welcome cards             | 0                            | 10px                                                    |
| `radius-card`     | Cards, dialog                        | 0                            | 12px                                                    |
| `radius-strip`    | Axis strips                          | 0                            | 4px                                                     |
| `radius-track`    | Range, progress, swatches            | 0                            | 2px                                                     |
| `font-display`    | Headlines, numerals, wordmark        | Bungee 400                   | Red Hat Display 500 (600 numerals, 700 logo)            |
| `font-body`       | Sentences, UI                        | Figtree 400–800              | Red Hat Text 400 / 500 / 600                            |
| `font-label`      | Short interface labels               | Silkscreen 400               | Red Hat Text 500 _pick_                                 |

Squares stay radius 0 in both. Pills (switch 999px, knob 50%) are fixed shapes, not tokens. Lazy font set: Display 500/600/700, Text 400/500/600 (the boards ask for Text 700 once; it's synthesised, so it isn't loaded).

---

## Shape

```
src/
  content.ts                 CONTENT: every entry { play, work }, grouped by screen          ✓
  types/content.ts           ThemeVariants, ContentTree, ResolvedContent, Content            ✓
  types/theme.ts             ThemeContextValue                                               ✓
  constants.ts               + Theme, ActionFailure                                          ✓
  lib/themeContext.ts        the React context                                               ✓
  components/
    ThemeProvider.tsx        useState(Theme.PLAY), sets <html data-theme>                    ✓ (fonts: phase 3)
    ThemeSwitch.tsx          role="switch", aria-checked, label + aria-label from content    ✓ (plain; styled in phase 3)
  hooks/useTheme.ts          { theme, toggleTheme }                                          ✓
  hooks/useContent.ts        the theme's resolved content (both resolved once at load)       ✓
  utils/content.ts           resolveContent(tree, theme)                                     ✓
  utils/actionError.ts       server message, or the theme's words for an ActionFailure       ✓
  utils/loadWorkFonts.ts     one cached promise of the @fontsource imports
  assets/sprites/work/       Round 14 SVGs (wordmark, house-rule illustrations, knob slash) + Work copies of shared icons
```

---

## Phases

Each phase ships on its own, and each is checked before the next starts (kill servers, run frontend and backend, smoke-test).

1. **Centralise copy + theme state (no visual change).** ✓ Done. `CONTENT` holds every visible string, aria-label, window title, chip, validation and action message, the demo Reveal's names and description, and the crowd chatter, each as `{ play, work }`. Counts and positions are functions; inline emphasis and links are HTML parsed with `html-react-parser`. Copy that left `constants.ts`: `POINT_SYSTEM_LABEL`, `SELECTION_LABEL`, `AXIS_LABEL`, `REVEAL_NOTICE_BODY`, `ERROR_SCREEN_COPY`, `WELCOME_DEMO_REVEAL`, `WELCOME_DEMO_DESCRIPTION`, `CROWD_CHATTER_LINES`. Pulled forward from phase 3 so the swap can be seen: `Theme`, `ThemeProvider` around `RouterProvider`, `useTheme`, and a plain `ThemeSwitch` in `PageLayout`. Not moved: server error messages (they come from the backend), `index.html` meta. Smoke suite rewritten to test behaviour only (decision 20), plus a switch check: starts on Play, flips `aria-checked` and `<html data-theme>`, reload returns to Play.
2. **Two-tier tokens, Play only (no visual change).** Add Play primitives and every role above with its Play value (resolve each "today"); map roles in `@theme inline`; drop the old `@theme` names. Assign each existing use to a role: `ink` (77 uses), `white` (24), `selection` (6) and `accent` (9) all split by job. Shadows and radii move onto their roles. Raw CSS in `index.css` (keyframes, slider) moves onto roles. Update the hex comments in sprites. Update `DESIGN.md` §2, §4 and §11 to the role names.
3. **Switch look + fonts.** The plumbing landed in phase 1; what's left is lazy Work fonts and styling the switch. Play look: pill, lavender track, spade knob, Silkscreen "Play". Work look: Round 14 pill, "Work". Work doesn't look right yet. That's expected. Verify `cn` merges classes carrying the `work:` variant without dropping any.
4. **Work tokens + layout.** Add Work primitives and the `[data-theme='work']` overrides for every role, plus `color-scheme: dark`. Then walk every screen at 3 breakpoints against the `NL-*` boards and add `work:` classes only where tokens can't reach: borders 3px→1px (dashed stays dashed), gapless grid (G6), header layout, admin bar, popovers and the end-session dialog.
5. **Imagery + motion.** Work: `FOLD / FLIP` wordmark in place of the card lockup. Pixel sprites hidden (hero, team, demo, scatter, dither band). House-rules line illustrations from `NL-HouseRules-*` (their stroke alphas live in the SVGs). Work copies (`sprites/work/`) of every shared icon still visible in Work, starting with `menu`, `close`, `bug`. Swaps go in the component via `useTheme()` (17 files import sprites today). Work SVGs carry hardcoded Work hex (svgs-live-in-sprites). Motion off in Work: logo, change flash, confetti, chatter, Reveal wave, Feedback tile; pixel loader → plain bar.
6. **Document + verify.** `DESIGN.md` gets a "Work theme" section (tokens, type, shape, imagery, no motion) and the pointer at its top is updated. Lint, build, smoke both themes (the switch check landed in phase 1; it reads no copy, per decision 20). Check: a live session survives toggling mid-estimate, first switch loads fonts once, reduced motion, AA contrast on every Work foreground/background role pair.

---

## Out of scope

- Persisting the choice
- Analytics event for the toggle (Vercel custom events need Pro; project is on the free tier)
- Per-theme favicon, `<title>`, OG meta
- Real localisation / languages
- Writing the Work copy (every entry is seeded with the Play text; it's edited by hand in `src/content.ts`)
- Theming server error messages (the backend's wording shows as-is in both themes)
- Auto theme from `prefers-color-scheme`
- Component-tier tokens
- Preloading Work fonts before the first switch
- Merging the flagged near-duplicate Work colours (designer's call, later)
