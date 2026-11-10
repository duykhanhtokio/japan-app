import json,hashlib,subprocess,html
from pathlib import Path
R=Path(__file__).resolve().parents[2];A=R/'assets/manufacturing/recognition38';D=R/'src/data/manufacturing/recognition38';P=R/'docs/ssw-workspace/manufacturing/batch38-recognition/finishing'
A.mkdir(parents=True,exist_ok=True);D.mkdir(parents=True,exist_ok=True);P.mkdir(parents=True,exist_ok=True)
def txt(x,y,t,size=26,color='#173b52'):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}">{html.escape(t)}</text>'
def rect(x,y,w,h,fill='#e5f0f1',stroke='#37677a'):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
def line(x,y,xx,yy,c='#37677a',w=4):return f'<line x1="{x}" y1="{y}" x2="{xx}" y2="{yy}" stroke="{c}" stroke-width="{w}"/>'
def make(name,title,body):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1300" viewBox="0 0 1600 1300"><rect width="1600" height="1300" fill="#fffaf0"/><g font-family="Noto Sans CJK JP,sans-serif">'+txt(55,65,title,36)+txt(55,110,'独立した合成模式図・紙上学習専用／実物写真・操作手順・合否基準ではありません。',23)+body+txt(55,1240,'対象面・観察事実・工程条件を分ける。実作業は指定された手順と権限に従います。',23)+'</g></svg>'
 (A/(name+'.svg')).write_text(s);subprocess.run(['inkscape',str(A/(name+'.svg')),'--export-type=png','--export-filename='+str(A/(name+'.png'))],check=True,capture_output=True)
b=txt(65,180,'面積モデル：穴なし直方体 60 × 40 × 2 mm',30)+rect(100,225,480,320)+txt(245,405,'A：60 × 40',34)+line(100,575,580,575)+txt(270,615,'60 mm')+txt(610,395,'40 mm')+rect(880,225,480,32,'#e4bc7b')+txt(890,305,'B：側面 60 × 2 mm')+txt(880,350,'短い側面 40 × 2 mm は二面')+txt(880,410,'広い二面：2 × 60 × 40 = 4800 mm²',28)+txt(880,465,'四側面：2 × (60 + 40) × 2 = 400 mm²',27)+txt(880,520,'全六面：4800 + 400 = 5200 mm²',28)+txt(70,680,'C・D・E：保持・移動の形を区別する（接続や運転は示しません）',28)
for x,label in [(80,'C：ラック'),(580,'D：バレル'),(1080,'E：連続ストリップ')]:b+=rect(x,720,440,340)+txt(x+20,770,label,28)
b+=line(140,820,450,820)+line(210,820,210,900)+line(370,820,370,900)+rect(180,900,60,100,'#b7c9d3')+rect(340,900,60,100,'#b7c9d3')+txt(115,1040,'個別に吊るした品物',22)
b+='<polygon points="655,850 770,800 885,850 885,970 770,1020 655,970" fill="#c6d8e0" stroke="#37677a" stroke-width="4"/>'
for x,y in [(700,895),(760,920),(815,890),(780,970)]:b+=f'<circle cx="{x}" cy="{y}" r="16" fill="#e6b765"/>'
b+=txt(625,1040,'小物を入れる回転容器の概念',22)
b+='<circle cx="1160" cy="900" r="55" fill="#d2dfe6" stroke="#37677a" stroke-width="4"/><circle cx="1435" cy="900" r="55" fill="#d2dfe6" stroke="#37677a" stroke-width="4"/>'+line(1160,860,1435,860,'#d39c4d',20)+txt(1100,1040,'巻いた帯・線を連続して送る概念',22)+txt(70,1140,'この面積例に穴・接点の除外はありません。実物では対象面の指定を確認します。',25)
make('area-model','めっき：対象面の面積と保持方式',b)
b=''
for i,(key,label)in enumerate([('A','不めっき'),('B','変色'),('C','光沢不足'),('D','スクラッチ'),('E','局所的な磨き続けの跡'),('F','比較用の均一面')]):
 x=55+(i%3)*510;y=180+(i//3)*475;b+=rect(x,y,475,425)+txt(x+20,y+45,key+'：'+label,27)+rect(x+35,y+90,405,220,'#a9c6d3')
 if key=='A':b+=rect(x+160,y+150,145,110,'#8c9298')+txt(x+30,y+355,'一部に皮膜がない模型',22)
 if key=='B':b+='<ellipse cx="%s" cy="%s" rx="105" ry="70" fill="#b87954"/>'%(x+240,y+200)+txt(x+30,y+355,'皮膜の一部の色が違う',22)
 if key=='C':
  for j in range(45):b+=f'<circle cx="{x+55+(j*37)%360}" cy="{y+110+(j*23)%175}" r="6" fill="#80959f"/>'
  b+=txt(x+30,y+355,'同じ照明条件で光沢が弱い模型',21)
 if key=='D':
  for j in range(4):b+=line(x+85,y+125+j*28,x+370,y+210+j*20,'#49636e',4)
  b+=txt(x+30,y+355,'細長い線状の傷',22)
 if key=='E':b+='<ellipse cx="%s" cy="%s" rx="100" ry="55" fill="#8d9ba9" stroke="#9d5b40" stroke-width="4"/>'%(x+240,y+200)+txt(x+30,y+355,'局所のへこみ・光沢むらの模型',21)
 if key=='F':b+=line(x+80,y+140,x+380,y+140,'#e6f4f7',16)+txt(x+30,y+355,'検査合格を保証する見本ではない',21)
b+=txt(70,1170,'形だけで原因は確定しません。Eは同じ位置を磨き続ける不良の概念で、モーター停止ではありません。',22)
make('defects-observation','表面不良：観察した形と原因推定を分ける',b)
b=txt(65,180,'A：停止した工具の概念／清掃・調整を実演しない',30)+rect(70,215,660,330)
b+='<circle cx="300" cy="370" r="105" fill="#d9bf92" stroke="#37677a" stroke-width="7"/><circle cx="300" cy="370" r="18" fill="#37677a"/>'+line(405,370,605,370)+rect(185,480,240,30,'#a9c6d3')+txt(460,325,'停止',40)+txt(90,580,'光沢・バリや傷の除去は目的。回転数や押付け条件は示さない。',23)+txt(820,180,'B・C・D：独立した表面断面モデル',30)
for i,(label,points)in enumerate([('B：粗い凹凸','850,320 900,265 950,320 1000,260 1050,320 1100,270 1150,320 1200,260 1250,320 1300,270 1350,320 1430,270'),('C：細かくなっても深い傷が残る','850,520 900,510 950,520 1000,510 1050,520 1100,580 1150,520 1200,510 1250,520 1300,510 1350,520 1430,510'),('D：細かく均一な模型','850,760 900,752 950,760 1000,752 1050,760 1100,752 1150,760 1200,752 1250,760 1300,752 1350,760 1430,752')]):
 y=230+i*225;b+=txt(820,y,label,25)+f'<polyline points="{points}" fill="none" stroke="#406978" stroke-width="7"/>'
b+=txt(70,860,'工程の目的：粗い段階の傷を確認 → 中間の均一化 → 指定の仕上げ',29)+txt(70,935,'細かい番手へ進むだけで残った深い傷が消えるとは限りません。',28)+txt(70,1000,'番手とRaは一対一の換算ではありません。色・通称から全製品の成分も決まりません。',26)+txt(70,1080,'Cの深い谷を残したまま「細かいから合格」としない。面・条件・指定評価を確認します。',25)+txt(70,1150,'図は操作順序や材料除去量を保証せず、鏡面の必要性も製品の指定で異なります。',24)
make('buff-progression','バフ：停止工具と工程前後の表面変化',b)
# Quiz assets retain only neutral panel codes and given dimensions.
import xml.etree.ElementTree as ET
for name in ['area-model','defects-observation','buff-progression']:
 tree=ET.parse(A/(name+'.svg'));root=tree.getroot()
 for g in root.iter():
  for e in list(g):
   if not e.tag.endswith('text'):continue
   t=e.text or ''
   if name=='area-model':
    if any(z in t for z in ['4800','5200','400 mm','個別に吊るした','小物を入れる','巻いた帯']):g.remove(e);continue
    if t.startswith(('C：','D：','E：')):e.text=t[0]
   elif name=='defects-observation':
    if len(t)>2 and t[0]in 'ABCDEF' and t[1]=='：':e.text=t[0]
    elif e.attrib.get('font-size')in ['21','22']:g.remove(e)
   else:
    if t.startswith(('A：','B：','C：','D：')):e.text=t[0]
    elif any(z in t for z in ['停止','工程の目的','細かい番手','番手とRa','Cの深い谷','光沢・バリ']):g.remove(e)
 tree.write(A/(name+'-quiz.svg'),encoding='unicode')
 subprocess.run(['inkscape',str(A/(name+'-quiz.svg')),'--export-type=png','--export-filename='+str(A/(name+'-quiz.png'))],check=True,capture_output=True)
LOCS=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
sha=lambda b:hashlib.sha256(b).hexdigest()
meta=[('plated-area-and-arrangement','area-model',[159,160],['mfg1-surface-lesson-032'],'面積とラック・バレル・連続ストリップを読む','穴のない60×40×2mmの紙上モデル。広い二面4800mm²、側面込み5200mm²。Cはラック、Dはバレル、Eは連続ストリップの概念です。実物の対象面・接点・使用条件は別に確認します。'),('surface-defect-observation','defects-observation',[164,165,170,204],['mfg1-surface-lesson-017','mfg1-surface-lesson-060','mfg1-surface-lesson-062'],'合成画像で表面不良の観察を分ける','Aは不めっき、Bは変色、Cは光沢不足、Dはスクラッチ、Eは局所的に磨き続けた跡、Fは比較用模型です。合成模式図であり実物写真ではありません。外観から原因・合否を確定しません。'),('buff-stage-surface-change','buff-progression',[186,191,197],['mfg1-surface-completion37-lesson-005','mfg1-surface-lesson-008','mfg1-surface-lesson-061'],'停止したバフと粗い面・残留傷・均一面','Aは停止工具。Bは粗い面、Cは細かい凹凸にも深い傷が残る面、Dは均一な模型です。目的には光沢とバリ・傷の除去があります。番手からRaや合格を保証せず、実作業の操作条件は示しません。')]
JP=[
['図の板で広い二面だけを対象にし、四側面を除く面積はどれか。',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800mm²。','一面分だけで二面ではない。','これは四側面も含む。','これは四側面だけ。']],
['図の穴なし直方体で六面すべてを対象にする面積はどれか。',['4800mm²','5200mm²','2400mm²','5000mm²'],['四側面400mm²が欠ける。','4800+2×(60+40)×2=5200mm²。','一面だけで他の面が欠ける。','四側面の合計は200ではなく400mm²。']],
['C・D・Eの保持・移動方式の対応として正しいものはどれか。',['Cバレル・Dラック・E連続','C連続・Dラック・Eバレル','Cラック・Dバレル・E連続ストリップ','すべて同じ個別吊り方式'],['CとDが逆。','三方式の対応が違う。','個別吊り、回転容器、巻材の連続方式を区別している。','小物容器と連続巻材は個別吊りと異なる。']],
['図AとBの観察名の正しい組合せはどれか。',['A不めっき・B変色','Aスクラッチ・B不めっき','A光沢不足・Bスクラッチ','AもBも原因まで確定済み'],['Aは一部の皮膜欠け、Bは皮膜の色の違いを示す。','Aは線状傷ではなく、Bは皮膜欠けの模型ではない。','CとDの観察名を取り違えている。','外観模型だけで原因は確定しない。']],
['同じ照明条件の合成模型CとDの違いを正しく説明するものはどれか。',['Cは不めっき、Dは正常','Cは光沢不足、Dは線状のスクラッチ','Cは深さ計の目盛り、Dは温度計','Cは必ず酸化、Dは必ず洗浄不良'],['Cは皮膜欠けの図ではなく、Dには傷がある。','光沢の弱さと細長い傷の形を分けて観察している。','いずれも計器の図ではない。','図から特定原因までは確定しない。']],
['Eの局所的な跡について適切な説明はどれか。',['モーターが停止した証拠','不良ではなく全製品の合格保証','同じ位置を磨き続けた場合のへこみ・むらの模型で、原因の確定には記録確認が必要','どの実製品も同じ条件へ変更する指示'],['バフ止まりの不良はモーター停止という意味ではない。','合成模型は合格保証ではない。','局所的な磨き跡と原因確認を分けている。','図は操作条件を指定しない。']],
['表面B・C・Dを比較して適切なのはどれか。',['Cには細かい凹凸だけで深い傷はない','Dが見えれば全製品を出荷できる','BからCへ進めば検査不要','Cには深い谷が残るため、細かい段階というだけで完了としない'],['C中央に深い谷が描かれている。','Dは合成模型で合否基準ではない。','工程名だけで確認を省略しない。','前工程の傷の残りと指定仕上げを別に確認する。']],
['番手と仕上げを図からどう判断するか。',['番手とRaは常に一対一','番手や色だけでRa・成分・合格を保証せず指定評価で確認する','細かい番手ならどの深い傷も必ず消える','色が同じなら全研磨剤は同じ配合'],['粒度情報と実際の粗さは同じ保証値ではない。','粒度・成分・仕上げ評価の役割を分けている。','細かくするだけで深い傷の除去は保証されない。','通称や色だけで配合は決まらない。']],
['Aの工具図と研磨の目的について適切なのはどれか。',['停止図なので回転中の清掃を実演してよい','研磨の目的は光沢だけでバリや傷は無関係','Aは停止工具の模型。光沢やバリ・傷の除去は目的だが、操作条件や実演の許可ではない','図の接触位置だけで押付け力を決める'],['停止図は回転中の接触を許可しない。','バリや傷の除去も目的に含む。','工具の状態、目的、作業権限を分けている。','模式図は力や回転数などを指定しない。']]
]
sourceLessons={}
for f in [R/'src/data/manufacturing/surface.json',R/'src/data/manufacturing/completion37/surface.json']:
 for l in json.loads(f.read_text())['lessons']:sourceLessons[l['id']]=l
packs=[]
for i,(suffix,name,pages,links,title,cap)in enumerate(meta):
 png=A/(name+'-quiz.png');aid='mfg38-'+name+'-quiz';asset={'id':aid,'file':str(png.relative_to(R)),'width':1600,'height':1300,'altJa':'独立した合成問題図。パネル記号と図形を観察する。','sha256':sha(png.read_bytes())};questions=[]
 for j,(stem,opts,reasons)in enumerate(JP[i*3:i*3+3]):
  q={'id':'mfg38-'+suffix+'-q'+str(j+1),'lessonId':links[0],'stemJa':stem,'optionsJa':opts,'correctIndex':[[0,1,2],[0,1,2],[3,1,2]][i][j],'optionReasonsJa':reasons,'sources':[{'documentId':'mfg1-surface-source','pdfPage':n,'printedPage':n-10}for n in pages],'imageAssetIds':[aid],'imageAssetHashes':{aid:asset['sha256']},'reviewStatus':'ai_authored_source_compared_unreviewed'};q['sourceHash']=sha(json.dumps(q,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode());questions.append(q)
 packs.append({'id':'mfg37-required-'+suffix,'lessonIds':links,'lessonSourceHashes':{l:sourceLessons[l]['sourceHash']for l in links},'titleJa':title,'captionJa':cap,'assets':[asset,{'id':'mfg38-'+name+'-teaching','file':str((A/(name+'.png')).relative_to(R)),'width':1600,'height':1300,'altJa':cap,'sha256':sha((A/(name+'.png')).read_bytes()),'role':'post_submission_teaching'}],'questions':questions,'locales':{},'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceVerified':False,'status':'ai_authored_controlled_synthetic_preview'})
def tr(locale,captions,rows):
 assert len(captions)==3 and len(rows)==9,(locale,len(rows))
 for i,p in enumerate(packs):
  entries={}
  for q,row in zip(p['questions'],rows[i*3:i*3+3]):
   stem,opts,reasons=row;assert len(opts)==len(reasons)==4
   entries[q['id']]={'sourceHash':q['sourceHash'],'stem':stem,'options':opts,'reasons':reasons,'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False}
  p['locales'][locale]={'captionSourceHash':sha(p['captionJa'].encode()),'caption':captions[i],'questions':entries}
tr('en',['Paper model:60×40×2mm,no holes. Two broad faces4800mm²;with edges5200mm². C rack,D barrel,E continuous strip. Verify actual target faces,contacts and conditions separately.','Synthetic models:A unplated,B discolored,C low gloss,D scratches,E localized polishing dwell,F comparison surface. These are not real photos; appearance alone establishes neither cause nor acceptance.','A is a stopped tool. B is coarse,C retains a deep scratch despite finer texture,D is a uniform model. Polishing may improve gloss/remove burrs and scratches. Grit does not guarantee Ra or acceptance; operating settings are not specified.'],[
['Area of the two broad faces,excluding all four edges?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800.','Only one broad face.','Includes edges.','Edges only.']],
['Area of all six faces of the hole-free block?',['4800mm²','5200mm²','2400mm²','5000mm²'],['Missing400of edges.','4800+2×(60+40)×2=5200.','Only one face.','Edge area is400,not200.']],
['Correct match for C,D,E?',['Barrel,rack,continuous','Continuous,rack,barrel','Rack,barrel,continuous strip','All individually suspended'],['C/D reversed.','All three mismatched.','Suspended items,rotating container,continuous coil differ.','Container and strip are not individual suspension.']],
['Correct observations for A/B?',['Unplated/discolored','Scratch/unplated','Low gloss/scratch','Both causes proven'],['Missing film versus changed film color.','Neither description matches A/B.','Those describe C/D.','Appearance does not prove cause.']],
['What distinguishes C/D under matched lighting?',['Unplated/normal','Low gloss/linear scratches','Depth scale/thermometer','Always oxidation/poor washing'],['C is not missing coating;D has scratches.','Separates gloss and elongated marks.','Neither is an instrument.','Specific causes are unproven.']],
['Appropriate interpretation of E?',['Proof motor stopped','Acceptance guarantee','Model of local depression/uneven gloss from prolonged local polishing;verify causes with records','Instruction to change all products to one setting'],['Dwell defect does not mean motor stop.','Synthetic model is not acceptance.','Separates observation and cause verification.','No operating conditions are specified.']],
['Correct comparison of B/C/D?',['C has no deep scratch','D permits shipment of all products','B-to-C removes inspection needs','C retains a deep valley;fine-stage label does not mean complete'],['A deep central valley is visible.','D is not acceptance criteria.','Stage names do not replace checks.','Verify prior scratches and required finish.']],
['What follows about grit and finish?',['Grit always maps one-to-one to Ra','Do not guarantee Ra,ingredients or acceptance from grit/color;use specified evaluation','Fine grit always removes every deep scratch','Same color means same formulation'],['Grit and actual roughness differ.','Separates grit,composition and assessment.','Finer alone does not guarantee removal.','Color/common name does not fix formulation.']],
['Correct interpretation of A and polishing purpose?',['Stopped drawing permits cleaning while rotating','Gloss is the only purpose','Stopped-tool model;gloss and burr/scratch removal are purposes,but no operating permission/settings','Contact point determines force'],['It permits no rotating contact.','Burr/scratch removal also matters.','Separates state,purpose and authority.','No force/speed setting is provided.']]
])
tr('vi',['Mô hình giấy60×40×2mm,không lỗ. Hai mặt rộng4800mm²,kể cạnh5200mm². Cgá treo,Dthùng quay,Edải liên tục. Mặt cần xử lý,tiếp điểm,điều kiện thật phải kiểm riêng.','Hình tổng hợp:Akhông bám mạ,Bđổi màu,Cthiếu bóng,Dxước,Evết đánh lâu cục bộ,Fmặt so sánh. Không phải ảnh thật;ngoại hình không tự xác định nguyên nhân hay đạt.','Alà dụng cụ dừng;Bthô,Cmịn nhưng còn xước sâu,Dmô hình đều. Mục tiêu gồm bóng,tẩy ba via/xước. Cỡ hạt không bảo đảmRa/đạt;không chỉ điều kiện vận hành.'],[
['Hai mặt rộng,không tính bốn cạnh,có diện tích?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800.','Chỉ một mặt.','Gồm cạnh.','Chỉ cạnh.']],
['Sáu mặt khối không lỗ có diện tích?',['4800mm²','5200mm²','2400mm²','5000mm²'],['Thiếu400cạnh.','4800+2×(60+40)×2=5200.','Chỉ một mặt.','Cạnh400không phải200.']],
['Ghép đúngC,D,E?',['Thùng quay,gá treo,liên tục','Liên tục,gá treo,thùng quay','Gá treo,thùng quay,dải liên tục','Đều treo từng vật'],['ĐảoC/D.','Sai ba cách.','Phân treo từng vật,thùng quay,cuộn liên tục.','Thùng và dải khác treo từng vật.']],
['Tên quan sát đúngA/B?',['Không bám mạ/đổi màu','Xước/không mạ','Thiếu bóng/xước','Đã chắc nguyên nhân cả hai'],['Thiếu màng khác màng đổi màu.','Không đúng hìnhA/B.','ĐóC/D.','Ngoại hình không xác định nguyên nhân.']],
['C/Dcùng chiếu sáng khác gì?',['Không mạ/bình thường','Thiếu bóng/xước dài','Thang sâu/nhiệt kế','Luôn oxy hóa/rửa kém'],['Ckhông thiếu màng,Dcó xước.','Tách bóng yếu và vết dài.','Không phải máy đo.','Chưa chắc nguyên nhân.']],
['HiểuEphù hợp?',['Chứng minh motor dừng','Bảo đảm đạt','Mô hình lõm/loang do đánh lâu một chỗ;cần hồ sơ xác minh nguyên nhân','Lệnh đổi mọi sản phẩm cùng cài đặt'],['Lỗi đánh dừng chỗ không là motor dừng.','Mô hình không bảo đảm đạt.','Tách quan sát và xác minh.','Không chỉ điều kiện thao tác.']],
['SoB/C/Dđúng?',['Ckhông xước sâu','Dcó là được xuất mọi hàng','TừBđếnCkhỏi kiểm','Ccòn rãnh sâu;giai đoạn mịn chưa nghĩa xong'],['Ccó rãnh sâu giữa.','Dkhông là chuẩn đạt.','Tên giai đoạn không thay kiểm.','Kiểm xước trước và đích hoàn thiện.']],
['Cỡ hạt và hoàn thiện hiểu sao?',['Luôn đổi một-một vớiRa','Không bảo đảmRa,thành phần,đạt bằng cỡ/màu;theo đánh giá chỉ định','Mịn luôn xóa mọi xước','Cùng màu cùng công thức'],['Cỡ khác độ nhám thật.','Tách cỡ,thành phần,đánh giá.','Mịn không bảo đảm xóa sâu.','Tên/màu không quyết phối liệu.']],
['HìnhAvà mục đích đánh bóng?',['Hình dừng cho vệ sinh lúc quay','Chỉ làm bóng','Mô hình dừng;mục tiêu bóng/tẩy ba via,xước,không cấp phép hay cài đặt','Vị trí tiếp xúc quyết lực'],['Không cho chạm đang quay.','Còn ba via/xước.','Tách trạng thái,mục tiêu,quyền.','Không chỉ lực/tốc độ.']]
])
tr('id',['Model60×40×2mm tanpa lubang. Dua muka4800mm²,termasuk tepi5200mm². Crak,Dbarrel,Estrip kontinu. Periksa muka sasaran,kontak,kondisi nyata terpisah.','Model sintetis:Atanpa lapisan,Bberubah warna,Ckilap kurang,Dgoresan,Edwell lokal,Fpembanding. Bukan foto nyata;rupa takmenetapkan sebab/kelulusan.','Aalat berhenti;Bkasar,Clebih halus tetapi bergores dalam,Dmodel merata. Tujuan kilap dan membuang burr/goresan. Grit bukan jaminanRa/kelulusan;tidak menetapkan operasi.'],[
['Luas dua muka lebar tanpa empat tepi?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800.','Satu muka saja.','Termasuk tepi.','Tepi saja.']],
['Luas keenam muka balok tanpa lubang?',['4800mm²','5200mm²','2400mm²','5000mm²'],['Kurang400tepi.','4800+2×(60+40)×2=5200.','Satu muka saja.','Tepi400,bukan200.']],
['PasanganC,D,Eyang benar?',['Barrel,rak,kontinu','Kontinu,rak,barrel','Rak,barrel,strip kontinu','Semua tergantung satuan'],['C/Dterbalik.','Ketiganya salah.','Bedakan gantungan,wadah putar,gulungan kontinu.','Wadah/strip berbeda dari gantungan.']],
['PengamatanA/Byang benar?',['Tidak terlapis/berubah warna','Goresan/tidak terlapis','Kurang kilap/goresan','Sebab keduanya pasti'],['Film hilang versus warna berubah.','Tidak sesuaiA/B.','ItuC/D.','Rupa tidak membuktikan sebab.']],
['PerbedaanC/Ddengan cahaya sama?',['Tidak terlapis/normal','Kurang kilap/goresan memanjang','Skala dalam/termometer','Pasti oksidasi/cuci buruk'],['Cbukan film hilang;Dbergores.','Pisahkan kilap dan garis.','Bukan alat ukur.','Sebab belum pasti.']],
['MaknaEyang tepat?',['Motor pasti berhenti','Jaminan lulus','Model cekung/kilap takrata akibat pemolesan lokal lama;periksa sebab melalui catatan','Instruksi semua produk memakai setelan sama'],['Cacat dwell bukan motor berhenti.','Model bukan kelulusan.','Pisahkan pengamatan/verifikasi.','Tidak menetapkan operasi.']],
['PerbandinganB/C/Dyang benar?',['Ctanpa goresan dalam','Dmengizinkan semua pengiriman','BkeCmenghapus pemeriksaan','Cmasih lembah dalam;label tahap halus bukan selesai'],['Lembah dalam tampak diC.','Dbukan kriteria terima.','Nama tahap bukan pemeriksaan.','Periksa goresan awal/target.']],
['Grit dan hasil akhir?',['Selalu satu-banding-satuRa','Jangan jaminRa,komposisi,kelulusan dari grit/warna;ikuti evaluasi','Grit halus selalu hapus semua','Warna sama komposisi sama'],['Grit berbeda dari kekasaran nyata.','Pisahkan grit,komposisi,evaluasi.','Halus saja takmenjamin penghilangan.','Nama/warna bukan formulasi.']],
['AlatAdan tujuan pemolesan?',['Gambar berhenti mengizinkan bersih saat berputar','Tujuan hanya kilap','Model alat berhenti;kilap/burr/goresan adalah tujuan,bukan izin/setelan operasi','Posisi kontak menentukan gaya'],['Tidak mengizinkan kontak berputar.','Burr/goresan juga tujuan.','Pisahkan keadaan,tujuan,wewenang.','Takada gaya/kecepatan.']]
])
tr('zh-CN',['无孔60×40×2mm纸上模型。两大面4800mm²，含侧面5200mm²。C挂镀、D滚镀、E连续带材。实际目标面、接点及条件另行确认。','合成示意：A漏镀、B变色、C光泽不足、D划痕、E局部持续抛光痕、F比较面。并非实物照片，外观不能确定原因或合格。','A为停止工具；B粗糙，C细小起伏中仍有深划痕，D均匀模型。目的包括光泽和去毛刺、划痕。粒度不保证Ra或合格，图不指定操作条件。'],[
['两大面、不含四侧面的面积？',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800。','仅一大面。','包含侧面。','仅侧面。']],
['无孔长方体六面总面积？',['4800mm²','5200mm²','2400mm²','5000mm²'],['少侧面400。','4800+2×(60+40)×2=5200。','仅一面。','侧面400而非200。']],
['C、D、E正确对应？',['滚镀、挂镀、连续','连续、挂镀、滚镀','挂镀、滚镀、连续带材','全部逐件悬挂'],['C/D颠倒。','三者对应错误。','区分逐件挂、旋转容器、连续卷材。','容器与带材不同于逐件挂。']],
['A/B的正确观察名称？',['漏镀/变色','划痕/漏镀','光泽不足/划痕','两者原因均已确定'],['缺膜与膜颜色变化不同。','不符合A/B。','那是C/D。','外观不证明原因。']],
['同照明的C/D区别？',['漏镀/正常','光泽不足/线状划痕','深度尺/温度计','必为氧化/清洗不良'],['C非缺膜，D有划痕。','区分光泽弱与长线伤。','均非量具。','不能确定具体原因。']],
['E的合适解释？',['电机已停止的证据','合格保证','持续磨同处形成凹陷、光泽不匀的模型；原因须核查记录','所有产品改同一参数的指令'],['抛光停留缺陷不是电机停止。','模型不保证合格。','区分观察与原因核查。','图不指定操作参数。']],
['比较B/C/D何者正确？',['C没有深划痕','见D即可全部出货','B到C就不用检查','C仍有深谷，不能仅因细加工阶段便判完成'],['C中央有深谷。','D非合格标准。','阶段名不代替检查。','检查前段划痕及指定效果。']],
['如何理解粒度和效果？',['粒度与Ra始终一一对应','不凭粒度、颜色保证Ra、成分、合格；依指定评价','细粒度必除所有深痕','同色必同配方'],['粒度与实际粗糙度不同。','区分粒度、成分、评价。','变细不保证除深痕。','名称、颜色不能决定配方。']],
['A工具和抛光目的应如何理解？',['停止图允许旋转时清洁','只有光泽目的','停止工具模型；光泽、去毛刺划痕为目的，但非操作许可或参数','接触点决定压力'],['不允许旋转接触。','去毛刺划痕也是目的。','区分状态、目的、权限。','未指定力或转速。']]
])
tr('zh-TW',['無孔60×40×2mm紙上模型。兩大面4800mm²，含側面5200mm²。C掛鍍、D滾鍍、E連續帶材。實際目標面、接點及條件另行確認。','合成示意：A漏鍍、B變色、C光澤不足、D刮痕、E局部持續拋光痕、F比較面。不是實物照片，外觀不能確定原因或合格。','A為停止工具；B粗糙，C細小起伏中仍有深痕，D均勻模型。目的包含光澤與去毛邊、刮痕。粒度不保證Ra或合格，圖未指定操作條件。'],[
['兩大面、不含四側面的面積？',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800。','僅一大面。','含側面。','僅側面。']],
['無孔長方體六面總面積？',['4800mm²','5200mm²','2400mm²','5000mm²'],['少側面400。','4800+2×(60+40)×2=5200。','僅一面。','側面400不是200。']],
['C、D、E正確對應？',['滾鍍、掛鍍、連續','連續、掛鍍、滾鍍','掛鍍、滾鍍、連續帶材','全部逐件懸掛'],['C/D顛倒。','三者對應錯誤。','區分逐件掛、旋轉容器、連續捲材。','容器與帶材不同於逐件掛。']],
['A/B正確觀察名稱？',['漏鍍/變色','刮痕/漏鍍','光澤不足/刮痕','原因均已確定'],['缺膜與膜變色不同。','不符合A/B。','那是C/D。','外觀不能證明原因。']],
['同照明C/D的區別？',['漏鍍/正常','光澤不足/線狀刮痕','深度尺/溫度計','必為氧化/清洗不良'],['C非缺膜，D有傷。','區分光澤弱與長線傷。','均非量具。','具體原因未定。']],
['E合適解釋？',['馬達停止證據','合格保證','持續磨同處形成凹陷、光澤不勻的模型；原因須查紀錄','所有產品改同參數指令'],['停留缺陷不是馬達停止。','模型不保證合格。','區分觀察與原因確認。','未指定操作參數。']],
['比較B/C/D何者正確？',['C沒有深痕','見D即可全出貨','B到C就免檢','C仍有深谷，細加工階段不等於完成'],['C中央有深谷。','D非合格標準。','階段名不能代替檢查。','查前段傷與指定效果。']],
['粒度和效果應如何判斷？',['粒度與Ra永遠一一對應','不憑粒度、顏色保證Ra、成分或合格；依指定評估','細粒必除所有深痕','同色必同配方'],['粒度不同於實際粗糙度。','分開粒度、成分與評估。','變細不保證除深痕。','名稱、顏色不決定配方。']],
['A工具與拋光目的正確解釋？',['停止圖允許旋轉時清潔','目的只有光澤','停止工具模型；光澤、去毛邊刮痕為目的，非操作許可或參數','接觸點決定壓力'],['不允許旋轉接觸。','去毛邊刮痕也是目的。','分開狀態、目的與權限。','未指定力、轉速。']]
])
tr('tl',['Modelong papel60×40×2mm,walang butas. Dalawang malapad na mukha4800mm²;kasama ang gilid5200mm². Crack,Dbarrel,Econtinuous strip. Hiwalay na tiyakin ang aktuwal na mukha,kontak at kondisyon.','Sintetikong modelo:Awalang plating,Bpagbabago ng kulay,Ckulang na kinang,Dgasgas,Elokal na bakas ng matagal na pagkiskis,Fpanghambing. Hindi tunay na larawan;hindi sapat ang anyo upang patunayan ang sanhi o pagpasa.','Anakahintong kasangkapan;Bmagaspang,Cmas pino ngunit may malalim na gasgas,Dpantay na modelo. Layunin ang kinang at pag-alis ng burr/gasgas. Hindi garantiya ngRa/pagpasa ang grit;walang itinakdang operasyon.'],[
['Lawak ng dalawang malapad na mukha,walang apat na gilid?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800.','Isang mukha lamang.','Kasama ang gilid.','Gilid lamang.']],
['Lawak ng lahat ng anim na mukha?',['4800mm²','5200mm²','2400mm²','5000mm²'],['Kulang ang400ng gilid.','4800+2×(60+40)×2=5200.','Isang mukha lamang.','400ang gilid,hindi200.']],
['Tamang pagtutugma ngC,D,E?',['Barrel,rack,tuluy-tuloy','Tuluy-tuloy,rack,barrel','Rack,barrel,continuous strip','Lahat paisa-isang nakasabit'],['BaligtadC/D.','Mali ang tatlo.','Magkaiba ang sabit,umiikot na lalagyan at tuluy-tuloy na rolyo.','Hindi sabit ang lalagyan at strip.']],
['Tamang obserbasyon saA/B?',['Walang plating/nag-iba ang kulay','Gasgas/walang plating','Kulang kinang/gasgas','Tiyak na ang parehong sanhi'],['Kulang na film kumpara sa pagbabago ng kulay.','Hindi itoA/B.','Iyan ayC/D.','Hindi patunay ng sanhi ang anyo.']],
['Pagkakaiba ngC/Dsa parehong ilaw?',['Walang plating/normal','Kulang kinang/mahahabang gasgas','Depth scale/termometro','Laging oxidation/mahinang hugas'],['Hindi nawawalang film angC;may gasgas angD.','Hiwalay ang kinang at linyang gasgas.','Hindi instrumento.','Hindi tiyak ang sanhi.']],
['Angkop na kahulugan ngE?',['Patunay huminto ang motor','Garantiya ng pagpasa','Modelo ng lubog/di-pantay na kinang dahil sa matagal na lokal na pagkiskis;tiyakin ang sanhi sa rekord','Utos sa iisang setting ng lahat'],['Dwell defect ay hindi paghinto ng motor.','Hindi garantiya ang modelo.','Ihiwalay obserbasyon at pagpapatunay.','Walang operating setting.']],
['Tamang paghahambing saB/C/D?',['Walang malalim na gasgas angC','Dpuwedeng ipadala lahat','BpatungongCwala nang inspeksiyon','May malalim na lambak pa angC;hindi sapat ang pangalang pino'],['May malalim na gitnang lambak.','Hindi acceptance criterion angD.','Hindi kapalit ng pagsusuri ang yugto.','Suriin lumang gasgas at target finish.']],
['Paano unawain ang grit at finish?',['Laging katumbas ngRa','Huwag garantiyahanRa,sangkap,pagpasa sa grit/kulay;gamitin takdang pagsusuri','Pinong grit laging aalis ng lahat','Parehong kulay parehong pormula'],['Magkaiba grit at aktuwal na gaspang.','Ihiwalay grit,sangkap,pagsusuri.','Hindi garantisado ang malalim na gasgas.','Hindi pormula ang pangalan/kulay.']],
['Tamang paliwanag saAat layunin?',['Pinapayagan ng nakahintong larawan ang paglilinis habang umiikot','Kinang lamang ang layunin','Nakahintong modelo;kinang at pag-alis burr/gasgas ay layunin,hindi pahintulot o setting','Punto ng kontak ang nagtatakda ng puwersa'],['Walang pahintulot sa umiikot na kontak.','Kasama ang burr/gasgas.','Hiwalay estado,layunin,awtoridad.','Walang puwersa/bilis na itinakda.']]
])
tr('hi',['बिना छेद60×40×2mmका कागजी मॉडल। दो बड़े तल4800mm²,किनारे सहित5200mm²। Cरैक,Dबैरल,Eनिरंतर पट्टी। वास्तविक तल,संपर्क,शर्त अलग जाँचें।','कृत्रिम मॉडल:Aबिना प्लेटिंग,Bरंग बदलाव,Cकम चमक,Dखरोंच,Eस्थानीय लंबे पॉलिश का निशान,Fतुलना। वास्तविक फोटो नहीं;रूप से कारण/स्वीकृति निश्चित नहीं।','Aरुका औजार;Bखुरदरा,Cमहीन पर गहरी खरोंच,Dसमान मॉडल। उद्देश्य चमक और बर्र/खरोंच हटाना। ग्रिटRaया स्वीकृति की गारंटी नहीं;संचालन शर्त नहीं दी।'],[
['चार किनारे छोड़कर दो बड़े तलों का क्षेत्रफल?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800।','केवल एक तल।','किनारे शामिल हैं।','केवल किनारे।']],
['बिना छेद छह तलों का कुल क्षेत्रफल?',['4800mm²','5200mm²','2400mm²','5000mm²'],['किनारे400छूटे।','4800+2×(60+40)×2=5200।','केवल एक तल।','किनारे400,200नहीं।']],
['C,D,Eका सही मेल?',['बैरल,रैक,निरंतर','निरंतर,रैक,बैरल','रैक,बैरल,निरंतर पट्टी','सभी अलग लटके'],['C/Dउलटे।','तीनों मेल गलत।','लटके भाग,घूमता पात्र,निरंतर रोल अलग हैं।','पात्र/पट्टी अलग लटकाना नहीं।']],
['A/Bका सही अवलोकन?',['बिना प्लेटिंग/रंग बदलाव','खरोंच/बिना प्लेटिंग','कम चमक/खरोंच','दोनों कारण सिद्ध'],['परत न होना और रंग बदलना अलग।','A/Bसे मेल नहीं।','वेC/Dहैं।','रूप कारण सिद्ध नहीं करता।']],
['समान रोशनी मेंC/Dका अंतर?',['बिना प्लेटिंग/सामान्य','कम चमक/रेखीय खरोंच','गहराई स्केल/तापमापी','हमेशा ऑक्सीकरण/खराब धुलाई'],['Cपरत-रहित नहीं;Dमें खरोंच।','चमक और लंबी रेखा अलग।','ये उपकरण नहीं।','विशिष्ट कारण निश्चित नहीं।']],
['Eका उचित अर्थ?',['मोटर रुकने का प्रमाण','स्वीकृति गारंटी','एक जगह देर पॉलिश से गड्ढा/असमान चमक का मॉडल;कारण रिकॉर्ड से जाँचें','सभी की सेटिंग बदलने का आदेश'],['ड्वेल दोष मोटर रुकना नहीं।','मॉडल गारंटी नहीं।','अवलोकन/कारण जाँच अलग।','संचालन शर्त नहीं दी।']],
['B/C/Dतुलना में सही?',['Cमें गहरी खरोंच नहीं','Dसे सब भेज सकते हैं','BसेCहो तो जाँच नहीं','Cमें गहरी घाटी बची;महीन चरण पूरा होना नहीं'],['Cबीच गहरी घाटी है।','Dस्वीकृति मानदंड नहीं।','चरणनाम जाँच का विकल्प नहीं।','पुरानी खरोंच और लक्ष्य अलग जाँचें।']],
['ग्रिट और फिनिश का सही अर्थ?',['ग्रिट हमेशा एकRa','ग्रिट/रंग सेRa,संघटन,स्वीकृति न मानें;निर्दिष्ट मूल्यांकन करें','महीन ग्रिट सब हटाता है','समान रंग समान फॉर्मूला'],['ग्रिट वास्तविक खुरदरापन नहीं।','ग्रिट,संघटन,मूल्यांकन अलग।','महीन होना हटाना सुनिश्चित नहीं।','नाम/रंग फॉर्मूला नहीं।']],
['Aऔर पॉलिश उद्देश्य का उचित कथन?',['रुकी तस्वीर घूमते औजार की सफाई की अनुमति','केवल चमक उद्देश्य','रुका मॉडल;चमक/बर्र/खरोंच उद्देश्य,पर संचालन अनुमति/शर्त नहीं','संपर्क बिंदु बल तय करता है'],['घूमते संपर्क की अनुमति नहीं।','बर्र/खरोंच भी उद्देश्य।','स्थिति,उद्देश्य,अधिकार अलग।','बल/गति नहीं दी।']]
])
tr('bn',['ছিদ্রহীন60×40×2mmকাগুজে মডেল। দুই বড় তল4800mm²,ধারসহ5200mm²। Cর্যাক,Dব্যারেল,Eঅবিরাম স্ট্রিপ। বাস্তব তল,সংযোগ,শর্ত আলাদা যাচাই করুন।','কৃত্রিম মডেল:Aপ্রলেপহীন,Bবিবর্ণ,Cকম ঔজ্জ্বল্য,Dআঁচড়,Eএক স্থানে দীর্ঘ পলিশের দাগ,Fতুলনা। প্রকৃত ছবি নয়;রূপে কারণ/গ্রহণযোগ্যতা নিশ্চিত নয়।','Aথামা টুল;Bরুক্ষ,Cমিহি কিন্তু গভীর আঁচড়,Dসমান মডেল। উদ্দেশ্য ঔজ্জ্বল্য ও বার/আঁচড় সরানো। গ্রিটRaবা গ্রহণ নিশ্চিত করে না;চালনার শর্ত দেওয়া নেই।'],[
['চার ধার বাদে দুই বড় তলের ক্ষেত্রফল?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800।','এক তল মাত্র।','ধারসহ।','ধার মাত্র।']],
['ছিদ্রহীন ঘনবস্তুর ছয় তলের ক্ষেত্রফল?',['4800mm²','5200mm²','2400mm²','5000mm²'],['ধারের400বাদ।','4800+2×(60+40)×2=5200।','এক তল মাত্র।','ধার400,200নয়।']],
['C,D,Eসঠিক মিল?',['ব্যারেল,র্যাক,অবিরাম','অবিরাম,র্যাক,ব্যারেল','র্যাক,ব্যারেল,অবিরাম স্ট্রিপ','সব আলাদা ঝোলানো'],['C/Dউল্টো।','তিন মিল ভুল।','ঝোলা অংশ,ঘূর্ণনপাত্র,অবিরাম কয়েল আলাদা।','পাত্র/স্ট্রিপ আলাদা ঝোলানো নয়।']],
['A/Bসঠিক পর্যবেক্ষণ?',['প্রলেপহীন/বিবর্ণ','আঁচড়/প্রলেপহীন','কম ঔজ্জ্বল্য/আঁচড়','উভয়ের কারণ প্রমাণিত'],['পরতহীন ও পরতের রংবদল আলাদা।','A/Bমেলে না।','ওগুলিC/D।','রূপ কারণ প্রমাণ নয়।']],
['এক আলোয়C/Dপার্থক্য?',['প্রলেপহীন/স্বাভাবিক','কম ঔজ্জ্বল্য/রেখাকার আঁচড়','গভীরতার স্কেল/থার্মোমিটার','অবশ্যই জারণ/খারাপ ধোয়া'],['Cপরতহীন নয়;Dআঁচড়যুক্ত।','ঔজ্জ্বল্য ও দীর্ঘ দাগ আলাদা।','কোনোটিই যন্ত্র নয়।','নির্দিষ্ট কারণ নিশ্চিত নয়।']],
['Eএর উপযুক্ত অর্থ?',['মোটর থামার প্রমাণ','গ্রহণের নিশ্চয়তা','এক স্থানে দীর্ঘ ঘষায় গর্ত/অসম ঔজ্জ্বল্যের মডেল;কারণ রেকর্ডে যাচাই','সব পণ্যে এক সেটিংয়ের নির্দেশ'],['ডুয়েল-ত্রুটি মোটর থামা নয়।','মডেল নিশ্চয়তা নয়।','পর্যবেক্ষণ ও কারণযাচাই আলাদা।','চালনার শর্ত নেই।']],
['B/C/Dতুলনায় সঠিক?',['Cগভীর আঁচড়হীন','Dদেখলেই সব পাঠানো যায়','BথেকেCহলে পরীক্ষা নেই','Cগভীর খাঁজ রয়ে গেছে;মিহি ধাপ মানেই সম্পূর্ণ নয়'],['Cমাঝে গভীর খাঁজ।','Dগ্রহণমান নয়।','ধাপের নাম পরীক্ষা নয়।','আগের আঁচড় ও নির্দিষ্ট ফিনিশ দেখুন।']],
['গ্রিট ও ফিনিশ সম্পর্কে সঠিক?',['গ্রিট সবসময় একRa','গ্রিট/রংয়েRa,উপাদান,গ্রহণ নিশ্চিত নয়;নির্দিষ্ট মূল্যায়ন করুন','মিহি গ্রিট সব সরায়','এক রং এক ফর্মুলা'],['গ্রিট প্রকৃত রুক্ষতা নয়।','গ্রিট,উপাদান,মূল্যায়ন আলাদা।','মিহি করলেই গভীর দাগ যায় না।','নাম/রং ফর্মুলা নয়।']],
['Aওপলিশের উদ্দেশ্য সম্পর্কে সঠিক?',['থামা ছবি চলন্ত টুল পরিষ্কারের অনুমতি','কেবল ঔজ্জ্বল্য উদ্দেশ্য','থামা মডেল;ঔজ্জ্বল্য/বার/আঁচড় উদ্দেশ্য,চালনার অনুমতি/শর্ত নয়','যোগস্থানই বল নির্ধারণ করে'],['ঘূর্ণনরত স্পর্শের অনুমতি নয়।','বার/আঁচড়ও উদ্দেশ্য।','অবস্থা,উদ্দেশ্য,অধিকার আলাদা।','বল/গতি দেওয়া নেই।']]
])
tr('ne',['प्वालरहित60×40×2mmकागजी मोडेल। दुई ठूला सतह4800mm²,किनारासहित5200mm²। Cर्याक,Dब्यारेल,Eनिरन्तर स्ट्रिप। वास्तविक सतह,सम्पर्क,सर्त छुट्टै जाँच्नुहोस्।','कृत्रिम मोडेल:Aप्लेटिङ नभएको,Bरङ परिवर्तन,Cकम चमक,Dकोर,Eएक ठाउँमा लामो पालिसको डोब,Fतुलना। वास्तविक फोटो होइन;आकृतिले कारण/स्वीकृति निश्चित गर्दैन।','Aरोकिएको औजार;Bखस्रो,Cमसिनो भए पनि गहिरो कोर,Dसमान मोडेल। चमक र बर्र/कोर हटाउने उद्देश्य। ग्रिटलेRaवा स्वीकृति सुनिश्चित गर्दैन;सञ्चालन सर्त छैन।'],[
['चार किनारा बाहेक दुई ठूला सतहको क्षेत्रफल?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800।','एउटा सतह मात्र।','किनारा समावेश।','किनारा मात्र।']],
['प्वालरहित छ सतहको कुल क्षेत्रफल?',['4800mm²','5200mm²','2400mm²','5000mm²'],['किनाराको400छुट्यो।','4800+2×(60+40)×2=5200।','एउटा सतह मात्र।','किनारा400हो,200होइन।']],
['C,D,Eसही जोडी?',['ब्यारेल,र्याक,निरन्तर','निरन्तर,र्याक,ब्यारेल','र्याक,ब्यारेल,निरन्तर स्ट्रिप','सबै छुट्टै झुन्डिएका'],['C/Dउल्टो।','तीनै गलत।','झुन्ड्याइ,घुम्ने भाँडो,निरन्तर रोल छुट्टै।','भाँडो/स्ट्रिप छुट्टै झुन्ड्याइ होइन।']],
['A/Bको सही अवलोकन?',['प्लेटिङ नभएको/रङ परिवर्तन','कोर/प्लेटिङ नभएको','कम चमक/कोर','दुवै कारण प्रमाणित'],['फिल्म नहुनु र रङ बदलिनु फरक।','A/Bमिल्दैन।','तीC/Dहुन्।','रूपले कारण सिद्ध गर्दैन।']],
['समान प्रकाशमाC/Dफरक?',['प्लेटिङ नभएको/सामान्य','कम चमक/रेखाकार कोर','गहिराइ स्केल/तापमापक','सधैँ अक्सिडेसन/खराब धुलाई'],['Cफिल्मविहीन होइन;Dमा कोर।','चमक र लामो रेखा छुट्टै।','यन्त्र होइनन्।','खास कारण निश्चित छैन।']],
['Eको उचित व्याख्या?',['मोटर रोकिएको प्रमाण','स्वीकृतिको ग्यारेन्टी','एकै ठाउँ लामो पालिसको डोब/असमान चमक मोडेल;कारण अभिलेखबाट जाँच्ने','सबै सेटिङ बदल्ने आदेश'],['ड्वेल दोष मोटर रोकिनु होइन।','मोडेल ग्यारेन्टी होइन।','अवलोकन/कारण जाँच छुट्टै।','सञ्चालन सर्त छैन।']],
['B/C/Dतुलनामा सही?',['Cमा गहिरो कोर छैन','Dभए सबै पठाउन मिल्छ','BबाटCहुँदा जाँच पर्दैन','Cमा गहिरो खाल्डो बाँकी;मसिनो चरण मात्रले पूरा हुँदैन'],['Cबीच गहिरो खाल्डो छ।','Dस्वीकृति मापदण्ड होइन।','चरणनाम जाँच होइन।','अघिको कोर र लक्षित फिनिश जाँच्नुहोस्।']],
['ग्रिट र फिनिश कसरी बुझ्ने?',['ग्रिट सधैँ एकRa','ग्रिट/रङलेRa,संरचना,स्वीकृति नमान्ने;निर्दिष्ट मूल्याङ्कन गर्ने','मसिनोले सबै कोर हटाउँछ','एउटै रङ एउटै मिश्रण'],['ग्रिट वास्तविक खस्रोपन होइन।','ग्रिट,संरचना,मूल्याङ्कन अलग।','मसिनो मात्रले हटाउने ग्यारेन्टी छैन।','नाम/रङ मिश्रण होइन।']],
['Aरपालिस उद्देश्यको उचित कथन?',['रोकिएको चित्रले घुम्दाको सफाइ अनुमति','चमक मात्र उद्देश्य','रोकिएको मोडेल;चमक/बर्र/कोर उद्देश्य,सञ्चालन अनुमति/सर्त होइन','सम्पर्कले बल तय गर्छ'],['घुम्दाको सम्पर्क अनुमति छैन।','बर्र/कोर पनि उद्देश्य।','अवस्था,उद्देश्य,अधिकार छुट्टै।','बल/गति छैन।']]
])
tr('th',['แบบจำลองกระดาษ60×40×2mmไม่มีรู สองหน้ากว้าง4800mm²รวมขอบ5200mm² Crack,Dbarrel,Eแถบต่อเนื่อง ต้องตรวจหน้าจริง จุดสัมผัสและเงื่อนไขแยกต่างหาก','ภาพสังเคราะห์:Aไม่ติดชุบ,Bเปลี่ยนสี,Cเงาไม่พอ,Dรอยขีด,Eรอยขัดค้างเฉพาะจุด,Fผิวเปรียบเทียบ ไม่ใช่ภาพจริง รูปลักษณ์ไม่ยืนยันสาเหตุหรือผลผ่าน','Aเครื่องมือหยุด Bหยาบ Cละเอียดแต่ยังมีรอยลึก Dแบบผิวสม่ำเสมอ เป้าหมายรวมเงาและกำจัดครีบ/รอย เบอร์ไม่รับประกันRaหรือผลผ่าน และไม่ระบุเงื่อนไขเดินเครื่อง'],[
['พื้นที่สองหน้ากว้างไม่รวมสี่ขอบเท่าใด?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800','หน้าเดียว','รวมขอบ','เฉพาะขอบ']],
['พื้นที่ครบหกหน้าของแท่งไม่มีรู?',['4800mm²','5200mm²','2400mm²','5000mm²'],['ขาดขอบ400','4800+2×(60+40)×2=5200','หน้าเดียว','ขอบ400ไม่ใช่200']],
['จับคู่C,D,Eที่ถูกต้อง?',['barrel,rack,ต่อเนื่อง','ต่อเนื่อง,rack,barrel','rack,barrel,แถบต่อเนื่อง','แขวนทีละชิ้นทั้งหมด'],['C/Dสลับ','สามรายการไม่ตรง','แยกแขวนชิ้น ภาชนะหมุน และม้วนต่อเนื่อง','ภาชนะ/แถบไม่ใช่แขวนทีละชิ้น']],
['ชื่อสิ่งที่เห็นA/Bถูกต้อง?',['ไม่ติดชุบ/เปลี่ยนสี','รอยขีด/ไม่ติดชุบ','เงาไม่พอ/รอยขีด','ยืนยันสาเหตุทั้งคู่แล้ว'],['ฟิล์มหายต่างจากสีฟิล์มเปลี่ยน','ไม่ตรงA/B','นั่นคือC/D','รูปลักษณ์ไม่พิสูจน์สาเหตุ']],
['C/Dภายใต้แสงเดียวกันต่างอย่างไร?',['ไม่ติดชุบ/ปกติ','เงาไม่พอ/รอยขีดยาว','สเกลลึก/เทอร์โมมิเตอร์','ออกซิเดชัน/ล้างไม่ดีเสมอ'],['Cไม่ใช่ฟิล์มหาย Dมีรอย','แยกความเงากับรอยเส้นยาว','ไม่ใช่เครื่องวัด','ยังไม่ทราบสาเหตุแน่นอน']],
['อธิบายEอย่างเหมาะสม?',['หลักฐานมอเตอร์หยุด','รับประกันผ่าน','แบบรอยยุบ/เงาไม่สม่ำเสมอจากขัดจุดเดิมนาน ต้องตรวจบันทึกหาสาเหตุ','สั่งเปลี่ยนทุกผลิตภัณฑ์เป็นค่าเดียว'],['ขัดค้างไม่ใช่มอเตอร์หยุด','แบบจำลองไม่รับประกัน','แยกการเห็นและตรวจสาเหตุ','ไม่ระบุค่าปฏิบัติงาน']],
['เปรียบเทียบB/C/Dข้อใดถูก?',['Cไม่มีรอยลึก','เห็นDส่งของทั้งหมดได้','BไปCไม่ต้องตรวจ','Cยังมีร่องลึก ขั้นละเอียดไม่เท่ากับเสร็จ'],['Cมีร่องลึกกลางภาพ','Dไม่ใช่เกณฑ์รับ','ชื่อขั้นไม่แทนการตรวจ','ตรวจรอยเดิมกับผิวที่กำหนด']],
['เบอร์กับผิวสำเร็จควรเข้าใจอย่างไร?',['เบอร์ตรงกับRaหนึ่งต่อหนึ่งเสมอ','อย่ารับประกันRaส่วนผสมหรือผ่านจากเบอร์/สี ใช้การประเมินกำหนด','เบอร์ละเอียดลบรอยลึกหมดเสมอ','สีเดียวสูตรเดียว'],['เบอร์ต่างจากความหยาบจริง','แยกเบอร์ ส่วนผสม การประเมิน','ละเอียดอย่างเดียวไม่รับประกัน','ชื่อ/สีไม่กำหนดสูตร']],
['Aและเป้าหมายการขัดข้อใดเหมาะสม?',['ภาพหยุดอนุญาตทำความสะอาดตอนหมุน','เป้าหมายมีแต่เงา','แบบเครื่องมือหยุด เงาและกำจัดครีบ/รอยเป็นเป้าหมาย ไม่ใช่ใบอนุญาตหรือค่าปฏิบัติ','จุดสัมผัสกำหนดแรง'],['ไม่อนุญาตสัมผัสขณะหมุน','ครีบ/รอยก็เป็นเป้าหมาย','แยกสถานะ เป้าหมาย อำนาจ','ไม่ให้แรง/ความเร็ว']]
])
tr('my',['အပေါက်မပါ60×40×2mmစာရွက်ပေါ်မော်ဒယ်။ မျက်နှာကြီးနှစ်ခု4800mm²၊ဘေးပါ5200mm²။ Crack၊Dbarrel၊Eဆက်တိုက်strip။ လက်တွေ့မျက်နှာ၊ဆက်မှတ်၊အခြေအနေသီးခြားစစ်ပါ။','ဖန်တီးထားသောပုံများ:Aမလိမ်းကပ်၊Bအရောင်ပြောင်း၊Cတောက်ပမှုနည်း၊Dခြစ်ရာ၊Eနေရာတစ်ခုကြာပွတ်ရာ၊Fနှိုင်းယှဉ်မျက်နှာ။ တကယ့်ဓာတ်ပုံမဟုတ်၊အကြောင်းရင်း/အောင်မှုကိုပုံတစ်ခုတည်းမသတ်မှတ်ပါ။','Aရပ်ထားကိရိယာ၊Bကြမ်း၊Cနုသော်လည်းနက်ခြစ်ရာကျန်၊Dညီမော်ဒယ်။ တောက်ပမှုနှင့်အနားစ/ခြစ်ရာဖယ်ခြင်းသည်ရည်ရွယ်ချက်။ gritမှRaသို့အောင်မှုအာမမခံ၊လည်ပတ်သတ်မှတ်ချက်မပေးပါ။'],[
['ဘေးလေးခုမပါမျက်နှာကြီးနှစ်ခုဧရိယာ?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800။','တစ်မျက်နှာသာ။','ဘေးပါသည်။','ဘေးသာ။']],
['အပေါက်မပါအတုံးမျက်နှာခြောက်ခုဧရိယာ?',['4800mm²','5200mm²','2400mm²','5000mm²'],['ဘေး400ကျန်။','4800+2×(60+40)×2=5200။','တစ်မျက်နှာသာ။','ဘေး400၊200မဟုတ်။']],
['C,D,Eမှန်ကန်စွာတွဲပါ။',['barrel,rack,ဆက်တိုက်','ဆက်တိုက်,rack,barrel','rack,barrel,ဆက်တိုက်strip','အားလုံးတစ်ခုချင်းချိတ်'],['C/Dပြောင်းပြန်။','သုံးခုမကိုက်။','ချိတ်ပစ္စည်း၊လှည့်ပုံး၊ဆက်တိုက်လိပ်ကွာသည်။','ပုံး/stripကတစ်ခုချင်းချိတ်မဟုတ်။']],
['A/Bမြင်ရပုံအမည်မှန်?',['မကပ်/အရောင်ပြောင်း','ခြစ်ရာ/မကပ်','တောက်နည်း/ခြစ်ရာ','နှစ်ခုလုံးအကြောင်းရင်းသေချာ'],['လွှာမရှိနှင့်အရောင်ပြောင်းကွာသည်။','A/Bမကိုက်။','၎င်းတို့C/D။','ပုံကအကြောင်းရင်းမသက်သေပြ။']],
['အလင်းတူC/Dကွာခြားချက်?',['မကပ်/ပုံမှန်','တောက်နည်း/မျဉ်းရှည်ခြစ်ရာ','အနက်စကေး/အပူတိုင်း','အမြဲအောက်ဆိုဒ်/ဆေးညံ့'],['Cလွှာပျောက်မဟုတ်၊Dခြစ်ရာရှိ။','တောက်ပမှုနှင့်ရှည်ရာခွဲကြည့်။','တိုင်းကိရိယာမဟုတ်။','အကြောင်းရင်းမသေချာ။']],
['Eကိုသင့်တော်စွာရှင်းပြသည်မှာ?',['မော်တာရပ်သက်သေ','အောင်အာမခံ','တစ်နေရာကြာပွတ်ခြင်း၏ချိုင့်/တောက်မညီမော်ဒယ်၊မှတ်တမ်းဖြင့်အကြောင်းရင်းစစ်ရန်','အားလုံးတူညီsettingပြောင်းညွှန်ကြားချက်'],['dwellချို့ယွင်းမှုမော်တာရပ်မဟုတ်။','မော်ဒယ်အာမခံမဟုတ်။','မြင်ရပုံ/အကြောင်းရင်းစစ်ခွဲသည်။','လုပ်ဆောင်မှုsettingမပေး။']],
['B/C/Dနှိုင်းမှန်သည်မှာ?',['Cနက်ရာမရှိ','Dရှိလျှင်အားလုံးပို့နိုင်','BမှCဆိုစစ်မလို','Cနက်ချိုင့်ကျန်၊နုအဆင့်ဆိုပြီးမပြီးဟုမယူ'],['Cအလယ်နက်ချိုင့်ရှိ။','Dလက်ခံစံမဟုတ်။','အဆင့်အမည်စစ်ဆေးမှုမဟုတ်။','ယခင်ရာနှင့်သတ်မှတ်finishစစ်။']],
['gritနှင့်finishကိုမည်သို့ဆုံးဖြတ်?',['gritနှင့်Raအမြဲတစ်ခုချင်း','grit/အရောင်ဖြင့်Ra၊ပါဝင်ပစ္စည်း၊အောင်မှုမအာမခံ၊သတ်မှတ်အကဲဖြတ်ပါ','နုgritနက်ရာအားလုံးဖယ်မည်','အရောင်တူဖော်မြူလာတူ'],['gritနှင့်အမှန်ကြမ်းမှုမတူ။','grit၊ပါဝင်ပစ္စည်း၊အကဲဖြတ်ခွဲ။','နုတင်နက်ရာပျောက်မအာမခံ။','အမည်/အရောင်ဖော်မြူလာမသတ်မှတ်။']],
['Aနှင့်ပွတ်ရည်ရွယ်ချက်သင့်တော်သည်မှာ?',['ရပ်ပုံကလှည့်နေချိန်သန့်ရှင်းခွင့်ပေး','တောက်ပမှုသာရည်ရွယ်','ရပ်မော်ဒယ်၊တောက်ပ/အနားစ/ခြစ်ရာဖယ်သည်ရည်ရွယ်ချက်၊လုပ်ခွင့်/settingမဟုတ်','ဆက်နေရာကဖိအားဆုံးဖြတ်'],['လှည့်နေချိန်ထိခွင့်မပေး။','အနားစ/ခြစ်ရာလည်းရည်ရွယ်။','အခြေအနေ၊ရည်ရွယ်၊အာဏာခွဲ။','ဖိအား/အမြန်မပေး။']]
])
tr('km',['ម៉ូដែលលើក្រដាស60×40×2mmគ្មានរន្ធ។ ផ្ទៃធំពីរ4800mm²រួមគែម5200mm²។ Cរ៉ាក់,Dធុងវិល,Eបន្ទះបន្ត។ ពិនិត្យផ្ទៃពិត ចំណុចប៉ះ និងលក្ខខណ្ឌដាច់ដោយឡែក។','រូបសំយោគ:Aមិនជាប់ស្រទាប់,Bប្រែពណ៌,Cខ្វះរលោង,Dស្នាមឆ្កូត,Eស្នាមប៉ូលាកន្លែងដដែលយូរ,Fផ្ទៃប្រៀប។ មិនមែនរូបថតពិត ទម្រង់មិនបញ្ជាក់មូលហេតុឬជាប់។','Aឧបករណ៍ឈប់ Bគ្រើម Cម៉ត់តែនៅស្នាមជ្រៅ Dម៉ូដែលស្មើ។ គោលបំណងរលោងនិងដកកម្ទេចគែម/ស្នាម។ លេខគ្រាប់មិនធានាRaឬជាប់ និងមិនកំណត់ការដំណើរការ។'],[
['ផ្ទៃធំពីរមិនរួមគែមបួនមានទំហំប៉ុន្មាន?',['4800mm²','2400mm²','5200mm²','400mm²'],['2×60×40=4800។','ផ្ទៃមួយប៉ុណ្ណោះ។','រួមគែម។','តែគែម។']],
['ផ្ទៃទាំងប្រាំមួយគ្មានរន្ធមានទំហំ?',['4800mm²','5200mm²','2400mm²','5000mm²'],['ខ្វះគែម400។','4800+2×(60+40)×2=5200។','ផ្ទៃមួយប៉ុណ្ណោះ។','គែម400មិនមែន200។']],
['C,D,Eត្រូវគ្នាយ៉ាងណា?',['ធុងវិល,រ៉ាក់,បន្ត','បន្ត,រ៉ាក់,ធុងវិល','រ៉ាក់,ធុងវិល,បន្ទះបន្ត','ទាំងអស់ព្យួរមួយៗ'],['C/Dបញ្ច្រាស។','ទាំងបីមិនត្រូវ។','បែងចែកព្យួរ ធុងវិល និងរមូរបន្ត។','ធុង/បន្ទះមិនមែនព្យួរមួយៗ។']],
['ឈ្មោះសង្កេតA/Bត្រឹមត្រូវ?',['មិនជាប់ស្រទាប់/ប្រែពណ៌','ឆ្កូត/មិនជាប់','ខ្វះរលោង/ឆ្កូត','មូលហេតុទាំងពីរបញ្ជាក់រួច'],['ខ្វះស្រទាប់ខុសពីពណ៌ស្រទាប់ប្រែ។','មិនត្រូវA/B។','នោះC/D។','រូបរាងមិនបញ្ជាក់មូលហេតុ។']],
['C/Dក្រោមពន្លឺដូចគ្នាខុសគ្នា?',['មិនជាប់/ធម្មតា','ខ្វះរលោង/ឆ្កូតជាបន្ទាត់វែង','ខ្នាតជម្រៅ/ទែម៉ូម៉ែត្រ','តែងអុកស៊ីត/លាងមិនល្អ'],['Cមិនខ្វះស្រទាប់ Dមានឆ្កូត។','បែងចែករលោងនិងស្នាមវែង។','មិនមែនឧបករណ៍វាស់។','មូលហេតុជាក់លាក់មិនទាន់ប្រាកដ។']],
['Eពន្យល់សមរម្យ?',['ភស្តុតាងម៉ូទ័រឈប់','ធានាជាប់','ម៉ូដែលក្រហូង/រលោងមិនស្មើពីប៉ូលាកន្លែងដដែលយូរ ត្រូវពិនិត្យកំណត់ត្រាហេតុ','បញ្ជាប្តូរគ្រប់ផលិតផលដូចគ្នា'],['ស្នាមនៅមួយកន្លែងមិនមែនម៉ូទ័រឈប់។','ម៉ូដែលមិនធានា។','បែងចែកសង្កេតនិងពិនិត្យហេតុ។','មិនកំណត់លក្ខខណ្ឌធ្វើការ។']],
['ប្រៀបB/C/Dមួយណាត្រឹមត្រូវ?',['Cគ្មានស្នាមជ្រៅ','មានDអាចដឹកគ្រប់ផលិតផល','BទៅCមិនត្រូវត្រួត','Cនៅជ្រលងជ្រៅ ដំណាក់កាលម៉ត់មិនមែនរួច'],['Cមានជ្រលងជ្រៅកណ្ដាល។','Dមិនមែនស្តង់ដារជាប់។','ឈ្មោះជំហានមិនជំនួសពិនិត្យ។','ពិនិត្យស្នាមមុននិងផ្ទៃកំណត់។']],
['លេខគ្រាប់និងផ្ទៃសម្រេចយល់ដូចម្តេច?',['លេខនិងRaតែងមួយទល់មួយ','មិនធានាRaសមាសធាតុឬជាប់ពីលេខ/ពណ៌ ប្រើការវាយតម្លៃកំណត់','គ្រាប់ម៉ត់ដកស្នាមទាំងអស់','ពណ៌ដូចរូបមន្តដូច'],['លេខគ្រាប់ខុសពីរដុបពិត។','បែងចែកលេខ សមាសធាតុ វាយតម្លៃ។','ម៉ត់មួយមិនធានាដកជ្រៅ។','ឈ្មោះ/ពណ៌មិនកំណត់រូបមន្ត។']],
['Aនិងគោលបំណងប៉ូលាត្រឹមត្រូវ?',['រូបឈប់អនុញ្ញាតសម្អាតពេលវិល','រលោងប៉ុណ្ណោះ','ម៉ូដែលឈប់ រលោង/ដកកម្ទេចគែម/ឆ្កូតជាគោលដៅ មិនមែនអាជ្ញាឬលក្ខខណ្ឌដំណើរ','ចំណុចប៉ះកំណត់កម្លាំង'],['មិនអនុញ្ញាតប៉ះពេលវិល។','កម្ទេចគែម/ឆ្កូតក៏ជាគោលដៅ។','បែងចែកស្ថានភាព គោលដៅ សិទ្ធិ។','មិនផ្តល់កម្លាំង/ល្បឿន។']]
])
assert all(set(p['locales'])==set(LOCS)for p in packs)
(D/'finishing.json').write_text(json.dumps({'schemaVersion':1,'packs':packs},ensure_ascii=False,indent=2)+'\n')
assert 2*60*40==4800 and 2*(60+40)*2==400 and 4800+400==5200
proof={'sourcePdfSha256':'08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae','sourcePhysicalPagesTextAndRenderedRead':[159,160,164,165,170,204,186,191,197],'authorship':'Independent controlled SVG geometry and synthetic observation illustrations; no source photo or source geometry copied','areaModel':{'lengthMm':60,'widthMm':40,'thicknessMm':2,'broadFacesMm2':4800,'fourEdgesMm2':400,'allSixFacesMm2':5200,'holes':0,'excludedContactArea':0},'coverage':{'area':'Face/edge arithmetic and rack/barrel/continuous-strip recognition','defects':'Missing plating,discoloration,low gloss,scratches,localized dwell;comparison is synthetic and no cause diagnosed','buff':'Stopped-tool state,coarse/finer-with-retained-deep-scratch/uniform profiles;gloss/burr/scratch purposes;no grit-Ra guarantee'},'packs':3,'questions':9,'locales':12,'questionLocalePairs':108,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'physicalDeviceVerified':False,'actualPhotoRecognitionCertified':False,'releaseReady':False}
(P/'source-math-evidence.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print('finishing38:3packs9questions108localePairs;areaMathPASS')
