// The link an Admin hands the team, shown on the ready screen and in the share
// bar. It points at /join, the entry for anyone without an identity — the
// Admin's own /start would bounce them there anyway.
export function sessionJoinUrl(sessionId: string): string {
  return `${window.location.origin}/${sessionId}/join`
}
