import type React from 'react';
import {HotelJapaneseText} from './HotelJapaneseText';
import {HotelPracticeFloorplan} from './HotelPracticeFloorplan';
import {HotelRevenueExample} from './HotelRevenueExample';
import {HotelServiceVisualGuide} from './HotelServiceVisualGuide';
import {useEffect,useRef,useState,type PropsWithChildren} from 'react';
import {BackHandler,Image,Modal,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {RoyalContentPanel,RoyalExplanationPanel} from '@/components/ui/RoyalPanels';
import {TokuteiHeader} from '@/components/tokutei/TokuteiChrome';
import {StudyAppearanceProvider,ReadingAppearanceControl,TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {hospitalityCatalog,loadHotelLesson,loadHotelMock,loadHotelTranslation,type HotelLesson} from '@/data/hospitality';
import {hospitalityUi,hospitalityLabel} from '@/data/hospitality/ui';
import {hotelIllustration,hotelIllustrationAlt,hotelIllustrationAspectRatio} from '@/data/hospitality/illustrations';
import {hotelProgressKey,hotelRecord,restoreHotelProgress,updateHotelRecord,type HotelProgress,type HotelRecord} from '@/services/hospitality-study-state';
function Button({title,onPress,disabled=false,selected=false,children}:{title:string;onPress:()=>void;disabled?:boolean;selected?:boolean;children?:React.ReactNode}){
 const {colors}=useStudyAppearance();return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled,selected}} disabled={disabled} onPress={onPress} style={[s.button,{borderColor:colors.border,backgroundColor:selected?colors.translation:colors.background,opacity:disabled?.45:1}]}>{children||<Text style={[s.body,{color:colors.text}]}>{title}</Text>}</Pressable>;
}
function Surface({children,reading=false}:PropsWithChildren<{reading?:boolean}>){const i=useSafeAreaInsets(),{colors}=useStudyAppearance();const body=<View style={{flex:1,paddingTop:i.top,paddingBottom:i.bottom,paddingLeft:i.left,paddingRight:i.right}}>{children}</View>;return reading?<View style={{flex:1,backgroundColor:colors.background}}>{body}</View>:<RoyalPageBackground>{body}</RoyalPageBackground>;}
export function HospitalityCourse(props:{learner:string;language:string;onBack:()=>void}){return <StudyAppearanceProvider><Course key={props.learner} {...props}/></StudyAppearanceProvider>;}
function Course({learner,language,onBack}:{learner:string;language:string;onBack:()=>void}){
 const [level,setLevel]=useState<1|2|null>(null),[lesson,setLesson]=useState<HotelLesson|null>(null),[progress,setProgress]=useState<HotelProgress|null>(null),[error,setError]=useState<'load'|'invalid'|'save'|null>(null),[saving,setSaving]=useState(false),[retry,setRetry]=useState(0);
 const t=(key:Parameters<typeof hospitalityUi>[1])=>hospitalityUi(language,key);
 const key=hotelProgressKey(learner),live=useRef(true),busy=useRef(false),pending=useRef<HotelProgress|null>(null),{colors}=useStudyAppearance();
 useEffect(()=>{live.current=true;setProgress(null);setError(null);AsyncStorage.getItem(key).then(raw=>{if(!live.current)return;const next=restoreHotelProgress(raw);if(next)setProgress(next);else setError('invalid');}).catch(()=>{if(live.current)setError('load');});return()=>{live.current=false;};},[key,retry]);
 const back=()=>{if(busy.current||error==='save')return;if(lesson)setLesson(null);else if(level)setLevel(null);else onBack();};
 useEffect(()=>{const sub=BackHandler.addEventListener('hardwareBackPress',()=>{back();return true;});return()=>sub.remove();});
 const persist=async(next:HotelProgress)=>{if(busy.current)return;busy.current=true;pending.current=next;setSaving(true);try{await AsyncStorage.setItem(key,JSON.stringify(next));if(live.current){setProgress(next);pending.current=null;setError(null);}}catch{if(live.current)setError('save');}finally{busy.current=false;if(live.current)setSaving(false);}};
 const update=(record:HotelRecord)=>{if(progress&&lesson)void persist(updateHotelRecord(progress,lesson.id,record));};
 const notice=<RoyalExplanationPanel style={s.panel}><Text style={[s.body,{color:'#fff3cf'}]}>{t('practiceNotice')}</Text></RoyalExplanationPanel>;
 return <Surface reading={!!lesson}><TokuteiHeader title={lesson?.title||`${hospitalityLabel(language,0)}${level?` · 特定技能${level}号`:''}`} onBack={back}/><ScrollView key={lesson?.id||`${level}`} contentContainerStyle={s.content}>
 {!progress?<><Text style={[s.body,{color:colors.text}]}>{error==='invalid'?t('recordMismatch'):error?t('readError'):t('loading')}</Text>{error&&<Button title={t('retry')} onPress={()=>setRetry(n=>n+1)}/>}</>:<>
 {error==='save'&&<View accessibilityRole="alert"><Text style={[s.body,{color:colors.text}]}>{t('answerSaveError')}</Text><Button title="保存を再試行" disabled={saving} onPress={()=>{if(pending.current)void persist(pending.current);}}/></View>}
 {!level?<>{notice}<RoyalContentPanel style={s.panel}><Text style={s.heading}>{t('chooseSpecialty')}</Text><Button title="特定技能１号 · 基礎と現場対応" onPress={()=>setLevel(1)}/><Button title="特定技能２号 · 基礎の復習と管理・判断" onPress={()=>setLevel(2)}/></RoyalContentPanel></>:!lesson?<>{notice}<Text style={[s.body,{color:colors.text}]}>{level===2?'１号の共通知識も復習できます。２号の追加単元は一覧に明記しています。':'説明・具体例・図・実践・確認問題の順に学びます。'}</Text><Button title="総合練習（25問）" onPress={()=>setLesson(loadHotelMock(level))}/>{hospitalityCatalog.filter(item=>item.level===1||level===2).map((item,i)=><RoyalContentPanel key={item.id} style={s.panel}><Text style={s.heading}>{i+1}. {item.title}</Text><Text style={s.body}>{item.reading}</Text><Text style={s.body}>{item.level===2?'２号追加':'共通基礎'} · 約{item.estimatedMinutes}分 · {hotelRecord(progress,item.id,item.revision).completed?'✓ 完了':'未完了'}</Text><Button title="学習を開く・続ける" onPress={()=>setLesson(loadHotelLesson(item.id))}/></RoyalContentPanel>)}</>:<Reader key={`${lesson.id}:${language}`} lesson={lesson} language={language} record={hotelRecord(progress,lesson.id,lesson.revision)} disabled={saving||error==='save'} onChange={update}/>}
 </>}
 </ScrollView></Surface>;
}
function Reader({lesson,language,record,disabled,onChange}:{lesson:HotelLesson;language:string;record:HotelRecord;disabled:boolean;onChange:(next:HotelRecord)=>void}){
 const t=(key:Parameters<typeof hospitalityUi>[1])=>hospitalityUi(language,key);
 const {colors}=useStudyAppearance(),[show,setShow]=useState(false),[ruby,setRuby]=useState(false),[zoom,setZoom]=useState(false),[confirm,setConfirm]=useState<'submit'|'restart'|null>(null);
 const translation=show?loadHotelTranslation(lesson.id,language,lesson.revision):null,figure=hotelIllustration(lesson.id);
 const japanese=(value:string,heading=false)=><HotelJapaneseText text={value} lessonId={lesson.id} revision={lesson.revision} enabled={ruby} color={colors.text} heading={heading}/>;
 const body=(value:string)=>japanese(value);
 const heading=(value:string)=>japanese(value,true);
 const answers=lesson.questions.filter(q=>record.answers[q.id]!==undefined).length;
 return <>
 <ReadingAppearanceControl/><Button title={ruby?'ふりがなを隠す':'ふりがなを表示'} onPress={()=>setRuby(v=>!v)}/>{body(lesson.reading)}{language!=='ja'&&<Button title={show?t('translationHide'):t('translationShow')} onPress={()=>setShow(v=>!v)}/>}{show&&!translation&&<TranslationText>{t('translationPending')}</TranslationText>}
 {translation&&<TranslationText>{translation.title}</TranslationText>}
 {heading(hospitalityLabel(language,1))}{lesson.objectives.map((o,i)=><View key={o.id}>{body(o.text)}{translation&&<TranslationText>{translation.objectives[i]?.text}</TranslationText>}</View>)}
 {lesson.sections.map((section,i)=><View key={section.id} style={[s.section,{borderColor:colors.border}]}>{heading(section.title)}{body(section.body)}{translation&&<TranslationText>{translation.sections[i]?.title}{'\n'}{translation.sections[i]?.body}</TranslationText>}</View>)}
 {figure&&<View testID={`hotel-figure-${lesson.id}`}><Pressable accessibilityRole="button" accessibilityLabel={t('imageZoom')} onPress={()=>setZoom(true)}><Image source={figure} accessibilityLabel={hotelIllustrationAlt(lesson.id,language,lesson.illustration.alt)} resizeMode="contain" style={[s.figure,hotelIllustrationAspectRatio(lesson.id)?{aspectRatio:hotelIllustrationAspectRatio(lesson.id)}:undefined]}/></Pressable>{body(lesson.illustration.caption)}{translation&&<TranslationText>{translation.illustration.caption}</TranslationText>}</View>}
 {lesson.id==='hotel-front-03'&&<HotelPracticeFloorplan language={language}/>}
 {lesson.id==='hotel-planning-02'&&<HotelRevenueExample language={language}/>}
 {['hotel-service-01','hotel-service-02','hotel-service-03'].includes(lesson.id)&&<HotelServiceVisualGuide lesson={lesson} language={language}/>}
 {lesson.terms.length>0&&heading(t('terms'))}{lesson.terms.map((term,i)=><View key={`${term.ja}:${i}`}>{body(`${term.ja}（${term.reading}）`)}{body(term.meaning)}{translation&&<TranslationText>{translation.terms[i]?.meaning}</TranslationText>}</View>)}
 {lesson.example.situation&&heading(hospitalityLabel(language,2))}{body(lesson.example.situation)}{lesson.example.steps.map((step,i)=><View key={i}>{body(`${i+1}.`)}{body(step)}{translation&&<TranslationText>{translation.example.steps[i]}</TranslationText>}</View>)}{translation&&<TranslationText>{translation.example.situation}</TranslationText>}
 {heading(t('activity'))}{body(lesson.practice.prompt)}{translation&&<TranslationText>{translation.practice.prompt}</TranslationText>}
 <Button title={record.submitted?'もう一度解く':'確認問題を提出する'} disabled={disabled||(!record.submitted&&answers!==lesson.questions.length)} onPress={()=>setConfirm(record.submitted?'restart':'submit')}/>
 {body(`回答 ${answers} / ${lesson.questions.length}`)}
 {record.submitted&&heading(`正解 ${lesson.questions.filter(q=>record.answers[q.id]===q.answerIndex).length} / ${lesson.questions.length}`)}
 {lesson.questions.map((q,i)=><View testID={q.id} key={q.id} style={[s.section,{borderColor:colors.border}]}>{body(`${i+1}.`)}{heading(q.prompt)}{translation&&<TranslationText>{translation.questions[i]?.prompt}</TranslationText>}{q.choices.map((choice,j)=><Button key={j} title={`${j+1}. ${choice}${translation?'\n'+(translation.questions[i]?.choices[j]||''):''}`} selected={record.answers[q.id]===j} disabled={disabled||record.submitted} onPress={()=>onChange({...record,answers:{...record.answers,[q.id]:j}})}>{ruby?<View>{japanese(choice)}{translation&&<TranslationText>{translation.questions[i]?.choices[j]}</TranslationText>}</View>:undefined}</Button>)}{record.submitted&&<>{body(`正解：${q.answerIndex+1}`)}{body(q.explanation)}{translation&&<TranslationText>{translation.questions[i]?.explanation}</TranslationText>}</>}</View>)}
 {record.submitted&&<>{lesson.practice.expectedPoints.length>0&&heading(hospitalityLabel(language,3))}{lesson.practice.expectedPoints.map((point,i)=><View key={i}>{body(point)}{translation&&<TranslationText>{translation.practice.expectedPoints[i]}</TranslationText>}</View>)}<Button title={record.completed?'✓ この日の学習を完了しました':'この日の学習を完了する'} disabled={disabled||record.completed} onPress={()=>onChange({...record,completed:true})}/></>}
 <Modal visible={confirm!==null} transparent animationType="none" onRequestClose={()=>setConfirm(null)}><View style={s.modal}><View style={[s.dialog,{backgroundColor:colors.background}]}>{body(confirm==='restart'?'この単元の回答を消して、もう一度解きますか？':'回答を提出して、正解と解説を確認しますか？')}<Button title="キャンセル" onPress={()=>setConfirm(null)}/><Button title="確認" disabled={disabled} onPress={()=>{onChange(confirm==='restart'?{...record,answers:{},submitted:false,completed:false}:{...record,submitted:true});setConfirm(null);}}/></View></View></Modal>
 <Modal visible={zoom} animationType="none" onRequestClose={()=>setZoom(false)}><Surface reading><Button title={t('imageClose')} onPress={()=>setZoom(false)}/><ScrollView contentContainerStyle={{padding:12}}>{figure&&<Image source={figure} accessibilityLabel={hotelIllustrationAlt(lesson.id,language,lesson.illustration.alt)} resizeMode="contain" style={[s.figure,hotelIllustrationAspectRatio(lesson.id)?{aspectRatio:hotelIllustrationAspectRatio(lesson.id)}:undefined]}/>}<ScrollView horizontal>{figure&&<Image source={figure} accessibilityLabel={hotelIllustrationAlt(lesson.id,language,lesson.illustration.alt)} resizeMode="contain" style={{width:1200,height:1200/(hotelIllustrationAspectRatio(lesson.id)??(1200/760))}}/>}</ScrollView>{body(lesson.illustration.caption)}</ScrollView></Surface></Modal>
 </>;
}
const s=StyleSheet.create({content:{padding:16,paddingBottom:40,gap:12,width:'100%',maxWidth:980,alignSelf:'center'},panel:{padding:24},heading:{fontSize:19,lineHeight:30,fontWeight:'700',color:'#302c26'},body:{fontSize:17,lineHeight:29,color:'#302c26'},button:{padding:12,borderWidth:1,borderRadius:8,marginVertical:5,minHeight:48},section:{paddingVertical:14,borderTopWidth:1,gap:8},figure:{width:'100%',aspectRatio:1.58},modal:{flex:1,backgroundColor:'#0008',justifyContent:'center',padding:24},dialog:{padding:24,borderRadius:12,width:'100%',maxWidth:560,alignSelf:'center'}});
