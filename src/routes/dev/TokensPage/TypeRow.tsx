import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypeRowProps {
  role: string
  fontClass: string
  sizeClass: string
  sizes: string
}

// DEV ONLY. One row of the DESIGN.md §3 scale, rendered at whatever size the
// current viewport puts it at, with that size read back from the browser —
// resize past 768 and 1200 and the three columns of the table go by in turn.
export function TypeRow({ role, fontClass, sizeClass, sizes }: TypeRowProps) {
  const sampleRef = useRef<HTMLParagraphElement>(null)
  const [painted, setPainted] = useState('')

  useEffect(() => {
    const node = sampleRef.current

    if (!node) {
      return
    }

    const read = () => setPainted(getComputedStyle(node).fontSize)

    read()
    window.addEventListener('resize', read)

    return () => window.removeEventListener('resize', read)
  }, [sizeClass])

  return (
    <div className="grid gap-2 border-2 border-ink bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-label text-[11px] text-ink">{role}</span>
        <span className="font-body text-[13px] text-text-subtle tabular-nums">
          {sizes} px · now {painted || '—'}
        </span>
      </div>

      <p ref={sampleRef} className={cn('text-ink', fontClass, sizeClass)}>
        Hands down.
      </p>
    </div>
  )
}
