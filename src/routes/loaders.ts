// Route-level data functions: the loaders and actions React Router calls
// outside any component. Phase 4 adds joinLoader/startLoader/endedLoader here.
//
// They live apart from the page components on purpose — a module that exports
// both a component and a plain function loses fast refresh for the whole file.
import { redirect } from 'react-router'
import type { ActionFunctionArgs } from 'react-router'
import { setAdminToken } from '@/lib/adminToken'
import { ApiError, createSession } from '@/lib/api'
import type { PointSystemType } from '@/types/constants'

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
