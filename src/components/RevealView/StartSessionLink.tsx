import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { RoutePath } from '@/constants'
import { cn } from '@/lib/utils'

interface StartSessionLinkProps {
  /** Where the link sits decides its size — the header's, or full width under the chips. */
  className?: string
}

// "Start a new session" on the Reveal (§7). A plain link: the new session
// carries nothing over.
export function StartSessionLink({ className }: StartSessionLinkProps) {
  return (
    <Button asChild className={cn('font-display font-normal', className)}>
      <Link to={RoutePath.NEW}>Start a new session</Link>
    </Button>
  )
}
