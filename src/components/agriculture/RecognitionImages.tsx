import {useState} from 'react';
import {Image,Pressable,StyleSheet,Text,View,useWindowDimensions,type ImageSourcePropType} from 'react-native';
import data from '@/data/agriculture/recognition-images.json';

const assets:Record<string,ImageSourcePropType>={
 cabbage:require('../../../assets/agriculture/recognition/cabbage-v1.webp'),
 'chinese-cabbage':require('../../../assets/agriculture/recognition/chinese-cabbage-v1.webp'),
 lettuce:require('../../../assets/agriculture/recognition/lettuce-v1.webp'),
 spinach:require('../../../assets/agriculture/recognition/spinach-v1.webp'),
 onion:require('../../../assets/agriculture/recognition/onion-v1.webp'),
 daikon:require('../../../assets/agriculture/recognition/daikon-v1.webp'),
 'indica-brown-rice':require('../../../assets/agriculture/recognition/indica-brown-rice-v1.webp'),
 'japonica-brown-rice':require('../../../assets/agriculture/recognition/japonica-brown-rice-v1.webp'),
 'plant-organ-positions':require('../../../assets/agriculture/recognition/plant-organ-positions-v1.webp'),
 'sowing-patterns':require('../../../assets/agriculture/recognition/sowing-patterns-v1.webp'),
 'soil-handtest-states':require('../../../assets/agriculture/recognition/soil-handtest-states-v1.webp'),
 'nursery-containers':require('../../../assets/agriculture/recognition/nursery-containers-v1.webp'),
 potato:require('../../../assets/agriculture/recognition/potato-v1.webp'),
 'sweet-potato':require('../../../assets/agriculture/recognition/sweet-potato-v1.webp'),
 carrot:require('../../../assets/agriculture/recognition/carrot-v1.webp'),
 tomato:require('../../../assets/agriculture/recognition/tomato-v1.webp'),
 eggplant:require('../../../assets/agriculture/recognition/eggplant-v1.webp'),
 cucumber:require('../../../assets/agriculture/recognition/cucumber-v1.webp'),
};
type RecognitionImage={
 id:string;lessonIds:string[];lessonSourceHashes:Record<string,string>;
 titleJa:string;altJa:string;observationJa:string;limitJa:string;
 labelsJa?:string[];
 allowExpandedView?:boolean;
 assetKey:string;width:number;height:number;
};
type Colors={text:string;translation:string;translationText:string;border:string};
const images:RecognitionImage[]=Array.isArray(data.images)?data.images:[];
const matchesLesson=(item:RecognitionImage,lessonId:string,lessonSourceHash:string)=>item.lessonIds?.includes(lessonId)
 &&item.lessonSourceHashes?.[lessonId]===lessonSourceHash
 &&Object.prototype.hasOwnProperty.call(assets,item.assetKey)
 &&Number.isFinite(item.width)&&item.width>0&&Number.isFinite(item.height)&&item.height>0
 &&!!item.titleJa&&!!item.altJa&&!!item.observationJa&&!!item.limitJa;

export function hasRecognitionImage(lessonId:string,lessonSourceHash:string,assetKey:string) {
 return images.some(item=>item.assetKey===assetKey&&matchesLesson(item,lessonId,lessonSourceHash));
}

export function RecognitionImages({lessonId,lessonSourceHash,colors}:{lessonId:string;lessonSourceHash:string;colors:Colors}) {
 const {height,width}=useWindowDimensions();
 const [expanded,setExpanded]=useState<Record<string,boolean>>({});
 const artMaxHeight=Math.max(160,Math.min(420,height-160));
 const visible=images.filter(item=>matchesLesson(item,lessonId,lessonSourceHash));
 return <>{visible.map(item=><View key={item.id} testID={item.id} style={[s.figure,{backgroundColor:colors.translation,borderColor:colors.border}]}>
  <Text style={[s.title,{color:colors.translationText}]}>{item.titleJa}</Text>
  {item.allowExpandedView&&Math.min(width-66,688)>artMaxHeight*(item.width/item.height)+8&&<Pressable accessibilityRole="button" testID={`${item.id}-expand`} accessibilityLabel={expanded[item.id]?'図を縮小':'図を拡大'} onPress={()=>setExpanded(current=>({...current,[item.id]:!current[item.id]}))} style={[s.expand,{borderColor:colors.border}]}><Text style={[s.body,{color:colors.translationText}]}>{expanded[item.id]?'図を縮小':'図を拡大'}</Text></Pressable>}
  <Image testID={`${item.id}-image`} source={assets[item.assetKey]} accessibilityLabel={item.altJa} resizeMode="contain" style={{width:'100%',maxWidth:expanded[item.id]?undefined:artMaxHeight*(item.width/item.height),aspectRatio:item.width/item.height,alignSelf:'center'}}/>
  {!!item.labelsJa?.length&&<View style={{gap:4}}>{item.labelsJa.map((label,index)=><Text key={`${index}-${label}`} style={[s.body,{color:colors.translationText}]}>{label}</Text>)}</View>}
  <Text style={[s.label,{color:colors.translationText}]}>観察の手掛かり</Text>
  <Text style={[s.body,{color:colors.translationText}]}>{item.observationJa}</Text>
  <Text style={[s.label,{color:colors.translationText}]}>見分けるときの限界</Text>
  <Text style={[s.body,{color:colors.translationText}]}>{item.limitJa}</Text>
 </View>)}</>;
}

const s=StyleSheet.create({
 figure:{width:'100%',maxWidth:720,alignSelf:'center',marginVertical:16,padding:16,gap:10,borderWidth:1,borderRadius:12},
 title:{fontSize:20,lineHeight:31,fontWeight:'700'},
 label:{fontSize:17,lineHeight:28,fontWeight:'700',marginTop:4},
 body:{fontSize:17,lineHeight:29},
 expand:{minHeight:44,paddingHorizontal:12,paddingVertical:8,borderWidth:1,borderRadius:8,alignSelf:'flex-start',justifyContent:'center'},
});
