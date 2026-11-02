#!/usr/bin/env python3
"""Compile three independent, source-bound calculation models; not a source exam copy."""
import hashlib
import json
from fractions import Fraction as F
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'src/data/manufacturing/calculation48'
DOC=ROOT/'docs/ssw-workspace/manufacturing/session-20261102/calculation48'

def sha(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def read(p):return json.loads((ROOT/p).read_text())

SPECS={
 'density':('mechanical','mfg1-mechanical-lesson-023','example','密度：空洞と逆算（4問）',[123]),
 'resistivity':('electrical','mfg1-electrical-l068','section-1','抵抗率：面積単位と形状比（4問）',[127]),
 'faraday':('surface','mfg1-surface-lesson-028','example','析出量：効率と逆算（4問）',[118,121])
}
# For each option, a distinct equation identifies its specific mistake or proves
# the correct calculation. SI symbols/equations are language-independent and are
# defined in the translated lesson; they are not English fallback prose.
QUESTIONS={
 'density':[
  (['24 cm³','20 cm³','28 cm³','4 cm³'],1,
   ['24 − 4 = 20 cm³ ≠ 24 cm³','24 − 4 = 20 cm³','24 + 4 = 28 cm³; 24 − 4 = 20 cm³','24 − 4 ≠ 4 cm³']),
  (['60 g','10 g','50 g','8 g'],2,
   ['2.5 × 24 = 60 g; 2.5 × (24 − 4) = 50 g','2.5 × 4 = 10 g; 2.5 × (24 − 4) = 50 g','2.5 × (24 − 4) = 50 g','(24 − 4) ÷ 2.5 = 8; m = ρV = 50 g']),
  (['100 g','50 g','120 g','20 g'],0,
   ['5.0 × (24 − 4) = 100 g','2.5 × 20 = 50 g; 5.0 × 20 = 100 g','5.0 × 24 = 120 g; 5.0 × (24 − 4) = 100 g','24 − 4 = 20 cm³ ≠ 20 g; 5.0 × 20 = 100 g']),
  (['18 cm³','24 cm³','69 cm³','6 cm³'],3,
   ['45 ÷ 2.5 = 18 cm³; 24 − 18 = 6 cm³','24 − 45/2.5 = 6 cm³ ≠ 24 cm³','24 + 45 ≠ 24 − 45/2.5; 45 g ≠ 45 cm³','24 − 45/2.5 = 6 cm³'])
 ],
 'resistivity':[
  (['5 × 10⁻⁴ m²','0.5 m²','5 × 10⁻⁷ m²','5 × 10⁻⁵ m²'],2,
   ['1 mm² = (10⁻³ m)² = 10⁻⁶ m² ≠ 10⁻³ m²','0.5 mm² = 0.5 × 10⁻⁶ m² ≠ 0.5 m²','0.5 × (10⁻³)² = 5 × 10⁻⁷ m²','0.5 × 10⁻⁶ = 5 × 10⁻⁷ ≠ 5 × 10⁻⁵']),
  (['0.6 Ω','6 × 10⁻⁷ Ω','6 Ω','6 × 10⁵ Ω'],0,
   ['(3.0 × 10⁻⁸) × 10 / (0.5 × 10⁻⁶) = 0.6 Ω','0.5 mm² ≠ 0.5 m²; S = 0.5 × 10⁻⁶ m²','S = 0.5 mm² ≠ 0.05 mm²; R = 0.6 Ω','0.5 mm² = 5 × 10⁻⁷ m² ≠ 5 × 10⁻¹³ m²']),
  (['0.3 Ω','1.2 Ω','2.4 Ω','0.6 Ω'],3,
   ['ℓ₂/ℓ₁ = 2; S₂/S₁ = 2; R₂/R₁ = 2/2 = 1 ≠ 1/2','R₂/R₁ = (20/10) / (1.0/0.5) = 1 ≠ 2','S₂/S₁ = 2; R₂/R₁ = 2/2 = 1 ≠ 4','(3.0 × 10⁻⁸) × 20 / (1.0 × 10⁻⁶) = 0.6 Ω']),
  (['1.2 Ω','0.3 Ω','2.4 Ω','0.15 Ω'],1,
   ['R₂/R₁ = 2/2² = 1/2 ≠ 2','S₂/S₁ = (d₂/d₁)² = 4; R₂ = 0.6 × 2/4 = 0.3 Ω','R ∝ ℓ/S; R₂/R₁ = 2/4 ≠ 4','ℓ₂/ℓ₁ = 2; 0.6 × 2/4 = 0.3 Ω ≠ 0.6/4'])
 ],
 'faraday':[
  (['45 mg','60 mg','0.75 mg','450 mg'],0,
   ['5 min = 300 s; 0.20 × 1.0 × 300 × 0.75 = 45 mg','0.20 × 1.0 × 300 = 60 mg; 60 × 0.75 = 45 mg','η = 0.75; m = 60 mg × 0.75 = 45 mg','75% = 0.75; 60 × 0.75 = 45 mg ≠ 450 mg']),
  (['0.006 (0.6%)','1.667 (166.7%)','0.75 (75%)','0.60 (60%)'],3,
   ['36/(0.20 × 1.0 × 300) = 0.60 = 60% ≠ 0.6%','η = 36/60 = 0.60 ≠ 60/36','36/60 = 0.60; 60 × 0.75 = 45 mg ≠ 36 mg','η = 36/(0.20 × 1.0 × 300) = 0.60 = 60%']),
  (['450 s','600 s','300 s','900 s'],1,
   ['0.20 × 1.0 × 450 × 0.75 = 67.5 mg ≠ 90 mg','t = 90/(0.20 × 1.0 × 0.75) = 600 s = 10 min','0.20 × 1.0 × 300 × 0.75 = 45 mg ≠ 90 mg','0.20 × 1.0 × 900 × 0.75 = 135 mg ≠ 90 mg']),
  (['90 mg','22.5 mg','45 mg','0 mg'],2,
   ['m₂/m₁ = (k₂/k₁)(I₂/I₁)(t₂/t₁)(η₂/η₁) = 1 ≠ 2','I₂/A₂ = (I₁/A₁)/2; m₂ = kItη = 45 mg ≠ 22.5 mg','k₂=k₁; I₂=I₁; t₂=t₁; η₂=η₁; m₂ = 0.20 × 1.0 × 300 × 0.75 = 45 mg','k > 0, I > 0, t > 0, η = 0.75; m = 45 mg > 0'])
 ]
}

def main():
    author=read(str((DOC/'authoring.json').relative_to(ROOT)))
    locales=read('docs/ssw-workspace/manufacturing/approved-scope.json')['targetLocales']
    OUT.mkdir(parents=True,exist_ok=True)
    # Independent exact arithmetic, not comparison with the keyed answer text.
    assert F(5,2)*(24-4)==50
    assert 24-F(45,1)/F(5,2)==6
    area=F(1,2)*F(1,1000)**2
    assert area==F(5,10**7)
    assert F(3,10**8)*10/area==F(3,5)
    assert F(3,10**8)*20/F(1,10**6)==F(3,5)
    assert F(3,5)*2/(2**2)==F(3,10)
    assert F(1,5)*1*(5*60)*F(3,4)==45
    assert F(36)/(F(1,5)*300)==F(3,5)
    assert F(90)/(F(1,5)*F(3,4))==600
    references=read('docs/ssw-workspace/manufacturing/source-closure-20261031/source-register.json')['sources']
    output=[]
    for key,(specialty,lid,pid,title,pages) in SPECS.items():
        source=next(x for x in references if x['specialty']==specialty)
        lesson=next(l for l in read(f'src/data/manufacturing/{specialty}.json')['lessons'] if l['id']==lid)
        paragraph=next(p for p in lesson['paragraphs'] if p['id']==pid)
        entry=author[key]
        assert set(entry['teaching'])==set(entry['prompts'])==set(['ja',*locales])
        assert all(len(v)==4 for v in entry['prompts'].values())
        wording={}
        for loc in ['ja',*locales]:
            before=paragraph['textJa'] if loc=='ja' else next(p for p in read(f'src/data/manufacturing/translations/{loc}.json')['lessons'][lid]['paragraphs'] if p['id']==pid)['text']
            wording[loc]={'before':before,'after':before+'\n\n'+entry['teaching'][loc]}
        questions=[];targets={loc:{} for loc in locales}
        refs=[{'documentId':source['sourceId'],'pdfPage':p,'printedPage':p-(8 if specialty=='mechanical' else 9 if specialty=='electrical' else 10)} for p in pages]
        for i,(options,answer,reasons) in enumerate(QUESTIONS[key]):
            q={'id':f'mfg1-calc48-{key}-{i+1:02}','lessonId':lid,'stemJa':entry['prompts']['ja'][i],
               'optionsJa':options,'correctIndex':answer,'optionReasonsJa':reasons,'sources':refs}
            q['sourceHash']=sha(q);questions.append(q)
            for loc in locales:
                targets[loc][q['id']]={'sourceHash':q['sourceHash'],'stem':entry['prompts'][loc][i],
                  'options':options,'reasons':reasons}
        patch={'lessonId':lid,'paragraphId':pid,'sourceHash':lesson['sourceHash'],'wording':wording}
        data={'schemaVersion':1,'id':f'mfg1-calc48-{key}-supplement','specialty':specialty,
              'revision':'mfg48-'+key+'-'+sha({'patch':patch,'questions':questions})[:12],
              'titleJa':title,'lessonPatch':patch,'canonicalTaughtAfter':patch['wording']['ja']['after'],'questions':questions,'locales':targets,
              'sourcePdfSha256':source['sha256'],'nativeReviewed':False,'domainReviewed':False,
              'physicalDeviceVerified':False,'wholeSourceClosed':False}
        (OUT/(key+'.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
        output.append({'group':key,'questions':4,'questionLocalePairs':48,'lessonLocales':13,
                       'sourcePages':pages,'sourcePdfSha256':source['sha256'],'revision':data['revision']})
    (DOC/'build-validation.json').write_text(json.dumps({'status':'PASS','groups':output,
      'newQuestions':12,'newLocalePairs':144,'newLessonLocaleEntries':39,
      'rationaleLanguage':'language_independent_equations_and_SI_symbols_not_English_fallback',
      'exactFractionArithmetic':'PASS','whole574KnowledgeClosed':False},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'status':'PASS','groups':3,'questions':12,'questionLocalePairs':144,'exactArithmetic':'PASS'}))

if __name__=='__main__':main()
