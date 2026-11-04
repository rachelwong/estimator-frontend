import { useEffect, useRef, useState } from 'react'
import { CHANGE_FLASH_MS } from '@/constants'
import type { ChangeFlashes, RevealPayload } from '@/types'
import { movedPeople, squareKey } from '@/utils'

const NO_FLASHES: ChangeFlashes = { squares: new Map(), names: new Map() }

// The Reveal's change flash (§7): which Squares, and whose chips, wear the
// rainbow border right now. Each change gets a fresh flash id, so a Square or
// chip that changes again mid-flash restarts its border.
//
// Driven by the Reveal alone. The first one this page sees, on load or as the
// Session ends, never flashes: there is nothing to compare it with.
export function useChangeFlash(reveal: RevealPayload | undefined, ownName: string | null): ChangeFlashes {
  const [flashes, setFlashes] = useState<ChangeFlashes>(NO_FLASHES)
  const previousRef = useRef(reveal)
  const nextIdRef = useRef(0)
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const previous = previousRef.current
    previousRef.current = reveal

    if (!previous || !reveal || previous === reveal) {
      return
    }

    const moved = movedPeople(previous, reveal, ownName)

    if (moved.length === 0) {
      return
    }

    const id = ++nextIdRef.current
    const squares = moved.map(({ square }) => squareKey(square.time, square.resource))
    const names = moved.map(({ name }) => name)

    setFlashes((current) => ({
      squares: withFlash(current.squares, squares, id),
      names: withFlash(current.names, names, id),
    }))

    // Each flash ends on its own clock, so a later change never cuts it short.
    // A Square or chip that flashed again since keeps its newer flash.
    const timer = setTimeout(() => {
      timersRef.current.delete(timer)
      setFlashes((current) => ({
        squares: withoutFlash(current.squares, squares, id),
        names: withoutFlash(current.names, names, id),
      }))
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

function withFlash(current: ReadonlyMap<string, number>, keys: string[], id: number): ReadonlyMap<string, number> {
  return new Map([...current, ...keys.map((key) => [key, id] as const)])
}

function withoutFlash(current: ReadonlyMap<string, number>, keys: string[], id: number): ReadonlyMap<string, number> {
  const next = new Map(current)
  for (const key of keys) {
    if (next.get(key) === id) {
      next.delete(key)
    }
  }

  return next
}
