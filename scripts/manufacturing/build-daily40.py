"""Compile all 262 actual scheduled-day image bindings and exact current targets."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ssw-workspace/manufacturing/implementation40'
DATA = ROOT / 'src/data/manufacturing'
LOCALES = ['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
def read(p): return json.loads(p.read_text())
def sha(b): return hashlib.sha256(b).hexdigest()
def write(p, value): p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')

def build():
    translated = read(BASE/'language/daily-translations.json')['lessons']
    targets = {locale: {'locale':locale,'lessons':{}} for locale in LOCALES}
    assets, outputs, reports = {}, {}, []
    for specialty, count in [('mechanical',91),('electrical',98),('surface',73)]:
        source = read(BASE/specialty/'daily-bindings.json')
        rows = source.get('bindings',source.get('lessons'))
        if isinstance(rows,dict): rows=list(rows.values())
        lessons = {l['id']:l for l in read(DATA/(specialty+'.json'))['lessons']}
        assert len(rows)==len(lessons)==count
        assert {r['lessonId'] for r in rows}==set(lessons)
        records = {}
        for raw_row in rows:
            row=dict(raw_row)
            row.setdefault('lessonSourceHash',row.get('sourceHash'))
            row.setdefault('assetFile',row.get('file'))
            lesson=lessons[row['lessonId']]
            assert row['lessonSourceHash']==lesson['sourceHash']
            assert row['captionJa']==lesson['summaryJa'] and row['altJa']==lesson['titleJa']
            file=row['assetFile']; path=(ROOT/file).resolve()
            assert path.is_relative_to(ROOT/'assets/manufacturing') and path.suffix=='.png'
            raw=path.read_bytes();assert raw.startswith(b'\x89PNG\r\n\x1a\n') and sha(raw)==row['sha256']
            with Image.open(path) as image:
                assert image.size==(row['width'],row['height']);image.verify()
            assert row['keyObjectiveJa'].strip() and row['relevanceReasonJa'].strip()
            row['renderedByExistingComponent']=bool(row.get('renderedByExistingComponent',not file.startswith('assets/manufacturing/daily40/')))
            row['captionSourceHash']=sha(row['captionJa'].encode());row['altSourceHash']=sha(row['altJa'].encode())
            records[lesson['id']]=row;assets[file]=row['sha256']
            target=translated[lesson['id']]
            assert target['captionPlanValidated'] and target['lessonSourceHash']==lesson['sourceHash']
            assert target['captionJa']==row['captionJa'] and target['altJa']==row['altJa']
            for locale in LOCALES:
                entry=target['locales'][locale]
                assert entry['sourceHash']==lesson['sourceHash']
                assert entry['captionSourceHash']==sha(row['captionJa'].encode())
                assert entry['altSourceHash']==sha(row['altJa'].encode())
                assert entry['caption'].strip() and entry['alt'].strip()
                targets[locale]['lessons'][lesson['id']]={key:entry[key] for key in ['sourceHash','caption','alt','captionSourceHash','altSourceHash']}
        outputs[specialty]={'schemaVersion':1,'specialty':specialty,'lessons':records}
        reports.append({'specialty':specialty,'scheduledDays':count,'imageBindings':len(records),'existingRendererReused':sum(r['renderedByExistingComponent'] for r in records.values()),'newDailyFigureRendered':sum(not r['renderedByExistingComponent'] for r in records.values())})
    assert sum(len(o['lessons']) for o in outputs.values())==262
    for specialty,value in outputs.items():write(DATA/'daily40'/(specialty+'.json'),value)
    for locale,value in targets.items():write(DATA/'daily40'/(locale+'.json'),value)
    lines=["// Generated exact file switch: no artwork is required at module import.","export function dailyAssetByFile40(file:string):ReturnType<typeof require>|null {",' switch(file){']
    for file in sorted(assets):lines.append('  case '+json.dumps(file)+':return require('+json.dumps('../../../'+file)+');')
    lines+=['  default:return null;',' }','}']
    (DATA/'daily40-assets.ts').write_text('\n'.join(lines)+'\n')
    write(BASE/'integration/daily-build.json',{'status':'PASS','scheduledDayCount':262,'uniqueBoundAssets':len(assets),'translatedFields':6288,'specialties':reports,'assetHashes':assets,'physicalDeviceVerified':False,'expertReviewed':False})
    print(json.dumps({'status':'PASS','days':262,'assets':len(assets),'locales':12,'translatedFields':6288}))
if __name__=='__main__':build()
