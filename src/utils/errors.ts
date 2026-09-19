import { ApiError, NetworkError } from '@/lib/api'
import type { ErrorCopy } from '@/types'

// Words only — every error gets the same page and the same Retry.
// Unreachable is the common case: a cold start or a stopped backend.
export function describeError(error: unknown): ErrorCopy {
  if (error instanceof NetworkError) {
    return { title: 'Could not reach the server', detail: 'It may still be waking up.' }
  }

  if (error instanceof ApiError) {
    return { title: 'The server hit an error', detail: error.message }
  }

  return { title: 'Something went wrong', detail: 'Try again, or reload the page.' }
}
