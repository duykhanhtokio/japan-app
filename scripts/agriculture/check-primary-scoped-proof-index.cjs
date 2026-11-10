#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),indexPath='docs/ssw-workspace/agriculture/royal-weekly-20261107/primary189-current-scoped-source-pixel-proof-index.json',idx=JSON.parse(fs.readFileSync(path.join(root,indexPath),'utf8'));
const args=process.argv.slice(2),ref=args.includes('--ref')?args[args.indexOf('--ref')+1]:'HEAD',git=(...a)=>cp.execFileSync('git',a,{cwd:root,maxBuffer:30*1024*1024}).toString();
const read=(r,p)=>JSON.parse(git('show',r+':'+p)),figures=read(ref,'src/data/agriculture/recognition-images.json').images,lessons=new Map(read(ref,'src/data/agriculture/lessons.ja.json').lessons.map(l=>[l.id,l]));
const stable=o=>Array.isArray(o)?o.map(stable):o&&typeof o==='object'?Object.fromEntries(Object.keys(o).sort().map(k=>[k,stable(o[k])])):o;
const hash=o=>crypto.createHash('sha256').update(JSON.stringify(stable(o))).digest('hex');
const keys=['id','assetKey','assetSha256','titleJa','altJa','observationJa','limitJa','labelsJa','sources','sourcePdfSha256','lessonIds','lessonSourceHashes','scopeLevels','paragraphIds','knowledgeIds','sourceItemIds'];
const select=(o,ks)=>Object.fromEntries(ks.map(k=>[k,Object.prototype.hasOwnProperty.call(o,k)?o[k]:null]));
const docs=new Map(),getProof=p=>{if(!docs.has(p)){const text=git('show',idx.snapshot+':'+p),expected=idx.proofDocuments[p];assert(expected,'unlisted proof document '+p);assert.equal(crypto.createHash('sha256').update(text).digest('hex'),expected.sha256,p+' proof bytes differ');docs.set(p,JSON.parse(text));}return docs.get(p);};
assert.equal(idx.rows.length,figures.length,'registry scope changed');assert.equal(new Set(idx.rows.map(r=>r.figureId)).size,figures.length);
const byId=new Map(idx.rows.map(r=>[r.figureId,r])),categories={};let proofs=0;
for(const f of figures){const row=byId.get(f.id);assert(row,f.id+' missing');assert.equal(row.assetSha256,f.assetSha256);assert.equal(row.assetPath,f.assetPath);assert.equal(row.currentMeaningSignatureSha256,hash(select(f,keys)),f.id+' metadata meaning changed');
 for(const id of f.lessonIds){const l=lessons.get(id);assert(l);assert.equal(f.lessonSourceHashes[id],l.sourceHash);assert.equal(row.primaryCanonicalMeaningSha256[id],hash(select(l,['id','revision','levels','titleJa','objectiveJa','paragraphs'])),f.id+'/'+id+' canonical meaning changed');}
 assert(row.proofs.length,'missing scoped proof '+f.id);for(const p of row.proofs){let o=getProof(p.path);for(const key of p.objectPath==='/'?[]:p.objectPath.slice(1).split('/'))o=o[key];assert(o&&typeof o==='object',f.id+' missing proof object');const direct=(o.figureId||o.id||o.canonicalFigureId)===f.id;
 const single=Array.isArray(o.targets)&&o.targets.length===1&&o.targets[0].id===f.id&&o.targets[0].assetSha256===f.assetSha256&&o.newAssetSha256===f.assetSha256&&o.sourceProof&&o.ownMeaningPixelReview;
 assert(direct||single,f.id+' proof belongs to another figure');assert(JSON.stringify(o).includes(f.assetSha256),f.id+' current output missing in scoped object');assert.equal(p.exactCurrentAssetSha256,f.assetSha256);proofs++;}
 assert.notEqual(row.reviewCategory,'pending');categories[row.reviewCategory]=(categories[row.reviewCategory]||0)+1;
}
assert.deepEqual(categories,idx.reviewCategoryCounts);assert.equal(idx.pending.length,0);assert.equal(idx.sourcePhotoObjectiveComplete,false);assert.equal(idx.releaseReady,false);
console.log(`PASS primary scoped proof index: ${figures.length} exact current figure/output/canonical-meaning records, ${proofs} object-scoped preserved proof references, ${docs.size} immutable proof documents; categories disjoint and pending0. Source/visual dispositions remain bounded single-AI evidence, not browser/device/expert/source-photo certification.`);
