/** Isolated production Expo/Metro module export. No adapters and no claim of native execution.
 * Uses installed exact Expo 54 / RN .81 dependencies from RESTAURANT_EXPO_DEPS.
 * Copies current restaurant modules to a scratch diagnostic project; never edits app config.
 */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const out=process.env.RESTAURANT_EXPO_QA_DIR,deps=process.env.RESTAURANT_EXPO_DEPS;
if(!out||!deps||!path.isAbsolute(out)||!path.isAbsolute(deps))throw Error('Set absolute RESTAURANT_EXPO_QA_DIR and RESTAURANT_EXPO_DEPS');
if(out===root||out.startsWith(root+path.sep))throw Error('Diagnostic project must remain outside source repository');
const versions=Object.fromEntries(['expo','react-native','react','react-native-web'].map(name=>[name,require(path.join(deps,'node_modules',name,'package.json')).version]));
if(!versions.expo.startsWith('54.')||versions['react-native']!=='0.81.5')throw Error('Wrong Expo/RN versions');
const project=path.join(out,'metro-project');fs.mkdirSync(project,{recursive:true});
for(const rel of ['src/data/restaurant','src/services/restaurant-study-state.ts','src/services/kensetsu-test-state.ts']){
 const target=path.join(project,rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.cpSync(path.join(root,rel),target,{recursive:true});
}
fs.writeFileSync(path.join(project,'package.json'),JSON.stringify({name:'restaurant-production-module-diagnostic',version:'1.0.0',private:true,main:'index.js',dependencies:{expo:'54.0.38',react:'19.1.0','react-native':'0.81.5','react-native-web':'0.21.2','react-dom':'19.1.0'}},null,2));
fs.writeFileSync(path.join(project,'app.json'),JSON.stringify({expo:{name:'Restaurant module diagnostic',slug:'restaurant-module-diagnostic',version:'1.0.0',web:{bundler:'metro'}}}));
fs.writeFileSync(path.join(project,'tsconfig.json'),JSON.stringify({extends:'expo/tsconfig.base',compilerOptions:{baseUrl:'.',paths:{'@/*':['src/*']}}}));
fs.writeFileSync(path.join(project,'metro.config.js'),`const {getDefaultConfig}=require('expo/metro-config');const c=getDefaultConfig(__dirname);c.watchFolders=[${JSON.stringify(deps)}];c.resolver.nodeModulesPaths=[${JSON.stringify(path.join(deps,'node_modules'))}];module.exports=c;`);
const link=path.join(project,'node_modules');if(!fs.existsSync(link))fs.symlinkSync(path.join(deps,'node_modules'),link,'dir');
fs.writeFileSync(path.join(project,'index.js'),`import {registerRootComponent} from 'expo';import React from 'react';import {Text,ScrollView} from 'react-native';
import {restaurantLevelLessons,restaurantExams,restaurantLessonTranslation,restaurantQuestionTranslation,restaurantWeeks,restaurantUi} from './src/data/restaurant';
import {freshRestaurantProgress,restoreRestaurantProgress,freshRestaurantAttempt,restoreRestaurantAttempt,gradeTest,restaurantProgressKey,restaurantExamKey} from './src/services/restaurant-study-state';
function verify(){let lessons=0,questions=0,lessonTranslations=0,questionTranslations=0;const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
for(const level of ['1','2']){const ls=restaurantLevelLessons(level),es=restaurantExams(level);lessons+=ls.length;for(const l of ls)for(const locale of locales){if(!restaurantLessonTranslation(l,locale))throw Error('Missing lesson translation '+locale+'/'+l.id);lessonTranslations++;}
for(const e of es){const a=freshRestaurantAttempt(e);if(!restoreRestaurantAttempt(JSON.stringify(a),e))throw Error('Attempt restore');if(restoreRestaurantAttempt('corrupt',e)!==null)throw Error('Corrupt attempt');if(gradeTest(e,a.answers).unanswered!==e.questions.length)throw Error('Grade unanswered');questions+=e.questions.length;for(const q of e.questions)for(const locale of locales){if(!restaurantQuestionTranslation(q,locale))throw Error('Missing question translation '+locale+'/'+q.id);questionTranslations++;}}}
if(restaurantProgressKey('qa','1')===restaurantProgressKey('qa','2'))throw Error('Level collision');if(restaurantProgressKey('qa','1')===restaurantProgressKey('other','1'))throw Error('Learner collision');if(restoreRestaurantProgress('corrupt')!==null)throw Error('Corrupt progress');if(!restoreRestaurantProgress(JSON.stringify(freshRestaurantProgress())))throw Error('Progress restore');
const result={status:'PASS',lessons,questions,lessonTranslations,questionTranslations,levels:2,locales:12,scope:'Real production Expo module diagnostic; not RestaurantCourse UI or native device'};if(typeof window!=='undefined')window.__restaurantExpoDiagnostic=result;return result;}
const result=verify();export default function App(){return <ScrollView><Text testID="restaurant-expo-diagnostic">{JSON.stringify(result)}</Text></ScrollView>}registerRootComponent(App);`);
const cli=path.join(deps,'node_modules/expo/bin/cli');
const args=['export','--platform','ios','--platform','android','--platform','web','--output-dir','dist','--max-workers','1'];
const result=cp.spawnSync(process.execPath,[cli,...args],{cwd:project,encoding:'utf8',env:{...process.env,CI:'1',EXPO_NO_TELEMETRY:'1',NODE_OPTIONS:'--max-old-space-size=3072'},maxBuffer:8000000,timeout:240000});
fs.mkdirSync(path.join(out,'results'),{recursive:true});fs.writeFileSync(path.join(out,'results','expo-export.log'),(result.stdout||'')+'\n'+(result.stderr||''));
console.log(JSON.stringify({versions,status:result.status,signal:result.signal,error:result.error?.message,project,log:path.join(out,'results','expo-export.log'),scope:'Production module bundles only; no native execution'}));
if(result.status!==0)process.exitCode=1;
