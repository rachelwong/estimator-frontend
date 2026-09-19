import { Navigate, useParams } from 'react-router'
import { ActiveSessionView } from '@/components/ActiveSessionView'
import { ConnectionLost } from '@/components/ConnectionLost'
import { LoadingNotice } from '@/components/LoadingNotice'
import { SessionConnectionStatus } from '@/constants'
import { useSessionConnection } from '@/hooks'

// Redirects here are part of what this page renders for a status, not a side
// effect — hence <Navigate> rather than navigate() in an effect.
export function ActiveSessionPage() {
  const sessionId = useParams().sessionId!
  const { state, isAdmin, select, dismissError } = useSessionConnection(sessionId)

  const isLost =
    state.status === SessionConnectionStatus.DISCONNECTED ||
    state.status === SessionConnectionStatus.REJECTED

  if (state.status === SessionConnectionStatus.ENDED) {
    return <Navigate to={`/${sessionId}/ended`} replace />
  }

  // A dropped Participant goes back for a new name. An Admin does not — /join
  // would see their token and send them straight back here.
  if (isLost && !isAdmin) {
    return <Navigate to={`/${sessionId}/join`} replace />
  }

  if (state.status === SessionConnectionStatus.CONNECTING) {
    return <LoadingNotice />
  }

  if (isLost) {
    return <ConnectionLost />
  }

  return (
    <ActiveSessionView
      state={state}
      onSelect={({ time, resource }) => select(time, resource)}
      onDismissError={dismissError}
    />
  )
}
