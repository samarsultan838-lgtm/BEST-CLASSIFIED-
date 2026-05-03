# Security Specification: Trazot Marketplace

## 1. Data Invariants
- **Ad Responsibility**: An ad cannot be created with a status other than 'pending' by a regular user.
- **Identity Lock**: Once an ad is created, the `userId` field is immutable.
- **Relational Integrity**: Ads must belong to a valid category.
- **Admin Isolation**: Fields like `priority`, `featured`, and `status` can only be modified by admins after initial creation.
- **Temporal Integrity**: `createdAt` must match `request.time` exactly.

## 2. The "Dirty Dozen" Payloads (Anti-Patterns)
1. **Status Hijack**: Create an ad with `status: 'approved'`.
2. **Identity Theft**: Create an ad with `userId: 'attacker_id'` but signed in as `victim_id`.
3. **Escalation Attack**: Update an ad to set `featured: true` as a non-admin.
4. **Orphan Creation**: Create an ad without a `userId`.
5. **Ghost Field Injection**: Add a hidden `isVerified: true` field to a user profile.
6. **Immutable Breach**: Update an existing ad and change the `userId`.
7. **Temporal Fraud**: Set `createdAt` to a date in the past during creation.
8. **Denial of Wallet (ID Poisoning)**: Document ID with 1KB of junk characters.
9. **String Overflow**: Title field with 50,000 characters.
10. **Query Scraping**: Attempt to list all ads regardless of status as a guest.
11. **Admin Spoofing**: Update user document to `role: 'admin'`.
12. **Self-Approval**: Update own ad status to `approved`.

## 3. The Test Runner Plan
We will implement `firestore.rules.test.ts` to verify:
- Unauthenticated users can ONLY list `approved` ads.
- Users can ONLY create ads for themselves with `status: 'pending'`.
- Only admins can update `status`, `priority`, and `featured`.
- Only owners can update their own ads if they are not yet approved.
