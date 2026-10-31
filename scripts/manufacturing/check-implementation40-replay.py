"""Isolated exact replay, idempotence and fail-before-write fixtures."""
from pathlib import Path
import hashlib
import json
import runpy
import shutil
import tempfile
ROOT=Path(__file__).resolve().parents[2]
module=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-implementation40.py'))
specpath=module['SPEC'];spec=json.loads((ROOT/specpath).read_text())
with tempfile.TemporaryDirectory(prefix='mfg40-replay-') as tmp:
    r=Path(tmp)
    for row in spec['files']:
        for extra in row.get('additionalBeforeSnapshots', []):
            p=r/extra['snapshot'];p.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/extra['snapshot'],p)
        for key in ['beforeSnapshot','afterSnapshot']:
            p=r/row[key];p.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/row[key],p)
        p=r/row['path'];p.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/row['beforeSnapshot'],p)
    shutil.copyfile(ROOT/specpath,r/specpath)
    assert len(module['apply'](r))==4
    assert module['apply'](r)==[]
    for row in spec['files']:
        for extra in row.get('additionalBeforeSnapshots', []):
            shutil.copyfile(r/extra['snapshot'],r/row['path'])
            assert module['apply'](r)==[row['path']]
            assert module['apply'](r)==[]
    for row in spec['files']:
        assert module['predecessor'](row['path'],(r/row['path']).read_bytes(),r)==(r/row['beforeSnapshot']).read_bytes()
    # Unknown last target must prevent the three valid before targets being written.
    for row in spec['files']:
        shutil.copyfile(r/row['beforeSnapshot'],r/row['path'])
    (r/spec['files'][-1]['path']).write_bytes(b'unknown revision\n')
    before={row['path']:(r/row['path']).read_bytes() for row in spec['files']}
    try: module['apply'](r)
    except AssertionError: pass
    else: raise AssertionError('Unknown revision accepted')
    assert all((r/p).read_bytes()==b for p,b in before.items())
    # Corrupt a frozen payload: reject even when current targets are already exact after.
    for row in spec['files']:
        shutil.copyfile(r/row['afterSnapshot'],r/row['path'])
    (r/spec['files'][0]['beforeSnapshot']).write_bytes(b'drift')
    try: module['apply'](r)
    except AssertionError: pass
    else: raise AssertionError('Snapshot drift accepted')
projection=runpy.run_path(str(ROOT/'scripts/manufacturing/supplement-practice-projection.py'))
p='src/components/manufacturing/ManufacturingCourse.tsx'
assert projection['historical_course']((ROOT/p).read_bytes())
try: projection['historical_course'](b'unknown revision')
except AssertionError: pass
else: raise AssertionError('Historical projection accepted unknown revision')
assert runpy.run_path(str(ROOT/'scripts/manufacturing/apply-source-closure39.py'))['apply']()==[]
print(json.dumps({'status':'PASS','exactReplayFiles':4,'idempotence':True,'exactUpstreamPrecursorReplay':True,'unknownRevisionRejectsBeforeWrites':True,'snapshotDriftRejected':True,'historicalCourseProjection':True,'source39Later40NoOp':True}))
