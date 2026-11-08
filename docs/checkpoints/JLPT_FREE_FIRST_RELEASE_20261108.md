# Publisher-authorized free first release — 2026-11-08

The publisher explicitly requested all JLPT exams free and unrestricted in the first release, with commercialization postponed, and UI messages in the selected player language. This authorizes the catalog access behavior and text changes in this checkpoint.

ApprovedJlptExamCatalog.tsx SHA-256: 819b29b39b9a66aae33a05b405a7f572b7e0092461844acbdf6d5f9f84def9c5 → abd9ce9d026540d2398e4fa97b28d2864034f6efcafcbe58267f6c8319d1c276.

Scope: bypass access/ticket/Premium API checks under the freeLearning release flag; hide the paid-access notice in that mode; localize free/history messages. The exam runner, questions, scoring, sessions, saved answers, and exam UI are unchanged. useJlptExamAccess authorizes start/continue/submit locally in free mode and does not poll the entitlement service. Commercial logic is preserved behind the release flag. All other locked hashes remain unchanged.

Native visual verification remains pending. Free release access is not a claim of content or voice certification.
