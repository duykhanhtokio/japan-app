import {AgricultureNativeFigureRuby} from './AgricultureNativeFigureRuby';
import {FRUIT_TREE_EXAMPLES} from './NativeFigureReadingSource';
import figureAlt from '@/data/agriculture/fruit-tree-comparison-alt.json';
import {Text,View} from 'react-native';
import type {AgricultureLesson} from '@/data/agriculture';
import type {AgricultureTranslation} from '@/data/agriculture/translations';
import {ZoomableFigure} from './ZoomableFigure';

const sourceHash='b915024a36469c05ff9670fd762bcd4e2538e4fbfc1b98c603804ce104c1ddd5';
const source=require('../../../assets/agriculture/royal-weekly-20261107/week01/evergreen-deciduous-tree-examples.webp');
type Colors={text:string;translation:string;translationText:string;border:string};
type Props={lesson:AgricultureLesson;level?:string;translation:AgricultureTranslation|null;showTranslation:boolean;language:string;colors:Colors};

export function FruitTreeComparison({lesson,level,translation,showTranslation,language,colors}:Props) {
 if(lesson.id!=='agr-fruit'||lesson.sourceHash!==sourceHash)return null;
 const introduction=lesson.paragraphs.find(p=>p.id==='agr-fruit-p1');
 const examples=FRUIT_TREE_EXAMPLES
  .map(example=>({...example,paragraph:lesson.paragraphs.find(p=>p.id===example.id)}));
 if(!introduction||examples.some(example=>!example.paragraph))return null;
 const readingContext={lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,lessonRevision:lesson.revision,level,color:colors.translationText};
 const translated=translation?.sourceHash===sourceHash?translation:null;
 const localizedAlt=showTranslation&&translated&&figureAlt.sourceHash===lesson.sourceHash
  ?(figureAlt.alt as Record<string,string>)[language]:undefined;
 const alt=localizedAlt||figureAlt.alt.ja;
 return <View testID="agri-royal-fruit-tree-comparison" style={{gap:10,marginVertical:16}}>
  <AgricultureNativeFigureRuby {...readingContext} field="title" text={introduction.titleJa} style={{color:colors.text,fontSize:19,lineHeight:29,fontWeight:'700'}}/>
  <ZoomableFigure source={source} width={1774} height={887} altJa={alt} testID="agri-royal-fruit-tree-comparison" colors={colors} allowExpandedView/>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
   {examples.map((example,i)=><View key={example.id} testID={`agri-tree-class-${example.id}`} style={{flexGrow:1,flexBasis:220,gap:6}}>
    <AgricultureNativeFigureRuby {...readingContext} field={`exampleTitle:${i}`} text={`${example.paragraph!.titleJa}（${example.treeJa}）`} style={{color:colors.text,fontSize:17,lineHeight:28,fontWeight:'700'}}/>
    <AgricultureNativeFigureRuby {...readingContext} field={`exampleBody:${i}`} text={example.paragraph!.textJa} style={{color:colors.text,fontSize:16,lineHeight:27}}/>
    {showTranslation&&translated&&<Text testID={`agri-tree-class-translation-${example.id}`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.paragraphTitles[example.id]}{'\n'}{translated.paragraphs[example.id]}</Text>}
   </View>)}
  </View>
  <AgricultureNativeFigureRuby {...readingContext} field="introduction" text={introduction.textJa} style={{color:colors.text,fontSize:16,lineHeight:27}}/>
  {showTranslation&&translated&&<Text testID="agri-tree-class-translation-principle" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.paragraphs[introduction.id]}</Text>}
 </View>;
}
