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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks";
import { cn } from "@/lib/utils";

interface AdminControlsProps {
  onEndSession: () => void;
  /** Where the trigger sits decides its size — the header's, or full width under the grid. */
  className?: string;
}

// "End session & reveal" in `danger` (DESIGN.md §7). Confirmed first: ending is
// irreversible. No navigation here — the session-ended broadcast moves every
// tab, this one included, to /ended.
export function AdminControls({ onEndSession, className }: AdminControlsProps) {
  const content = useContent();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className={cn("font-display font-normal", className)}
        >
          {content.endSession.trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.endSession.dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {content.endSession.dialogBody}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{content.endSession.cancel}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onEndSession}>
            {content.endSession.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
