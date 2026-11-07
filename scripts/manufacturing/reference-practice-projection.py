"""Project only the exact optional catalog addition to historical source audits."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[2]
STAGE='docs/ssw-workspace/manufacturing/batch28-reference-exams/'
LOADER='src/data/manufacturing/mocks.ts'
BEFORE='ff58c743f2d57bcc5f8272ea7f86c80fb2bbf21fe068afaf56696b86a19ae6a2'
AFTER='1b8fb9174d20010b2ddda9e6d1780659a0bcc78d5ddf3629939b6395d8beb688'
BINDINGS='4131f41713ff3e6113e6e7a126102517c32ea5c55f0cf90b31ea8ca968303603'
def sha(b):return hashlib.sha256(b).hexdigest()
def historical_loader(raw):
 import runpy
 raw=runpy.run_path(str(ROOT/'scripts/manufacturing/editorial-translation-projection.py'))['historical_translation_loader'](LOADER,raw)
 receipt=(ROOT/(STAGE+'extension-bindings.json')).read_bytes()
 assert sha(receipt)==BINDINGS,'Reference extension binding drift'
 for p,h in json.loads(receipt)['inputsSha256'].items():assert sha((ROOT/p).read_bytes())==h,'Stale reference input:'+p
 manifest=json.loads((ROOT/'src/data/manufacturing/reference-practice.json').read_bytes())
 for p,h in manifest['sourceBankSha256'].items():assert sha((ROOT/p).read_bytes())==h,'Source bank changed:'+p
 before=(ROOT/(STAGE+'loader-before.ts')).read_bytes();after=(ROOT/(STAGE+'loader-after.ts')).read_bytes()
 assert sha(before)==BEFORE and sha(after)==AFTER,'Unknown loader snapshot'
 assert raw in (before,after),'Unknown reference loader bytes'
 return before
