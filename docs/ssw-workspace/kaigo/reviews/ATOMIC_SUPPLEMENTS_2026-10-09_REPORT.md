# Kaigo: traceability and independently authored detail supplements

The 276-page canonical PDF is registered page by page. This is a traceability ledger, **not a completed inventory of every original fact, label or caption**. The original-knowledge percentage remains unknown; `allSourceKnowledgeFullyCovered` remains false. Linking all pages or rendering all authored cards does not prove full knowledge coverage.

Added 79 independently authored explanation cards containing 314 grouped teaching points and 79 original explanation cases. They address the detailed gaps found in the partial audit and broaden physiology, aging, disability, communication, daily support, safety and hygiene. Each has a scope limit, a related existing lesson and a content-versioned saved answer. Forty additional 30-minute planned sessions follow the existing 56-session core. Study duration is estimated, not measured with learners.

The HTML and JSON ledger include 276 page rows, 159 existing section links, 52 language-objective links, 287 source lexical records and 314 new teaching-point rows. Some old section references drifted from the actual PDF; the new ledger corrects those references without rewriting the historical report. Lexical records include aliases and are not 287 distinct concepts. The 47 previously inspected source rows have a separate follow-up map. Their scope cannot be extrapolated to the whole book.

## Originality and content limits

Explanations and cases were authored independently. No PDF bytes, extracted source text, source figures, printed-page metadata or source URLs were added to runtime data. The same source knowledge can be taught using different text and examples; a source statement that is simplified, ambiguous or conditional is qualified rather than copied as an absolute instruction. Examples include autonomic effects, diabetes types, approximate urinary measurements, equipment-dependent grooming and individual care procedures.

A normalized exact 60-character-window screen checked 551 new fields against the private source extraction and found zero matches. This detects long identical text, not semantic imitation, visual resemblance or rights compliance. Human originality, domain and Japanese review remain pending; no rights or production readiness certification is claimed. New supplements use existing app styling and do not reproduce the source diagrams.

Primary educational cross-checks used for specific qualifications:

- [NIDDK: diabetes symptoms and causes](https://www.niddk.nih.gov/health-information/diabetes/overview/symptoms-causes)
- [NIDDK: type 1 diabetes](https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/type-1-diabetes)
- [NIDDK: urinary tract](https://www.niddk.nih.gov/health-information/urologic-diseases/urinary-tract-how-it-works)
- [NIA: memory and aging](https://www.nia.nih.gov/health/memory-loss-and-forgetfulness/memory-forgetfulness-and-aging-whats-normal-and-whats-not)
- [Alzheimers.gov: Lewy body dementia](https://www.alzheimers.gov/alzheimers-dementias/lewy-body-dementia)

## Verification

Data validation checks unique identifiers, exact editorial/runtime point and case projection, valid related lessons, all unit-to-day assignments, 30-minute supplemental sessions and revision hashes. Four deliberately broken inputs are rejected. Existing `content.json` is byte-identical to commit `49e6f67a07ed37ffd08f22f2a8442e2edcebdc50`: core lessons, old progress revisions and six mock forms remain unchanged.

The actual KaigoCourse is tested through the focused React Native Web harness, using the existing Royal components. Browser evidence and screenshots are in `runtime-tests/2026-10-09-atomic`. This scope does not include full Expo Router or an installed Android/iOS binary. The web inspection revealed the panel background painted over the static text area; Kaigo's input now uses relative positioning so it is visible above that background. Shared JLPT components were not edited.

Focused ESLint has no errors or warnings. Kaigo data/session, knowledge-depth and six-form invariant checks pass. All ten locked JLPT UI files pass their byte-lock check. Repository TypeScript still reports the pre-existing unrelated Life scenario-index TS2352 at `src/services/life-content-repository.ts:47`; no Kaigo diagnostics were reported.

## Work still required to meet the user's complete-knowledge criterion

1. Enumerate every original fact, figure label, arrow and caption separately, including pages outside the 63 recorded visual spot checks.
2. Verify a meaning-preserving app equivalent for each source atom; a page-level or section-level link is insufficient.
3. Calculate a coverage percentage only from that completed original inventory, with exceptions and missing items visible.
4. Complete professional/Japanese review and native-device tests before production release.

The separate 155-page national-exam reference containing 713 questions has not been audited in full and is not the denominator for this canonical 276-page audit.

## Final executed evidence and persistence

The browser checked 79 cards / 314 new points, reveal gating, saved answers after reload, all 54 core lesson explanations and depth blocks, 52 language task prompts and all linked terms (287 source lexical records). Final projection smoke additionally checked all 40 study-plan strings and all 52 Japanese task texts against the rebuilt runtime, plus 1088 HTML rows and the report filter. No page errors occurred.

The local implementation was rebased onto remote N2-05 commit d68ed64a. Push was blocked by automatic approval review because it did not find explicit authorization for the complete code/audit payload and GitHub destination. No workaround or retry occurred. Remote persistence has not been verified for these changes.
