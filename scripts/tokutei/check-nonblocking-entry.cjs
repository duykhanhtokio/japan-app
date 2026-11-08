const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),ts=require('typescript');
const mod={exports:{}},visits=[];
const mocks={
 '@/config/release-features':{isLockedGameRoute:()=>false},
 'react-native':{Dimensions:{get:()=>({width:390,height:844})}},
 '@/data/world-map-config':{japanAssets:{},regionMaps:{}},
 './prepareArtwork':{prepareArtwork:()=>new Promise(()=>{}),isArtworkSource:()=>true},
 './common-artwork':{COMMON_UI_ARTWORK:[]},'./home-artwork':{HOME_ARTWORK:[]},'./tokutei-artwork':{TOKUTEI_ARTWORK:[]},
 'expo-router':{router:{push:p=>visits.push(p),replace:p=>visits.push(p),dismissTo:p=>visits.push(p)}},
 './navigation-path':{previousRoutePath:()=>null},
};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/ui/prepareSceneRoute.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,{module:mod,exports:mod.exports,require:n=>{if(n in mocks)return mocks[n];if(/\.(png|jpg|webp)$/.test(n))return 1;throw Error(n);},console,setTimeout,clearTimeout});
(async()=>{const nav=mod.exports;assert.equal(await nav.pushPrepared('/specified-skills/manufacturing'),true);assert.equal(visits[0],'/specified-skills/manufacturing');let done=false,release;const gate=new Promise(resolve=>{release=resolve;});const pending=nav.navigateWithPreparedArtwork('/specified-skills/agriculture',()=>{done=true;},[],()=>gate);await new Promise(resolve=>setImmediate(resolve));assert.equal(done,false,'Required state is still respected');release();await pending;assert.equal(done,true);
const location=fs.readFileSync('src/screens/on-demand/world/location/[locationId].tsx','utf8');assert(!location.includes('await prepareDialogueEntry('),'A multi-megabyte audio download must not gate Start');assert(location.includes('void prepareDialogueEntry('),'Background warmup remains');
const profile=fs.readFileSync('src/app/profile/index.tsx','utf8');assert(!profile.includes('style={styles.identity}'));assert(!profile.includes('PROFILE_AVATAR'));assert(profile.includes('<GameHeader'));
const copy=JSON.parse(fs.readFileSync('src/i18n/ui-copy.json','utf8')).industrialManufacturing;assert.equal(Object.keys(copy).length,13);assert.equal(copy.id,'Manufaktur industri');assert.equal(copy.vi,'Sản xuất công nghiệp');
console.log('PASS nonblocking Tokutei dispatch with stalled artwork, required-state guard, no awaited Kaiwa pack, retained HUD, 13-locale manufacturing label.');})().catch(e=>{console.error(e);process.exitCode=1;});
