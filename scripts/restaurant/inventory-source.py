#!/usr/bin/env python3
"""Inventory attached restaurant PDFs without placing their text/images in Git.

The ledger is a navigation/coverage scaffold, not semantic verification. Headings
are retained only as short source metadata. Explicit image-only page findings are
human-readable AI inspection notes; no native/domain/human review is implied.
"""
from __future__ import annotations
import argparse, hashlib, json, re, subprocess, unicodedata
from pathlib import Path
import fitz

TOPICS={'衛生管理':'hygiene','飲食物調理':'cooking','接客全般':'service','店舗運営':'operations'}
PRINT_SEGMENTS={
'rst-1-hygiene':[(5,8,1),(10,18,5),(20,27,14),(29,43,22)],
'rst-1-cooking':[(5,11,1),(13,16,8),(18,21,12),(23,31,16),(33,47,25)],
'rst-1-service':[(5,22,1),(24,27,19),(29,34,23),(36,38,29),(40,48,32)],
'rst-2-hygiene':[(5,40,1)],'rst-2-cooking':[(5,23,1)],
'rst-2-service':[(5,25,1)],'rst-2-operations':[(5,31,1)]}
IMAGE_FINDINGS={
('rst-1-hygiene',24):{'label':'加熱後に提供する料理の分類を具体例で確認する','type':'food-example-illustration','knowledge':'加熱した料理の見た目だけで安全を判断せず、加熱管理の対象に分類する。','printedPage':18},
('rst-1-hygiene',35):{'label':'一般衛生管理の実施記録様式','type':'rotated-record-form','knowledge':'日付、確認項目、庫内温度、良否、特記事項、確認者を対応させて記録する。','printedPage':28},
('rst-1-hygiene',36):{'label':'一般衛生管理記録の記入例','type':'rotated-record-example','knowledge':'不適合を隠さず記録し、処置内容と再確認を残す。記入例の値は普遍的基準ではない。','printedPage':29},
('rst-1-hygiene',37):{'label':'重要管理の実施記録様式','type':'rotated-record-form','knowledge':'非加熱、加熱、高温保管、冷却後再加熱、冷却後提供の工程区分に応じて記録欄を設定する。','printedPage':30},
('rst-1-hygiene',38):{'label':'重要管理記録の記入例','type':'rotated-record-example','knowledge':'加熱不良などの逸脱があったときは具体的な対象、処置、再確認を記録する。','printedPage':31},
('rst-2-hygiene',39):{'label':'食品衛生監視票の一般衛生管理チェック','type':'raster-checklist','knowledge':'衛生計画、手順書、教育、記録・検証と施設・設備・使用水などの管理状況を点検する。','printedPage':35},
('rst-2-hygiene',40):{'label':'食品衛生監視票のHACCP・改善確認','type':'raster-checklist','knowledge':'危害分析、重要管理点、管理基準、モニタリング、改善措置、検証、記録の対応を確認する。点数表は参考様式。','printedPage':36},
('rst-2-service',19):{'label':'客席・備品・便所の清掃手順表','type':'raster-procedure-table','knowledge':'場所と備品の材質に合わせて用具・洗浄・乾燥・頻度を設定し、便所用具を客席清掃に流用しない。図の薬剤や頻度はモデル例として扱う。','printedPage':15},
('rst-2-service',21):{'label':'苦情対応と責任者報告の流れ','type':'raster-response-flow','knowledge':'相手の訴えを最後まで聞き、事実と実施済み処置を責任者へ伝える。記録と原因対策を共有し、再発防止につなげる。','printedPage':17},
('rst-2-service',18):{'label':'清掃作業マニュアルの構成','type':'raster-procedure-table','knowledge':'対象、使用道具、作業順序、実施頻度を明示する。希釈倍率は製品の説明書に従い、図の例を全製品に当てはめない。','printedPage':14},
}
APPENDICES={
'rst-1-hygiene':[(29,30,'衛生管理計画と工程分類を設計する'),(31,34,'一般衛生・重要管理の計画様式と記入例を読み取る'),(35,38,'日々の実施記録と逸脱時の記入を実践する'),(39,43,'衛生管理の参考用語と関連事項を確認する')],
'rst-1-cooking':[(39,47,'厨房設備・調理器具の基本用語を識別する')],
'rst-1-service':[(43,48,'サービス基本用語と接客場面の意味を確認する')],
'rst-2-hygiene':[(39,40,'食品衛生監視票を使って管理体系を点検する')],
'rst-2-cooking':[(22,23,'キッチン基本用語と作業上の意味を確認する')],
'rst-2-service':[(24,25,'サービス基本用語を接客指導で使い分ける')],
'rst-2-operations':[(6,6,'QSC基準を業態に応じて設定する'),(11,16,'計数管理の指標・公式を使って解法を説明する'),(25,25,'接客基本用語を訓練に取り入れる'),(29,29,'緊急時の役割と優先行動を確認する'),(30,31,'マネジメント基本用語を運営判断に結び付ける')],
}

def dump(path,obj):
 # Preserve manually reviewed coverage links and source-review additions on rerun.
 if path.name=='knowledge-ledger.json' and path.exists():
  previous=json.loads(path.read_text())
  if previous.get('semanticCoverageVerified') or previous.get('summary',{}).get('subjectLinked'):
   print('Preserved existing semantic knowledge ledger; inventory generation is not a coverage reset.')
   return
 if path.name=='source-review.json' and path.exists():
  previous=json.loads(path.read_text())
  if 'semanticReviewCheckpoint' in previous:obj['semanticReviewCheckpoint']=previous['semanticReviewCheckpoint']
 path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def compact(s):return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',s)).strip()
def printed(doc_id,n):
 for start,end,first in PRINT_SEGMENTS[doc_id]:
  if start<=n<=end:return first+n-start
 return None

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--input',type=Path,required=True);ap.add_argument('--scratch',type=Path,required=True);ap.add_argument('--output',type=Path,default=Path('docs/ssw-workspace/restaurant'));args=ap.parse_args()
 args.scratch.mkdir(parents=True,exist_ok=True);args.output.mkdir(parents=True,exist_ok=True)
 docs=[];units=[];section_map={};flagged=[]
 for p in sorted(args.input.glob('*.pdf')):
  topic=next((v for k,v in TOPICS.items() if k in p.name),None)
  if not topic:continue
  level='1' if '１号' in p.name else '2';doc_id=f'rst-{level}-{topic}';doc=fitz.open(p)
  proc=subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True,check=True);pages=proc.stdout.split('\f')[:len(doc)]
  dump(args.scratch/f'{doc_id}.pages.json',pages)
  (args.scratch/f'{doc_id}.txt').write_text('\n'.join(f'\n=== PDF PAGE {i+1} ===\n{t}' for i,t in enumerate(pages)))
  page_meta=[];headings=[];chapter='';section=''
  start=4 if level=='1' else 5
  for i,t in enumerate(pages):
   n=i+1;pl=printed(doc_id,n);images=len(doc[i].get_images());finding=IMAGE_FINDINGS.get((doc_id,n));lines=[compact(x) for x in t.splitlines() if x.strip()]
   japan=sum(bool(re.search(r'[一-龯ぁ-ゖァ-ヶ]',c)) for c in t)
   role='cover' if n==1 else 'introduction' if n==2 else 'table_of_contents' if n<start else 'publication_notice' if n>=len(doc)-1 else 'chapter_divider' if pl is None else 'reference' if any(a<=n<=b for a,b,_ in APPENDICES.get(doc_id,[])) else 'instructional'
   image_only=(pl is not None and japan<60 and images>0)
   if image_only:flagged.append({'documentId':doc_id,'pdfPage':n,'printedPage':pl,'reason':'image-bearing instructional page contains fewer than 60 extracted Japanese characters; raster content may carry most knowledge','resolution':'visually_inspected' if finding else 'needs_visual_review'})
   page_meta.append({'pdfPage':n,'printedPage':pl,'role':role,'extractedCharacters':len(t.strip()),'japaneseCharacters':japan,'imageOccurrences':images,'textExtraction':'image_only_content' if image_only else 'text_available','visualReview':'ai_page_inspected' if finding else 'not_inspected','visualFinding':finding['label'] if finding else None,'extractedTextSha256':hashlib.sha256(t.encode()).hexdigest()})
   if not(start<=n<=len(doc)-2):continue
   for raw in t.splitlines():
    s=compact(raw)
    if doc_id=='rst-2-hygiene' and n==7 and s.startswith('2.食品衛生管理の基本'):s='2.食品衛生管理の基本 食中毒予防と5S活動'
    kind=None
    if re.match(r'^\d+\.\s*[^\d]',s) and len(s)<100:kind='chapter'
    elif re.match(r'^\(\d+\)(?:\s|[^\d])',s) and not re.match(r'^\(20\d\d\)',s) and len(s)<120:kind='subsection'
    elif re.match(r'^[①-⑳㉑-㊿]',raw.strip()) and len(s)<70 and re.search(r'[一-龯ァ-ヶA-Za-z]',s):kind='concept'
    elif re.match(r'^\d+\)',s) and len(s)<70:kind='subconcept'
    if not kind:continue
    # Raw table rows/long wrapped instructions are not promoted to knowledge units.
    if len(s)<4 or re.search(r'どのように|良\s*・\s*否|^15、',s):continue
    if kind=='chapter':chapter=s;section=''
    if kind=='subsection':section=s
    # Keep brief heading metadata; no full instructional paragraphs copied to Git.
    label=re.split(r'[:：]|とは[、。]|について[、。]|[。]',s,maxsplit=1)[0]
    if len(label)>52:continue
    headings.append({'pdfPage':n,'printedPage':pl,'kind':kind,'chapter':chapter,'section':section,'label':label})
  # End spans at next peer/higher heading, conservatively including shared boundary page.
  ranks={'chapter':0,'subsection':1,'concept':2,'subconcept':3}
  for j,h in enumerate(headings):
   end=len(doc)-2
   for nx in headings[j+1:]:
    if ranks[nx['kind']]<=ranks[h['kind']]:end=nx['pdfPage'];break
   # Reference/terminology areas have dedicated records below.
   span=list(range(h['pdfPage'],max(h['pdfPage'],end)+1))
   uid=f"{doc_id}-k{j+1:03}"
   units.append({'id':uid,'level':level,'topic':topic,'unitKind':h['kind'],'chapter':h['chapter'],'section':h['section'],'knowledgeOrSkill':h['label'],'sourceRefs':[{'documentId':doc_id,'pdfPages':span,'printedPages':[printed(doc_id,x) for x in span],'section':h['section'] or h['chapter']}],'lessonId':None,'lessonIds':[],'questionIds':[],'illustrationNeeded':any(page_meta[x-1]['imageOccurrences'] for x in span),'status':'unassigned','coverageStatus':'not_assessed','review':{'sourceHeadingLocated':True,'semanticCoverageVerified':False,'domainReviewed':False,'humanReviewed':False}})
  for idx,(a,b,label) in enumerate(APPENDICES.get(doc_id,[]),1):
   units.append({'id':f'{doc_id}-ref{idx:02}','level':level,'topic':topic,'unitKind':'reference_application','chapter':'参考資料・基本用語','section':label,'knowledgeOrSkill':label,'sourceRefs':[{'documentId':doc_id,'pdfPages':list(range(a,b+1)),'printedPages':[printed(doc_id,x) for x in range(a,b+1)],'section':label}],'lessonId':None,'lessonIds':[],'questionIds':[],'illustrationNeeded':True,'status':'unassigned','coverageStatus':'not_assessed','review':{'sourceHeadingLocated':True,'semanticCoverageVerified':False,'domainReviewed':False,'humanReviewed':False}})
  for (d,n),f in IMAGE_FINDINGS.items():
   if d!=doc_id:continue
   units.append({'id':f'{doc_id}-visual{n:03}','level':level,'topic':topic,'unitKind':'visual_application','chapter':'図表・記録様式','section':f['label'],'knowledgeOrSkill':f['knowledge'],'sourceRefs':[{'documentId':doc_id,'pdfPages':[n],'printedPages':[f['printedPage']],'section':f['label']}],'lessonId':None,'lessonIds':[],'questionIds':[],'illustrationNeeded':True,'status':'unassigned','coverageStatus':'not_assessed','review':{'sourceHeadingLocated':True,'aiSourceImageInspected':True,'semanticCoverageVerified':False,'domainReviewed':False,'humanReviewed':False}})
  section_map[doc_id]=headings
  docs.append({'id':doc_id,'level':level,'topic':topic,'filename':p.name,'publisher':'一般社団法人 日本フードサービス協会','sourceType':'user_attached_learning_text','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'pdfPages':len(doc),'versionLabel':'令和3年4月15日改訂版' if level=='1' else '令和5年12月27日','versionDate':'2021-04-15' if level=='1' else '2023-12-27','dateEvidence':{'pdfPage':1,'method':'cover text extraction'},'dateIsLatestVerified':False,'extractionTool':'pdftotext -layout; PyMuPDF image/page inspection','extractionWarnings':sorted(set(proc.stderr.strip().splitlines())),'imageOccurrences':sum(x['imageOccurrences'] for x in page_meta),'pages':page_meta,'redistributedInApp':False})
 dump(args.scratch/'section-page-map.json',section_map)
 dump(args.output/'source-inventory.json',{'schemaVersion':1,'sector':'外食業','checkedAt':'2026-10-26','documents':docs,'summary':{'documents':len(docs),'pdfPages':sum(d['pdfPages'] for d in docs),'imageOccurrences':sum(d['imageOccurrences'] for d in docs),'imageOnlyContentPages':len(flagged),'imageOnlyContentPagesVisuallyInspected':sum(f['resolution']=='visually_inspected' for f in flagged),'allPageVisualInspectionComplete':False},'notes':['PDF page numbers are 1-based; printedPages are separately mapped, including chapter-divider gaps.','Counts include covers, contents, reference forms and publication notices; these are not all lesson pages.','No extracted full source prose or source images are stored in the repository.']})
 dump(args.output/'knowledge-ledger.json',{'schemaVersion':1,'sector':'外食業','checkedAt':'2026-10-26','scope':'source navigation and knowledge-coverage scaffold','units':units,'summary':{'units':len(units),'byLevel':{l:sum(u['level']==l for u in units) for l in ['1','2']},'byKind':{k:sum(u['unitKind']==k for u in units) for k in sorted(set(u['unitKind'] for u in units))},'semanticCoverageVerified':0,'unassigned':len(units)},'limitations':['Automatically located source headings are not proof that a lesson covers the knowledge.','Parent and child records overlap intentionally; unit count is not a count of independent atomic facts.','All lesson/question links require semantic review after authorship.']})
 dump(args.output/'source-review.json',{'schemaVersion':1,'checkedAt':'2026-10-26','method':'page-indexed text extraction; selected source page rendering and AI visual inspection','humanReviewed':False,'domainReviewed':False,'textExtractionPages':sum(d['pdfPages'] for d in docs),'visualPagesInspected':[{'documentId':d,'pdfPage':n,'printedPage':f['printedPage'],'finding':f['knowledge']} for (d,n),f in IMAGE_FINDINGS.items()],'imageOnlyFlags':flagged,'unresolved':[{'kind':'full_illustration_review','description':'Only the explicitly listed ten pages have AI visual inspection evidence; remaining diagrams/tables require content-author or independent visual review.'},{'kind':'current_rules_and_safety','description':'Sources dated 2021 and 2023 must not certify current legal rules, allergen lists or safety limits without independent official verification.'},{'kind':'semantic_coverage','description':'Source navigation ledger requires semantic linkage and review against authored lessons, weekly checks and practice questions.'}], 'releaseReady':False})
 print(json.dumps({'documents':len(docs),'pages':sum(d['pdfPages'] for d in docs),'units':len(units),'imageOnlyFlags':flagged},ensure_ascii=False))

if __name__=='__main__':main()
