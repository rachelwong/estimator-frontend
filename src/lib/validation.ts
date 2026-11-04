// Mirrored from estimator-backend/src/utils/validation.ts — keep in step.
//
// Checking here means the common rejection, a symbol in the name, never reaches
// the wire. The server's own INVALID_NAME stays the backstop, not the usual path.
//
// The rule itself is PARTICIPANT_NAME_PATTERN in lib/patterns.ts. The server
// trims the ends the same way before it validates, so stray whitespace at the
// ends is never what fails. Case and interior spacing are kept as typed.
import { PARTICIPANT_NAME_PATTERN, WHITESPACE_RUN_PATTERN } from "@/lib/patterns";

const MAX_NAME_LENGTH = 20;

export const MAX_DESCRIPTION_LENGTH = 300;

const NAME_RULE = "Use 1-20 letters, numbers or spaces, with no symbols.";

const DESCRIPTION_RULE = `Keep description to ${MAX_DESCRIPTION_LENGTH} characters or fewer.`;

// Returns the message to show, or null when the name is fine. Judged with the
// ends trimmed, as the server stores it.
export function nameError(name: string): string | null {
  const trimmed = name.trim();

  if (
    trimmed.length <= MAX_NAME_LENGTH &&
    PARTICIPANT_NAME_PATTERN.test(trimmed)
  ) {
    return null;
  }

  return NAME_RULE;
}

// Trim the ends, collapse every whitespace run to one space. What the
// description is counted on, and what the server stores.
export function normalizeDescription(description: string): string {
  return description.trim().replace(WHITESPACE_RUN_PATTERN, " ");
}

// Returns the message to show, or null when the description is fine. Blank is
// fine: the description is optional. The server's INVALID_DESCRIPTION stays
// the backstop.
export function descriptionError(description: string): string | null {
  if (normalizeDescription(description).length <= MAX_DESCRIPTION_LENGTH) {
    return null;
  }

  return DESCRIPTION_RULE;
}
