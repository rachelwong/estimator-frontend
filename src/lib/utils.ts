import { createCn } from 'cn/engine'
import tables from './cnTables'

// Importing `cn` straight from the "cn" package pulls its full Tailwind merge
// tables — every class group in Tailwind, ~25 KB minified in the entry chunk.
// Binding the engine to the tables that cn/vite compiled from our own sources
// keeps only the groups we use. The cn() signature is unchanged either way, so
// every call site imports from here rather than from "cn".
export const cn = createCn(tables)
