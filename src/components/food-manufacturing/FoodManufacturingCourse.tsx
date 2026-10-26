import JapaneseRuby from '@/components/world/JapaneseRuby';
import {FoodConceptDiagrams} from './ConceptDiagrams';
import {useEffect,useRef,useState,type PropsWithChildren} from 'react';
import {Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {useBackdropOcclusion} from '@/components/ui/AppBackdrop';
import {RoyalContentPanel,RoyalExplanationPanel} from '@/components/ui/RoyalPanels';
import {TokuteiHeader,TokuteiDayCard} from '@/components/tokutei/TokuteiChrome';
import {StudyAppearanceProvider,ReadingAppearanceControl,TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {foodManufacturingWeeks,foodManufacturingLesson,foodManufacturingChecks,foodManufacturingTranslation,foodManufacturingTermTranslation,foodManufacturingQuestionTranslation,foodManufacturingExamTitleTranslation,type FoodManufacturingLevel,type FoodManufacturingLesson,type FoodManufacturingExam} from '@/data/food-manufacturing';
import {foodManufacturingCompletionKey,foodManufacturingExamKey,restoreFoodManufacturingProgress,foodManufacturingLessonDone,freshTestAttempt,restoreTestAttempt,gradeTest,type FoodManufacturingProgress,type TestAttempt} from '@/services/food-manufacturing-study-state';
function Button({title,onPress,disabled=false,selected=false}:{title:string;onPress:()=>void;disabled?:boolean;selected?:boolean}) {
 const {colors}=useStudyAppearance();return <Pressable accessibilityRole="button" accessibilityState={{disabled,selected}} disabled={disabled} onPress={onPress} style={[s.button,{borderColor:colors.border,backgroundColor:selected?colors.translation:colors.background,opacity:disabled?.45:1}]}><Text style={{color:colors.text,fontSize:16,lineHeight:25,textAlign:'center'}}>{title}</Text></Pressable>;
}
function Surface({children,reading=false}:PropsWithChildren<{reading?:boolean}>) {
 useBackdropOcclusion(reading);const {colors}=useStudyAppearance(),i=useSafeAreaInsets();
 const body=<View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right}}>{children}</View>;
 return reading?<View style={{flex:1,backgroundColor:colors.background}}>{body}</View>:<RoyalPageBackground>{body}</RoyalPageBackground>;
}
export function FoodManufacturingCourse({learner,language,onBack}:{learner:string;language:string;onBack:()=>void}) {
 const [level,setLevel]=useState<FoodManufacturingLevel|null>(null);
 return <StudyAppearanceProvider>{level?<Course key={`${learner}:${level}`} learner={learner} language={language} level={level} onBack={()=>setLevel(null)}/>:<Surface><TokuteiHeader title="飲食料品製造業" onBack={onBack}/><ScrollView contentContainerStyle={s.content}><RoyalContentPanel style={s.panel}><Text style={s.heading}>学習する区分を選ぶ</Text><Text style={s.body}>学習内容は編集中の内部プレビューです。試験はアプリ独自の練習問題です。</Text>{(['1','2'] as const).map(l=><Button key={l} title={`特定技能${l}号`} onPress={()=>setLevel(l)}/>)}</RoyalContentPanel></ScrollView></Surface>}</StudyAppearanceProvider>;
}
function Course({learner,language,level,onBack}:{learner:string;language:string;level:FoodManufacturingLevel;onBack:()=>void}) {
 const [tab,setTab]=useState<'study'|'test'>('study'),[week,setWeek]=useState<number|null>(null),[lesson,setLesson]=useState<FoodManufacturingLesson|null>(null),[exam,setExam]=useState<FoodManufacturingExam|null>(null);
 const [progress,setProgress]=useState<FoodManufacturingProgress|null>(null),[error,setError]=useState(false),[saving,setSaving]=useState(false),[retry,setRetry]=useState(0);
 const live=useRef(true),busy=useRef(false),key=foodManufacturingCompletionKey(learner,level);
 useEffect(()=>{live.current=true;setProgress(null);setError(false);AsyncStorage.getItem(key).then(raw=>{if(!live.current)return;const p=restoreFoodManufacturingProgress(raw);if(p)setProgress(p);else setError(true);}).catch(()=>{if(live.current)setError(true);});return()=>{live.current=false;};},[key,retry]);
 const complete=async()=>{
  if(!progress||!lesson||busy.current)return;busy.current=true;setSaving(true);setError(false);
  const next:FoodManufacturingProgress={version:1,entries:{...progress.entries,[lesson.id]:lesson.sourceHash}};
  try{await AsyncStorage.setItem(key,JSON.stringify(next));if(live.current){setProgress(next);setLesson(null);}}catch{if(live.current)setError(true);}finally{busy.current=false;if(live.current)setSaving(false);}
 };
 if(exam)return <Attempt key={exam.id} learner={learner} level={level} exam={exam} language={language} onBack={()=>setExam(null)}/>;
 if(lesson)return <Reader key={lesson.id} lesson={lesson} language={language} saving={saving} saveError={error} onComplete={()=>{void complete();}} onBack={()=>setLesson(null)}/>;
 const weeks=foodManufacturingWeeks(level),selected=week===null?null:weeks[week];
 return <Surface><TokuteiHeader title={`飲食料品製造業 · ${level}号`} onBack={()=>{if(selected)setWeek(null);else onBack();}}/><ScrollView contentContainerStyle={s.content}>
 <View style={s.row}><Button title="学習" selected={tab==='study'} onPress={()=>setTab('study')}/><Button title="確認・模擬試験" selected={tab==='test'} onPress={()=>setTab('test')}/></View>
 {error&&!progress?<RoyalExplanationPanel style={s.panel}><Text style={s.body}>保存記録を読み込めませんでした。記録は上書きしていません。</Text><Button title="読み込みを再試行" onPress={()=>setRetry(n=>n+1)}/></RoyalExplanationPanel>:!progress?<Text style={s.body}>読み込み中…</Text>:tab==='test'?foodManufacturingChecks(level).map(e=><CheckCard key={e.id} learner={learner} level={level} exam={e} onPress={()=>setExam(e)}/>):selected?<><Text style={s.heading}>{selected.titleJa}</Text><Text style={s.body}>1日約30分 · 各日の学習を選んでください。</Text>{selected.lessonIds.map((id,i)=>{const l=foodManufacturingLesson(id,level);return l?<TokuteiDayCard key={id} testID={`food-day-${level}-${i+1}`} day={i+1} title={l.titleJa} done={foodManufacturingLessonDone(progress,l)} onPress={()=>{setError(false);setLesson(l);}}/>:null;})}</>:<View style={s.grid}>{weeks.map((w,i)=><View key={w.id} style={s.week}><Button title={`第${w.number}週\n${w.titleJa}`} onPress={()=>setWeek(i)}/></View>)}</View>}
 </ScrollView></Surface>;
}
function CheckCard({learner,level,exam,onPress}:{learner:string;level:FoodManufacturingLevel;exam:FoodManufacturingExam;onPress:()=>void}) {
 const [done,setDone]=useState(false);
 useEffect(()=>{let live=true;AsyncStorage.getItem(foodManufacturingExamKey(learner,level,exam.id)).then(raw=>{if(live)setDone(!!restoreTestAttempt(raw,exam)?.submitted);}).catch(()=>{});return()=>{live=false;};},[learner,level,exam]);
 return <RoyalContentPanel style={s.panel}><Text style={s.heading}>{exam.titleJa}</Text><Text style={s.body}>{exam.questions.length}問{done?' · ✓ 完了':''}</Text><Button title="開く・再開" onPress={onPress}/></RoyalContentPanel>;
}
function Reader({lesson,language,onBack,onComplete,saving,saveError}:{lesson:FoodManufacturingLesson;language:string;onBack:()=>void;onComplete:()=>void;saving:boolean;saveError:boolean}) {
 const [show,setShow]=useState(false),{colors}=useStudyAppearance(),t=foodManufacturingTranslation(lesson,language);
 return <Surface reading><TokuteiHeader title={lesson.titleJa} onBack={()=>{if(!saving)onBack();}}/><ScrollView contentContainerStyle={s.content}>
 <ReadingAppearanceControl/>{language!=='ja'&&<Button title={show?'訳を隠す':'訳を表示'} onPress={()=>setShow(v=>!v)}/>}
 {show&&language!=='ja'&&!t&&<TranslationText>この言語の訳は準備中です。</TranslationText>}
 <Text style={[s.body,{color:colors.text}]}>{lesson.objectiveJa}</Text>{show&&t&&<TranslationText>{t.title}{'\n'}{t.objective}</TranslationText>}
 {lesson.paragraphs.map(p=><View key={p.id} style={[s.section,{borderColor:colors.border}]}><Text style={[s.heading,{color:colors.text}]}>{p.titleJa}</Text><Text selectable style={[s.body,{color:colors.text}]}>{p.textJa}</Text>{show&&t&&<TranslationText>{t.paragraphTitles[p.id]}{'\n'}{t.paragraphs[p.id]}</TranslationText>}</View>)}
 
 <FoodConceptDiagrams lessonId={lesson.id} textColor={colors.text} language={language} showTranslation={show}/><Text style={[s.heading,{color:colors.text}]}>要点</Text><Text style={[s.body,{color:colors.text}]}>{lesson.summaryJa}</Text>{show&&t&&<TranslationText>{t.summary}</TranslationText>}<Text style={[s.heading,{color:colors.text}]}>用語</Text>{lesson.terms.map(term=><View key={term.ja} style={{alignSelf:'flex-start'}}><JapaneseRuby text={term.ja} segments={[{text:term.ja,reading:term.reading}]} color={colors.text} readingColor={colors.muted}/>{show&&(t?.terms?.[term.ja]||foodManufacturingTermTranslation(term.ja,language))&&<TranslationText>{t?.terms?.[term.ja]||foodManufacturingTermTranslation(term.ja,language)}</TranslationText>}</View>)}
 <Text style={[s.heading,{color:colors.text}]}>整理して説明する</Text><Text style={[s.body,{color:colors.text}]}>{lesson.activityJa}</Text>{show&&t&&<TranslationText>{t.activity}</TranslationText>}
 {saveError&&<Text accessibilityRole="alert" style={[s.body,{color:colors.text}]}>完了を保存できませんでした。もう一度お試しください。</Text>}
 <Button title={saving?'保存中…':'完了する'} disabled={saving} onPress={onComplete}/>
 </ScrollView></Surface>;
}
function Attempt({learner,level,exam,language,onBack}:{learner:string;level:FoodManufacturingLevel;exam:FoodManufacturingExam;language:string;onBack:()=>void}) {
 const [showTranslation,setShowTranslation]=useState(false);
 const [attempt,setAttempt]=useState<TestAttempt|null>(null),[error,setError]=useState<'read'|'invalid'|'write'|null>(null),[saving,setSaving]=useState(false),[confirm,setConfirm]=useState<'submit'|'restart'|'leave'|'reset'|null>(null),[retry,setRetry]=useState(0);
 const live=useRef(true),queue=useRef(Promise.resolve()),latest=useRef<TestAttempt|null>(null),serial=useRef(0),{colors}=useStudyAppearance(),key=foodManufacturingExamKey(learner,level,exam.id);
 useEffect(()=>{live.current=true;setAttempt(null);setError(null);AsyncStorage.getItem(key).then(raw=>{if(!live.current)return;const a=restoreTestAttempt(raw,exam);if(a){setAttempt(a);latest.current=a;}else setError('invalid');}).catch(()=>{if(live.current)setError('read');});return()=>{live.current=false;};},[key,exam,retry]);
 const persist=(next:TestAttempt)=>{
  latest.current=next;setAttempt(next);setSaving(true);const n=++serial.current;
  queue.current=queue.current.catch(()=>{}).then(()=>AsyncStorage.setItem(key,JSON.stringify(next))).then(()=>{if(live.current&&n===serial.current){setSaving(false);setError(null);}}).catch(()=>{if(live.current&&n===serial.current){setSaving(false);setError('write');}});
 };
 const q=attempt?exam.questions[attempt.currentQuestion]:null,t=q?foodManufacturingQuestionTranslation(q,language):null,translatedTitle=foodManufacturingExamTitleTranslation(exam,language),result=attempt?gradeTest(exam,attempt.answers):null;
 return <Surface reading><TokuteiHeader title={exam.titleJa} onBack={()=>{if(saving)return;if(error==='write')setConfirm('leave');else onBack();}}/><ScrollView contentContainerStyle={s.content}>
 {!attempt?<><Text style={[s.body,{color:colors.text}]}>{error==='invalid'?'保存記録の内容が現在の問題と一致しません。記録は上書きしていません。':error?'保存記録を読み込めませんでした。':'読み込み中…'}</Text>{error&&<Button title="読み込みを再試行" onPress={()=>setRetry(n=>n+1)}/ >}{error==='invalid'&&<Button title="この試験の記録を初期化" onPress={()=>setConfirm('reset')}/>}</>:q&&<>
 {error==='write'&&<><Text accessibilityRole="alert" style={[s.body,{color:colors.text}]}>回答を保存できませんでした。</Text><Button title="保存を再試行" disabled={saving} onPress={()=>{if(latest.current)persist(latest.current);}}/></>}
 {language!=='ja'&&<Button title={showTranslation?'訳を隠す':'訳を表示'} onPress={()=>setShowTranslation(v=>!v)}/>}
 {showTranslation&&translatedTitle&&<TranslationText>{translatedTitle}</TranslationText>}
 {showTranslation&&language!=='ja'&&!t&&<TranslationText>この言語の問題訳は準備中です。</TranslationText>}
 {attempt.submitted&&result&&<Text style={[s.heading,{color:colors.text}]}>正解 {result.correct} / {result.total} · 未回答 {result.unanswered}</Text>}
 <Text style={[s.body,{color:colors.text}]}>{attempt.currentQuestion+1} / {exam.questions.length}</Text><Text style={[s.heading,{color:colors.text}]}>{q.stemJa}</Text>{showTranslation&&t&&<TranslationText>{t.prompt}</TranslationText>}
 {q.optionsJa.map((text,i)=><View key={i}><Button title={`${i+1}. ${text}`} selected={attempt.answers[attempt.currentQuestion]===i} disabled={attempt.submitted} onPress={()=>{const current=latest.current??attempt;const answers=[...current.answers];answers[current.currentQuestion]=i;persist({...current,answers});}}/>{showTranslation&&t&&<TranslationText>{t.options[i]}</TranslationText>}</View>)}
 {attempt.submitted&&<View><Text style={[s.body,{color:colors.text}]}>正解：{q.correctIndex+1}</Text><Text style={[s.body,{color:colors.text}]}>{q.explanationJa}</Text>{showTranslation&&t&&<TranslationText>{t.explanation}</TranslationText>}{q.optionReasonsJa.map((why,i)=><View key={i}><Text style={[s.body,{color:colors.text}]}>{i+1}. {why}</Text>{showTranslation&&t&&<TranslationText>{t.optionExplanations[i]}</TranslationText>}</View>)}</View>}
 <View style={s.row}><Button title="前へ" disabled={attempt.currentQuestion===0} onPress={()=>persist({...(latest.current??attempt),currentQuestion:Math.max(0,(latest.current??attempt).currentQuestion-1)})}/><Button title="次へ" disabled={attempt.currentQuestion===exam.questions.length-1} onPress={()=>persist({...(latest.current??attempt),currentQuestion:Math.min(exam.questions.length-1,(latest.current??attempt).currentQuestion+1)})}/></View>
 <Button title={attempt.submitted?'もう一度解く':saving?'保存中…':'提出する'} disabled={saving||error==='write'} onPress={()=>setConfirm(attempt.submitted?'restart':'submit')}/>
 </>}
 </ScrollView><Modal visible={confirm!==null} transparent animationType="none" onRequestClose={()=>setConfirm(null)}><View style={s.modal}><View style={[s.dialog,{backgroundColor:colors.background}]}><Text style={[s.body,{color:colors.text}]}>{confirm==='reset'?'保存済みのこの試験の記録を消して、最初から始めますか。':confirm==='leave'?'保存できていない回答があります。保存せずに戻りますか。':confirm==='restart'?'この確認問題を最初から解き直しますか。':`提出しますか。未回答：${attempt?.answers.filter(a=>a===null).length??0}問`}</Text><Button title="キャンセル" onPress={()=>setConfirm(null)}/><Button title="確定" onPress={()=>{if(confirm==='leave'){setConfirm(null);onBack();return;}if(confirm==='reset')persist(freshTestAttempt(exam));else if(attempt)persist(confirm==='restart'?freshTestAttempt(exam):{...(latest.current??attempt),submitted:true});setConfirm(null);}}/></View></View></Modal></Surface>;
}
const s=StyleSheet.create({content:{padding:16,paddingBottom:36,gap:12},panel:{padding:24},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#302c26'},body:{fontSize:17,lineHeight:29,color:'#302c26'},button:{paddingHorizontal:15,paddingVertical:12,borderWidth:1,borderRadius:8,marginVertical:5,minHeight:48},row:{flexDirection:'row',flexWrap:'wrap',gap:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},week:{minWidth:200,flex:1},section:{paddingVertical:14,borderTopWidth:1,gap:8},diagram:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:12,gap:8,backgroundColor:'#f1e7cb',borderRadius:10},stage:{padding:14,borderRadius:8,minWidth:70,justifyContent:'center'},modal:{flex:1,backgroundColor:'#0008',justifyContent:'center',padding:24},dialog:{padding:24,borderRadius:12,width:'100%',maxWidth:560,alignSelf:'center'}});
