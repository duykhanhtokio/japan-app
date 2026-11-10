"""Three original, source-bound additions; never rewrite existing lesson/progress IDs."""
from pathlib import Path
import json,importlib.util
R=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('food49',Path(__file__).with_name('author-source49.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
m.LEX.update({'広がり':'ひろがり','限りません':'かぎりません','読み取った':'よみとった','最大値':'さいだいち','最小値':'さいしょうち','引いた':'ひいた','質量':'しつりょう','求め':'もとめ','中心':'ちゅうしん','二つ':'ふたつ','測定条件':'そくていじょうけん','比べて':'くらべて','関して':'かんして'})
m.LEX.update({'特徴':'とくちょう','比べ':'くらべ','最大':'さいだい','最小':'さいしょう','確定':'かくてい','調査':'ちょうさ','事業上':'じぎょうじょう','平均値':'へいきんち'})
m.LEX.update({'得た':'えた','産出量':'さんしゅつりょう','指します':'さします','人時生産性':'にんじせいさんせい','労働生産性':'ろうどうせいさんせい','呼び名':'よびな','使います':'つかいます','報告':'ほうこく','分子':'ぶんし','確かめる':'たしかめる','当たり':'あたり','別名':'べつめい','呼びます':'よびます','取り方':'とりかた','挙げて':'あげて'})
m.KEYS=sorted(m.LEX,key=len,reverse=True)
payload=json.loads((R/'scripts/food-manufacturing/food62-locales.json').read_text())
histogram=json.loads((R/'scripts/food-manufacturing/food64-locales.json').read_text())
lessons=json.loads((R/'src/data/food-manufacturing/lessons.2.ja.json').read_text())['lessons']
packs={}
for n,lesson_id,pages,source_data,index in [(62,'food-2-022',[96],payload,0),(63,'food-2-023',[96,98],payload,1),(64,'food-2-021',[87,88],histogram,None)]:
    rows={loc:values if index is None else values[index] for loc,values in source_data.items()}
    ja=rows['ja'];lesson=next(l for l in lessons if l['id']==lesson_id)
    # Validate every reading before this pack can mutate any repository file.
    for s in [*ja[:3],*ja[3]]:m.ruby(s)
    common={'lessonId':lesson_id,'lessonSourceHash':lesson['sourceHash'],'sourceRefs':[{'document':'ssw2','pdfPage':p,'printedPage':p-9}for p in pages],'status':'authored_ai_unreviewed','humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
    section={**common,'id':f'food{n}-teaching','titleJa':ja[0],'textJa':ja[1],'titleRuby':m.ruby(ja[0]),'ruby':m.ruby(ja[1])}
    section['sourceHash']=m.digest({k:section[k]for k in ['titleJa','textJa']})
    section['translations']={loc:{'title':rows[loc][0],'text':rows[loc][1],'sourceHash':section['sourceHash']}for loc in m.LOCALES}
    check={**common,'id':f'food{n}-check','titleJa':ja[0],'promptJa':ja[2],'expectedPointsJa':ja[3],'titleRuby':m.ruby(ja[0]),'promptRuby':m.ruby(ja[2]),'expectedPointsRuby':[m.ruby(s)for s in ja[3]],'assessmentType':'open_response_source_application','graded':False,'mutatesLearnerProgress':False}
    check['sourceHash']=m.digest({k:check[k]for k in ['titleJa','promptJa','expectedPointsJa']})
    check['translations']={loc:{'title':rows[loc][0],'prompt':rows[loc][2],'expectedPoints':rows[loc][3],'sourceHash':check['sourceHash']}for loc in m.LOCALES}
    if n in [62,63]:
        section['id']='food62-plan' if n==62 else 'food62-output-names'
        check['id']=section['id']+'-check'
    pack=packs.setdefault(62 if n==63 else n,{'schemaVersion':1,'status':'authored_ai_unreviewed','sections':[],'checks':[]})
    pack['sections'].append(section);pack['checks'].append(check)
    print(f'Authored {n}:1 section,1 check,12 languages; learner IDs/revisions unchanged')

for n,pack in packs.items():
    (R/f'src/data/food-manufacturing/source-closure{n}.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
