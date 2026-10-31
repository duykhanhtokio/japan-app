import {useEffect,useRef,useState} from 'react';
import {Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import type {RestaurantLesson,RestaurantExam} from '@/data/restaurant/types';
import {restaurantUi} from '@/data/restaurant';
import {sourceLesson31,sourceTarget31,sourceQuestionTarget31,type SourceLesson31,type SourceQuestion31,type SourceFigure31} from '@/data/restaurant/source31';
import {restaurantExamKey,restoreRestaurantAttempt,freshRestaurantAttempt,gradeTest} from '@/services/restaurant-study-state';
import {useRestaurantRecord} from './useRestaurantRecord';
import {RestaurantReading} from './RestaurantReading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SourcePicture31,SourceFigureGallery31} from './RestaurantSourcePictures';
import {RestaurantSourceReferences} from './RestaurantSourceReferences';
function Action({text,language,onPress,disabled=false,testID}:{text:string;language:string;onPress:()=>void;disabled?:boolean;testID?:string}){
 const {colors}=useStudyAppearance();return <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={restaurantUi(text,language)} disabled={disabled} accessibilityState={{disabled}} onPress={onPress} style={[s.button,{borderColor:colors.border,opacity:disabled?.45:1}]}><Text style={{color:colors.text}}>{restaurantUi(text,language)}</Text></Pressable>;
}
/** One crop implementation is shared by source teaching, neutral questions and regression tests. */
export const SourceFigureView31=({figure,width,alt}:{figure:SourceFigure31;width?:number;alt:string})=><SourcePicture31 figure={figure} label={alt} width={width}/>;
/** Separately revised source additions preserve the original day and its completion identity. */
export function RestaurantSourceSupplement({lesson,learner,language,showTranslation}:{lesson:RestaurantLesson;learner?:string;language:string;showTranslation:boolean}){
 const closeAttempt=useRef<()=>void>(()=>{}),insets=useSafeAreaInsets();
 const [open,setOpen]=useState(false),[zoom,setZoom]=useState<string|null>(null),{colors}=useStudyAppearance(),row=sourceLesson31(lesson);
 if(!row)return null;
 return <View testID={`restaurant-source31-${lesson.id}`} style={s.group}>
 {showTranslation&&language!=='ja'&&row.sections.some(section=>!sourceTarget31(section,language))&&<TranslationText>{restaurantUi('この言語の訳は準備中です。',language)}</TranslationText>}
 {row.sections.map(section=>{const t=showTranslation?sourceTarget31(section,language):null;return <View key={section.id} testID={`source31-section-${section.id}`} style={[s.section,{borderColor:colors.border}]}><RestaurantReading heading text={section.titleJa} segments={section.furigana?.title}/><RestaurantReading text={section.textJa} segments={section.furigana?.text}/>{t?.title&&t.text&&<TranslationText>{t.title}{'\n'}{t.text}</TranslationText>}</View>;})}
 <SourceFigureGallery31 key={row.sourceHash} figures={row.figures} language={language} showTranslation={showTranslation} onZoom={setZoom}/>
 {(row.terms??[]).map(term=>{const t=showTranslation?sourceTarget31(term,language):null;return <View key={term.id} style={s.section}><RestaurantReading heading text={term.termJa} segments={[{text:term.termJa,reading:term.reading}]}/><RestaurantReading text={term.explanationJa}/>{t?.title&&t.text&&<TranslationText>{t.title}{"\n"}{t.text}</TranslationText>}</View>;})}
 <RestaurantSourceReferences references={row.references??[]} language={language} showTranslation={showTranslation}/>
 {row.exam&&learner&&<Action text="練習問題" language={language} testID={`source31-open-${lesson.id}`} onPress={()=>setOpen(true)}/>}
 <Modal visible={open&&!!row.exam} animationType="none" onRequestClose={()=>closeAttempt.current()}>{open&&row.exam&&learner&&<SourceAttempt key={row.exam.sourceHash} row={row} exam={row.exam} learner={learner} language={language} closeAttempt={closeAttempt} onBack={()=>setOpen(false)}/>}</Modal>
 <Modal visible={zoom!==null} transparent animationType="none" onRequestClose={()=>setZoom(null)}>{zoom&&<View style={[s.zoom,{backgroundColor:colors.background,paddingTop:12+insets.top,paddingBottom:12+insets.bottom,paddingLeft:12+insets.left,paddingRight:12+insets.right}]}><Action text="戻る" language={language} onPress={()=>setZoom(null)}/><ScrollView horizontal><ScrollView>{row.figures.filter(f=>f.id===zoom).map(f=><SourcePicture31 key={f.id} figure={f} label={showTranslation?sourceTarget31(f,language)?.alt??f.altJa:f.altJa} width={Math.max(960,f.cropBox?.width??f.width)}/>)}</ScrollView></ScrollView></View>}</Modal>
 </View>;
}
function SourceAttempt({row,exam,learner,language,closeAttempt,onBack}:{row:SourceLesson31;exam:RestaurantExam&{questions:SourceQuestion31[]};learner:string;language:string;closeAttempt:{current:()=>void};onBack:()=>void}){
 const insets=useSafeAreaInsets(),state=useRestaurantRecord(restaurantExamKey(learner,exam.level,exam),raw=>restoreRestaurantAttempt(raw,exam)),a=state.value,{colors}=useStudyAppearance(),[show,setShow]=useState(false),[confirm,setConfirm]=useState<'submit'|'restart'|'invalid'|'leave'|null>(null);
 const requestBack=()=>{if(state.saving)return;if(state.error==='write')setConfirm('leave');else onBack();};
 useEffect(()=>{closeAttempt.current=requestBack;return ()=>{closeAttempt.current=()=>{};};});
 const q=a?exam.questions[a.currentQuestion]:null,t=q&&show?sourceQuestionTarget31(q,language):null,result=a?gradeTest(exam,a.answers):null;
 return <View accessibilityViewIsModal style={[s.page,{backgroundColor:colors.background,paddingTop:16+insets.top,paddingBottom:16+insets.bottom,paddingLeft:16+insets.left,paddingRight:16+insets.right}]}><ScrollView contentContainerStyle={s.group}>
 <Action text="戻る" language={language} onPress={requestBack} disabled={state.saving}/><RestaurantReading heading text={exam.titleJa}/>
 {language!=='ja'&&<Action text={show?'訳を隠す':'訳を表示'} language={language} onPress={()=>setShow(v=>!v)}/>}
 {state.loading?<Text style={{color:colors.text}}>{restaurantUi('読み込み中…',language)}</Text>:!a?<><Text accessibilityRole="alert" style={{color:colors.text}}>{restaurantUi(state.error==='invalid'?'保存記録の内容を確認できません。元の記録は保持しています。':'保存記録を読み込めませんでした。',language)}</Text><Action text="読み込みを再試行" language={language} onPress={()=>{void state.retry();}}/>{state.error==='invalid'&&<Action text="元の記録を保管してやり直す" language={language} onPress={()=>setConfirm('invalid')}/>}</>:q&&<>
 {state.error==='write'&&<><Text accessibilityRole="alert" style={{color:colors.text}}>{restaurantUi('回答を保存できませんでした。',language)}</Text><Action text="保存を再試行" language={language} onPress={()=>{void state.retry();}}/></>}
 {a.submitted&&result&&<Text testID="source31-result" style={{color:colors.text}}>{restaurantUi('正解',language)} {result.correct} / {result.total}</Text>}
 <Text style={{color:colors.text}}>{a.currentQuestion+1} / {exam.questions.length}</Text><RestaurantReading heading text={q.stemJa} segments={q.furigana?.stem}/>{t?.stem&&<TranslationText>{t.stem}</TranslationText>}
 {(q.figureIds??[]).flatMap(id=>row.figures.filter(f=>f.id===id&&f.quizSafe)).map(f=><SourcePicture31 key={f.id} figure={f} label="設問の図"/>)}
 {q.optionsJa.map((option,i)=><View key={i}><Pressable testID={`source31-option-${i}`} accessibilityRole="button" accessibilityLabel={`${i+1}. ${option}`} accessibilityState={{selected:a.answers[a.currentQuestion]===i,disabled:a.submitted}} disabled={a.submitted||state.saving} style={[s.button,{borderColor:colors.border,backgroundColor:a.answers[a.currentQuestion]===i?colors.translation:colors.background}]} onPress={()=>{void state.update(current=>{const answers=[...current.answers];answers[current.currentQuestion]=i;return {...current,answers};});}}><RestaurantReading text={`${i+1}. ${option}`} segments={q.furigana?.options?.[i]?[{text:`${i+1}. `},...q.furigana.options[i]]:undefined}/></Pressable>{t?.options?.[i]&&<TranslationText>{t.options[i]}</TranslationText>}</View>)}
 {a.submitted&&<View testID="source31-review"><Text style={{color:colors.text}}>{restaurantUi('正解',language)}：{q.correctIndex+1}</Text><RestaurantReading text={q.explanationJa} segments={q.furigana?.explanation}/>{t?.explanation&&<TranslationText>{t.explanation}</TranslationText>}{q.optionReasonsJa.map((reason,i)=><View key={i}><RestaurantReading text={`${i+1}. ${reason}`} segments={q.reasonRuby?.[i]?[{text:`${i+1}. `},...q.reasonRuby[i]]:undefined}/>{t?.reasons?.[i]&&<TranslationText>{i+1}. {t.reasons[i]}</TranslationText>}</View>)}</View>}
 <Action text="前へ" language={language} disabled={a.currentQuestion===0||state.saving} onPress={()=>{void state.update(current=>({...current,currentQuestion:current.currentQuestion-1}));}}/><Action text="次へ" language={language} disabled={a.currentQuestion===exam.questions.length-1||state.saving} onPress={()=>{void state.update(current=>({...current,currentQuestion:current.currentQuestion+1}));}}/>
 <Action text={a.submitted?'もう一度解く':'提出する'} testID="source31-submit" language={language} disabled={state.saving||state.error==='write'} onPress={()=>setConfirm(a.submitted?'restart':'submit')}/>
 </>}
 {confirm&&<View testID="source31-confirm" style={[s.section,{borderColor:colors.border}]}><Text style={{color:colors.text}}>{restaurantUi(confirm==='leave'?'保存できていない回答があります。保存せずに戻りますか。':confirm==='submit'?'提出しますか。未回答：{count}問':confirm==='restart'?'この問題集を最初から解き直しますか。':'元の記録を別に保管して、新しい回答を始めますか。',language,{count:a?.answers.filter(x=>x===null).length??0})}</Text><Action text="キャンセル" language={language} onPress={()=>setConfirm(null)}/><Action text="確定" language={language} testID="source31-confirm-submit" onPress={()=>{const action=confirm;setConfirm(null);if(action==='leave')onBack();else if(action==='invalid')void state.reset(freshRestaurantAttempt(exam));else if(a)void state.update(action==='restart'?freshRestaurantAttempt(exam):{...a,submitted:true});}}/></View>}
 </ScrollView></View>;
}
const s=StyleSheet.create({group:{gap:14},section:{gap:10,paddingVertical:14,borderTopWidth:1},button:{minHeight:48,borderWidth:1,borderRadius:8,padding:12},page:{flex:1,padding:16},zoom:{flex:1,padding:12}});
