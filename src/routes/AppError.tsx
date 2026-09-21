import { useEffect } from 'react'
import { useRevalidator, useRouteError } from 'react-router'
import { PageLayout } from '@/components/PageLayout'
import { Button } from '@/components/ui/button'
import { describeError } from '@/utils'

// errorElement for every page. Retry re-runs the loaders rather than reloading
// the page.
export function AppError() {
  const error = useRouteError()
  const revalidator = useRevalidator()

  const isRetrying = revalidator.state !== 'idle'
  const { title, detail } = describeError(error)

  // Once per error, not per render — retrying re-renders this page.
  useEffect(() => {
    console.error('Route failed', error)
  }, [error])

  return (
    <PageLayout>
      <div className="mx-auto grid w-full max-w-md gap-4 px-6 py-10 text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{detail}</p>

        <Button onClick={() => revalidator.revalidate()} disabled={isRetrying}>
          {isRetrying ? 'Retrying…' : 'Retry'}
        </Button>
      </div>
    </PageLayout>
  )
}
