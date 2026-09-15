# JLPT UI lock rules

1. The approved N1 interface is the only visual and interaction reference for all JLPT exams.
2. Do not redesign, modernize, restyle, rename, replace, or bypass the locked files.
3. Do not use `RoyalInfoPanel`, `RoyalButton`, `RoyalOptionRow`, `N1ExamCatalog`, `N1Official201207Test`, or `N1Official201212Test` in an exam-taking route.
4. New exams must be integrated through data/adapters with independent exam IDs, question IDs, answer state, session key, audio mapping, explanations, and result state.
5. Never expose answers, transcripts, or explanations before submission.
6. Preserve selection color, persisted state, navigation, progress, submission, review, language fallback, and audio behavior exactly as approved.
7. Never modify or overwrite `src/data/jlpt-official/n1-2012-12/explanations.13-locales.json` or `assets/jlpt/n1/2012-12/audio/n1-2012-12.mp3` without explicit user instruction.
8. Run `node scripts/check-jlpt-approved-ui-lock.mjs` before and after every JLPT change.
9. If the lock check fails or a new exam cannot be integrated without changing a locked file, stop and ask the user. Do not update the hashes to make the failure disappear.
10. Visual completion requires an iPhone-sized runtime check and screenshots.
