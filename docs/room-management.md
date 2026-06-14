# Room Management

## Purpose

The room management module gives lodge authorities control over global room types, branch-specific rooms, room status, and maintenance blocking.

## RoomType versus Room

- `RoomType` is global and defines pricing, capacity, bed type, and amenities.
- `Room` belongs to a single branch and references one global room type.

## Room status meanings

- `AVAILABLE`: ready for future booking assignment.
- `OCCUPIED`: currently in use or manually marked as occupied.
- `MAINTENANCE`: unavailable because of maintenance work.
- `BLOCKED`: unavailable for operational reasons outside maintenance.

## Maintenance blocking behavior

- Creating a maintenance block sets the target room status to `MAINTENANCE`.
- Removing a maintenance block returns the room to `AVAILABLE` when no active maintenance block remains.
- This prepares the project for date-based availability logic in the next module.

## Role permissions

- `SUPER_ADMIN`: manage all room types, rooms, and maintenance blocks.
- `BRANCH_ADMIN`: read all room types, manage only rooms and maintenance blocks for the assigned branch.
- `RECEPTIONIST`: read-only access to assigned branch rooms.

## Testing checklist

1. Confirm a super admin can create and edit room types.
2. Confirm a super admin can create and edit rooms across both branches.
3. Confirm a branch admin can manage only rooms in the assigned branch.
4. Confirm a receptionist sees room data but no edit controls.
5. Create a maintenance block and verify the room status changes to `MAINTENANCE`.
6. Remove the block and verify the room returns to `AVAILABLE` when no other active block remains.
7. Confirm inactive room types disappear from the public `/rooms` page.

## How this prepares the availability engine

This module establishes the authoritative room inventory and status model that the availability engine will use next. The next module can now calculate availability from:

- room type capacity and pricing
- branch-specific room inventory
- current room status
- maintenance block date ranges
