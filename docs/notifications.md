# Notifications

## Purpose

This module adds server-side booking and payment notifications for guests and lodge staff.

## Email events

- Booking created
- Mock payment submitted
- Payment verified
- Booking confirmed
- Booking cancelled
- Guest checked in
- Guest checked out
- No-show

## WhatsApp click-to-chat behavior

- Admin guest contact buttons now build `wa.me` links
- Messages include the booking reference and latest booking/payment state
- WhatsApp Business API is not integrated in this module

## SMTP setup

Configure SMTP with:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`

The app checks SMTP configuration server-side only.

## Environment variables

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `NEXT_PUBLIC_APP_URL`

## Failure behavior

- Notification sending is optional
- If SMTP is missing, email notifications are skipped safely
- Notification failures do not cancel or roll back booking, payment, or admin actions

## Why notification failure does not cancel bookings

Booking and payment records are the primary business actions. Email delivery is a secondary side effect, so failures are logged without breaking the main workflow.

## Future WhatsApp Business API plan

Click-to-chat links can later be replaced or complemented by a real WhatsApp Business API integration for automated delivery and status tracking.

## Testing checklist

- Create a booking without SMTP configured and confirm the booking still succeeds
- Submit a mock payment without SMTP configured and confirm the flow still succeeds
- Configure SMTP and confirm guest/admin emails are sent for booking and payment events
- Mark payment as `PAID` and confirm the guest receives a payment verified email
- Confirm a booking and confirm the guest receives a booking confirmed email
- Open admin guest contact actions and confirm the WhatsApp message includes the booking reference
