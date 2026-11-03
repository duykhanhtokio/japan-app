# Active original-listening rework

Production protocol: one writer per report and one writer per form. Read a live command/report before claiming a process is running. Shared engine slots allow two short-form engines; N3/N2/N1 use both slots exclusively. CPU threads/restart intervals adapt to available memory without changing the speech profile. Private generated WAV cache is bounded (default target256 MiB, configurable); cleanup takes both engine slots and never touches canonical MP3s or source data. Reused complete recordings are decoded and validated rather than rebuilt. Decoder temporary files are unique across concurrent validators.

The OS-held report lock also covers inventory commands; do not start a second writer for an active report. Older reports may retain historical rendering statuses after their writer exits.

Current candidate root: `docs/jlpt-workspace/audio-prosody-candidates/20261103-normalized-v2`. The older `20261103-v1` candidates are historical, uninstalled trials; eleven complete trials were preserved remotely before the layout-space correction. They are not valid replacements under the current validator.

The old shared WAV cache is reused only when written source, effective spoken input, speaker, engine version, profile, level and purpose match. Layout spaces are removed only from engine input, matching the approved legacy renderer; all written Japanese remains intact. `layout-space-probe.json` records the actual 10-to-2 pause-mora comparison.

Default CLI points to the normalized candidate tree and the existing versioned turn cache. Resume revalidates complete candidates and rejects invalid ones without overwriting them. Runtime app audio, masters and manifests are still unchanged. Complete all 30 normalized candidates, then install and verify publication. Human/native/perceptual approval remains false.
