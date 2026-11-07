import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {hotelRevenueLabels,HOTEL_REVENUE_EXAMPLE as values} from '../../data/hospitality/revenue-example-labels';
const number=(value:number)=>String(value).replace(/\B(?=(\d{3})+(?!\d))/g,',');
/** Same-day room-revenue teaching example; not a practice-question answer overlay. */
export function HotelRevenueExample({language}:{language:string}){
 const t=hotelRevenueLabels(language),occ=values.soldRooms/values.availableRooms*100,adr=values.roomRevenue/values.soldRooms,revpar=values.roomRevenue/values.availableRooms;
 return <View testID="hotel-planning-02-revenue-example" style={s.root}>
 <Text style={s.heading}>{t.sameDay}</Text>
 {[[t.available,String(values.availableRooms)],[t.sold,String(values.soldRooms)],[t.revenue,`${number(values.roomRevenue)} JPY`]].map(([label,value])=><View key={label} style={s.input}><Text style={s.label}>{label}</Text><Text style={s.value}>{value}</Text></View>)}
 <View style={s.card}><Text style={s.heading}>OCC</Text><Text style={s.label}>{t.occupancy}</Text><Text selectable style={s.formula}>{`${values.soldRooms} ÷ ${values.availableRooms} × 100 = ${occ}%`}</Text></View>
 <View style={s.card}><Text style={s.heading}>ADR</Text><Text style={s.label}>{t.adr}</Text><Text selectable style={s.formula}>{`${number(values.roomRevenue)} ÷ ${values.soldRooms} = ${number(adr)}`}</Text><Text style={s.label}>{t.unit}</Text></View>
 <View style={s.card}><Text style={s.heading}>RevPAR</Text><Text style={s.label}>{t.revpar}</Text><Text selectable style={s.formula}>{`${number(values.roomRevenue)} ÷ ${values.availableRooms} = ${number(revpar)}`}</Text><Text style={s.label}>{t.unit}</Text></View>
 <Text style={s.label}>{t.percent}</Text><Text selectable style={s.formula}>{`${number(adr)} × 0.75 = ${number(revpar)}`}</Text>
 <Text style={s.label}>{t.caveat}</Text><Text style={s.label}>{t.zeroAdr}</Text>
 </View>;
}
const s=StyleSheet.create({root:{width:'100%',gap:12,padding:14,marginVertical:16,backgroundColor:'#faf8f1',borderRadius:8},heading:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},label:{fontSize:14,lineHeight:23,color:'#243c50'},value:{fontSize:18,lineHeight:28,fontWeight:'600',color:'#243c50'},input:{gap:3,borderBottomWidth:1,borderColor:'#d9d5cb',paddingBottom:8},card:{width:'100%',gap:6,padding:12,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6},formula:{fontSize:16,lineHeight:27,color:'#204f70',flexShrink:1}});
