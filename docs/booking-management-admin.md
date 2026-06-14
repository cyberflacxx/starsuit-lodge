# Booking Management Admin

## Purpose

This module gives lodge staff a controlled admin workflow for booking review, payment verification, operational status updates, guest contact, and cancellation.

## Role access

- `SUPER_ADMIN` can view and manage bookings for all branches
- `BRANCH_ADMIN` can view and manage bookings only for the assigned branch
- `RECEPTIONIST` can view and manage bookings only for the assigned branch
- Public users cannot access booking management pages

## Booking statuses

- `PENDING`
- `CONFIRMED`
- `CHECKED_IN`
- `CHECKED_OUT`
- `CANCELLED`
- `NO_SHOW`

## Payment statuses

- `UNPAID`
- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`

## Status transition rules

- `PENDING` -> `CONFIRMED`, `CANCELLED`, `NO_SHOW`
- `CONFIRMED` -> `CHECKED_IN`, `CANCELLED`, `NO_SHOW`
- `CHECKED_IN` -> `CHECKED_OUT`
- `CHECKED_OUT`, `CANCELLED`, and `NO_SHOW` are locked unless a super admin changes them with a clear reason
- A booking can only be confirmed after payment status is `PAID`

## Mock EcoCash verification process

- Guests can only mark mock payments as `PENDING` from the public flow
- Admin staff verify the payment manually
- Admin can set mock EcoCash payment status to `PAID`, `FAILED`, or `REFUNDED`
- Payment verification does not auto-confirm the booking

## Contact guest options

- WhatsApp
- Phone call
- Email

## Cancellation rules

- Only `PENDING` and `CONFIRMED` bookings can be cancelled normally
- Cancellation requires a reason
- Cancellation adds audit logging and removes the booking from future blocking states

## Testing checklist

- Log in as `SUPER_ADMIN` and view all bookings
- Filter bookings by branch, booking status, payment status, and dates
- Open a booking detail page and verify branch access is enforced
- Mark a mock EcoCash payment as `PAID`
- Confirm the booking after payment is `PAID`
- Mark the booking `CHECKED_IN`
- Mark the booking `CHECKED_OUT`
- Cancel an eligible booking
- Mark an eligible booking as `NO_SHOW`
- Confirm audit trail entries are created for payment and booking status changes
- Confirm branch staff cannot access another branch's booking detail URL
