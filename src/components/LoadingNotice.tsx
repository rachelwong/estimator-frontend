import { PixelProgressBar } from '@/components/PixelProgressBar'
import { LOADING_NOTICE_DELAY_MS, PixelBarSize } from '@/constants'
import { useDelayedVisibility } from '@/hooks'

// The inline loader (DESIGN.md §7): the small bar before a line of text, in a
// framed box pinned to the bottom of the page.
//
// This is the one that shows over a page already on screen, while a loader runs
// for the next one. The page under it stays readable, which is why it is a
// strip rather than the full-window loader.
export function LoadingNotice() {
  const isVisible = useDelayedVisibility(LOADING_NOTICE_DELAY_MS)

  if (!isVisible) {
    return null
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-6 mx-auto flex w-fit items-center gap-2.5 border-[3px] border-ink bg-white px-4 py-2.5 shadow-px"
    >
      <PixelProgressBar size={PixelBarSize.INLINE} />

      <span className="font-label text-[11px] text-ink">loading…</span>
    </div>
  )
}
