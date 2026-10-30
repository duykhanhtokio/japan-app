import {useState} from 'react';
import {Pressable,ScrollView,Text,View} from 'react-native';
import type {ManufacturingLesson,ManufacturingQuestion} from '@/data/manufacturing';
import {manufacturingUi} from '@/data/manufacturing/ui';
import {manufacturingRecognitionPackForLesson,manufacturingRecognitionCaption,manufacturingRecognitionQuestionAssets,type RecognitionPack,type RecognitionAsset} from '@/data/manufacturing/recognition38';
import {ReadingAppearanceControl,TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {TokuteiHeader} from '@/components/tokutei/TokuteiChrome';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
import {recognitionSources} from './recognition38-assets';

function Figures({pack,assets,language,quiz=false}:{pack:RecognitionPack;assets:RecognitionAsset[];language:string;quiz?:boolean}){
 return <>{assets.map(asset=>{
  const imageSource=Object.prototype.hasOwnProperty.call(recognitionSources,asset.file)?recognitionSources[asset.file]:undefined;
  if(!imageSource)return null;
  return <SupplementalFigure key={asset.id} item={{id:pack.id+'-'+asset.id,lessonId:pack.lessonIds[0],lessonSourceHash:pack.lessonSourceHashes[pack.lessonIds[0]],assetFile:asset.file,width:asset.width,height:asset.height,captionJa:asset.altJa,scopeLimits:[]}} language={language} showTranslation={false} imageSource={imageSource} hideCaption={quiz}/>;
 })}</>;
}

/** Teaching captions belong to the study reader, never to the unsubmitted quiz. */
export function RecognitionReader({lesson,language,onBack,onComplete,saving,saveError}:{lesson:ManufacturingLesson;language:string;onBack:()=>void;onComplete:()=>void;saving:boolean;saveError:boolean}){
 const [show,setShow]=useState(false),{colors}=useStudyAppearance(),pack=manufacturingRecognitionPackForLesson(lesson);
 const t=(key:Parameters<typeof manufacturingUi>[1])=>manufacturingUi(language,key);
 if(!pack)return <><TokuteiHeader title={lesson.titleJa} onBack={onBack}/><Text accessibilityRole="alert">{t('recordMismatch')}</Text></>;
 const caption=show?manufacturingRecognitionCaption(pack,language):null;
 const teaching=pack.assets.filter(asset=>asset.role!=='quiz'&&asset.role!=='quiz_only');
 return <><TokuteiHeader title={pack.titleJa} onBack={onBack}/><ScrollView contentContainerStyle={{padding:16,paddingBottom:36,gap:12,width:'100%',maxWidth:1100,alignSelf:'center'}}>
  <ReadingAppearanceControl/>
  {language!=='ja'&&<Pressable accessibilityRole="button" onPress={()=>setShow(value=>!value)} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}><Text style={{color:colors.text,fontSize:16}}>{t(show?'translationHide':'translationShow')}</Text></Pressable>}
  <Text selectable style={{color:colors.text,fontSize:17,lineHeight:29}}>{pack.captionJa}</Text>
  {caption&&<TranslationText>{caption}</TranslationText>}
  {show&&language!=='ja'&&!caption&&<TranslationText>{t('translationPending')}</TranslationText>}
  <Figures pack={pack} assets={teaching.length?teaching:pack.assets} language={language}/>
  {saveError&&<Text accessibilityRole="alert" style={{color:colors.text}}>{t('saveError')}</Text>}
  <Pressable accessibilityRole="button" disabled={saving} accessibilityState={{disabled:saving}} onPress={onComplete} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}><Text style={{color:colors.text,fontSize:17,textAlign:'center'}}>{t(saving?'saving':'complete')}</Text></Pressable>
 </ScrollView></>;
}

export function RecognitionQuestionFigures({question,language}:{question:ManufacturingQuestion;language:string}){
 const found=manufacturingRecognitionQuestionAssets(question);
 if(!found)return null;
 // Exact image bindings select quiz assets only. No pack caption or rationale is rendered here.
 return <View testID="manufacturing-recognition-question-images"><Figures pack={found.pack} assets={found.assets} language={language} quiz/></View>;
}
