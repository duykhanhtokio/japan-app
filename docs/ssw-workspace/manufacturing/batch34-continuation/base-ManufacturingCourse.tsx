import {createContext,useContext,useEffect,useRef,useState,type PropsWithChildren} from 'react';
import {Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {useBackdropOcclusion} from '@/components/ui/AppBackdrop';
import {RoyalContentPanel,RoyalExplanationPanel} from '@/components/ui/RoyalPanels';
import {TokuteiHeader,TokuteiDayCard} from '@/components/tokutei/TokuteiChrome';
import {StudyAppearanceProvider,ReadingAppearanceControl,TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {ManufacturingDiagram} from './ManufacturingDiagram';
import {ManufacturingMocks} from './ManufacturingMocks';
import {useManufacturingBack} from './useManufacturingBack';
import {manufacturingSourceGuides,manufacturingSourceGuidesLabel,manufacturingSourceGuideTranslation} from '@/data/manufacturing/source-guides';
import {manufacturingMockUi} from '@/data/manufacturing/mock-ui';
import {manufacturingTranslation,manufacturingQuestionTranslation} from '@/data/manufacturing/translations';
import {manufacturingSupplementExams,manufacturingSupplementTranslation} from '@/data/manufacturing/supplement-practice';
import {manufacturingUi} from '@/data/manufacturing/ui';
import {manufacturingSpecialties,loadManufacturingCourse,type Specialty,type ManufacturingLesson,type ManufacturingExam} from '@/data/manufacturing';
import {manufacturingCompletionKey,manufacturingExamKey,restoreManufacturingProgress,manufacturingLessonDone,freshTestAttempt,restoreTestAttempt,gradeTest,type ManufacturingProgress,type TestAttempt} from '@/services/manufacturing-study-state';
const LocaleContext=createContext('ja');
function useLabels(){const locale=useContext(LocaleContext);return (key:Parameters<typeof manufacturingUi>[1])=>manufacturingUi(locale,key);}
function Button({title,onPress,disabled=false,selected=false}:{title:string;onPress:()=>void;disabled?:boolean;selected?:boolean}){
 const {colors}=useStudyAppearance();return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled,selected}} disabled={disabled} onPress={onPress} style={[s.button,{borderColor:colors.border,backgroundColor:selected?colors.translation:colors.background,opacity:disabled?.45:1}]}><Text style={{color:colors.text,fontSize:16,lineHeight:25,textAlign:'center'}}>{title}</Text></Pressable>;
}
function Surface({children,reading=false}:PropsWithChildren<{reading?:boolean}>){
 useBackdropOcclusion(reading);const {colors}=useStudyAppearance(),i=useSafeAreaInsets();
 const body=<View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right}}>{children}</View>;
 return reading?<View style={{flex:1,backgroundColor:colors.background}}>{body}</View>:<RoyalPageBackground>{body}</RoyalPageBackground>;
}
export function ManufacturingCourse({learner,language,onBack}:{learner:string;language:string;onBack:()=>void}){
 const t=(key:Parameters<typeof manufacturingUi>[1])=>manufacturingUi(language,key);
 const [specialty,setSpecialty]=useState<Specialty|null>(null);
 useManufacturingBack(onBack,specialty===null);
 return <LocaleContext.Provider value={language}><StudyAppearanceProvider>{specialty?<Course key={`${learner}:${specialty}`} learner={learner} language={language} specialty={specialty} onBack={()=>setSpecialty(null)}/>:<Surface><TokuteiHeader title="製造分野 · 特定技能1号" onBack={onBack}/><ScrollView contentContainerStyle={s.content}><RoyalContentPanel style={s.panel}><Text style={s.heading}>{t('chooseSpecialty')}</Text><Text style={s.body}>{t('previewNotice')}</Text>{manufacturingSpecialties.map(item=><Button key={item.id} title={item.titleJa} onPress={()=>setSpecialty(item.id as Specialty)}/>)}</RoyalContentPanel></ScrollView></Surface>}</StudyAppearanceProvider></LocaleContext.Provider>;
}
function Course({learner,language,specialty,onBack}:{learner:string;language:string;specialty:Specialty;onBack:()=>void}){
 const t=useLabels();
 const [course]=useState(()=>{const core=loadManufacturingCourse(specialty);return {...core,checks:[...core.checks,...manufacturingSupplementExams(specialty)]};});
 const info=manufacturingSpecialties.find(i=>i.id===specialty)!;
 const [tab,setTab]=useState<'study'|'test'|'mock'>('study'),[week,setWeek]=useState<number|null>(null),[lesson,setLesson]=useState<ManufacturingLesson|null>(null),[exam,setExam]=useState<ManufacturingExam|null>(null);
 const [progress,setProgress]=useState<ManufacturingProgress|null>(null),[error,setError]=useState(false),[saving,setSaving]=useState(false),[retry,setRetry]=useState(0);
 const live=useRef(true),busy=useRef(false),key=manufacturingCompletionKey(learner,specialty);
 useEffect(()=>{live.current=true;setProgress(null);setError(false);AsyncStorage.getItem(key).then(raw=>{if(!live.current)return;const p=restoreManufacturingProgress(raw);if(p)setProgress(p);else setError(true);}).catch(()=>{if(live.current)setError(true);});return()=>{live.current=false;};},[key,retry]);
 const complete=async()=>{if(!progress||!lesson||busy.current)return;busy.current=true;setSaving(true);setError(false);const next:ManufacturingProgress={version:1,entries:{...progress.entries,[lesson.id]:lesson.sourceHash}};try{await AsyncStorage.setItem(key,JSON.stringify(next));if(live.current){setProgress(next);setLesson(null);}}catch{if(live.current)setError(true);}finally{busy.current=false;if(live.current)setSaving(false);}};
 const back=()=>{if(lesson){if(!saving)setLesson(null);}else if(week!==null)setWeek(null);else onBack();};
 useManufacturingBack(back,tab!=='mock'&&exam===null);
 if(tab==='mock')return <ManufacturingMocks learner={learner} specialty={specialty} language={language} onBack={()=>setTab('study')}/>;
 if(exam)return <Attempt key={exam.id} learner={learner} specialty={specialty} exam={exam} onBack={()=>setExam(null)}/>;
 if(lesson)return <Reader key={lesson.id} lesson={lesson} language={language} saving={saving} saveError={error} onComplete={()=>{void complete();}} onBack={back}/>;
 const guides=manufacturingSourceGuides(specialty);
 const selected=week===null?null:info.weeks[week];
 return <Surface><TokuteiHeader title={`${info.titleJa} · 1号`} onBack={back}/><ScrollView contentContainerStyle={s.content}>
 <View style={s.row}><Button title={t('study')} selected={tab==='study'} onPress={()=>setTab('study')}/><Button title={t('weeklyChecks')} selected={tab==='test'} onPress={()=>setTab('test')}/><Button title={manufacturingMockUi(language,'mockExams')} onPress={()=>setTab('mock')}/></View>
 {progress&&tab==='study'&&!selected&&guides.length>0&&<RoyalContentPanel style={s.panel}><Text style={s.heading}>{manufacturingSourceGuidesLabel(language)}</Text>{guides.map(guide=><Button key={guide.id} title={guide.titleJa} onPress={()=>{setError(false);setLesson(guide);}}/>)}</RoyalContentPanel>}
 {error&&!progress?<RoyalExplanationPanel style={s.panel}><Text style={s.body}>{t('readError')}</Text><Button title={t('retry')} onPress={()=>setRetry(n=>n+1)}/></RoyalExplanationPanel>:!progress?<Text style={s.body}>{t('loading')}</Text>:tab==='test'?<><Text style={s.body}>{t('practiceNotice')}</Text>{course.checks.map(e=><CheckCard key={e.id} learner={learner} specialty={specialty} exam={e} onPress={()=>setExam(e)}/>)}</>:selected?<><Text style={s.heading}>{selected.titleJa}</Text><View style={s.grid}>{Array.from({length:7},(_,day)=>{const id=selected.lessonIds[day],l=course.lessons.find(l=>l.id===id);return l?<View key={day} style={s.day}><TokuteiDayCard testID={`mfg-day-${specialty}-${day+1}`} day={day+1} title={l.titleJa} done={manufacturingLessonDone(progress,l)} onPress={()=>{setError(false);setLesson(l);}}/></View>:<View key={day} style={[s.day,s.empty]}><Text style={s.body}>—</Text></View>;})}</View></>:<View style={s.grid}>{info.weeks.map((w,i)=><View key={w.id} style={s.week}><Button title={`第${w.number}週\n${w.titleJa}`} onPress={()=>setWeek(i)}/></View>)}</View>}
 </ScrollView></Surface>;
}
function CheckCard({learner,specialty,exam,onPress}:{learner:string;specialty:Specialty;exam:ManufacturingExam;onPress:()=>void}){
 const t=useLabels();
 const [done,setDone]=useState(false);useEffect(()=>{let live=true;AsyncStorage.getItem(manufacturingExamKey(learner,specialty,exam.id)).then(raw=>{if(live)setDone(!!restoreTestAttempt(raw,exam)?.submitted);}).catch(()=>{});return()=>{live=false;};},[learner,specialty,exam]);
 return <RoyalContentPanel style={s.panel}><Text style={s.heading}>{exam.titleJa}</Text><Text style={s.body}>{exam.questions.length}問{done?' · ✓ 完了':''}</Text><Button title={t('openResume')} onPress={onPress}/></RoyalContentPanel>;
}
function Reader({lesson,language,onBack,onComplete,saving,saveError}:{lesson:ManufacturingLesson;language:string;onBack:()=>void;onComplete:()=>void;saving:boolean;saveError:boolean}){
 const t=useLabels();
 const [show,setShow]=useState(false),{colors}=useStudyAppearance(),translation=show?(lesson.id.includes('-source-guide-')?manufacturingSourceGuideTranslation(lesson,language):manufacturingTranslation(lesson,language)):null;
 return <Surface reading><TokuteiHeader title={lesson.titleJa} onBack={onBack}/><ScrollView contentContainerStyle={s.content}><ReadingAppearanceControl/>{language!=='ja'&&<Button title={show?t('translationHide'):t('translationShow')} onPress={()=>setShow(v=>!v)}/>}{show&&language!=='ja'&&!translation&&<TranslationText>{t('translationPending')}</TranslationText>}
 <Text style={[s.body,{color:colors.text}]}>{lesson.objectiveJa}</Text>{translation&&<TranslationText>{translation.title}{'\n'}{translation.objective}</TranslationText>}<Text style={[s.body,{color:colors.muted}]}>学習時間の目安：約{lesson.estimatedMinutes}分（説明・練習・振り返り）</Text>
 {lesson.paragraphs.map(p=><View key={p.id} style={[s.section,{borderColor:colors.border}]}><Text style={[s.heading,{color:colors.text}]}>{p.titleJa}</Text><Text selectable style={[s.body,{color:colors.text}]}>{p.textJa}</Text>{translation&&<TranslationText>{translation.paragraphs.find(t=>t.id===p.id)?.title}{'\n'}{translation.paragraphs.find(t=>t.id===p.id)?.text}</TranslationText>}</View>)}
 <ManufacturingDiagram lessonId={lesson.id} language={language} showTranslation={show}/><Text style={[s.heading,{color:colors.text}]}>{t('terms')}</Text>{lesson.terms.map((term,i)=><View key={term.ja}><Text style={[s.body,{color:colors.text}]}>{term.ja}（{term.reading}）：{term.meaningJa}</Text>{translation&&<TranslationText>{translation.terms[i]?.meaning}</TranslationText>}</View>)}
 <Text style={[s.heading,{color:colors.text}]}>{t('safety')}</Text>{lesson.safetyJa.map((note,i)=><View key={i}><Text style={[s.body,{color:colors.text}]}>{note}</Text>{translation&&<TranslationText>{translation.safety[i]}</TranslationText>}</View>)}
 <Text style={[s.heading,{color:colors.text}]}>{t('activity')}</Text><Text style={[s.body,{color:colors.text}]}>{lesson.activityJa}</Text>{translation&&<TranslationText>{translation.activity}</TranslationText>}<Text style={[s.heading,{color:colors.text}]}>{t('summary')}</Text><Text style={[s.body,{color:colors.text}]}>{lesson.summaryJa}</Text>{translation&&<TranslationText>{translation.summary}</TranslationText>}
 {saveError&&<Text accessibilityRole="alert" style={[s.body,{color:colors.text}]}>{t('saveError')}</Text>}<Button title={saving?t('saving'):t('complete')} disabled={saving} onPress={onComplete}/>
 </ScrollView></Surface>;
}
function Attempt({learner,specialty,exam,onBack}:{learner:string;specialty:Specialty;exam:ManufacturingExam;onBack:()=>void}) {
 const t=useLabels();
 const locale=useContext(LocaleContext),[showTranslation,setShowTranslation]=useState(false);
 const [attempt,setAttempt]=useState<TestAttempt|null>(null),[error,setError]=useState<'read'|'invalid'|'write'|null>(null),[saving,setSaving]=useState(false),[confirm,setConfirm]=useState<'submit'|'restart'|'leave'|null>(null),[retry,setRetry]=useState(0);
 const live=useRef(true),queue=useRef(Promise.resolve()),latest=useRef<TestAttempt|null>(null),serial=useRef(0),{colors}=useStudyAppearance(),key=manufacturingExamKey(learner,specialty,exam.id);
 useEffect(()=>{live.current=true;setAttempt(null);setError(null);AsyncStorage.getItem(key).then(raw=>{if(!live.current)return;const a=restoreTestAttempt(raw,exam);if(a){setAttempt(a);latest.current=a;}else setError('invalid');}).catch(()=>{if(live.current)setError('read');});return()=>{live.current=false;};},[key,exam,retry]);
 const persist=(next:TestAttempt)=>{
  latest.current=next;setAttempt(next);setSaving(true);const n=++serial.current;
  queue.current=queue.current.catch(()=>{}).then(()=>AsyncStorage.setItem(key,JSON.stringify(next))).then(()=>{if(live.current&&n===serial.current){setSaving(false);setError(null);}}).catch(()=>{if(live.current&&n===serial.current){setSaving(false);setError('write');}});
 };
 const q=attempt?exam.questions[attempt.currentQuestion]:null,result=attempt?gradeTest(exam,attempt.answers):null;
 const translated=q&&showTranslation?(manufacturingSupplementTranslation(q,locale)??manufacturingQuestionTranslation(q,locale)):null;
 const back=()=>{if(saving)return;if(error==='write')setConfirm('leave');else onBack();};
 useManufacturingBack(back);
 return <Surface reading><TokuteiHeader title={exam.titleJa} onBack={back}/><ScrollView contentContainerStyle={s.content}>
 {!attempt?<><Text style={[s.body,{color:colors.text}]}>{error==='invalid'?t('recordMismatch'):error?t('readError'):t('loading')}</Text>{error&&<Button title={t('retry')} onPress={()=>setRetry(n=>n+1)}/>} {error==='invalid'&&<Button title={t('restart')} onPress={()=>setConfirm('restart')}/>}</>:q&&<>
 {error==='write'&&<><Text accessibilityRole="alert" style={[s.body,{color:colors.text}]}>{t('answerSaveError')}</Text><Button title={t('retry')} disabled={saving} onPress={()=>{if(latest.current)persist(latest.current);}}/></>}
 <ReadingAppearanceControl/>{locale!=='ja'&&<Button title={showTranslation?t('translationHide'):t('translationShow')} onPress={()=>setShowTranslation(v=>!v)}/>}
 {showTranslation&&locale!=='ja'&&!translated&&<TranslationText>{t('translationPending')}</TranslationText>}
 {attempt.submitted&&result&&<Text style={[s.heading,{color:colors.text}]}>{t('correct')} {result.correct} / {result.total} · {t('unanswered')} {result.unanswered}</Text>}
 <Text style={[s.body,{color:colors.text}]}>{attempt.currentQuestion+1} / {exam.questions.length}</Text><Text style={[s.heading,{color:colors.text}]}>{q.stemJa}</Text>{translated&&<TranslationText>{translated.stem}</TranslationText>}
 {q.optionsJa.map((text,i)=><Button key={i} title={`${i+1}. ${text}${translated?'\n'+translated.options[i]:''}`} selected={attempt.answers[attempt.currentQuestion]===i} disabled={attempt.submitted} onPress={()=>{const answers=[...attempt.answers];answers[attempt.currentQuestion]=i;persist({...attempt,answers});}}/>)}
 {attempt.submitted&&<View><Text style={[s.body,{color:colors.text}]}>{t('correct')}：{q.correctIndex+1}</Text>{q.optionReasonsJa.map((why,i)=><View key={i}><Text style={[s.body,{color:colors.text}]}>{i+1}. {why}</Text>{translated&&<TranslationText>{translated.reasons[i]}</TranslationText>}</View>)}</View>}
 <View style={s.row}><Button title={t('previous')} disabled={attempt.currentQuestion===0} onPress={()=>persist({...attempt,currentQuestion:attempt.currentQuestion-1})}/><Button title={t('next')} disabled={attempt.currentQuestion===exam.questions.length-1} onPress={()=>persist({...attempt,currentQuestion:attempt.currentQuestion+1})}/></View>
 <Button title={attempt.submitted?t('restart'):saving?t('saving'):t('submit')} disabled={saving||error==='write'} onPress={()=>setConfirm(attempt.submitted?'restart':'submit')}/>
 </>}
 </ScrollView><Modal visible={confirm!==null} transparent animationType="none" onRequestClose={()=>setConfirm(null)}><View style={s.modal}><View style={[s.dialog,{backgroundColor:colors.background}]}><Text style={[s.body,{color:colors.text}]}>{confirm==='leave'?t('leaveConfirm'):confirm==='restart'?t('restartConfirm'):`${t('submitConfirm')} ${t('unanswered')}: ${attempt?.answers.filter(a=>a===null).length??0}`}</Text><Button title={t('cancel')} onPress={()=>setConfirm(null)}/><Button title={t('confirm')} onPress={()=>{if(confirm==='leave'){setConfirm(null);onBack();return;}if(confirm==='restart')persist(freshTestAttempt(exam));else if(attempt)persist({...attempt,submitted:true});setConfirm(null);}}/></View></View></Modal></Surface>;
}
const s=StyleSheet.create({content:{padding:16,paddingBottom:36,gap:12,width:'100%',maxWidth:1100,alignSelf:'center'},panel:{padding:24},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#302c26'},body:{fontSize:17,lineHeight:29,color:'#302c26'},button:{paddingHorizontal:15,paddingVertical:12,borderWidth:1,borderRadius:8,marginVertical:5,minHeight:48},row:{flexDirection:'row',flexWrap:'wrap',gap:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},week:{minWidth:200,flex:1},day:{minWidth:240,flex:1},empty:{backgroundColor:'#ddd8cc',minHeight:82,alignItems:'center',justifyContent:'center',borderRadius:8},section:{paddingVertical:14,borderTopWidth:1,gap:8},modal:{flex:1,backgroundColor:'#0008',justifyContent:'center',padding:24},dialog:{padding:24,borderRadius:12,width:'100%',maxWidth:560,alignSelf:'center'}});
