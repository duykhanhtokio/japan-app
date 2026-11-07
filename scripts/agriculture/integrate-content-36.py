"""Add reviewed Agriculture units without rewriting earlier content or state IDs."""
import argparse
import copy
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
W = ROOT / 'docs/ssw-workspace/agriculture'
P = W / 'source-next-36'
D = ROOT / 'src/data/agriculture'
BASE = 'cdb5c0d9b331bbcb8726732edd2089a22e083c00'

def read(p):
    return json.loads(p.read_text())

def write(p, obj):
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n')

def digest(obj):
    return hashlib.sha256(json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def filehash(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def integrate_lessons():
    baseline = read(P / 'baseline-file-hashes.json')
    for name, expected in baseline['files'].items():
        assert filehash(ROOT / name) == expected, 'Changed baseline: ' + name
    master_path = P / 'japanese-reviewed.json'
    master = read(master_path)
    assert master['status'] == 'independently_ai_reviewed_frozen'
    lessons = copy.deepcopy(master['lessons'])
    knowledge = copy.deepcopy(master['knowledge'])
    assert len(lessons) == 1 and len(knowledge) == 6
    ids = {l['id'] for l in lessons}
    byid = {l['id']: l for l in lessons}
    for l in lessons:
        assert l['sourceHash'] == digest({k:v for k,v in l.items() if k != 'sourceHash'})
        assert l['levels'] == ['2'] and len(l['paragraphs']) == 6
    content = read(D / 'lessons.ja.json')
    assert len(content['lessons']) == 187 and not ids & {l['id'] for l in content['lessons']}
    ledger = read(W / 'knowledge-ledger.json')
    course = read(D / 'course-manifest.json')
    inv = read(W / 'source-inventory.json')
    index = read(D / 'translations.json')
    pending = {}
    packets = []
    for pair in ['en-hi', 'vi-id', 'zh-CN-zh-TW', 'bn-ne', 'my-th', 'km-tl']:
        path = P / ('translations-' + pair + '.json')
        packet = read(path)
        assert packet.get('sourceMasterSha256', packet.get('sourcePacketSha256')) == filehash(master_path), pair
        review_path = P / ('translation-review-' + pair + '.json')
        adopted_path = P / ('translation-review-' + pair + '-adopted.json')
        if adopted_path.exists():
            adopted = read(adopted_path)
            assert adopted['derivedFromSha256'] == filehash(review_path)
            review_path = adopted_path
        review = read(review_path)
        assert review['status'] in ['complete', 'independent_ai_semantic_review_complete_with_exact_patches']
        assert not review.get('unresolvedBlockingIssues', [])
        assert review.get('authorPacketSha256', review.get('sourceAuthorSha256')) == filehash(path)
        assert review['sourceMasterSha256'] == filehash(master_path)
        assert review.get('fieldsReviewed', review.get('reviewedFields')) == 30
        assert review.get('lessonLocalePairsReviewed', len(review.get('coverage', []))) == 2
        locales = copy.deepcopy(packet['locales'])
        review_patches = review.get('patches', review.get('exactpatches', []))
        for patch in review_patches:
            t = locales[patch['locale']][patch['lessonId']]
            field = patch.get('field', patch.get('path', [None])[0])
            assert field in ['title', 'objective', 'activity', 'paragraphs', 'paragraphTitles']
            obj = t[field] if field in ['paragraphs', 'paragraphTitles'] else t
            key = patch.get('paragraphId', patch.get('path', [None, None])[-1]) if field in ['paragraphs', 'paragraphTitles'] else field
            assert obj[key] == patch['before'] and patch['reason'], (pair, patch['locale'], patch['lessonId'], field, key)
            obj[key] = patch['after']
        for locale, entries in locales.items():
            assert locale in index['shards'] and set(entries) == ids
            shard_path = D / index['shards'][locale]
            shard = read(shard_path)
            assert not ids & set(shard)
            for lid, t in entries.items():
                lesson = byid[lid]
                assert t['sourceHash'] == lesson['sourceHash']
                assert t['status'] == 'translated_ai_unreviewed'
                assert t['translatedDirectlyFrom'] == 'ja'
                assert t['nativeReviewed'] is False and t.get('domainReviewed', False) is False
                t['domainReviewed'] = False
                assert set(t['paragraphs']) == set(t['paragraphTitles']) == {p['id'] for p in lesson['paragraphs']}
                assert all(isinstance(t[f], str) and t[f].strip() for f in ['title', 'objective', 'activity'])
                assert all(isinstance(v, str) and v.strip() for f in ['paragraphs', 'paragraphTitles'] for v in t[f].values())
            shard.update(entries)
            pending[shard_path] = shard
        packets.append({'path': str(path.relative_to(ROOT)), 'sha256': filehash(path),
                        'reviewPath': str(review_path.relative_to(ROOT)), 'reviewSha256': filehash(review_path),
                        'appliedFieldPatches': len(review_patches)})
    assert len(pending) == 12
    content['lessons'].extend(lessons)
    ledger['knowledge'].extend(knowledge)
    number = max(w['number'] for w in course['levels']['2']['weeks']) + 1
    week = {'id': f'agr-2-w{number:02}', 'number': number, 'titleJa': '果樹の生育環境と取り木の補足', 'lessonIds': [l['id'] for l in lessons]}
    course['levels']['2']['weeks'].append(week)
    course['revision'] = 'v36'
    for doc in inv['documents']:
        for page in doc['pages']:
            added = [k['id'] for k in knowledge if any(s['documentId'] == doc['id'] and s['pdfPage'] == page['pdfPage'] for s in k['sources'])]
            if added:
                page['knowledgeIds'] = list(dict.fromkeys(page['knowledgeIds'] + added))
                page['status'] = 'partially_mapped_to_authored_content'
    prior = [r for n in [11, 12, 22, 27, 30, 34] for r in read(W / f'source-gap-reconciliation-{n}.json')['resolutions']]
    old = {i for r in prior if r['disposition'] == 'covered_by_new_prose' for i in r['sourceItemIds']}
    resolutions = copy.deepcopy(master['sourceGapResolutions'])
    for r in resolutions:
        r['evidenceBindings'] = []
        for lid in r['lessonIds']:
            lesson = byid[lid]
            for paragraph in lesson['paragraphs']:
                if paragraph['id'] in r['paragraphIds']:
                    r['evidenceBindings'].append({'lessonId': lid, 'lessonSourceHash': lesson['sourceHash'],
                        'paragraphId': paragraph['id'], 'paragraphSha256': digest(paragraph)})
    new = {i for r in resolutions if r['disposition'] == 'covered_by_new_prose' for i in r['sourceItemIds']}
    assert not old & new
    summary = {'sourceOccurrencesCoveredByNewProse': len(new), 'cumulativeSourceOccurrencesCoveredByProse': len(old | new),
               'candidateRemainingMissingOrPartialOccurrencesFromBaseline': 1559 - len(old | new),
               'baselineHeldOccurrencesUnchanged': 301, 'uniqueKnowledgeDenominator': None, 'coveragePercent': None}
    overlay = {'schemaVersion': 1, 'status': 'independently_ai_reviewed_source_prose_candidate', 'baselineCommit': BASE,
               'previousReconciliation': 'source-gap-reconciliation-34.json', 'summary': summary, 'resolutions': resolutions,
               'heldNewSourceClaims': master.get('sourceGapHolds', []), 'humanReviewed': False, 'domainReviewed': False}
    ledger.setdefault('sourceGapReconciliation', []).extend(resolutions)
    ledger['latestSourceGapReconciliation'] = {'file': 'source-gap-reconciliation-36.json', 'previousOverlay': 'source-gap-reconciliation-34.json', 'note': 'Source occurrences are not independent assessment objectives.'}
    index['authoredLessonCoverage'] = {'authoredLessons': 188, 'fullyDraftTranslatedLessons': 188, 'lessonLocalePairs': 2256,
                                      'completeForCurrentlyAuthoredLessons': True, 'wholeCurriculumComplete': False}
    progress = read(W / 'progress.json')
    progress['authored'].update(japaneseLessons=188, learningUnits=1128)
    progress['translations']['completedLessonLocalePairs'] = 2256
    progress['translations']['japaneseLessonsWithAll12Drafts'].extend([l['id'] for l in lessons])
    progress['sources']['latestSourceGapReconciliation'] = {'file': 'source-gap-reconciliation-36.json', 'previous': 'source-gap-reconciliation-34.json', **summary}
    progress['latestBatch'] = 'source-next-36/manifest.json'
    progress['next']['alsoPending'] = [text.replace('All187currently', 'All188currently').replace('(2244pairs)', '(2256pairs)').replace('candidate1190', 'candidate1184') for text in progress['next']['alsoPending']]
    progress['next']['resumePriority'] = 'Preserve188lessons/2256AI-draftpairs/62rasters/421weekly/160mocks. Batch36integratedone2go fruitenvironment/layeringlesson;6sourceoccurrencesclosed,1184missing-or-partial+301holdsremain. Six audited next packets retained outside runtime; do not claim their drafts closed. Mock35queue20retained/17excluded unchanged;16forms640questions remain,800capacity uncertified. Week47one real lesson no fabricated quiz.'
    progress['parallelWorkers'] = {'count':6,'status':'source_and_translation_ai_peers_finished_pending_remote_gate','backgroundAuthoringRunning':False}
    for path, obj in [*pending.items(), (D / 'lessons.ja.json', content), (D / 'course-manifest.json', course),
                      (W / 'knowledge-ledger.json', ledger), (W / 'source-inventory.json', inv), (D / 'translations.json', index),
                      (W / 'source-gap-reconciliation-36.json', overlay), (W / 'progress.json', progress)]:
        write(path, obj)
    write(P / 'lesson-integration.json', {'newLessonIds': [l['id'] for l in lessons], 'newWeek': week,
          'sourceMasterSha256': filehash(master_path), 'translationPackets': packets, 'sourceSummary': summary})
    print(json.dumps({'newLessons': 1, 'newTranslations': 12, **summary}))

if __name__ == '__main__':
    integrate_lessons()
