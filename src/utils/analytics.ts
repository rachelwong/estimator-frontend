import type { BeforeSendEvent } from '@vercel/analytics/react'

// `/k3x9q/join` → `/[sessionId]/join`. Every two-segment path is a
// session route, and the ID is the invitation, so it never leaves the app.
export function redactSessionId(event: BeforeSendEvent) {
  const url = new URL(event.url)
  url.pathname = url.pathname.replace(/^\/[^/]+(?=\/)/, '/[sessionId]')
  return { ...event, url: url.toString() }
}
