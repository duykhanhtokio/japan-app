"""Decode factual numeric cells, preserving small fonts; never a course-coverage counter.
Private source file is a positional argument. Original prose/page imagery is not exported.
"""
import hashlib,json,re,sys
from pathlib import Path
import fitz
R=Path(__file__).resolve().parents[2];doc=fitz.open(sys.argv[1]);SID='kensetsu-src-7d'
COL=['fall','same_level_fall','collision','flying_falling_object','collapse','struck_by','caught_in','drowning','hot_cold_contact','harmful_contact','electric_shock','road_traffic','other_traffic','total']
ROWS=['civil_total','tunnel','bridge','road','river','erosion_control','port_coast','other_civil','building_total','steel_reinforced_housing','wood_housing','building_services','other_building','other_construction_total','electrical_communications','machinery_installation','other_construction_child','construction_total']
A=['fall','same_level_fall','collision','flying_falling_object','collapse','struck_by','caught_in','harmful_contact','electric_shock','fire','road_traffic','drowning','other','total']
def spans(n,rect):
 out=[]
 for bi,b in enumerate(doc[n-1].get_text('dict')['blocks']):
  if b['type']!=0:continue
  for l in b['lines']:
   for s in l['spans']:
    text=s['text'].strip();bb=fitz.Rect(s['bbox']);center=fitz.Point((bb.x0+bb.x1)/2,(bb.y0+bb.y1)/2)
    if center in rect and re.fullmatch(r'\d+',text):out.append({'value':int(text),'pdfPage':n,'sourceElementId':f'{SID}:p{n}:b{bi}','bbox':[round(x,3) for x in bb],'fontPoints':s['size'],'sourceSpanSha256':hashlib.sha256(s['text'].encode()).hexdigest()})
 return out
def grouped(items):
 rows={}
 for c in items:rows.setdefault(round(c['bbox'][1],1),[]).append(c)
 return [sorted(row,key=lambda c:c['bbox'][0]) for y,row in sorted(rows.items())]
tables=[]
for tid,n,rect,rowkeys,colkeys,context in [
 ('t1',1,fitz.Rect(153,463,510,660),ROWS,COL,{'sourceYearLabel':2021,'population':'construction_industry','unit':'fatality_count_people','sourceTitleCallsMainAccidentTypes':True,'allAccidentTypesShown':False}),
 ('t2',2,fitz.Rect(174,260,279,480),A,['2020','2021'],{'sourceYearLabels':[2020,2021],'population':'foreign_workers_all_industries','unit':'fatality_count_people','yearVsFiscalYear':'Source labels年度; original collection interval not newly primary-verified.'}),
 ('t3',2,fitz.Rect(379,370,495,431),['manufacturing','construction','other_industries','total'],['2020','2021'],{'sourceYearLabels':[2020,2021],'population':'foreign_workers_by_industry','unit':'fatality_count_people','yearVsFiscalYear':'Source labels年度; original collection interval not newly primary-verified.'})]:
 rows=grouped(spans(n,rect));assert len(rows)==len(rowkeys),(tid,len(rows),[(r[0]['bbox'],len(r)) for r in rows]);cells=[];rowchecks=[]
 for i,row in enumerate(rows):
  assert len(row)==len(colkeys),(tid,i,len(row))
  for j,c in enumerate(row):cells.append({**c,'observationId':f'construction-source-stat-{tid}:{rowkeys[i]}:{colkeys[j]}','rowCode':rowkeys[i],'columnCode':colkeys[j],'context':context,'professionalKnowledgeUnitInferred':False})
  if tid=='t1':rowchecks.append({'rowCode':rowkeys[i],'shownAccidentColumnsSum':sum(c['value'] for c in row[:-1]),'statedTotal':row[-1]['value'],'unshownRemainder':row[-1]['value']-sum(c['value'] for c in row[:-1]),'nonzeroRemainderIsNotAutomaticallySourceError':True})
 if tid!='t1':
  for j,year in enumerate(colkeys):assert sum(r[j]['value'] for r in rows[:-1])==rows[-1][j]['value'],(tid,year)
 tables.append({'tableId':tid,'pdfPage':n,'context':context,'rowCodes':rowkeys,'columnCodes':colkeys,'observations':cells,'arithmeticChecks':rowchecks,'totalArithmeticMatchesShownRows':True if tid!='t1' else None})
assert tables[0]['observations'][-1]['value']==288
out={'date':'2026-11-02','sector':'construction','sourceId':SID,'sourceSha256':hashlib.sha256(Path(sys.argv[1]).read_bytes()).hexdigest(),'status':'decoded_numeric_observations_not_course_knowledge_acceptance','method':'All-font original PDF spans; cells grouped by reviewed source row/column positions, then self-compared with3xsourcecrops. Standard semantic codes replace source table layout/prose. Fonts around5.22pt in table1 are retained.','tables':tables,'numericObservations':sum(len(t['observations']) for t in tables),'semanticReview':'Self-read every shown numeric row/header at3x; arithmetic verified for table2/3 and selected-column residuals explicitly retained for table1. Source table1child rows not assumed exhaustive.','sourceWordsImagesOrPageScreenshotsRedistributed':False,'allCellsTaughtInApp':None,'appMappingStatus':'Not established by numeric extraction; canonical construction.json owns acceptance.','sourceKnowledgeCoveragePercent':None,'domainReviewed':False,'nativeReviewed':False}
p=R/'docs/ssw-workspace/source-coverage-v2/construction-7d-statistical-cell-observations.json';p.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'tables':len(tables),'numericObservations':out['numericObservations'],'courseKnowledgeCountInferred':False}))
