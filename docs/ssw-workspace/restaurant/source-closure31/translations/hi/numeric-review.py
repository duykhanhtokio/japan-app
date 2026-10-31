from pathlib import Path
import json,hashlib
B=Path(__file__).resolve().parents[2];p=B/'translation-number-screen.json';j=json.loads(p.read_text())
# Per-source-field judgments after reading JA and both authored targets.
notes={
('rst31-cs2-allergy-update','text'):('semantic_equivalent','April/এপ্রিল/अप्रैल explicitly retains month4; day1/year2026 unchanged.'),
('rst31-cooking-service2-q021','objective'):('corrected_omission','Added missing2023edition provenance;2022targetyear/all9categorypercentages preserved. One common provenance sentence scopes entire list; source repeats it9times.'),
('rst31-cooking1-load-source-numbers','text'):('semantic_equivalent','आठ-दसवाँ/দশ ভাগের আট ভাগ explicitly means8/10fill in both occurrences;35–40% unchanged.'),
('rst31-cooking1-q020','stem'):('semantic_equivalent','आठ-दसवाँ/আট ভাগ renders8/10fill, not8items.'),
('rst31-cooking1-q020','options[0]'):('semantic_equivalent','Eight-tenths fill written in words; falseclaim never spills unchanged.'),
('rst31-cooking1-q020','reasons[0]'):('semantic_equivalent','Eight-tenths fill written in words; movement/load still changesrisk.'),
('rst31-hygiene2-a006','text'):('semantic_equivalent','April4/March3months named in local words; dates1April2026/31March2028 andApril2026currentrecommendation intact.'),
('rst31-hygiene2-figure-reference-form-exercise','caption'):('semantic_equivalent','तीन/তিনটি explicitly3items.'),
('rst31-hygiene2-figure-reference-form-exercise','alt'):('semantic_equivalent','तीन/তিনটি explicitly3items.'),
('rst31-hygiene2-q016','options[1]'):('semantic_equivalent','साल में एक बार/বছরে একবার explicitly once/year; falseconflation withdailyroutine retained.'),
('rst31-hygiene2-q024','stem'):('semantic_equivalent','October10 namedअक्टूबर/অক্টোবর;2023/2026retained.'),
('rst31-hygiene2-q024','objective'):('semantic_equivalent','October10 named in local words;2023/2026retained.'),
('rst31-hygiene2-q024','explanation'):('semantic_equivalent','April2026/Marchend2028 explicitnamedmonths andendcondition.'),
('rst31-hygiene2-q024','reasons[0]'):('semantic_equivalent','April2026/Marchend2028 explicitnamedmonths andendcondition.'),
('rst31-hygiene2-q030','objective'):('corrected_omission','Restored15–25℃ambientexample andcoldsaladapplication explicitly in both locales.'),
('rst31-hygiene2-q045','objective'):('corrected_omission','Restored2021:717events11080patients and2022:962events6856patients in both locales.'),
('rst31-service1-a011','text'):('semantic_equivalent','1April2026/31March2028 withnamedmonths; nineingredients retained. Additionalfullartworktitle correction unrelated flaggedcoinlist.'),
('rst31-service1-a019','text'):('semantic_equivalent','Sourcekanjicoinvalues rendered1,5,10,50,100,500; extractor mergingcomma list50100500 is parserartifact; all6values explicit. Full36viewsartworktitle also restored.'),
('rst31-service1-mof-1000-r','caption'):('semantic_equivalent','36renders三十六 inartworkseries title;2024/1000intact.'),
('rst31-service1-mof-1000-r','alt'):('semantic_equivalent','36renders三十六 inartworkseries title;1000intact.'),
('rst31-service1-q007','reasons[0]'):('semantic_equivalent','90° is exactsame rightangle as直角, notinventednewcondition.'),
('rst31-service1-q018','stem'):('semantic_equivalent','Aprilmonth4 named in local words;2026intact.'),
('rst31-service1-q019','stem'):('semantic_equivalent','1April2026 retainsday/month/year;month4named.'),}
notes.update({
('rst31-hygiene2-noro-source-scope','title'):('semantic_equivalent','आठ-दसवाँ / আট-দশমাংশ means eight tenths, i.e.8割.'),
('rst31-hygiene2-noro-source-scope','text'):('semantic_equivalent','November / नवंबर / নভেম্বর names month11;10November2017 and both80% occurrences retained.'),
('rst31-hygiene2-q049','stem'):('semantic_equivalent','Approximately eight tenths expressed in words;2017 remains explicit.'),
('rst31-hygiene2-q049','options[0]'):('clarified_source_conditions','Eight tenths in words; explicitly restored norovirus name in false employee-infection interpretation.'),
('rst31-hygiene2-q049','options[1]'):('clarified_source_conditions','Eight tenths in words; restored approximation while preserving false always/current2026 each-shop claim.'),
('rst31-hygiene2-q049','options[2]'):('clarified_source_conditions','Eight tenths in words; restored approximation in false all-food-poisoning denominator interpretation.')})
records=[]
for r in j['flags']:
 if r['locale']not in ['hi','bn']:continue
 key=(r['id'],r['field']);decision,note=notes[key];records.append({'locale':r['locale'],'id':r['id'],'field':r['field'],'screenTargetSha256':hashlib.sha256(r['target'].encode()).hexdigest(),'decision':decision,'contextNote':note})
assert len(records)==52
(B/'translations/hi/numeric-review.json').write_text(json.dumps({'screenSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'scope':'52HI/BNflags of current screen; exactcontextjudgment byAI,no native/domaincertification. Laterrootrescreenmayaddflags.','records':records},ensure_ascii=False,indent=2)+'\n')
print(len(records))
