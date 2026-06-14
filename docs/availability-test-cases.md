# Availability Test Cases

## Core overlap and filtering cases

1. Same-day checkout and check-in is allowed.
   Existing: `2026-07-01` to `2026-07-03`
   Requested: `2026-07-03` to `2026-07-05`
   Expected: allowed

2. Overlapping confirmed booking blocks room.
   Existing: `CONFIRMED`, `2026-07-01` to `2026-07-03`
   Requested: `2026-07-02` to `2026-07-04`
   Expected: blocked

3. Cancelled booking does not block room.
   Existing: `CANCELLED`, `2026-07-01` to `2026-07-03`
   Requested: `2026-07-02` to `2026-07-04`
   Expected: allowed

4. Maintenance block makes room unavailable.
   Maintenance: `2026-07-10` to `2026-07-12`
   Requested: `2026-07-11` to `2026-07-13`
   Expected: blocked

5. Room status `MAINTENANCE` is unavailable.
   Expected: room excluded from available results

6. Capacity below guest count is unavailable.
   Room type capacity: `2`
   Requested guests: `3`
   Expected: room excluded

7. Inactive room is unavailable.
   Expected: room excluded

8. Fully booked branch shows warning.
   Expected: available count `0`, `isFullyBooked = true`

9. Any room type search works.
   Expected: returns any qualifying active room type in the branch

10. Specific room type search works.
    Expected: returns only qualifying rooms for that room type
