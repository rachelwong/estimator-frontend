import type { ActionErrorData, Content } from '@/types'

// What a failed join or create says: the server's own message when it gave
// one, otherwise the current theme's words for the failure.
export function actionErrorMessage(data: ActionErrorData, content: Content['actionFailure']): string {
  return 'serverMessage' in data ? data.serverMessage : content[data.failure]
}
