"""Stage only complete, validated recordings not yet present in HEAD.

Publication and remote verification are separate; this command never reports
that staged files have been persisted. Partial outputs and WAV caches stay local.
"""
import argparse
import importlib.util
import json
import subprocess
from pathlib import Path

spec = importlib.util.spec_from_file_location('prosody_batch', Path(__file__).with_name('prepare-jlpt-prosody-batch.py'))
batch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(batch)
ROOT = batch.ROOT


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--stage', action='store_true')
    args = parser.parse_args()
    report = json.loads((ROOT / 'docs/checkpoints/jlpt-prosody-20261103/actual-run.json').read_text())
    done = [row for row in report['forms'] if row['status'] == 'rendered_candidate_needs_listening']
    fresh, paths = [], []
    for row in done:
        manifest_path = row['manifestPath']
        present = subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + manifest_path], cwd=ROOT, capture_output=True).returncode == 0
        if present:
            continue
        batch.check_snapshot(row)
        manifest = json.loads((ROOT / manifest_path).read_text())
        assert manifest['prosody']['candidateOnly'] and not manifest['prosody']['installedInApp']
        assert manifest['prosody']['profileSha256'] == report['profileSha256']
        assert manifest['continuousSha256'] == row['continuousSha256']
        for item in [manifest['break'], *manifest['items']]:
            assert batch.digest(ROOT / item['path']) == item['sha256']
            paths.append(item['path'])
        assert batch.digest(ROOT / manifest['continuousAudioPath']) == row['continuousSha256']
        paths.extend([manifest_path, manifest['continuousAudioPath']])
        fresh.append(row['examId'])
    if args.stage and fresh:
        snapshot = {k: v for k, v in report.items() if k != 'forms'}
        snapshot.update(forms=done, renderedCandidates=len(done), installedNewAudioForms=0,
                        status='completed_candidates_only_not_installed')
        snapshot_path = 'docs/checkpoints/jlpt-prosody-20261103/completed-candidates.json'
        (ROOT / snapshot_path).write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n')
        technical_path = 'docs/checkpoints/jlpt-prosody-20261103/technical-validation.json'
        technical = json.loads((ROOT / technical_path).read_text())
        technical.update(realAudioRendered=len(done), completedFormIds=[row['examId'] for row in done],
                         completedListeningResponses=sum(row['listeningResponses'] for row in done),
                         newAudioInstalled=0)
        (ROOT / technical_path).write_text(json.dumps(technical, ensure_ascii=False, indent=2) + '\n')
        checkpoint = 'docs/jlpt-workspace/JLPT_ORIGINAL_AUTHORING_CHECKPOINT.md'
        with (ROOT / checkpoint).open('a') as out:
            out.write('\n## 2026-11-03 — further complete prosody recordings\n\n' +
                      ', '.join(fresh) + ': complete real synthesis and decoded audio validation. ' +
                      str(len(done)) + '/30 candidates complete; 0/30 newly installed. ' +
                      'Preserve all text/keys/voices/answer windows/exact60000ms break. ' +
                      'Human/native/perceptual approval false. Publication requires remote verification.\n')
        paths.extend([snapshot_path, technical_path, checkpoint])
        subprocess.run(['git', 'add', '--sparse', '--', *sorted(set(paths))], cwd=ROOT, check=True)
    print(json.dumps({'completeForms': len(done), 'freshForms': fresh, 'staged': bool(args.stage and fresh)}))


if __name__ == '__main__':
    main()
