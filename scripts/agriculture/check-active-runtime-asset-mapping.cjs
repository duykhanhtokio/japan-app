#!/usr/bin/env node
'use strict';
// Read one immutable snapshot. Cache bytes count only when their Git blob and SHA256 both match it.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),args=process.argv.slice(2),value=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1];};
const ref=value('--ref')||'HEAD',assetRoots=[root,...args.flatMap((v,i)=>v==='--asset-cache'?[path.resolve(args[i+1])]:[])];
const git=(...a)=>cp.execFileSync('git',a,{cwd:root,maxBuffer:30*1024*1024}),sha=git('rev-parse',ref).toString().trim();
const read=p=>git('show',sha+':'+p).toString(),json=n=>JSON.parse(read('src/data/agriculture/'+n+'.json'));
const figures=json('recognition-images').images,lessons=new Map(json('lessons.ja').lessons.map(l=>[l.id,l])),support=json('daily-learning-support'),exams=json('exam-illustrations').illustrations;
const source=read('src/components/agriculture/RecognitionImages.tsx'),mapText=source.slice(source.indexOf('const assets:'),source.indexOf('\n};\nexport function getAgricultureFigureAsset')),assets=new Map();
for(const m of mapText.matchAll(/["']([^"']+)["']\s*:\s*require\(["']([^"']+)["']\)/g)){assert(!assets.has(m[1]),'duplicate require key '+m[1]);assets.set(m[1],path.posix.normalize(path.posix.join('src/components/agriculture',m[2])));}
const tree=new Map(git('ls-tree','-r',sha,'--','assets/agriculture').toString().trim().split('\n').filter(Boolean).map(l=>{const [meta,p]=l.split('\t');return [p,meta.split(' ')[2]];}));
const byId=new Map(figures.map(f=>[f.id,f]));let verified=0;const missing=[];
for(const f of figures){const actual=assets.get(f.assetKey);assert.equal(actual,f.assetPath,f.id+' require path differs from registry');assert(tree.has(actual),f.id+' missing snapshot asset');for(const [id,h]of Object.entries(f.lessonSourceHashes))assert.equal(lessons.get(id)?.sourceHash,h,f.id+' stale primary lesson');let found=false;
 for(const cache of assetRoots){const p=path.join(cache,actual);if(!fs.existsSync(p))continue;const b=fs.readFileSync(p),blob=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');if(blob!==tree.get(actual))continue;assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.assetSha256,f.id+' asset SHA256 mismatch');found=true;break;}
 if(found)verified++;else missing.push(f.id);
}
for(const [id,b]of Object.entries(support.figureBindings)){assert.equal(lessons.get(id)?.sourceHash,b.lessonSourceHash,id+' stale daily lesson');assert.equal(byId.get(b.figureId)?.assetSha256,b.assetSha256,id+' stale daily asset');}
for(const e of exams)assert.equal(byId.get(e.figureId)?.assetSha256,e.sourceAssetSha256,e.id+' stale exam asset');
assert.equal(missing.length,0,'Snapshot bytes unavailable in verified caches: '+missing.join(', '));
console.log(`PASS snapshot ${sha}: ${figures.length} real require mappings, ${verified} snapshot-verified asset byte hashes, ${Object.keys(support.figureBindings).length} daily and ${exams.length} quiz hash dependencies. Static/byte checks only; no pixel or source-fit acceptance.`);
