import type { CSSProperties } from 'react'

interface CrowdChatterBubbleProps {
  line: string
  jitter: number
  tilt: number
}

// A line one of the closing band's crowd says: the reverse of a landed chip,
// white words on ink. It plays once on mount — up into the gap, a hold, up and
// out — and a new remark remounts it. `crowd-chatter` places it at each
// board's spot and runs the slide. On tablet it rises from behind the crowd;
// on mobile and desktop it passes in front.
export function CrowdChatterBubble({ line, jitter, tilt }: CrowdChatterBubbleProps) {
  return (
    <span
      style={{ '--chatter-jitter': jitter, '--chatter-tilt': tilt } as CSSProperties}
      className="crowd-chatter absolute z-10 w-[136px] border-2 border-white bg-ink px-2.5 py-[7px] text-[14px] leading-[1.3] font-bold text-white tablet:-z-10 tablet:w-auto tablet:whitespace-nowrap desktop:z-10"
    >
      {line}
    </span>
  )
}
