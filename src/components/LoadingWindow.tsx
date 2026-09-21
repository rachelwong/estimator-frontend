import { PageLayout } from '@/components/PageLayout'
import { PixelProgressBar } from '@/components/PixelProgressBar'
import { Window } from '@/components/Window'
import { LOADING_NOTICE_DELAY_MS } from '@/constants'
import { useDelayedVisibility } from '@/hooks'

// The large loader (DESIGN.md §7): the 220px bar centred in its own window,
// above a Silkscreen line.
//
// This is the one that stands in for a whole page — the first load, a page
// still fetching its chunk, a session still connecting. Render's free tier
// sleeps after 15 minutes, so that wait can be 30-60s and is named rather than
// merely spun at.
//
// The header shows at once; only the window waits out the delay.
export function LoadingWindow() {
  const isVisible = useDelayedVisibility(LOADING_NOTICE_DELAY_MS)

  return (
    <PageLayout>
      {isVisible && (
        <div className="mx-auto w-full max-w-[366px] px-5 py-10 tablet:max-w-[420px]">
          <Window title="loading">
            <div
              role="status"
              className="flex min-h-[150px] flex-col items-center justify-center gap-6"
            >
              <PixelProgressBar />

              <span className="font-label text-[12px] text-ink">loading session…</span>
            </div>
          </Window>
        </div>
      )}
    </PageLayout>
  )
}
