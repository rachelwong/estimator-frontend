import { createContext } from 'react'
import type { ThemeContextValue } from '@/types'

// Filled by ThemeProvider, read through useTheme(). Its own module so the
// provider's file holds a component and nothing else, and fast refresh keeps
// working on it.
export const ThemeContext = createContext<ThemeContextValue | null>(null)
