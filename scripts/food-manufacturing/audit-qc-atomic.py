#!/usr/bin/env python3
"""Revalidate scoped, manually source-read QC atoms; never infer whole-source coverage."""
import hashlib,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/ssw-workspace/food-manufacturing/atomic-qc-20261102'
D=ROOT/'src/data/food-manufacturing'
def read(p):return json.loads(p.read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def digest(v):return sha(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def ref(file,kind,id,field=None):
 x=read(D/file)
 if kind=='question':
  vals=[q for e in x['exams'] for q in e['questions']]
 else: vals=x if isinstance(x,list) else x[kind]
 obj=next(z for z in vals if z['id']==id)
 if field:
  for part in field.split('.'):
   obj=obj[int(part)] if isinstance(obj,list) else obj[part]
 return {'file':str((D/file).relative_to(ROOT)),'kind':kind,'id':id,'field':field,'valueSha256':digest(obj)}
def lesson(id,p):return ref('lessons.2.ja.json' if id=='food-2-021' else 'runtime-supplemental/lessons.json','lessons',id,f'paragraphs.{p-1}.textJa')
def sec(id):return ref('source-closure34.json','sections',id,'textJa')
def question(id):return ref('exams.ja.json','question',id)
def check(id):return ref('source-assessment35.json','checks','food-assessment35-'+id)
rows=[]
def add(page,loc,knowledge,teach,assess=(),fig=(),status='mapped_ai_checked',note=''):
 rows.append({'id':f'food-qc-ssw2-{page}-{sum(r["pdfPage"]==page for r in rows)+1:02}', 'pdfPage':page,'printedPage':page-9,'sourceLocation':loc,'knowledgeVi':knowledge,'teaching':teach,'assessment':list(assess),'figureIds':list(fig),'status':status,'note':note,'humanReviewed':False,'domainReviewed':False})
L=lesson('food-2-021',1); L2=lesson('food-2-021',2); S=sec('food34-chart-axes'); H=lesson('food-2-043',1); R=lesson('food-2-043',2); C=check('distribution-recognition')
# Group A: each graph paragraph and its educational diagram, not a page/TOC shortcut.
add(83,'導入・グラフ総論','Dùng biểu đồ để chia sẻ tình hình với người liên quan, ngoài phân tích của bản thân.',[L],status='partial',note='Bài dạy mục đích các dạng đồ thị; chưa nói rõ chức năng giải thích/chia sẻ cho người khác.')
add(83,'ア棒・本文','Trục phân loại và trục giá trị; chiều dài cột biểu thị độ lớn.',[L],status='partial',note='Đã có chọn cột cho so sánh lớn nhỏ; chưa tìm được giải thích tường minh đủ hai trục và chiều dài trong các bài/QC bổ sung đã kiểm.')
add(83,'ア棒・本文後半','Thứ tự nhóm của biểu đồ cột thường không bị bắt buộc giảm dần như Pareto.',[],status='missing',note='Không được suy từ câu Pareto giảm dần rằng mọi biểu đồ cột đều giảm dần.')
add(83,'ア棒・図全体（軸・項目名・柱）','Đọc số lỗi theo nhóm bằng cột và so sánh nhóm lớn nhỏ.',[L],status='partial',note='Chưa xác định một bài đọc hình cột riêng có kiểm trục/nhãn; không coi hình Pareto là nghiệm thu thay.')
add(84,'イ折れ線・本文','Trục ngang liên tục/thời gian, trục dọc giá trị; nối điểm để xem biến đổi.',[S],fig=['food-source35-time-pie-angle'])
add(84,'イ折れ線・図（横月・縦個・推移）','Đọc đồ thị chuỗi thời gian qua thứ tự và đơn vị ở hai trục.',[S],fig=['food-source35-time-pie-angle'],status='teaching_only',note='Có đồ thị độc lập; chưa xác định bài tự kiểm riêng yêu cầu đọc từng điểm thời gian.')
add(84,'ウ円・本文','Hình quạt biểu diễn tỷ trọng; chuyển tỷ trọng thành góc trên tổng 360 độ.',[S],[question('food-2-q335')],['food-source35-time-pie-angle'])
add(84,'ウ円・式','Tính góc bằng 360 nhân tỷ lệ; phân biệt phần trăm với số độ.',[S],[question('food-2-q335')],['food-source35-time-pie-angle'])
add(84,'ウ円・図（凡例・割合・扇形）','Đọc phần của tổng, nhãn tỷ trọng và góc; dùng ví dụ độc lập thay số liệu nguồn.',[S],[question('food-2-q335')],['food-source35-time-pie-angle'],note='Không chép số lỗi minh họa của PDF; bảo toàn năng lực tỷ trọng/góc bằng ví dụ riêng.')
add(85,'エ帯・本文','So sánh cơ cấu giữa nhóm hoặc theo thời gian bằng các dải cùng tổng.',[L,R],[check('stacked-share'),question('food-2-q295')],['food-source32-stacked'])
add(85,'エ帯・図（分類・凡例・各工場）','Đọc phần tỷ lệ theo nhóm; phân biệt tỷ lệ với số lượng khi tổng khác/không biết.',[R],[check('stacked-share')],['food-source32-stacked'])
add(85,'オレーダー・本文','Mỗi trục là một đặc tính; đặt điểm và nối để so sánh nhiều đặc tính.',[L,R],[check('radar-scale'),question('food-2-q296')],['food-source32-radar'])
add(85,'オレーダー・図（軸・尺度・二系列）','Dùng cùng thang và so từng trục để nhận ra điểm mạnh yếu; không xếp hạng chỉ bằng diện tích.',[R],[check('radar-scale')],['food-source32-radar'])
# Group B: Pareto, scatter and histogram construction.
add(86,'②パレート・本文前半','Kết hợp cột giảm dần và đường tỷ lệ tích lũy, với đơn vị hai trục khác nhau.',[L,S],[question('food-2-q063')],['food-source35-pareto-cumulative'])
add(86,'②パレート・本文後半','Dùng mức ảnh hưởng/tần suất để cân nhắc ưu tiên cải tiến.',[L,S],[question('food-2-q063'),question('food-2-q374')],['food-source35-pareto-cumulative'])
add(86,'②パレート・図（件数・累積比・項目）','Đọc cột, thứ tự nhóm và cộng tỷ trọng theo mẫu số chung.',[S],[question('food-2-q063')],['food-source35-pareto-cumulative'],note='Phần dạy có hoạt động tự tính 50/80/100%; câu q063 chỉ kiểm chọn công cụ, không tuyên bố đã kiểm riêng mọi phép cộng.')
add(86,'③散布・本文前半','Ghép hai giá trị cùng đối tượng/điều kiện, vẽ điểm theo hai trục để điều tra mối liên hệ.',[L2,R],[question('food-2-q064'),question('food-2-q375')],['food-source-scatter-patterns'])
add(86,'③散布・本文後半→87四図','Xu hướng có thể tuyến tính hoặc phi tuyến; cần điều tra thêm thay vì kết luận nhân quả.',[L2,R],[C,question('food-2-q258')],['food-source-scatter-patterns'],note='Văn bản nguồn nói tuyến tính nhưng hình87 có phi tuyến; giữ cả bốn quan hệ từ hình, không dạy sai rằng mọi tương quan đều thẳng.')
for loc,meaning in [('正','Xu hướng tăng cùng chiều.'),('負','Xu hướng ngược chiều.'),('なし','Không thấy quy luật rõ trong các điểm.'),('非線形','Có quan hệ cong, không được xóa thành không tương quan.')]:
 add(87,'散布図・'+loc,meaning,[R],[C],['food-source-scatter-patterns'])
add(87,'④ヒストグラム・冒頭','Lấy mẫu để khảo sát phân bố; trục ngang là khoảng giá trị, trục dọc là tần số.',[L2],[C,question('food-2-q065')],['food-source-histogram-patterns'])
add(87,'④ヒストグラム・√n式','Căn bậc hai số dữ liệu là gợi ý số lớp, không phải quy tắc cứng.',[H],[C],['food-source36-histogram-bin-comparison'])
add(87,'④ヒストグラム・階級過多','Lớp quá hẹp/nhiều làm khó nhận ra đỉnh.',[sec('food34-tail-histogram-bins')],[C,question('food-2-q297')],['food-source36-histogram-bin-comparison'])
add(87,'④ヒストグラム・階級過少','Lớp quá rộng/ít che mất khác biệt; chọn theo dữ liệu và độ đo.',[sec('food34-tail-histogram-bins')],[C,question('food-2-q376')],['food-source36-histogram-bin-comparison'])
add(87,'④ヒストグラム・末段','Phân bố giúp nhận ra tâm và độ phân tán; hình không tự chứng minh nguyên nhân.',[L2,H],[C],['food-source-histogram-patterns'])
# Group C: all six named types, including second clauses often lost in summaries.
add(88,'ア一般型','Dạng thông thường giúp chia sẻ tâm/độ phân tán; không tự chứng minh ổn định.',[H],[C],['food-source-histogram-patterns'])
add(88,'イふた山型・平均差','Các nhóm có trung bình khác nhau có thể tạo hai đỉnh; phân tầng để kiểm.',[H],[C,question('food-2-q257')],['food-source-histogram-patterns'])
add(88,'イふた山型・台型補足','Khi nhiều nhóm trộn, hình có thể phẳng như bàn thay vì hai đỉnh.',[],status='missing',note='Các bài/check hiện nói hai đỉnh và trộn nhóm; chưa thấy ý nhiều nhóm có thể tạo dạng bàn. Không đóng tiểu ý này bằng từ 混在 chung.')
add(88,'ウ歯抜け型','Kiểm lớp quá hẹp, cách xử lý không nhất quán, số lớp và ranh giới trước khi kết luận lỗi quá trình.',[H,sec('food34-tail-histogram-bins')],[C],['food-source-histogram-patterns','food-source36-histogram-bin-comparison'])
add(88,'エすそ引き型','Tìm khả năng quản lý lệch một phía, ví dụ kiểm chặt thiếu lượng nhưng bỏ phía thừa.',[H],[C],['food-source-histogram-patterns'],note='Bài hiện có ý quản lý một phía; ví dụ sản phẩm thiếu/thừa là minh họa nguồn, không bắt buộc chép nguyên.')
add(88,'オ絶壁型','Dữ liệu sau chọn loại có thể bị cắt ở giới hạn; kiểm lịch sử chọn/exclusion trước suy toàn lô.',[H],[C,question('food-2-q336')],['food-source-histogram-patterns'])
add(88,'カ離れ小島型・混在','Nhóm rất khác trộn vào tạo cụm tách rời; phân nhóm để kiểm.',[H],[C],['food-source-histogram-patterns'])
add(88,'カ離れ小島型・測定誤り補足','Sai phương pháp đo cũng là hướng cần điều tra khi xuất hiện cụm tách rời.',[L2],status='partial',note='Có chỉ dẫn chung kiểm phương pháp đo nhưng chưa gắn tường minh với dạng đảo tách rời; không coi gợi ý tổng quát là đóng chi tiết.')
# Resolve assets from the actual registry and record bytes, never treat LFS pointers as images.
assets={}
for f in [*D.glob('source-practice*.ts'),ROOT/'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx']:
 for line in f.read_text().splitlines():
  a=re.search(r"(?:[\"']id[\"']|id):\s*[\"']([^\"']+)[\"']",line);b=re.search(r"require\([\"']([^\"']+)[\"']\)",line)
  if a and b:
   p=(f.parent/b.group(1)).resolve();data=p.read_bytes()
   assets[a.group(1)]={'registry':str(f.relative_to(ROOT)),'path':str(p.relative_to(ROOT)),'bytes':len(data),'sha256':sha(data),'imageBytesPresent':not data.startswith(b'version https://git-lfs.github.com/spec/v1')}
for row in rows:
 for id in row['figureIds']:assert id in assets,id
payload={'schemaVersion':1,'date':'2026-11-02','sourceSnapshot':'ee7ac2b1','document':'ssw2','sourcePdfSha256':'a2949e7f8e5282ee163e5015baacc39b0a4aeddf8ffb9b05cb93fb93ea116e57','libraryFileId':'libfile_bce12549790481919b62905cfc505224','pagesTextAndVisuallyRead':[83,84,85,86,87,88],'method':'Manual decomposition of paragraph, formula, diagram, axes, legend and subordinate-clause knowledge; current runtime evidence bound by field/object hashes. Generated rows are not automatic semantic approval.','groups':[{'id':'A','pages':[83,84,85]},{'id':'B','pages':[86,87]},{'id':'C','pages':[88]}],'records':rows,'assets':{id:assets[id] for id in sorted({id for r in rows for id in r['figureIds']})},'full251PageAtomicDecompositionComplete':False,'fullSourceCoverageCertified':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'measuredLearnerTime':False}
OUT.mkdir(parents=True,exist_ok=True)
p=OUT/'matrix.json'
if '--check' in sys.argv:
 assert read(p)==payload,'Current matrix differs: rerun deliberate audit after reviewing changed evidence'
else:p.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
from collections import Counter
summary={'records':len(rows),'pages':6,'statusCounts':dict(Counter(r['status'] for r in rows)),'assets':len(payload['assets']),'assetsWithBytes':sum(a['imageBytesPresent'] for a in payload['assets'].values()),'hashBoundEvidence':sum(len(r['teaching'])+len(r['assessment']) for r in rows),'full251PageAtomicDecompositionComplete':False}
print(json.dumps(summary,ensure_ascii=False))
