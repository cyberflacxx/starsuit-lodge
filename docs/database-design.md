# Starsuit Lodges Database Design

## Database overview

Module 2 introduces the PostgreSQL data model for Starsuit Lodges using Prisma ORM. The schema is designed to support two current branches, public booking flows, internal lodge operations, content management, payment tracking, and future Supabase deployment.

## Main entities

- `Branch`: lodge branch records for Mutare and Chipinge.
- `RoomType`: reusable pricing and capacity definitions for Standard, Deluxe, and Executive rooms.
- `Room`: individual physical rooms tied to branches and room types.
- `Guest`: guest identity and contact records.
- `Booking`: reservation records with dates, guest data, transport flags, status, and payment state.
- `Payment`: one-to-one payment records for bookings.
- `AdminUser`: future staff/admin identities that will later be linked to Supabase Auth.
- `GalleryImage`: public media metadata for branch and room content.
- `Service`: public and branch-specific service listings.
- `ContentBlock`: editable website content blocks for global or branch-specific sections.
- `RoomMaintenanceBlock`: date ranges that block room usage for maintenance or operational reasons.
- `AuditLog`: staff-facing activity trail for critical actions across bookings, payments, and room status changes.

## Relationship summary

- One `Branch` has many `Room`, `Booking`, `AdminUser`, `GalleryImage`, `Service`, and `ContentBlock` records.
- One `RoomType` has many `Room` and `Booking` records.
- One `Guest` can have many `Booking` records.
- One `Booking` belongs to one `Branch`, one `RoomType`, one `Guest`, and optionally one assigned `Room`.
- One `Booking` can have one `Payment` and many `AuditLog` records.
- One `Room` can have many `RoomMaintenanceBlock` records.
- One `AdminUser` can have many `AuditLog` records.

## Booking availability principle

Availability is not fully implemented in Module 2, but the schema already supports it:

- `Booking` stores requested branch, room type, and optional final room assignment.
- `RoomMaintenanceBlock` stores periods when a room must be excluded.
- `Room.status` and `Room.isActive` allow temporary operational blocking.
- Future availability checks can compare requested dates against bookings and maintenance blocks before assigning rooms.

## Payment principle

- Every booking can own a single `Payment` record.
- Payment method and payment status are separated so the system can track pending, failed, paid, or refunded states cleanly.
- Money fields use PostgreSQL decimal columns to avoid floating-point errors.
- Mock EcoCash is already modeled but not connected to any payment workflow yet.

## Admin role principle

The schema prepares for role-based access without implementing auth yet:

- `SUPER_ADMIN` for platform-wide oversight.
- `BRANCH_ADMIN` for branch-scoped management.
- `RECEPTIONIST` for daily operational workflows.
- Optional `branchId` allows staff to be global or branch-specific.

## Why PostgreSQL fits this project

- Strong relational integrity for bookings, rooms, and payments.
- Good support for indexes, JSON metadata, decimal money fields, and string arrays.
- Mature support inside Prisma and Supabase.
- Well-suited for future reporting, filtering, and transactional booking workflows.

## Notes for Supabase deployment

- `DATABASE_URL` should point to the Supabase Postgres instance in production.
- `AdminUser.supabaseUserId` is reserved for linking staff records to Supabase Auth users later.
- Media files can move from placeholder paths to Supabase Storage without changing the relational design.
- Prisma migrations should be run carefully against shared environments once Module 3 introduces auth and role rules.
