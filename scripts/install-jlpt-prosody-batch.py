"""Validate all 30 re-recordings, then install their audio and measured metadata.

Default is read-only. --install applies the complete set with rollback backups.
Does not change exam text, answers, question IDs, session keys, or the shared UI.
"""
import argparse
import copy
import hashlib
import importlib.util
import json
import os
import shutil
import tempfile
from pathlib import Path
from jlpt_audio_prosody import load_profile, fingerprint, candidate_root

spec = importlib.util.spec_from_file_location('prosody_batch', Path(__file__).with_name('prepare-jlpt-prosody-batch.py'))
batch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(batch)
ROOT = batch.ROOT


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()


def installed_path(value, prefix):
    if not isinstance(value, str) or not value.startswith(prefix + '/assets/jlpt-original/'):
        raise ValueError('Unexpected candidate asset path: ' + str(value))
    result = value[len(prefix) + 1:]
    if '..' in Path(result).parts:
        raise ValueError('Unsafe candidate asset path')
    return result


def metadata(master, organization, candidate, previous, prefix, profile):
    """Only audio metadata and the opening bell's measured position may change."""
    master, organization, manifest = copy.deepcopy((master, organization, candidate))
    audio = master['audio']
    duration = manifest['durationMs']
    audio.update(durationMs=duration, actualDurationMs=duration, actualDurationVerified=True,
                 continuousAudioPath=installed_path(manifest['continuousAudioPath'], prefix),
                 perceptualApproval=False, status='generated_ai_unreviewed',
                 prosodyRevision=profile['revision'], prosodyProfileSha256=fingerprint(profile))
    audio['targetDeviationMs'] = duration - audio['targetDurationMs']
    audio['targetDurationMatched'] = False
    assessment = ('Measured decoded recording: ' + str(duration) + ' ms. Revised speech pacing; '
                  'no target-duration padding. Human and native listening acceptance remain incomplete.')
    for field in ('durationMeasurement', 'targetAssessment', 'durationAssessment'):
        audio[field] = assessment
    audio.setdefault('recordingPlan', {})['pauses'] = ('Per-utterance pacing profile ' + profile['revision'] +
        '; preserve the 2-second preparation, level answer windows, and exact 60000 ms instrumental break.')
    if organization.get('openingBell'):
        bell = organization['openingBell']
        length = bell['endMs'] - bell['startMs']
        assert length == 2000
        bell['endMs'] = manifest['orientationSegments'][0]['endMs']
        bell['startMs'] = bell['endMs'] - length
    manifest['continuousAudioPath'] = audio['continuousAudioPath']
    for item in manifest['items']:
        item['path'] = installed_path(item['path'], prefix)
    manifest['break']['path'] = installed_path(manifest['break']['path'], prefix)
    manifest['prosody'].update(candidateOnly=False, installedInApp=True, playbackReviewed=False)
    manifest['settings']['mode'] = 'per-utterance-prosody'
    manifest['currentMasterSha256'] = hashlib.sha256(encoded(master)).hexdigest()
    manifest['organizationSha256'] = hashlib.sha256(encoded(organization)).hexdigest()
    manifest['recordingMasterSha256'] = candidate['masterSha256']
    manifest['metadataRefreshReason'] = 'Install complete re-synthesis; synchronize measured audio metadata only.'
    manifest['durationAssessment'] = assessment
    if 'openingRevision' in previous:
        manifest['openingRevision'] = copy.deepcopy(previous['openingRevision'])
    return master, organization, manifest


def atomic_copy(source, target, *, link=False):
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as out:
            temporary = Path(out.name)
        if link:
            temporary.unlink()
            try:
                os.link(source, temporary)
            except OSError:
                shutil.copyfile(source, temporary)
        else:
            shutil.copyfile(source, temporary)
        os.replace(temporary, target)
    finally:
        if temporary:
            temporary.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report', default='docs/checkpoints/jlpt-prosody-20261103/actual-run.json')
    parser.add_argument('--profile', default=batch.PROFILE)
    parser.add_argument('--candidate-dir', default=batch.CANDIDATES)
    parser.add_argument('--install', action='store_true')
    parser.add_argument('--link-audio', action='store_true', help='Reuse verified candidate MP3 storage on the same filesystem; fall back to copying. Candidate renderers publish replacements atomically.')
    args = parser.parse_args()
    profile = load_profile(ROOT / args.profile)
    output = candidate_root(ROOT, args.candidate_dir, args.profile)
    report = json.loads((ROOT / args.report).read_text())
    assert report['profileSha256'] == fingerprint(profile)
    rows = report['forms']
    assert len(rows) == 30 and len({row['examId'] for row in rows}) == 30
    assert all(row['status'] == 'rendered_candidate_needs_listening' for row in rows), 'All 30 recordings must be complete before installation'
    prefix = str(output.relative_to(ROOT))
    stage = output / 'integration-stage'
    writes = {}
    for row in rows:
        batch.validate_candidate(row, output, profile)
        folder = f"src/data/jlpt-original/{row['level']}/{row['number']:02d}"
        master, organization, previous = (json.loads((ROOT / folder / file).read_text()) for file in
            ('master.ja.json', 'listening-organization.ja.json', 'audio.manifest.json'))
        candidate = json.loads((output / folder / 'audio.manifest.json').read_text())
        revised = metadata(master, organization, candidate, previous, prefix, profile)
        assert {k: v for k, v in master.items() if k != 'audio'} == {k: v for k, v in revised[0].items() if k != 'audio'}
        assert {k: v for k, v in organization.items() if k != 'openingBell'} == {k: v for k, v in revised[1].items() if k != 'openingBell'}
        for file, value in zip(('master.ja.json', 'listening-organization.ja.json', 'audio.manifest.json'), revised):
            path = folder + '/' + file
            if args.install:
                staged = stage / path
                staged.parent.mkdir(parents=True, exist_ok=True)
                staged.write_bytes(encoded(value))
                writes[path] = staged
        for path in [candidate['continuousAudioPath'], candidate['break']['path']] + [x['path'] for x in candidate['items']]:
            source = (ROOT / path).resolve()
            assert output in source.parents and source.is_file()
            writes[installed_path(path, prefix)] = source
    if not args.install:
        print(json.dumps({'validatedCompleteForms': 30, 'installedNewAudioForms': 0}))
        return
    # Validate every frozen source once more immediately before any live writes.
    for row in rows:
        batch.check_snapshot(row)
    backups = output / 'installation-backups'
    journal = []
    try:
        for relative, source in writes.items():
            target = ROOT / relative
            backup = backups / relative if target.exists() else None
            if backup:
                backup.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(target, backup)
            journal.append((target, backup))
            atomic_copy(source, target, link=args.link_audio and target.suffix == '.mp3')
        for row in rows:
            row['installedInApp'] = True
        report.update(installedNewAudioForms=30, status='30_audio_forms_installed_human_listening_pending')
        report['installationStorageMode'] = 'linked_verified_audio_with_copy_fallback' if args.link_audio else 'copied_audio'
        (stage / 'installed-report.json').write_bytes(encoded(report))
        atomic_copy(stage / 'installed-report.json', ROOT / args.report)
    except BaseException:
        for target, backup in reversed(journal):
            if backup:
                # Backups share the target filesystem. Restore by rename so
                # rollback still succeeds if a failed copy exhausted space.
                os.replace(backup, target)
            else:
                target.unlink(missing_ok=True)
        raise
    print(json.dumps({'installedNewAudioForms': 30, 'perceptualApproval': False}))


if __name__ == '__main__':
    main()
