# Starsuit Lodges

Starsuit Lodges is a full-stack lodge booking demo system for Mutare and Chipinge. It includes a public website, booking flow, mock EcoCash payment demo, role-based admin portal, content management, notifications, and operational reporting.

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma
- Supabase PostgreSQL
- Supabase Auth
- Tailwind CSS
- Recharts
- Nodemailer

## Features

- Public marketing website
- Branch and room browsing
- Availability search
- Guest booking flow
- Mock EcoCash payment submission flow
- Admin login and role-based access
- Booking and payment management
- Reports and CSV export
- Content and gallery management

## Modules

1. Foundation
2. Prisma schema and seed data
3. Supabase auth and admin access
4. Public website
5. Branch management
6. Room management
7. Availability engine
8. Guest booking PWA flow
9. Mock EcoCash payment flow
10. Admin booking management
11. Notifications
12. Website content management
13. Reports and dashboard
14. Deployment and demo readiness

## Local Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Required:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

Optional for demo email:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`

## Prisma Commands

```bash
npx prisma generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
npm run db:reset
```

## Supabase Setup Summary

- Create a Supabase project
- Add pooled and direct database connection strings
- Run `npm run prisma:deploy`
- Run `npm run prisma:seed`
- Create the demo auth users listed in `docs/deployment/supabase-setup.md`
- Log in once with each user to link `AdminUser.supabaseUserId`

## Vercel Deployment Summary

- Push the repo to GitHub
- Import it into Vercel
- Add the required environment variables
- Deploy with `npm run build`
- Verify homepage, booking flow, admin login, and reports

## Demo Accounts

The repository seeds admin records for:

- `superadmin@starsuitlodges.com`
- `mutare@starsuitlodges.com`
- `chipinge@starsuitlodges.com`
- `reception@starsuitlodges.com`

Passwords are intentionally not stored in the repository.

## Mock EcoCash Demo Note

The demo keeps this public USSD flow active:

- Dial string: `*153*1*1*0788064458*50#`
- Tel link constant: `tel:*153*1*1*0788064458*50%23`

Public users can only move the mock payment to `PENDING`. Only admin verification can mark a payment as `PAID`.

## Folder Structure Summary

- `app/`: routes, layouts, route handlers, metadata files
- `components/`: public, admin, booking, payment, and shared UI
- `lib/`: auth, Prisma, business logic, reports, validations, formatters
- `prisma/`: schema, migrations, seed file
- `docs/`: deployment, demo, and module docs
- `scripts/`: deployment and demo verification scripts

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run demo:verify
```
