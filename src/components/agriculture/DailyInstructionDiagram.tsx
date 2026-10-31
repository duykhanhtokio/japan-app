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
'flower-packaging':require('../../../assets/agriculture/daily-learning-20261031/flower-packaging.png'),
'flower-use':require('../../../assets/agriculture/daily-learning-20261031/flower-use.png'),
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
export function DailyInstructionDiagram({kind,title,caption,alt,colors}:{kind:DailyDiagramKind;title:string;caption:string;alt:string;colors:{text:string;translation:string;translationText:string;border:string}}){return <View style={{gap:8,marginVertical:12}} testID={`agri-daily-diagram-${kind}`}><Text style={{color:colors.translationText,fontWeight:'700',fontSize:19,lineHeight:29}}>{title}</Text><ZoomableFigure source={assets[kind]} width={1160} height={660} altJa={alt} testID={`agri-daily-diagram-${kind}`} colors={colors} allowExpandedView/><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{caption}</Text></View>; }
