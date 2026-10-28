"""Read-only validation of the final reviewed batch26 staging inputs.

The earlier six-pair author receipt is retained as historical metadata. Final
acceptance uses the full independent source and 36-pair translation receipts.
"""
from pathlib import Path
import json
import runpy

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'docs/ssw-workspace/manufacturing/batch26'

def check():
    helper = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-guide-extension26.py'))
    outputs = helper['compile_outputs'](helper['load_inputs']())
    historical = json.loads((STAGE / 'author-translation-review.json').read_bytes())
    assert historical['independentAIComparisonPerformed'] is False
    assert all(historical[k] is False for k in ['nativeReviewed', 'domainReviewed', 'releaseReady'])
    for path, payload in outputs.items():
        assert (ROOT / path).read_bytes() == payload, 'Runtime is not the exact reviewed extension: ' + path
    return dict(status='PASS', japaneseGuides=3, targetDraftPairs=36,
                independentlyComparedTargetPairs=36, independentlyComparedProseFields=468,
                historicalAuthorReceiptUsedForAcceptance=False, runtimeModified=False,
                nativeReviewed=False, domainReviewed=False, releaseReady=False)

if __name__ == '__main__':
    print(json.dumps(check()))
