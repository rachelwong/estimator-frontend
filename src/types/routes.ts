// What routes/loaders.ts hands the pages: each loader's data and each
// action's result, read back with useLoaderData / useActionData.
import type { GetSessionResponse, RevealPayload, Selection } from './protocol'
import type { SessionError } from './session'

// What joinLoader hands JoinSessionPage: only the description, so people know
// what they're estimating before they give a name.
export interface JoinLoaderData {
  description: string | null
}

// What an action hands back to its page when it failed — joinAction to
// JoinSessionPage, createSessionAction to CreateSessionPage. A success
// redirects instead, so there is no success shape.
export interface ActionErrorData {
  error: string
}

// Who is looking at the Reveal, for its role chip: an admin token, and whether
// this tab's connection identified. A refresh keeps the token and loses the
// rest; a fresh visitor has neither.
export interface RevealViewer {
  isAdmin: boolean
  hasJoined: boolean
}

// What EndedPage reads from its live connection. `reveal` is null until the
// socket sends one, and REST's stands in.
export interface EndedView {
  reveal: RevealPayload | null
  selection: Selection | null
  error: SessionError | null
  isLive: boolean
}

// What endedLoader hands EndedPage.
export interface EndedLoaderData {
  session: GetSessionResponse
  viewer: RevealViewer
}
