// Red Hat Display and Red Hat Text, the Work theme's two families
// (docs/plans/themes.md, decision 14). Each is a lazy chunk, so a visitor who
// never flips the switch never downloads them. The module system caches every
// import(), so calling this again on a later switch fetches nothing.
//
// Both are variable fonts: one file per family covers the 400–700 the boards ask for.
export function loadWorkFonts() {
  return Promise.all([
    import('@fontsource-variable/red-hat-display/wght.css'),
    import('@fontsource-variable/red-hat-text/wght.css'),
  ])
}
