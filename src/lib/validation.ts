// Mirrored from estimator-backend/src/utils/validation.ts — keep in step.
//
// Checking here means the common rejection, a space in the name, never reaches
// the wire. The server's own INVALID_NAME stays the backstop, not the usual path.
const PARTICIPANT_NAME_PATTERN = /^[A-Za-z0-9]{1,20}$/

const NAME_RULE = 'Use 1-20 letters or numbers, with no spaces.'

// Returns the message to show, or null when the name is fine.
export function nameError(name: string): string | null {
  if (PARTICIPANT_NAME_PATTERN.test(name)) {
    return null
  }

  return NAME_RULE
}
