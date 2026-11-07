import {Text,View} from 'react-native';
import {ZoomableFigure} from './ZoomableFigure';

type Colors={text:string;translation:string;translationText:string;border:string};
const source=require('../../../assets/agriculture/royal-weekly-20261107/week01/rice-husking-polishing.webp');

export function RiceProcessFigure({colors}:{colors:Colors}) {
 return <View testID="agri-royal-rice-process" style={{gap:10,marginVertical:16}}>
  <Text style={{color:colors.text,fontSize:19,lineHeight:29,fontWeight:'700'}}>もみ・玄米・白米</Text>
  <ZoomableFigure source={source} width={1754} height={897} altJa="左はもみ殻に包まれたもみ、中央はもみ殻を除いた玄米、右は精米した白米の外観例です。もみ殻とぬかも別に示しています。" testID="agri-royal-rice-process" colors={colors} allowExpandedView/>
  <Text style={{color:colors.translationText,fontSize:17,lineHeight:28}}>左：もみ　中央：玄米　右：白米</Text>
  <Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>もみ殻を除くと玄米になり、玄米を精米すると白米になります。図は外観を比べるための例で、実際の粒の大きさを示すものではありません。</Text>
 </View>;
}
