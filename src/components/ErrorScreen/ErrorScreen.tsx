import type { ReactNode } from 'react'
import { PageLayout } from '@/components/PageLayout'
import { SpriteScatter } from '@/components/SpriteScatter'
import { Window } from '@/components/Window'
import { ERROR_WINDOW_CLASS } from '@/constants'
import type { ErrorScreenCopy } from '@/types'
import { BrokenGrid } from './BrokenGrid'

interface ErrorScreenProps {
  copy: ErrorScreenCopy
  /** Two buttons, the primary first: `selection`, then the white secondary. */
  actions: ReactNode
}

// "Broken grid" (DESIGN.md §7, option C) — the one layout behind not found,
// connection lost and something went wrong. Only the words and the two buttons
// change, and the caller owns both: one error's primary is a link, another's
// is a retry.
//
// The header carries the logo only. Side by side from tablet up, stacked on a
// phone, where the buttons also go full width.
export function ErrorScreen({ copy, actions }: ErrorScreenProps) {
  return (
    <PageLayout>
      <div className="relative isolate flex justify-center px-3 pt-8 pb-16 tablet:px-10 tablet:pt-10">
        <SpriteScatter />

        <Window
          title={copy.label}
          chip="error"
          className={ERROR_WINDOW_CLASS.window}
          bodyClassName={ERROR_WINDOW_CLASS.body}
        >
          <BrokenGrid />

          {/* The artboard caps this at 460px on desktop, sized for its 52px
              buttons. Ours are the 56px `lg` every screen's call to action
              wears, and need 470 to sit side by side, so the column takes the
              window's remaining 476. On tablet they wrap, as the artboard's do. */}
          <div className="flex min-w-0 flex-1 flex-col gap-3.5 tablet:max-w-[380px] desktop:max-w-none">
            <span className="font-label text-[12px] text-ink">{copy.label}</span>

            <h2 className="font-display text-[26px] leading-[1.05] text-ink tablet:text-[32px] desktop:text-[36px]">
              {copy.title}
            </h2>

            <p className="text-[16px] leading-[1.55] text-text-muted">{copy.body}</p>

            <div className="flex flex-col gap-3.5 *:w-full tablet:flex-row tablet:flex-wrap tablet:*:w-auto">
              {actions}
            </div>
          </div>
        </Window>
      </div>
    </PageLayout>
  )
}
