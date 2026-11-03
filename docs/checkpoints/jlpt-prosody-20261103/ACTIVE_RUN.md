# Active original-listening rework

Current producer: `prepare-jlpt-prosody-batch.py --render`, one job, four CPU threads, restart after 24 new utterances. A shared engine-slot lock serializes batch and direct render commands. The OS-held `actual-run.json.lock` prevents concurrent writers (including inventory-only commands); do not start a second producer for that report. Never infer a live process from this document alone.

Current candidate root: `docs/jlpt-workspace/audio-prosody-candidates/20261103-normalized-v2`. The older `20261103-v1` candidates are historical, uninstalled trials; eleven complete trials were preserved remotely before the layout-space correction. They are not valid replacements under the current validator.

The old shared WAV cache is reused only when written source, effective spoken input, speaker, engine version, profile, level and purpose match. Layout spaces are removed only from engine input, matching the approved legacy renderer; all written Japanese remains intact. `layout-space-probe.json` records the actual 10-to-2 pause-mora comparison.

Default CLI points to the normalized candidate tree and the existing versioned turn cache. Resume revalidates complete candidates and rejects invalid ones without overwriting them. Runtime app audio, masters and manifests are still unchanged. Complete all 30 normalized candidates, then install and verify publication. Human/native/perceptual approval remains false.
