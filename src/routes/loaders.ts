// Route-level data functions: the loaders and actions React Router calls
// outside any component.
//
// They live apart from the page components on purpose — a module that exports
// both a component and a plain function loses fast refresh for the whole file.
import { redirect } from 'react-router'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { SessionConnectionStatus } from '@/constants'
import { getAdminToken, setAdminToken } from '@/lib/adminToken'
import { ApiError, createSession, getSession } from '@/lib/api'
import {
  getOrCreateSessionConnection,
  hasLiveSessionConnection,
  removeSessionConnection,
} from '@/lib/sessionConnectionRegistry'
import type { GetSessionResponse, JoinSessionActionData, PointSystemType } from '@/types'

const NOT_FOUND_PATH = '/not-found'

// Every session loader starts here. REST first, before the admin token, so a
// token left over from a restarted server still lands on /not-found.
// A network failure throws through to the root errorElement for a retry.
async function loadSession(sessionId: string): Promise<GetSessionResponse> {
  const session = await getSession(sessionId)

  if (!session) {
    throw redirect(NOT_FOUND_PATH)
  }

  return session
}

// Whether this browser can enter the session without a name. The one place
// every loader asks: an admin token, or a participant's live connection.
function hasIdentity(sessionId: string): boolean {
  return getAdminToken(sessionId) !== null || hasLiveSessionConnection(sessionId)
}

// Where an open session sends this browser.
function openSessionPath(sessionId: string): string {
  if (hasIdentity(sessionId)) {
    return `/${sessionId}/start`
  }

  return `/${sessionId}/join`
}

export async function joinLoader({ params }: LoaderFunctionArgs) {
  const sessionId = params.sessionId!

  // Back from /start. The live connection already answers what REST would,
  // and joining again would create a second participant.
  if (hasLiveSessionConnection(sessionId)) {
    return redirect(`/${sessionId}/start`)
  }

  const session = await loadSession(sessionId)

  if (session.ended) {
    return redirect(`/${sessionId}/ended`)
  }

  if (hasIdentity(sessionId)) {
    return redirect(`/${sessionId}/start`)
  }

  return null
}

export async function startLoader({ params }: LoaderFunctionArgs) {
  const sessionId = params.sessionId!
  const session = await loadSession(sessionId)

  if (session.ended) {
    return redirect(`/${sessionId}/ended`)
  }

  if (!hasIdentity(sessionId)) {
    return redirect(`/${sessionId}/join`)
  }

  // An Admin arriving from creation, a refresh or a second tab. admin-auth's
  // ack carries their current Selection (decision #19), so the grid is never
  // blank. A dead store from an earlier drop is replaced, not reused.
  const adminToken = getAdminToken(sessionId)
  if (adminToken !== null && !hasLiveSessionConnection(sessionId)) {
    removeSessionConnection(sessionId)
    getOrCreateSessionConnection(sessionId, { adminToken })
  }

  return session
}

export async function endedLoader({ params }: LoaderFunctionArgs) {
  const sessionId = params.sessionId!
  const session = await loadSession(sessionId)

  if (!session.ended) {
    return redirect(openSessionPath(sessionId))
  }

  return session
}

export async function joinAction({ params, request }: ActionFunctionArgs) {
  const sessionId = params.sessionId!
  const name = String((await request.formData()).get('name') ?? '')

  // Drop a dead store from an earlier drop, so this join gets a fresh socket.
  removeSessionConnection(sessionId)
  const store = getOrCreateSessionConnection(sessionId, { name })
  const state = await store.whenSettled()

  if (state.status === SessionConnectionStatus.ACTIVE) {
    return redirect(`/${sessionId}/start`)
  }

  if (state.status === SessionConnectionStatus.ENDED) {
    return redirect(`/${sessionId}/ended`)
  }

  // e.g. INVALID_NAME, or UNKNOWN_SESSION after a backend restart.
  if (state.status === SessionConnectionStatus.REJECTED) {
    return { error: state.error.message } satisfies JoinSessionActionData
  }

  return { error: 'Could not connect. Try again.' } satisfies JoinSessionActionData
}

export interface CreateSessionActionData {
  error: string
}

export async function createSessionAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const input = {
    adminName: String(formData.get('adminName') ?? ''),
    pointSystemType: String(formData.get('pointSystemType') ?? '') as PointSystemType,
    sliderMax: Number(formData.get('sliderMax') ?? 0),
  }

  try {
    const session = await createSession(input)
    setAdminToken(session.sessionId, session.adminToken)

    // The creating admin already has an identity, so skip /join.
    return redirect(`/${session.sessionId}/start`)
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message }
    }

    // A sleeping backend fails here. Report it in place rather than throwing to
    // an error page, so the filled-in form survives the retry.
    console.error('createSession failed', error)
    return { error: 'Could not reach the server. Try again.' }
  }
}
