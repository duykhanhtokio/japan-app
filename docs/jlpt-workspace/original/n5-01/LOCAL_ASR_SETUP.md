# Local reference ASR setup — 2026-10-06

Installed only in the assistant's Linux workspace, not on the publisher's Mac
or in the app bundle. Recognition runs locally; no source audio/text is uploaded,
and no paid audio API is used. The user separately authorized installation of
free local tools for the already authorized isolated N5 metadata analysis.

Runtime: Python 3.12.14, separate venv at
`/workspace/scratch/390af15284b4/jlpt-asr-venv`, with
`faster-whisper==1.2.1`. Exact observed Python/dependency versions and all four
model-file SHA-256 hashes/sizes are in
`reference-semantic-verification.metadata.json`.

```bash
python3 -m venv /path/to/jlpt-asr-venv
/path/to/jlpt-asr-venv/bin/python -m pip install faster-whisper==1.2.1
```

The local model is `Systran/faster-whisper-small`. Download these four files into
one model directory: `config.json`, `tokenizer.json`, `vocabulary.txt`,
`model.bin`. Source URL pattern:
`https://huggingface.co/Systran/faster-whisper-small/resolve/main/{filename}`.
The branch URL is mutable; validate downloaded bytes against the report's hashes.
The actual model directory was `/dev/shm/jlpt-faster-whisper-small`.

The initial Hugging Face Hub download failed because the proxy path required
the unavailable `socksio` adapter. The completed workaround downloaded the four
files using Python `urllib` and direct HTTPS, then initialized the local model.
This downloaded model weights only; it did not transmit exam audio or text.

```python
from faster_whisper import WhisperModel
model = WhisperModel('/path/to/model', device='cpu', compute_type='int8',
                     cpu_threads=4, local_files_only=True)
```

The effective CPU compute type was `int8_float32`. Recognition used Japanese,
beam size 5, word timestamps, no VAD filtering, and no previous-text conditioning.
FFmpeg decodes selected windows directly into memory at mono 16000 Hz.

Reproduce the isolated candidate recognition with:

```bash
/path/to/jlpt-asr-venv/bin/python scripts/analyze-jlpt-n5-reference-structure-local-asr.py \
  --model /path/to/model \
  --private-output /dev/shm/jlpt-reference-private-review.json
```

The script emits only numeric progress and safe status fields. Private source
recognition output is allowed only under `/dev/shm`, must be read solely in the
isolated analyzer context, and must never be copied into Git, the authoring
context, or a publisher-facing artifact. Remove it after isolated review.
This script performs no network requests and refuses to overwrite a private file.

ASR is not semantic certification or perceptual approval. It can hallucinate
over quiet/non-speech audio, and its timestamps are approximate. Structural
classification in the report combines isolated analyst review of ASR candidates
with existing signal metadata. Human/native/perceptual review flags remain false.
No exam content, voices, speed, pauses, or source-boundary metadata were changed.
