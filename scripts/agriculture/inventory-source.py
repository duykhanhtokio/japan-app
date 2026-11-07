"""Inventory user-provided PDFs locally. Never publish source text/images.
Usage: python scripts/agriculture/inventory-source.py /path/to/upload
PyMuPDF is an authoring-only dependency; learners need none.
"""
import argparse,hashlib,json,pathlib,re
import fitz
ROOT=pathlib.Path(__file__).resolve().parents[2]
CHAPTERS={1:[(1,'日本農業一般'),(2,'耕種農業一般'),(31,'安全衛生'),(40,'稲作作業'),(47,'畑作・野菜作業'),(57,'施設園芸作業'),(71,'果樹栽培作業'),(93,'農作業の用語'),(97,'写真一覧')],2:[(1,'日本農業一般'),(7,'耕種農業一般'),(49,'安全衛生'),(60,'稲作作業'),(69,'畑作・野菜作業'),(80,'施設園芸作業'),(95,'果樹栽培作業'),(122,'花き栽培作業'),(126,'農作業の用語'),(128,'写真一覧')]}
def sha(b):return hashlib.sha256(b).hexdigest()
def build(folder):
 docs=[]
 for level in (1,2):
  name=f'耕種農業全般 特定技能{level}号.pdf';p=folder/name;d=fitz.open(p);offset=6 if level==1 else 2;last=98 if level==1 else 129;rows=[]
  for i,page in enumerate(d):
   printed=i+1-offset if offset<i+1<=offset+last else None
   chapter=next((label for start,label in reversed(CHAPTERS[level]) if printed is not None and printed>=start),None)
   text=page.get_text();body=[]
   for block in page.get_text('dict')['blocks']:
    for line in block.get('lines',[]):
     value=''.join(s['text'] for s in line['spans'] if s['size']>=8).strip()
     if value:body.append(value)
   administrative=(i+1<offset+1 and not(level==1 and i==5)) or i==len(d)-1
   role='front_matter_or_colophon' if administrative else 'entry_biosecurity' if level==1 and i==5 else 'learning_source'
   rows.append({'id':f'AGR-S{level}-P{i+1:03}','pdfPage':i+1,'printedPage':printed,'chapter':chapter,'role':role,'textSha256':sha(text.encode()),'bodyExtractionSha256':sha('\n'.join(body).encode()),'textCharacters':len(text),'widthPt':round(page.rect.width,2),'heightPt':round(page.rect.height,2),'embeddedImageCount':len(page.get_images()),'drawnPathCount':len(page.get_drawings()),'status':'extracted_not_semantically_reviewed','visualReview':'pending','knowledgeIds':[],'exclusionReason':None})
  docs.append({'id':f'AGR-S{level}','level':str(level),'filename':name,'sha256':sha(p.read_bytes()),'pdfPages':len(d),'printedPageOffset':offset,'printedContentPages':last,'edition':{'label':'Ver1.1','date':'2022-03-17','basis':'PDF2 revision history'} if level==1 else {'label':None,'date':None,'status':'needs_colophon_confirmation','metadataTitleIsNotEditionProof':True},'publisher':'一般社団法人 全国農業会議所','scope':'耕種農業','rawSourceRedistributed':False,'chapters':[{'printedStart':start,'pdfStart':start+offset,'titleJa':label} for start,label in CHAPTERS[level]],'pages':rows})
 return {'schemaVersion':1,'documents':docs,'pageCount':sum(x['pdfPages'] for x in docs),'inventoryMeaning':'Page accounting and extraction only; not complete visual or semantic review. Embedded-image counts do not count every educational figure.','exhaustiveKnowledgeDenominator':None,'coveragePercent':None,'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('folder',type=pathlib.Path);args=a.parse_args();data=build(args.folder)
 out=ROOT/'docs/ssw-workspace/agriculture/source-inventory.json';out.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'documents':len(data['documents']),'pages':data['pageCount'],'coveragePercent':None}))
