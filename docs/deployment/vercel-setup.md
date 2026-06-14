# Vercel Setup

## Step 1

Push the project to GitHub.

## Step 2

Import the repository into Vercel.

## Step 3

Add these environment variables in Vercel:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- SMTP variables if you want email notifications enabled

## Step 4

Set the build command:

```bash
npm run build
```

## Step 5

Set the install command:

```bash
npm install
```

## Step 6

Deploy the project.

## Step 7

After deploy:

- Visit the public homepage
- Visit `/booking`
- Visit `/admin/login`
- Test login
- Create a booking
- Test the mock EcoCash payment flow on a phone
- Test admin payment verification
