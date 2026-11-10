#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const {transformSync}=require('esbuild');
const root=path.resolve(__dirname,'../..');
const filename=path.join(root,'src/components/agriculture/ZoomableFigure.tsx');
const source=fs.readFileSync(filename,'utf8');
const start=source.indexOf('function figureGeometry'),end=source.indexOf('export function ZoomableFigure');
assert(start>=0&&end>start,'actual geometry function missing');
const context={};vm.runInNewContext(transformSync(source.slice(start,end),{loader:'ts'}).code+';this.geometry=figureGeometry;',context);
let count=0;
for(const width of [320,390,430,768,1024])for(const height of [320,390,844,932,1024])for(const allocated of [1,144,220,300,380,688])for(const [sw,sh] of [[1254,1254],[1536,1024],[900,1800],[1800,900]])for(const presentation of ['recognition','diagram']){
 const g=context.geometry(width,height,allocated,sw,sh,presentation);
 assert(Number.isFinite(g.normalWidth)&&g.normalWidth>0);
 assert(g.normalWidth<=allocated+1e-9,'image exceeds actual text column');
 assert(g.normalWidth*sh/sw<=g.maxHeight+1e-9,'image exceeds height cap');
 assert(g.maxHeight<=(presentation==='recognition'?260:420));count++;
}
assert(source.includes('onLayout={onLayout}'));
assert(source.includes('figureGeometry(width,height,containerWidth,sourceWidth,sourceHeight,presentation)'));
assert(source.includes('width:renderedWidth,height:renderedWidth*sourceHeight/sourceWidth'),'Image needs explicit dimensions, not intrinsic asset dimensions');
assert(source.includes('masks.map')&&source.includes('sourceMarks.map'),'same source-bound overlays in both views');
assert(source.includes('<Modal')&&source.includes('onRequestClose'));
assert(!source.includes('StyleSheet.absoluteFill'));
const data=path.join(root,'src/data/agriculture');
const read=n=>JSON.parse(fs.readFileSync(path.join(data,n),'utf8'));
const images=read('recognition-images.json').images,lessons=read('lessons.ja.json').lessons,placements=read('image-paragraph-placement.json');
let bindings=0;
for(const image of images)for(const id of image.lessonIds){
 const lesson=lessons.find(l=>l.id===id);if(!lesson||image.lessonSourceHashes[id]!==lesson.sourceHash)continue;
 assert.equal(placements[id]?.sourceHash,lesson.sourceHash,`stale placement ${id}`);
 assert(lesson.paragraphs.some(p=>p.id===placements[id].paragraphs[image.id]),`unplaced image ${image.id}/${id}`);bindings++;
}
console.log(`PASS agriculture image layout: ${count} geometry cases; ${images.length} images/${bindings} source-bound paragraph placements. Browser/device visual acceptance remains separate.`);
