// The shape of src/content.ts, and of what useContent() hands a component.
//
// The import below is a value import on purpose: `typeof CONTENT` needs the
// value binding to derive from, as in ./constants.ts.
import { CONTENT } from '../content'
import type { Theme } from './constants'

// One piece of copy, written once per theme. A function where the words take
// values, e.g. `(count: number) => string`.
export type ThemeVariants<T> = Record<Theme, T>

// What CONTENT must satisfy: every leaf holds both themes' versions, so a
// missing one fails the build. Branches group the copy by screen.
export interface ContentTree {
  [key: string]: ThemeVariants<unknown> | ContentTree
}

// A content tree with each leaf narrowed to one theme's version.
export type ResolvedContent<T> =
  T extends ThemeVariants<infer Value> ? Value : { [Key in keyof T]: ResolvedContent<T[Key]> }

// Everything the UI says, in the current theme.
export type Content = ResolvedContent<typeof CONTENT>

export type GridContent = Content['grid']

export type RoleContent = Content['role']
