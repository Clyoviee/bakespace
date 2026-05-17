# Security Specification

## Data Invariants
1. A booking must have a valid `userId` that matches the authenticated user (unless being updated by an admin).
2. A user can only read their own bookings and notifications.
3. Admins have full read access to all collections and can update bookings (status, paymentStatus).
4. Courses are publicly readable but only editable by admins.
5. User profiles are only editable by the owner or admins.

## The "Dirty Dozen" (Attack Payloads)
1. Creating a booking for another user ID.
2. Updating `role` to 'admin' in own user profile.
3. Deleting a course as a regular user.
4. Reading another user's notifications.
5. Updating a booking after it's been 'Completed' or 'Cancelled' (unless admin).
6. Creating a course as a regular user.
7. Injecting 1MB of text into the `name` field of a user profile.
8. Updating someone else's booking status as a regular user.
9. Injecting script tags into `courseTitle`.
10. Creating a notification for another user as a regular user.
11. Bypassing schema by adding `isVerified: true` to a user profile.
12. Updating `id` field of a booking to something that doesn't match the record ID.

## Security Rules Strategy
1. Use `isValidId` for all document ID variables.
2. Use `isValid[Entity]` for all create and update operations.
3. Use `affectedKeys().hasOnly()` to restrict updates to specific fields.
4. Implement `isAdmin` with a fallback for the bootstrapped admin emails.
5. Enforce `email_verified == true` for write operations (if supported by the environment, but I'll make it flexible if the user email from metadata shows it's false).
   Wait, the user email `cia@gmail.com` has `emailVerified: false`. I should probably skip mandating `email_verified == true` for now to avoid blocking the user, but I'll add a comment about it.

