import {HotelGuideText as Text} from './HotelGuideText';
import React from 'react';
import {View,StyleSheet} from 'react-native';
import type {HotelLesson} from '../../data/hospitality/types';
import {loadHotelTranslation} from '../../data/hospitality/translation-loaders';
import {hotelRevenueLabels} from '../../data/hospitality/revenue-example-labels';
export const HOTEL_REVENUE_COMPARISON_REVISION='2487c50fc6bbcffd4f417bd6326614b8fd9d442c1d31f3b166e755535750a62c';
export const HOTEL_REVENUE_COMPARISON={availableRooms:50,plans:[{id:'A',sold:30,price:15000},{id:'B',sold:40,price:12000}]};
const number=(value:number)=>String(value).replace(/\B(?=(\d{3})+(?!\d))/g,',');
export function hotelComparisonValues(sold:number,price:number){const revenue=sold*price,available=HOTEL_REVENUE_COMPARISON.availableRooms;return {revenue,occ:sold/available*100,adr:revenue/sold,revpar:revenue/available};}
/** Source-defined hypothetical example; never derive profitability without cost data. */
export function HotelRevenueComparison({lesson,language}:{lesson:HotelLesson;language:string}){
 if(lesson.id!=='hotel-planning-06'||lesson.revision!==HOTEL_REVENUE_COMPARISON_REVISION)return null;
 const material=language==='ja'?lesson:loadHotelTranslation(lesson.id,language,lesson.revision);if(!material)return null;
 const t=hotelRevenueLabels(language),profit=material.sections.find(section=>section.id==='hotel-planning-06-profit');
 return <View testID="hotel-planning-06-native-comparison" style={s.root}><Text style={s.heading}>{t.sameDay}</Text><Text style={s.label}>{t.available}: 50</Text>
 {HOTEL_REVENUE_COMPARISON.plans.map(plan=>{const v=hotelComparisonValues(plan.sold,plan.price);return <View key={plan.id} style={s.card}><Text style={s.heading}>{plan.id}</Text><Text style={s.label}>{t.sold}: {plan.sold}</Text><Text style={s.label}>{t.adr}: {number(plan.price)} JPY</Text><Text style={s.label}>{t.revenue}</Text><Text selectable style={s.formula}>{`${plan.sold} × ${number(plan.price)} = ${number(v.revenue)} JPY`}</Text><View accessible accessibilityLabel={`${plan.id}: ${t.revenue} ${number(v.revenue)} JPY`} style={s.track}><View style={[s.bar,{width:`${v.revenue/500000*100}%`}]} /></View><Text style={s.label}>OCC · {t.occupancy}</Text><Text selectable style={s.formula}>{`${plan.sold} ÷ 50 × 100 = ${v.occ}%`}</Text><Text style={s.label}>ADR · {t.adr}</Text><Text selectable style={s.formula}>{`${number(v.revenue)} ÷ ${plan.sold} = ${number(v.adr)} JPY`}</Text><Text style={s.label}>RevPAR · {t.revpar}</Text><Text selectable style={s.formula}>{`${number(v.revenue)} ÷ 50 = ${number(v.revpar)} JPY`}</Text></View>;})}
 {profit&&<View style={s.caveat}><Text style={s.heading}>{profit.title}</Text><Text style={s.label}>{profit.body}</Text></View>}</View>;
}
const s=StyleSheet.create({root:{width:'100%',gap:12,padding:12,marginVertical:16,backgroundColor:'#faf8f1',borderRadius:8},heading:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},label:{fontSize:14,lineHeight:23,color:'#243c50'},formula:{fontSize:16,lineHeight:27,color:'#204f70',flexShrink:1},card:{width:'100%',gap:6,padding:12,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6},track:{width:'100%',height:20,backgroundColor:'#e5e4de',borderRadius:3,overflow:'hidden'},bar:{height:'100%',backgroundColor:'#31546d'},caveat:{gap:8,paddingTop:8,borderTopWidth:1,borderTopColor:'#a9bcc2'}});
