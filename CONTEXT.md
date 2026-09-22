# Estimator

Planning poker with two axes. A team estimates a task by picking a square on a
Time × Resources grid instead of a single number. Everyone picks in private, and
all the picks are shown together at the end.

## Language

### The session

**Session**:
One round of estimating, created by one person and shared with a team by link.
Lives in memory on the server and is lost when the server restarts.
_Avoid_: Room, game, meeting, poll

**Participant**:
Someone who has joined a Session by name. Created fresh on every join — a
refresh makes a new Participant, not the same one back.
_Avoid_: User, player, member, attendee

**Admin**:
The Participant who created the Session. Estimates like everyone else, and can
also end the Session. Nothing more.
_Avoid_: Host, owner, facilitator, moderator

**Admin token**:
The secret the server hands the creator's browser, proving they are the Admin.
Different from the session link, which is public and shared with everyone.
_Avoid_: Password, key, credential, auth token

### The grid

**Point system**:
Which numbers can appear on the axes — either Numerical or Fibonacci — together
with the highest value the Admin allowed.
_Avoid_: Scale, sequence, mode

**Axis values**:
The actual list of numbers on an axis, worked out from the Point system. Both
axes use the same list, so the grid is always square.
_Avoid_: Ticks, steps, options

**Square**:
One cell of the grid. Means a pairing of a Time value and a Resources value.
_Avoid_: Cell, box, tile, point

**Selection**, also **Estimate**:
The one Square a Participant is currently holding, or none. Picking a different
Square moves it. Picking the same Square again clears it. Two names for the same
thing: **Estimate is the display term** — what the UI says to a Participant
("Make your Estimate", "your estimates", "Estimating is closed") — and Selection
is the structural one, used in code, in the data model, and in copy about the
mechanics of holding and clearing a Square ("clear your selection").
_Avoid_: choice, guess, answer, vote

**Area**:
Every Square from the origin up to and including a given Square — the Time ×
Resources the Square stands for. Shown for the Selection and for the Square
under the pointer, never in the Reveal.
_Avoid_: Region, range, footprint

### The ending

**Reveal**:
What everyone sees once the Session ends — every Square with the names of the
Participants who chose it, plus the Abstained list.
_Avoid_: Results, summary, outcome, tally

**Abstained**:
The Participants who joined but had no Selection when the Session ended. Someone
who left early and someone who stayed and chose nothing look the same here.
_Avoid_: Skipped, passed, idle

## Notes

- **Estimate is what people see, Selection is what the code calls it.** They
  name the same thing, so never put both in one sentence as if they differed.
  Whichever word is used, nothing is counted or scored — the Reveal just shows
  where people landed, and the team talks it over.
- **Never vote.** Not the noun, not the verb, not "voting". It frames the
  Reveal as a tally with a winner, which is the one reading this tool exists to
  avoid.
- **Time and Resources are labels, not units.** Neither document says whether
  Time means hours or days. The team decides between themselves.
