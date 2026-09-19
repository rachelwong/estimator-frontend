import { useEffect } from 'react'
import { useRevalidator, useRouteError } from 'react-router'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { describeError } from '@/utils'

// Root errorElement. Retry re-runs the loaders rather than reloading the page.
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
    <>
      <AppHeader />

      <main className="mx-auto grid max-w-md gap-4 px-6 py-10 text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{detail}</p>

        <Button onClick={() => revalidator.revalidate()} disabled={isRetrying}>
          {isRetrying ? 'Retrying…' : 'Retry'}
        </Button>
      </main>
    </>
  )
}
