import {Text,View} from 'react-native';
export function ManufacturingCaptionText({text,parts,testID,color,hideCaption=false}:{text:string;parts?:readonly {text:string;reading?:string}[];testID:string;color:string;hideCaption?:boolean}){
 if(hideCaption)return null;
 const valid=Array.isArray(parts)&&parts.length>0&&parts.map(p=>p?.text).join('')===text&&parts.every(p=>p&&typeof p.text==='string'&&!!p.text&&(!/[一-龯々]/.test(p.text)||(typeof p.reading==='string'&&/^[ぁ-ゖー]+$/.test(p.reading)))&&(p.reading===undefined||/^[ぁ-ゖー]+$/.test(p.reading)));
 const style={fontSize:15,lineHeight:25,color};
 if(!valid)return <Text style={style}>{text}</Text>;
 return <View accessible accessibilityLabel={text} testID={testID} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((p,i)=><View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color}}>{p.reading??' '}</Text><Text style={style}>{p.text}</Text></View>)}</View>;
}
