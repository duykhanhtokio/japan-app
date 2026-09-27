# JLPT audio playback checkpoint V9

On 2026-09-27 the user requested repair and verification of listening playback. The shared exam runner waits for the local audio source to load after a play request and then starts playback. A start position beyond the recording reports an error. Pending playback is canceled on exit, reset, submission, and pause. The source data and scoring are unchanged.

The approved runner SHA-256 is `8b25e82d4a9bb313fdc82272e851dd0bc9d12d0ca8273e492e657f8fef43d7af`. This checkpoint extends V8. The UI lock script contains all current hashes.

Run `node scripts/check-jlpt-audio-assets.mjs` after `git lfs pull` in the app checkout. Device playback still requires verification on the user's Mac/iPhone; the temporary workspace has 59 Git LFS audio pointers out of 61 local audio files.
