const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'src/data/food-manufacturing'),read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
const locales=['en','vi','id','tl','bn','th','hi','ne','my','km','zh-CN','zh-TW'];
const lessons=[...read('lessons.1.ja.json').lessons,...read('lessons.2.ja.json').lessons],extensions=read('supplements.json').extensions;
const ordered=value=>Array.isArray(value)?value.map(ordered):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,ordered(value[k])])):value;
function evaluate(file,names){let source=fs.readFileSync(path.join(dir,file),'utf8').replace(/^import (\w+) from ['"](.+\.json)['"];?$/gm,(_,name,relative)=>`const ${name}=loadJson(${JSON.stringify(relative)});`);source=stripTypeScriptTypes(source).replace(/^export /gm,'');return vm.runInNewContext(source+'\n;({'+names.join(',')+'})',{loadJson:relative=>read(relative)});}
const source=evaluate('supplements.ts',['foodManufacturingSupplements','foodManufacturingLessonRevision']),ruby=evaluate('ruby.ts',['hasAlignedFoodRuby']);
let translations=0,rubyFields=0;const ids=new Set();
for(const item of extensions){
 assert(!ids.has(item.id));ids.add(item.id);const lesson=lessons.find(l=>l.id===item.lessonId);assert(lesson);assert.equal(item.parentSourceHash,lesson.sourceHash);
 const core=Object.fromEntries(['id','lessonId','titleJa','textJa','sourceRefs','exerciseData','answerJa'].filter(k=>k in item).map(k=>[k,item[k]]));
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(ordered(core))).digest('hex'),item.contentHash,'source fingerprint '+item.id);
 for(const key of ['titleJa','textJa','answerJa'])if(item[key]){assert(ruby.hasAlignedFoodRuby(item[key],item.ruby[key]),item.id+'/'+key);rubyFields++;}
 assert.equal(item.nativeReviewed,false);assert.equal(item.domainExpertReviewed,false);
 for(const locale of locales){const t=item.translations[locale];assert(t&&t.title&&t.text,item.id+'/'+locale);assert.equal(t.sourceHash,item.contentHash);assert.equal(!!t.answer,!!item.answerJa);assert.equal(t.reviewedByNativeSpeaker,false);const forbidden=locale.startsWith('zh-')?/[\u3041-\u3096\u30a1-\u30fa]/:/[\u3041-\u3096\u30a1-\u30fa\u4e00-\u9fff]/;assert(![t.title,t.text,t.answer??''].some(v=>forbidden.test(v)),item.id+'/'+locale+' Japanese fallback');translations++;}
 assert.equal(source.foodManufacturingSupplements({...lesson,sourceHash:'stale'}).length,0);
}
let changed=0,unchanged=0;for(const lesson of lessons){const parts=source.foodManufacturingSupplements(lesson),revision=source.foodManufacturingLessonRevision(lesson);if(parts.length){assert.notEqual(revision,lesson.sourceHash);changed++;}else{assert.equal(revision,lesson.sourceHash);unchanged++;}}
assert.equal(extensions.length,20);assert.equal(translations,240);assert.equal(rubyFields,52);assert.equal(changed,18);assert.equal(unchanged,60);
const art=read('illustrations.json').illustrations;for(const x of art){const b=fs.readFileSync(path.join(dir,x.assetFile));assert.equal(crypto.createHash('sha256').update(b).digest('hex'),x.assetSha256);assert.equal(b.readUInt32BE(16),x.width);assert.equal(b.readUInt32BE(20),x.height);for(const l of locales)assert(x.translations[l]);}assert.equal(art.length,6);
const videos=read('safety-video-resources.json');assert.equal(videos.length,88);for(const v of videos){const url=new URL(v.url);assert.equal(url.protocol,'https:');assert.equal(url.hostname,'otaff.or.jp');assert(Number.isInteger(v.sourcePdfPage));}
console.log(JSON.stringify({status:'PASS',extensions:20,translations,rubyFields,parentRevisionsChanged:changed,otherLessonRevisionsPreserved:unchanged,staleParentsRejected:true,ownContentHashesVerified:true,artAssets:art.length,sourceVideoLinks:videos.length,nativeReviewed:false,browserTested:false}));
