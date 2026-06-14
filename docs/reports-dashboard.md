# Reports Dashboard

## Purpose

Module 13 adds an admin reports and dashboard area for monitoring bookings, revenue, occupancy, payments, room performance, branch performance, and today's lodge operations.

## Report Filters

- Date preset: `TODAY`, `THIS_WEEK`, `THIS_MONTH`, `LAST_30_DAYS`, `THIS_YEAR`, `CUSTOM`
- Custom ranges require both `fromDate` and `toDate`
- Maximum range is 2 years
- `SUPER_ADMIN` can filter all branches or one branch
- Branch-bound roles are server-locked to their assigned branch

## Role Access

- `SUPER_ADMIN`: all branches, branch comparison, full revenue visibility, CSV export
- `BRANCH_ADMIN`: assigned branch only, full branch-level reporting, CSV export limited to assigned branch
- `RECEPTIONIST`: operational dashboard and operations reporting only, revenue visibility restricted in the UI and enforced by scope

## Dashboard Metrics Explained

- Total bookings: bookings overlapping the selected date range
- Confirmed / cancelled / checked-in: booking counts by current status
- Paid revenue: bookings currently marked `PAID`
- Pending revenue: bookings currently marked `PENDING`
- Unpaid revenue: bookings currently marked `UNPAID`
- Pending payments: bookings currently awaiting payment confirmation
- Today's arrivals / checkouts: bookings scheduled for the current UTC day

## Revenue Calculation

- Revenue uses existing booking totals only
- Paid revenue sums bookings where `paymentStatus = PAID`
- Pending revenue sums bookings where `paymentStatus = PENDING`
- Unpaid revenue sums bookings where `paymentStatus = UNPAID`
- No fake report records are created

## Occupancy Calculation

- Occupancy rate uses assigned rooms from bookings in the selected range
- Numerator: distinct rooms with `CONFIRMED` or `CHECKED_IN` bookings
- Denominator: active rooms in scope excluding blocked rooms
- If no rooms exist, occupancy is `0%`

## Payment Summary

- Grouped by booking `paymentStatus`
- Shows counts and total booking amounts for each visible payment state

## CSV Export Behavior

- Export route: `/admin/reports/export`
- Supported types: `bookings`, `revenue`
- Scope is enforced on the server for every request
- Empty exports still return header rows only

## Data Privacy Rule

- Guest ID numbers are never included in report UI or CSV output
- Reports expose guest names and phones only where needed for operations
- Public users cannot access admin report routes

## Testing Checklist

- Open `/admin` as `SUPER_ADMIN` and confirm live metric cards render
- Open `/admin/reports` as `SUPER_ADMIN`
- Filter All Branches, Mutare, and Chipinge
- Export bookings CSV and revenue CSV
- Confirm branch comparison renders for `SUPER_ADMIN`
- Open reports as Mutare `BRANCH_ADMIN` and confirm scope stays locked to Mutare
- Repeat for Chipinge `BRANCH_ADMIN`
- Open reports as `RECEPTIONIST` and confirm operational data is visible while revenue is restricted
- Create a booking and confirm trends update
- Mark payment paid and confirm paid revenue updates
- Cancel a booking and confirm cancellation appears in booking trend
- Check in a guest and confirm occupancy changes
- Confirm public users cannot access `/admin/reports`
