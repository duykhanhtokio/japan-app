import {Text,View} from 'react-native';
import type {AgricultureLesson} from '@/data/agriculture';
type Token={text:string;readingKana?:string};
const {agricultureParagraphRuby}=require('@/data/agriculture/contextual-reading.cjs') as {
 agricultureParagraphRuby:(lesson:AgricultureLesson,paragraphId:string,text:string,level:string)=>Token[]|null;
};
/** Reuses existing exact-context tokens only; unreviewed paragraphs remain canonical Japanese. */
export function AgricultureParagraphRuby({lesson,paragraphId,text,level,color,readingColor}:{lesson:AgricultureLesson;paragraphId:string;text:string;level:string;color:string;readingColor:string}) {
 const tokens=agricultureParagraphRuby(lesson,paragraphId,text,level);
 if(!tokens)return <Text selectable style={{fontSize:17,lineHeight:29,color}}>{text}</Text>;
 const pieces=tokens.flatMap(token=>token.readingKana?[token]:Array.from(token.text,text=>({text})));
 return <View accessible accessibilityLabel={text} testID={`agri-paragraph-ruby-${paragraphId}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}>{pieces.map((token:Token,index)=><View key={index} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color:readingColor,maxWidth:'100%',flexShrink:1,textAlign:'center'}}>{token.readingKana??' '}</Text><Text selectable style={{fontSize:17,lineHeight:29,color,maxWidth:'100%',flexShrink:1}}>{token.text}</Text></View>)}</View>;
}
