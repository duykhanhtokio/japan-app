import {useState} from 'react';
import {Image,Pressable,Text,View,useWindowDimensions} from 'react-native';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {restaurantUi} from '@/data/restaurant';
import {sourceFigureAsset31,sourceTarget31,type SourceFigure31} from '@/data/restaurant/source31';
/** One pixel coordinate system drives both the teaching and neutral quiz crop. */
export function sourcePictureFrame31(figure:SourceFigure31,width:number){
 const c=figure.cropBox??{x:0,y:0,width:figure.width,height:figure.height};
 if(!Number.isFinite(width)||width<=0||![figure.width,figure.height,c.x,c.y,c.width,c.height].every(Number.isFinite)||figure.width<=0||figure.height<=0||c.x<0||c.y<0||c.width<=0||c.height<=0||c.x+c.width>figure.width||c.y+c.height>figure.height)return null;
 const scale=width/c.width;return {width,height:c.height*scale,imageWidth:figure.width*scale,imageHeight:figure.height*scale,left:-c.x*scale,top:-c.y*scale};
}
export function SourcePicture31({figure,label,width}:{figure:SourceFigure31;label:string;width?:number}){
 const window=useWindowDimensions(),[measured,setMeasured]=useState(0),image=sourceFigureAsset31(figure),frame=sourcePictureFrame31(figure,width??(measured||Math.max(1,window.width-32)));
 if(!image||!frame)return null;
 return <View testID={`source31-picture-${figure.id}`} onLayout={event=>{const next=event.nativeEvent.layout.width;if(!width&&Number.isFinite(next)&&next>0)setMeasured(next);}} style={{width:width??'100%',height:frame.height,overflow:'hidden',position:'relative'}}><Image testID={`source31-image-${figure.id}`} source={image} accessibilityLabel={label} resizeMode="contain" style={{position:'absolute',width:frame.imageWidth,height:frame.imageHeight,left:frame.left,top:frame.top}}/></View>;
}
export function SourceFigureGallery31({figures,language,showTranslation,onZoom}:{figures:SourceFigure31[];language:string;showTranslation:boolean;onZoom:(id:string)=>void}){
 const [selected,setSelected]=useState(0),{colors}=useStudyAppearance(),teaching=figures.filter(f=>!f.quizSafe),paged=teaching.length>6,index=Math.min(selected,Math.max(0,teaching.length-1)),shown=paged?teaching.slice(index,index+1):teaching;
 const button=(text:string,disabled:boolean,action:()=>void,id:string)=><Pressable testID={id} accessibilityRole="button" accessibilityLabel={restaurantUi(text,language)} disabled={disabled} accessibilityState={{disabled}} onPress={action} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,opacity:disabled?.45:1}}><Text style={{color:colors.text}}>{restaurantUi(text,language)}</Text></Pressable>;
 return <View style={{gap:12}}>{paged&&<View style={{flexDirection:'row',alignItems:'center',gap:12,flexWrap:'wrap'}}>{button('前へ',index===0,()=>setSelected(v=>Math.max(0,v-1)),'source31-figure-prev')}<Text testID="source31-figure-position" style={{color:colors.text}}>{index+1} / {teaching.length}</Text>{button('次へ',index===teaching.length-1,()=>setSelected(v=>Math.min(teaching.length-1,v+1)),'source31-figure-next')}</View>}{shown.map(f=>{const t=showTranslation?sourceTarget31(f,language):null;return <View key={f.id} testID={`source31-figure-${f.id}`} style={{gap:10}}><Pressable accessibilityRole="imagebutton" accessibilityLabel={t?.alt??f.altJa} onPress={()=>onZoom(f.id)}><SourcePicture31 figure={f} label={t?.alt??f.altJa}/></Pressable><Text selectable style={{color:colors.text,fontSize:17,lineHeight:29}}>{f.captionJa}</Text>{t?.caption&&<TranslationText>{t.caption}</TranslationText>}</View>;})}</View>;
}
