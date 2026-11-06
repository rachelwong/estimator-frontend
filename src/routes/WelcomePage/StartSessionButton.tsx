import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { RoutePath } from '@/constants'
import { useContent } from '@/hooks'
import { cn } from '@/lib/utils'

interface StartSessionButtonProps {
  /** Its height and type size — the header's, or the page's calls to action. */
  className?: string
}

// "Start a session" (§7): the yellow Bungee button that opens the Create form.
// Welcome draws it in the header, the hero, the menu and the closing band.
export function StartSessionButton({ className }: StartSessionButtonProps) {
  const content = useContent()

  return (
    <Button asChild className={cn('font-display font-normal', className)}>
      <Link to={RoutePath.NEW}>{content.action.startSession}</Link>
    </Button>
  )
}
