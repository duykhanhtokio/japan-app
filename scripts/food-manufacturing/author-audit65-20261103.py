"""Source-grounded semantic repairs; canonical Japanese before its dependants."""
from pathlib import Path
import importlib.util,json,copy
R=Path(__file__).resolve().parents[2];D=R/'src/data/food-manufacturing'
spec=importlib.util.spec_from_file_location('food49',Path(__file__).with_name('author-source49.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
m.LEX.update({'時間順':'じかんじゅん','階級別':'かいきゅうべつ','変えて':'かえて','変わりません':'かわりません','入口':'いりぐち','確かめられません':'たしかめられません','確かめます':'たしかめます','測定条件':'そくていじょうけん','一つずつ':'ひとつずつ','残りません':'のこりません','上下':'じょうげ','翌日':'よくじつ','日付':'ひづけ','未実施':'みじっし','確認済み':'かくにんずみ','予定日':'よていび','記録なし':'きろくなし','同名':'どうめい','根拠':'こんきょ','変わる':'かわる','一つに':'ひとつに','保証して':'ほしょうして','安定':'あんてい','決まった':'きまった','候補':'こうほ','誤り':'あやまり','階級幅':'かいきゅうはば','最大値':'さいだいち','最小値':'さいしょうち','平均値':'へいきんち'})
m.LEX.update({'並び':'ならび','規則':'きそく','言います':'いいます','調べる':'しらべる','行った':'おこなった','扱います':'あつかいます','翌日に':'よくじつに','設備点検':'せつびてんけん','残し':'のこし','両方':'りょうほう'})
m.KEYS=sorted(m.LEX,key=len,reverse=True)
data=json.loads((R/'scripts/food-manufacturing/food65-audit-locales.json').read_text());ja=data['ja']
for text in ja[:2]+[s for q in ja[2]for s in [q[0],*q[1]]]:m.ruby(text)
lesson=next(l for l in json.loads((D/'lessons.2.ja.json').read_text())['lessons']if l['id']=='food-2-021')
common={'lessonId':lesson['id'],'lessonSourceHash':lesson['sourceHash'],'sourceRefs':[{'document':'ssw2','pdfPage':n,'printedPage':n-9}for n in [88,90,92]],'status':'authored_ai_unreviewed','humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
s={**common,'id':'food65-teaching','titleJa':ja[0],'textJa':ja[1],'titleRuby':m.ruby(ja[0]),'ruby':m.ruby(ja[1])};s['sourceHash']=m.digest({k:s[k]for k in ['titleJa','textJa']});s['translations']={loc:{'title':data[loc][0],'text':data[loc][1],'sourceHash':s['sourceHash']}for loc in m.LOCALES}
checks=[]
for i,(prompt,points)in enumerate(ja[2]):
 q={**common,'id':['food65-time-order-check','food65-nonunique-cause-check'][i],'titleJa':ja[0],'promptJa':prompt,'expectedPointsJa':points,'titleRuby':m.ruby(ja[0]),'promptRuby':m.ruby(prompt),'expectedPointsRuby':[m.ruby(v)for v in points],'assessmentType':'open_response_source_application','graded':False,'mutatesLearnerProgress':False}
 q['sourceHash']=m.digest({k:q[k]for k in ['titleJa','promptJa','expectedPointsJa']});q['translations']={loc:{'title':data[loc][0],'prompt':data[loc][2][i][0],'expectedPoints':data[loc][2][i][1],'sourceHash':q['sourceHash']}for loc in m.LOCALES};checks.append(q)
pack65={'schemaVersion':1,'status':'authored_ai_unreviewed','sections':[s],'checks':checks}
# Existing ID/revision and branch comparison are preserved; the unsupported universal
# proof rule is replaced by an explicitly sourced equipment-inspection example.
pack48=json.loads((D/'source-closure48.json').read_text());s=pack48['sections'][0];q=pack48['checks'][0]
scope=json.loads((R/'scripts/food-manufacturing/food48-inspection-scope-locales.json').read_text())
for text in scope['ja']:m.ruby(text)
s.update(textJa=scope['ja'][0],ruby=m.ruby(scope['ja'][0]));q.update(promptJa=scope['ja'][1],promptRuby=m.ruby(scope['ja'][1]));q['expectedPointsJa'][1]=scope['ja'][2];q['expectedPointsRuby'][1]=m.ruby(scope['ja'][2])
if not q['expectedPointsJa'][0].startswith(scope['ja'][3]):q['expectedPointsJa'][0]=scope['ja'][3]+' '+q['expectedPointsJa'][0]
q['expectedPointsRuby'][0]=m.ruby(q['expectedPointsJa'][0])
for x in [s,q]:
 x['sourceRefs']=[{'document':'ssw2','pdfPage':n,'printedPage':n-9}for n in [91,125]]
 x['sourceHash']=m.digest({k:x[k]for k in (['titleJa','textJa']if 'textJa'in x else ['titleJa','promptJa','expectedPointsJa'])})
 for loc in m.LOCALES:x['translations'][loc]['sourceHash']=x['sourceHash']
for loc in m.LOCALES:
 s['translations'][loc]['text']=scope[loc][0];q['translations'][loc]['prompt']=scope[loc][1];q['translations'][loc]['expectedPoints'][1]=scope[loc][2]
 if not q['translations'][loc]['expectedPoints'][0].startswith(scope[loc][3]):q['translations'][loc]['expectedPoints'][0]=scope[loc][3]+' '+q['translations'][loc]['expectedPoints'][0]
(D/'source-closure65.json').write_text(json.dumps(pack65,ensure_ascii=False,indent=2)+'\n');(D/'source-closure48.json').write_text(json.dumps(pack48,ensure_ascii=False,indent=2)+'\n')
print('Authored65 (1section,2checks) and repaired48 scoped inspection (same IDs,1section,1check);12locales each.')
