// The only file that touches localStorage.
//
// Plain functions rather than a hook: route loaders read the token and cannot
// call hooks, and the token is written once at creation then read at entry, so
// there is nothing to subscribe to. One spelling for both callers.
const KEY_PREFIX = 'estimator:adminToken:'

// Keyed per session, so one browser can be admin of several sessions at once.
function storageKey(sessionId: string): string {
  return `${KEY_PREFIX}${sessionId}`
}

export function getAdminToken(sessionId: string): string | null {
  return localStorage.getItem(storageKey(sessionId))
}

export function setAdminToken(sessionId: string, adminToken: string): void {
  localStorage.setItem(storageKey(sessionId), adminToken)
}

export function removeAdminToken(sessionId: string): void {
  localStorage.removeItem(storageKey(sessionId))
}
