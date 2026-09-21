// What routes/loaders.ts hands the pages: each loader's data and each
// action's result, read back with useLoaderData / useActionData.
import type { GetSessionResponse, Selection } from './protocol'

// What an action hands back to its page when it failed — joinAction to
// JoinSessionPage, createSessionAction to CreateSessionPage. A success
// redirects instead, so there is no success shape.
export interface ActionErrorData {
  error: string
}

// Who is looking at the Reveal. /ended is REST-only and the server never says,
// so this is whatever this tab still knows: an admin token, and the connection
// it held until the Session ended. A refresh keeps the token and loses the
// rest; a fresh visitor has neither.
export interface RevealViewer {
  isAdmin: boolean
  hasJoined: boolean
  selection: Selection | null
}

// What endedLoader hands EndedPage.
export interface EndedLoaderData {
  session: GetSessionResponse
  viewer: RevealViewer
}
