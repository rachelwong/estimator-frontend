import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { FULLY_IN_VIEW_RATIO } from '@/constants'

// Whether the element has once been wholly inside the viewport. It latches:
// scrolling it back out doesn't take it back. Switched off, it reports true
// from the start, so a caller that doesn't need to wait never does.
export function useFullyInView(ref: RefObject<HTMLElement | null>, isEnabled: boolean): boolean {
  const [hasBeenInView, setHasBeenInView] = useState(!isEnabled)

  useEffect(() => {
    const element = ref.current
    if (hasBeenInView || !element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= FULLY_IN_VIEW_RATIO) {
          setHasBeenInView(true)
        }
      },
      { threshold: FULLY_IN_VIEW_RATIO },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, hasBeenInView])

  return hasBeenInView
}
