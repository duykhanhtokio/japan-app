"""Original bounded supplements; do not mutate frozen lessons or learner revisions."""
from pathlib import Path
import json,hashlib,re
from janome.tokenizer import Tokenizer
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/food-manufacturing'
lessons={}
for p in [DATA/'lessons.2.ja.json']+sorted((DATA/'authoring-20261029').glob('part*.json')):
 for l in json.loads(p.read_text()).get('lessons',[]):lessons[l['id']]=l
rows=[
 ('consumer','food-2-012',[49,50], '使う人と開封後の扱いを危害分析へ戻す', '同じ食品でも、乳幼児、病気の人、高齢者が食べる場合は、対象者に応じた危害の検討が必要です。開封後に何回か使う商品は、一度で食べ切る商品と使い方が違います。製品説明書には、対象者、加熱の有無、開封後の使い方を具体的に記します。例えば、大袋を数日に分けて使う案では、取出し時の器具、人の接触、保存条件を調べます。未開封の条件だけで安全とせず、確認結果をHACCPチームへ渡して危害分析と表示・保存条件を見直します。練習：一食分の商品から大袋へ変更するとき、追加で確認する情報を三つ説明してください。'),
 ('likelihood','food-2-047',[134,135], '防護の状態から可能性を区別する', '教材の例では、対策がなく表示にも不備が多い状態、カバー等に大きな不備がある状態、柵はあるが低い・隙間が大きく手が届く状態、危険部へ入りにくい防護状態を区別します。標識があるだけで、手が届く危険はなくなりません。重大性は別に判定し、会社が採用する表で二つの軸を照合します。前の段落の掛算は独自の練習規則で、元の教材の表をそのまま再現したものではありません。練習：低い柵と警告表示だけの設備で「表示があるから可能性はほとんどない」という説明が不十分な理由を答えてください。'),
 ('flow','food-2-041',[50,51,52,53,54,55], '工程図を区域・再使用・管理点と照合する', '工程図を現場で確かめるときは、原料と包材だけでなく、使い回す器具、戻す容器、余った材料、蒸気、油、排水の出入りも追います。清潔な区域へ別工程の作業者や飛沫が入る経路も確認します。加熱などの工程条件と測定方法を記し、危害分析から重要管理点を決めます。図の全工程を重要管理点にするわけではありません。練習：加熱後に未加熱の具を加える案で、具、器具、人、保管の各経路を図へ追加し、どの情報をHACCPチームへ確認するか説明してください。別商品の温度や時間は転用しません。'),
 ('cleaning','food-2-040',[73,74,75], '洗う順序と担当範囲を具体化する', '清掃前に、設備と作業者の担当範囲、停止・隔離の条件、回収物の扱いを決めます。工程の上流から下流へ順に進める考え方を使い、清掃済みの場所へ汚れを戻さない動線を確認します。残渣を回収し、設備に合う分解又はCIP、洗浄、すすぎ、所定の乾燥と組立てを承認手順で行います。周囲の床・器具への飛散と、破損による製品への影響も点検します。残渣を再利用できるかは独断で決めません。担当者は実施時刻、結果、異常を記録し、確認者へ引き継ぎます。練習：上流の洗浄水が清掃済みの包装区域へ流れる計画を、動線と分担の両方から修正してください。'),
]
# Each locale uses its own wording; Japanese remains canonical.
translations={
 'vi':[
 ['Đưa người sử dụng và cách dùng sau mở vào phân tích mối nguy','Cần xét mối nguy phù hợp khi trẻ nhỏ, người bệnh hoặc người cao tuổi dùng sản phẩm. Gói lớn dùng nhiều lần khác với suất dùng một lần. Ghi rõ người dùng, có gia nhiệt hay không và cách sử dụng sau mở. Nếu dùng trong nhiều ngày, kiểm tra dụng cụ lấy thực phẩm, tiếp xúc của người và điều kiện bảo quản. Chuyển kết quả cho nhóm HACCP để xem lại phân tích, nhãn và điều kiện bảo quản. Bài tập: nêu ba thông tin cần kiểm tra thêm khi đổi từ suất ăn sang gói lớn.'],
 ['Phân biệt khả năng xảy ra theo tình trạng bảo vệ','Ví dụ trong tài liệu phân biệt: chưa có biện pháp và biển báo nhiều thiếu sót; nắp chắn thiếu sót lớn; có hàng rào nhưng thấp hoặc hở nên vẫn với tới; và trạng thái khó tiếp cận vùng nguy hiểm. Biển báo không loại bỏ nguy cơ chạm vào máy. Đánh giá mức nghiêm trọng riêng rồi tra hai trục theo bảng của công ty. Phép nhân ở đoạn trước là quy tắc bài tập tự soạn, không phải bản sao bảng nguồn. Bài tập: vì sao hàng rào thấp và biển cảnh báo chưa đủ để kết luận khả năng gần như không có?'],
 ['Đối chiếu sơ đồ với phân khu, tái sử dụng và điểm kiểm soát','Tại hiện trường, theo dõi nguyên liệu, bao bì, dụng cụ dùng lại, vật chứa quay về, nguyên liệu dư, hơi, dầu và nước thải. Kiểm tra cả người hoặc giọt bắn đi từ công đoạn khác vào khu sạch. Ghi điều kiện công đoạn và cách đo; xác định CCP từ phân tích mối nguy, không coi mọi công đoạn là CCP. Bài tập: thêm các đường đi của nhân, dụng cụ, người và bảo quản khi cho nhân chưa gia nhiệt vào sản phẩm sau gia nhiệt; nêu thông tin cần hỏi nhóm HACCP. Không áp nhiệt độ và thời gian của sản phẩm khác.'],
 ['Làm rõ thứ tự vệ sinh và trách nhiệm','Trước khi vệ sinh, xác định phạm vi từng người, điều kiện dừng/cách ly và xử lý phần thu hồi. Xem xét làm từ đầu đến cuối dây chuyền, tránh đưa bẩn trở lại vùng đã sạch. Theo quy trình được duyệt, thu gom cặn, tháo máy hoặc dùng CIP phù hợp, rửa, tráng, làm khô theo yêu cầu và lắp lại. Kiểm tra bắn bẩn ra xung quanh và hư hỏng có thể ảnh hưởng sản phẩm. Không tự quyết định tái sử dụng cặn. Ghi thời điểm, kết quả, bất thường và bàn giao người kiểm tra. Bài tập: sửa kế hoạch để nước rửa phía đầu dây chuyền không chảy vào khu đóng gói đã sạch, xét cả đường đi và phân công.']],
 'en':[
 ['Bring consumers and opened-pack use into hazard analysis','Consider hazards for infants, ill people and older consumers. A large pack used repeatedly differs from a single serving. Record the consumers, any cooking and use after opening. For use over several days, examine utensils, human contact and storage. Give the HACCP team these findings to review hazards, labelling and storage conditions. Exercise: name three additional checks when changing a single serving to a large pack.'],
 ['Distinguish likelihood from the condition of safeguards','The textbook distinguishes absent controls with poor signs, seriously deficient guards, low or widely spaced fencing that permits access, and safeguards that make access difficult. A sign alone does not remove contact risk. Assess severity separately and use the company’s two-axis table. The earlier multiplication rule is an original exercise, not the source table. Exercise: why do a low fence and a warning sign fail to establish almost no likelihood?'],
 ['Check the flow diagram against zoning, reuse and control points','On site, trace ingredients, packaging, reused utensils, returned containers, leftovers, steam, oil and drainage. Check people and splashes entering clean zones from other processes. Record process conditions and measurements; derive CCPs from hazard analysis rather than making every step a CCP. Exercise: map fillings, utensils, people and storage when adding an unheated filling after cooking, and identify questions for the HACCP team. Do not transfer another product’s temperatures or times.'],
 ['Specify cleaning order and responsibilities','Before cleaning, assign areas, stopping/isolation conditions and recovered-material handling. Consider upstream-to-downstream work and routes that avoid recontaminating clean areas. Follow approved residue collection, suitable disassembly or CIP, washing, rinsing, required drying and reassembly. Check splashes and damage affecting products. Do not authorise residue reuse yourself. Record time, results and abnormalities and hand over to the checker. Exercise: revise routes and assignments where upstream wash water enters a cleaned packing area.']],
 'id':[
 ['Masukkan pengguna dan pemakaian setelah dibuka ke analisis bahaya','Pertimbangkan bahaya bagi bayi, orang sakit, dan lansia. Kemasan besar yang dipakai berulang berbeda dari satu porsi. Catat pengguna, pemanasan, serta pemakaian setelah dibuka. Jika dipakai beberapa hari, periksa alat pengambil, kontak manusia, dan penyimpanan. Sampaikan hasil kepada tim HACCP untuk meninjau bahaya, label, dan penyimpanan. Latihan: sebutkan tiga pemeriksaan tambahan saat satu porsi diubah menjadi kemasan besar.'],
 ['Bedakan kemungkinan menurut kondisi pelindung','Contoh buku membedakan tanpa pengendalian dan rambu buruk, pelindung sangat kurang, pagar rendah atau renggang yang masih terjangkau, serta pelindung yang menyulitkan akses. Rambu saja tidak menghilangkan risiko kontak. Nilai keparahan terpisah lalu gunakan tabel dua sumbu perusahaan. Perkalian sebelumnya adalah aturan latihan mandiri, bukan tabel sumber. Latihan: mengapa pagar rendah dan rambu belum membuktikan kemungkinan hampir tidak ada?'],
 ['Cocokkan diagram alir dengan zona, penggunaan ulang, dan titik kendali','Di lokasi, telusuri bahan, kemasan, alat pakai ulang, wadah kembali, sisa bahan, uap, minyak, dan limbah cair. Periksa orang dan percikan yang memasuki zona bersih. Catat kondisi proses serta pengukuran; tentukan CCP dari analisis bahaya, bukan semua tahap. Latihan: petakan isian tanpa pemanasan yang ditambahkan setelah memasak beserta alat, orang, dan penyimpanannya; susun pertanyaan bagi tim HACCP. Jangan menyalin suhu atau waktu produk lain.'],
 ['Perjelas urutan pembersihan dan tanggung jawab','Tetapkan area petugas, penghentian/isolasi, dan penanganan bahan terkumpul. Pertimbangkan urutan hulu ke hilir tanpa mengotori kembali area bersih. Ikuti prosedur sah untuk pengumpulan sisa, pembongkaran atau CIP, pencucian, pembilasan, pengeringan yang diwajibkan, dan perakitan. Periksa percikan serta kerusakan yang memengaruhi produk. Jangan memutuskan penggunaan ulang sisa sendiri. Catat waktu, hasil, dan kelainan lalu serahkan kepada pemeriksa. Latihan: perbaiki alur dan pembagian tugas agar air hulu tidak masuk area kemasan yang sudah bersih.']],
 'zh-CN':[
 ['把食用人群和开封后的用法纳入危害分析','婴幼儿、病人和老年人食用时，应考虑相应危害。多次使用的大包装不同于单份产品。记录食用人群、是否加热以及开封后的用法。若分几天使用，应检查取用器具、人员接触和保存条件，将结果交给HACCP小组，重新审查危害、标签和保存条件。练习：从单份改为大包装时，列出三项追加确认事项。'],
 ['根据防护状态区分发生可能性','教材例子区分无措施且标识缺陷较多、防护罩严重不足、有围栏但过低或间隙过大仍可触及，以及难以进入危险部位的防护状态。有标识不等于消除了接触风险。严重程度单独判断，再按公司的双轴表查定。前文乘法是独立编写的练习规则，并非原教材表格。练习：为什么低围栏加警示标识不足以说明几乎不会发生？'],
 ['核对流程图中的分区、重复使用和控制点','现场追踪原料、包装、重复使用器具、回流容器、剩余原料、蒸汽、油和排水，也检查其他工序人员或飞溅物进入清洁区的路径。记录工序条件和测量方法，通过危害分析确定CCP，不把所有工序都称为CCP。练习：加热后加入未加热馅料时，补画馅料、器具、人员和保存路径，说明应向HACCP小组确认什么。不得套用其他产品的温度和时间。'],
 ['明确清洁顺序和责任范围','清洁前确定各人的区域、停机隔离条件和回收物处理方式。考虑从上游向下游作业，防止污染已清洁区域。按批准程序收集残渣，适当拆卸或采用CIP，清洗、冲洗、按要求干燥并组装。检查向周边飞溅和可能影响产品的破损。不擅自决定残渣再利用。记录时间、结果和异常，交给检查人员。练习：修改上游洗水流入已清洁包装区的路线及分工。']],
 'zh-TW':[
 ['將食用對象和開封後用法納入危害分析','嬰幼兒、病人和高齡者食用時，應考慮相應危害。分次使用的大包裝不同於單份產品。記錄食用對象、是否加熱及開封後用法。若分數日使用，檢查取用器具、人員接觸和保存條件，交由HACCP小組重新檢視危害、標示及保存條件。練習：由單份改為大包裝時，列出三項追加確認事項。'],
 ['依防護狀態區分發生可能性','教材例子區分無措施且標示缺失多、防護罩嚴重不足、有圍欄但過低或間隙過大仍可觸及，以及難以進入危險部位的防護狀態。警示標示不會自行消除接觸風險。另行判斷嚴重程度，再查公司採用的雙軸表。前文乘法為獨立編寫的練習規則，並非原教材表格。練習：為何低圍欄與警示標示不足以判定幾乎不會發生？'],
 ['核對流程圖的分區、重複使用及管制點','現場追蹤原料、包材、重複使用器具、回流容器、剩料、蒸汽、油和排水，並檢查其他工序人員或飛濺物進入清潔區的路徑。記錄工序條件與量測方式，經危害分析決定CCP，不將全部工序列為CCP。練習：加熱後加入未加熱餡料時，補畫餡料、器具、人員和保存路徑，說明應向HACCP小組確認什麼。不得套用其他產品的溫度與時間。'],
 ['明確訂出清潔順序與責任範圍','清潔前確定各人的區域、停機隔離條件與回收物處理方式。考慮由上游向下游作業，避免再次污染已清潔區域。依核准程序收集殘渣、適當拆卸或採用CIP、清洗、沖洗、依要求乾燥及組裝。檢查周邊飛濺和可能影響產品的破損。不擅自決定殘渣再利用。記錄時間、結果、異常並交給檢查人員。練習：修改上游洗水流入已清潔包裝區的路線與分工。']],
}

if __name__=='__main__':
    translations.update(json.loads((Path(__file__).with_name('closure31-locales.json')).read_text()))
    tokenizer=Tokenizer();sections=[]
    for i,(sid,lid,pages,title,text) in enumerate(rows):
        segs=[]
        for token in tokenizer.tokenize(text):
            surface=token.surface;reading=token.reading
            item={'text':surface}
            if surface=='渣':item['reading']='さ'
            elif re.search('[一-龯]',surface) and reading!='*':item['reading']=''.join(chr(ord(c)-96) if 'ァ'<=c<='ヶ' else c for c in reading)
            segs.append(item)
        item={'id':'food31-'+sid,'lessonId':lid,'lessonSourceHash':lessons[lid]['sourceHash'],'titleJa':title,'textJa':text,'ruby':segs,'sourceRefs':[{'document':'ssw2','pdfPage':p,'printedPage':p-9} for p in pages],'translations':{loc:{'title':v[i][0],'text':v[i][1]}for loc,v in translations.items()},'status':'authored_ai_unreviewed','nativeReviewed':False,'domainReviewed':False,'pronunciationReviewed':False}
        item['titleRuby']=[{'text':t.surface,**({'reading':''.join(chr(ord(c)-96) if 'ァ'<=c<='ヶ' else c for c in t.reading)} if re.search('[一-龯]',t.surface) and t.reading!='*' else {})} for t in tokenizer.tokenize(title)]
        item['sourceHash']=hashlib.sha256(json.dumps({'titleJa':title,'textJa':text},ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
        for t in item['translations'].values():t['sourceHash']=item['sourceHash']
        sections.append(item)
    (DATA/'source-closure31.json').write_text(json.dumps({'schemaVersion':1,'sections':sections,'pendingLocales':[]},ensure_ascii=False,indent=2)+'\n')
