import { useRevalidator } from 'react-router'
import { PixelProgressBar } from '@/components/PixelProgressBar'
import { Button } from '@/components/ui/button'
import { PixelBarSize } from '@/constants'
import { cn } from '@/lib/utils'

// An error screen's retry. It re-runs the page's loaders rather than reloading
// the page — for a dropped Admin, /start's loader swaps the dead connection for
// a fresh one.
//
// Pressed, it carries the inline loader (DESIGN.md §7) at full strength, as the
// form buttons do.
export function TryAgainButton() {
  const revalidator = useRevalidator()
  const isRetrying = revalidator.state !== 'idle'

  return (
    <Button
      size="lg"
      className={cn(isRetrying && 'disabled:opacity-100')}
      disabled={isRetrying}
      onClick={() => revalidator.revalidate()}
    >
      {isRetrying && <PixelProgressBar size={PixelBarSize.INLINE} />}
      {isRetrying ? 'Trying again…' : 'Try again'}
    </Button>
  )
}
