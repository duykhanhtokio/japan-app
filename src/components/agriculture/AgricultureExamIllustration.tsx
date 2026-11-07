import {Text,View} from 'react-native';
import illustrations from '@/data/agriculture/exam-illustrations.json';
import figures from '@/data/agriculture/recognition-images.json';
import lessonData from '@/data/agriculture/lessons.ja.json';
import {getAgricultureFigureAsset} from './RecognitionImages';
import {ZoomableFigure,type FigureMask} from './ZoomableFigure';
type Illustration={id:string;revision:string;figureId:string;sourceAssetSha256:string;titleJa:string;altJa:string;masks:FigureMask[];scopeLevels:string[]};
type QuestionSource={lessonId:string;lessonSourceHash:string};
type Colors={text:string;translation:string;translationText:string;border:string};
function resolve(id:string,revision:string|undefined,level:string,questionSource:QuestionSource) {
 const lesson=lessonData.lessons.find(x=>x.id===questionSource?.lessonId&&x.levels.includes(level));
 if(!lesson||!questionSource.lessonSourceHash||lesson.sourceHash!==questionSource.lessonSourceHash)return null;
 const item=(illustrations.illustrations as Illustration[]).find(x=>x.id===id&&x.revision===revision&&x.scopeLevels.includes(level));
 if(!item)return null;
 const figure=figures.images.find(x=>x.id===item.figureId&&x.assetSha256===item.sourceAssetSha256&&x.scopeLevels.includes(level));
 if(!figure)return null;
 if(!Array.isArray(figure.lessonIds))return null;
 const boundLessons=figure.lessonIds.map(id=>lessonData.lessons.find(x=>x.id===id));
 if(boundLessons.some(x=>!x))return null;
 const applicableLessons=boundLessons.filter(x=>x?.levels.includes(level));
 const hashes=figure.lessonSourceHashes as Record<string,string|undefined>|undefined;
 if(!hashes)return null;
 if(!applicableLessons.length||applicableLessons.some(x=>!x||!hashes[x.id]||hashes[x.id]!==x.sourceHash))return null;
 const source=getAgricultureFigureAsset(figure.assetKey);
 return source?{item,figure,source}:null;
}
export const hasAgricultureExamIllustration=(id:string,revision:string|undefined,level:string,questionSource:QuestionSource)=>!!resolve(id,revision,level,questionSource);
export function AgricultureExamIllustration({id,revision,level,questionSource,colors}:{id:string;revision?:string;level:string;questionSource:QuestionSource;colors:Colors}) {
 const resolved=resolve(id,revision,level,questionSource);
 if(!resolved)return <Text accessibilityRole="alert" style={{color:colors.text,fontSize:17,lineHeight:29}}>参考図を読み込めません。</Text>;
 const {item,figure,source}=resolved;
 return <View testID={`exam-figure-${id}`} style={{width:'100%',maxWidth:720,alignSelf:'center',padding:12,borderWidth:1,borderRadius:10,borderColor:colors.border,backgroundColor:colors.translation,gap:8}}>
  <Text style={{fontSize:17,lineHeight:27,color:colors.translationText}}>{item.titleJa}</Text>
  <ZoomableFigure source={source} width={figure.width} height={figure.height} altJa={item.altJa} testID={`exam-figure-${id}`} colors={colors} masks={item.masks} allowExpandedView/>
 </View>;
}
