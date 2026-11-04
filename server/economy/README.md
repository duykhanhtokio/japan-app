# Economy backend integration contract (NOT deployed)
Client policy lives in `src/economy/policy.ts`; ledger math in `src/economy/ledger.ts`.
These files do not enable real rewards, payments, ads, or gift-card issuance.

## Trusted API endpoints (to implement)
- GET /v1/economy/me: authenticated membership, available/held balance, redemption eligibility.
- POST /v1/economy/learning-sessions: signed activity evidence, server time verification, deduplication, minute carryover.
- POST /v1/economy/referrals: one-level attribution; anti-self-referral, eligibility and payout verification.
- POST /v1/economy/redemptions: premium-only; >=1000 JPY; atomic points hold, budget checks, provider fulfillment.
- GET /v1/economy/transactions: paginated ledger history.
- POST /v1/economy/store-notifications: verified App Store/Play purchase notifications, authenticated separately.
- POST /v1/economy/ad-events: verified ad-network callbacks, not client claims.

## Release blockers
1. Deploy an authenticated server and PostgreSQL with private tables and atomic transactions.
2. Verify subscription state against Apple/Google servers; handle refunds, grace periods, expiry.
3. Reject replayed sessions, forged activity, duplicate referrals and duplicate webhook deliveries.
4. Track daily/monthly redemption liability, risk limits, tax/accounting and gift-card provider compliance.
5. Build consent/privacy notices and comply with store rules for incentives and digital subscriptions.
6. Add integration tests for concurrency, idempotency, fraud, refunds and provider failures.
7. Connect Expo screens only to authenticated APIs. No secret or gift-card inventory in the app.
