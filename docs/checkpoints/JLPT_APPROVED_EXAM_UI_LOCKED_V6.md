# JLPT exam review checkpoint V6

```text
STATUS: USER AUTHORIZED
DATE: 2026-09-27 (Asia/Tokyo)
SCOPE: post-submission results and review for official and mock exams
```

The user requested that every JLPT exam show only scoring, correct/incorrect/unanswered status, and the correct option. The app no longer renders detailed explanations, missing-explanation placeholders, source-page references, or listening transcripts. Pre-submission question display, continuous audio, saved answers, submission, and scoring remain in place. Existing source and translation files are retained outside the runtime review for possible later use.

This checkpoint supersedes earlier review-display descriptions. The UI remains locked at these SHA-256 values, also enforced by `scripts/check-jlpt-approved-ui-lock.mjs`:

```text
3ef2d2658b3d4ed52ec0bcf6c3dc37983dbdc18dc3efb41cbd5e5d45293f06be  src/components/jlpt/N1OfficialTrial.tsx
bb0dd35d4184a050c29e4d48d37974d9b434a41950045d9f14b801730e9a76ef  src/components/jlpt/ui/JlptExamUI.tsx
83d55506084fa1830fac69fd731b80ce5062e78ed347306e5b7787923d9f55fb  src/components/jlpt/ApprovedMockExam.tsx
```

Do not revise these hashes for subsequent changes without a new explicit user instruction. Verify the review on an iPhone-sized runtime before claiming visual acceptance.
