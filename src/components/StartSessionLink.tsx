import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { RoutePath } from '@/constants'
import { useContent } from '@/hooks'
import { cn } from '@/lib/utils'

interface StartSessionLinkProps {
  /** Where the link sits decides its size — the header's, or full width under the chips. */
  className?: string
}

// "Start a new session" on the Reveal (§7). A plain link: the new session
// carries nothing over.
export function StartSessionLink({ className }: StartSessionLinkProps) {
  const content = useContent()

  return (
    <Button asChild variant="newSession" className={cn('font-display font-normal', className)}>
      <Link to={RoutePath.NEW}>{content.action.startNewSession}</Link>
    </Button>
  )
}
