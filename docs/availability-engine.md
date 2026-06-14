# Availability Engine

## Purpose

The availability engine checks whether Starsuit rooms are free for a requested branch, date range, room type, and guest count before booking submission begins.

## Availability rules

A room is available only when:

- the branch is active
- the room type is active
- the room is active
- the room status is `AVAILABLE`
- the room type capacity supports the requested guest count
- no overlapping maintenance block exists
- no overlapping blocking booking exists

## Booking status blocking rules

These booking statuses block availability:

- `PENDING`
- `CONFIRMED`
- `CHECKED_IN`

These booking statuses do not block availability:

- `CANCELLED`
- `CHECKED_OUT`
- `NO_SHOW`

## Date overlap logic

Two stays overlap when:

`existing.checkInDate < requestedCheckOutDate`
and
`existing.checkOutDate > requestedCheckInDate`

## Maintenance block behavior

Maintenance blocks exclude the affected room for overlapping dates. This works together with room status so operationally unavailable rooms stay out of search results.

## Capacity rule

The engine excludes room types whose capacity is lower than the requested guest count.

## Same-day checkout and check-in rule

Same-day turnover is allowed.

Example:

- Existing booking: `2026-07-01` to `2026-07-03`
- New booking: `2026-07-03` to `2026-07-05`

This is allowed because the date overlap condition is false.

## How this prepares Module 8

Module 7 only checks availability and presents search results. Module 8 can build directly on this engine to:

- collect guest details
- choose a room from the available set
- create a booking safely
- continue toward mock payment
