// Run against the effective runtime adapters, not just the presence of translation files.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/localization-workspace');
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'],targets=locales.slice(1);
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const walk=p=>fs.readdirSync(path.join(root,p),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
const groups={},missing=[];
const nonempty=x=>typeof x==='string'&&!!x.trim();
function unit(group,id,values,source){
 const g=groups[group]??={units:0,translated:Object.fromEntries(targets.map(l=>[l,0])),missing:Object.fromEntries(targets.map(l=>[l,0]))};g.units++;
 const absent=[];for(const l of targets){if(nonempty(values?.[l]))g.translated[l]++;else {g.missing[l]++;absent.push(l);}}if(absent.length)missing.push({group,id,locales:absent});
}
async function bundle(){
 const esbuild=require(require.resolve('esbuild',{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
 const modules={k:'src/data/kensetsu/index.ts',ku:'src/data/kensetsu/localization.ts',km:'src/data/kensetsu/scope.ts',kt:'src/data/kensetsu/review-tests.ts',ka:'src/data/kaigo/index.ts',kc:'src/data/kaigo/catalog.ts',kj:'src/data/kaigo/japanese-master.ts',kq:'src/data/kaigo/japanese-assessments.ts',kr:'src/data/kaigo/japanese-mock-reviews.ts',kx:'src/data/kaigo/japanese-mock-translations.ts',v:'src/data/jlpt-learning.ts',g:'src/data/jlpt-study-data.ts',w:'src/data/work-dialogues.ts',j:'src/data/technical-intern-job-translations.ts',ji:'src/data/technical-intern-translations/index.ts',ls:'src/data/lesson-steps.ts',ll:'src/data/lessons.ts',gd:'src/data/game-dialogues.ts',ph:'src/components/world/player-answer-guidance.ts',dt:'src/services/dialogue-translations.ts',qq:'src/data/quizzes.ts',gc:'src/i18n/grammar-copy.ts',vc:'src/data/vocabulary-localization.ts',tj:'src/data/technical-intern-jobs.ts',uc:'src/i18n/ui-text.ts',sc:'src/i18n/selected-content.ts',ii:'src/data/industries.ts',mm:'src/data/modules.ts',cc:'src/data/categories.ts',tt:'src/data/tags.ts',ms:'src/data/missions.ts',lv:'src/data/vocabulary.ts'};
 const code=Object.entries(modules).map(([n,p])=>`import * as ${n} from ${JSON.stringify(path.join(root,p))};`).join('\n')+'\nmodule.exports={'+Object.keys(modules).join(',')+'};';
 const result=await esbuild.build({stdin:{contents:code,resolveDir:root},write:false,bundle:true,define:{__DEV__:'true'},platform:'node',format:'cjs',logLevel:'error',plugins:[{name:'data-assets',setup(b){b.onResolve({filter:/\.(png|webp|jpe?g|mp3|wav)$/},()=>({path:'asset',namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'module.exports={};'}));b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const x of ['', '.ts','.tsx','.json','.js','/index.ts'])if(fs.existsSync(p+x)&&fs.statSync(p+x).isFile())return {path:p+x};});}}]});
 const m={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(m,m.exports,require);return m.exports;
}
(async()=>{
 const a=await bundle();
 const pending=new Set(locales.flatMap(l=>[a.gc.getGrammarCopy(l).pending,a.vc.getVocabularyCopy(l).pending]));
 const validTranslation=x=>pending.has(x)?undefined:x;
 for(const x of a.v.generatedVocabulary){unit('vocabulary.meaning',x.id,Object.fromEntries(targets.map(l=>[l,validTranslation(a.v.getVocabularyMeaning(x,l))])));unit('vocabulary.example',x.id,Object.fromEntries(targets.map(l=>[l,validTranslation(a.v.getVocabularyExampleTranslation(x,l))])));}
 for(const x of a.g.generatedGrammar){unit('grammar.meaning',x.id,Object.fromEntries(targets.map(l=>[l,validTranslation(a.g.getGrammarMeaning(x,l))])));unit('grammar.example',x.id,Object.fromEntries(targets.map(l=>[l,validTranslation(a.g.getGrammarExampleTranslation(x,l))])));}
 // Effective construction lessons include shared sessions, field-specific views and foreman material.
 for(const x of a.k.sessions){const group=x.id.includes('foreman')?'kensetsu.foreman':'kensetsu.lessons';
  unit(group,x.id+':title',x.titleTranslations,x.titleJa);
  for(const c of x.clusters){unit(group,c.id+':title',c.titleTranslations,c.titleJa);for(const p of c.paragraphs)unit(group,p.id,p.translations,p.ja);
   for(const [key,ja,t] of [['prompt',c.applicationPromptJa,c.applicationPromptTranslations],['reflection',c.reflectionJa,c.reflectionTranslations],['activity',c.learningActivity?.ja,c.learningActivity?.translations],['caption',c.illustration?.captionJa,c.illustration?.captionTranslations]])if(ja)unit(group,c.id+':'+key,t,ja);
   for(const t of c.terms??[])unit(group,c.id+':term:'+t.ja,t.translations,t.ja);
  }for(const t of x.keyTerms??[])unit(group,x.id+':term:'+t.term,t.translations,t.term);for(const [i,v]of (x.illustrations??[]).entries())unit(group,x.id+':illustration:'+i,v.altTranslations,v.altJa);
 }
 const tests=new Map();for(const level of ['1','2'])for(const field of ['utilities','building','civil'])for(const subject of ['theory','practical','foreman'])for(const t of a.kt.reviewTestsForScope(level,field,subject))for(const q of t.questions)tests.set(q.id,q);
 for(const q of tests.values()){unit('kensetsu.tests',q.id+':prompt',q.translations,q.promptJa);q.choicesJa.forEach((s,i)=>unit('kensetsu.tests',q.id+':choice:'+i,q.choiceTranslations?.[i],s));unit('kensetsu.tests',q.id+':explanation',q.explanationTranslations,q.explanationJa);q.distractorRationalesJa.forEach((s,i)=>unit('kensetsu.tests',q.id+':rationale:'+i,q.rationaleTranslations?.[i],s));}
 for(const [id,m]of Object.entries(a.kj.japaneseMasterSections))for(const field of ['heading',...m.paragraphsJa.map((_,i)=>'p:'+i),...Object.keys(m.figureCaptionsJa??{}).map(k=>'figure:'+k)])unit('kaigo.knowledge',id+':'+field,Object.fromEntries(targets.map(l=>{const t=a.kj.translationForMaster(id,l);return [l,field==='heading'?t?.heading:field.startsWith('p:')?t?.paragraphs[Number(field.slice(2))]:t?.figureCaptions?.[field.slice(7)]];})));
 for(const [id,m]of Object.entries(a.kj.japaneseLessonMetadata))unit('kaigo.lessonMetadata',id,Object.fromEntries(targets.map(l=>[l,a.kj.translationForLesson(id,l)?.title])));
 for(const q of a.kq.japaneseWeeklyQuestions)unit('kaigo.weeklyQuestions',q.id,Object.fromEntries(targets.map(l=>[l,a.kq.translationForQuestion(q.id,l)?.prompt])),q.prompt);
 for(const form of a.ka.kaigoCourse.mocks){const f=a.kr.withJapaneseMockReview(form);unit('kaigo.mockTitles',f.id,Object.fromEntries(targets.map(l=>[l,a.kx.translationForMockTitle(f,l)?.title])));for(const q of f.questions)unit('kaigo.mockQuestions',q.id,Object.fromEntries(targets.map(l=>[l,a.kx.translationForMockQuestion(f,q.id,l)?.prompt])),q.promptJa);}
 function legacy(group,record,id){
  if(!record||typeof record!=='object')return;
  if(Array.isArray(record)){record.forEach((v,i)=>legacy(group,v,id+':'+i));return;}
  const name=record.id??id;
  for(const [field,value]of Object.entries(record)){
   if(field.endsWith('Vi')&&nonempty(value)){
    const key=field.slice(0,-2);unit(group,name+':'+key,Object.fromEntries(targets.map(l=>{const v=a.sc.legacyFieldTranslation(l,record,key);return [l,v===a.uc.uiText('pending',l)?undefined:v];})));
   }else if(value&&typeof value==='object')legacy(group,value,name+':'+field);
  }
 }
 for(const [name,items]of [['lessons',a.ll.lessons],['lessonSteps',a.ls.lessonSteps],['gameDialogue',a.gd.dialogueNodes],['industries',a.ii.industries],['modules',a.mm.modules],['categories',a.cc.vocabularyCategories],['tags',a.tt.vocabularyTags],['missions',a.ms.missions]])legacy('legacy.'+name,items,name);
 for(const v of a.lv.vocabulary){const item=a.vc.findVocabularyByJapanese(v.word,v.reading)??{...v,id:String(v.id)};unit('legacy.vocabularyMeaning',String(v.id),Object.fromEntries(targets.map(l=>[l,validTranslation(a.vc.getVocabularyMeaning(item,l))])));}
 for(const s of a.w.workDialogueScenarios){unit('workDialogue.metadata',s.id+':title',s.titleTranslations,s.titleJa);unit('workDialogue.metadata',s.id+':description',s.descriptionTranslations,s.descriptionJa);for(const n of s.nodes??[]){unit('workDialogue.turns',n.id,n.translations,n.textJa);if(n.instruction)unit('workDialogue.instructions',n.id,n.instruction);}}
 for(const id of a.tj.getAllTechnicalInternTranslationKeys())unit('jobNames.runtime',id,Object.fromEntries(targets.map(l=>[l,a.ji.technicalInternJobTranslations[l]?.[id]])));
 for(const [id,row]of Object.entries(a.uc.uiCopy))unit('ui.authoredCopy',id,row);
 const dialogueFiles=walk('src/data/generated/dialogues').filter(p=>p.endsWith('.json'));
 const allScenarios=new Map([...read('src/data/generated/scenarios.json'),...read('src/data/dialogue-content/scenario-overrides.json'),...read('src/data/dialogue-content/independent-city-overrides.json')].map(x=>[x.id,x]));
 const dialogues=[...allScenarios.keys()].map(id=>{const direct='src/data/generated/dialogues/'+id+'.json';if(fs.existsSync(path.join(root,direct)))return {id,file:direct};const m=/^SC-LOC-JP-\d{5}-(\d{2})-001$/.exec(id);const file=m?'src/data/generated/dialogues/GENERIC-CITY-'+m[1]+'.json':direct;return {id,file};});let scenarioFiles=0,legacyLevelFiles=0,missingScenarioFiles=[];const completeScenarios=Object.fromEntries(targets.map(l=>[l,0]));let completeAllLocales=0;
 const hints=read('src/data/dialogue-content/player-hints.json');const transDir=path.join(root,'src/data/dialogue-content/translations');
 for(const {id:scenarioId,file} of dialogues){if(!fs.existsSync(path.join(root,file))){missingScenarioFiles.push(scenarioId);continue;}const d=read(file);const turns=Array.isArray(d)?d:d.shared??d.N5;if(!Array.isArray(turns))continue;scenarioFiles++;const absentScenarioLocales=new Set();if(!Array.isArray(d)&&!d.shared)legacyLevelFiles++;
  for(const originalTurn of turns){const t=file.includes('/GENERIC-CITY-')?{...originalTurn,id:originalTurn.id.replace(/GENERIC-CITY-\d{2}/g,scenarioId),scenarioId}:originalTurn;const npc=t.speaker==='NPC',source=npc?t.npc?.textJa:t.player?.recommendedAnswerJa;if(!nonempty(source))continue;
   const bundlePath=path.join(transDir,t.scenarioId+'.json');let b;if(fs.existsSync(bundlePath))b=JSON.parse(fs.readFileSync(bundlePath,'utf8'));
   const e=b?.scenarioId===t.scenarioId?b.turns?.[t.id]:undefined,overlay=e?.sourceJa===source&&e?.speaker===t.speaker?e.translations:{};
   const texts={...(npc?{vi:t.npc?.translationVi,...t.npc?.translations}:t.player?.translations),...overlay};unit(npc?'lifeDialogue.npc':'lifeDialogue.player',t.id,texts,source);for(const l of targets)if(!nonempty(texts[l]))absentScenarioLocales.add(l);
   if(!npc){const h=hints[t.id];unit('lifeDialogue.authoredTask',t.id,h?.answerJa===source?h.hintTranslations:t.player?.hintTranslations);const player={...t.player,translations:{...t.player?.translations,...overlay},...(h?.answerJa===source?{hintTranslations:h.hintTranslations}:{})};unit('lifeDialogue.playerHint',t.id,Object.fromEntries(targets.map(l=>[l,a.ph.getPlayerNativeHint(player,l)])),source);}
  }
  for(const l of targets)if(!absentScenarioLocales.has(l))completeScenarios[l]++;if(absentScenarioLocales.size===0)completeAllLocales++;
 }
 for(const q of a.qq.quizzes){const localized=source=>Object.fromEntries(targets.map(l=>[l,Object.values(a.uc.uiCopy).find(row=>row.vi===source)?.[l]??(l==='vi'?source:undefined)]));unit('legacy.quizzes',q.id+':prompt',localized(q.questionVi),q.questionJa);unit('legacy.quizzes',q.id+':explanation',localized(q.explanationVi),q.explanationJa);for(const o of q.options)if(/[ĂăĐđĨĩŨũƠơƯưẠ-ỹ]/u.test(o.text))unit('legacy.quizzes',q.id+':'+o.id,localized(o.text));}
 const uiFiles=[...walk('src/app'),...walk('src/components')].filter(p=>/\.[tj]sx?$/.test(p));
 const vi=/[ĂăĐđĨĩŨũƠơƯưẠ-ỹ]/u;
 const staticCandidates=uiFiles.flatMap(file=>{const src=fs.readFileSync(path.join(root,file),'utf8').replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'');return src.split('\n').flatMap((line,i)=>vi.test(line)?[{file,line:i+1,text:line.trim().slice(0,320)}]:[]);});
 const originalForms=walk('src/data/jlpt-original').filter(p=>/\/master\.ja\.json$/.test(p)).map(p=>read(p));
 const originalExamInventory={forms:originalForms.length,integratedForms:originalForms.filter(f=>f.runtimeIntegrated).length,questions:originalForms.reduce((n,f)=>n+(f.questions?.length??0),0),canonicalLanguage:'ja',nativeQuestionTranslationSelection:false,policy:'Japanese ability assessment; question source remains Japanese, no exam-taking UI or answer data changed'};
 const officialRegistry=fs.readFileSync(path.join(root,'src/data/jlpt-official/approved-n1-exams.ts'),'utf8'),legacyCatalog=fs.readFileSync(path.join(root,'src/data/jlpt-official/jlpt-exam-catalog.ts'),'utf8');
 const historicalExplanationPacks=walk('src/data/jlpt-official').filter(p=>/explanations.*\.json$/.test(p)).map(file=>{const found=new Set();const visit=x=>{if(!x||typeof x!=='object')return;for(const [k,v]of Object.entries(x)){if(locales.includes(k)&&v)found.add(k);visit(v);}};visit(read(file));return {file,localeKeysPresent:[...found].sort()};});
 const legacyExamInventory={structuredOfficial:[...officialRegistry.matchAll(/id: '(n[1-5]-\d{4}-(?:07|12)-exam-\d+)'/g)].length,pendingOfficial:[...legacyCatalog.matchAll(/'n([1-5])-(\d{4})-(07|12)'/g)].length,mockCatalog:5,historicalExplanationPacks,metadataOnly:true,reviewPolicy:'Detailed explanations and listening transcripts are hidden by the existing approved exam UI; pack presence is not runtime translation coverage.'};
 const report={generatedAt:new Date().toISOString(),baselineCommit:require('node:child_process').execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),locales,groups,dialogueInventory:{scenarioFiles,activeScenarios:allScenarios.size,allStoredDialogueFiles:dialogueFiles.length,missingScenarioFiles,legacyLevelFiles,completeNpcAndPlayerScenariosByLocale:completeScenarios,completeNpcAndPlayerScenariosAllLocales:completeAllLocales,effectiveTurns:'shared, otherwise N5; existing translations accepted only for matching source/speaker'},runtimeDataModulesChecked:Object.keys(a).length,originalExamInventory,legacyExamInventory,constructionSessions:a.k.sessions.length,constructionUniqueQuestions:tests.size,jmdict:{meaningLanguage:'en',source:'src/services/jmdict.ts: gloss_json and englishFtsQuery; no locale-specific gloss selection'},uiSourceFilesScanned:uiFiles.length,staticVietnameseCandidateLines:staticCandidates.length,missingLocaleUnits:missing.reduce((n,x)=>n+x.locales.length,0),unitsWithMissingTranslations:missing.length,limitations:['Coverage is presence and source-revision alignment, not native-language or domain certification.','Japanese JLPT test questions remain Japanese by design; translations are audited separately from the locked examination UI.','Missing construction/legacy/dialogue translations are reported, never counted as complete through an English fallback.','Legacy Kaigo practice/reference data is not counted as active translated weekly content.','Japanese-only portal previews and UI labels require separate authored locale copy; a static scan is not proof that every UI label is translated.','Static candidate lines may be valid Vietnamese locale tables or review-only metadata; they are leads, not proven runtime leaks.']};
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'coverage.csv'),[['group','units',...targets],...Object.entries(groups).map(([name,g])=>[name,g.units,...targets.map(l=>g.translated[l])])].map(row=>row.join(',')).join('\n')+'\n');fs.writeFileSync(path.join(out,'coverage.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(out,'missing.ndjson.gz'),require('node:zlib').gzipSync(missing.map(x=>JSON.stringify(x)).join('\n')+'\n'));fs.writeFileSync(path.join(out,'ui-candidates.json'),JSON.stringify(staticCandidates,null,2)+'\n');
 console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
