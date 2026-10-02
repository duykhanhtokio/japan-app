import { useState, type PropsWithChildren } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

// Preserve the source's aspect ratio; text scrolls inside the ivory area.
export default function RoyalReadingFrame({ children }: PropsWithChildren) {
 const [size,setSize]=useState({width:0,height:0});
 return <View onLayout={event=>{const {width,height}=event.nativeEvent.layout;setSize(previous=>previous.width===width&&previous.height===height?previous:{width,height});}} style={s.frame}>
  <Image source={require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png')} resizeMode="contain" style={[StyleSheet.absoluteFill,{width:size.width,height:size.height}]}/>
  <ScrollView style={s.reading} contentContainerStyle={s.copy} nestedScrollEnabled showsVerticalScrollIndicator>{children}</ScrollView>
 </View>;
}
const s=StyleSheet.create({
 frame:{width:'100%',aspectRatio:1600/550,overflow:'hidden'},
 reading:{position:'absolute',left:'13%',right:'13%',top:'25%',bottom:'24%'},
 copy:{flexGrow:1,justifyContent:'center',paddingVertical:4},
});
