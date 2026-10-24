// Every regex used by production code lives here, so the patterns can be read,
// reviewed and reused in one place instead of being buried at their call sites.
// Mirrors estimator-backend/src/utils/patterns.ts.

// 1-20 letters, digits and single interior spaces — "Jim Bob" is a name,
// "Jim@Bob" is not. The length is checked separately, in lib/validation.ts.
export const PARTICIPANT_NAME_PATTERN = /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/

// Runs of two or more spaces, collapsed to one when a name is normalized.
export const REPEATED_SPACES_PATTERN = / +/g

// Any run of whitespace — spaces, tabs, line breaks — collapsed to one space
// when a description is normalized, so it is always a single line.
export const WHITESPACE_RUN_PATTERN = /\s+/g

// An http(s) URL in a description, up to the next space, angle bracket or
// quote. Anything else, `javascript:` included, never matches and stays text.
// The last character can't be sentence punctuation (.,;:!?)]), so
// "see https://example.com." links to https://example.com. The capturing group
// makes String.split keep each URL, at the odd indexes of its result.
export const URL_PATTERN = /(https?:\/\/[^\s<>"]*[^\s<>".,;:!?)\]])/
