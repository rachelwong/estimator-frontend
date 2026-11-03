import { useEffect, useRef, useState } from 'react'
import { CHANGE_FLASH_MS } from '@/constants'
import type { RevealPayload } from '@/types'
import { changedSquares } from '@/utils'

// The Reveal's change flash (§7): which Squares wear the rainbow ring right
// now, as squareKey → flash id. A fresh id per change lets a Square that
// changes again mid-flash restart its ring.
//
// Driven by the Reveal alone. The first one this page sees, on load or as the
// Session ends, never flashes: there is nothing to compare it with.
export function useChangeFlash(
  reveal: RevealPayload | undefined,
  ownName: string | null,
): ReadonlyMap<string, number> {
  const [flashes, setFlashes] = useState<ReadonlyMap<string, number>>(new Map())
  const previousRef = useRef(reveal)
  const nextIdRef = useRef(0)
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const previous = previousRef.current
    previousRef.current = reveal

    if (!previous || !reveal || previous === reveal) {
      return
    }

    const started = changedSquares(previous, reveal, ownName).map(
      (key) => [key, ++nextIdRef.current] as const,
    )

    if (started.length === 0) {
      return
    }

    setFlashes((current) => new Map([...current, ...started]))

    // Each flash ends on its own clock, so a later change never cuts it short.
    // A Square that flashed again since keeps its newer flash.
    const timer = setTimeout(() => {
      timersRef.current.delete(timer)
      setFlashes((current) => {
        const next = new Map(current)
        for (const [key, id] of started) {
          if (next.get(key) === id) {
            next.delete(key)
          }
        }

        return next
      })
    }, CHANGE_FLASH_MS)
    timersRef.current.add(timer)
  }, [reveal, ownName])

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [])

  return flashes
}
