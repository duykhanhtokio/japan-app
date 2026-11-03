"""Generate lazy per-level playback migration indexes from frozen recordings.

Default requires all 30 complete candidates. --complete-levels permits local
development of already complete levels; do not wire partial indexes into app.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import tempfile
from pathlib import Path
from jlpt_audio_revision_timeline import playback_revision
from jlpt_audio_prosody import SPOKEN_TEXT_NORMALIZATION

ROOT = Path(__file__).resolve().parent.parent


def digest(data):
    return hashlib.sha256(data).hexdigest()


def build_sets(report, baseline_ref=None, complete_levels=False):
    assert report['textNormalization'] == SPOKEN_TEXT_NORMALIZATION
    assert len(report['forms']) == 30 and len({row['examId'] for row in report['forms']}) == 30
    if not complete_levels:
        assert all(row['status'] == 'rendered_candidate_needs_listening' for row in report['forms']), 'Complete all 30 recordings before app integration'

    def baseline(path):
        return subprocess.check_output(['git', 'show', baseline_ref + ':' + path], cwd=ROOT) if baseline_ref else (ROOT / path).read_bytes()

    result = {}
    for level in ('n5', 'n4', 'n3', 'n2', 'n1'):
        rows = [row for row in report['forms'] if row['level'] == level]
        assert len(rows) == 6
        if any(row['status'] != 'rendered_candidate_needs_listening' for row in rows):
            assert complete_levels
            continue
        forms = []
        for row in rows:
            folder = f"src/data/jlpt-original/{level}/{row['number']:02d}"
            previous = baseline(folder + '/audio.manifest.json')
            assert digest(previous) == row['baselineManifestSha256'], 'Playback source differs from frozen input'
            old = json.loads(previous)
            new = json.loads((ROOT / row['manifestPath']).read_text())
            assert old['examId'] == new['examId'] == row['examId']
            assert new['masterSha256'] == row['masterSha256']
            assert new['prosody']['textNormalization'] == SPOKEN_TEXT_NORMALIZATION
            assert new['prosody']['engineVersion'] == row['expectedEngineVersion']
            assert new['continuousSha256'] == row['continuousSha256']
            assert digest((ROOT / new['continuousAudioPath']).read_bytes()) == new['continuousSha256']
            assert {item['questionId']: item['turns'] for item in old['items']} == {item['questionId']: item['turns'] for item in new['items']}
            adapter = baseline(folder + '/formal-trial.ts').decode()
            match = re.search(r"_SESSION_KEY\s*=\s*'([^']+)'", adapter)
            assert match
            organization = json.loads(baseline(folder + '/listening-organization.ja.json'))
            forms.append(playback_revision(old, new, level.upper(), match[1], has_bell=bool(organization.get('openingBell'))))
        result[level] = {'schemaVersion': 1, 'level': level.upper(), 'textNormalization': SPOKEN_TEXT_NORMALIZATION,
                         'baselineRef': baseline_ref, 'profileSha256': report['profileSha256'],
                         'positionPolicy': 'Exact anchors, music and answer-window elapsed time; proportional position within spoken spans.',
                         'forms': forms}
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report', default='docs/checkpoints/jlpt-prosody-20261103/actual-run.json')
    parser.add_argument('--baseline-ref')
    parser.add_argument('--complete-levels', action='store_true')
    args = parser.parse_args()
    report = json.loads((ROOT / args.report).read_text())
    indexes = build_sets(report, args.baseline_ref, args.complete_levels)
    # Validate the requested complete set before replacing any generated index.
    folder = ROOT / 'src/data/jlpt-original/audio-revisions'
    folder.mkdir(parents=True, exist_ok=True)
    for level, value in indexes.items():
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(dir=folder, mode='w', encoding='utf8', delete=False) as out:
                temporary = Path(out.name)
                out.write(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
            os.replace(temporary, folder / (level + '.json'))
        finally:
            if temporary:
                temporary.unlink(missing_ok=True)
    print(json.dumps({'generatedLevels': list(indexes), 'generatedForms': sum(len(value['forms']) for value in indexes.values()),
                      'appHookChangesMade': False, 'partialLevelsAllowed': args.complete_levels}))


if __name__ == '__main__':
    main()
