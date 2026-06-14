# Guest Booking PWA

## Booking flow

1. Guest checks availability on `/booking`
2. Guest continues with a selected room or selects a room on `/booking/details`
3. Guest enters personal details, transport details, and reviews the stay
4. System re-checks availability before writing the booking
5. System creates a pending booking and an unpaid mock EcoCash payment
6. Guest is redirected to `/booking/payment/[reference]`

## Guest details captured

- First name
- Surname
- ID number or passport number
- Gender
- Phone number
- Email address
- Number of guests
- Booking for one guest or two guests
- Special requests

## Transport logic

- `OWN_CAR` requires `hasOwnCar`
- Parking is only valid when the guest has their own car
- `NEED_PICKUP` requires `needsPickup`
- Pickup point is required whenever pickup is requested

## Availability re-check rule

- Availability is checked once during the public availability search
- Availability is checked again before showing booking details
- Availability is checked again immediately before booking creation
- Booking creation also checks overlapping bookings and maintenance blocks inside the database transaction

## Booking and payment status

- New bookings are created with `PENDING`
- New payments are created with `UNPAID`
- Payment method is `MOCK_ECOCASH`

## PWA behavior

- Manifest is exposed at `/manifest.json`
- Booking flow starts from `/booking`
- App uses standalone display mode and the Starsuit color theme
- No service worker is added in this module

## Testing checklist

- Open `/booking`
- Search for available rooms
- Continue with a room card
- Complete the guest details flow
- Submit with own car and parking
- Confirm redirect to `/booking/payment/[reference]`
- Confirm booking record exists with `PENDING`
- Confirm payment record exists with `UNPAID`
- Try pickup without a pickup point and confirm the validation error
- Create a conflicting booking for the same room and dates, then retry the original flow and confirm the room-unavailable error
- Open `/booking` in a mobile viewport and confirm the booking flow works at narrow widths
