---
name: svgs-live-in-sprites
description: Static SVG art (icons, pixel sprites, the hamburger bars) lives as a .svg file in src/assets/sprites/, imported as a URL and rendered through the Sprite component — never as a .tsx component that returns inline <svg>. Because Sprite is an <img>, Tailwind fill-*/currentColor can't reach inside, so the file carries the hex of the design token. Use when about to write a component whose whole body is an <svg>, when adding an icon, or when an existing *Icon.tsx has no props and no state.
---

A component that only returns a fixed `<svg>` is an asset wearing a component's clothes. Make it a file.

1. Write `src/assets/sprites/<name>.svg` (single `<path>` with `d` is fine; give it `width`/`height`/`viewBox` and `aria-hidden="true"`).
2. `import name from '@/assets/sprites/<name>.svg'` and render `<Sprite source={name} className="w-[Npx]" />`. A typo'd path then fails the build.
3. Delete the `.tsx`.

**Colour:** `Sprite` renders an `<img>`, so `fill-ink` / `currentColor` do nothing. Hardcode the token's hex in the SVG (e.g. ink `#1E1B2E`, from `--color-ink` in `src/index.css`). If the token changes, the SVG must change too.

**Stays a component:** an SVG that takes props, animates parts of itself via CSS, or must inherit `currentColor` from its parent. Say so rather than forcing it into an `<img>`.

`Sprite` adds the `sprite-pixels` class (pixelated rendering) — harmless for straight-edged shapes, but check anything with curves.

Origin: MenuIcon.tsx → menu.svg (2026-10-02).
