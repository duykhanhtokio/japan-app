"""Generate lazy per-level playback migration indexes from frozen recordings.

Default requires all 30 installed recordings. --complete-levels writes only
development previews outside the app's runtime data directory.
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


def require_installed_set(report):
    expected = {f'jpapp-{level}-original-{number:02d}-v1' for level in ('n5', 'n4', 'n3', 'n2', 'n1') for number in range(1, 7)}
    rows = report['forms']
    assert len(rows) == 30 and {row['examId'] for row in rows} == expected, 'Expected canonical 30-form set'
    assert report.get('installedNewAudioForms') == 30, 'Do not activate migration indexes before all 30 recordings are installed'
    assert all(row.get('installedInApp') is True and row['status'] == 'rendered_candidate_needs_listening' for row in rows), 'Incomplete installation receipt'


def build_sets(report, baseline_ref=None, complete_levels=False):
    assert report['textNormalization'] == SPOKEN_TEXT_NORMALIZATION
    assert len(report['forms']) == 30 and len({row['examId'] for row in report['forms']}) == 30
    if not complete_levels:
        require_installed_set(report)
        assert baseline_ref, 'Installed migration indexes need the frozen pre-install Git reference'

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
            assert new.get('currentMasterSha256', new['masterSha256']) == row['masterSha256']
            assert new['prosody']['textNormalization'] == SPOKEN_TEXT_NORMALIZATION
            assert new['prosody']['engineVersion'] == row['expectedEngineVersion']
            assert new['continuousSha256'] == row['continuousSha256']
            assert digest((ROOT / new['continuousAudioPath']).read_bytes()) == new['continuousSha256']
            assert {item['questionId']: item['turns'] for item in old['items']} == {item['questionId']: item['turns'] for item in new['items']}
            if not complete_levels:
                installed = json.loads((ROOT / folder / 'audio.manifest.json').read_text())
                assert installed['prosody']['installedInApp'] is True
                assert installed['continuousSha256'] == new['continuousSha256']
                assert installed['currentMasterSha256'] == digest((ROOT / folder / 'master.ja.json').read_bytes())
                assert digest((ROOT / installed['continuousAudioPath']).read_bytes()) == new['continuousSha256'], 'Installed recording differs from validated candidate'
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
    folder = ROOT / ('docs/jlpt-workspace/audio-revision-preview' if args.complete_levels else 'src/data/jlpt-original/audio-revisions')
    folder.mkdir(parents=True, exist_ok=True)
    def write(relative, value):
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(dir=folder, mode='w', encoding='utf8', delete=False) as out:
                temporary = Path(out.name)
                out.write(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
            os.replace(temporary, folder / relative)
        finally:
            if temporary:
                temporary.unlink(missing_ok=True)
    if not args.complete_levels:
        write('activation.json', {'schemaVersion': 1, 'installedCompleteSet': False, 'forms': 0, 'levels': []})
    for level, value in indexes.items():
        write(level + '.json', value)
    if not args.complete_levels:
        write('activation.json', {'schemaVersion': 1, 'installedCompleteSet': True, 'forms': 30,
                                 'levels': ['N5', 'N4', 'N3', 'N2', 'N1'], 'profileSha256': report['profileSha256'],
                                 'installedAudioSha256ByExamId': {row['examId']: row['continuousSha256'] for row in report['forms']},
                                 'indexSha256ByLevel': {level: digest((folder / (level + '.json')).read_bytes()) for level in indexes}})
    print(json.dumps({'generatedLevels': list(indexes), 'generatedForms': sum(len(value['forms']) for value in indexes.values()),
                      'appHookChangesMade': False, 'partialLevelsAllowed': args.complete_levels}))


if __name__ == '__main__':
    main()
