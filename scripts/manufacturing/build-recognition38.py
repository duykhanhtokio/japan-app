"""Compile image-bound recognition teaching/checks into lazy per-locale runtime files."""
from pathlib import Path
from PIL import Image
import hashlib,json

ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/manufacturing/recognition38'
LOCALES=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
FILES=['mechanical','measurement','materials','processes','finishing']
def digest(raw):return hashlib.sha256(raw).hexdigest()
def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def write(path,value):path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def lessons():
    result={}
    for specialty in ['mechanical','electrical','surface']:
        for path in [ROOT/f'src/data/manufacturing/{specialty}.json',ROOT/f'src/data/manufacturing/completion37/{specialty}.json']:
            for lesson in json.loads(path.read_text())['lessons']:result[lesson['id']]=lesson
    for lesson in json.loads((ROOT/'src/data/manufacturing/source-guides.json').read_text())['guides']:result[lesson['id']]=lesson
    return result

def build():
    source_lessons=lessons()
    required={p['id'] for p in json.loads((ROOT/'docs/ssw-workspace/manufacturing/batch37-completion/remaining-required-work.json').read_text())['requiredOpenItems']}
    locale_files={locale:{'locale':locale,'packs':{}} for locale in LOCALES}
    bindings={};all_packs=[];groups={};assets={};question_ids=set()
    for filename in FILES:
        data=json.loads((DATA/(filename+'.json')).read_text());output=[]
        for pack in data['packs']:
            assert pack['id'] in required and pack['id'] not in bindings
            assert pack['lessonIds'] and set(pack['lessonIds'])==set(pack['lessonSourceHashes'])
            for lesson_id,value in pack['lessonSourceHashes'].items():assert source_lessons[lesson_id]['sourceHash']==value, 'Teaching revision drift: '+lesson_id
            caption_hash=digest(pack['captionJa'].encode())
            assert set(pack['locales'])==set(LOCALES), 'Missing locale: '+pack['id']
            local_assets={}
            for asset in pack['assets']:
                assert asset['id'] not in local_assets
                path=(ROOT/asset['file']).resolve();assert path.is_relative_to(ROOT/'assets/manufacturing/recognition38')
                raw=path.read_bytes();assert digest(raw)==asset['sha256'], 'Artwork drift: '+asset['file']
                with Image.open(path) as image:assert image.size==(asset['width'],asset['height']);image.verify()
                local_assets[asset['id']]=asset;assets[asset['file']]=asset['sha256']
            question_hashes={}
            for question in pack['questions']:
                assert question['id'] not in question_ids;question_ids.add(question['id'])
                body={k:v for k,v in question.items() if k!='sourceHash'}
                assert digest(canonical(body))==question['sourceHash'], 'Question drift: '+question['id']
                assert question['lessonId'] in pack['lessonIds']
                assert question['imageAssetIds'] and set(question['imageAssetIds'])==set(question['imageAssetHashes'])
                for asset_id in question['imageAssetIds']:
                    asset=local_assets[asset_id]
                    assert asset['sha256']==question['imageAssetHashes'][asset_id]
                    assert asset.get('role') not in ['teaching','post_submission_teaching'], 'Teaching image in quiz: '+question['id']
                assert len(question['optionsJa'])==len(question['optionReasonsJa'])==4
                assert len(set(question['optionsJa']))==4 and 0<=question['correctIndex']<4
                question_hashes[question['id']]=question['sourceHash']
            for locale in LOCALES:
                target=pack['locales'][locale]
                assert target['captionSourceHash']==caption_hash and target['caption'].strip()
                assert set(target['questions'])==set(question_hashes)
                for qid,entry in target['questions'].items():
                    assert entry['sourceHash']==question_hashes[qid] and entry['stem'].strip()
                    assert len(entry['options'])==len(entry['reasons'])==4
                    assert all(isinstance(x,str) and x.strip() for x in entry['options']+entry['reasons'])
                locale_files[locale]['packs'][pack['id']]=target
            core={k:v for k,v in pack.items() if k!='locales'};core['captionSourceHash']=caption_hash
            revision=digest(canonical({'id':pack['id'],'title':pack['titleJa'],'caption':caption_hash,'teaching':pack['lessonSourceHashes'],'assets':{k:v['sha256'] for k,v in local_assets.items()},'questions':question_hashes}))
            bindings[pack['id']]={'revision':revision,'captionSourceHash':caption_hash,'lessonSourceHashes':pack['lessonSourceHashes'],'assetHashes':{k:v['sha256'] for k,v in local_assets.items()},'questionHashes':question_hashes}
            output.append(core);all_packs.append(pack['id'])
        groups[filename]={'schemaVersion':1,'packs':output}
    assert set(all_packs)==required, 'Not all 15 required packs delivered'
    # No file is changed until every source, artwork and locale has passed validation.
    for filename,value in groups.items():write(DATA/'core'/(filename+'.json'),value)
    for locale,value in locale_files.items():write(DATA/'locales'/(locale+'.json'),value)
    write(DATA/'bindings.json',{'schemaVersion':1,'packs':bindings})
    write(ROOT/'docs/ssw-workspace/manufacturing/batch38-recognition/runtime-build.json',{'status':'PASS','requiredPacks':len(required),'deliveredPacks':len(all_packs),'uniqueQuestions':len(question_ids),'uniquePngAssets':len(assets),'questionLocalePairs':len(question_ids)*12,'captionLocalePairs':len(all_packs)*12,'assetSha256':assets,'professionalExpertSignoff':False,'physicalDeviceVerified':False})
    source="// Generated by build-recognition38.py; artwork changes require source review.\nexport const recognitionSources:Record<string,ReturnType<typeof require>>={\n"
    for file in sorted(assets):source+=" '"+file+"':require('../../../"+file+"'),\n"
    source+='};\n';(ROOT/'src/components/manufacturing/recognition38-assets.ts').write_text(source)
    print(json.dumps({'status':'PASS','packs':len(all_packs),'questions':len(question_ids),'assets':len(assets),'locales':12}))

if __name__=='__main__':build()
