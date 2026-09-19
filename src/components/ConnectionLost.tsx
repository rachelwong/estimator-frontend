// Static on purpose. A retry button or auto-reconnect would loop against a
// backend that is down.
export function ConnectionLost() {
  return (
    <main className="mx-auto grid max-w-md gap-2 px-6 py-10 text-center">
      <h2 className="text-xl font-semibold">Connection lost</h2>
      <p className="text-sm text-muted-foreground">Reload the page to reconnect.</p>
    </main>
  )
}
