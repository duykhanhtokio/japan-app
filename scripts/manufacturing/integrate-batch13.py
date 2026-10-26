"""Integrate reviewed staging without replacing existing canonical identities.

This does not certify complete source coverage or native/domain review.
Run only after the staging authors have frozen their payloads.
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/manufacturing'
DOCS = ROOT / 'docs/ssw-workspace/manufacturing'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def append_unique(old, new, protected=()):
    by_id = {x['id']: x for x in old}
    for item in new:
        if item['id'] in by_id:
            if by_id[item['id']] != item:
                assert item['id'] not in protected, 'Existing identity changed: ' + item['id']
                old[old.index(by_id[item['id']])] = item
                by_id[item['id']] = item
        else:
            old.append(item)
            by_id[item['id']] = item


def main():
    if (DOCS / 'batch12/frozen-source-inputs.json').exists():
        raise SystemExit('Historical integrator is blocked for the review-bound completion snapshot. Use scripts/manufacturing/integrate-completion.py.')
    manifest = read(DATA / 'course-manifest.json')
    matrix = read(DOCS / 'knowledge-matrix.json')
    knowledge = {x['id']: x for x in matrix['knowledge']}
    baseline_manifest = json.loads(subprocess.check_output(['git', 'show', 'd644f639:src/data/manufacturing/course-manifest.json'], cwd=ROOT))
    for track in manifest['specialties']:
        specialty = track['id']
        staged = read(DOCS / 'batch12' / specialty / 'new-content.json')
        course = read(DATA / (specialty + '.json'))
        baseline = json.loads(subprocess.check_output(['git', 'show', 'd644f639:src/data/manufacturing/' + specialty + '.json'], cwd=ROOT))
        append_unique(course['lessons'], staged['lessons'], {x['id'] for x in baseline['lessons']})
        append_unique(course['checks'], staged['checks'], {x['id'] for x in baseline['checks']})
        baseline_track = next(t for t in baseline_manifest['specialties'] if t['id'] == specialty)
        append_unique(track['weeks'], staged['weeks'], {x['id'] for x in baseline_track['weeks']})
        track['authoredLessons'] = len(course['lessons'])
        # Use canonical lesson/question links; author mapping shapes differ.
        for lesson in staged['lessons']:
            for kid in lesson['knowledgeIds']:
                row = knowledge[kid]
                row['lessonIds'] = list(dict.fromkeys(row.get('lessonIds', []) + [lesson['id']]))
                row['coverageStatus'] = 'draft_partial_object_coverage_not_complete'
                row['fullKnowledgeAtomizationComplete'] = False
        for check in staged['checks']:
            for question in check['questions']:
                for kid in question['knowledgeIds']:
                    row = knowledge[kid]
                    row['questionIds'] = list(dict.fromkeys(row.get('questionIds', []) + [question['id']]))
        write(DATA / (specialty + '.json'), course)
        mocks = read(DOCS / 'batch12' / specialty / 'mocks.json')
        assert mocks['specialty'] == specialty and len(mocks['exams']) == 10
        write(DATA / 'mocks' / (specialty + '.json'), mocks)
    manifest['completedMockExams'] = sum(len(read(DATA / 'mocks' / (s['id'] + '.json'))['exams']) for s in manifest['specialties'])
    manifest['mockReviewStatus'] = 'ai_authored_draft_not_domain_or_native_certified'
    manifest['courseComplete'] = False
    manifest['releaseReady'] = False
    write(DATA / 'course-manifest.json', manifest)
    write(DOCS / 'knowledge-matrix.json', matrix)
    # Existing locales retain their content and truthfully become partial as JP grows.
    registry = read(DATA / 'translations/manifest.json')
    for entry in registry['locales'].values():
        if entry.get('file'):
            entry['scope'] = 'partial_current_authored_content;full_curriculum_incomplete'
    write(DATA / 'translations/manifest.json', registry)
    print('Integrated Japanese staging and 30 draft mock forms; completeness flags remain false.')


if __name__ == '__main__':
    main()
