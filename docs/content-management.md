# Content Management

Module 12 adds a central website content workspace at `/admin/content`.

## Scope

- `ContentBlock` records manage publishable website copy with `DRAFT`, `PUBLISHED`, and `ARCHIVED` states.
- `Service` records manage guest-facing service highlights with active or inactive visibility.
- `GalleryImage` records manage public gallery imagery, featured flags, sorting, and soft-disable behaviour.

## Access Rules

- `SUPER_ADMIN` can view and manage global and branch-specific content.
- `BRANCH_ADMIN` can view global content plus their branch content, and can only create or edit records for their assigned branch.
- `RECEPTIONIST` can view the content dashboard but cannot create, edit, or disable records.

## Public Rendering Rules

- Public content blocks render only when status is `PUBLISHED`.
- Branch-specific content blocks override global blocks when the same key exists.
- Services and gallery images render only when `isActive` is true.
- Featured gallery sections render only images where `isFeatured` is true.

## Suggested Keys

- `home-hero`
- `home-services`
- `about-company`
- `contact-display`
- `booking-policy`
- `cancellation-policy`

## Audit Logging

Each content, service, and gallery create or update action writes an `AuditLog` entry. Gallery disable actions are soft deletes and also write an audit record.

## Storage Note

`lib/storage/gallery-storage.ts` is a safe placeholder for a future upload implementation. Module 12 uses direct image URLs for gallery management.
