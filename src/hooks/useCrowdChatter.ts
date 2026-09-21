import { useState } from 'react'
import { CROWD_CHATTER_LINES, CROWD_CHATTER_MIN_TILT } from '@/constants'
import type { CrowdRemark } from '@/types'

// The closing band's easter egg: hover a character and one of them says
// something. Silent until the crowd has started gathering — before then they
// wait below the band, clipped out of reach — and from then on every hover says
// a new random line, cutting off whatever was mid-slide.
export function useCrowdChatter(isGathered: boolean) {
  const [remark, setRemark] = useState<CrowdRemark | null>(null)

  function speak() {
    if (!isGathered) {
      return
    }

    setRemark({
      id: (remark?.id ?? 0) + 1,
      line: anotherLine(remark?.line),
      jitter: Math.random(),
      tilt: anotherTilt(remark?.tilt),
    })
  }

  return { remark, speak }
}

function anotherLine(previous: string | undefined): string {
  const choices = CROWD_CHATTER_LINES.filter((line) => line !== previous)
  return choices[Math.floor(Math.random() * choices.length)]
}

// Always a visible lean, and the other way from the last one, so two remarks
// in a row never look alike.
function anotherTilt(previous: number | undefined): number {
  const direction = previous !== undefined && previous > 0 ? -1 : 1
  return direction * (CROWD_CHATTER_MIN_TILT + Math.random() * (1 - CROWD_CHATTER_MIN_TILT))
}
