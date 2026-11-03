"""Inventory or render all 30 original forms, without overwriting installed audio.

Default: inspect metadata and write an exact input-bound work queue.
--render --engine /path/to/run: synthesize into the candidate tree, then validate
each complete candidate. This does not certify perceptual quality or install it.
"""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
import threading
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from jlpt_audio_prosody import load_profile, fingerprint, speech_settings, candidate_root, SPOKEN_TEXT_NORMALIZATION, prune_generated_wave_cache

ROOT = Path(__file__).resolve().parent.parent
PROFILE = 'src/data/jlpt-original/prosody-candidate.json'
QUEUE = 'docs/checkpoints/jlpt-prosody-20261103/work-queue.json'
CANDIDATES = 'docs/jlpt-workspace/audio-prosody-candidates/20261103-normalized-v2'
TURN_CACHE = 'docs/jlpt-workspace/audio-prosody-candidates/20261103-v1/shared-turn-cache'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inventory(profile):
    casting_path = ROOT / 'src/data/jlpt-original/voice-casting.json'
    casting = json.loads(casting_path.read_text())
    result = []
    for level in ('n5', 'n4', 'n3', 'n2', 'n1'):
        for number in range(1, 7):
            folder = ROOT / f'src/data/jlpt-original/{level}/{number:02d}'
            master_path, org_path, audio_path = (folder / name for name in ('master.ja.json', 'listening-organization.ja.json', 'audio.manifest.json'))
            master, org, audio = (json.loads(p.read_text()) for p in (master_path, org_path, audio_path))
            assert master['examId'] == audio['examId']
            assert audio.get('currentMasterSha256', audio['masterSha256']) == digest(master_path)
            assert audio['organizationSha256'] == digest(org_path)
            questions = [q for q in master['questions'] if q['section'] == 'listening']
            assert {q['id'] for q in questions} == {i['questionId'] for i in audio['items']}
            assert org['groups'][0].get('playExample') is False, 'Preserve shortened opening'
            assert audio['break']['musicDurationMs'] == 60000
            result.append({'examId': master['examId'], 'level': level, 'number': number,
                           'masterSha256': digest(master_path), 'organizationSha256': digest(org_path),
                           'castingSha256': digest(casting_path), 'baselineManifestSha256': digest(audio_path),
                           'baselineAudioSha256': audio['continuousSha256'], 'baselineDurationMs': audio['durationMs'],
                           'continuousBitrateKbps': audio['continuousBitrateKbps'],
                           'listeningResponses': len(questions), 'questionIds': [q['id'] for q in questions],
                           'approvedSpeakers': {k: v['speakerId'] for k, v in casting['roles'].items()},
                           'expectedEngineVersion': casting['engine']['version'],
                           'candidateNarration': speech_settings(profile, level, 'narration'),
                           'candidateDialogue': speech_settings(profile, level, 'dialogue'),
                           'responseWindowsSeconds': casting['levelPacing'][level]['answerPauseSecondsByProblem'],
                           'status': 'pending_real_synthesis', 'installedInApp': False, 'perceptualApproval': False})
    assert len(result) == 30
    return result


def check_snapshot(row):
    folder = ROOT / f"src/data/jlpt-original/{row['level']}/{row['number']:02d}"
    for file, key in [('master.ja.json', 'masterSha256'), ('listening-organization.ja.json', 'organizationSha256'), ('audio.manifest.json', 'baselineManifestSha256')]:
        if digest(folder / file) != row[key]:
            raise RuntimeError('Canonical input changed during batch: ' + str(folder / file))
    assert digest(ROOT / 'src/data/jlpt-original/voice-casting.json') == row['castingSha256']


def validate_candidate(row, output, profile):
    check_snapshot(row)
    rel = f"src/data/jlpt-original/{row['level']}/{row['number']:02d}/audio.manifest.json"
    manifest = json.loads((output / rel).read_text())
    baseline = json.loads((ROOT / rel).read_text())
    assert manifest['masterSha256'] == row['masterSha256']
    assert manifest['organizationSha256'] == row['organizationSha256']
    assert manifest['voiceCastingSha256'] == row['castingSha256']
    assert manifest['prosody']['profileSha256'] == fingerprint(profile)
    assert manifest['prosody'].get('textNormalization') == SPOKEN_TEXT_NORMALIZATION, 'Unnormalized learning-text spaces are not valid replacement audio'
    assert manifest['prosody']['engineVersion'] == row['expectedEngineVersion'], 'Engine version differs from approved casting'
    assert manifest['prosody']['candidateOnly'] and not manifest['prosody']['installedInApp']
    for flag in ('publisherReviewed', 'nativeReviewCompleted', 'perceptualApproval', 'rightsReleaseReviewCompleted'):
        assert manifest[flag] is False
    assert manifest['settings']['answerPauseSecondsByProblem'] == row['responseWindowsSeconds']
    assert manifest['continuousBitrateKbps'] == row['continuousBitrateKbps']
    assert manifest['break']['musicDurationMs'] == 60000 and manifest['break']['musicPcmFrames'] == 1440000
    assert manifest['shortenedIntroApplied']
    assert len(manifest['items']) == row['listeningResponses']
    old = {item['questionId']: item for item in baseline['items']}
    seen = set()
    for item in manifest['items']:
        previous = old[item['questionId']]
        assert item['questionId'] not in seen
        seen.add(item['questionId'])
        assert item['turns'] == previous['turns'], 'Text, actor or spoken choice order changed'
        assert item['group'] == previous['group'] and item['number'] == previous['number']
        assert 0 <= item['startMs'] < item['endMs'] <= manifest['durationMs']
        path = (ROOT / item['path']).resolve()
        assert output in path.parents and path.suffix == '.mp3'
        assert digest(path) == item['sha256']
    full = (ROOT / manifest['continuousAudioPath']).resolve()
    assert output in full.parents and digest(full) == manifest['continuousSha256']
    # Decode the complete real recording; a manifest duration alone is not proof.
    # Different reports/direct callers may validate the same immutable MP3.
    # Their decoder output must never truncate or unlink one another's file.
    with tempfile.NamedTemporaryFile(dir=full.parent, prefix='decode-', suffix='.validation.pcm', delete=False) as temporary:
        decoded = Path(temporary.name)
    try:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(full), '-f', 's16le', '-ac', '1', '-ar', '24000', str(decoded)], check=True)
        milliseconds = round(decoded.stat().st_size / 48)
        assert abs(milliseconds - manifest['durationMs']) <= 1, 'Decoded PCM timeline mismatch'
    finally:
        decoded.unlink(missing_ok=True)
    return {'status': 'rendered_candidate_needs_listening', 'durationMs': manifest['durationMs'],
            'continuousSha256': manifest['continuousSha256'], 'manifestPath': str((output / rel).relative_to(ROOT)),
            'perceptualApproval': False, 'installedInApp': False}


def completed_candidate(row, output, profile):
    """Reuse only a complete candidate that passes current inputs and PCM checks.

    An invalid existing manifest is an explicit local failure, never permission
    to overwrite a previously completed recording or silently mark it passed.
    """
    manifest = output / f"src/data/jlpt-original/{row['level']}/{row['number']:02d}/audio.manifest.json"
    if not manifest.is_file():
        return None
    return validate_candidate(row, output, profile)


def acquire_report_lock(target):
    """An OS-held lock releases even when a rendering process is interrupted."""
    import fcntl
    handle = target.with_name(target.name + '.lock').open('a')
    try:
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError as error:
        handle.close()
        raise RuntimeError('Another renderer owns this report; keep its valid work: ' + str(target)) from error
    return handle


def acquire_form_lock(output, row, *, blocking=True):
    """Different reports must never synthesize the same form concurrently."""
    import fcntl
    folder = output / 'form-locks'
    folder.mkdir(parents=True, exist_ok=True)
    handle = (folder / f"{row['level']}-{row['number']:02d}.lock").open('a')
    try:
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX | (0 if blocking else fcntl.LOCK_NB))
    except BaseException:
        handle.close()
        raise
    return handle


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--render', action='store_true')
    parser.add_argument('--engine')
    parser.add_argument('--profile', default=PROFILE)
    parser.add_argument('--candidate-dir', default=CANDIDATES)
    parser.add_argument('--cache-dir', default=TURN_CACHE)
    parser.add_argument('--cache-limit-mb', type=int, default=256)
    parser.add_argument('--report', default=QUEUE)
    parser.add_argument('--port', type=int, default=50128)
    parser.add_argument('--jobs', type=int, choices=range(1, 5), default=1)
    parser.add_argument('--cpu-threads', type=int, choices=range(1, 5), default=2)
    parser.add_argument('--restart-every', type=int, choices=range(1, 513), default=6)
    args = parser.parse_args()
    if args.cache_limit_mb < 64:
        parser.error('--cache-limit-mb must be at least 64')
    profile = load_profile(ROOT / args.profile)
    output = candidate_root(ROOT, args.candidate_dir, args.profile)
    engine = Path(args.engine).expanduser().resolve() if args.engine else None
    ready = engine is not None and engine.is_file() and os.access(engine, os.X_OK) and shutil.which('ffmpeg') is not None
    rows = inventory(profile)
    report = {'schemaVersion': 1, 'scope': '30 original forms; no historical exam changes',
              'profileSha256': fingerprint(profile), 'profileStatus': profile['status'],
              'textNormalization': SPOKEN_TEXT_NORMALIZATION, 'candidateDirectory': str(output.relative_to(ROOT)),
              'engineExecutableAvailable': bool(ready), 'renderedCandidates': 0, 'installedNewAudioForms': 0,
              'status': 'ready_for_explicit_render' if ready else 'blocked_missing_synthesis_engine', 'forms': rows}
    target = (ROOT / args.report).resolve()
    if ROOT not in target.parents:
        raise ValueError('Report must stay inside this checkout')
    target.parent.mkdir(parents=True, exist_ok=True)
    # Retain this handle until main returns; competing runs must not overwrite
    # one another's progress while subprocesses continue rendering.
    report_lock = acquire_report_lock(target)
    save = lambda: target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    save()
    if args.render and not ready:
        raise RuntimeError('No executable VOICEVOX engine; no audio or app manifest was changed')
    if args.render:
        assert report_lock is not None
        lock = threading.Lock()
        output.mkdir(parents=True, exist_ok=True)
        cache = candidate_root(ROOT, args.cache_dir, args.profile)
        cache.mkdir(parents=True, exist_ok=True)
        def maintain_cache():
            result = prune_generated_wave_cache(ROOT, cache, args.cache_limit_mb * 1024 * 1024)
            with lock:
                report['cacheMaintenance'] = result
                save()
        maintain_cache()
        def render(index, row):
            with acquire_form_lock(output, row):
                check_snapshot(row)
                reusable = completed_candidate(row, output, profile)
                if reusable is not None:
                    with lock:
                        row.update(reusable)
                        row['reusedValidatedCandidate'] = True
                        report['renderedCandidates'] += 1
                        save()
                        print(json.dumps({'renderedCandidates': report['renderedCandidates'],
                                          'examId': row['examId'], 'reusedValidatedCandidate': True}), flush=True)
                    return
                generator = 'generate-jlpt-original-audio.py' if row['level'] in ('n5', 'n4', 'n3') else 'generate-jlpt-original-n2-audio.py'
                log_path = output / f"{row['level']}-{row['number']:02d}.log"
                with lock:
                    row['status'] = 'rendering'
                    row['logPath'] = str(log_path.relative_to(ROOT))
                    save()
                with log_path.open('w') as log:
                    subprocess.run([sys.executable, str(ROOT / 'scripts' / generator), '--engine', str(engine),
                                    '--level', row['level'], '--exam-number', str(row['number']), '--port', str(args.port + index),
                                    '--cpu-threads', str(args.cpu_threads), '--restart-every', str(args.restart_every),
                                    '--cache-dir', str(cache), '--continuous-bitrate-kbps', str(row['continuousBitrateKbps']),
                                    '--prosody-profile', args.profile, '--candidate-dir', args.candidate_dir], cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, check=True)
                result = validate_candidate(row, output, profile)
                with lock:
                    row.update(result)
                    report['renderedCandidates'] += 1
                    save()
                    print(json.dumps({'renderedCandidates': report['renderedCandidates'], 'examId': row['examId'], 'durationMs': result['durationMs']}), flush=True)
            maintain_cache()
        failures = []
        with ThreadPoolExecutor(max_workers=args.jobs) as executor:
            futures = {executor.submit(render, i, row): row for i, row in enumerate(rows)}
            for future in as_completed(futures):
                row = futures[future]
                try:
                    future.result()
                except Exception as error:
                    with lock:
                        row['status'] = 'render_or_validation_failed'
                        row['error'] = str(error)
                        failures.append(row['examId'])
                        save()
        report['status'] = '30_candidates_rendered_listening_and_integration_pending' if not failures else 'partial_render_with_local_failures'
        save()
        if failures:
            raise RuntimeError('Local render/validation failures: ' + ', '.join(failures))
    print(json.dumps({'status': report['status'], 'forms': len(rows), 'renderedCandidates': report['renderedCandidates'],
                      'installedNewAudioForms': 0, 'profileStatus': profile['status']}))


if __name__ == '__main__':
    main()
