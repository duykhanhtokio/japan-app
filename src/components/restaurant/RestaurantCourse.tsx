import {createContext,useContext,useRef,useState,type PropsWithChildren} from 'react';
import {Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {useBackdropOcclusion} from '@/components/ui/AppBackdrop';
import {RoyalContentPanel,RoyalExplanationPanel} from '@/components/ui/RoyalPanels';
import {TokuteiHeader,TokuteiDayCard} from '@/components/tokutei/TokuteiChrome';
import {StudyAppearanceProvider,ReadingAppearanceControl,TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {restaurantWeeks,restaurantLesson,restaurantExams,restaurantLessonTranslation,restaurantQuestionTranslation,restaurantUi,type RestaurantLevel,type RestaurantLesson,type RestaurantExam,type ReadingSegment} from '@/data/restaurant';
import {restaurantProgressKey,restaurantExamKey,restoreRestaurantProgress,restaurantLessonDone,restoreRestaurantAttempt,freshRestaurantAttempt,gradeTest} from '@/services/restaurant-study-state';
import {useRestaurantRecord} from './useRestaurantRecord';
import {RestaurantReading} from './RestaurantReading';
import {RestaurantDiagrams} from './RestaurantDiagrams';
import {RestaurantIllustrations} from './RestaurantIllustrations';
import {RestaurantGlossary} from './RestaurantGlossary';
import {RestaurantCuttingGuide} from './RestaurantCuttingGuide';
import {RestaurantMealPlacement} from './RestaurantMealPlacement';
import {RestaurantAdditionalGuides} from './RestaurantAdditionalGuides';
import {RestaurantOrderingExercise} from './RestaurantOrderingExercise';
import {RestaurantDetailGuides} from './RestaurantDetailGuides';
import {RestaurantQscGuide} from './RestaurantQscGuide';
import {RestaurantToolGallery} from './RestaurantToolGallery';
import {RestaurantHygieneRecords} from './RestaurantHygieneRecords';
import {RestaurantDailyFigure,RestaurantDailyCompanions} from './RestaurantDailyLearning';
const RestaurantLanguage=createContext('ja');

function Button({title,onPress,disabled=false,selected=false,testID,readingSegments}:{title:string;onPress:()=>void;disabled?:boolean;selected?:boolean;testID?:string;readingSegments?:ReadingSegment[]}){
 const language=useContext(RestaurantLanguage);if(!readingSegments)title=restaurantUi(title,language);
 const {colors}=useStudyAppearance();return <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled,selected}} disabled={disabled} onPress={onPress} style={[s.button,{borderColor:colors.border,backgroundColor:selected?colors.translation:colors.background,opacity:disabled ? .45 : 1}]}>{readingSegments?<RestaurantReading text={title} segments={readingSegments}/>:<Text style={{color:colors.text,fontSize:16,lineHeight:25,textAlign:'center'}}>{title}</Text>}</Pressable>;
}
function Surface({children,reading=false}:PropsWithChildren<{reading?:boolean}>){
 useBackdropOcclusion(reading);const {colors}=useStudyAppearance(),i=useSafeAreaInsets();
 const body=<View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right}}>{children}</View>;
 return reading?<View style={{flex:1,backgroundColor:colors.background}}>{body}</View>:<RoyalPageBackground>{body}</RoyalPageBackground>;
}
function Message({text}:{text:string}){const {colors}=useStudyAppearance(),language=useContext(RestaurantLanguage);return <Text accessibilityRole="alert" style={[s.body,{color:colors.text}]}>{restaurantUi(text,language)}</Text>;}
function Confirm({visible,text,onCancel,onConfirm}:{visible:boolean;text:string;onCancel:()=>void;onConfirm:()=>void}){
 const {colors}=useStudyAppearance();return <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}><View style={s.modal}><View style={[s.dialog,{backgroundColor:colors.background}]}><Message text={text}/><Button title="キャンセル" onPress={onCancel}/><Button title="確定" onPress={onConfirm}/></View></View></Modal>;
}
export function RestaurantCourse({learner,language,onBack}:{learner:string;language:string;onBack:()=>void}){
 const [level,setLevel]=useState<RestaurantLevel|null>(null);
 return <RestaurantLanguage.Provider value={language}><StudyAppearanceProvider>{level?<Course key={`${learner}:${level}`} learner={learner} language={language} level={level} onBack={()=>setLevel(null)}/>:<Surface><TokuteiHeader title={restaurantUi('外食業',language)} onBack={onBack}/><ScrollView contentContainerStyle={s.content}><RoyalContentPanel style={s.panel}><Text style={s.heading}>{restaurantUi('学習する区分を選ぶ',language)}</Text><Text style={s.body}>{restaurantUi('日本語を基本に学びます。翻訳は選択した言語で表示します。',language)}</Text><Text style={s.body}>{restaurantUi('教材は作成・確認を進めています。公式試験の問題ではありません。',language)}</Text>{(['1','2'] as const).map(l=><Button key={l} testID={`restaurant-level-${l}`} title={`特定技能${l}号`} onPress={()=>setLevel(l)}/>)}</RoyalContentPanel></ScrollView></Surface>}</StudyAppearanceProvider></RestaurantLanguage.Provider>;
}
function Course({learner,language,level,onBack}:{learner:string;language:string;level:RestaurantLevel;onBack:()=>void}){
 const [tab,setTab]=useState<'study'|'weekly'|'practice'>('study'),[exam,setExam]=useState<RestaurantExam|null>(null),[leave,setLeave]=useState(false);
 const state=useRestaurantRecord(restaurantProgressKey(learner,level),restoreRestaurantProgress),p=state.value;
 const weeks=restaurantWeeks(level),week=p?.position.week??null,selected=weeks.find(w=>w.number===week);
 const candidate=p?.position.lessonId?restaurantLesson(p.position.lessonId,level):null;
 const lesson=candidate?.sourceHash===p?.position.sourceHash?candidate:null;
 const leaveCourse=()=>{if(state.saving)return;if(state.error==='write')setLeave(true);else onBack();};
 if(exam)return <Attempt key={exam.id} learner={learner} level={level} language={language} exam={exam} onBack={()=>setExam(null)}/>;
 if(lesson&&p)return <RestaurantLessonReader key={lesson.id} lesson={lesson} language={language} initialScrollY={p.position.scrollY} saving={state.saving} saveError={state.error==='write'} onScrollPosition={y=>{void state.update(current=>({...current,position:{...current.position,scrollY:y}}));}} onRetry={()=>{void state.retry();}} onComplete={async()=>{await state.update(current=>({...current,entries:{...current.entries,[lesson.id]:lesson.sourceHash},position:{week:lesson.week,lessonId:null,sourceHash:null,scrollY:0}}),{optimistic:false});}} onBack={()=>{if(!state.saving&&state.error!=='write')void state.update(current=>({...current,position:{...current.position,lessonId:null,sourceHash:null}}));}}/>;
 return <Surface><TokuteiHeader title={`${restaurantUi('外食業',language)} · ${restaurantUi(`特定技能${level}号`,language)}`} onBack={()=>{if(selected&&p){if(!state.saving)void state.update(current=>({...current,position:{week:null,lessonId:null,sourceHash:null,scrollY:0}}));}else leaveCourse();}}/><ScrollView contentContainerStyle={s.content}>
 <View style={s.row}>{(['study','weekly','practice'] as const).map(value=><Button key={value} testID={`restaurant-tab-${value}`} title={restaurantUi(value==='study'?'学習':value==='weekly'?'週の確認':'練習問題',language)} selected={tab===value} onPress={()=>setTab(value)}/>)}</View>
 {state.loading?<Message text="読み込み中…"/>:state.error==='read'||state.error==='invalid'?<RoyalExplanationPanel style={s.panel}><Message text={state.error==='invalid'?'保存記録を読み取れません。元の記録は上書きしていません。':'保存記録を読み込めませんでした。'}/><Button title="読み込みを再試行" onPress={()=>{void state.retry();}}/></RoyalExplanationPanel>:<>
 {state.error==='write'&&<><Message text="学習記録を保存できませんでした。"/><Button title="保存を再試行" disabled={state.saving} onPress={()=>{void state.retry();}}/></>}
 {tab!=='study'?<><Text style={s.body}>{restaurantUi(tab==='practice'?'学習用の練習問題です。公式試験と同じ出題数・時間・配点を示すものではありません。':'学んだ週の内容を確認します。',language)}</Text>{restaurantExams(level,tab).length?restaurantExams(level,tab).map(e=><ExamCard key={e.id} learner={learner} level={level} exam={e} onPress={()=>setExam(e)}/>):<Message text="この区分の問題は準備中です。"/>}</>:selected&&p?<><Text style={s.heading}>{restaurantUi('第{week}週',language,{week:selected.number})}</Text><Text style={s.body}>{restaurantUi('{days}日 · 1日 約30分',language,{days:selected.lessons.length})}</Text>{selected.lessons.map(l=><TokuteiDayCard key={l.id} testID={`restaurant-day-${l.id}`} day={l.day} title={l.titleJa} done={restaurantLessonDone(p,l)} disabled={state.saving} onPress={()=>{void state.update(current=>({...current,position:{week:l.week,lessonId:l.id,sourceHash:l.sourceHash,scrollY:0}}));}}/>)}</>:<View style={s.grid}>{weeks.map(w=><View key={w.number} style={s.week}><Button testID={`restaurant-week-${w.number}`} title={restaurantUi('第{week}週',language,{week:w.number})+'\n'+restaurantUi('{days}日 · 1日 約30分',language,{days:w.lessons.length})} disabled={state.saving} onPress={()=>{void state.update(current=>({...current,position:{week:w.number,lessonId:null,sourceHash:null,scrollY:0}}));}}/>{p&&<Text style={s.body}>{restaurantUi('完了 {done}/{total}',language,{done:w.lessons.filter(l=>restaurantLessonDone(p,l)).length,total:w.lessons.length})}</Text>}</View>)}</View>}
 </>}
 </ScrollView><Confirm visible={leave} text="保存できていない学習記録があります。保存せずに戻りますか。" onCancel={()=>setLeave(false)} onConfirm={onBack}/></Surface>;
}
function ExamCard({learner,level,exam,onPress}:{learner:string;level:RestaurantLevel;exam:RestaurantExam;onPress:()=>void}){
 const language=useContext(RestaurantLanguage),state=useRestaurantRecord(restaurantExamKey(learner,level,exam),raw=>restoreRestaurantAttempt(raw,exam));
 return <RoyalContentPanel style={s.panel}><Text style={s.heading}>{exam.titleJa}</Text><Text style={s.body}>{restaurantUi('{count}問',language,{count:exam.questions.length})}{state.value?.submitted?restaurantUi(' · ✓ 完了',language):''}</Text><Button title="開く・再開" testID={`restaurant-exam-${exam.id}`} onPress={onPress}/></RoyalContentPanel>;
}
export function RestaurantLessonReader({lesson,language,initialScrollY,saving,saveError,onScrollPosition,onComplete,onRetry,onBack}:{lesson:RestaurantLesson;language:string;initialScrollY:number;saving:boolean;saveError:boolean;onScrollPosition:(y:number)=>void;onComplete:()=>Promise<void>;onRetry:()=>void;onBack:()=>void}){
 const [show,setShow]=useState(false),{colors}=useStudyAppearance(),t=restaurantLessonTranslation(lesson,language),scroll=useRef<ScrollView>(null),y=useRef(initialScrollY),restored=useRef(false);
 const remember=()=>onScrollPosition(Math.max(0,y.current));
 return <Surface reading><TokuteiHeader title={lesson.titleJa} onBack={()=>{if(!saving&&!saveError){remember();onBack();}}}/><ScrollView ref={scroll} scrollEventThrottle={100} onScroll={event=>{y.current=event.nativeEvent.contentOffset.y;}} onMomentumScrollEnd={remember} onScrollEndDrag={remember} onContentSizeChange={()=>{if(!restored.current){restored.current=true;scroll.current?.scrollTo({y:initialScrollY,animated:false});}}} contentContainerStyle={s.content}>
 <ReadingAppearanceControl/>{language!=='ja'&&<Button testID="restaurant-translation-toggle" title={restaurantUi(show?'訳を隠す':'訳を表示',language)} onPress={()=>setShow(v=>!v)}/>}
 {show&&language!=='ja'&&!t&&<TranslationText>{restaurantUi('この言語の訳は準備中です。',language)}</TranslationText>}
 <RestaurantReading heading text={lesson.titleJa} segments={lesson.furigana?.title} terms={lesson.terms}/><Text style={[s.body,{color:colors.muted}]}>{restaurantUi('約{minutes}分',language,{minutes:lesson.minutes})}</Text><RestaurantReading text={lesson.objectiveJa} segments={lesson.furigana?.objective} terms={lesson.terms}/>{show&&t&&<TranslationText>{t.title}{'\n'}{t.objective}</TranslationText>}
 <RestaurantDailyFigure lesson={lesson} language={language} showTranslation={show}/>
 {lesson.paragraphs.map(paragraph=><View key={paragraph.id} style={[s.section,{borderColor:colors.border}]}><RestaurantReading heading text={paragraph.titleJa} segments={lesson.furigana?.paragraphTitles?.[paragraph.id]} terms={lesson.terms}/><RestaurantReading text={paragraph.textJa} segments={paragraph.furigana} terms={lesson.terms}/>{show&&t&&<TranslationText>{t.paragraphTitles[paragraph.id]}{'\n'}{t.paragraphs[paragraph.id]}</TranslationText>}</View>)}
 <RestaurantDiagrams lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantCuttingGuide lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantMealPlacement lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantAdditionalGuides lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantOrderingExercise key={lesson.id} lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantDetailGuides key={`detail:${lesson.id}`} lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantQscGuide key={`qsc:${lesson.id}`} lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantToolGallery lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantHygieneRecords key={`hygiene-records:${lesson.id}`} lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantIllustrations lessonId={lesson.id} language={language} showTranslation={show}/><RestaurantGlossary lessonId={lesson.id} language={language} showTranslation={show}/>
 <RestaurantDailyCompanions lesson={lesson} language={language} showTranslation={show}/>
 <RestaurantReading heading text="用語" segments={[{text:"用語",reading:"ようご"}]}/>{lesson.terms.map(term=><View key={term.ja}><RestaurantReading text={term.ja} segments={[{text:term.ja,reading:term.reading}]}/>{show&&t&&<TranslationText>{t.terms[term.ja]}</TranslationText>}</View>)}
 <RestaurantReading heading text="まとめ"/><RestaurantReading text={lesson.summaryJa} segments={lesson.furigana?.summary} terms={lesson.terms}/>{show&&t&&<TranslationText>{t.summary}</TranslationText>}
 <RestaurantReading heading text="考えて説明する" segments={[{text:"考えて",reading:"かんがえて"},{text:"説明",reading:"せつめい"},{text:"する"}]}/><RestaurantReading text={lesson.activityJa} segments={lesson.furigana?.activity} terms={lesson.terms}/>{show&&t&&<TranslationText>{t.activity}</TranslationText>}
 {saveError&&<><Message text="完了・閲覧位置を保存できませんでした。"/><Button title="保存を再試行" disabled={saving} onPress={onRetry}/></>}
 <Button testID="restaurant-complete" title={restaurantUi(saving?'保存中…':'完了する',language)} disabled={saving||saveError} onPress={()=>{void onComplete();}}/>
 </ScrollView></Surface>;
}
function Attempt({learner,level,language,exam,onBack}:{learner:string;level:RestaurantLevel;language:string;exam:RestaurantExam;onBack:()=>void}){
 const state=useRestaurantRecord(restaurantExamKey(learner,level,exam),raw=>restoreRestaurantAttempt(raw,exam)),a=state.value,{colors}=useStudyAppearance(),[confirm,setConfirm]=useState<'submit'|'restart'|'leave'|'invalid'|null>(null),[show,setShow]=useState(false);
 const q=a?exam.questions[a.currentQuestion]:null,t=q?restaurantQuestionTranslation(q,language):null,result=a?gradeTest(exam,a.answers):null;
 return <Surface reading><TokuteiHeader title={exam.titleJa} onBack={()=>{if(state.saving)return;if(state.error==='write')setConfirm('leave');else onBack();}}/><ScrollView contentContainerStyle={s.content}>
 <ReadingAppearanceControl/>{language!=='ja'&&<Button title={restaurantUi(show?'訳を隠す':'訳を表示',language)} onPress={()=>setShow(v=>!v)}/>}
 {state.loading?<Message text="読み込み中…"/>:!a?<><Message text={state.error==='invalid'?'保存記録の内容を確認できません。元の記録は保持しています。':'保存記録を読み込めませんでした。'}/><Button title="読み込みを再試行" onPress={()=>{void state.retry();}}/>{state.error==='invalid'&&<Button title="元の記録を保管してやり直す" onPress={()=>setConfirm('invalid')}/>}</>:q&&<>
 {state.error==='write'&&<><Message text="回答を保存できませんでした。"/><Button title="保存を再試行" disabled={state.saving} onPress={()=>{void state.retry();}}/></>}
 {a.submitted&&result&&<View testID="restaurant-result"><Text style={[s.heading,{color:colors.text}]}>{restaurantUi('正解',language)} {result.correct} / {result.total}</Text><Text style={[s.body,{color:colors.text}]}>{restaurantUi('不正解',language)} {result.wrong} · {restaurantUi('未回答',language)} {result.unanswered}</Text></View>}
 <Text style={[s.body,{color:colors.text}]}>{a.currentQuestion+1} / {exam.questions.length}</Text><RestaurantReading heading text={q.stemJa} segments={q.furigana?.stem}/>{show&&language!=='ja'&&(t?<TranslationText>{t.stem}</TranslationText>:<TranslationText>{restaurantUi('この問題の訳は準備中です。',language)}</TranslationText>)}
 {q.optionsJa.map((option,i)=><View key={i}><Button testID={`restaurant-option-${i}`} title={`${i+1}. ${option}`} readingSegments={q.furigana?.options?.[i]?[{text:`${i+1}. `},...q.furigana.options[i]]:undefined} selected={a.answers[a.currentQuestion]===i} disabled={a.submitted} onPress={()=>{void state.update(current=>{const answers=[...current.answers];answers[current.currentQuestion]=i;return {...current,answers};});}}/>{show&&t&&<TranslationText>{i+1}. {t.options[i]}</TranslationText>}</View>)}
 {a.submitted&&<View testID="restaurant-answer-review"><Text style={[s.heading,{color:colors.text}]}>{restaurantUi(a.answers[a.currentQuestion]===null?'未回答':a.answers[a.currentQuestion]===q.correctIndex?'正解':'不正解',language)} · {restaurantUi('正解',language)}：{q.correctIndex+1}</Text><RestaurantReading text={q.explanationJa} segments={q.furigana?.explanation}/>{show&&t&&<TranslationText>{t.explanation}</TranslationText>}</View>}
 <View style={s.row}><Button title="前へ" disabled={a.currentQuestion===0} onPress={()=>{void state.update(current=>({...current,currentQuestion:current.currentQuestion-1}));}}/><Button title="次へ" disabled={a.currentQuestion===exam.questions.length-1} onPress={()=>{void state.update(current=>({...current,currentQuestion:current.currentQuestion+1}));}}/></View>
 <Button testID="restaurant-submit" title={a.submitted?'もう一度解く':state.saving?'保存中…':'提出する'} disabled={state.saving||state.error==='write'} onPress={()=>setConfirm(a.submitted?'restart':'submit')}/>
 </>}
 </ScrollView><Confirm visible={confirm!==null} text={confirm==='leave'?'保存できていない回答があります。保存せずに戻りますか。':confirm==='restart'?'この問題集を最初から解き直しますか。':confirm==='invalid'?'元の記録を別に保管して、新しい回答を始めますか。':restaurantUi('提出しますか。未回答：{count}問',language,{count:a?.answers.filter(value=>value===null).length??0})} onCancel={()=>setConfirm(null)} onConfirm={()=>{const action=confirm;setConfirm(null);if(action==='leave')onBack();else if(action==='invalid')void state.reset(freshRestaurantAttempt(exam));else if(a)void state.update(action==='restart'?freshRestaurantAttempt(exam):{...a,submitted:true});}}/></Surface>;
}
const s=StyleSheet.create({content:{padding:16,paddingBottom:36,gap:12},panel:{padding:24},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#302c26'},body:{fontSize:17,lineHeight:29,color:'#302c26'},button:{paddingHorizontal:15,paddingVertical:12,borderWidth:1,borderRadius:8,marginVertical:5,minHeight:48},row:{flexDirection:'row',flexWrap:'wrap',gap:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},week:{minWidth:160,flex:1},section:{paddingVertical:14,borderTopWidth:1,gap:8},modal:{flex:1,backgroundColor:'#0008',justifyContent:'center',padding:24},dialog:{padding:24,borderRadius:12,width:'100%',maxWidth:560,alignSelf:'center'}});
