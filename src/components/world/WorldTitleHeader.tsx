import { StyleSheet, Text, View } from 'react-native';
import { RoyalBackButton, RoyalTitlePanel, ROYAL, ROYAL_FONT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT } from '@/components/ui/RoyalSurface';

type Props = { title: string; subtitle?: string; detail?: string; onBack: () => void };

/** One full-width title position below Back on every world screen. */
export function WorldTitleHeader({ title, subtitle, detail, onBack }: Props) {
  return <View style={s.header}>
    <View style={s.backRow}><RoyalBackButton onPress={onBack}/></View>
    <View style={s.titleRow}>
      <RoyalTitlePanel style={s.titlePanel}>
        <Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>{title}</Text>
      </RoyalTitlePanel>
    </View>
    {!!subtitle && <Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.subtitle}>{subtitle}</Text>}
    {!!detail && <Text {...ROYAL_TEXT_FIT} numberOfLines={2} style={s.detail}>{detail}</Text>}
  </View>;
}

const s = StyleSheet.create({
  header: { width:'100%',alignSelf:'stretch',alignItems:'center' },
  backRow: { width:'100%',height:52,paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop,alignItems:'flex-start' },
  titleRow:{width:'100%',height:76,position:'relative'},
  titlePanel:{position:'absolute',left:0,right:0,height:76},
  title:{alignSelf:'stretch',color:ROYAL.white,fontFamily:ROYAL_FONT.heading,fontSize:24,lineHeight:32,textAlign:'center',includeFontPadding:false},
  subtitle:{alignSelf:'stretch',color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:13,lineHeight:18,textAlign:'center',marginTop:-3,textShadowColor:'#061020',textShadowOffset:{width:0,height:2},textShadowRadius:3},
  detail:{alignSelf:'stretch',color:ROYAL.white,fontFamily:ROYAL_FONT.body,fontSize:12,lineHeight:17,textAlign:'center',paddingHorizontal:18,marginTop:2,textShadowColor:'#061020',textShadowOffset:{width:0,height:2},textShadowRadius:3},
});
