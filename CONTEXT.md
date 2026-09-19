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

**Selection**:
The one Square a Participant is currently holding, or none. Picking a different
Square moves it. Picking the same Square again clears it.
_Avoid_: Vote, choice, estimate, guess, answer

### The ending

**Reveal**:
What everyone sees once the Session ends — every Square with the names of the
Participants who chose it, plus the Abstained list.
_Avoid_: Results, summary, outcome, tally

**Abstained**:
The Participants who joined but had no Selection when the Session ended. Someone
who left early and someone who stayed and chose nothing look the same here.
_Avoid_: Skipped, passed, no vote, idle

## Notes

- **Selection, not vote.** "Vote" suggests counting and a winner. Nothing is
  counted or scored here — the Reveal just shows where people landed, and the
  team talks it over.
- **Time and Resources are labels, not units.** Neither document says whether
  Time means hours or days. The team decides between themselves.
