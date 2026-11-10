import React,{createContext,useContext,type PropsWithChildren} from 'react';
import {Text as NativeText,StyleSheet,type TextProps,type TextStyle} from 'react-native';
import {HotelJapaneseText,hotelReading} from './HotelJapaneseText';
import {hotelGuideReading,hotelGuideRevisionCurrent} from '../../data/hospitality/royal-guide-readings';
type Context={lessonId:string;revision:string;language:string;enabled:boolean};
const GuideReadingContext=createContext<Context|undefined>(undefined);
export function HotelGuideReadingProvider({children,...value}:PropsWithChildren<Context>){return <GuideReadingContext.Provider value={value}>{children}</GuideReadingContext.Provider>;}
/** Same ruby switch and existing word/ruby renderer; translations remain plain. */
export function HotelGuideText({children,...props}:TextProps){
 const context=useContext(GuideReadingContext),pieces=React.Children.toArray(children);
 if(!context?.enabled||context.language!=='ja'||!hotelGuideRevisionCurrent(context.lessonId,context.revision)||pieces.some(x=>typeof x!=='string'&&typeof x!=='number'))return <NativeText {...props}>{children}</NativeText>;
 const text=pieces.join('');if(!/\p{Script=Han}/u.test(text))return <NativeText {...props}>{children}</NativeText>;
 const parts=pieces.flatMap(piece=>{const value=String(piece);return hotelReading(value,context.lessonId,context.revision)??hotelGuideReading(value,context.lessonId,context.revision)??[{text:value}];});
 const style=(StyleSheet.flatten?StyleSheet.flatten(props.style)||{}:props.style||{}) as TextStyle;
 return <HotelJapaneseText text={text} lessonId={context.lessonId} revision={context.revision} enabled color={typeof style.color==='string'?style.color:'#243c50'} heading={style.fontWeight==='700'||style.fontWeight==='bold'} nativeStyle={props.style} testID={props.testID} selectable={props.selectable} accessibilityProps={{accessible:props.accessible??true,accessibilityLabel:props.accessibilityLabel??text,accessibilityHint:props.accessibilityHint,accessibilityRole:props.accessibilityRole,accessibilityLanguage:props.accessibilityLanguage,accessibilityElementsHidden:props.accessibilityElementsHidden,importantForAccessibility:props.importantForAccessibility}} fontWeightOverride={style.fontWeight} fontSizeOverride={style.fontSize} lineHeightOverride={style.lineHeight} readingOverride={parts}/>;
}
