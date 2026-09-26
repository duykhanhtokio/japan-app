# N4/N5 integration decisions — 2026-09-26

User instructions superseding earlier catalog source-identity gates:

1. Keep the existing exam name/period label; month-level identity confirmation is not required to integrate a source-backed exam.
2. A practice test may enter the regular exam-taking flow if its question count and section structure match a real JLPT paper. Do not call a practice source an official past paper in explanatory copy.
3. When two packages duplicate the same question content, keep one and remove the duplicate from the visible catalog. N4 07/2017 duplicates N4 12/2012; retain N4 12/2012. Catalog target is now 65 entries: 15 N1, 13 N2, 17 N3, 8 N4, 7 N5, 5 mocks.
4. For a question without a printed answer key, solve it from the question/audio and record answer provenance `ai_derived_unverified`. Never label such an answer as source-key verified. If a question is illegible or underspecified, identify that exact question and ask; do not silently skip the entire exam.
5. The shared exam runner plays one recording continuously and saves its playback position. Per-question listening boundaries are **not required** to integrate an exam. If boundaries are available for later review, keep them `candidate_unverified`, `humanReviewed: false`, and `perceptualApproval: false`. Do not invent per-question ranges to satisfy a gate. The separate correction screen stores device-local changes pending a later export/apply workflow.
6. The approved exam UI remains byte-locked. Integrate through data/adapters and registries. A candidate JSON file alone is not an integrated exam.

Current state after commit `fc63b21`: five N4 packages (source label 2010–2011, 12/2012, 07/2013, 12/2013, 07/2014) and N5 07/2013 are registered in the shared exam flow. The remaining N4/N5 source packets include audio; their main blockers are missing character-level question/option text, unresolved answers or source visuals. The printed key for N4 2010–2011 written question 30 conflicts with the passage; the runtime uses answer 3 with a post-submission explanation and records this as an AI-derived correction. Continue source-level transcription and adapter registration, without treating timing as a gate.
