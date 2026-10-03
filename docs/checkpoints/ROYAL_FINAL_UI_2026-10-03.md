# Royal UI continuation — 2026-10-03

Acceptance remains incomplete: native rendering/flash reproduction and missing approved individual artwork require unavailable inputs. Preserve the preceding recovery and production checkpoints.

## Learn navigation diagnosis and repair

CDP CPU sampling (500 microseconds) traced the first Home→Learn pause to the Metro module loader: its dominant function sampled 107.099 ms self time. Learn imported jlpt-learning only to enumerate progress IDs, but that eagerly initializes vocabulary, grammar/localizations and generated scenarios. The bundled scenario module alone is about 7.57 MB escaped and vocabulary about 2.5 MB escaped. This is evidence for this path, not an explanation of every navigation stall.

Learn now imports a 132,883-byte generated ID index. scripts/build-learning-progress-ids.mjs reproduces it from vocabulary and grammar, applies replacedGrammarIds and supplements exactly as jlpt-learning does, deduplicates per level, and --check detects stale source/index combinations. Completion IDs, kana rule, denominators, ranks, economy and qualifications are unchanged. Rerun the generator whenever those input collections change.

After repair, total sampled loader self time is about 2.9 ms. First-Learn long tasks are 57–70 ms across the four final viewports, compared with 168–188 ms in the preceding production evidence. Remaining long tasks and RAF gaps mean navigation is not certified stutter-free. Timing is environment dependent and action durations also include automation waits. Both raw CPU profiles and the prior trace summary are saved with the final evidence.

## Remaining UI repairs

Orchard picker outer sheet, balances, level/lock/stat/price badges use raster RoyalContentPanel; instructions use RoyalExplanationPanel. Removed redundant shell background, border, shadow and CSS handle. Close uses the existing close-x image with an accessible button label. Existing apple-tree and grape-vine artwork are used; other fruit slots remain empty rather than pretending replacement glyphs are approved originals. Planting, prices, requirements and handlers are unchanged.

Chicken/cow timer no longer contains an unsupported clock glyph; care labels use Japanese water text and the original rice image. Feeding and timers are unchanged. Restaurant uses the existing common RoyalPageBackground and transparent content surface. Its guide remains a guide; cooking/orders are still not implemented. No claim that this change resolves the user's native green flash.

An additional experiment changing the shared nine-slice image renderer did not provide clear performance improvement (first-Learn tasks 58–68 ms and remaining orchard tasks up to 75 ms). That experiment was reverted to the exact pre-experiment source; no shared RoyalPaperPanel change is included.

## Production evidence and validation

scripts/capture-royal-final-runtime.cjs exports no mocks: it drives the complete production application with actual routes and handlers. Final runtime.json records 38 timed actions, zero page errors, and captures Home, Learn, Game and orchard picker at 430×932, 360×800, 768×1024 and 1366×768. The 430 run additionally feeds chicken/cow and opens the restaurant. Orchard parent CSS border is 0px, background transparent and box-shadow none at all four sizes. Real close and Back navigation are exercised. Screenshots were visually inspected. These are browser viewports, not iOS/Android device tests. No care-time injection was used; the later water-demand state is source-checked only.

First-Learn long tasks: 430=70 ms; 360=67 ms; 768=57 ms; 1366=69 ms. Largest recorded RAF gaps range 83.3–100 ms. Scoped ESLint, generator consistency, capture syntax, production export and whitespace checks pass. JLPT lock remains 10/10. Full TypeScript still reports the pre-existing TS2352 in life-content-repository.ts:41 for SC-HKD-HAKODATE-001 lacking type; do not call full TypeScript PASS or alter concurrent dialogue authoring to hide it.

The existing initial production game state has level 30/large balances and is not a fresh-install test fixture. The 128.8 MB export includes authored dialogue data and unresolved audio LFS pointers; it is not a validated release package. Content-storage redesign and economy changes are outside this repair.

## Genuine blockers and next resume

No iOS/iPadOS/Android simulator or native device surface is available here. Native safe areas, actual device performance and the reported green flash still require native reproduction. Approved standalone crop/fruit/water/fertilizer/boost/ad/tool assets were not found in the exhaustive earlier recovery searches; supplying their original files or explicit approval of a replacement design is required. Do not call the original eight-item request fully complete. UI changes preserve the approved exam byte lock and concurrent Ibaraki dialogue commits. Verify Git remote persistence before relying on this checkpoint.
