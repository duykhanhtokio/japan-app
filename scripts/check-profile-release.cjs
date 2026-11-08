const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),ts=require('typescript');
const React=require('react'),{act,create}=require('react-test-renderer');global.IS_REACT_ACT_ENVIRONMENT=true;
function load(path,mocks){const mod={exports:{}};const source=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}});assert.equal((source.diagnostics??[]).length,0);vm.runInNewContext(source.outputText,{module:mod,exports:mod.exports,require:n=>{if(n in mocks)return mocks[n];throw Error('Unexpected dependency '+n);},console,process:{env:{}}});return mod.exports;}
const copy=JSON.parse(fs.readFileSync('src/i18n/profile-release-copy.json'));
const {profileText}=load('src/i18n/profile-release-copy.ts',{'./profile-release-copy.json':copy});
for(const lang of ['en','vi','ja','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
 assert.deepEqual(Object.keys(copy[lang]).sort(),Object.keys(copy.en).sort());
 for(const key of Object.keys(copy.en))assert(copy[lang][key]?.trim(),lang+':'+key);
 assert(!profileText(lang,'monthly',{price:3000}).includes('{price}'));
 if(lang!=='vi')assert.notEqual(copy[lang].unverified,copy.vi.unverified);
}
let currentLanguage='id';
const native={ActivityIndicator:'ActivityIndicator',Pressable:'Pressable',ScrollView:'ScrollView',Text:'Text',View:'View',StyleSheet:{create:x=>x}};
const mocks={'react':React,'react/jsx-runtime':require('react/jsx-runtime'),'react-native':native,'expo-router':{router:{canGoBack:()=>false}},'@/context/LanguageContext':{useAppLanguage:()=>({language:currentLanguage})},'@/i18n/profile-release-copy':{profileText},'@/config/release-features':{RELEASE_FEATURES:{freeLearning:true}},'@/components/ui/StableSafeAreaView':{default:'SafeAreaView',__esModule:true},'@/components/ui/RoyalSurface':{RoyalBackButton:'Back',ROYAL_LAYOUT:{screenGutter:16,backSafeTop:18}},'@/components/ui/prepareSceneRoute':{backPrepared:()=>{},replacePrepared:()=>{}},'@/economy/client':{},'@/economy/policy':{ECONOMY_POLICY:{premiumMonthlyYen:3000}}};
const Screen=load('src/app/economy.tsx',mocks).default;
(async()=>{
 let screen;await act(async()=>{screen=create(React.createElement(Screen));});
 const text=()=>JSON.stringify(screen.toJSON());
 assert(text().includes(copy.id.unverified));assert(text().includes(copy.id.freeInfo));assert(!text().includes('Chưa'));
 await act(async()=>{await screen.root.findByType('Pressable').props.onPress();});
 assert(text().includes(copy.id.notConfigured));
 currentLanguage='th';await act(async()=>{screen.update(React.createElement(Screen));});assert(text().includes(copy.th.notConfigured),'Stored status must translate when language changes');await act(async()=>screen.unmount());
 let stored=null,denied=false,cancelled=false,failStorage=false,device=true,os='ios',writes=0;const copies=[],deleted=[];
 const storage={getItem:async()=>stored,setItem:async(_key,value)=>{if(failStorage)throw Error('disk');stored=value;writes++;}};
 const picker={requestCameraPermissionsAsync:async()=>({granted:!denied}),launchCameraAsync:async()=>({canceled:cancelled,assets:cancelled?null:[{uri:'file:///camera/new.jpg'}]}),launchImageLibraryAsync:async()=>({canceled:cancelled,assets:cancelled?null:[{uri:'file:///album/new.jpg',base64:'aGVsbG8=',mimeType:'image/jpeg'}]})};
 const files={documentDirectory:'file:///documents/',makeDirectoryAsync:async()=>{},copyAsync:async x=>copies.push(x),deleteAsync:async p=>deleted.push(p)};
 const service=load('src/services/player-photo.ts',{'@react-native-async-storage/async-storage':{__esModule:true,default:storage},'react-native':{Platform:{get OS(){return os;}}},'expo-device':{get isDevice(){return device;}},'expo-image-picker':picker,'expo-file-system/legacy':files});
 let updates=0;const unsubscribe=service.subscribePlayerPhoto(()=>updates++);
 await service.loadPlayerPhoto();assert.equal(service.playerPhotoSnapshot(),null);
 device=false;assert.equal(await service.choosePlayerPhoto('camera'),'unavailable');assert.equal(writes,0);
 device=true;denied=true;assert.equal(await service.choosePlayerPhoto('camera'),'denied');assert.equal(writes,0);
 denied=false;cancelled=true;assert.equal(await service.choosePlayerPhoto('album'),'cancelled');assert.equal(writes,0);
 cancelled=false;assert.equal(await service.choosePlayerPhoto('album'),'saved');const previous=service.playerPhotoSnapshot();assert(previous.startsWith('file:///documents/player-photo/'));assert.equal(stored,previous);assert.equal(copies.length,1);
 failStorage=true;await assert.rejects(()=>service.choosePlayerPhoto('camera'));assert.equal(service.playerPhotoSnapshot(),previous);assert(!deleted.includes(previous),'Never remove old image on failed save');
 failStorage=false;assert.equal(await service.choosePlayerPhoto('camera'),'saved');assert(deleted.includes(previous));assert(updates>=3);unsubscribe();
 const restored=load('src/services/player-photo.ts',{'@react-native-async-storage/async-storage':{__esModule:true,default:storage},'react-native':{Platform:{OS:'ios'}}});await restored.loadPlayerPhoto();assert.equal(restored.playerPhotoSnapshot(),stored,'Photo must survive relaunch');
 os='web';assert.equal(await service.choosePlayerPhoto('album'),'saved');assert.equal(service.playerPhotoSnapshot(),'data:image/jpeg;base64,aGVsbG8=');
 const profile=fs.readFileSync('src/app/profile/index.tsx','utf8');assert(!profile.includes('東京探検'));assert(!profile.includes('title="Golden Key"'));assert(!profile.includes('7日連続'));assert(profile.includes("stats.dialogueCompleted>0?'earned':'pending'"));
 let photoChoice=null,photoValue=null;const alerts=[];
 const Avatar=load('src/components/app/PlayerAvatar.tsx',{
  react:React,'react/jsx-runtime':require('react/jsx-runtime'),
  'react-native':{...native,Image:'Image',Modal:'Modal',Alert:{alert:(...args)=>alerts.push(args)}},
  '@/context/LanguageContext':{useAppLanguage:()=>({language:'id'})},
  '@/i18n/profile-release-copy':{profileText},
  '@/services/player-photo':{subscribePlayerPhoto:()=>()=>{},playerPhotoSnapshot:()=>photoValue,loadPlayerPhoto:async()=>{},choosePlayerPhoto:async source=>{photoChoice=source;return 'saved';}},
  '@/components/ui/RoyalSurface':{RoyalButton:'RoyalButton'},
  '@/components/ui/RoyalPaperPanel':{default:'Panel',__esModule:true},
  '../../../assets/app/ui/royal-af/hud-player-medallion-v1.png':1,
 }).default;
 let avatar;await act(async()=>{avatar=create(React.createElement(Avatar,{size:72}));});
 assert.equal(avatar.root.findByType('Modal').props.visible,false);
 await act(async()=>avatar.root.findByType('Pressable').props.onPress());
 assert.equal(avatar.root.findByType('Modal').props.visible,true);
 assert.deepEqual(avatar.root.findAllByType('RoyalButton').map(x=>x.props.label),[copy.id.camera,copy.id.album,copy.id.cancel]);
 await act(async()=>avatar.root.findAllByType('RoyalButton')[1].props.onPress());
 assert.equal(photoChoice,'album');assert.equal(avatar.root.findByType('Modal').props.visible,false);
 await act(async()=>avatar.root.findByType('Pressable').props.onPress());
 await act(async()=>avatar.root.findAllByType('RoyalButton')[0].props.onPress());assert.equal(photoChoice,'camera');
 await act(async()=>avatar.unmount());
 console.log('PASS 13 locales; Premium status follows language changes; photo cancel/denial/camera unavailable/atomic save/relaunch/web persistence; unsupported achievement placeholders removed. Native UI mocked.');
})().catch(error=>{console.error(error);process.exit(1);});
