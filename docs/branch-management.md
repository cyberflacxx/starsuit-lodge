# Branch Management

## Purpose

The branch management module allows authorized admin users to view and update the lodge branch details that power the public website.

## Role permissions

- `SUPER_ADMIN`: can view and edit all branches.
- `BRANCH_ADMIN`: can view and edit only the assigned branch.
- `RECEPTIONIST`: can view only the assigned branch and cannot edit.
- Admin users without an assigned branch cannot manage branches unless they are `SUPER_ADMIN`.

## Editable fields

- Branch name
- Slug
- Description
- Address
- City
- Phone
- Email
- Map URL
- Active status

## Public website impact

Branch updates affect:

- homepage branch highlights
- `/branches`
- `/branches/[slug]`
- `/contact`

These pages are revalidated after a successful branch update.

## Audit logging behavior

Every successful branch update creates an `AuditLog` entry with:

- `action: UPDATE`
- `entity: Branch`
- `entityId: <branch id>`
- `description: Branch details updated`

When simple to compute, changed fields are stored in metadata.

## Testing checklist

1. Login as `SUPER_ADMIN` and confirm both branches are visible and editable.
2. Login as each `BRANCH_ADMIN` and confirm only the assigned branch is visible.
3. Try opening another branch edit URL manually as a branch admin and confirm access is blocked.
4. Login as `RECEPTIONIST` and confirm branch view is allowed but editing is blocked.
5. Update a branch and verify the public site reflects the change after refresh.
