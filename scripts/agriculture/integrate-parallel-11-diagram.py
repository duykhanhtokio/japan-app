"""Append the independently reviewed batch11 concept diagram without changing lesson hashes."""
import argparse,copy,hashlib,importlib.util,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture';D=ROOT/'src/data/agriculture';P=W/'parallel-11'
def read(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def main(dry_run=False):
 path=P/'root-concept-diagram.json';packet=read(path);review=read(P/'review-root-concept-diagram.json')
 assert review['status']=='complete' and review['packetSha256']==hashlib.sha256(path.read_bytes()).hexdigest() and not review.get('unresolvedBlockingIssues',[])
 assert not any(review.get(k,False) for k in ['humanReviewed','domainReviewed','nativeReviewed'])
 spec=importlib.util.spec_from_file_location('batch06',ROOT/'scripts/agriculture/integrate-parallel-06.py');previous=importlib.util.module_from_spec(spec);spec.loader.exec_module(previous)
 packet.update(lessons=[],questions=[]);patches=previous.repair(packet,review);diagram=packet['conceptDiagram']
 data=read(D/'diagrams.json');register=read(W/'illustration-register.json');ledger=read(W/'knowledge-ledger.json');manifest=read(W/'parallel-11-manifest.json')
 before=copy.deepcopy(data['diagrams']);oldregister=copy.deepcopy(register['figures']);oldknowledge=copy.deepcopy(ledger['knowledge'][:864])
 assert len(register['figures'])==6 and diagram['id'] not in {d['id'] for d in before}
 lessons={l['id']:l for l in read(D/'lessons.ja.json')['lessons']};assert diagram['notARecognitionPhotograph'] is True and diagram['domainReviewed'] is False
 for lid in diagram['lessonIds']:assert lid in manifest['newLessonIds'] and set(lessons[lid]['levels'])<=set(diagram['scopeLevels'])
 for kid in diagram['knowledgeIds']:
  k=next(k for k in ledger['knowledge'] if k['id']==kid);assert set(k['lessonIds'])<=set(manifest['newLessonIds']);k['figureIds'].append(diagram['id'])
 data['diagrams'].append(diagram)
 register['figures'].append({'id':diagram['id'],'kind':'concept_comparison_diagram','implementation':'src/components/agriculture/ConceptDiagrams.tsx','lessonIds':diagram['lessonIds'],'labelsJa':[p['titleJa'] for p in diagram['panels']],'creation':'original_native_layout_no_source_image_copy','aiReviewed':True,'domainReviewed':False,'nativeDeviceTested':False,'notARecognitionPhotograph':True})
 assert data['diagrams'][:-1]==before and register['figures'][:-1]==oldregister and ledger['knowledge'][:864]==oldknowledge
 manifest['newDiagramIds']=[diagram['id']];manifest['counts']['conceptDiagrams']=7;manifest['conceptDiagramReview']={'packet':'parallel-11/root-concept-diagram.json','packetSha256':review['packetSha256'],'review':'parallel-11/review-root-concept-diagram.json','appliedPatches':patches,'recognitionAssetsCreated':0,'lessonSourceHashesChanged':False}
 if not dry_run:
  for p,x in [(D/'diagrams.json',data),(W/'illustration-register.json',register),(W/'knowledge-ledger.json',ledger),(W/'parallel-11-manifest.json',manifest)]:write(p,x)
 print(json.dumps({'dryRun':dry_run,'newConceptDiagrams':1,'registeredConceptDiagrams':7,'recognitionAssetsCreated':0}))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--dry-run',action='store_true');args=parser.parse_args();main(args.dry_run)
