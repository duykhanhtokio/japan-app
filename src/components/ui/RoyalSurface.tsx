import type { PropsWithChildren, ReactNode } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { ROYAL_CONTROL_SIZE, ROYAL_LAYOUT, ROYAL_SAFE_AREA, ROYAL_TEXT_FIT, useRoyalGroupHeight, useRoyalGroupSize, type RoyalContentGroup } from './RoyalPositioning';

export { ROYAL_CONTENT_GROUP, ROYAL_CONTROL_SIZE, ROYAL_LAYOUT, ROYAL_PLACEMENT, ROYAL_SAFE_AREA, ROYAL_TEXT_FIT, resolveRoyalGrid, useRoyalGroupHeight, useRoyalGroupSize, useRoyalPositioning } from './RoyalPositioning';

const WIDE_BUTTON = require('../../../assets/app/ui/royal-af/button-wide-v2.png');
const BACK_BUTTON = require('../../../assets/app/ui/royal-af/button-back-curved-a-v1.png');
const DIALOGUE_FRAME = require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const LOCK_CREST = require('../../../assets/app/ui/royal-af/lock-grape-v2.png');
const HINT_LANTERN = require('../../../assets/app/ui/royal-af/hint-red-lantern-v2.png');
const LOCATION_CARD_FRAME = require('../../../assets/app/ui/royal-af/location-card-frame-grape-ivory-v2.png');
const PLACE_ROW_FRAME = require('../../../assets/app/ui/royal-af/place-row-frame-grape-ivory-40-60-v3.png');
const CHEVRON = require('../../../assets/app/ui/royal-af/chevron-right-v2.png');
const CHECKMARK = require('../../../assets/app/ui/royal-af/checkmark-v2.png');
const CLOSE_X = require('../../../assets/app/ui/royal-af/close-x-v2.png');
const SELECTION_PANEL = require('../../../assets/app/ui/royal-af/selection-panel-rect-v1.png');
const MAP_MARKER_FRAME = require('../../../assets/app/ui/royal-af/start-frame-transparent-v1.png');
const MAP_MARKER_FILL = require('../../../assets/app/ui/royal-af/map-marker-fill-v1.png');

export const ROYAL = {
  ink: '#07101f', lacquer: '#0b1830', lacquerLight: '#142847',
  gold: '#cba55a', paleGold: '#f2db9b', darkGold: '#72501f',
  ivory: '#e8e2d6', ivoryDeep: '#d5ccbc', white: '#fffdf7',
};

export const ROYAL_TYPE = {
  pageTitle: 28,
  fieldLabel: 13,
  fieldValue: 17,
  helper: 13,
  explanation: 15,
  explanationLine: 22,
  option: 17,
  optionSecondary: 13,
  dialogue: 18,
  dialogueLine: 26,
  button: 18,
};

export const ROYAL_FONT = {
  heading: 'RoyalSerifJP-SemiBold',
  body: 'RoyalSansJP-Medium',
} as const;

export function RoyalField({label,children,style,compact=false,wideLabel=false,sizingGroup}:PropsWithChildren<{label:string;style?:StyleProp<ViewStyle>;compact?:boolean;wideLabel?:boolean;sizingGroup?:RoyalContentGroup}>) {
  const equalHeight = useRoyalGroupHeight(sizingGroup, compact ? ROYAL_LAYOUT.registrationFieldHeight : 104);
  const plaque = useRoyalGroupSize(sizingGroup, 'label-plaque', wideLabel ? 150 : compact ? 106 : 116, compact ? 36 : 43);
  const topInset = Math.max(compact ? 13 : 17, plaque.size.height - (compact ? 23 : 26));
  const bodyMinHeight = Math.max(compact ? 69 : 87, equalHeight.height - topInset);
  return <View onLayout={equalHeight.onLayout} style={[s.assetField,compact&&s.assetFieldCompact,equalHeight.groupStyle,{paddingTop:topInset},style]}>
    <ImageBackground source={DIALOGUE_FRAME} resizeMode="stretch" style={[s.fieldIvoryBody,compact&&s.fieldIvoryBodyCompact,{minHeight:bodyMinHeight}]}><View style={[s.fieldBody,compact&&s.fieldBodyCompact]}>{children}</View></ImageBackground>
    <ImageBackground onLayout={plaque.onLayout} source={WIDE_BUTTON} resizeMode="stretch" style={[s.fieldLabelPlaque,compact&&s.fieldLabelPlaqueCompact,wideLabel&&s.fieldLabelPlaqueWide,plaque.groupStyle]}><Text maxFontSizeMultiplier={1} style={[s.fieldLabelText,compact&&s.fieldLabelTextCompact,wideLabel&&s.fieldLabelTextWide]}>{label}</Text></ImageBackground>
  </View>;
}

export function RoyalLabelPlaque({children,style}:PropsWithChildren<{style?:StyleProp<ViewStyle>}>) {
  return <ImageBackground source={WIDE_BUTTON} resizeMode="stretch" style={[s.labelPlaque,style]}>
    <Text maxFontSizeMultiplier={1} style={s.labelPlaqueText}>{children}</Text>
  </ImageBackground>;
}

export function RoyalCapsule({label,style,textStyle}: {label:string;style?:StyleProp<ViewStyle>;textStyle?:StyleProp<TextStyle>}) {
  return <ImageBackground source={WIDE_BUTTON} resizeMode="stretch" style={[s.capsule,style]}>
    <Text maxFontSizeMultiplier={1} style={[s.capsuleText,textStyle]}>{label}</Text>
  </ImageBackground>;
}

export function RoyalIvoryPill({primary,secondary,style}: {primary:string;secondary?:string;style?:StyleProp<ViewStyle>}) {
  return <ImageBackground source={DIALOGUE_FRAME} resizeMode="stretch" style={[s.ivoryPill,style]}>
    <Text maxFontSizeMultiplier={1} style={s.ivoryPillPrimary}>{primary}</Text>
    {!!secondary&&<Text maxFontSizeMultiplier={1} style={s.ivoryPillSecondary}>{secondary}</Text>}
  </ImageBackground>;
}

export function RoyalMapPill({primary,secondary,color,style}: {primary:string;secondary?:string;color:string;style?:StyleProp<ViewStyle>}) {
  return <View style={[s.mapPill,style]}>
    <View pointerEvents="none" style={s.mapPillFillClip}><Image source={MAP_MARKER_FILL} resizeMode="stretch" tintColor={color} style={s.fillImage}/></View>
    <View pointerEvents="none" style={s.mapPillFrame}><Image source={MAP_MARKER_FRAME} resizeMode="stretch" style={s.fillImage}/></View>
    <View style={s.mapPillCopy}><Text maxFontSizeMultiplier={1} style={s.mapPillPrimary}>{primary}</Text>{!!secondary&&<Text maxFontSizeMultiplier={1} style={s.mapPillSecondary}>{secondary}</Text>}</View>
  </View>;
}

export function RoyalLockCrest({style}:{style?:StyleProp<ViewStyle>}) {
  return <View pointerEvents="none" style={[s.lockCrest,style]}><Image source={LOCK_CREST} resizeMode="contain" style={s.fillImage}/></View>;
}

export function RoyalChevron({style,direction='right',variant='navigation'}:{style?:StyleProp<ViewStyle>;direction?:'right'|'down';variant?:'navigation'|'selector'|'card'}) {
  return <View pointerEvents="none" style={[s.chevronBox,variant==='selector'&&s.chevronSelector,variant==='card'&&s.chevronCard,style]}><Image source={CHEVRON} resizeMode="contain" style={[s.fillImage,direction==='down'&&s.chevronDown]}/></View>;
}

export function RoyalHintButton({onPress,style}:{onPress:()=>void;style?:StyleProp<ViewStyle>}) {
  return <Pressable accessibilityRole="button" accessibilityLabel="ヒント" onPress={onPress} style={({pressed})=>[s.hintAsset,style,pressed&&s.hintPressed]}><Image source={HINT_LANTERN} resizeMode="contain" style={s.fillImage}/></Pressable>;
}

export function RoyalSelectionMark({style}:{style?:StyleProp<ViewStyle>}) {
  return <View pointerEvents="none" style={[s.selectionMark,style]}><Image source={CHECKMARK} resizeMode="contain" style={s.fillImage}/></View>;
}

export function RoyalCloseButton({onPress,style}:{onPress:()=>void;style?:StyleProp<ViewStyle>}) {
  return <Pressable accessibilityRole="button" accessibilityLabel="閉じる" onPress={onPress} style={({pressed})=>[s.closeButton,style,pressed&&s.closePressed]}><Image source={CLOSE_X} resizeMode="contain" style={s.fillImage}/></Pressable>;
}

export function RoyalSelectionPanel({children,style}:PropsWithChildren<{style?:StyleProp<ViewStyle>}>) {
  return <ImageBackground source={SELECTION_PANEL} resizeMode="stretch" style={[s.selectionPanel,style]}>{children}</ImageBackground>;
}

export function RoyalOptionRow({children,onPress,style,contentStyle,sizingGroup}:PropsWithChildren<{onPress:()=>void;style?:StyleProp<ViewStyle>;contentStyle?:StyleProp<ViewStyle>;sizingGroup?:RoyalContentGroup}>) {
  const equalHeight = useRoyalGroupHeight(sizingGroup, ROYAL_LAYOUT.selectorRowHeight);
  return <Pressable onLayout={equalHeight.onLayout} accessibilityRole="button" onPress={onPress} style={({pressed})=>[s.optionPressable,equalHeight.groupStyle,style,pressed&&s.optionPressed]}>
    <ImageBackground source={DIALOGUE_FRAME} resizeMode="stretch" style={[s.optionRow,equalHeight.groupStyle,contentStyle]}>{children}</ImageBackground>
  </Pressable>;
}

export function RoyalLocationCard({source,children,style}:PropsWithChildren<{source:ImageSourcePropType;style?:StyleProp<ViewStyle>}>) {
  return <View style={[s.locationCard,style]}>
    <Image source={source} resizeMode="cover" style={s.locationCardScene}/>
    <Image source={LOCATION_CARD_FRAME} resizeMode="stretch" style={s.locationCardFrame}/>
    <View style={StyleSheet.absoluteFill}>{children}</View>
  </View>;
}

export function RoyalPlaceRow({source,children,style}:PropsWithChildren<{source?:ImageSourcePropType;style?:StyleProp<ViewStyle>}>) {
  return <View style={[s.placeRow,style]}>
    {!!source&&<Image source={source} resizeMode="cover" style={s.placeRowScene}/>} 
    <Image source={PLACE_ROW_FRAME} resizeMode="stretch" style={s.placeRowFrame}/>
    <View style={StyleSheet.absoluteFill}>{children}</View>
  </View>;
}

export function RoyalButton({children,label,onPress,disabled=false,style,compact=false,round=false,accessibilityLabel,sizingGroup}:PropsWithChildren<{children?:ReactNode;label?:string;onPress:()=>void;disabled?:boolean;style?:StyleProp<ViewStyle>;compact?:boolean;round?:boolean;accessibilityLabel?:string;sizingGroup?:RoyalContentGroup}>) {
  const equalHeight = useRoyalGroupHeight(sizingGroup, compact ? 62 : 78);
  return <Pressable onLayout={equalHeight.onLayout} accessibilityRole="button" accessibilityLabel={accessibilityLabel} disabled={disabled} onPress={onPress} style={({pressed})=>[s.assetButton,compact&&s.assetButtonCompact,equalHeight.groupStyle,style,disabled&&s.disabled,pressed&&!disabled&&s.buttonPressed]}>
    <ImageBackground source={WIDE_BUTTON} resizeMode="stretch" style={s.assetButtonImage}>{children??<Text style={s.buttonText}>{label}</Text>}</ImageBackground>
  </Pressable>;
}

export function RoyalBackButton({onPress,style}:{onPress:()=>void;style?:StyleProp<ViewStyle>}) {
  return <Pressable accessibilityRole="button" accessibilityLabel="戻る" onPress={onPress} hitSlop={8} style={({pressed})=>[s.backAsset,style,pressed&&s.backPressed]}><ImageBackground source={BACK_BUTTON} resizeMode="contain" style={s.backAssetImage}/></Pressable>;
}

export function RoyalTitlePanel({children,style,sizingGroup}:PropsWithChildren<{style?:StyleProp<ViewStyle>;sizingGroup?:RoyalContentGroup}>) {
  const equalHeight = useRoyalGroupHeight(sizingGroup, 76);
  return <ImageBackground onLayout={equalHeight.onLayout} source={WIDE_BUTTON} resizeMode="stretch" style={[s.titlePanel,equalHeight.groupStyle,style]}>{children}</ImageBackground>;
}

export function RoyalInfoPanel({children,style,innerStyle,label='INFO',sizingGroup}:PropsWithChildren<{style?:StyleProp<ViewStyle>;innerStyle?:StyleProp<ViewStyle>;label?:string;sizingGroup?:RoyalContentGroup}>) {
  const equalHeight = useRoyalGroupHeight(sizingGroup, 118);
  const plaque = useRoyalGroupSize(sizingGroup, 'label-plaque', 150, 64);
  const topInset = Math.max(32, plaque.size.height - 32);
  const bodyMinHeight = Math.max(86, equalHeight.height - topInset);
  return <View onLayout={equalHeight.onLayout} style={[s.infoPanel,equalHeight.groupStyle,{paddingTop:topInset},style]}>
    <ImageBackground source={DIALOGUE_FRAME} resizeMode="stretch" style={[s.infoIvory,{minHeight:bodyMinHeight}]}><View style={[s.infoContent,innerStyle]}>{children}</View></ImageBackground>
    <ImageBackground onLayout={plaque.onLayout} source={WIDE_BUTTON} resizeMode="stretch" style={[s.infoPlaque,plaque.groupStyle]}><Text maxFontSizeMultiplier={1} style={s.infoPlaqueText}>{label}</Text></ImageBackground>
  </View>;
}

export function RoyalDialogueFrame({children,style}:PropsWithChildren<{style?:StyleProp<ViewStyle>}>) {
  return <ImageBackground source={DIALOGUE_FRAME} resizeMode="stretch" style={[s.dialogueAsset,style]}>{children}</ImageBackground>;
}

const s=StyleSheet.create({
  fieldInner:{minHeight:76,flexDirection:'row',alignItems:'stretch'},assetField:{width:'100%',minHeight:104,paddingTop:17,position:'relative'},assetImage:{borderRadius:0},
  fieldIvoryBody:{minHeight:87,justifyContent:'center',paddingHorizontal:ROYAL_SAFE_AREA.field.horizontal,paddingTop:ROYAL_SAFE_AREA.field.top,paddingBottom:ROYAL_SAFE_AREA.field.bottom},
  fieldLabelPlaque:{position:'absolute',zIndex:4,left:18,top:0,minWidth:116,maxWidth:'72%',minHeight:43,alignItems:'center',justifyContent:'center',paddingHorizontal:28,paddingVertical:8},
  fieldLabelText:{flexShrink:1,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.fieldLabel,lineHeight:18,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,textShadowColor:'#271805',textShadowOffset:{width:0,height:2},textShadowRadius:3},
  assetFieldCompact:{minHeight:ROYAL_LAYOUT.registrationFieldHeight,paddingTop:13},fieldIvoryBodyCompact:{minHeight:69,paddingHorizontal:ROYAL_SAFE_AREA.compactField.horizontal,paddingTop:ROYAL_SAFE_AREA.compactField.top,paddingBottom:ROYAL_SAFE_AREA.compactField.bottom},fieldLabelPlaqueCompact:{left:16,minWidth:106,minHeight:36,paddingHorizontal:24,paddingVertical:5},fieldLabelPlaqueWide:{left:10,minWidth:150,maxWidth:'94%',paddingHorizontal:28},fieldLabelTextCompact:{fontSize:11,lineHeight:15},fieldLabelTextWide:{fontSize:9,lineHeight:12},
  labelPlaque:{minWidth:116,minHeight:43,alignItems:'center',justifyContent:'center',paddingHorizontal:28,paddingVertical:8},
  labelPlaqueText:{flexShrink:1,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.fieldLabel,lineHeight:18,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,textShadowColor:'#271805',textShadowOffset:{width:0,height:2},textShadowRadius:3},
  capsule:{minWidth:112,minHeight:48,alignItems:'center',justifyContent:'center',paddingHorizontal:30,paddingVertical:10},capsuleText:{flexShrink:1,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:16,lineHeight:22,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,textShadowColor:'#271805',textShadowOffset:{width:0,height:2},textShadowRadius:3},
  ivoryPill:{minWidth:140,minHeight:68,alignItems:'center',justifyContent:'center',paddingHorizontal:ROYAL_LAYOUT.framedTextHorizontalInset,paddingVertical:20},ivoryPillPrimary:{width:'100%',color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:16,lineHeight:22,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},ivoryPillSecondary:{width:'100%',color:'#725d3b',fontFamily:ROYAL_FONT.body,fontSize:11,lineHeight:15,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,marginTop:2},
  mapPill:{position:'relative',minWidth:140,minHeight:68,alignItems:'center',justifyContent:'center',overflow:'hidden'},mapPillFillClip:{position:'absolute',left:'7%',right:'7%',top:'17%',bottom:'17%',overflow:'hidden'},mapPillFrame:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},mapPillCopy:{width:'100%',paddingHorizontal:ROYAL_LAYOUT.framedTextHorizontalInset,alignItems:'center',justifyContent:'center'},mapPillPrimary:{width:'100%',color:ROYAL.ink,fontFamily:ROYAL_FONT.heading,fontSize:16,lineHeight:22,textAlign:'center'},mapPillSecondary:{width:'100%',color:'#302718',fontFamily:ROYAL_FONT.body,fontSize:10.5,lineHeight:14,textAlign:'center'},
  lockCrest:{width:52,height:52,shadowColor:'#f2c55d',shadowOffset:{width:0,height:3},shadowOpacity:.5,shadowRadius:7,elevation:10},fillImage:{width:'100%',height:'100%'},
  chevronBox:{...ROYAL_CONTROL_SIZE.chevronNavigation,alignItems:'center',justifyContent:'center'},chevronSelector:ROYAL_CONTROL_SIZE.chevronSelector,chevronCard:ROYAL_CONTROL_SIZE.chevronCard,chevronDown:{transform:[{rotate:'90deg'}]},
  hintAsset:{width:54,height:68,shadowColor:'#020611',shadowOffset:{width:0,height:5},shadowOpacity:.5,shadowRadius:8,elevation:12},hintPressed:{transform:[{translateY:3},{scale:.96}],opacity:.9},
  selectionMark:{width:27,height:27},
  closeButton:{width:38,height:38,alignItems:'center',justifyContent:'center'},closePressed:{transform:[{translateY:2},{scale:.96}]},
  selectionPanel:{paddingHorizontal:44,paddingTop:52,paddingBottom:48},
  optionPressable:{width:'100%',minHeight:ROYAL_LAYOUT.selectorRowHeight},optionPressed:{opacity:.86,transform:[{translateY:2},{scale:.992}]},optionRow:{minHeight:ROYAL_LAYOUT.selectorRowHeight,flexDirection:'row',alignItems:'center',paddingHorizontal:ROYAL_SAFE_AREA.option.horizontal,paddingVertical:ROYAL_SAFE_AREA.option.vertical},
  locationCard:{aspectRatio:1145/1374,shadowColor:'#020713',shadowOffset:{width:0,height:9},shadowOpacity:.52,shadowRadius:14,elevation:12},locationCardScene:{position:'absolute',left:'8%',right:'8%',top:'8%',height:'61%',borderRadius:12},locationCardFrame:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  placeRow:{aspectRatio:3,shadowColor:'#020713',shadowOffset:{width:0,height:8},shadowOpacity:.5,shadowRadius:12,elevation:11},placeRowScene:{position:'absolute',left:'4.8%',top:'16%',width:'34.4%',height:'68%'},placeRowFrame:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  fieldBody:{minHeight:55,justifyContent:'center',paddingTop:6,paddingHorizontal:7,minWidth:0},
  fieldBodyCompact:{paddingTop:4,paddingHorizontal:5},
  assetButton:{minHeight:78,shadowColor:'#020611',shadowOffset:{width:0,height:8},shadowOpacity:.52,shadowRadius:11,elevation:11},assetButtonCompact:{minHeight:62},assetButtonImage:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:ROYAL_SAFE_AREA.wideButton.horizontal,paddingVertical:ROYAL_SAFE_AREA.wideButton.vertical},
  buttonPressed:{transform:[{translateY:4},{scale:.985}],shadowOpacity:.18},
  buttonText:{color:ROYAL.white,fontFamily:ROYAL_FONT.heading,fontSize:ROYAL_TYPE.button,letterSpacing:.5,textShadowColor:'#000',textShadowOffset:{width:0,height:2},textShadowRadius:3},
  compact:{minHeight:48},round:{borderRadius:999},disabled:{opacity:.38},backAsset:{...ROYAL_CONTROL_SIZE.backTouch,alignSelf:'flex-start',alignItems:'center',justifyContent:'center',shadowColor:'#020611',shadowOffset:{width:0,height:4},shadowOpacity:.5,shadowRadius:7,elevation:9},backAssetImage:ROYAL_CONTROL_SIZE.backArtwork,backPressed:{transform:[{translateY:3},{scale:.96}],opacity:.92},titlePanel:{minHeight:76,alignItems:'center',justifyContent:'center',paddingHorizontal:ROYAL_SAFE_AREA.title.horizontal,paddingVertical:ROYAL_SAFE_AREA.title.vertical},infoPanel:{width:'100%',minHeight:118,paddingTop:32,position:'relative'},infoIvory:{minHeight:86,justifyContent:'center',paddingHorizontal:ROYAL_SAFE_AREA.information.horizontal,paddingTop:ROYAL_SAFE_AREA.information.top,paddingBottom:ROYAL_SAFE_AREA.information.bottom},infoContent:{width:'100%',minHeight:44,alignItems:'center',justifyContent:'center'},infoPlaque:{position:'absolute',zIndex:4,left:18,top:0,minWidth:150,maxWidth:'94%',minHeight:64,alignItems:'center',justifyContent:'center',paddingHorizontal:30,paddingVertical:8},infoPlaqueText:{flexShrink:1,color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:ROYAL_TYPE.fieldLabel,lineHeight:21,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,textShadowColor:'#271805',textShadowOffset:{width:0,height:2},textShadowRadius:3},dialogueAsset:{minHeight:112,paddingHorizontal:ROYAL_SAFE_AREA.dialogue.horizontal,paddingTop:ROYAL_SAFE_AREA.dialogue.top,paddingBottom:ROYAL_SAFE_AREA.dialogue.bottom},
});
