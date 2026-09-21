import { useRef } from 'react'
import { useCrowdChatter, useFullyInView } from '@/hooks'
import { StartSessionButton } from './StartSessionButton'
import { TeamSprites } from './TeamSprites'

// The closing band in `accent` (§7 item 8): one last way in, with a crowd of
// characters gathering along its bottom edge, clipped by the frame. They wait
// below the frame until the band is in view, then slide up once and stay —
// and as soon as one is in view, hovering it has the crowd say something.
//
// The words sit above the crowd and take only their own width, so they don't
// cover the characters from the pointer.
export function CallToActionBand() {
  const bandRef = useRef<HTMLElement>(null)
  const isGathered = useFullyInView(bandRef, true)
  const { remark, speak } = useCrowdChatter(isGathered)

  return (
    <section
      ref={bandRef}
      className="relative isolate mx-5 mt-20 h-80 overflow-hidden border-[3px] border-ink bg-accent shadow-px-window tablet:mx-10 tablet:mt-[110px] tablet:h-[330px] desktop:mx-20"
    >
      <TeamSprites isGathered={isGathered} remark={remark} onCharacterPointerEnter={speak} />

      <div className="flex w-fit flex-col items-start gap-[22px] px-5 pt-8 tablet:px-14 tablet:pt-16">
        <h2 className="font-display text-[23px] leading-[1.05] text-white tablet:text-[31px] desktop:text-[41px]">
          Flip the points
          <br />
          Align the team
          <br />
        </h2>

        <StartSessionButton className="h-[52px] text-[14px]" />
      </div>
    </section>
  )
}
