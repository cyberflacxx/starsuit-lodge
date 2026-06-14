# Demo Testing Checklist

## Public Website

- Homepage loads
- Branches load
- Rooms load
- Gallery loads
- Contact page loads
- Mobile layout works

## Booking

- Availability works
- Fully booked message works
- Guest details validation works
- Pickup point is required when pickup is selected
- Booking creates a database record
- Payment record is created as `UNPAID`
- Mock payment changes status to `PENDING` only

## Admin

- Login works
- Role-based branch access works
- Branch admin cannot access another branch
- Receptionist cannot edit restricted content
- Admin can verify payment
- Admin can confirm booking only after payment is `PAID`
- Reports load
- CSV export works

## Deployment

- `npm run build` passes
- Vercel deployment succeeds
- Supabase migrations deploy
- Seed data exists
- Environment variables are set correctly
