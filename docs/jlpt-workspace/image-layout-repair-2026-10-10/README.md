# 2026-10-10 original JLPT image repair

Reviewed all84 mapped illustrations across30 forms. Six N5 first-image sheets paired practice/scored scenes with inadequate separation and a3:1ratio; recreated in colored2D at1536x1024 with independently bordered panels and clear central gutter. Practice remains left,scored right,matching existing recordings. Each replacement visually inspected for actors,action,props and absence of answer text. Remaining78images had no matching merged-panel defect in visual contact-sheet audit.

Original-only rendering now uses an aspect-ratio parent and absolute-fill Image with10px top/16px bottom margins. Image intrinsic height cannot enlarge the contain area. N5 practice/scored labels rendered as actual Japanese text. Historical render branch unchanged; no question,option,key,session,audio or score changes.

asset-audit.json checks30 unchanged masters/84 image hashes. runtime-report.json records30forms ×3widths,252 image checks, frame-height/spacing/no-overflow/no-errors; four430px screenshots visually inspected. Production QuestionBlock in RN-web harness; not native Simulator approval. build.cjs/entry.tsx reproduce the component view (esbuild and project dependencies required); browser binaries/environment are external. Full TypeScript blocked only by pre-existing TS2352 in life-content-repository.ts. Earlier colored2D validator is outdated: assumes every level has an image manifest;N1 no images by design.

Prompts and output names stored per replacement in manifests; built-in imagegen used. No legacy media input. Publisher/native/rights approval flags remain false.
