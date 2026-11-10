#!/usr/bin/env python3
"""Check the CURRENT corpus against published NPC audio, without synthesizing it.

Run prepare.cjs first. GitHub release JSON is an optional fresh GET snapshot;
its digests verify uploaded bytes, not pronunciation or device playback.
"""
import argparse
import collections
import hashlib
import importlib.util
import json
import math
import pathlib
import sys

sys.dont_write_bytecode = True
ROOT = pathlib.Path(__file__).resolve().parents[2]


def read(path):
    return json.loads(pathlib.Path(path).read_text(encoding='utf-8'))


def check(plan, release, shards, assets=None):
    spec = importlib.util.spec_from_file_location('voice_factory', ROOT / 'scripts/dialogue-voice/factory/build.py')
    factory = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(factory)
    assert release['complete'] is True, 'Audio release is incomplete'
    assert release['engine'] == plan['engine'], 'Engine revision changed'
    assert release['settings'] == plan['settings'], 'Synthesis settings changed'
    assert not plan['unverifiedCategories'], 'Unverified character casting'
    assert len(plan['rows']) == release['turnCount'] == 42768
    expected_scenarios = {r['scenarioId'] for r in plan['rows']}
    assert len(expected_scenarios) == release['scenarioCount'] == 7128
    indexed = {}
    for name, shard in shards.items():
        for sid, turns in shard.items():
            assert factory.shard(sid) == name, f'Wrong runtime shard: {sid}'
            assert sid not in indexed, f'Duplicate scenario: {sid}'
            indexed[sid] = turns
    assert set(indexed) == expected_scenarios, 'Missing or extra scenarios'
    expected_turns = collections.defaultdict(set)
    identities, unique_entries, roles = set(), {}, collections.Counter()
    for row in plan['rows']:
        sid, tid = row['scenarioId'], row['turnId']
        assert tid not in expected_turns[sid], f'Duplicate current turn: {tid}'
        expected_turns[sid].add(tid)
        entry = indexed[sid].get(tid)
        assert entry is not None, f'Missing audio: {tid}'
        for key in ('sourceJa', 'role', 'speakerId'):
            assert entry[key] == row[key], f'Stale {key}: {tid}'
        assert factory.ROLES[row['role']] == row['speakerId'], f'Unapproved voice: {tid}'
        clip = factory.clip_key(row, plan)
        assert entry['clip'] == clip, f'Stale clip identity/source-bound kana: {tid}'
        assert entry['nativeReviewed'] is False, 'Do not infer native review from audio generation'
        assert len(entry['sha256']) == 64 and all(c in '0123456789abcdef' for c in entry['sha256'])
        pack = release['packs'][entry['pack']]
        for key in ('startMs', 'durationMs'):
            assert type(entry[key]) in (int, float) and math.isfinite(entry[key]), f'Invalid {key}: {tid}'
        assert entry['startMs'] >= 0 and entry['durationMs'] > 0
        assert entry['startMs'] + entry['durationMs'] <= pack['durationMs'] + .1, f'Out-of-pack sentence: {tid}'
        binding = tuple(entry[k] for k in ('pack', 'startMs', 'durationMs', 'sha256'))
        assert clip not in unique_entries or unique_entries[clip] == binding, f'Inconsistent reused clip: {tid}'
        unique_entries[clip] = binding
        identities.add(clip)
        roles[str(row['speakerId'])] += 1
    for sid, turns in indexed.items():
        assert set(turns) == expected_turns[sid], f'Unexpected/missing turn: {sid}'
    assert len(identities) == release['uniqueClips']
    # Each pack must consist of the indexed clips, with no overlaps or hidden gaps.
    intervals = collections.defaultdict(list)
    for pack, start, duration, _ in unique_entries.values():
        intervals[pack].append((start, duration))
    assert set(intervals) == set(release['packs']), 'Unreferenced or missing pack'
    for name, spans in intervals.items():
        end = 0
        for start, duration in sorted(spans):
            assert abs(start - end) <= .1, f'Gap or overlap: {name} at {start}'
            end = start + duration
        assert abs(end - release['packs'][name]['durationMs']) <= .1, f'Pack duration mismatch: {name}'
    if assets is not None:
        assert assets['draft'] is False, 'Audio assets are not publicly published'
        assert release['baseUrl'].endswith('/' + assets['tag_name']), 'Wrong published release'
        remote = {a['name']: a for a in assets['assets']}
        for name, pack in release['packs'].items():
            asset = remote[name]
            assert asset['state'] == 'uploaded' and asset['size'] == pack['bytes'], f'Asset size/state: {name}'
            assert asset['digest'] == 'sha256:' + pack['sha256'], f'Asset checksum: {name}'
    return {
        'status': 'PASS_CURRENT_SOURCE_AUDIO_BINDINGS',
        'scenarios': len(indexed), 'npcTurns': len(plan['rows']),
        'uniqueClips': len(identities), 'packs': len(release['packs']),
        'speakerTurnCounts': dict(sorted(roles.items())),
        'sourceKanaVoiceEngineSettingsIdentityChecked': True,
        'clipIntervalsContiguous': True,
        'publishedAssetDigestsChecked': assets is not None,
        'audioAssetReleaseIsPrerelease': assets['prerelease'] if assets is not None else None,
        'distributionBytes': sum(p['bytes'] for p in release['packs'].values()),
        'audioHours': sum(p['durationMs'] for p in release['packs'].values()) / 3600000,
        'nativeListeningReviewed': release['nativeListeningReviewed'],
        'pronunciationReviewed': release['pronunciationReviewed'],
        'devicePlaybackVerified': False,
        'limitations': ['Uploaded asset digests are not a new download/decode or listening test.',
                        'Source-bound kana identity does not prove the synthesis engine pronounced that kana.'],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan', required=True)
    parser.add_argument('--assets-json')
    parser.add_argument('--out')
    args = parser.parse_args()
    plan = read(args.plan)
    release = read(ROOT / 'src/data/dialogue-content/npc-audio-release.json')
    shards = {p.stem: read(p) for p in (ROOT / 'src/data/dialogue-content/audio-packs').glob('*.json')}
    report = check(plan, release, shards, read(args.assets_json) if args.assets_json else None)
    report['planSha256'] = hashlib.sha256(pathlib.Path(args.plan).read_bytes()).hexdigest()
    report['releaseManifestSha256'] = hashlib.sha256((ROOT / 'src/data/dialogue-content/npc-audio-release.json').read_bytes()).hexdigest()
    if args.assets_json:
        report['publishedAssetsSnapshotSha256'] = hashlib.sha256(pathlib.Path(args.assets_json).read_bytes()).hexdigest()
    if args.out:
        pathlib.Path(args.out).write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == '__main__':
    main()
