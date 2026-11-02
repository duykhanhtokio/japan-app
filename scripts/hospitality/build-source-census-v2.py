"""Build the source-first Hospitality v2 acceptance view.

Source PDFs, extracted prose and screenshots stay outside Git. Geometry is an
inventory only: no keyword match or bounding-box count can close a source page.
The small explicit region map below records this worker's source reading; the
remaining inherited atoms remain candidates until they receive such a review.
"""
import argparse
import gzip
import hashlib
import json
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[2]
DOC = ROOT / 'docs/ssw-workspace/hospitality'
OUT = ROOT / 'docs/ssw-workspace/source-coverage-v2'
BASELINE = '5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a'
RECEIPT = 'docs/ssw-workspace/hospitality/source-census-v2-review.json'

def js(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))

def digest(data):
    return hashlib.sha256(data if isinstance(data, bytes) else data.encode()).hexdigest()

def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def bounds(rect):
    return [round(float(x), 3) for x in rect]

def ref(source, page, indexes):
    return (source, page, indexes)

# Explicit text block references read against PDF page images and body text.
# The same fact appears in two books; neither source occurrence is discarded.
READ = {
 'HF1-005-01':[ref('hotel-1',5,list(range(7,13))+[0,1,2,3,6]),ref('hotel-2',8,list(range(7,13))+[0,1,2,3,6])],
 'HF1-005-02':[ref('hotel-1',5,[12,13,14]),ref('hotel-2',8,[12,13,14])],
 'HX1-005-reception':[ref('hotel-1',5,[7]),ref('hotel-2',8,[7])],
 'HF1-006-01':[ref('hotel-1',6,[3,4,5,8,9,10]),ref('hotel-2',9,[3,4,5,8,9,10])],
 'HF1-007-01':[ref('hotel-1',7,[13,14]),ref('hotel-2',10,[0,1])],
 'HF1-007-02':[ref('hotel-1',7,list(range(14,23))),ref('hotel-2',10,list(range(1,10)))],
 'HF1-007-03':[ref('hotel-1',7,[3,4]),ref('hotel-2',11,[7,8])],
 'HF1-007-04':[ref('hotel-1',7,[5,6]),ref('hotel-2',11,[9,10])],
 'HA1-007-01':[ref('hotel-1',7,[7,8]),ref('hotel-2',11,[11,12])],
 'HA1-007-02':[ref('hotel-1',7,[7,8]),ref('hotel-2',11,[11,12])],
 'HF1-007-05':[ref('hotel-1',7,[9,10]),ref('hotel-2',11,[13,14])],
 'HF1-007-06':[ref('hotel-1',7,[11]),ref('hotel-2',11,[15])],
 'HF1-007-07':[ref('hotel-1',7,[12]),ref('hotel-2',11,[16])],
 'HF2-010-01':[ref('hotel-2',10,[19,20])],
 'HF2-010-02':[ref('hotel-2',10,[21,22])],
 'HF2-010-03':[ref('hotel-2',10,[22,23,24])],
 'HF2-010-04':[ref('hotel-2',10,[23,24])],
 'HF2-011-01':[ref('hotel-2',11,[13,14])],
 'HX2-011-reservation':[ref('hotel-2',11,[28,29,30,31])],
 'HF2-011-02':[ref('hotel-2',11,[36,37])],
 'HF2-011-03':[ref('hotel-2',11,[38,39])],
 'HF2-011-04':[ref('hotel-2',11,[39,40])],
 'HF2-011-05':[ref('hotel-2',11,[40,41])],
 'HF2-011-06':[ref('hotel-2',11,[41,42])],
 'HF2-011-07':[ref('hotel-2',11,[40,41])],
 'HF1-008-01':[ref('hotel-1',8,[3]),ref('hotel-2',12,[3])],
 'HF1-008-02':[ref('hotel-1',8,[4]),ref('hotel-2',12,[4])],
 'HF1-008-03':[ref('hotel-1',8,[7,8,18,19]),ref('hotel-2',12,[7,8,18,19])],
 'HF1-008-04':[ref('hotel-1',8,[5]),ref('hotel-2',12,[5])],
 'HF1-008-05':[ref('hotel-1',8,[9,10]),ref('hotel-2',12,[9,10])],
 'HF1-008-06':[ref('hotel-1',8,[6]),ref('hotel-2',12,[6])],
 'HF1-008-07':[ref('hotel-1',8,[0,1,2]),ref('hotel-2',12,[0,1,2])],
}
READ.update({
 'HP1-020-01':[ref('hotel-1',20,[0,1,2,3]),ref('hotel-2',25,[4,5,6,7])],
 'HP1-020-02':[ref('hotel-1',20,[0,1]),ref('hotel-2',25,[4,5])],
 'HP1-020-03':[ref('hotel-1',20,[4,5,6]),ref('hotel-2',25,[8,9,10])],
 'HP1-021-01':[ref('hotel-1',21,[1,2]),ref('hotel-2',26,[30,31])],
 'HP1-021-02':[ref('hotel-1',21,[3,4]),ref('hotel-2',26,[32,33])],
 'HP1-021-03':[ref('hotel-1',21,[5,6,7]),ref('hotel-2',26,[34,35,36])],
 'HP1-021-04':[ref('hotel-1',21,[8,9,10,11]),ref('hotel-2',26,[37,38,39,40])],
 'HP1-021-05':[ref('hotel-1',21,[12,13,14]),ref('hotel-2',26,[41,42,43])],
 'HP1-021-06':[ref('hotel-1',21,[15,16]),ref('hotel-2',26,[53,54])],
 'HP1-021-07':[ref('hotel-1',21,[16,17]),ref('hotel-2',26,[54,55,56])],
 'HP1-021-08':[ref('hotel-1',21,[18,19,20]),ref('hotel-2',26,[57,58,59])],
 'HP1-021-09':[ref('hotel-1',21,[21,22,23,24]),ref('hotel-2',27,[27,28,29,30])],
 'HP1-021-10':[ref('hotel-1',21,[28,29,30]),ref('hotel-2',27,[39,40,41])],
 'HP1-021-11':[ref('hotel-1',21,[25,26,27]),ref('hotel-2',28,[20,21,22])],
 'HP1-022-01':[ref('hotel-1',22,[0,1,2]),ref('hotel-2',27,[42,43,44])],
 'HP1-022-02':[ref('hotel-1',22,[3,4,6,7,8]),ref('hotel-2',27,[45,46,48,49,50])],
 'HP1-022-03':[ref('hotel-1',22,[5,6]),ref('hotel-2',27,[46,47,48])],
 'HP1-022-04':[ref('hotel-1',22,[9,10,11]),ref('hotel-2',28,[2,3,4])],
 'HP1-022-05':[ref('hotel-1',22,[16,17,18]),ref('hotel-2',28,[9,10,11])],
 'HP1-022-06':[ref('hotel-1',22,[17,18]),ref('hotel-2',28,[10,11])],
 'HP1-022-07':[ref('hotel-1',22,[18,19,20,21]),ref('hotel-2',28,[11,12,13,14])],
 'HP1-022-08':[ref('hotel-1',22,[22,23,24,25]),ref('hotel-2',28,[15,16,17,18,19])],
 'HP1-023-01':[ref('hotel-1',23,[1,2,3,4,5]),ref('hotel-2',29,[1,2,3,4,5])],
 'HP1-023-02':[ref('hotel-1',23,[2,3]),ref('hotel-2',29,[2,3])],
 'HP1-023-03':[ref('hotel-1',23,[6,7,8]),ref('hotel-2',29,[6,7,8])],
 'HP1-023-04':[ref('hotel-1',23,[10,11]),ref('hotel-2',29,[10,11])],
 'HP1-024-01':[ref('hotel-1',24,[4,5,6]),ref('hotel-2',30,[4,5,6])],
 'HP1-024-02':[ref('hotel-1',24,[7,8,9]),ref('hotel-2',30,[7,8,9])],
 'HP1-024-03':[ref('hotel-1',24,[10,11]),ref('hotel-2',30,[10,11])],
 'HP1-024-04':[ref('hotel-1',24,[12,13,14,15]),ref('hotel-2',30,[12,13,14,15])],
 'HP1-024-05':[ref('hotel-1',24,[16,17,18]),ref('hotel-2',30,[17,18,19])],
 'HP1-024-06':[ref('hotel-1',24,[19,20,21]),ref('hotel-2',30,[20,21,22])],
 'HP1-024-07':[ref('hotel-1',24,[22,23,24]),ref('hotel-2',30,[23,24,25])],
 'HP1-025-01':[ref('hotel-1',25,[3,4,5,6]),ref('hotel-2',31,[3,4,5,6])],
 'HP1-025-02':[ref('hotel-1',25,[7,8,9]),ref('hotel-2',31,[7,8,9])],
 'HP1-025-03':[ref('hotel-1',25,[10,11]),ref('hotel-2',31,[10,11])],
 'HP1-025-04':[ref('hotel-1',25,[12,13]),ref('hotel-2',31,[12,13])],
 'HP1-025-05':[ref('hotel-1',25,[14,15,16]),ref('hotel-2',31,[14,15,16])],
 'HP1-025-06':[ref('hotel-1',25,[17,18]),ref('hotel-2',31,[17,18])],
 'HP1-025-07':[ref('hotel-1',25,[18,19]),ref('hotel-2',31,[18,19])],
 'HP1-025-08':[ref('hotel-1',25,[20,21,22,23]),ref('hotel-2',31,[20,21,22,23])],
 'HSP1-022-revenue-definition':[ref('hotel-1',22,[22,23,24,25]),ref('hotel-2',28,[15,16,17,18,19])],
})
CONDITIONS = {
 'HF1-007-01':['宿泊希望日に提供できる客室があるかを確認する。'],
 'HF1-007-02':['料金や清掃状態の用語と混同せず、対象日の客室情報を確認する。'],
 'HF1-007-03':['税や追加料金の扱いを全国一律としない。施設・地域の案内を確認する。'],
 'HF1-007-04':['教材の時刻例を全施設共通の規則として扱わない。'],
 'HA1-007-01':['教材の基本説明と実際の施設の客室構成を区別する。'],
 'HA1-007-02':['ベッドの構成を人数・食数・泊数と混同しない。'],
 'HF1-007-05':['販売するプランに実際に含まれるサービスの範囲を確認する。'],
 'HF1-007-06':['客室・プランの実際の情報を確認し、未確認の眺望や料理を約束しない。'],
 'HF1-007-07':['不明な開催日程やサービスを推測で案内しない。'],
 'HF2-010-01':['用語の区別を学ぶもので、予約超過を実施する指示ではない。'],
 'HF2-010-03':['受入れ不能で、事前連絡が可能な場合に連絡する。'],
 'HF2-010-04':['代替施設名の紹介だけで終了せず、実際の受入れ可否を確認する。'],
 'HF2-011-01':['宿泊を伴うプランと混同せず、販売条件を確認する。'],
 'HF2-011-02':['他の担当者へ取り次ぐための保留が長くなる場合。'],
 'HF2-011-03':['担当者が不在で、直ちに取り次げない場合。'],
 'HF2-011-04':['自分で正確に対応できる範囲と、担当者でなければ困難な内容を分ける。'],
 'HF2-011-05':['確認できた対応可能時刻を伝え、折返しの要否を尋ねる。'],
 'HF2-011-07':['不在理由を創作せず、施設として案内できる確認済み情報の範囲にとどめる。'],
 'HF1-008-03':['予約に必要な個人情報を施設の定める方法で適切に管理する。'],
 'HF1-008-06':['食事提供部門への正確な引継ぎを扱い、診断や安全保証は行わない。'],
 'HF1-008-07':['確認はノーショー防止に役立てるもので、来館の保証ではない。'],
}
CONDITIONS.update({
 'HP1-020-01':['施設の設備・食事・地域体験と客層の実際のニーズを照合する。'],
 'HP1-020-03':['企画図の組合せは例であり、国籍・客層全員の希望を固定しない。菜食対応は原材料等を確認する。'],
 'HP1-021-03':['連泊特典や割引は必ず付くものではなく、施設・プランの条件を確認する。'],
 'HP1-021-04':['事前予約がなくても、空室と受付条件の確認を省略しない。'],
 'HP1-021-05':['預り金と客室料金そのものを混同せず、施設の条件を確認する。'],
 'HP1-021-07':['仲介手数料の減少を全ての費用がゼロになる保証としない。'],
 'HP1-021-09':['旅行の組立て方と、施設利用経験や予約経路の分類軸を混同しない。'],
 'HP1-021-10':['商品ごとの対象サービスと別料金を確認する。'],
 'HP1-021-11':['価格変更だけで成果を断定せず、予約・販売室数・需要を合わせて見る。'],
 'HP1-022-02':['同じ対象日・販売可能室数・販売室数の条件をそろえ、百分率で表す。'],
 'HP1-022-04':['例の客室売上と販売室数を使う。売店等の売上を無条件に足さず、分母ゼロは計算しない。'],
 'HP1-022-05':['同じ対象日と客室範囲の値を用いる。OCCを掛ける際は小数へ換算する。'],
 'HP1-022-06':['75％等の百分率を75のまま掛けず0.75へ換算する。'],
 'HP1-022-07':['単価のみ、または稼働率のみで販売結果を結論しない。'],
 'HP1-023-03':['実際に提供できる強みを具体化し、未確認の優位性を創作しない。'],
 'HP1-024-03':['画像・説明と実際の客室や施設の内容を一致させる。'],
 'HP1-024-05':['順位の保証ではなく、利用者が探す言葉と役立つ内容を整える。'],
 'HP1-024-07':['終了した企画や古い料金を放置せず関連ページとの整合を確認する。'],
 'HP1-025-02':['原資料の頻度例を全施設共通の毎日投稿義務としない。'],
 'HP1-025-03':['確認した情報で応答する。速さを理由に未確認内容を回答しない。'],
 'HP1-025-05':['連携条件・施設方針を確認し、アカウントタグと共通ハッシュタグの役割を区別する。'],
 'HP1-025-06':['公開済みの投稿であっても、施設での利用承諾と運用方針を確認する。'],
 'HP1-025-08':['反応の大小だけで因果を断定せず、話題・時期・運用条件を確認する。'],
 'HSP1-022-revenue-definition':['当日の客室販売機会を翌日の在庫へ持ち越せない性質を踏まえる。価格を動かすだけで収益改善を保証しない。'],
})
PARTIAL = {}


def build(source_dir):
    sources = json.loads((DOC/'source-inventory.json').read_text())['sources']
    old = json.loads((DOC/'source-atoms-authoring.json').read_text())
    atoms = {a['atomId']:a for a in old['atoms']}
    # The glossary meaning itself was missing from the old atomic denominator,
    # although independently authored teaching and a suitable question exist.
    atoms['HSP1-022-revenue-definition']={
      'sourceSummaryJa':'レベニューマネジメントは、繰越しのできない客室の販売機会と需要を踏まえ、価格や販売方法を考える収益管理である。',
      'sourceRefs':[{'sourceId':'hotel-1','pdfPage':22},{'sourceId':'hotel-2','pdfPage':28}],
      'after':{'evidence':{'lessonId':'hotel-planning-02','sectionId':'hotel-planning-02-pricing',
         'quote':'レベニューマネジメントは、売れ残った当日の一泊分を翌日に持ち越せない客室の性質を踏まえ、需要を見ながら販売価格や方法を考える収益管理である。'},
         'questionIds':['hotel-planning-02-q07']}}
    assert set(READ).issubset(atoms)
    existing_pages = {(p['sourceId'],p['pdfPage']):p for p in old['pages']}
    unit_refs = {}
    for aid,a in atoms.items():
        maps={(s,n):ix for s,n,ix in READ.get(aid,[])}
        unit_refs[aid]=[{'sourceId':r['sourceId'],'pdfPage':r['pdfPage'],
          'elementIds':[f"{r['sourceId']}-p{r['pdfPage']:03}-text-{i:03}" for i in maps.get((r['sourceId'],r['pdfPage']),[])]} for r in a['sourceRefs']]
    page_units={}
    element_units={}
    for aid,refs in unit_refs.items():
        for r in refs:
            page_units.setdefault((r['sourceId'],r['pdfPage']),[]).append(aid)
            for eid in r['elementIds']:element_units.setdefault(eid,[]).append(aid)
    ledger_sources=[];pages=[];all_elements={};totals={};reviewed_pages=set()
    for s in sources:
        file=source_dir/s['filename'];raw=file.read_bytes();assert digest(raw)==s['sha256'],file
        doc=fitz.open(file);assert len(doc)==s['pdfPages']
        ledger_sources.append({'sourceId':s['sourceId'],'sha256':s['sha256'],'pdfPages':len(doc),
          'aliases':[],'byteVerified':True,'verificationRef':RECEIPT,'filename':s['filename'],
          'sourceRights':'No redistribution permission established. PDFs/text/page images remain private.'})
        artifact={'schemaVersion':1,'sector':'hospitality','sourceId':s['sourceId'],'pages':[]}
        for n,p in enumerate(doc,1):
            es=[];blocks=p.get_text('dict')['blocks']
            for i,b in enumerate(blocks):
                if b['type']!=0:continue
                text='\n'.join(''.join(sp['text'] for sp in l['spans']) for l in b['lines'])
                if not text.strip():continue
                eid=f"{s['sourceId']}-p{n:03}-text-{i:03}";spans=[sp for l in b['lines'] for sp in l['spans']]
                es.append({'elementId':eid,'kind':'text','bbox':bounds(b['bbox']),'sha256':digest(text),
                  'classification':'knowledge' if eid in element_units else 'pending','knowledgeIds':element_units.get(eid,[]),
                  'reason':None,'fontMin':min(sp['size'] for sp in spans),'fontMax':max(sp['size'] for sp in spans),
                  'characterCount':len(text),'semanticReviewScope':'explicit block assignment only' if eid in element_units else None})
                for li,line in enumerate(b['lines']):
                    for si,sp in enumerate(line['spans']):
                        if not sp['text'].strip():continue
                        es.append({'elementId':f'{eid}:span:{li}:{si}','kind':'text_span','parentId':eid,
                          'bbox':bounds(sp['bbox']),'sha256':digest(sp['text']),'classification':'pending',
                          'knowledgeIds':[],'reason':None,'fontSize':sp['size'],'characterCount':len(sp['text'])})
            for i,im in enumerate(p.get_image_info(xrefs=True)):
                content=doc.extract_image(im['xref'])['image'] if im.get('xref') else im['digest']
                es.append({'elementId':f"{s['sourceId']}-p{n:03}-image-{i:03}",'kind':'image',
                  'bbox':bounds(im['bbox']),'sha256':digest(content),'classification':'pending',
                  'knowledgeIds':[],'reason':None,'width':im['width'],'height':im['height']})
            drawings=p.get_drawings()
            for i,box in enumerate(p.cluster_drawings(drawings=drawings)):
                parts=[d for d in drawings if fitz.Rect(d['rect']).intersects(box)]
                es.append({'elementId':f"{s['sourceId']}-p{n:03}-vector-{i:03}",'kind':'vector',
                  'bbox':bounds(box),'sha256':digest(repr(parts)),'classification':'pending',
                  'knowledgeIds':[],'reason':None,'drawingParts':len(parts)})
            for i,table in enumerate(p.find_tables().tables):
                extracted=table.extract();eid=f"{s['sourceId']}-p{n:03}-table-{i:03}"
                es.append({'elementId':eid,'kind':'table','bbox':bounds(table.bbox),'sha256':digest(js(extracted)),
                  'classification':'pending','knowledgeIds':[],'reason':None,'rowCount':table.row_count,'columnCount':table.col_count,
                  'detectorStatus':'candidate_table_geometry_not_semantic_table_acceptance'})
                for ri,row in enumerate(table.rows):
                    for ci,cell in enumerate(row.cells):
                        if cell is None:continue
                        value=extracted[ri][ci] if ci<len(extracted[ri]) else None
                        es.append({'elementId':f'{eid}:cell:{ri}:{ci}','parentId':eid,'kind':'table',
                          'bbox':bounds(cell),'sha256':digest(js(value)),'classification':'pending',
                          'knowledgeIds':[],'reason':None,'rowIndex':ri,'columnIndex':ci,'cellCandidate':True})
            for e in es:
                assert e['elementId'] not in all_elements;all_elements[e['elementId']]=e
                totals[e['kind']]=totals.get(e['kind'],0)+1
            artifact['pages'].append({'pdfPage':n,'elements':es})
        path=OUT/f"hospitality-{s['sourceId']}-elements.json.gz"
        path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(gzip.compress(js(artifact).encode(),mtime=0))
        for ap in artifact['pages']:
            n=ap['pdfPage'];prior=existing_pages[(s['sourceId'],n)];is_read=any((sid,pn)==(s['sourceId'],n) for ms in READ.values() for sid,pn,_ in ms)
            if is_read:reviewed_pages.add((s['sourceId'],n))
            reason=prior.get('exclusionReason');kind='instructional'
            if reason:
                kind='publication' if 'colophon' in reason.lower() or 'publication' in reason.lower() else 'decorative' if 'decorative' in reason.lower() or 'cover' in reason.lower() else 'navigation'
            pages.append({'sourceId':s['sourceId'],'pdfPage':n,'disposition':kind,'exclusionReason':reason,
              'regionCensus':{'artifactPath':str(path.relative_to(ROOT)),'sha256':digest(path.read_bytes()),
                 'elementCount':len(ap['elements']),'status':'visually_reviewed' if is_read else 'extracted',
                 'visualReviewRef':RECEIPT if is_read else None},
              'semanticInventory':{'status':'partial' if is_read else 'pending','reviewRef':RECEIPT if is_read else None},
              'knowledgeIds':page_units.get((s['sourceId'],n),[]),
              'historicalClassificationOnly':not is_read})
    for refs in unit_refs.values():
        for r in refs:
            for eid in r['elementIds']:assert eid in all_elements,eid
    lessons={};questions={}
    for group in ['front','planning','service','restaurant','safety']:
        file=ROOT/f'src/data/hospitality/{group}.json';data=json.loads(file.read_text())
        for li,l in enumerate(data['lessons']):
            lessons[l['id']]=(str(file.relative_to(ROOT)),li,l)
            for qi,q in enumerate(l['questions']):questions[q['id']]=(str(file.relative_to(ROOT)),li,qi,q)
    units=[]
    for aid,a in atoms.items():
        read=aid in READ;file,li,l=lessons[a['after']['evidence']['lessonId']]
        si=next(i for i,s in enumerate(l['sections']) if s['id']==a['after']['evidence']['sectionId']);section=l['sections'][si]
        assert a['after']['evidence']['quote'] in section['body']
        direct={'relation':'direct' if read else 'candidate','semanticReviewed':read,
            'reviewNote':f"Self-read source claim {aid}, conditions and current app content; direct competency checked." if read else 'Inherited page-level evidence; exact source region and semantic correspondence not freshly accepted.'}
        te=[{'path':file,'jsonPointer':f'/lessons/{li}/sections/{si}/body','sha256':digest(js(section['body'])),
             'sha256Mode':'json-value',**direct}]
        ae=[]
        for qid in a['after']['questionIds']:
            qfile,qli,qi,q=questions[qid]
            assessment_review = direct if aid not in PARTIAL else {
              'relation':'candidate','semanticReviewed':False,
              'reviewNote':'General regional cooperation is related, but this question does not directly test account-tagging functionality.'}
            ae.append({'path':qfile,'jsonPointer':f'/lessons/{qli}/questions/{qi}','sha256':digest(js(q)),
               'sha256Mode':'json-value',**assessment_review})
        unresolved=PARTIAL.get(aid,[]) if read else ['The source atom has page-level provenance but no self-reviewed exact source-element assignment in v2.','Conditions and exceptions need source-by-source confirmation; inherited teaching/assessment links remain candidates.']
        units.append({'knowledgeId':aid,'sourceRefs':unit_refs[aid],'statementJa':a['sourceSummaryJa'],
          'conditionsJa':CONDITIONS.get(aid,[]),'exceptionsJa':[],
          'importance':'safety' if aid.startswith(('HA1-046','HA2-','HS')) else 'core',
          'classification':'knowledge','before':{'teaching':'unknown','assessment':'partial' if aid in ['HF1-007-06','HF1-007-02','HF2-011-03'] else 'unknown'},
          'after':{'teaching':'present' if read else 'unknown','assessment':'partial' if aid in PARTIAL else 'present' if read else 'unknown'},
          'teachingEvidence':te,'assessmentEvidence':ae,'imageEvidence':[],
          'assessmentRequirement':'required','assessmentExemptionReason':None,
          'expressionReview':{'status':'independent_ai_checked' if read and aid not in PARTIAL else 'pending',
             'note':PARTIAL[aid][0] if aid in PARTIAL else 'App explanations and scenarios independently expressed; common occupational terms retained. Source page images/prose are not redistributed. No blanket rights clearance inferred.' if read else 'Fresh expression review remains pending.'},
          'sourceReview':{'status':'self_checked_ai' if read else 'pending','conditionsChecked':read,'reviewRef':RECEIPT if read else None},
          'status':'partial' if aid in PARTIAL else 'covered_ai' if read else 'candidate','unresolved':unresolved,
          'legacyRefs':[{'path':'docs/ssw-workspace/hospitality/source-atoms-authoring.json','atomId':aid,'role':'provenance_only_not_additional_denominator'}] if aid in [a['atomId'] for a in old['atoms']] else [],
          'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}})
    ledger={'schemaVersion':2,'sector':'hospitality','baselineCommit':BASELINE,'sources':ledger_sources,'pages':pages,'knowledgeUnits':units,
       'denominator':{'status':'open','reviewNote':'All117 pages have complete primitive extraction, but extracted regions and380 inherited atoms are not a frozen semantic denominator. Small-font spans, images, vectors and table cells remain explicit pending work.'},
       'wholeSourceKnowledgeCovered':False,'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False},
       'unresolved':['Classify every pending source element by meaning, including ruby/captions/table cells and figure relations.','The380 inherited atoms may omit independent claims; continue source-first semantic enumeration on all117 pages.','Legacy page exclusions are historical classifications and require v2 visual/semantic receipt before closure.','Complete current-revision translations and external device/duration/domain acceptance separately.']}
    save(OUT/'hospitality.json',ledger)
    save(DOC/'source-census-v2-review.json',{'date':'2026-11-02','sourceFiles':[{'sourceId':s['sourceId'],'sha256':s['sha256'],'pdfPages':s['pdfPages']} for s in sources],
      'primitiveCounts':totals,'pages':len(pages),'selfReadPages':[{'sourceId':s,'pdfPage':n} for s,n in sorted(reviewed_pages)],
      'selfReadKnowledgeIds':sorted(READ),'sourceReadingMethod':'Extracted body/labels plus full rendered PDF pages read by this worker. Private originals and screenshots are not public artifacts.',
      'semanticGroupScopes':['Front workflow and reservation management','Availability, room/plan information and telephone handling','Reservation data and preparation','Product planning and room-revenue terminology/calculations','Public relations and website operation','SNS planning, interaction, permissions and analysis'],
      'appAssessmentRepairs':{'HF1-007-06':'hotel-front-01-q09','HF1-007-02':'hotel-front-01-q10','HF2-011-03':'hotel-front-06-q07'},
      'unreviewedGeometryIsKnowledge':False,'completeSourceDenominator':False,'expertReviewed':False,'rightsClearedForSourceRedistribution':False})
    print(js({'pages':len(pages),'regions':sum(totals.values()),'counts':totals,'inheritedAtoms':len(old['atoms']),'newSourceUnits':len(units)-len(old['atoms']),'knowledgeUnits':len(units),'sourceSelfCheckedAtoms':len(READ),'sourceSelfReadPages':len(reviewed_pages),'wholeSourceKnowledgeCovered':False}))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('source_directory',type=Path);args=parser.parse_args();build(args.source_directory)
