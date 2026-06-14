# Starsuit Lodges Auth Setup

## Supabase project

1. Create a Supabase project.
2. Copy the project URL into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the anonymous key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
5. Keep `DATABASE_URL` pointed at the same Postgres database used by Prisma.

## Enable auth

1. In Supabase Auth, enable Email and Password sign-in.
2. Do not enable public admin self-registration for this project.
3. Use strong passwords for all demo users.

## Create demo auth users

Create these users manually in Supabase Auth:

- `superadmin@starsuitlodges.com`
- `mutare@starsuitlodges.com`
- `chipinge@starsuitlodges.com`
- `reception@starsuitlodges.com`

These users must already exist in the Prisma `AdminUser` table from the seed data.

## Identity linking

- On first successful login, `getCurrentAdminUser()` looks for a Prisma `AdminUser` by `supabaseUserId`.
- If no direct match exists, it falls back to matching by email.
- When an email match is found and `supabaseUserId` is still empty, the function links the current Supabase user id to the existing Prisma admin record.
- The link is stored in Prisma so future logins resolve directly by `supabaseUserId`.

## Security notes

- Do not store passwords in Prisma.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Supabase manages authentication tokens and session cookies.
- Prisma remains the source of truth for system role and branch assignment.
