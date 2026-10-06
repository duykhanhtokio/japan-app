"""Emit whitelisted structural metadata only, never source prose/answers/scripts.
OCR label occurrences are not verified example counts. No playback/ASR/export.
"""
from pathlib import Path
import hashlib,json,re
root=Path(__file__).resolve().parent.parent
source=root/'docs/jlpt-workspace/source-packets/n5-2013-07.source-packet.json'
raw=json.loads(source.read_text())
rows=[]
for page in raw.get('sourcePageTextCandidates',[]):
    # Text stays inside the isolated parser. Only categorical labels/counts exit.
    normalized=re.sub(r'\s+','',page.get('textCandidate',''))
    rows.append({'pageNumber':int(page['pageNumber']),
                 'problemMarkers':re.findall(r'(?:問題|もんだい)([1-4１２３４一二三四])',normalized),
                 'exampleMarkerOccurrences':len(re.findall(r'例|れい',normalized)),
                 'sourceVerificationStatus':page.get('status','unknown')})
report={'examId':'jpapp-n5-original-01-v1','sourcePath':str(source.relative_to(root)),
        'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
        'status':'structural_metadata_insufficient_for_final_listening',
        'extractedFields':['pageNumber','problemMarkers','exampleMarkerOccurrences','sourceVerificationStatus'],
        'legacyContentExported':False,'semanticClassificationPerformed':False,
        'rows':rows,
        'verifiedExampleCountsByProblem':None,'verifiedPreparationPausesMs':None,
        'limitations':['OCR label occurrences do not establish example boundaries, repetition counts, or audio organization.',
                      'Signal-only timing cannot identify preparation/answer/instruction roles.',
                      'Do not turn absence of an OCR example label into a claim that a group has no example.'],
        'publisherChoice':'Verify the reference structure first; do not adopt the proposed independent pacing schedule.'}
(root/'docs/jlpt-workspace/original/n5-01/reference-structure.metadata.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':report['status'],'pagesInspected':len(rows),'contentExported':False,'exampleCountsVerified':False}))
