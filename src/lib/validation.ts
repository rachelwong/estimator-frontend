// Mirrored from estimator-backend/src/utils/validation.ts — keep in step.
//
// Checking here means the common rejection, a symbol in the name, never reaches
// the wire. The server's own INVALID_NAME stays the backstop, not the usual path.
//
// The rule itself is PARTICIPANT_NAME_PATTERN in lib/patterns.ts. The server
// trims the ends the same way before it validates, so stray whitespace at the
// ends is never what fails. Case and interior spacing are kept as typed.
//
// Each check says only whether the value passes. The message a page shows
// for a failure is content (validation.*), so it follows the theme.
import { PARTICIPANT_NAME_PATTERN, WHITESPACE_RUN_PATTERN } from "@/lib/patterns";

const MAX_NAME_LENGTH = 20;

export const MAX_DESCRIPTION_LENGTH = 300;

// Judged with the ends trimmed, as the server stores it.
export function isNameValid(name: string): boolean {
  const trimmed = name.trim();

  return trimmed.length <= MAX_NAME_LENGTH && PARTICIPANT_NAME_PATTERN.test(trimmed);
}

// Trim the ends, collapse every whitespace run to one space. What the
// description is counted on, and what the server stores.
export function normalizeDescription(description: string): string {
  return description.trim().replace(WHITESPACE_RUN_PATTERN, " ");
}

// Blank is fine: the description is optional. The server's INVALID_DESCRIPTION
// stays the backstop.
export function isDescriptionValid(description: string): boolean {
  return normalizeDescription(description).length <= MAX_DESCRIPTION_LENGTH;
}
