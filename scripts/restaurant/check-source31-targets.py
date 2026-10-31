"""Strict final twelve-locale revision/shape gate; not a native-language certification."""
import json,hashlib,collections,unicodedata
from pathlib import Path
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31';DATA=R/'src/data/restaurant/source31';LOCALES=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];SHARDS=['hygiene1','cooking1','service1','hygiene2','operations2','cooking-service2','integration'];read=lambda p:json.loads(p.read_text());sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();canonical=read(D/'canonical-ja.json')['items'];reports={};fingerprints={}
for locale in LOCALES:
 combined={};fields=0
 for shard in SHARDS:
  p=D/f'translations/{locale}/{shard}.json';t=read(p);c=D/f'canonical-ja.{shard}.json';items=read(c)['items'];assert t['locale']==locale and t['shard']==shard,(locale,shard);assert t['canonicalSha256']==sha(c),(locale,shard,'canonical file changed');assert set(t['items'])==set(items),(locale,shard,'exact canonical IDs');fingerprints[str(p.relative_to(R))]=sha(p)
  for id,v in t['items'].items():
   source=canonical[id];assert v['sourceHash']==source['sourceHash']==items[id]['sourceHash'],(locale,id,'revision');assert id not in combined,(locale,id,'duplicate shard item')
   keys=['title','text'] if source['kind'] in ['section','term','reference'] else ['caption','alt'] if source['kind']=='figure' else ['stem','objective','explanation'];values=[v.get(k) for k in keys]
   if source['kind']=='question':
    assert len(v.get('options',[]))==4 and len(v.get('reasons',[]))==4,(locale,id,'four choices/reasons');assert len({unicodedata.normalize('NFKC',s).strip() for s in v['options']})==4,(locale,id,'distinct translated options');values+=v['options']+v['reasons']
   assert all(isinstance(value,str) and value.strip() for value in values),(locale,id,'nonempty fields');fields+=len(values);combined[id]=v
 runtime=read(DATA/f'{locale}.json');assert runtime['items']==combined,(locale,'runtime differs from reviewed translation files');assert set(combined)==set(canonical),(locale,'all canonical items required');reports[locale]={'items':len(combined),'visibleFields':fields,'canonicalFiles':len(SHARDS),'nativeReviewed':False}
report=dict(status='PASS',canonicalItems=len(canonical),locales=reports,totalLocaleItems=sum(x['items'] for x in reports.values()),totalVisibleFields=sum(x['visibleFields'] for x in reports.values()),translationFilesSha256=fingerprints,canonicalSha256=sha(D/'canonical-ja.json'),allTwelveRuntimePacksMatchReviewedTargets=True,nativeReviewed=False,domainReviewed=False)
(D/'translation-final-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['translationFilesSha256','locales']}))
