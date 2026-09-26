---
name: page-behaviour-lives-in-page
description: A function that only applies to one route or section is defined in that route's component and passed into the shared wrapper (PageLayout or similar) as an optional prop. The wrapper never checks pathname, route or section to decide how a child behaves. Use when about to add useLocation(), a pathname comparison, or any "if this is page X" branch inside a shared layout or wrapper component, or when one screen needs a shared element (header link, button, footer) to behave differently from every other screen.
---

A shared wrapper renders the same frame for every screen. When one screen needs part of that frame to behave differently, the behaviour belongs to that screen, not to the wrapper.

- The **page** defines the function.
- The **wrapper** takes it as an optional prop and wires it to the element. With no prop, the element keeps its default behaviour.
- The wrapper never asks which page it is on.

This keeps the function next to the only place that uses it. It also stops the parent from having to know how every child behaves: per-page checks in a wrapper grow with every page and hide each page's behaviour in a file that isn't that page.

## Example

On Welcome, clicking the header logo scrolls back to the top. Every other screen uses the logo as a link to Welcome.

Wrong: the wrapper checks the route.

```tsx
// src/components/PageLayout.tsx
export function PageLayout({ actions, children }: PageLayoutProps) {
  const { pathname } = useLocation()

  function handleLogoLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== RoutePath.WELCOME) return
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  // …
}
```

Right: the wrapper takes an optional callback, and the page supplies it.

```tsx
// src/components/PageLayout.tsx
interface PageLayoutProps {
  // …
  /**
   * For a screen that wants the logo link to do something other than go to
   * Welcome. Welcome does: the logo link there already points at the open page.
   */
  onLogoLinkClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

<Link to={RoutePath.WELCOME} aria-label="Fold and Flip home" onClick={onLogoLinkClick}>
```

```tsx
// src/routes/WelcomePage/WelcomePage.tsx
function handleLogoLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

<PageLayout onLogoLinkClick={handleLogoLinkClick} /* … */>
```

## Checklist

1. Is the behaviour for one route or section only? Then the handler goes in that route's component.
2. Add an optional prop to the wrapper, and pass it straight to the element's event handler. Leaving it `undefined` must give the default behaviour, so other screens don't change.
3. Name the prop after what the user interacts with (`onLogoLinkClick`), not after an internal component name (`onLockupClick` after `LogoLockup`).
4. Confirm no other screen passes the prop unless it should: grep for the wrapper's call sites.

Related: `separate-views-from-routing` covers the reverse case, where a view must not pick between sibling screens.
