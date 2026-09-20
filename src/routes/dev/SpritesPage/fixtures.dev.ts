// DEV ONLY. Fixtures for the sprite sheet at /dev/sprites.
//
// Every class string here is literal: `cn build` and Tailwind's scanner only
// see classes written in the source, so a computed one would paint nothing and
// the sheet would report a sprite that never rendered.
//
// The rows are `as const` and unannotated on purpose — each sub-component
// declares its own Props and structural typing does the rest, so no shared
// shape has to be named or exported for a folder that gets deleted.

import avatarOne from '@/assets/sprites/avatar.svg'
import avatarTwo from '@/assets/sprites/avatar2.svg'
import avatarThree from '@/assets/sprites/avatar3.svg'
import avatarFour from '@/assets/sprites/avatar4.svg'
import avatarFive from '@/assets/sprites/b1.svg'
import avatarSix from '@/assets/sprites/b2.svg'
import avatarSeven from '@/assets/sprites/b3.svg'
import speechBubbleCard from '@/assets/sprites/bubble.svg'
import speechBubbleQuestion from '@/assets/sprites/bubbleq.svg'
import cardBack from '@/assets/sprites/cardback.svg'
import cardFace from '@/assets/sprites/cardface.svg'
import coins from '@/assets/sprites/coins.svg'
import cooler from '@/assets/sprites/cooler.svg'
import hourglass from '@/assets/sprites/hourglass.svg'
import laptop from '@/assets/sprites/laptop.svg'
import logoCardBack from '@/assets/sprites/logo-card-back-blank.svg'
import logoCardFront from '@/assets/sprites/logo-card.svg'
import logoSpadeAlternate from '@/assets/sprites/logo-spade-alt.svg'
import miniCard from '@/assets/sprites/minicard.svg'
import mug from '@/assets/sprites/mug.svg'
import note from '@/assets/sprites/note.svg'
import personOne from '@/assets/sprites/p1.svg'
import personTwo from '@/assets/sprites/p2.svg'
import personThree from '@/assets/sprites/p3.svg'
import personFour from '@/assets/sprites/p4.svg'
import personFive from '@/assets/sprites/p5.svg'
import personSix from '@/assets/sprites/p6.svg'
import plant from '@/assets/sprites/plant.svg'
import server from '@/assets/sprites/server.svg'
import spade from '@/assets/sprites/spade.svg'

// The cast from DESIGN.md §9, grouped the way that section lists it. `source`
// is the file the sprite came from, so a drawing on the sheet traces straight
// back to the SVG.
export const DEV_SPRITE_GROUPS = [
  {
    title: 'standing characters',
    sprites: [
      { source: 'p1.svg', url: personOne },
      { source: 'p2.svg', url: personTwo },
      { source: 'p3.svg', url: personThree },
      { source: 'p4.svg', url: personFour },
      { source: 'p5.svg', url: personFive },
      { source: 'p6.svg', url: personSix },
    ],
  },
  {
    title: 'avatars',
    sprites: [
      { source: 'avatar.svg', url: avatarOne },
      { source: 'avatar2.svg', url: avatarTwo },
      { source: 'avatar3.svg', url: avatarThree },
      { source: 'avatar4.svg', url: avatarFour },
      { source: 'b1.svg', url: avatarFive },
      { source: 'b2.svg', url: avatarSix },
      { source: 'b3.svg', url: avatarSeven },
    ],
  },
  {
    title: 'cards and bubbles',
    sprites: [
      { source: 'cardface.svg', url: cardFace },
      { source: 'cardback.svg', url: cardBack },
      { source: 'minicard.svg', url: miniCard },
      { source: 'bubble.svg', url: speechBubbleCard },
      { source: 'bubbleq.svg', url: speechBubbleQuestion },
    ],
  },
  {
    title: 'props',
    sprites: [
      { source: 'mug.svg', url: mug },
      { source: 'plant.svg', url: plant },
      { source: 'laptop.svg', url: laptop },
      { source: 'server.svg', url: server },
      { source: 'coins.svg', url: coins },
      { source: 'note.svg', url: note },
      { source: 'hourglass.svg', url: hourglass },
      { source: 'cooler.svg', url: cooler },
    ],
  },
  {
    title: 'logo marks',
    sprites: [
      { source: 'spade.svg', url: spade },
      { source: 'logo-card.svg', url: logoCardFront },
      { source: 'logo-card-back-blank.svg', url: logoCardBack },
      { source: 'logo-spade-alt.svg', url: logoSpadeAlternate },
    ],
  },
] as const

// The spade is the one sprite the design recolours — cream, on the Reveal's
// dark notice (§7). Shown beside the same sprite as drawn, and on the accent
// surface, to prove the mask picks up a real palette token.
export const DEV_SPADE_URL = spade

export const DEV_RECOLOURS = [
  { label: 'as drawn (img)', surfaceClass: 'bg-cream', labelClass: 'text-ink', colourClass: '' },
  {
    label: 'cream — the dark notice',
    surfaceClass: 'bg-ink',
    labelClass: 'text-cream',
    colourClass: 'bg-cream',
  },
  {
    label: 'white on accent',
    surfaceClass: 'bg-accent',
    labelClass: 'text-white',
    colourClass: 'bg-white',
  },
  {
    label: 'selection on ink',
    surfaceClass: 'bg-ink',
    labelClass: 'text-white',
    colourClass: 'bg-selection',
  },
] as const
