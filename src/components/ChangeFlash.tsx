import { CHANGE_FLASH_MS, Theme } from '@/constants'
import { useTheme } from '@/hooks'

interface ChangeFlashProps {
  // Set while the parent wears the flash. A new id restarts it.
  flashId?: number
}

// The Reveal's change flash (§8): a rainbow that rolls over its parent's 2px
// border, then fades back to the ink beneath. The parent must be positioned
// and must not clip its overflow, or the border is cut away. A Square someone
// just moved to wears it, and so does that person's chip.
//
// Play only: Work has no motion (docs/plans/themes.md decision 15), so a move
// there shows as the Square's new count and nothing else.
export function ChangeFlash({ flashId }: ChangeFlashProps) {
  const { theme } = useTheme()

  if (flashId === undefined || theme === Theme.WORK) {
    return null
  }

  return (
    <span key={flashId} aria-hidden className="change-flash" style={{ animationDuration: `${CHANGE_FLASH_MS}ms` }} />
  )
}
