import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { DEV_AA_NORMAL, devContrast } from './contrast.dev'

interface SwatchRowProps {
  token: string
  bgClass: string
  fgClass: string
  use: string
}

// DEV ONLY. One palette token, with the contrast it actually paints at.
//
// The ratio is measured off the rendered node rather than off a hex kept in
// the fixture, so a token that failed to reach the stylesheet shows up as a
// wrong number instead of the intended one.
export function SwatchRow({ token, bgClass, fgClass, use }: SwatchRowProps) {
  const sampleRef = useRef<HTMLDivElement>(null)
  const [painted, setPainted] = useState<{ ratio: number | null; colour: string }>({
    ratio: null,
    colour: '',
  })

  useEffect(() => {
    const node = sampleRef.current

    if (!node) {
      return
    }

    const style = getComputedStyle(node)

    setPainted({
      ratio: devContrast(style.backgroundColor, style.color),
      colour: style.backgroundColor,
    })
  }, [bgClass, fgClass])

  const passes = painted.ratio !== null && painted.ratio >= DEV_AA_NORMAL

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-4 border-2 border-ink bg-white p-3">
      <div
        ref={sampleRef}
        className={cn('flex size-20 items-center justify-center border-2 border-ink', bgClass, fgClass)}
      >
        <span className="font-label text-[11px]">Aa</span>
      </div>

      <div className="grid gap-1">
        <p className="font-label text-[12px] text-ink">{token}</p>
        <p className="font-body text-[14px] text-text-muted">{use}</p>
        <p className="font-body text-[13px] text-text-subtle tabular-nums">
          {painted.colour} · {painted.ratio?.toFixed(2) ?? '—'}:1{' '}
          <span className={cn('font-bold', passes ? 'text-ink' : 'text-abstained')}>
            {passes ? 'AA' : 'BELOW AA'}
          </span>
        </p>
      </div>
    </div>
  )
}
