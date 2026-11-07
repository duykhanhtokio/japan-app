import {Text,View} from 'react-native';
import type {AgricultureLesson} from '@/data/agriculture';
import type {AgricultureTranslation} from '@/data/agriculture/translations';
import {ZoomableFigure} from './ZoomableFigure';

const sourceHash='b915024a36469c05ff9670fd762bcd4e2538e4fbfc1b98c603804ce104c1ddd5';
const source=require('../../../assets/agriculture/royal-weekly-20261107/week01/evergreen-deciduous-tree-examples.webp');
type Colors={text:string;translation:string;translationText:string;border:string};
type Props={lesson:AgricultureLesson;translation:AgricultureTranslation|null;showTranslation:boolean;colors:Colors};

export function FruitTreeComparison({lesson,translation,showTranslation,colors}:Props) {
 if(lesson.id!=='agr-fruit'||lesson.sourceHash!==sourceHash)return null;
 const introduction=lesson.paragraphs.find(p=>p.id==='agr-fruit-p1');
 const examples=[{id:'agr-fruit-p2',treeJa:'ウンシュウミカン'},{id:'agr-fruit-p3',treeJa:'リンゴ'}]
  .map(example=>({...example,paragraph:lesson.paragraphs.find(p=>p.id===example.id)}));
 if(!introduction||examples.some(example=>!example.paragraph))return null;
 const translated=translation?.sourceHash===sourceHash?translation:null;
 return <View testID="agri-royal-fruit-tree-comparison" style={{gap:10,marginVertical:16}}>
  <Text style={{color:colors.text,fontSize:19,lineHeight:29,fontWeight:'700'}}>{introduction.titleJa}</Text>
  <ZoomableFigure source={source} width={1774} height={887} altJa="左は葉を付けたウンシュウミカンの木の例、右は葉が落ちた状態のリンゴの木の例です。葉の性質を比べます。" testID="agri-royal-fruit-tree-comparison" colors={colors} allowExpandedView/>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
   {examples.map(example=><View key={example.id} testID={`agri-tree-class-${example.id}`} style={{flexGrow:1,flexBasis:220,gap:6}}>
    <Text style={{color:colors.text,fontSize:17,lineHeight:28,fontWeight:'700'}}>{example.paragraph!.titleJa}（{example.treeJa}）</Text>
    <Text style={{color:colors.text,fontSize:16,lineHeight:27}}>{example.paragraph!.textJa}</Text>
    {showTranslation&&translated&&<Text testID={`agri-tree-class-translation-${example.id}`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.paragraphTitles[example.id]}{'\n'}{translated.paragraphs[example.id]}</Text>}
   </View>)}
  </View>
  <Text style={{color:colors.text,fontSize:16,lineHeight:27}}>{introduction.textJa}</Text>
  {showTranslation&&translated&&<Text testID="agri-tree-class-translation-principle" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.paragraphs[introduction.id]}</Text>}
 </View>;
}
