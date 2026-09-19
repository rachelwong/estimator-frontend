import { HTTP_NOT_FOUND } from '@/constants'
import type { ErrorCode } from '@/types/constants'
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  ErrorResponse,
  GetSessionResponse,
} from '@/types/protocol'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// Carries the backend's own error code through, so a caller can tell an
// INVALID_NAME apart from a cold-start failure without parsing a message.
export class ApiError extends Error {
  readonly status: number
  readonly code: ErrorCode | undefined

  constructor(status: number, code: ErrorCode | undefined, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// The backend always answers with { error, message }. A proxy or a sleeping
// host might not, so fall back to the status text rather than throwing while
// building the error.
async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ErrorResponse
    return new ApiError(response.status, body.error, body.message)
  } catch {
    return new ApiError(response.status, undefined, response.statusText)
  }
}

export async function createSession(
  input: CreateSessionRequest,
): Promise<CreateSessionResponse> {
  const response = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  return (await response.json()) as CreateSessionResponse
}

// Returns null when the session does not exist. That is an expected answer the
// loaders turn into a redirect to /not-found, not a failure — so it comes back
// in the type rather than as a throw.
export async function getSession(sessionId: string): Promise<GetSessionResponse | null> {
  const response = await fetch(`${BASE_URL}/sessions/${sessionId}`)

  if (response.status === HTTP_NOT_FOUND) {
    return null
  }

  if (!response.ok) {
    throw await toApiError(response)
  }

  return (await response.json()) as GetSessionResponse
}
