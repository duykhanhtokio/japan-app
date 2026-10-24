#!/usr/bin/env python3
"""Exhaustive, revision-bound screening; signals require author adjudication.

This does not certify semantics, naturalness, native review, or release quality.
Reports contain stable IDs/hashes rather than duplicate translation corpora.
"""
import argparse
import collections
import hashlib
import json
import re
import subprocess
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ['en', 'vi', 'id', 'tl', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km']
INSTRUCTION = {
    'en': r'japanese', 'vi': r'tiếng\s+nhật', 'id': r'jepang',
    'tl': r'hapon|japanese', 'zh-CN': r'日[语語文]', 'zh-TW': r'日[语語文]',
    'hi': r'जापान', 'bn': r'জাপান', 'ne': r'जापान',
    'my': r'ဂျပန်', 'th': r'ญี่ปุ่น', 'km': r'ជប៉ុន',
}
RATIO = {'en': .90, 'vi': 1.0, 'id': .90, 'tl': .90, 'zh-CN': .38,
         'zh-TW': .38, 'hi': .85, 'bn': .85, 'ne': .85,
         'my': 1.0, 'th': .70, 'km': 1.0}
SCRIPTS = {'hi': 'devanagari', 'bn': 'bengali', 'ne': 'devanagari',
           'my': 'myanmar', 'th': 'thai', 'km': 'khmer'}
RANGES = {'devanagari': (0x0900, 0x097f), 'bengali': (0x0980, 0x09ff),
          'myanmar': (0x1000, 0x109f), 'thai': (0x0e00, 0x0e7f),
          'khmer': (0x1780, 0x17ff)}
SIMPLIFIED = set('这为个来时说话见会车进请让还没样问门开关听读写办证处发应实动对过边认现里线学电当间从给报带预约体号银钱购卖找买东图场达达观务处总点转联络')
COMMON_EN = re.compile(r'\b(the|please|without|whether|because|instead|should|would|your|their|then|check|confirm|explain)\b', re.I)


INVENTORY = {}


def read(path):
    raw = path.read_bytes()
    INVENTORY[path.relative_to(ROOT).as_posix()] = hashlib.sha256(raw).hexdigest()
    return json.loads(raw)


def digest(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def length(text):
    return sum(unicodedata.category(c)[0] in 'LNM' for c in text)


def numbers(text):
    text = unicodedata.normalize('NFKC', text)
    text = ''.join(str(unicodedata.digit(c)) if c.isdigit() and unicodedata.category(c) == 'Nd' else c for c in text)
    return set(re.findall(r'\d+(?:[.,]\d+)?', text))


def owner_for(batch, locale, policy):
    path = f'src/data/dialogue-content/locale-batches/{locale}/{batch}.json'
    transfer = next((x for x in policy.get('explicitLocaleTransfers', []) if x['path'] == path), None)
    if transfer:
        return transfer['owner']
    if int(batch) <= int(policy['phase1']['lastBatch']):
        return next(x['owner'] for x in policy['phase1']['workers'] if locale in x['exclusiveLocales'])
    slot = (int(batch) - int(policy['phase2']['firstBatch'])) % policy['phase2']['stride']
    return next(x['owner'] for x in policy['phase2']['workers'] if x['slot'] == slot)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    out = Path(args.out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    base = ROOT / 'docs/localization-workspace'
    policy = read(base / 'DIALOGUE_TRANSLATION_OWNERSHIP.json')
    index = read(ROOT / 'src/data/dialogue-content/locale-batch-index.json')
    batches = sorted(set(index.values()))
    counts = collections.Counter()
    by_locale = collections.defaultdict(collections.Counter)
    by_owner = collections.defaultdict(collections.Counter)
    pack_summary = {}
    findings = out / 'screening-findings.jsonl'
    duplicates = collections.defaultdict(lambda: {'sources': set(), 'refs': []})
    seen_scenarios = set()

    with findings.open('w', encoding='utf-8') as stream:
        def emit(record, rules):
            record['rules'] = sorted(set(rules))
            stream.write(json.dumps(record, ensure_ascii=False, separators=(',', ':')) + '\n')
            counts['flagged_units'] += 1
            for rule in record['rules']:
                counts[rule] += 1
                by_locale[record['locale']][rule] += 1
                by_owner[record['owner']][rule] += 1
                pack_summary.setdefault(record['path'], {'owner': record['owner'], 'locale': record['locale'], 'batch': record['batch'], 'units': 0, 'rules': collections.Counter()})['rules'][rule] += 1
            pack_summary[record['path']]['units'] += 1

        for batch in batches:
            source_path = base / 'sources' / f'dialogue-batch-{batch}.ja.json'
            source = read(source_path)
            seen_scenarios.update(source['scenarios'])
            for locale in LOCALES:
                relative = f'src/data/dialogue-content/locale-batches/{locale}/{batch}.json'
                path = ROOT / relative
                pack = read(path)
                owner = owner_for(batch, locale, policy)
                counts['locale_files'] += 1
                assert pack['language'] == locale
                assert pack['status'] == 'translated_ai_unreviewed' and pack['nativeReviewed'] is False
                assert set(pack['scenarios']) == set(source['scenarios'])
                for sid, scenario in source['scenarios'].items():
                    actual = pack['scenarios'][sid]['turns']
                    assert set(actual) == set(scenario['turns'])
                    for tid, original in scenario['turns'].items():
                        entry = actual[tid]
                        assert entry['sourceJa'] == original['sourceJa'] and entry['speaker'] == original['speaker']
                        for kind, src_key, target_key in [('utterance', 'sourceJa', 'translation'), ('hint', 'hintJa', 'hintTranslation')]:
                            if src_key not in original:
                                continue
                            ja, text = original[src_key], entry.get(target_key, '')
                            assert isinstance(text, str) and text.strip(), (relative, tid, kind)
                            if kind == 'hint':
                                assert entry['hintJa'] == ja
                            counts['units'] += 1
                            by_locale[locale]['units'] += 1
                            by_owner[owner]['units'] += 1
                            rules = []
                            nja, ntext = length(ja), length(text)
                            ratio = ntext / max(nja, 1)
                            if '\ufffd' in text or re.search(r'\b(?:TODO|TBD|PLACEHOLDER|translation unavailable)\b', text, re.I):
                                rules.append('invalid_or_placeholder')
                            if text.strip() == ja.strip():
                                rules.append('untranslated_exact_source')
                            if kind == 'hint' and '日本語' in ja and not re.search(INSTRUCTION[locale], unicodedata.normalize('NFC', text).lower()):
                                rules.append('missing_japanese_instruction')
                            if nja >= 28 and ratio < RATIO[locale]:
                                rules.append('severe_length_compression_signal')
                            # Japanese quoted terms can be legitimate; adjudicate these signals.
                            if locale not in ('zh-CN', 'zh-TW') and re.search(r'[\u3040-\u30ff\u3400-\u9fff]', text):
                                rules.append('japanese_or_han_script_signal')
                            unexpected = []
                            for script, (lo, hi) in RANGES.items():
                                # Bengali legitimately shares the Devanagari danda
                                # punctuation. Script signals concern letters/marks.
                                if script != SCRIPTS.get(locale) and any(lo <= ord(c) <= hi and unicodedata.category(c)[0] in 'LM' for c in text):
                                    unexpected.append(script)
                            if unexpected:
                                rules.append('unexpected_nonlatin_script')
                            if locale in SCRIPTS and len(COMMON_EN.findall(text)) >= 2:
                                rules.append('english_phrase_leakage_signal')
                            if locale == 'zh-TW' and sum(c in SIMPLIFIED for c in text) >= 2:
                                rules.append('simplified_characters_signal')
                            missing_numbers = numbers(ja) - numbers(text)
                            if missing_numbers:
                                rules.append('numeric_fidelity_signal')
                            record = {'owner': owner, 'locale': locale, 'batch': batch, 'path': relative,
                                      'scenarioId': sid, 'turnId': tid, 'kind': kind,
                                      'sourceSha256': digest(ja), 'translationSha256': digest(text),
                                      'sourceLength': nja, 'translationLength': ntext,
                                      'lengthRatio': round(ratio, 4)}
                            if missing_numbers:
                                record['unmatchedNumericTokens'] = sorted(missing_numbers)
                            if unexpected:
                                record['unexpectedScripts'] = unexpected
                            if rules:
                                emit(record, rules)
                            if kind == 'utterance' and ntext >= 20:
                                key = (locale, original['speaker'], text.strip())
                                duplicates[key]['sources'].add(ja)
                                duplicates[key]['refs'].append(record)
        for group in duplicates.values():
            if len(group['sources']) >= 4:
                for record in group['refs']:
                    emit(dict(record), ['many_sources_same_utterance_signal'])

    assert seen_scenarios == set(index)
    summary = {'status': 'SCREENING_SIGNALS_REQUIRE_AUTHOR_ADJUDICATION',
               'baselineCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
               'canonicalScenarios': len(index), 'batches': len(batches),
               'screenedFileCount': len(INVENTORY),
               'inventorySha256': digest('\n'.join(k+'\0'+v for k,v in sorted(INVENTORY.items()))),
               'coverage': dict(counts), 'byLocale': dict(by_locale), 'byOwner': dict(by_owner),
               'flaggedPacks': len(pack_summary), 'nativeReviewed': False,
               'semanticReviewComplete': False,
               'limitations': ['Length, numeral, script, and duplicate signals are not automatic mistranslation verdicts.',
                               'Unflagged content is not certified semantically or stylistically correct.']}
    (out / 'screening-inventory.json').write_text(json.dumps(INVENTORY, sort_keys=True, indent=2) + '\n', encoding='utf-8')
    (out / 'screening-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (out / 'screening-packs.json').write_text(json.dumps(pack_summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'scenarios': len(index), 'batches': len(batches), 'counts': dict(counts), 'flaggedPacks': len(pack_summary), 'byOwner': dict(by_owner)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
