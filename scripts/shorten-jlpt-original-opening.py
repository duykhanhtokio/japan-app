"""Publisher's 2026-10-31 opening edit; original forms only, scored tail preserved.

Requires ffmpeg and the approved VOICEVOX 0.25.2 engine. No runtime engine dependency.
Only the opening and problem-1 example are replaced. Later groups stay unchanged.
"""
import argparse
import array
import copy
import hashlib
import json
import math
from pathlib import Path
import subprocess
import time
import urllib.parse
import urllib.request
import wave

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'src/data/jlpt-original'
OPENING = '日本語能力模擬試験聴解を始めます。音が聞こえるか、先に確かめましょう。'
CHECKS = [
    {'role': 'adultMale', 'text': 'こんにちは。今日の空は青いです。これから近くの公園まで歩きます。'},
    {'role': 'adultFemale', 'text': '私は公園の入口で待っています。白いかばんを持っています。'},
]
GENERAL = '音の確認は終わりです。これから問題一を始めます。'
NUMBERS = {5: '五', 6: '六', 7: '七', 8: '八'}


def instruction(count):
    return f'問題一は{NUMBERS[count]}問です。メモを取っても構いません。質問を聞いてから、話を聞きます。話の後、もう一度質問を聞きます。問題用紙に書いてある、四つの答えから最も適切な答えを一つ選んでください。では始めます。'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def decode(path):
    return subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 's16le', '-ar', '24000', '-ac', '1', 'pipe:1'])


def bell():
    # Independently synthesized two-note bell; no historical recording sampled.
    samples = array.array('h')
    for i in range(48000):
        t = i / 24000
        value = 0
        for onset, hz in [(0, 1046.5), (.48, 783.99)]:
            age = t - onset
            if age >= 0:
                envelope = min(1, age / .008) * math.exp(-3.5 * age)
                value += 3600 * envelope * (math.sin(2 * math.pi * hz * age) + .22 * math.sin(2 * math.pi * hz * 2.76 * age))
        samples.append(round(value * min(1, (2 - t) / .15)))
    return samples.tobytes()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--engine', required=True)
    ap.add_argument('--port', type=int, default=50128)
    ap.add_argument('--level', choices=['n5', 'n4', 'n3', 'n2', 'n1'])
    args = ap.parse_args()
    cast = json.loads((BASE / 'voice-casting.json').read_text())
    work = ROOT / 'docs/jlpt-workspace/original/short-opening-2026-10-31'
    work.mkdir(parents=True, exist_ok=True)
    cache = work / 'cache'
    cache.mkdir(exist_ok=True)
    http = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    def req(path, data=None):
        return http.open(urllib.request.Request(f'http://127.0.0.1:{args.port}' + path, data=data, headers={'Content-Type': 'application/json'}), timeout=180).read()

    def synth(text, role):
        speaker = cast['roles'][role]['speakerId']
        p = cache / (sha(json.dumps([text, speaker, .9], ensure_ascii=False).encode()) + '.wav')
        if not p.exists():
            q = json.loads(req('/audio_query?' + urllib.parse.urlencode({'speaker': speaker, 'text': text}), b''))
            q.update(speedScale=.9, outputSamplingRate=24000, outputStereo=False)
            p.write_bytes(req('/synthesis?speaker=' + str(speaker), json.dumps(q).encode()))
        with wave.open(str(p)) as w:
            assert (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (24000, 1, 2)
            return w.readframes(w.getnframes())

    log = (work / 'engine.log').open('w')
    proc = subprocess.Popen([args.engine, '--host', '127.0.0.1', '--port', str(args.port), '--cpu_num_threads', '2'], cwd=str(Path(args.engine).parent), stdout=log, stderr=log)
    try:
        for _ in range(120):
            try:
                assert json.loads(req('/version')) == '0.25.2'
                break
            except Exception:
                if proc.poll() is not None:
                    raise RuntimeError('Approved engine stopped; see engine.log')
                time.sleep(.5)
        else:
            raise RuntimeError('Approved engine startup timed out')
        prefix = bytearray(b'\0' * 48000)

        def append(text, role='adultFemale'):
            prefix.extend(synth(text, role))
            prefix.extend(b'\0' * 24000)  # approved 0.5s separation

        append(OPENING)
        for check in CHECKS:
            append(check['text'], check['role'])
        append(GENERAL)
        bell_start = round(len(prefix) / 48)
        prefix.extend(bell())
        bell_end = round(len(prefix) / 48)
        opening_end = bell_end
        base_prefix = bytes(prefix)
        summaries = []
        for level in ([args.level] if args.level else ['n5', 'n4', 'n3', 'n2', 'n1']):
            for number in range(1, 7):
                directory = BASE / level / f'{number:02d}'
                mp = directory / 'master.ja.json'
                op = directory / 'listening-organization.ja.json'
                apath = directory / 'audio.manifest.json'
                master = json.loads(mp.read_text())
                org = json.loads(op.read_text())
                audio = json.loads(apath.read_text())
                if audio.get('shortenedIntroApplied'):
                    summaries.append({'level': level, 'number': number, **audio['openingRevision']})
                    print(level, number, 'already shortened', flush=True)
                    continue
                count = sum(q['section'] == 'listening' and q['group'] == 1 for q in master['questions'])
                prefix = bytearray(base_prefix)
                append(instruction(count))
                new_start = round(len(prefix) / 48)
                first = min(item['startMs'] for item in audio['items'])
                path = ROOT / audio['continuousAudioPath']
                original_bytes = path.read_bytes()
                assert sha(original_bytes) == audio['continuousSha256']
                old_pcm = decode(path)
                # Existing manifests round PCM boundaries to ms. Recover the exact
                # boundary from the first story by local waveform correlation.
                import numpy as np
                story = decode(ROOT / audio['items'][0]['path'])
                signal = np.frombuffer(old_pcm, dtype='<i2')
                probe = np.frombuffer(story, dtype='<i2')[:24000].astype(float)
                center = round(first * 24)
                best = max(range(center - 48, center + 49), key=lambda offset: float(np.dot(signal[offset:offset + len(probe)], probe)))
                correlation = float(np.corrcoef(signal[best:best + len(probe)], probe)[0, 1])
                assert correlation > .95, (level, number, correlation)
                tail = old_pcm[best * 2:]
                patched = bytes(prefix) + tail
                assert patched[len(prefix):] == tail
                duration = round(len(patched) / 48)
                delta = new_start - first
                temporary = work / f'{level}-{number:02d}.mp3'
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-b:a', str(audio.get('continuousBitrateKbps', 40)) + 'k', '-metadata', 'artist=' + '; '.join(audio['credits']), str(temporary)], input=patched, check=True)
                assert len(decode(temporary)) == len(patched)
                for item in audio['items']:
                    item['startMs'] += delta
                    item['endMs'] += delta
                orientation = [s for s in audio['orientationSegments'] if s['role'] != 'opening_sound_check_and_general_instructions' and s.get('problem') != 1]
                for segment in orientation:
                    for key in ['startMs', 'endMs', 'exampleStartMs', 'exampleEndMs']:
                        if key in segment:
                            segment[key] += delta
                audio['orientationSegments'] = [
                    {'role': 'opening_sound_check_and_general_instructions', 'startMs': 1000, 'endMs': opening_end},
                    {'role': 'problem_instructions_without_example', 'problem': 1, 'startMs': opening_end, 'endMs': new_start, 'exampleCount': 0, 'scored': False},
                ] + orientation
                for key in ['announcementStartMs', 'musicStartMs', 'musicEndMs', 'resumeAnnouncementEndMs']:
                    audio['break'][key] += delta
                assert audio['break']['musicEndMs'] - audio['break']['musicStartMs'] == 60000
                audio['examplesCount'] -= 1
                audio['instructions']['1'] = instruction(count)
                old_duration = audio['durationMs']
                audio.update(durationMs=duration, continuousSha256=sha(temporary.read_bytes()), shortenedIntroApplied=True, perceptualApproval=False)
                assessment = 'Publisher requested shorter opening on 2026-10-31; no duration padding or scored pacing changes. Historical target comparison is not an acceptance gate for this edit.'
                for key in ['matchesThirtyMinuteTarget', 'matchesLevelDurationTarget']:
                    if key in audio:
                        audio[key] = False
                    if key in master['audio']:
                        master['audio'][key] = False
                audio['durationAssessment'] = assessment
                org.update(openingJa=OPENING, soundCheck=copy.deepcopy(CHECKS), generalInstructionsJa=GENERAL)
                org['openingBell'] = {'source': 'independently_synthesized_two_note_bell', 'startMs': bell_start, 'endMs': bell_end}
                org['groups'][0].update(instructionsJa=instruction(count), playExample=False, scoredStartJa='')
                org['openingRevision'] = {'date': '2026-10-31', 'scope': 'opening_and_problem_1_only', 'status': 'audio_applied_ai_unreviewed'}
                for key in ['durationMs', 'actualDurationMs']:
                    master['audio'][key] = duration
                master['audio'].update(durationAssessment=assessment, targetDeviationMs=duration - audio['targetDurationMs'], perceptualApproval=False)
                if 'targetDurationMatched' in master['audio']:
                    master['audio']['targetDurationMatched'] = False
                dump(mp, master)
                dump(op, org)
                audio['currentMasterSha256'] = sha(mp.read_bytes())
                audio['organizationSha256'] = sha(op.read_bytes())
                audio['openingRevision'] = {'date': '2026-10-31', 'oldDurationMs': old_duration, 'newDurationMs': duration, 'firstQuestionStartMs': new_start, 'deltaMs': delta, 'originalTrackSha256': sha(original_bytes), 'preservedTailPcmSha256': sha(tail), 'firstStoryAlignmentCorrelation': correlation, 'publisherReviewed': False}
                adapter = directory / 'formal-trial.ts'
                text = adapter.read_text()
                # Hide only the first group's obsolete printed practice block.
                import re
                text, changed = re.subn(r'(function practiceInstruction\(q:\s*OriginalQuestion\):\s*string\s*\{)', r"\1\n  if (q.section === 'listening' && q.group === 1) return '';", text)
                assert changed == 1
                text = re.sub(r'(matches(?:ThirtyMinute|LevelDuration)Target:\s*boolean)', r'\1; shortenedIntroApplied?: boolean', text)
                text = re.sub(r'(&&\s*)audio\.(matches(?:ThirtyMinute|LevelDuration)Target)', r'\1(audio.\2 || audio.shortenedIntroApplied === true)', text)
                adapter.write_text(text)
                temporary.replace(path)
                dump(apath, audio)
                summaries.append({'level': level, 'number': number, **audio['openingRevision']})
                print(level, number, 'PASS', 'firstQuestionMs', new_start, 'savedMs', old_duration - duration, flush=True)
        dump(work / 'report.json', {'status': 'audio_applied_ai_unreviewed', 'exams': summaries, 'historicalExams': 'unchanged', 'laterExamples': 'unchanged', 'perceptualApproval': False})
    finally:
        proc.terminate()
        proc.wait(timeout=30)
        log.close()


if __name__ == '__main__':
    main()
