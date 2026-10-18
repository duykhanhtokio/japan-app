# Offline authoring helper; this is not a runtime app dependency.
# Requires ctranslate2, sentencepiece, and the pinned model in authoring-policy.json.
import json,pathlib,time,sys,os
import ctranslate2,sentencepiece as spm
root=pathlib.Path(__file__).resolve().parent.parent
p=pathlib.Path(os.environ['VOCABULARY_EXAMPLE_TRANSLATIONS']);p.mkdir(parents=True,exist_ok=True)
model=os.environ['VOCABULARY_OFFLINE_MODEL']
source=root/'docs/vocabulary-workspace/practical-examples'
rows=[dict(zip(['id','ja','en','vi'],x.split('|'))) for f in sorted(source.glob('batch-*.tsv')) for x in f.read_text().splitlines()]
sp=spm.SentencePieceProcessor(model_file=model+'/spiece.model');m=ctranslate2.Translator(model,device='cpu',compute_type='int8',intra_threads=6,inter_threads=1)
langs={'id':'id','zh-CN':'zh','zh-TW':'zh_Hant','hi':'hi','bn':'bn','ne':'ne','my':'my','th':'th','km':'km','tl':'fil'}
for locale,code in langs.items():
 out=p/('translations-'+locale+'.json');d=json.loads(out.read_text()) if out.exists() else {};t=time.time()
 missing=[x for x in rows if x['id'] not in d]
 for start in range(0,len(missing),32):
  batch=missing[start:start+32];tokens=[sp.encode('<2'+code+'> '+x['en'],out_type=str)+['</s>'] for x in batch]
  results=m.translate_batch(tokens,beam_size=2,max_decoding_length=192,repetition_penalty=1.05)
  for row,result in zip(batch,results):d[row['id']]=sp.decode(result.hypotheses[0]).strip()
  out.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print(locale,len(d),round(time.time()-t,1),flush=True)
print('DONE',flush=True)
