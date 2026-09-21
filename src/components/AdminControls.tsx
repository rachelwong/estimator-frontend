import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminControlsProps {
  onEndSession: () => void
  /** Where the trigger sits decides its size — the header's, or full width under the grid. */
  className?: string
}

// "End session & reveal" in `danger` (DESIGN.md §7). Confirmed first: ending is
// irreversible. No navigation here — the session-ended broadcast moves every
// tab, this one included, to /ended.
export function AdminControls({ onEndSession, className }: AdminControlsProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={cn('font-display font-normal', className)}>
          End session &amp; reveal
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End this session?</AlertDialogTitle>
          <AlertDialogDescription>
            Everyone's Selection is revealed. Nobody can change theirs afterwards.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onEndSession}>
            End session &amp; reveal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
