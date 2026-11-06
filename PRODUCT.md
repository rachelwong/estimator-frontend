# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Product and engineering teams in sprint planning, usually remote on a video call. The Admin often screen-shares
the Reveal while every Participant estimates privately on their own laptop. A secondary reader of the Welcome page
is the person deciding whether the team should try it.

## Product Purpose

Fold and Flip is planning poker with two axes. Each Participant picks one Square on a Time × Resources grid in
private; when the Admin ends the Session, every Estimate is revealed at once and the team talks over the spread.
Success is a team that reaches a shared view of a ticket's size without anyone anchoring on the first number said
aloud.

## Positioning

Nobody anchors, everyone is heard. Estimates stay hidden — even whether someone has estimated — until the Reveal,
which removes the loudest voice and the first number. The two-axis grid is how the Reveal shows where the team
agrees and where it spreads.

## Operating Context

- Run during sprint planning or refinement, one Session per ticket, alongside the team's tracker (Jira tickets and
  URLs appear in the Session description).
- The Admin shares a link; Participants join by name. No accounts, no sign-up.
- The Reveal stays live: the Admin and anyone whose tab saw the end can still change their Estimate there.

## Capabilities and Constraints

- Roles: Admin (creates and ends the Session, also estimates) and Participant. Nothing more.
- Point systems: Numerical (0 to a chosen max, up to 20) or Fibonacci (0–55 prefix). Both axes share the values.
- Sessions live in memory and expire; nothing is kept long term.
- No participant count or presence during an active Session.
- Terminology in `CONTEXT.md` is binding: Session, Participant, Admin, Square, Estimate, Area, Reveal, Abstained.
  Never "vote", "results", "player", "host". Time and Resources are labels, not units.

## Brand Commitments

- Name: Fold and Flip. Logo: the pixel card-and-spade lockup in Play, the FOLD/FLIP wordmark with the slash mark
  in Work.
- One product, two themes behind a header switch: **Play** (the pixel-art office world in DESIGN.md) and **Work**
  (a sober theme for corporate teams). Work-theme copy as written on the design canvas is fixed.
- The theme is a display choice only: same behaviour, routes and data in both. It isn't remembered; every visit
  starts on Play. Plan: `docs/plans/themes.md`.
- Built and open-sourced by Rachel Wong (frontend and backend repositories on GitHub).

## Evidence on Hand

- Real copy for Welcome, Active and Reveal on the design canvas (https://claude.ai/artifact/B8xUuTAY1pmHCQcMD5FKRc).
- No customers, testimonials, usage numbers or pricing exist; none may be invented.

## Product Principles

1. Privacy until the Reveal is the product; never leak who has estimated.
2. The Reveal shows where people landed; nothing is counted, scored or ranked.
3. Time and Resources are never collapsed into one number or one colour.
4. Zero friction to join: a link and a name.

## Accessibility & Inclusion

WCAG AA contrast. The grid is keyboard operable (roving focus, labelled Squares) and works by click or tap.
