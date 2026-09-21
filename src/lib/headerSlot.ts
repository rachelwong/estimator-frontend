import { createContext } from 'react'

// The element on the right of RootLayout's header that a page portals its own
// controls into — End session & reveal on Active. Null until the header has
// mounted, and outside RootLayout (the first-load fallback).
//
// A plain context rather than <Outlet context>: the pathless errorElement route
// between RootLayout and the pages renders a default <Outlet /> of its own,
// which would hand the pages `undefined`.
export const HeaderSlotContext = createContext<HTMLElement | null>(null)
