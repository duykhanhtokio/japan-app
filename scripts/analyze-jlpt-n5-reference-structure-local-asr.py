"""Isolated reference analyzer; never emit source text to stdout or repository.

Install faster-whisper==1.2.1 in a separate local venv. Supply the locally
downloaded Systran/faster-whisper-small model directory. This script performs
no network requests, authoring, audio export, or semantic approval.
Private recognition output is permitted only in /dev/shm for isolated review.
An analyst must manually classify roles; ASR segments are candidate evidence.
"""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'assets/jlpt/n5/2013-07/audio/n5-2013-07.mp3'
WINDOWS = [(0, 230), (670, 820), (1220, 1340), (1490, 1620),
           (207, 277), (793, 858), (1100, 1225), (1319, 1359),
           (1583, 1623), (660, 672), (1670, 1715)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', required=True, type=Path)
    parser.add_argument('--private-output', required=True, type=Path)
    args = parser.parse_args()
    private = args.private_output.resolve()
    if not private.is_relative_to(Path('/dev/shm')):
        raise SystemExit('Private source recognition output must stay in /dev/shm.')
    if private.exists():
        raise SystemExit('Refusing to overwrite existing private output.')
    model = WhisperModel(str(args.model.resolve()), device='cpu',
                         compute_type='int8', cpu_threads=4,
                         local_files_only=True)
    rows = []
    for index, (start, end) in enumerate(WINDOWS):
        data = subprocess.check_output([
            'ffmpeg', '-v', 'error', '-ss', str(start), '-t', str(end-start),
            '-i', str(SOURCE), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'])
        segments, _ = model.transcribe(np.frombuffer(data, np.float32),
            language='ja', beam_size=5, word_timestamps=True, vad_filter=False,
            condition_on_previous_text=False)
        for segment in segments:
            rows.append({'window': index, 'startMs': round((start+segment.start)*1000),
                         'endMs': round((start+segment.end)*1000),
                         'text': segment.text, 'avgLogprob': segment.avg_logprob,
                         'noSpeechProbability': segment.no_speech_prob,
                         'words': [{'startMs': round((start+word.start)*1000),
                                    'endMs': round((start+word.end)*1000),
                                    'word': word.word, 'probability': word.probability}
                                   for word in (segment.words or [])]})
        private.write_text(json.dumps(rows, ensure_ascii=False))
        print(json.dumps({'completedWindow': index+1, 'startMs': start*1000,
                          'endMs': end*1000, 'segmentCount': len(rows)}), flush=True)
    print(json.dumps({'status': 'candidate_recognition_only',
                      'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
                      'windowCount': len(WINDOWS), 'sourceContentExported': False,
                      'humanReviewed': False, 'perceptualApproval': False}))


if __name__ == '__main__':
    main()
