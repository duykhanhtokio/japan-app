# Runtime data memory — 2026-10-30

Branch: `feature/food-continue-20261029`. Baseline: `1707a267098f54626c759d1fd4fb1e468dac3462`.

The source JSON remains authoritative and editable. Metro resolves `src/data/**/*.json` imports to generated, compressed CommonJS modules in the ignored `.metro-runtime-data/` cache. Large JSON is deflated during preparation, decoded with the declared pure-JavaScript `pako` dependency only when its module is required, and then parsed. This keeps the raw 844 MB JSON corpus out of Metro's module graph and avoids running the JavaScript minifier over huge object literals. Other JavaScript, assets and Expo transforms retain the upstream pipeline. Transform parallelism defaults to two workers.

Build-process filesystem reads are limited to 32 and writes to two at a time, preserving Promise results/errors. This prevents warm-cache `EMFILE` failures from thousands of simultaneous cache reads and reduces concurrent temporary write buffers. Application filesystem APIs are unaffected.

For generated dialogue records, the runtime projection retains exactly `shared ?? N5`, matching the existing application loader. Unused legacy levels and authoring metadata stay in source control but are excluded from shipped data. All fields of the selected dialogue, all current translations, stable IDs, links and storage namespaces remain unchanged. Separate source modules retain separate object identities, including when their JSON contents happen to match.

## Measured data scope

- 17,687 JSON source files: 844,048,151 bytes.
- Compact runtime JSON after projection: 733,274,281 bytes.
- Encoded payloads: 215,841,408 bytes, a 74.4% reduction versus the original JSON source bytes. This is payload size, not a measured reduction in peak RAM, total application size or launch time.
- Unused dialogue fields excluded: 5,215,928 bytes before formatting changes.
- Selected data preserved for all 7,561 dialogue files; 60 real Metro worker wrap/decode cases pass. Separate iOS/Android transform and multilingual Unicode checks pass; these are not device tests.
- Cache fixture checks pass: separate module identities/projections, reuse, source-change invalidation, obsolete cache cleanup and corrupt JSON rejection. Malformed sources fail instead of becoming empty lessons.
- Reproducible temporary test outputs removed: 91,619,744 bytes. No authored source or saved learner progress was deleted.

## Development use

Run `npm install` after pulling this commit to install the decoder dependency, then start Expo normally. The first Metro startup prepares the cache; subsequent starts reuse entries whose source size and modification time match. **Restart Metro after editing source JSON**, because the resolver snapshot is prepared at server startup. UI JavaScript changes continue through the ordinary Expo pipeline. The cache is generated locally and must not be committed or treated as another content source.

Checks:

```bash
node scripts/check-runtime-data-cache.cjs
node scripts/check-runtime-data-memory.cjs
node scripts/check-build-io.cjs
```

Build outcome and remaining environment limitations are recorded in `runtime-data-memory-20261030.json`. This optimization does not certify physical devices, all source assets or production release readiness.

The web bundle completed with 23,256 modules (approximately 227 MB JS; one warm-cache run took 20.257 seconds). Full Expo export still exited 137 after bundling, during asset output. Full export is therefore **not a pass**. The experimental export wrappers used during investigation were discarded; the committed changes retain Expo's standard exporter.
