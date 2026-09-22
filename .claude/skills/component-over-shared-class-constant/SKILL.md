---
name: component-over-shared-class-constant
description: In this repo, Tailwind classes are written inline in the JSX, never lifted into a `*_CLASS` constant for reuse. If the same element is styled the same way in more than one file, make it a component with a named prop; otherwise write the classes out at each site. The only class constants that stay are lookup tables a component indexes by a state or variant value — and the component does that indexing, so a `className` prop every caller fills with the same fixed string becomes a `variant` prop instead. Use when about to add a `*_CLASS` constant to src/constants.ts, when a second file wants to import an existing one, when a call site wraps one in `cn(CLASS, "…")` to adjust it, or when giving a component a `className`/`bodyClassName` prop.
---

Tailwind classes belong in the `className` they apply to. Naming a string of them and importing it from `@/constants` hides the styling from the markup and buys nothing — the classes are the same length either way, and the reader now has two files to open.

So there are exactly three answers when styling repeats, and "a constant the caller passes in" is none of them:

| What repeats                             | Answer                                               |
| ---------------------------------------- | ---------------------------------------------------- |
| The same element, in more than one file  | A component with a named prop                        |
| Just some classes, on unlike elements    | Write them out at each site                          |
| A component's own look, fixed per caller | A `variant` prop; the component looks the classes up |

## The same element → a component

If two files import the same `*_CLASS` and drop it on the same tag, what repeats is the element, not the styling — so write the element.

```tsx
// src/routes/WelcomePage/WelcomeSectionHeading.tsx
interface WelcomeSectionHeadingProps {
  text: string;
}

// The h2 at the top of a Welcome page section, on the page's section type scale
// (§3): 27 / 36 / 44, centred at every width.
export function WelcomeSectionHeading({ text }: WelcomeSectionHeadingProps) {
  return (
    <h2 className="text-center font-display text-[27px] leading-[1.05] text-ink tablet:text-[36px] desktop:text-[44px]">
      {text}
    </h2>
  );
}
```

Callers then read `<WelcomeSectionHeading text="House rules" />` instead of `<h2 className={cn(WELCOME_SECTION_HEADING_CLASS, "text-center")}>`.

## Only some classes repeat → write them out

A fragment shared by elements that are otherwise unalike does **not** earn a constant, however many files use it. `WELCOME_GUTTER_CLASS` (`px-5 tablet:px-10 desktop:px-20`) sat on five unrelated `<section>`s and a `<footer>`; it is now written out at all six, and each `cn()` wrapping it collapsed to a plain string. Same for `WELCOME_ANCHOR_CLASS`.

Five copies of `px-5 tablet:px-10 desktop:px-20` is not duplication worth naming — it is what Tailwind looks like. If the page's gutter ever changes, it changes in the design first, and a project-wide find-and-replace is no harder than editing a constant.

## The one class constant that stays

A lookup table a component **indexes by a state or variant value** — `CROWD_CLASS[headcount]`, `SQUARE_HIGHLIGHT_CLASS[highlight]`, `WINDOW_VARIANT_CLASS[variant]`. That is data driving a choice, not a name for a style, and it belongs in `src/constants.ts` with everything else the component reads. The test is whether something _selects_ from it at runtime. If the answer is "no, it's always the same string", it goes inline.

**The component does the indexing, never the caller** — see below.

## A `className` prop a caller never varies is the component's own styling

A `className`/`bodyClassName` prop is only justified when callers genuinely differ in what they pass. When each caller passes one fixed thing — the same constant, every render, no condition — the styling isn't the caller's, it's the component's, and the prop is just a long way of writing it down. Give the component a `variant` and let it look its own classes up:

```tsx
// Before: five screens each hand Window two class strings it always wants
<Window title="live" className={SESSION_WINDOW_CLASS.window} bodyClassName={SESSION_WINDOW_CLASS.body}>

// After: the screen says which screen it is; Window knows what that looks like
<Window title="live" variant={WindowVariant.SESSION}>
```

```tsx
export function Window({ title, variant, chip, children }: WindowProps) {
  const variantClass = WINDOW_VARIANT_CLASS[variant];
  // …cn(base, variantClass.window) and cn(bodyBase, variantClass.body)
}
```

`WindowVariant` is a const object in `src/constants.ts` with its type in `src/types/constants.ts`, per `no-magic-strings` — the variant names the _screen_ (`SESSION`, `CREATE`, `JOIN`, `ERROR`, `MENU`, `LOADING`), not the styling, so the call site says what it is rather than how it should look. A variant whose entry is `''` (nothing to override, or a width its wrapper already sets) is fine and keeps the table uniform.

Two constants that differed only by screen (`CREATE_WINDOW_CLASS`, `JOIN_WINDOW_CLASS`) become two rows of one table, and a fragment they shared (`FORM_WINDOW_BODY_CLASS`) is simply written into both rows — see the section above on not naming fragments.

## Doing the component conversion

1. Put the file beside its callers (`src/routes/WelcomePage/WelcomeSectionHeading.tsx`), one component per file — see `one-component-per-file`.
2. Give it a named `string` prop for the part that varies, not `children` — see `named-props-over-children`.
3. **Fold in what the callers were appending.** If two of three wrapped it in `cn(CLASS, "text-center")` and the third inherited the same thing from a parent, `text-center` belongs in the component.
4. **Skip the `className` escape hatch** unless a caller genuinely needs it. A pass-through prop re-opens the drift the component just closed — see `prefer-removing-machinery`.
5. Delete the constant from `src/constants.ts` and fix the comment above its neighbours if it described both.
6. Check the wrapper the old markup sat in. Layout classes there often existed to position a heading against siblings that are now gone — a `flex … justify-between` around a single child does nothing and should go, keeping only what it really contributes (padding, usually).

## Why

A named class string looks like reuse but isn't: it can't fix the tag, so three call sites still get three chances to pick `h3` instead of `h2`, and three places to bolt on an extra class with `cn()`. A component fixes the tag and the styling together, and its prop names the one thing a caller is allowed to decide. Where no element repeats, there is nothing to fix and nothing to name — so the classes just stay where they apply, readable in the markup.

**Note:** this supersedes `one-component-per-file`'s line sending a component-scoped `CELL_CLASS` to `src/constants.ts`. Presentational class strings stay inline; only the runtime lookup tables above go to constants.
