const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict'),{stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const packs=read('src/data/restaurant/source31/1.json'),data=read('src/data/restaurant/royal-currency-denominations.json');
const helperCode=fs.readFileSync(path.join(root,'src/components/restaurant/RestaurantFigureIdentity.ts'),'utf8').replace(/^import .*;\n/gm,'').replace(/export function/g,'function');
const same=vm.runInNewContext(stripTypeScriptTypes(helperCode)+';sameRestaurantFigureIdentity');
const code=fs.readFileSync(path.join(root,'src/components/restaurant/RestaurantCurrencyDenomination.ts'),'utf8').replace(/^import .*;\n/gm,'').replace(/export function/g,'function');
const f=vm.runInNewContext(stripTypeScriptTypes(code)+';({restaurantCurrencyDenomination,restaurantCurrencyLabel})',{data,sameRestaurantFigureIdentity:same,Intl,require:()=>packs});
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let current=0,neutral=0;
for(const b of data.bindings){
 const row=packs.lessons[data.lessonId],canonical=row.figures.find(x=>x.id===b.figure.id),figure=structuredClone(canonical);
 for(const language of locales){const expected=new Intl.NumberFormat(language,{style:'currency',currency:'JPY',currencyDisplay:'code',maximumFractionDigits:0}).format(b.yen);assert.equal(f.restaurantCurrencyDenomination(figure,language),expected);assert.equal(f.restaurantCurrencyLabel(figure,'original caption',language),expected+' — original caption');current++;}
 for(const mutation of [{quizSafe:true},{cropBox:{x:0,y:0,width:10,height:10}},{sourceHash:'0'.repeat(64)},{captionJa:'changed caption'}]){const changed={...figure,...mutation};assert.equal(f.restaurantCurrencyDenomination(changed),null);assert.equal(f.restaurantCurrencyLabel(changed,'設問の図'),'設問の図');neutral++;}
 const old=canonical.captionJa;canonical.captionJa='changed current canonical caption';assert.equal(f.restaurantCurrencyDenomination(figure),null);canonical.captionJa=old;neutral++;
}
const other=packs.lessons[data.lessonId].figures.find(x=>!data.bindings.some(b=>b.figure.id===x.id));assert.equal(f.restaurantCurrencyDenomination(other),null);
assert.equal(data.bindings.length,6);console.log(`PASS currency reader identification: ${current} exactfigure/locale cases; ${neutral} quiz/crop/stale cases remain neutral; other note unchanged`);
