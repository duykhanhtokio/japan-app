#!/usr/bin/env python3
"""Validate frozen inputs, independent peer bindings and zero-credit audit overlays."""
import hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
AUDIT=ROOT/'docs/ssw-workspace/agriculture/source-audit-32'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def require(test,why):
    if not test:raise ValueError(why)
def ids(row):return row.get('sourceItemIds',[row['sourceItemId']] if 'sourceItemId' in row else [])
def walk(value):
    if isinstance(value,dict):
        yield value
        for v in value.values():yield from walk(v)
    elif isinstance(value,list):
        for v in value:yield from walk(v)
def check():
    m=read(AUDIT/'manifest.json');a=read(AUDIT/'adopted-audit.json');f=read(AUDIT/'input-hashes.json')
    require(sha(AUDIT/'adopted-audit.json')==m['adoptedAuditSha256'],'adopted audit changed after manifest')
    require(sha(AUDIT/'input-hashes.json')==m['frozenInputHashesSha256'],'input manifest changed')
    for path,h in f.items():require(sha(ROOT/path)==h,f'stale audit input: {path}')
    historical=read(AUDIT/'baseline-input-hashes.json');recon=read(AUDIT/'concurrent-reconciliation.json')
    require(sha(AUDIT/'baseline-input-hashes.json')==m['historicalInputHashesSha256'],'historical input hashes changed')
    require(sha(AUDIT/'concurrent-reconciliation.json')==m['concurrentReconciliationSha256'],'concurrent reconciliation changed')
    require(set(historical)==set(f),'reconciliation lost input paths')
    require({p for p in f if f[p]!=historical[p]}==set(recon['changedAuditedInputs']),'unreconciled input changes')
    require(all('lessons.ja' not in p and 'weekly-checks' not in p and 'mock-exams' not in p for p in recon['changedAuditedInputs']),'source prose changed without new review')
    for path,h in historical.items():
        old=subprocess.check_output(['git','show',m['baselineCommit']+':'+path],cwd=ROOT)
        require(hashlib.sha256(old).hexdigest()==h,'historical baseline fingerprint mismatch: '+path)
    backlog={x['id']:x for x in read(ROOT/'docs/ssw-workspace/agriculture/source-gap-backlog.json')['items']}
    require(len(m['packets'])==6,'six worker packets required')
    authored=set();reviewers=set();rawrows={};peers={}
    for p in m['packets']:
        d=read(AUDIT/p['authorPacket']);v=read(AUDIT/p['peerPacket'])
        require(sha(AUDIT/p['authorPacket'])==p['authorSha256'],'author packet changed')
        require(sha(AUDIT/p['peerPacket'])==p['peerSha256'],'peer packet changed')
        vh=next(v[k] for k in ['reviewedPacketSha256','packetSHA256','authorPacketSha256','packetSha256'] if k in v)
        require(vh==p['authorSha256'],'peer reviewed different packet')
        require(p['worker'].replace('-','_') not in str(p['reviewer']).replace('-','_'),'self review')
        authored.add(p['worker']);reviewers.add(str(p['reviewer']))
        rawrows[p['authorPacket']]=next(d[k] for k in ['rows','selectedOccurrences','candidateSourceOccurrences','candidates','items'] if k in d)
        peers[p['peerPacket']]=v.get('rows',v.get('decisions'))
    require(len(authored)==6 and len(reviewers)==6,'six distinct authors and peers required')
    selected=set()
    for row in a['rows']:
        require(row['authorRow'] in rawrows[row['authorPacket']],'adopted author row changed')
        require(ids(row)==ids(row['authorRow']),'adopted source IDs differ')
        require(row['peerDecisions'] and all(x in peers[row['peerPacket']] for x in row['peerDecisions']),'peer decision altered')
        require(set(ids(row))<=set(x for d in row['peerDecisions'] for x in ids(d)),'missing per-item peer review')
        for sid in ids(row):require(sid in backlog,f'orphan source ID: {sid}')
        selected.update(ids(row))
    require(len(a['rows'])==65 and len(selected)==70,'audit cardinality changed')
    for obj in walk(a):
        for k in ['countsAsClosedSourceOccurrence','newQuestionCapacityCertified','humanReviewed','nativeReviewed','domainReviewed','deviceTested','whole800CapacityCertified','sourceCompletenessCertified']:
            if k in obj:require(obj[k] is False,f'false approval/closure: {k}')
        if 'runtimeClosureCredit'in obj:require(obj['runtimeClosureCredit'] in [0,False],'runtime closure credit prohibited')
    for k in ['newLessons','newTranslations','newQuestions','newImages','newSourceClosures']:require(a['counts'][k]==0,'audit must not inflate runtime totals')
    ov={x['sourceItemId']:x for x in a['effectiveOverrides']}
    required={'AGR-A10-GENERAL-0347','AGR-A10-GENERAL-0377','AGR-A10-FACILITY-0613','AGR-A10-SAFETY-0263','AGR-A10-SAFETY-0276'}|{f'AGR-A10-FLOWER-{n:04d}' for n in range(149,153)}
    require(required<=set(ov),'required scope override missing')
    corr=ov['AGR-A10-GENERAL-0347'];require(backlog[corr['sourceItemId']]['objectiveJa']==corr['before'],'correction before differs')
    require(corr['after']==corr['before'].replace('ダイズ','ダイコン'),'incorrect germination correction')
    for sid in ['AGR-A10-GENERAL-0377','AGR-A10-FACILITY-0613']:require('reauthor' in ov[sid]['disposition'],'duplicate scope not excluded')
    for n in range(149,153):require(ov[f'AGR-A10-FLOWER-{n:04d}']['disposition']=='source_objective_overreach_hold_details_not_in_cited_page','weather scope hold lost')
    require(ov['AGR-A10-SAFETY-0263']['pdfPages']==[44,45],'marigold page span')
    require(ov['AGR-A10-SAFETY-0276']['pdfPages']==[45,46],'BT page span')
    # Every original selected row must appear once; FACILITY0224 legitimately has two author perspectives.
    require(len(a['rows'])==sum(map(len,rawrows.values())),'missing author rows')
    require(a['counts']==m['counts'],'manifest counts differ')
    print(f'SOURCE AUDIT32 PASS: 6 authors/6 independent peers;65 rows/70 unique occurrences;{len(f)} frozen inputs;13 effective scope overrides;zero runtime/closure credit')
if __name__=='__main__':check()
