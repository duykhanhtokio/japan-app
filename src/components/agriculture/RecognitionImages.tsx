import {Image,StyleSheet,Text,View,useWindowDimensions,type ImageSourcePropType} from 'react-native';
import data from '@/data/agriculture/recognition-images.json';

const assets:Record<string,ImageSourcePropType>={
 cabbage:require('../../../assets/agriculture/recognition/cabbage-v1.webp'),
 'chinese-cabbage':require('../../../assets/agriculture/recognition/chinese-cabbage-v1.webp'),
 lettuce:require('../../../assets/agriculture/recognition/lettuce-v1.webp'),
 spinach:require('../../../assets/agriculture/recognition/spinach-v1.webp'),
 onion:require('../../../assets/agriculture/recognition/onion-v1.webp'),
 daikon:require('../../../assets/agriculture/recognition/daikon-v1.webp'),
};
type RecognitionImage={
 id:string;lessonIds:string[];lessonSourceHashes:Record<string,string>;
 titleJa:string;altJa:string;observationJa:string;limitJa:string;
 assetKey:string;width:number;height:number;
};
type Colors={text:string;translation:string;translationText:string;border:string};
const images:RecognitionImage[]=Array.isArray(data.images)?data.images:[];

export function RecognitionImages({lessonId,lessonSourceHash,colors}:{lessonId:string;lessonSourceHash:string;colors:Colors}) {
 const {height}=useWindowDimensions();
 const artMaxHeight=Math.max(160,Math.min(420,height-160));
 const visible=images.filter(item=>item.lessonIds?.includes(lessonId)
  &&item.lessonSourceHashes?.[lessonId]===lessonSourceHash
  &&Object.prototype.hasOwnProperty.call(assets,item.assetKey)
  &&Number.isFinite(item.width)&&item.width>0&&Number.isFinite(item.height)&&item.height>0
  &&item.titleJa&&item.altJa&&item.observationJa&&item.limitJa);
 return <>{visible.map(item=><View key={item.id} testID={item.id} style={[s.figure,{backgroundColor:colors.translation,borderColor:colors.border}]}>
  <Text style={[s.title,{color:colors.translationText}]}>{item.titleJa}</Text>
  <Image testID={`${item.id}-image`} source={assets[item.assetKey]} accessibilityLabel={item.altJa} resizeMode="contain" style={{width:'100%',maxWidth:artMaxHeight*(item.width/item.height),aspectRatio:item.width/item.height,alignSelf:'center'}}/>
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
});
