"""Verify complete, revision-bound AI review evidence for all twelve locales.

This verifies coverage and evidence bindings; it does not independently judge
translation meaning or confer native-speaker approval.
"""
import argparse
import gzip
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ['en', 'vi', 'id', 'tl', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km']


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def digest(value):
    return hashlib.sha256(value).hexdigest()


def verify(batch, reports_dir=None, existing_reports=None):
    assert re.fullmatch(r'\d{3,}', batch), 'Invalid batch'
    source_path = ROOT / f'docs/localization-workspace/sources/dialogue-batch-{batch}.ja.json'
    source = read(source_path)
    source_hash = digest(source_path.read_bytes())
    expected = {}
    utterances = hints = 0
    for sid, scenario in source['scenarios'].items():
        assert len(scenario['turns']) == 11, sid
        for i, (tid, turn) in enumerate(scenario['turns'].items()):
            assert turn['speaker'] == ('PLAYER' if i % 2 else 'NPC'), tid
            expected[(sid, tid, 'translation')] = turn['sourceJa']
            utterances += 1
            if turn['speaker'] == 'PLAYER':
                expected[(sid, tid, 'hintTranslation')] = turn['hintJa']
                hints += 1
    reports = []
    for locale in LOCALES:
        report = existing_reports[locale] if existing_reports is not None else read(reports_dir / f'{locale}.json')
        pack_path = ROOT / f'src/data/dialogue-content/locale-batches/{locale}/{batch}.json'
        pack = read(pack_path)
        assert report['locale'] == locale and str(report['batch']) == batch
        assert report['scenarios'] == len(source['scenarios'])
        assert report['utterancesReviewed'] == utterances and report['hintsReviewed'] == hints
        assert report['sourceSha256'] == source_hash, f'{locale}: source changed after review'
        assert report['packSha256'] == digest(pack_path.read_bytes()), f'{locale}: translation changed after review'
        assert report['nativeReviewed'] is False and pack['nativeReviewed'] is False
        assert pack['status'] == 'translated_ai_unreviewed'
        assert not report.get('remainingIssues'), f'{locale}: unresolved review issues'
        assert len(report['unitReviews']) == len(expected), f'{locale}: incomplete review evidence'
        seen = set()
        for unit in report['unitReviews']:
            key = (unit['scenarioId'], unit['turnId'], unit['field'])
            assert key in expected and key not in seen, (locale, key)
            seen.add(key)
            entry = pack['scenarios'][key[0]]['turns'][key[1]]
            src_key = 'hintJa' if key[2] == 'hintTranslation' else 'sourceJa'
            assert entry[src_key] == expected[key], (locale, key, 'stale source binding')
            target = entry[key[2]]
            assert isinstance(target, str) and target.strip()
            assert unit['sourceSha256'] == digest(expected[key].encode()), (locale, key)
            assert unit['translationSha256'] == digest(target.encode()), (locale, key)
            assert unit['decision'] in ['acceptable', 'fixed']
            assert isinstance(unit['reason'], str) and unit['reason'].strip()
        assert seen == set(expected)
        assert sum(u['decision'] == 'fixed' for u in report['unitReviews']) == report['changedUnits']
        reports.append(report)
    canonical_total = len(read(ROOT / 'src/data/dialogue-content/locale-batch-index.json'))
    return {
        'status': 'PASS_ALL_12_LOCALES_REVISION_BOUND_AI_REVIEW_EVIDENCE',
        'batch': batch, 'scenarios': len(source['scenarios']), 'canonicalScenarios': canonical_total,
        'reviewedLocales': LOCALES, 'reviewedUnits': len(expected) * len(LOCALES),
        'reviewedUtterances': utterances * len(LOCALES), 'reviewedHints': hints * len(LOCALES),
        'changedUnits': sum(r['changedUnits'] for r in reports), 'sourceSha256': source_hash,
        'nativeReviewed': False, 'corpusSemanticReviewComplete': False,
        'limitations': [
            'Evidence covers only this batch in all twelve locales; other scenarios require their own contextual review.',
            'The validator checks reviewer evidence, coverage and hashes; it does not independently assess meaning.',
            'Native-speaker review and native-device layout are not certified by this evidence.'
        ],
        'localeReports': reports,
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--batch', required=True)
    evidence = parser.add_mutually_exclusive_group(required=True)
    evidence.add_argument('--reports-dir', type=Path)
    evidence.add_argument('--aggregate', type=Path)
    parser.add_argument('--out', required=True, type=Path)
    args = parser.parse_args()
    existing_reports = None
    if args.aggregate:
        if args.aggregate.suffix == '.gz':
            aggregate = json.loads(gzip.decompress(args.aggregate.read_bytes()))
        else:
            aggregate = read(args.aggregate)
        assert str(aggregate['batch']) == args.batch
        existing_reports = {r['locale']: r for r in aggregate['localeReports']}
        assert len(aggregate['localeReports']) == len(existing_reports) == len(LOCALES)
    result = verify(args.batch, args.reports_dir, existing_reports)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k: result[k] for k in ['status', 'batch', 'reviewedUnits', 'changedUnits']}))
