# N4 2021-12 conversion checkpoint

```text
BASE HEAD: b97e9f6c4f54a8f9646923393491fd7d9feaae5e
EXAM ID: n4-2021-12-exam-09
STATUS: complete runtime candidate; external answers and audio timing remain unverified
DATE: 2026-09-27 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2021/Đề N4 T12-2021 Mark.pdf`
- PDF SHA-256: `2224d3381bfdd399721ae646cb862f8f1ddf56212304772de53afcdf923a24e5`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2021/Nghe N4 T12-2021 bản chuẩn Yuuki Bùi.mp3`
- Audio SHA-256: `ee1d6e27c114736c2d2d66c87f3d4889b281d10c3d9978b2fc78366edc4365a6`
- Runtime MP3 SHA-256: `4f51258f5a87596d53847e5a983f9c7a016860eb8acbf603d7aa10144f4d6009`
- Source duration: `2327.196625` seconds = `2,327,196.625` milliseconds; runtime ceiling `2,327,197 ms`.

PDF page 1 explicitly prints `2021年12月・日本語能力試験・N4`. All 20 pages were rendered once as a batch and visually checked. Pages 1–12 contain the written test; pages 13–20 contain all `8 + 7 + 5 + 8` listening response positions.

## Recovery and answer provenance

- The supplied scan jumps from vocabulary overall question 11 to 13. Independent reconstruction `https://www.scribd.com/document/1056799871/JLPT-N4-2021-12` supplies question 12 as `わからない かんじを じしょで しらべる。` with choices `探べる / 知べる / 調べる / 研べる` and answer 3.
- The same reconstruction supplies all written and listening answer sequences. It is not an official answer sheet; every answer is stored as `external_reconstruction_unverified`, with AI content checks and audio checks for listening.
- Independent listening transcript `https://aixinjp.com/a/lianxifangshi/zhentidaan/2021/1221/1001.html` matches the supplied recording and the four listening answer sequences.
- Listening problem 1 question 1 has an unresolved source inconsistency: the supplied PDF prints choice 1 as `パン`, while both the recording and independent transcript say `砂糖`. The external answer sequence gives option 2. The runtime preserves the supplied printed choices and the external answer, and records this as unverified rather than silently rewriting source text.

## Runtime candidate

- `written.partial.json`: 57/57 complete responses; payload SHA-256 `f86ffa5bb46d3a80bd1c4bacf5d4809d7c37dd2a6a998b18a63fa02f4b83b696`.
- `listening.partial.json`: 28/28 complete responses; payload SHA-256 `7df6b0df5b49cf4275408b2a943221f424940d3c93103917b86120734692cd43`.
- Six question-specific visual assets were cropped from the supplied PDF. No full PDF page is exposed as a runtime question.
- The approved N4/N5 runner uses the complete recording. All 28 stored question ranges remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- Japanese transcripts were used only to verify prompt/choice content; transcripts are not exposed before submission.
- The exam is registered as `n4-2021-12-exam-09` through the shared approved UI. No UI-lock file, layout, route, or interaction behavior was changed.

## Remaining local review items

- No source-backed explanations or translations exist.
- Answers come from an independent reconstruction rather than an official answer sheet.
- Per-question timing has no authoritative source or perceptual human approval.
- Listening problem 1 question 1 retains the explicit PDF/audio inconsistency described above.

## Validation gate

Run exactly once at completion:

```bash
node scripts/check-n4-2021-12-integration.mjs
node scripts/check-jlpt-approved-ui-lock.mjs
git diff --check
```

After the narrow commit, push, fetch, and require `node scripts/check-work-persistence.mjs` to print `WORK PERSISTENCE PASS` before advancing.
