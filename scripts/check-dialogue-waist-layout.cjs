const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
const source=fs.readFileSync('src/components/world/dialogue-panel-layout.ts','utf8'),m={exports:{}};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:m.exports,Intl});
const {dialoguePanelLayout,dialogueTextPages}=m.exports;
const samples=['こんにちは。準備で何かお手伝いしましょうか。','Vì sơ đồ và vị trí bàn khác nhau, xin kiểm tra trước khi chỉ dẫn. Hãy nói bằng tiếng Nhật.','မြေပုံနှင့် စားပွဲနေရာ မတူသောကြောင့် စစ်ဆေးပေးပါ။','กรุณาตรวจสอบตำแหน่งโต๊ะก่อนให้คำแนะนำ','कृपया मेज़ की जगह जाँच लें।','অনুগ্রহ করে টেবিলের অবস্থান পরীক্ষা করুন।','សូមពិនិត្យទីតាំងតុជាមុនសិន។'];
let checks=0;
for(const [width,height]of [[375,568],[390,844],[430,932],[768,1024],[844,390],[1440,900]])for(const text of samples){
 const waist=height*.45,bottom=height-120,panels=[{copy:[{text,lineHeight:2.05}],context:true},{copy:[{text:text.repeat(12),lineHeight:1.45}],context:false}];
 const result=dialoguePanelLayout({width,height,headerBottom:height*.22,bottom,npcWaist:waist,wide:width>height,panels});
 assert(result.top>=waist,'Panels must never borrow space above waist');assert.equal(result.placements.length,2);
 for(let i=0;i<2;i++){
  const p=result.placements[i];assert(result.top+p.top+p.height<=bottom+.01,'Frame must remain above controls');
  const original=panels[i].copy[0].text,pages=dialogueTextPages(original,Math.max(60,p.width-52),p.fontSize,Math.max(p.fontSize*2.05,p.height-64),i?1.45:2.05);
  assert.equal(pages.map(x=>x.text).join(''),original,'Paging must preserve the full source');checks++;
 }
}
const ruby=[{text:'こんにちは。'},{text:'準備',reading:'じゅんび'},{text:'で'},{text:'何',reading:'なに'},{text:'かお'},{text:'手伝',reading:'てつだ'},{text:'いしましょうか。'}],text=ruby.map(x=>x.text).join('');
const pages=dialogueTextPages(text,120,14,35,2.05,ruby);assert.equal(pages.map(x=>x.text).join(''),text);for(const p of pages)assert.equal(p.ruby.map(x=>x.text).join(''),p.text);
console.log('WAIST LAYOUT PASS:',checks,'placement/paging cases; full source and ruby preserved.');
