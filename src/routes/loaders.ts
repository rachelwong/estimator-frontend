// Route-level data functions: the loaders and actions React Router calls
// outside any component.
//
// They live apart from the page components on purpose — a module that exports
// both a component and a plain function loses fast refresh for the whole file.
import { redirect } from 'react-router'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { getAdminToken, setAdminToken } from '@/lib/adminToken'
import { ApiError, createSession, getSession } from '@/lib/api'
import type { PointSystemType } from '@/types/constants'
import type { GetSessionResponse } from '@/types/protocol'

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
// every loader asks. Only an admin has an identity until Phase 9 adds the
// live-store check for participants.
function hasIdentity(sessionId: string): boolean {
  return getAdminToken(sessionId) !== null
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
