import { PARTICIPANT_COLOUR_CLASS } from '@/constants'
import type { ParticipantColours, RevealPayload } from '@/types'

// Everyone the Reveal names, each given one colour to wear across the whole
// ended screen — their Square, their badge in a crowded Square's tooltip, and
// the legend.
//
// The palette is walked from a seeded starting point in seeded steps rather
// than in order, so nothing about a person's name decides their colour. The
// seed is the Session id: the pairing is arbitrary across Sessions, identical
// for everyone looking at this one, and unchanged by a refresh — a colour
// anyone calls out means the same thing on every screen in the room.
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

  const colourAt = paletteWalk(seed, PARTICIPANT_COLOUR_CLASS)

  return new Map(names.map((name, index) => [name, colourAt(index)])) as ParticipantColours
}

// The seed decides two things: which colour the first name wears, and how far
// along the palette each following name steps. An odd stride is coprime with
// the palette's sixteen entries, so the walk reaches every colour before it
// repeats — everyone has their own until a seventeenth person joins, exactly
// as walking the palette in order would give. (Sixteen being a power of two is
// what makes every odd stride coprime; a palette of, say, eighteen colours
// would need the stride picked more carefully.)
function paletteWalk(seed: string, palette: readonly string[]): (index: number) => string {
  const hash = hashSeed(seed)
  const start = hash % palette.length
  const stride = ((Math.floor(hash / palette.length) % (palette.length / 2)) * 2) + 1

  return (index) => palette[(start + index * stride) % palette.length]
}

// The Session id folded into a number. Every product stays well under 2^53, so
// plain arithmetic is exact and no bit twiddling is needed. Nothing here has to
// be cryptographic — it only picks colours.
function hashSeed(seed: string): number {
  let hash = 0

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647
  }

  return hash
}
