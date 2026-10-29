import {AgricultureExamIllustration,hasAgricultureExamIllustration} from './AgricultureExamIllustration';
import {ConceptDiagrams} from './ConceptDiagrams';
import {RecognitionImages,hasRecognitionImage} from './RecognitionImages';
import {useEffect,useRef,useState,type PropsWithChildren} from 'react';
import {Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {useBackdropOcclusion} from '@/components/ui/AppBackdrop';
import {RoyalContentPanel,RoyalExplanationPanel} from '@/components/ui/RoyalPanels';
import {TokuteiHeader,TokuteiDayCard} from '@/components/tokutei/TokuteiChrome';
import {StudyAppearanceProvider,ReadingAppearanceControl,TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {agricultureWeeks,agricultureLesson,agricultureChecks,agricultureTranslation,type AgricultureLevel,type AgricultureLesson,type AgricultureExam} from '@/data/agriculture';
import {agricultureCompletionKey,agricultureExamKey,restoreAgricultureProgress,agricultureLessonDone,freshTestAttempt,restoreTestAttempt,gradeTest,type AgricultureProgress,type TestAttempt} from '@/services/agriculture-study-state';
function Button({title,onPress,disabled=false,selected=false}:{title:string;onPress:()=>void;disabled?:boolean;selected?:boolean}) {
 const {colors}=useStudyAppearance();return <Pressable accessibilityRole="button" accessibilityState={{disabled,selected}} disabled={disabled} onPress={onPress} style={[s.button,{borderColor:colors.border,backgroundColor:selected?colors.translation:colors.background,opacity:disabled?.45:1}]}><Text style={{color:colors.text,fontSize:16,lineHeight:25,textAlign:'center'}}>{title}</Text></Pressable>;
}
function Surface({children,reading=false}:PropsWithChildren<{reading?:boolean}>) {
 useBackdropOcclusion(reading);const {colors}=useStudyAppearance(),i=useSafeAreaInsets();
 const body=<View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right}}>{children}</View>;
 return reading?<View style={{flex:1,backgroundColor:colors.background}}>{body}</View>:<RoyalPageBackground>{body}</RoyalPageBackground>;
}
function RiceProcess() {
 return <View accessibilityLabel="もみからもみ殻を取り除くと玄米になり、精米すると白米になります。" style={s.diagram}>
 {['もみ','もみ殻を除く →','玄米','精米する →','白米'].map((name,i)=><View key={name} style={[s.stage,{backgroundColor:i%2===0?['#e5be6f','#ead0a0','#fff8e6'][i/2]:'transparent'}]}><Text style={{fontSize:16,color:'#302c26',textAlign:'center'}}>{name}</Text></View>)}
 </View>;
}
function OrgansDiagram() {
 return <View style={s.diagram} accessibilityLabel="栄養器官は葉・茎・根、生殖器官は花・果実です。">
 {[["栄養器官","葉 · 茎 · 根"],["生殖器官","花 · 果実"]].map(([title,items])=><View key={title} style={[s.stage,{backgroundColor:title==='栄養器官'?'#d6e6ba':'#f1cfbb',minWidth:130}]}><Text style={{color:'#302c26',fontSize:17,fontWeight:'700'}}>{title}</Text><Text style={{color:'#302c26',fontSize:17,lineHeight:30}}>{items}</Text></View>)}
 </View>;
}
function SowingDiagram() {
 return <View style={[s.diagram,{alignItems:'stretch'}]} accessibilityLabel="ばらまきはうね全体、すじまきは列、点まきは一か所に数粒ずつ。図は模式図で、実際の間隔を示しません。">
 {(['ばらまき','すじまき','点まき'] as const).map((name,index)=><View key={name} style={[s.stage,{backgroundColor:'#e7d7b4',minWidth:120}]}><Text style={{color:'#302c26',textAlign:'center',fontSize:17}}>{name}</Text><View style={{height:110,width:100,alignSelf:'center',position:'relative',marginVertical:10}}>
 {Array.from({length:12},(_,i)=>{const col=i%3,row=Math.floor(i/3);const x=index===0?8+((i*23)%78):index===1?45:15+col*6;const y=index===0?8+Math.floor(i/3)*24: index===1?i*8:10+row*27+(col%2)*4;return <View key={i} style={{position:'absolute',left:x,top:y,width:5,height:5,borderRadius:3,backgroundColor:'#654420'}}/>;})}</View></View>)}
 <Text style={{color:'#302c26',fontSize:14}}>模式図 · 実際の間隔や粒数の指定ではありません</Text>
 </View>;
}
export function AgricultureCourse({learner,language,onBack}:{learner:string;language:string;onBack:()=>void}) {
 const [level,setLevel]=useState<AgricultureLevel|null>(null);
 return <StudyAppearanceProvider>{level?<Course key={`${learner}:${level}`} learner={learner} language={language} level={level} onBack={()=>setLevel(null)}/>:<Surface><TokuteiHeader title="農業 · 耕種農業" onBack={onBack}/><ScrollView contentContainerStyle={s.content}><RoyalContentPanel style={s.panel}><Text style={s.heading}>学習する区分を選ぶ</Text><Text style={s.body}>学習内容は順次追加しています。</Text>{(['1','2'] as const).map(l=><Button key={l} title={`特定技能${l}号`} onPress={()=>setLevel(l)}/>)}</RoyalContentPanel></ScrollView></Surface>}</StudyAppearanceProvider>;
}
function Course({learner,language,level,onBack}:{learner:string;language:string;level:AgricultureLevel;onBack:()=>void}) {
 const [tab,setTab]=useState<'study'|'test'|'mock'>('study'),[week,setWeek]=useState<number|null>(null),[lesson,setLesson]=useState<AgricultureLesson|null>(null),[exam,setExam]=useState<AgricultureExam|null>(null);
 const [progress,setProgress]=useState<AgricultureProgress|null>(null),[error,setError]=useState(false),[saving,setSaving]=useState(false),[retry,setRetry]=useState(0);
 const live=useRef(true),busy=useRef(false),key=agricultureCompletionKey(learner,level);
 useEffect(()=>{live.current=true;setProgress(null);setError(false);AsyncStorage.getItem(key).then(raw=>{if(!live.current)return;const p=restoreAgricultureProgress(raw);if(p)setProgress(p);else setError(true);}).catch(()=>{if(live.current)setError(true);});return()=>{live.current=false;};},[key,retry]);
 const complete=async()=>{
  if(!progress||!lesson||busy.current)return;busy.current=true;setSaving(true);setError(false);
  const next:AgricultureProgress={version:1,entries:{...progress.entries,[lesson.id]:lesson.sourceHash}};
  try{await AsyncStorage.setItem(key,JSON.stringify(next));if(live.current){setProgress(next);setLesson(null);}}catch{if(live.current)setError(true);}finally{busy.current=false;if(live.current)setSaving(false);}
 };
 if(exam)return <Attempt key={exam.id} learner={learner} level={level} exam={exam} onBack={()=>setExam(null)}/>;
 if(lesson)return <Reader key={lesson.id} level={level} lesson={lesson} language={language} saving={saving} saveError={error} onComplete={()=>{void complete();}} onBack={()=>setLesson(null)}/>;
 const weeks=agricultureWeeks(level),selected=week===null?null:weeks[week],tests=agricultureChecks(level,tab==='mock'?'mock':'weekly');
 return <Surface><TokuteiHeader title={`耕種農業 · ${level}号`} onBack={()=>{if(selected)setWeek(null);else onBack();}}/><ScrollView contentContainerStyle={s.content}>
 <View style={s.row}><Button title="学習" selected={tab==='study'} onPress={()=>setTab('study')}/><Button title="週の確認" selected={tab==='test'} onPress={()=>setTab('test')}/><Button title="総合練習" selected={tab==='mock'} onPress={()=>setTab('mock')}/></View>
 {error&&!progress?<RoyalExplanationPanel style={s.panel}><Text style={s.body}>保存記録を読み込めませんでした。記録は上書きしていません。</Text><Button title="読み込みを再試行" onPress={()=>setRetry(n=>n+1)}/></RoyalExplanationPanel>:!progress?<Text style={s.body}>読み込み中…</Text>:tab!=='study'?<>{tab==='mock'&&<Text style={s.body}>アプリ独自の総合練習です。公式試験の構成・制限時間・合格判定とは異なります。</Text>}{tests.length?tests.map(e=><CheckCard key={e.id} learner={learner} level={level} exam={e} onPress={()=>setExam(e)}/>):<Text style={s.body}>この区分の総合練習は準備中です。</Text>}</>:selected?<><Text style={s.heading}>{selected.titleJa}</Text>{selected.lessonIds.map((id,i)=>{const l=agricultureLesson(id,level);return l?<TokuteiDayCard key={id} testID={`agri-day-${level}-${i+1}`} day={i+1} title={l.titleJa} done={agricultureLessonDone(progress,l)} onPress={()=>{setError(false);setLesson(l);}}/>:null;})}</>:<View style={s.grid}>{weeks.map((w,i)=><View key={w.id} style={s.week}><Button title={`第${w.number}週\n${w.titleJa}`} onPress={()=>setWeek(i)}/></View>)}</View>}
 </ScrollView></Surface>;
}
function CheckCard({learner,level,exam,onPress}:{learner:string;level:AgricultureLevel;exam:AgricultureExam;onPress:()=>void}) {
 const [done,setDone]=useState(false);
 useEffect(()=>{let live=true;AsyncStorage.getItem(agricultureExamKey(learner,level,exam.id)).then(raw=>{if(live)setDone(!!restoreTestAttempt(raw,exam)?.submitted);}).catch(()=>{});return()=>{live=false;};},[learner,level,exam]);
 return <RoyalContentPanel style={s.panel}><Text style={s.heading}>{exam.titleJa}</Text><Text style={s.body}>{exam.questions.length}問{done?' · ✓ 完了':''}</Text><Button title="開く・再開" onPress={onPress}/></RoyalContentPanel>;
}
function Reader({lesson,language,onBack,onComplete,saving,saveError,level}:{level:AgricultureLevel;lesson:AgricultureLesson;language:string;onBack:()=>void;onComplete:()=>void;saving:boolean;saveError:boolean}) {
 const [show,setShow]=useState(false),{colors}=useStudyAppearance(),t=agricultureTranslation(lesson,language);
 return <Surface reading><TokuteiHeader title={lesson.titleJa} onBack={()=>{if(!saving)onBack();}}/><ScrollView contentContainerStyle={s.content}>
 <ReadingAppearanceControl/>{language!=='ja'&&<Button title={show?'訳を隠す':'訳を表示'} onPress={()=>setShow(v=>!v)}/>}
 {show&&language!=='ja'&&!t&&<TranslationText>この言語の訳は準備中です。</TranslationText>}
 <Text style={[s.body,{color:colors.text}]}>{lesson.objectiveJa}</Text>{show&&t&&<TranslationText>{t.title}{'\n'}{t.objective}</TranslationText>}
 {lesson.paragraphs.map(p=><View key={p.id} style={[s.section,{borderColor:colors.border}]}><Text style={[s.heading,{color:colors.text}]}>{p.titleJa}</Text><Text selectable style={[s.body,{color:colors.text}]}>{p.textJa}</Text>{show&&t&&<TranslationText>{t.paragraphTitles[p.id]}{'\n'}{t.paragraphs[p.id]}</TranslationText>}</View>)}
 {lesson.id==='agr-rice'&&<RiceProcess/>}{lesson.id==='agr-organs'&&<OrgansDiagram/>}{lesson.id==='agr-sowing-design'&&!hasRecognitionImage(lesson.id,lesson.sourceHash,'sowing-patterns',level)&&<SowingDiagram/>}<ConceptDiagrams lessonId={lesson.id} colors={colors} level={level}/>
 <RecognitionImages lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} colors={colors} level={level}/>
 <Text style={[s.heading,{color:colors.text}]}>用語</Text>{lesson.terms.map(term=><Text key={term.ja} style={[s.body,{color:colors.text}]}>{term.ja}（{term.reading}）</Text>)}
 <Text style={[s.heading,{color:colors.text}]}>整理して説明する</Text><Text style={[s.body,{color:colors.text}]}>{lesson.activityJa}</Text>{show&&t&&<TranslationText>{t.activity}</TranslationText>}
 {saveError&&<Text accessibilityRole="alert" style={[s.body,{color:colors.text}]}>完了を保存できませんでした。もう一度お試しください。</Text>}
 <Button title={saving?'保存中…':'完了する'} disabled={saving} onPress={onComplete}/>
 </ScrollView></Surface>;
}
function Attempt({learner,level,exam,onBack}:{learner:string;level:AgricultureLevel;exam:AgricultureExam;onBack:()=>void}) {
 const [attempt,setAttempt]=useState<TestAttempt|null>(null),[error,setError]=useState<'read'|'invalid'|'write'|null>(null),[saving,setSaving]=useState(false),[confirm,setConfirm]=useState<'submit'|'restart'|'leave'|null>(null),[retry,setRetry]=useState(0);
 const live=useRef(true),queue=useRef(Promise.resolve()),latest=useRef<TestAttempt|null>(null),serial=useRef(0),{colors}=useStudyAppearance(),key=agricultureExamKey(learner,level,exam.id);
 useEffect(()=>{live.current=true;setAttempt(null);setError(null);AsyncStorage.getItem(key).then(raw=>{if(!live.current)return;const a=restoreTestAttempt(raw,exam);if(a){setAttempt(a);latest.current=a;}else setError('invalid');}).catch(()=>{if(live.current)setError('read');});return()=>{live.current=false;};},[key,exam,retry]);
 const persist=(next:TestAttempt)=>{
  latest.current=next;setAttempt(next);setSaving(true);const n=++serial.current;
  queue.current=queue.current.catch(()=>{}).then(()=>AsyncStorage.setItem(key,JSON.stringify(next))).then(()=>{if(live.current&&n===serial.current){setSaving(false);setError(null);}}).catch(()=>{if(live.current&&n===serial.current){setSaving(false);setError('write');}});
 };
 const q=attempt?exam.questions[attempt.currentQuestion]:null,result=attempt?gradeTest(exam,attempt.answers):null;
 const figureReady=!q?.illustrationId||hasAgricultureExamIllustration(q.illustrationId,q.illustrationRevision,level);
 return <Surface reading><TokuteiHeader title={exam.titleJa} onBack={()=>{if(saving)return;if(error==='write')setConfirm('leave');else onBack();}}/><ScrollView contentContainerStyle={s.content}>
 {!attempt?<><Text style={[s.body,{color:colors.text}]}>{error==='invalid'?'保存記録の内容が現在の問題と一致しません。記録は上書きしていません。':error?'保存記録を読み込めませんでした。':'読み込み中…'}</Text>{error&&<Button title="読み込みを再試行" onPress={()=>setRetry(n=>n+1)}/>}</>:q&&<>
 {error==='write'&&<><Text accessibilityRole="alert" style={[s.body,{color:colors.text}]}>回答を保存できませんでした。</Text><Button title="保存を再試行" disabled={saving} onPress={()=>{if(latest.current)persist(latest.current);}}/></>}
 {attempt.submitted&&result&&<Text style={[s.heading,{color:colors.text}]}>正解 {result.correct} / {result.total} · 未回答 {result.unanswered}</Text>}
 <Text style={[s.body,{color:colors.text}]}>{attempt.currentQuestion+1} / {exam.questions.length}</Text><Text style={[s.heading,{color:colors.text}]}>{q.stemJa}</Text>
 {q.illustrationId&&<AgricultureExamIllustration id={q.illustrationId} revision={q.illustrationRevision} level={level} colors={colors}/>}
 {q.optionsJa.map((text,i)=><Button key={i} title={`${i+1}. ${text}`} selected={attempt.answers[attempt.currentQuestion]===i} disabled={attempt.submitted||!figureReady} onPress={()=>{const answers=[...attempt.answers];answers[attempt.currentQuestion]=i;persist({...attempt,answers});}}/>)}
 {attempt.submitted&&<View><Text style={[s.body,{color:colors.text}]}>正解：{q.correctIndex+1}</Text>{q.optionReasonsJa.map((why,i)=><Text key={i} style={[s.body,{color:colors.text}]}>{i+1}. {why}</Text>)}</View>}
 <View style={s.row}><Button title="前へ" disabled={attempt.currentQuestion===0} onPress={()=>persist({...attempt,currentQuestion:attempt.currentQuestion-1})}/><Button title="次へ" disabled={attempt.currentQuestion===exam.questions.length-1} onPress={()=>persist({...attempt,currentQuestion:attempt.currentQuestion+1})}/></View>
 <Button title={attempt.submitted?'もう一度解く':saving?'保存中…':'提出する'} disabled={saving||error==='write'||!figureReady} onPress={()=>setConfirm(attempt.submitted?'restart':'submit')}/>
 </>}
 </ScrollView><Modal visible={confirm!==null} transparent animationType="none" onRequestClose={()=>setConfirm(null)}><View style={s.modal}><View style={[s.dialog,{backgroundColor:colors.background}]}><Text style={[s.body,{color:colors.text}]}>{confirm==='leave'?'保存できていない回答があります。保存せずに戻りますか。':confirm==='restart'?'この確認問題を最初から解き直しますか。':`提出しますか。未回答：${attempt?.answers.filter(a=>a===null).length??0}問`}</Text><Button title="キャンセル" onPress={()=>setConfirm(null)}/><Button title="確定" onPress={()=>{if(confirm==='leave'){setConfirm(null);onBack();return;}if(attempt)persist(confirm==='restart'?freshTestAttempt(exam):{...attempt,submitted:true});setConfirm(null);}}/></View></View></Modal></Surface>;
}
const s=StyleSheet.create({content:{padding:16,paddingBottom:36,gap:12},panel:{padding:24},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#302c26'},body:{fontSize:17,lineHeight:29,color:'#302c26'},button:{paddingHorizontal:15,paddingVertical:12,borderWidth:1,borderRadius:8,marginVertical:5,minHeight:48},row:{flexDirection:'row',flexWrap:'wrap',gap:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},week:{minWidth:200,flex:1},section:{paddingVertical:14,borderTopWidth:1,gap:8},diagram:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',padding:12,gap:8,backgroundColor:'#f1e7cb',borderRadius:10},stage:{padding:14,borderRadius:8,minWidth:70,justifyContent:'center'},modal:{flex:1,backgroundColor:'#0008',justifyContent:'center',padding:24},dialog:{padding:24,borderRadius:12,width:'100%',maxWidth:560,alignSelf:'center'}});
