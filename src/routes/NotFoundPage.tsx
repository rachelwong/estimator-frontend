import { Link } from 'react-router'
import { ErrorScreen } from '@/components/ErrorScreen'
import { Button } from '@/components/ui/button'
import { ERROR_SCREEN_COPY, RoutePath } from '@/constants'

export function NotFoundPage() {
  return (
    <ErrorScreen
      copy={ERROR_SCREEN_COPY.NOT_FOUND}
      actions={
        <>
          <Button asChild size="lg">
            <Link to={RoutePath.NEW}>Start a session</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to={RoutePath.WELCOME}>Back to Welcome</Link>
          </Button>
        </>
      }
    />
  )
}
