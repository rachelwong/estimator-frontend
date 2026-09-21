// Mirrored from estimator-backend/src/utils/validation.ts — keep in step.
//
// Checking here means the common rejection, a symbol in the name, never reaches
// the wire. The server's own INVALID_NAME stays the backstop, not the usual path.
//
// The rule itself is PARTICIPANT_NAME_PATTERN in lib/patterns.ts. The server
// trims and collapses the same way before it validates, so stray whitespace is
// never what fails.
import { PARTICIPANT_NAME_PATTERN, REPEATED_SPACES_PATTERN } from '@/lib/patterns'

const MAX_NAME_LENGTH = 20

const NAME_RULE = 'Use 1-20 letters, numbers or spaces, with no symbols.'

// Trim the ends, collapse runs of spaces. What the name is judged on, and what
// the server stores.
export function normalizeName(name: string): string {
  return name.trim().replace(REPEATED_SPACES_PATTERN, ' ')
}

// Returns the message to show, or null when the name is fine.
export function nameError(name: string): string | null {
  const normalized = normalizeName(name)

  if (normalized.length <= MAX_NAME_LENGTH && PARTICIPANT_NAME_PATTERN.test(normalized)) {
    return null
  }

  return NAME_RULE
}
