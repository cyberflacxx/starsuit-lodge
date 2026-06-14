# Supabase Setup

## Step 1

Create a new Supabase project for the Starsuit Lodges demo.

## Step 2

Copy the database connection strings into your environment file:

- `DATABASE_URL`: use the Supabase pooled connection string for Prisma runtime access
- `DIRECT_URL`: use the direct PostgreSQL connection string for Prisma migrations when pooled mode is enabled

## Step 3

Run database migrations:

```bash
npm run prisma:deploy
```

## Step 4

Seed the demo dataset:

```bash
npm run prisma:seed
```

## Step 5

Configure Supabase Auth:

- Enable the Email and Password provider
- Create these demo users:
  - `superadmin@starsuitlodges.com`
  - `mutare@starsuitlodges.com`
  - `chipinge@starsuitlodges.com`
  - `reception@starsuitlodges.com`

## Step 6

Log in once with each demo user so `AdminUser.supabaseUserId` can link by email.

## Step 7

Optional Supabase Storage setup:

- Create a bucket for gallery images
- Use public read only for public-facing image assets
- Keep upload permissions restricted to trusted admin-side flows
