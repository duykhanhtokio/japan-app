# JLPT exam selection and restart checkpoint V9

```text
STATUS: USER AUTHORIZED
DATE: 2026-09-28 (Asia/Tokyo)
SCOPE: Japanese exam catalog, attempt summary, and restart flow
```

This extends V8's sequential names and V6's answer-only review.

- Catalog labels and descriptions are Japanese. Each card shows question count, number of completed submissions, and correct percentage for the latest submission, rounded to the nearest integer. Before a submission, the percentage is an em dash.
- Attempt history is stored separately from the current exam session, survives restarting an exam, and imports the most recent saved submitted result once. Earlier submissions before this version cannot be reconstructed from a single saved session.
- The start screen no longer offers practice mode. Confirming restart goes directly to question one, without another start button. A previously saved practice session resumes under exam mode.
- The result screen no longer contains its Vietnamese explanation line; the resume prompt no longer shows a mode label.

Approved SHA-256 values (enforced by `scripts/check-jlpt-approved-ui-lock.mjs`):

```text
6220f1a439f4e454e95d34f31f1b7a24e61c533fc8709aec7152ef1c9a4bbe78  src/components/jlpt/N1OfficialTrial.tsx
ce5c86ad2fb72af86e1ff98d0ea8b16970188f68ef9aacd31721f7dd6534df52  src/components/jlpt/ApprovedJlptExamCatalog.tsx
e1b9298d38229bb8004051b2aee4cb66471ea49205fed7e5b22bbf8aba7ebca0  src/components/jlpt/ui/JlptExamUI.tsx
```

All other approved hashes remain unchanged. Runtime visual approval requires review on an iPhone simulator.
