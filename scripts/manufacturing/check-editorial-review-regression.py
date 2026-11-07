"""Reject stale or inflated editorial evidence using in-memory mutations."""
from copy import deepcopy
from pathlib import Path
import json
import runpy


def main():
    module = runpy.run_path(str(Path(__file__).with_name('check-editorial-review-bindings.py')))
    inputs = module['load_inputs']()
    validate = module['validate']
    validate(inputs)
    rejected = []

    def reject(label, path, mutate):
        candidate = dict(inputs)
        value = json.loads(candidate[path])
        mutate(value)
        candidate[path] = json.dumps(value, ensure_ascii=False).encode()
        try:
            validate(candidate)
        except ValueError:
            rejected.append(label)
        else:
            raise AssertionError('Accepted invalid evidence: ' + label)

    base = module['REPORT_BASE']
    mechanical = base + 'mechanical-mock-review.json'
    electrical = base + 'electrical-mock-review.json'
    reject('missing mechanical reviewed ID', mechanical, lambda d: d['reviewedQuestionIds'].pop())
    reject('duplicate mechanical reviewed ID', mechanical,
           lambda d: d['reviewedQuestionIds'].__setitem__(0, d['reviewedQuestionIds'][1]))
    reject('unknown mechanical reviewed ID', mechanical,
           lambda d: d['reviewedQuestionIds'].__setitem__(0, 'unknown'))
    reject('missing reviewed input file', mechanical, lambda d: d['inputFiles'].pop())
    reject('stale mechanical snapshot', mechanical,
           lambda d: d['inputFiles'][0].__setitem__('sha256', '0' * 64))
    reject('inflated mechanical count', mechanical, lambda d: d['counts'].__setitem__('questions', 401))
    reject('unsupported native certification', mechanical, lambda d: d.__setitem__('nativeReviewed', True))
    reject('unsupported release certification', mechanical, lambda d: d.__setitem__('releaseReady', True))
    reject('unknown mechanical finding', mechanical,
           lambda d: d['findings'][0].__setitem__('questionIds', ['unknown']))
    reject('missing electrical practical review', electrical, lambda d: d['items'].pop())
    reject('duplicate electrical practical review', electrical,
           lambda d: d['items'].__setitem__(0, deepcopy(d['items'][1])))
    for field in ('questionSnapshotSha256', 'questionSourceHash', 'lessonSourceHash'):
        reject('stale electrical ' + field, electrical,
               lambda d, f=field: d['items'][0].__setitem__(f, '0' * 64))
    reject('wrong electrical lesson', electrical,
           lambda d: d['items'][0].__setitem__('lessonId', 'unknown'))
    reject('unresolved electrical verdict', electrical,
           lambda d: d['items'][0].__setitem__('verdict', 'pending'))
    reject('unresolved required correction', electrical,
           lambda d: d['requiredCorrections'].append({'questionId': d['items'][0]['questionId']}))
    reject('wrong electrical selection count', electrical,
           lambda d: d['selection'].__setitem__('questionCount', 400))
    reject('unsupported human certification', electrical, lambda d: d.__setitem__('humanReviewed', True))
    reject('unknown electrical precision note', electrical,
           lambda d: d['nonblockingPrecisionNotes'][0].__setitem__('questionId', 'unknown'))
    reject('changed mechanical source audit', module['AUDIT'], lambda d: d.__setitem__('testMutation', True))
    for specialty in ('mechanical', 'electrical'):
        reject('changed ' + specialty + ' lesson file', f'src/data/manufacturing/{specialty}.json',
               lambda d: d['lessons'][0].__setitem__('testMutation', True))
        reject('changed ' + specialty + ' question file', f'src/data/manufacturing/mocks/{specialty}.json',
               lambda d: d['exams'][0]['sections']['practical']['questions'][0].__setitem__('correctIndex', 9))
    print(json.dumps({'status': 'PASS', 'rejectedInvalidSnapshots': rejected,
                      'count': len(rejected), 'runtimeFilesModified': False}))


if __name__ == '__main__':
    main()
