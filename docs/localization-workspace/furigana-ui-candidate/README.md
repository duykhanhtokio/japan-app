# Furigana presentation candidate — 2026-10-20

Status: OPEN / not applied to the runtime presentation.

The saved route, JapaneseRuby component and paired-ruby browser harness add source-aligned readings to both panels, reserve ruby line height and preserve NPC progressive reveal. Candidate files end in `.pending.txt`; the active route/component remain at their previous version.

Verified separately: six authored NPC readings for SC-LOC-001-01-001, source/speaker/scenario matching, malformed-reading rejection, partial-word reveal guard and real app-loader coverage. Native review remains false.

Visual blocker: Chromium153 repeatedly closed during page/font rendering, with font-loading NetworkError or Target page/context/browser closed. React19.1/react-native-web0.21.2 and Noto fonts were installed in scratch; standard and serverless launch arguments were tried. No screen fit or native-device approval is claimed. Resume with a working browser or simulator, apply the three candidates, run the paired-ruby harness at representative portrait/tablet/landscape sizes, inspect screenshots, correct layout, then publish the runtime presentation change.

Reference: 2026-10-19 20.37の画像.jpeg, Library libfile_c163d3aec1f0819194635ce78409114a. Hiragana is small above its matching kanji; no guessed px values. DIALOGUE-FURIGANA-001 remains OPEN across the rest of the corpus.

Candidate mapping: `DialogueRoute.tsx.pending.txt` → `src/app/world/dialogue/[scenarioId].tsx`; the other candidate basenames map to their original component/script paths.
