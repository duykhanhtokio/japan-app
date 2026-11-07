import type {AgricultureLesson} from '@/data/agriculture';
import {DailyControlledFigure,hasDailyControlledSupport} from './DailyControlledFigure';
import {Text,View,type ImageSourcePropType} from 'react-native';
import {ZoomableFigure} from './ZoomableFigure';
export type DailyDiagramKind='bulb'|'cold-chain'|'cost-labour'|'cultivar-2017'|'fertilizer-label'|'fertilizer-quantity'|'fertilizer-stage'|'flower-packaging'|'flower-use'|'harvest-calendar'|'ph-axis'|'photoperiod'|'plant-flow'|'ratio-scopes'|'rice-consumption'|'rice-water'|'seed-cross'|'self-supply-2019'|'soil-fraction'|'statistics-2019'|'taxonomy'|'variety-rights'|'weather-damage'|'winter-climate';
const assets:Record<DailyDiagramKind,ImageSourcePropType>={
'bulb':require('../../../assets/agriculture/daily-learning-20261031/bulb.png'),
'cold-chain':require('../../../assets/agriculture/daily-learning-20261031/cold-chain.png'),
'cost-labour':require('../../../assets/agriculture/daily-learning-20261031/cost-labour.png'),
'cultivar-2017':require('../../../assets/agriculture/daily-learning-20261031/cultivar-2017.png'),
'fertilizer-label':require('../../../assets/agriculture/daily-learning-20261031/fertilizer-label.png'),
'fertilizer-quantity':require('../../../assets/agriculture/daily-learning-20261031/fertilizer-quantity.png'),
'fertilizer-stage':require('../../../assets/agriculture/daily-learning-20261031/fertilizer-stage.png'),
'flower-packaging':require('../../../assets/agriculture/royal-weekly-20261107/daily/flower-packaging-royal-v2.webp'),
'flower-use':require('../../../assets/agriculture/royal-weekly-20261107/daily/flower-use-royal-v2.webp'),
'harvest-calendar':require('../../../assets/agriculture/daily-learning-20261031/harvest-calendar.png'),
'ph-axis':require('../../../assets/agriculture/daily-learning-20261031/ph-axis.png'),
'photoperiod':require('../../../assets/agriculture/daily-learning-20261031/photoperiod.png'),
'plant-flow':require('../../../assets/agriculture/daily-learning-20261031/plant-flow.png'),
'ratio-scopes':require('../../../assets/agriculture/daily-learning-20261031/ratio-scopes.png'),
'rice-consumption':require('../../../assets/agriculture/daily-learning-20261031/rice-consumption.png'),
'rice-water':require('../../../assets/agriculture/daily-learning-20261031/rice-water.png'),
'seed-cross':require('../../../assets/agriculture/daily-learning-20261031/seed-cross.png'),
'self-supply-2019':require('../../../assets/agriculture/daily-learning-20261031/self-supply-2019.png'),
'soil-fraction':require('../../../assets/agriculture/daily-learning-20261031/soil-fraction.png'),
'statistics-2019':require('../../../assets/agriculture/daily-learning-20261031/statistics-2019.png'),
'taxonomy':require('../../../assets/agriculture/daily-learning-20261031/taxonomy.png'),
'variety-rights':require('../../../assets/agriculture/daily-learning-20261031/variety-rights.png'),
'weather-damage':require('../../../assets/agriculture/daily-learning-20261031/weather-damage.png'),
'winter-climate':require('../../../assets/agriculture/daily-learning-20261031/winter-climate.png'),
};
export function DailyInstructionDiagram(p:{kind:DailyDiagramKind;title:string;caption:string;alt:string;colors:{text:string;translation:string;translationText:string;border:string};lesson?:AgricultureLesson;level?:string;language?:string;showTranslation?:boolean;paragraphIds?:string[]}){const {kind,title,caption,alt,colors}=p;if(p.lesson?.id==='agr-fruit-manage-fertilizer'||p.lesson?.id==='agr-fruit-manage-storage-facility'||p.lesson?.id==='agr-f40-flower-family-label-correction'||p.lesson?.id==='agr-f40-flower-terminology-corrections'||hasDailyControlledSupport(kind,p.lesson?.id))return <DailyControlledFigure {...p} source={assets[kind]}/>;return <View style={{gap:8,marginVertical:12}} testID={`agri-daily-diagram-${kind}`}><Text style={{color:colors.translationText,fontWeight:'700',fontSize:19,lineHeight:29}}>{title}</Text><ZoomableFigure source={assets[kind]} width={kind==='flower-use'?1774:kind==='flower-packaging'?1752:1160} height={kind==='flower-use'?887:kind==='flower-packaging'?897:660} altJa={alt} testID={`agri-daily-diagram-${kind}`} colors={colors} presentation={kind==='flower-use'||kind==='flower-packaging'?'recognition':'diagram'} allowExpandedView/><Text style={{color:colors.translationText,fontSize:kind==='flower-use'||kind==='flower-packaging'?12:16,lineHeight:kind==='flower-use'||kind==='flower-packaging'?20:27}}>{caption}</Text></View>;}
