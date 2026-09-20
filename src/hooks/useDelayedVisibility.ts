import { useEffect, useState } from 'react'

// True once `delayMs` has passed since mounting. Both loaders wait before
// showing: below the delay the wait is a warm server and needs no explanation,
// and drawing the loader anyway flashes it for a frame on every navigation.
export function useDelayedVisibility(delayMs: number): boolean {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  return isVisible
}
