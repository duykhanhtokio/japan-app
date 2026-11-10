// Orchard owner: source self-review and guarded proposals only; no shared writes.
const fs=require('fs'),z=require('zlib'),crypto=require('crypto'),assert=require('assert/strict');
const dir='docs/ssw-workspace/agriculture/continuation-20261103f/orchard/',receipt=dir+'source-review.json';
const ledger=JSON.parse(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture.json'));
const lp='src/data/agriculture/lessons.ja.json',lessons=JSON.parse(fs.readFileSync(lp)).lessons;
const h=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const a=JSON.parse(z.gunzipSync(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture-AGR-S2-regions.json.gz')));
const refs=(p,y0,y1)=>{let ids=a.pages.find(x=>x.pdfPage===p).elements.filter(e=>e.kind==='text_span'&&e.bbox[1]>=y0-6&&e.bbox[1]<y1).map(e=>e.elementId);assert(ids.length,p+':'+y0);return [{sourceId:'AGR-S2',pdfPage:p,elementIds:ids}];};
function ev(file,ptr,note){let v=JSON.parse(fs.readFileSync(file));for(const k of ptr.slice(1).split('/'))v=v[k];assert(v!==undefined);return {path:file,jsonPointer:ptr,sha256:h(v),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:note};}
const questions=[];for(const f of ['weekly-checks.ja.json','mock-exams.ja.json']){const file='src/data/agriculture/'+f,d=JSON.parse(fs.readFileSync(file));for(const [ei,e]of d.exams.entries())for(const [qi,q]of e.questions.entries())questions.push({file,ptr:`/exams/${ei}/questions/${qi}`,q});}
const qev=id=>{let q=questions.find(x=>x.q.id===id);assert(q,id);assert.equal(q.q.lessonSourceHash,lessons.find(l=>l.id===q.q.lessonId).sourceHash);assert.equal(q.q.optionReasonsJa.length,4);return ev(q.file,q.ptr,'Owner read stem, four options, correctIndex and all four rationales against source and current lesson. Only the stated tested relation is accepted; neighbouring facts are not inferred from a keyword.');};
const checkev=k=>({checkId:'agr-reader-orchard-f-'+k,relation:'direct',semanticReviewed:true,reviewNote:'New bounded retrieval explicitly asks this relation and supplies an independently authored source-bound model answer. It does not certify real equipment operation.'});
const groups=[
['renewal',[
['樹勢と収量が低下した老木や品種に問題のある園地では、品種更新を検討する。',[[114,410,457]],['agr-1-m10-q26']],
['改植は古い木を新しい苗木へ植え替えて更新する方法である。',[[114,410,457]],['agr-par06-fruit-management-q05']],
['高接ぎは既存樹の主枝や亜主枝の途中へ新品種の枝を接ぐ更新方法である。',[[114,486,534],[115,64,105]],['agr-1-m10-q23']],
['高接ぎには元の枝を切る型があり、切断位置と接ぎ穂の位置を区別して図を読む。',[[114,486,534],[115,64,329]],['agr-par06-fruit-management-q06','agr-1-m09-q04']],
['高接ぎには元の枝を力枝として残す型もあり、全ての枝を切る方法とは限らない。',[[114,486,534],[115,64,329]],['agr-par06-fruit-management-q06']],
['更新方法では改植か高接ぎかを区別し、高接ぎでは元の枝を切る型か残す型かを説明する。',[[114,410,534],[115,64,329]],['activity']]
]],
['orchard-soil',[
['清耕法は草のない地表を保つ方法で、雨で表土が流れやすい点に注意する。',[[115,410,458]],['agr-par06-fruit-management-q07']],
['わらなどを敷くマルチ法と草を生やして覆う草生法は別の地表管理である。',[[115,461,585]],['new:soil']],
['折衷法は地表管理の長所を生かし欠点を補うため複数の方法を組み合わせる。',[[115,614,636]],['new:soil']],
['果樹園では土壌流出を抑える排水溝と土壌の崩れを防ぐ石垣を区別する。',[[115,665,713]],['agr-2-m02-q10']],
['深耕や有機物投入で保水性・通気性と根の生育を改善し、適する土壌pHは果樹ごとに異なる。',[[115,716,789]],['agr-1-m09-q24','new:soil']],
['かん水の時期・量は樹種と生育に合わせ、適度な保水性と排水性を共に確保する。',[[117,586,634]],['agr-par06-fruit-management-q08']]
]],
['fertilizer',[
['果樹の元肥は一年の生育の基礎、追肥は元肥だけで不足する養分の補充である。',[[117,662,736]],['agr-1-m10-q18']],
['資料の元肥時期は生育開始前の休眠中で、落葉果樹12～1月・常緑果樹3～4月の例を区別する。',[[117,739,787]],['agr-2-m01-q32']],
['成木の表層施肥は土の表面、全層施肥は深耕時に全層へ、葉面散布は水に溶かして木全体へ施す。',[[118,53,126]],['agr-par06-fruit-management-q10','agr-1-m09-q35']],
['春肥は芽・枝・葉を育てる追肥で、芽出し肥とも呼ぶ。',[[118,155,177]],['agr-2-m01-q35']],
['夏肥は果実を育てる追肥で、実肥とも呼ぶ。',[[118,180,203]],['agr-2-m01-q35']],
['秋肥は樹勢回復と貯蔵養分増加を目的とするお礼肥で、春・夏・秋の追肥には速効性肥料を使う。',[[118,129,228]],['agr-par06-fruit-management-q09','new:fertilizer']]
]],
['citrus-apple-grape',[
['暖地で育てるカンキツ類は寒さと強風に弱い。',[[119,206,228],[119,308,330]],['agr-1-m01-q38']],
['ウンシュウミカンは実の多い年と少ない年が交互に起こる隔年結果が起きやすい。',[[119,333,356]],['agr-1-m01-q39']],
['リンゴでは人工授粉、摘蕾・摘花・摘果、防除や袋かけを目的別に区別する。',[[119,563,636]],['agr-1-m10-q13'],'防除と袋かけまでを直接問い分ける評価が不足。既存問題は授粉と数を減らす作業のみ直接評価する。'],
['リンゴのわい化栽培はわい性台木と主幹形・密植を用い、早期収量と低樹高による省力化を目指す。',[[119,639,713]],['agr-par06-fruit-management-q13']],
['ブドウの棚仕立ては枝を水平に広げる配置で、風雨や病気に弱いため施設栽培する例もある。',[[120,78,126]],['agr-1-m10-q12']],
['種なしブドウのジベレリン処理は品種適性を確認し、時期と濃度を守る条件付きの方法である。',[[120,129,152],[120,257,305]],['activity']]
]],
['persimmon-pear-peach',[
['カキには甘ガキと渋ガキがあり、渋ガキは脱渋加工や干し柿にして利用する。',[[120,359,381],[120,461,509]],['agr-2-m02-q12']],
['カキも実の多い年と少ない年が交互に起こる隔年結果が起きやすい。',[[120,512,534]],['new:trees']],
['ニホンナシは温暖で雨の多い環境、セイヨウナシは涼しく雨の少ない地域という資料の区別を読む。',[[120,588,611],[120,691,738]],['agr-1-m01-q40']],
['ナシでは親和性のある他品種の花粉による受粉が必要で、風の落果を減らすため棚仕立てにする。',[[120,639,713]],['agr-par06-fruit-management-q14','new:trees']],
['モモは若木の生育が早く、資料には3年で結実し7～8年で大きな木になる例がある。',[[121,155,177]],['agr-1-m09-q25']],
['モモの摘蕾・摘果は数を調整し、袋かけは病害虫から守り外観を整える作業である。',[[121,180,228]],['new:trees']]
]],
['materials-machines',[
['果樹園のネット・棚・施設資材と地表を覆う資材は、置く場所と保護する対象を区別する。',[[121,308,356],[122,104,126]],['agr-1-m09-q05']],
['根の周囲へ敷くマルチは土壌の流出、水分蒸発、雑草を抑える。',[[122,269,368]],['agr-1-m09-q14']],
['収穫期に樹の下へ敷く反射シートは太陽光を反射して果実の着色を促す。',[[122,371,445]],['agr-par06-fruit-management-q15']],
['スピードスプレヤーは防除、高所作業機は栽培管理に使う機械であり、用途の識別は実機運転の習得とは別である。',[[122,486,651]],['agr-par06-fruit-management-q16','activity']],
['果樹園の運搬にはモノレールと運搬車があり、線路に沿う方式と車両による方式を区別する。',[[123,53,111]],['agr-1-m10-q08'],'運搬車との対比を直接求める評価が不足。モノレールのみの説明問題を二機種双方の評価とは扱わない。'],
['果樹園ではせん定ばさみ・せん定鋸・収穫袋を使い分け、防霜ファンや凍害対策の散水設備などにも用途がある。',[[123,257,316],[121,435,483]],['agr-1-m09-q32','agr-1-m09-q33'],'元の段落が含む植物成長調整剤の用途と製品条件の確認については評価が不足。道具・気象設備の問題だけで段落全体を閉じない。']]
]];
const updates=[];
for(const [group,rows]of groups)for(const [i,[statement,rects,qs,gap]]of rows.entries()){
 const id='agriculture-v2-AGR-K-FRUIT-MANAGE-'+group.toUpperCase()+'-'+String(i+1).padStart(2,'0');
 const old=ledger.knowledgeUnits.find(u=>u.knowledgeId===id);assert(old,id);assert.equal(old.status,'candidate');
 const lid='agr-fruit-manage-'+group,li=lessons.findIndex(l=>l.id===lid),l=lessons[li];assert(l);assert(l.paragraphs[i].knowledgeIds.includes(id.replace('agriculture-v2-','')));
 const sourceRefs=rects.flatMap(r=>refs(...r));const ae=qs.map(q=>q==='activity'?ev(lp,`/lessons/${li}/activityJa`,'Owner confirms this retained application prompt directly requires the specific distinction/conditions in this unit; an explicit source-bound retrieval is used where the older broad activity is insufficient.'):q.startsWith('new:')?checkev(q.slice(4)):qev(q));
 const after={...structuredClone(old),statementJa:statement,conditionsJa:['資料の掲載例と適用範囲を保ち、実機操作・全品種共通の実施日・製品の使用条件をこの学習だけで認定しない。'],exceptionsJa:[],sourceRefs,after:{teaching:'present',assessment:gap?'partial':'present'},teachingEvidence:[ev(lp,`/lessons/${li}/paragraphs/${i}/textJa`,'Read current independently authored teaching against exact source clauses and applicable diagram. This pointer teaches the stated relation without copying the source sequence.')],assessmentEvidence:ae,expressionReview:{status:'independent_ai_checked',note:'Retains app-authored occupational explanation and independent question scenarios. Original concise factual statement; private PDF text, figures, page renderings and characteristic table layouts are not republished.'},sourceReview:{status:'self_checked_ai',conditionsChecked:true,reviewRef:receipt},status:gap?'partial':'covered_ai',unresolved:gap?[gap]:[]};
 if(gap&&group==='materials-machines'&&i===5)after.statementJa=old.statementJa;
 updates.push({group,knowledgeId:id,beforeSha256:h(old),previousSourceRefs:old.sourceRefs,after});
}
// New retrievals close only specifically identified assessment gaps.
const texts=JSON.parse(fs.readFileSync(dir+'texts.json'));
const dictionary={'地表':'ちひょう','敷き物':'しきもの','覆う':'おおう','方法':'ほうほう','草':'くさ','生やす':'はやす','同じ':'おなじ','組み合わせる':'くみあわせる','目的':'もくてき','果樹':'かじゅ','土壌':'どじょう','説明':'せつめい','別':'べつ','組み合わせて':'くみあわせて','長所':'ちょうしょ','生かし':'いかし','欠点':'けってん','補います':'おぎないます','適する':'てきする','異なります':'ことなります','秋肥':'あきごえ','別名':'べつめい','答え':'こたえ','春肥':'はるごえ','夏肥':'なつごえ','使う':'つかう','肥料':'ひりょう','性質':'せいしつ','樹勢':'じゅせい','回復':'かいふく','貯蔵養分':'ちょぞうようぶん','増やす':'ふやす','与え':'あたえ','お礼肥':'おれいごえ','呼びます':'よびます','追肥':'ついひ','速効性肥料':'そっこうせいひりょう','使います':'つかいます','隔年結果':'かくねんけっか','棚仕立て':'たなじたて','理由':'りゆう','摘蕾':'てきらい','摘果':'てきか','袋':'ふくろ','実':'み','多い':'おおい','年':'とし','少ない':'すくない','交互':'こうご','起こり':'おこり','風':'かぜ','落果':'らっか','減らす':'へらす','数':'かず','仕事':'しごと','病害虫':'びょうがいちゅう','防ぎ':'ふせぎ','外観':'がいかん','整える':'ととのえる'};
const dk=Object.keys(dictionary).sort((a,b)=>b.length-a.length);function ruby(t){const out=[];let i=0;while(i<t.length){const k=dk.find(k=>t.startsWith(k,i));if(k){out.push({text:k,readingKana:dictionary[k]});i+=k.length;}else{let j=i+1;while(j<t.length&&!dk.some(k=>t.startsWith(k,j)))j++;const s=t.slice(i,j);assert(!/[\p{Script=Han}々]/u.test(s),'Unmapped ruby '+s);out.push({text:s});i=j;}}return out;}
const meta={soil:{lesson:'agr-fruit-manage-orchard-soil',pis:[1,2,4],refs:[[115,461,636],[115,716,789]]},fertilizer:{lesson:'agr-fruit-manage-fertilizer',pis:[5],refs:[[118,129,228]]},trees:{lesson:'agr-fruit-manage-persimmon-pear-peach',pis:[1,3,5],refs:[[120,512,534],[120,639,713],[121,180,228]]}};
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];const readerAdditions=[];
for(const [k,t]of Object.entries(texts)){const m=meta[k],l=lessons.find(l=>l.id===m.lesson),translations={};assert.deepEqual(Object.keys(t.translations).sort(),[...locales].sort());for(const [lc,[prompt,modelAnswer]]of Object.entries(t.translations)){assert(prompt&&modelAnswer);translations[lc]={prompt,modelAnswer,translatedFrom:'ja'};}
 const row={id:'agr-reader-orchard-f-'+k,knowledgeId:'agriculture-v2-'+l.paragraphs[m.pis[0]].knowledgeIds[0],lessonId:l.id,levels:l.levels,promptJa:t.promptJa,modelAnswerJa:t.modelAnswerJa,promptRuby:ruby(t.promptJa),modelAnswerRuby:ruby(t.modelAnswerJa),translations,nativeReviewed:false,domainReviewed:false,sourceRefs:m.refs.flatMap(r=>refs(...r)),answerOrigin:{parts:[{lessonId:l.id,paragraphIds:m.pis.map(i=>l.paragraphs[i].id),sourceHash:l.sourceHash}],sourceBoundSupplement:true}};
 for(const f of ['prompt','modelAnswer'])assert.equal(row[f+'Ruby'].map(x=>x.text).join(''),row[f+'Ja']);readerAdditions.push(row);
}
const localeRows=[];for(const l of lessons.filter(l=>groups.some(([g])=>l.id==='agr-fruit-manage-'+g)))for(const lc of locales){const t=JSON.parse(fs.readFileSync(`src/data/agriculture/translations/${lc}.json`))[l.id];assert.equal(t.sourceHash,l.sourceHash);for(const p of l.paragraphs)assert(t.paragraphs[p.id]);localeRows.push({lessonId:l.id,locale:lc,revisionCurrent:true,semanticAccepted:false});}
const sourcePath='/workspace/scratch/adcba77e47ae/private-sources/耕種農業全般 特定技能2号.pdf';const sourceHash=crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex');assert.equal(sourceHash,ledger.sources.find(s=>s.sourceId==='AGR-S2').sha256);
fs.writeFileSync(dir+'unit-updates.json',JSON.stringify({schemaVersion:1,canonicalLedger:'docs/ssw-workspace/source-coverage-v2/agriculture.json',readerAdditions,updates},null,2)+'\n');
fs.writeFileSync(receipt,JSON.stringify({schemaVersion:1,worker:'orchard',baselineCommit:'77af4f21247007bef3bcfa502af34893821a187a',groups:groups.map(([g])=>g),sourceBytesVerified:[{sourceId:'AGR-S2',sha256:sourceHash}],visuallySelfReadPages:[114,115,117,118,119,120,121,122,123].map(pdfPage=>({sourceId:'AGR-S2',pdfPage})),sourceReadMethod:'Original PDF text/line bboxes read, privately rendered page montage inspected; page115 graft diagram and labels additionally read at1.5x. Exact teaching/questions read. No page-closure or whole-image-runtime acceptance claimed.',proposedCoveredUnits:updates.filter(x=>x.after.status==='covered_ai').length,partialUnits:updates.filter(x=>x.after.status==='partial').map(x=>({knowledgeId:x.knowledgeId,unresolved:x.after.unresolved})),newReaderChecks:3,newLocalePairs:36,sourceDenominator:'open',sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,oldLessonsUnchanged:true,oldQuestionsUnchanged:true,localeRevisionChecks:localeRows.length,allLocaleSemanticAcceptance:false,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false},null,2)+'\n');
fs.writeFileSync(dir+'validation.json',JSON.stringify({status:'PASS_OWNER_PROPOSAL',groups:6,reviewedUnits:updates.length,coveredUnits:updates.filter(x=>x.after.status==='covered_ai').length,partialUnits:updates.filter(x=>x.after.status==='partial').length,newChecks:readerAdditions.length,newLocalePairs:36,retainedLocaleRevisionChecks:localeRows.length,nonemptySourceElementRefs:true,allQuestionSourceHashesCurrent:true,allRubyReconstruct:true,noSharedWrites:true,integrated:false},null,2)+'\n');
console.log(JSON.stringify({reviewed:updates.length,covered:updates.filter(x=>x.after.status==='covered_ai').length,partial:updates.filter(x=>x.after.status==='partial').length,checks:readerAdditions.length}));
