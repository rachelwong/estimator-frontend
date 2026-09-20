import { PARTICIPANT_COLOUR_CLASS } from '@/constants'
import type { ParticipantColours, RevealPayload } from '@/types'

// Everyone the Reveal names, each given one colour to wear across the whole
// ended screen — their Square, their badge in a crowded Square's tooltip, and
// the legend.
//
// The palette is handed out in order from a per-Session starting point, so
// nothing about a person's name decides their colour. The seed is the Session
// id: the pairing is arbitrary across Sessions, identical for everyone looking
// at this one, and unchanged by a refresh — a colour anyone calls out means the
// same thing on every screen in the room.
//
// Names are the key because they're unique within a Session: the backend's
// makeUniqueName suffixes a duplicate to "Ada-1" before storing.
export function participantColours(reveal: RevealPayload | undefined, seed: string) {
  if (!reveal) {
    return new Map() as ParticipantColours
  }

  const names = [...reveal.squares.flatMap((square) => square.names), ...reveal.abstained].sort(
    (a, b) => a.localeCompare(b),
  )

  const offset = paletteOffset(seed, PARTICIPANT_COLOUR_CLASS.length)

  return new Map(
    names.map((name, index) => [
      name,
      PARTICIPANT_COLOUR_CLASS[(offset + index) % PARTICIPANT_COLOUR_CLASS.length],
    ]),
  ) as ParticipantColours
}

// Where in the palette the first name starts. Rotating the palette is a
// permutation of it, so every colour is still reached before any repeats —
// everyone has their own until a seventeenth person joins, exactly as walking
// the palette from the top would give. Summing the Session id's characters is
// enough spread for a starting point, and nothing here has to be
// cryptographic — it only picks colours.
function paletteOffset(seed: string, length: number): number {
  const sum = [...seed].reduce((total, character) => total + character.codePointAt(0)!, 0)

  return sum % length
}
