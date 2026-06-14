# Mock EcoCash Payment

## Purpose of mock payment

This module adds a demo-only EcoCash USSD payment flow for guest bookings. It does not process real mobile money settlements and it does not mark payments as fully paid automatically.

## Why the tel link uses `%23` instead of `#`

The USSD code ends with `#`. In a URL, `#` must be encoded as `%23` so the browser treats it as part of the dial command instead of a page fragment.

- Encoded href: `tel:*153*1*1*0788064458*50%23`
- Display text: `*153*1*1*0788064458*50#`

## Payment flow steps

1. Guest creates a booking
2. Booking is stored as `PENDING`
3. Payment is stored as `UNPAID`
4. Guest opens `/booking/payment/[reference]`
5. Guest clicks `Pay Now`
6. Guest taps `Open EcoCash Dialer`
7. Phone opens the mock EcoCash USSD code
8. Guest returns to the site and clicks `I Have Paid`
9. System marks payment as `PENDING`
10. Booking `paymentStatus` becomes `PENDING`

## Status transition

- Payment: `UNPAID` to `PENDING`
- Booking payment status: `UNPAID` to `PENDING`
- Booking status remains `PENDING`

## Why the system does not mark payment PAID automatically

The USSD flow is only a demo trigger. The application does not receive a trusted payment callback from EcoCash in this module, so automatic payment approval would be incorrect.

## Desktop limitation of tel links

`tel:` links may not work on desktop browsers. Guests should open the payment page on a phone to test the USSD experience.

## Future Paynow integration note

Real payment automation and confirmation are deferred to a later module. This mock flow only captures a guest-submitted payment confirmation for manual follow-up.

## Testing checklist

- Create a booking from `/booking`
- Open the payment page
- Click `Pay Now`
- Confirm the EcoCash dialer button appears
- On a phone, tap the button and confirm the dialer shows `*153*1*1*0788064458*50#`
- Return to the website and click `I Have Paid`
- Confirm payment status changes to `PENDING`
- Confirm booking payment status changes to `PENDING`
- Confirm `paidAt` remains `null`
- Confirm an `AuditLog` record is created
- Confirm `/booking/success/[reference]` loads
