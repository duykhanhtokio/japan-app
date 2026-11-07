import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { checkMatch, shuffle } from './core.mjs';
import type { Challenge, Match } from './types';

type Props={challenge:Challenge;initialAttempts?:Match[];onChange:(attempts:Match[],complete:boolean)=>void};
const colors=['#b74040','#1f6e8c','#427647','#8659a8','#a36b18','#286d68','#a34a78','#4a5b9f','#797021','#8a573b'];
/** All thirty cards and ten group markers remain visible; no ScrollView or pagination. */
export default function DailyWordMatch({challenge,initialAttempts=[],onChange}:Props) {
    const {width,height}=useWindowDimensions();const wide=width>height;
    const [attempts,setAttempts]=useState<Match[]>(initialAttempts);
    const [selected,setSelected]=useState<(string|null)[]>([null,null,null]);
    const [feedback,setFeedback]=useState('');
    const completed=useMemo(()=>new Set([...challenge.matched,...attempts.filter(t=>checkMatch(challenge,t)).map(t=>t[0])]),[attempts,challenge]);
    const blocks=useMemo(()=>(wide?[challenge.words.slice(0,5),challenge.words.slice(5)]:[challenge.words]).map((items,block)=>['word','reading','meaning'].map((field,index)=>({field:field as 'word'|'reading'|'meaning',words:shuffle(items,challenge.day+challenge.locale+index+block)}))),[challenge,wide]);
    function choose(col:number,id:string) {
        const next=[...selected];next[col]=id;setSelected(next);
        if(next.some(x=>x===null))return;
        const tuple=next as Match,good=checkMatch(challenge,tuple),updated=[...attempts,tuple];
        setAttempts(updated);setSelected([null,null,null]);setFeedback(good?'✓':'Thử lại · もう一度');
        const matched=new Set([...completed,...(good?[tuple[0]]:[])]);
        onChange(updated,matched.size===10);
    }
    return <View testID="daily-word-match" style={s.root}>
        <View style={s.legend}>{['日本語','かな',challenge.locale==='vi'?'Nghĩa':challenge.locale==='ja'?'意味':'Meaning'].map(label=><Text key={label} style={s.heading}>{label}</Text>)}</View>
        <View style={s.board}>{blocks.map((columns,block)=><View key={block} style={s.block}>{columns.map(({field,words},col)=><View key={field} style={s.column}>{words.map(w=>{
            const matched=completed.has(w.id),group=challenge.words.findIndex(x=>x.id===w.id),color=colors[group];
            return <Pressable testID={`match-${field}-${w.id}`} key={w.id} accessibilityRole="button" accessibilityLabel={`${field}: ${w[field]}`} accessibilityState={{selected:selected[col]===w.id,disabled:matched}}
                disabled={matched} onPress={()=>choose(col,w.id)} style={[s.card,matched&&{borderColor:color,backgroundColor:'#e5f0df'},selected[col]===w.id&&s.selected]}>
                <Text style={[s.text,matched&&{color}]}>{w[field]}</Text>{matched&&<Text style={[s.badge,{color}]}>{group+1}✓</Text>}
            </Pressable>;
        })}</View>)}</View>)}</View>
        <View testID="matching-groups" style={s.groups}>{challenge.words.map((w,i)=><View key={w.id} style={[s.group,completed.has(w.id)&&{backgroundColor:colors[i]}]}><Text style={{color:completed.has(w.id)?'#fff':'#273e51'}}>{i+1}</Text></View>)}</View>
        <Text accessibilityLiveRegion="polite" style={s.feedback}>{completed.size}/10 · {feedback}</Text>
    </View>;
}
const s=StyleSheet.create({root:{flex:1,minHeight:0,gap:4},legend:{flexDirection:'row',gap:6},heading:{flex:1,textAlign:'center',fontSize:14,color:'#314557',fontWeight:'700'},board:{flex:1,flexDirection:'row',gap:6,minHeight:0},block:{flex:1,flexDirection:'row',gap:6,minWidth:0},column:{flex:1,gap:4,minWidth:0},card:{flex:1,minHeight:0,justifyContent:'center',alignItems:'center',paddingHorizontal:3,borderWidth:1,borderColor:'#cba55a',backgroundColor:'#fffaf0',borderRadius:8},selected:{backgroundColor:'#f2db9b',borderColor:'#735221',borderWidth:2},text:{fontSize:14,lineHeight:17,color:'#172b43',textAlign:'center'},badge:{position:'absolute',right:2,top:0,fontSize:9},groups:{flexDirection:'row',justifyContent:'space-between',gap:3},group:{width:23,height:23,borderWidth:1,borderColor:'#ac985e',borderRadius:12,alignItems:'center',justifyContent:'center'},feedback:{textAlign:'center',color:'#273e51',fontSize:13,height:19}});
