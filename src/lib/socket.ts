// The only file importing socket.io-client. Everything above talks to the
// socket through AppSocket, typed by the event maps in types/protocol.ts.
import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@/types'

// Local rather than in src/types: naming it there would import
// socket.io-client outside this file.
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

// reconnection: false — a dropped connection re-prompts for a name rather
// than silently resuming. The backend reads sessionId from the handshake.
export function createSocket(sessionId: string): AppSocket {
  return io(import.meta.env.VITE_SOCKET_URL, {
    reconnection: false,
    query: { sessionId },
  })
}
