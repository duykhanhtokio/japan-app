# Runtime memory follow-up — 2026-10-30

Baseline: `a20317c683170bb27ac469283cf9ca2f8e192921`, branch `feature/food-continue-20261029`.

## Current result

The iOS development JavaScript bundle now completes and writes successfully. Full web export also completes with exit code 0. Exact byte counts, hashes and commands are in `runtime-memory-followup-20261030.json`. This supersedes the failed build status in the earlier memory checkpoint. No Xcode, IPA, Simulator, physical-device or production-content approval is claimed.

## Changes

- Preserve the existing application loader API, while projecting its six Metro contexts into 257 lazy data shards and six indexes instead of 16,200 separate data modules. Keys, runtime values, per-file object identity, source guards, translations, hints, readings and scenario links remain unchanged. All 16,200 projected runtime values pass comparison; the original and packed loaders match across 16 cases/165 turns, including generic and missing-scenario behavior. The existing dialogue projection keeps `shared ?? N5`; unused source levels remain in the authored JSON.
- Transform opaque generated data through tiny placeholders, then restore the exact literals after Expo wraps/collects dependencies. Multi-megabyte payloads no longer enter Babel AST processing during Metro transforms. Twelve platform/mode/wrapping cases preserve Unicode, dollar replacement sequences and prototype-named JSON keys. The largest 7.65 MB generated module passes transform/decode with a 512 MB Node heap cap. Only generated data maps are omitted; authored JS/TS transforms remain unchanged.
- Include the custom projection version in Metro transform configuration. Expo's supervising worker overrides custom `getCacheKey`, so a transformer-only checksum did not provide sufficient cache invalidation.
- Keep two worker processes. In this Metro implementation, `maxWorkers=1` executes transformations in the main process and allowed too much intermediate work to accumulate. This corrects the earlier one-worker recommendation.
- Add a version-guarded, single-page web export command that copies assets through the OS using Expo's path/scale helpers, instead of retaining every image/audio Buffer until the final write. Fixture checks verify exact bytes/paths/scales, metadata preservation, native fallback and copy errors. Standard Expo commands and application behavior remain available.
- Remove 4,309,327,853 bytes of failed exports from this environment's RAM-backed `/tmp`. Validation outputs use disk-backed workspace storage. This cleanup is specific to the test environment and is not a measured change on the user's Mac.

## Use

After updating code and installing dependencies, stop the old Metro process and run:

```bash
npm install
npx expo start --clear --max-workers 2
```

For a full single-page web export, use a disk-backed output directory:

```bash
npm run export:web:low-memory -- --output-dir dist
```

Restart Metro after editing JSON source data. The generated caches are disposable; authored JSON and saved learner progress are retained.

Relevant checks: `check-dialogue-runtime-contexts.cjs`, `check-dialogue-loader-packing.cjs`, `check-runtime-generated-transform.cjs`, `check-stream-web-assets.cjs`, existing cache/I/O checks, and the JLPT UI lock (10/10).
