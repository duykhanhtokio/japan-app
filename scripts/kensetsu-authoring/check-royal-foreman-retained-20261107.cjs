// Focused checks against current lesson/component snapshots; no source PDF is bundled.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto'),ts=require('typescript'),React=require('react');
const root=path.resolve(__dirname,'../..'),qa=process.env.KENSETSU_GROUP01_QA;
assert(qa,'Set KENSETSU_GROUP01_QA to private current lesson/component snapshots');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const compile=(src,scope={})=>{const result=ts.transpileModule(src,{reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2020}});assert(!result.diagnostics.some(d=>d.category===1));const module={exports:{}};vm.runInNewContext(result.outputText,{module,exports:module.exports,...scope});return module.exports;};
const registry=compile(read(path.join(root,'src/data/kensetsu/foreman-illustrations.ts')),{require:id=>id});
const localize=compile(read(path.join(root,'src/data/kensetsu/localization.ts')));
const course=read(path.join(qa,'KensetsuCourse.tsx')),start=course.indexOf('function StudyImage('),end=course.indexOf('export function KensetsuDayReader',start);assert(start>=0&&end>start);
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
let state=[],cursor=0,viewport={},renders=0,localized=0,stale=0;
const scope={React,Image:'Image',View:'View',Pressable:'Pressable',Text:'Text',Modal:'Modal',ScrollView:'ScrollView',Action:'Action',s:{},useWindowDimensions:()=>viewport,useSafeAreaInsets:()=>({left:0,right:0,top:0,bottom:0}),useStudyAppearance:()=>({colors:{muted:'#123'}}),useState:init=>{let i=cursor++;if(state[i]===undefined)state[i]=init;return[state[i],v=>state[i]=typeof v==='function'?v(state[i]):v]},illustrations:registry.foremanIllustrations,illustrationAspectRatios:registry.foremanIllustrationAspectRatios};
const {StudyImage}=compile(course.slice(start,end)+'\nexport {StudyImage};',scope);
function nodes(el,type,out=[]){if(!el||typeof el!=='object')return out;if(el.type===type)out.push(el);React.Children.forEach(el.props?.children,c=>nodes(c,type,out));return out;}
const proof=[];
for(const n of [10,14,16,17,18,19,20,22,24]){
 const session=json(path.join(qa,`foreman-session-${n}.json`));
 const packs=locales.filter(l=>l!=='vi').map(l=>json(path.join(root,`src/data/kensetsu/foreman-translations/${l}.json`)).sessions[session.id]);
 const result=localize.applyLocaleLessonBundles(session,packs);
 for(const c of result.clusters.filter(c=>c.illustration)){
  const caption=c.illustration,asset=caption.assetPath;assert.equal(registry.foremanIllustrationAspectRatios[asset],1200/720);
  const original=session.clusters.find(x=>x.id===c.id);const bindings=[];
  for(const p of c.paragraphs){assert.equal(original.paragraphs.find(x=>x.id===p.id).ja,p.ja);for(const locale of locales){assert(p.translations[locale]?.trim());localized++;}bindings.push({id:p.id,jaSha256:crypto.createHash('sha256').update(p.ja).digest('hex')});}
  for(const locale of locales)assert(caption.captionTranslations[locale]?.trim());
  const altered={...session,clusters:session.clusters.map(x=>x.id===c.id?{...x,illustration:{...x.illustration,captionJa:x.illustration.captionJa+'変更'}}:x)};
  assert.equal(localize.applyLocaleLessonBundles(altered,packs).clusters.find(x=>x.id===c.id).illustration.captionTranslations,undefined);stale++;
  for(const [width,height] of [[375,812],[812,375],[768,1024],[1440,900]])for(const lang of ['ja',...locales]){
   viewport={width,height};state=[];const captionText=lang==='ja'?caption.captionJa:caption.captionTranslations[lang];const render=()=>{cursor=0;renders++;return StudyImage({path:asset,caption:captionText})};let tree=render();const initial=nodes(tree,'Image')[0];assert(initial.props.source.endsWith(asset.split('/').pop()));assert(initial.props.style.width<=width-32);assert.equal(initial.props.style.height,initial.props.style.width/(1200/720));
   nodes(tree,'Pressable')[0].props.onPress();tree=render();assert.equal(nodes(tree,'Modal')[0].props.visible,true);nodes(tree,'Action').find(x=>x.props.testID==='kensetsu-image-magnify').props.onPress();tree=render();const enlarged=nodes(tree,'Image')[1];assert(enlarged.props.style.width>=900);assert.equal(enlarged.props.style.height,enlarged.props.style.width/(1200/720));
  }
  proof.push({asset,sessionId:session.id,clusterId:c.id,sessionSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(qa,`foreman-session-${n}.json`))).digest('hex'),bindings,captionJaSha256:crypto.createHash('sha256').update(caption.captionJa).digest('hex')});
 }
}
console.log(JSON.stringify({PASS:true,imageContexts:proof.length,actualStudyImageStructuralRenders:renders,localizedParagraphBindings:localized,staleCaptionRejected:stale,proof,scope:'Actual source-bound locale adapter and normal/open/magnified StudyImage on structural native hosts; not full route/browser/native-device/domain approval'}));
