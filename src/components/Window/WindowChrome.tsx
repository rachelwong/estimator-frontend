import { WINDOW_CHROME_DOT_CLASS } from '@/constants'
import { cn } from '@/lib/utils'

// The three dots at the right of a title bar (DESIGN.md §2). They are the
// window metaphor's whole costume — nothing here closes, minimises or resizes
// anything, so they are inert and hidden from screen readers rather than
// rendered as buttons that would promise a control that doesn't exist.
export function WindowChrome() {
  return (
    <span aria-hidden="true" className="flex gap-[5px]">
      {WINDOW_CHROME_DOT_CLASS.map((dotClass) => (
        <span key={dotClass} className={cn('size-3 border-2 border-ink', dotClass)} />
      ))}
    </span>
  )
}
