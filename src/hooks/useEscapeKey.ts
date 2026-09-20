import { useEffect } from 'react'
import { ESCAPE_KEY } from '@/constants'

// Calls `onEscape` when Esc is pressed anywhere on the page; null listens for
// nothing. On the document rather than an element: Safari doesn't focus a
// button on click, so the element that opened something may never see the key.
export function useEscapeKey(onEscape: (() => void) | null) {
  useEffect(() => {
    if (!onEscape) {
      return
    }

    // Declared here so add and remove get the same function.
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === ESCAPE_KEY) {
        onEscape?.()
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onEscape])
}
