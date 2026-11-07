# JLPT access/session authorization — 2026-11-07

Publisher explicitly authorized access gating, ticket expiry and submitted-history preservation in DAILY_VOCAB_TICKET_CONTRACT_20261107.md. Exam styling, question rendering and grading are preserved. Native visual acceptance is pending.

| File | Before SHA256 | After SHA256 |
|---|---|---|
| `src/components/jlpt/N1OfficialTrial.tsx` | `79e2a9f066232aab1c4485e060eb247dba8f573d22c7cc09f3c5087125c02f5e` | `51c92def2da4d7bff94aeaf49f428412cf2a89b9b587dcfd14b46e604c3f9663` |
| `src/services/jlpt-trial-session-storage.ts` | `ea21a8b371feeea3453cd10c5247bcb072c92f2ef5b4c5309d83df3392d1d7e1` | `cc69a19dcdb44363871194148ff8d77a3bb70a946efc7b129836d0a30241131b` |
| `src/components/jlpt/ApprovedJlptExamCatalog.tsx` | `e57fd7e4d981f9adfe706558c01d9bfe4381098cfcc91a70445dfe5b362bb8dc` | `1f60eaaeb2110e1d68212594e76c22a5e9e63383186a9830d6b102e3d2827057` |

Account-scoped session preservation follow-up: `cc69a19dcdb44363871194148ff8d77a3bb70a946efc7b129836d0a30241131b` → `f7918d426e065ab763389555df5d4ecc3894b39987910ffb541452829c3f5e82`. Legacy device histories are retained separately and are not silently assigned to the first signed-in account.

Account-change isolation and bound archive keys follow-up:
- `src/services/jlpt-trial-session-storage.ts`: `f7918d426e065ab763389555df5d4ecc3894b39987910ffb541452829c3f5e82` → `3bce6aa62c7821d220590c45500f279c204c7fb061b372d9703c8c4cdc63ac9d`
- `src/components/jlpt/ApprovedJlptExamCatalog.tsx`: `1f60eaaeb2110e1d68212594e76c22a5e9e63383186a9830d6b102e3d2827057` → `819b29b39b9a66aae33a05b405a7f572b7e0092461844acbdf6d5f9f84def9c5`
