"""Read-only, foreground progress for original JLPT audio, including inference parts."""
import argparse
import json
import re
import time
from pathlib import Path
from jlpt_audio_prosody import cache_key, load_profile, speech_query_text

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / 'docs/checkpoints/jlpt-prosody-20261103'


def load(path):
    return json.loads(path.read_text())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report', default=str(BASE / 'actual-run.json'))
    parser.add_argument('--interval', type=float, default=5)
    parser.add_argument('--once', action='store_true')
    args = parser.parse_args()
    if args.interval <= 0:
        parser.error('--interval must be positive')
    profile = load_profile(ROOT / 'src/data/jlpt-original/prosody-candidate.json')
    casting = load(ROOT / 'src/data/jlpt-original/voice-casting.json')
    maps, previous = {}, None
    while True:
        try:
            report = load(Path(args.report))
            rows = report['forms']
            state = {'complete': sum(r['status'] == 'rendered_candidate_needs_listening' for r in rows),
                     'total': len(rows), 'phase': report.get('status'), 'active': []}
            if report.get('currentBlocker'):
                state['blocker'] = report['currentBlocker']
            for row in rows:
                if row['status'] != 'rendering':
                    continue
                entry = {'examId': row['examId']}
                folder = ROOT / f"src/data/jlpt-original/{row['level']}/{row['number']:02d}"
                if row['examId'] not in maps:
                    items = load(folder / 'audio.manifest.json')['items']
                    mapping = {}
                    for position, item in enumerate(items, 1):
                        for turn in item['turns']:
                            role, text = turn if isinstance(turn, list) else (turn.get('role'), turn.get('text'))
                            if role not in casting['roles'] or not isinstance(text, str):
                                continue
                            for mode in ('dialogue', 'narration'):
                                key = cache_key(text, casting['roles'][role]['speakerId'], casting['engine']['version'],
                                                profile, row['level'], mode, query_text=speech_query_text(text))
                                mapping.setdefault(key, set()).add(position)
                    maps[row['examId']] = (mapping, len(items))
                part_file = ROOT / f"docs/jlpt-workspace/audio-prosody-candidates/20261103-normalized-v2/docs/jlpt-workspace/original/{row['level']}-{row['number']:02d}/audio/inference-part.json"
                log = (ROOT / row.get('logPath', '')).resolve()
                log_time = 0
                if ROOT in log.parents and log.is_file():
                    log_time = log.stat().st_mtime
                    ticks = [re.match(r'^(\d+)/(\d+) problem ', line) for line in log.read_text().splitlines()]
                    ticks = [tick for tick in ticks if tick]
                    if ticks:
                        entry['lastCompletedQuestion'] = int(ticks[-1][1])
                        entry['questionTotal'] = int(ticks[-1][2])
                if part_file.exists() and part_file.stat().st_mtime >= log_time:
                    part = load(part_file)
                    mapping, total = maps[row['examId']]
                    entry.update(questionPositions=sorted(mapping.get(part['cacheKey'], [])), questionTotal=total,
                                 inferencePart=part['partIndex'] + 1, partMoras=part['moras'])
                state['active'].append(entry)
            if state != previous:
                print(json.dumps(state, ensure_ascii=False), flush=True)
                previous = state
            if args.once or state['complete'] == state['total']:
                return
        except (OSError, ValueError, KeyError) as error:
            if args.once:
                raise SystemExit(str(error))
        time.sleep(args.interval)


if __name__ == '__main__':
    main()
