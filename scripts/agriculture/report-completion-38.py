"""Report measured scope; never infer unique knowledge coverage from page counts."""
import hashlib,json
from collections import Counter
from pathlib import Path
R=Path(__file__).resolve().parents[2];W=R/'docs/ssw-workspace/agriculture';P=W/'content-38'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
b=read(W/'source-gap-backlog.json');closed={i for n in [11,12,22,27,30,34,36,37,38] for row in read(W/f'source-gap-reconciliation-{n}.json')['resolutions'] if row['disposition']=='covered_by_new_prose' for i in row['sourceItemIds']}
missing=[i for i in b['items'] if i['status']=='missing' and i['id'] not in closed];held=[i for i in b['items'] if i['status']=='hold'];assert len(missing)==1104 and len(held)==301 and len(closed)==455
lessons=read(R/'src/data/agriculture/lessons.ja.json')['lessons'];ledger=read(W/'knowledge-ledger.json');index=read(R/'src/data/agriculture/translations.json');translations=sum(len(read(R/'src/data/agriculture'/f)) for f in index['shards'].values());assert len(lessons)==195 and translations==2340
weekly=read(R/'src/data/agriculture/weekly-checks.ja.json')['exams'];mocks=read(R/'src/data/agriculture/mock-exams.ja.json')['exams'];wq={q['id'] for e in weekly for q in e['questions']};mq={q['id'] for e in mocks for q in e['questions']};assert len(wq)==421 and len(mq)==160 and len(mocks)==4
bydomain=lambda rows:dict(sorted(Counter(i['id'].split('-')[2] for i in rows).items()))
summary={'schemaVersion':1,'date':'2026-10-28','overallStatus':'in_progress_not_whole_scope_complete','japaneseLessons':len(lessons),'knowledgeUnits':len(ledger['knowledge']),'translationPairs':translations,'draftLocales':12,'missingTranslationsForAuthoredLessons':0,'registeredRasters':62,'weeklyQuestions':len(wq),'mockForms':len(mocks),'mockQuestions':len(mq),'mockFormTarget':20,'mockQuestionTarget':800,'remainingMockForms':16,'remainingMockQuestions':640,'sourcePagesInventoried':237,'sourcePagesSemanticallyComplete':False,'cumulativeNewlyExpressedSourceOccurrences':len(closed),'candidateMissingOrPartialSourceOccurrences':len(missing),'baselineHeldSourceOccurrences':len(held),'missingByDomain':bydomain(missing),'heldByDomain':bydomain(held),'missingByKind':dict(sorted(Counter(i['kind'] for i in missing).items())),'remainingSourceIds':[i['id'] for i in missing],'baselineHeldSourceIds':[i['id'] for i in held],'sourceOccurrenceCountIsNotUniqueKnowledge':True,'uniqueKnowledgeDenominator':None,'knowledgeCoveragePercent':None,'mock35RetainedOutsideRuntime':20,'mock35Excluded':17,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'nativeDeviceTested':False,'productionExpoBuildTested':False,'dailyStudyDurationMeasured':False,'finalCurriculumWeeksCertified':False,'releaseReady':False,'newBatch':{'lessons':6,'units':36,'translationPairs':72,'sourceOccurrences':73,'newQuestions':0,'newImages':0},'reviewLimit':'Counters derive from the frozen backlog and explicit overlays. Remaining candidates need semantic reconciliation; they are not a certified count of genuinely absent independent concepts.','nextReadyWork':[{'sourceItemId':'AGR-A10-SOIL-0005','scope':'1号 overhead-irrigation midsummer daytime caution; source-next36 draft not yet integrated'},{'sourceItemIds':['AGR-A10-SOIL-0011','AGR-A10-SOIL-0013','AGR-A10-SOIL-0015','AGR-A10-SOIL-0021','AGR-A10-SOIL-0023'],'scope':'original irrigation method and tube recognition assets'},{'sourceItemIds':['AGR-A10-FACILITY-0239','AGR-A10-FACILITY-0240','AGR-A10-FACILITY-0241','AGR-A10-FACILITY-0242'],'scope':'original flower recognition assets; prose is not image completion'},{'sourceItemId':'AGR-A10-RICE-0215','scope':'comparative disease recognition remains unclosed'},{'sourceItemId':'AGR-A10-SAFETY-0292','scope':'backlog wording differs from actual source, correction held without false closure'}],'inputSha256':{str(p.relative_to(R)):sha(p) for p in [W/'source-gap-backlog.json',W/'source-gap-reconciliation-38.json',W/'progress.json',R/'src/data/agriculture/lessons.ja.json',W/'content-38/japanese-reviewed.json']}}
write(P/'completion-summary.json',summary)
names={'GENERAL':'Kiến thức nền','SOIL':'Đất, nước và phân bón','SAFETY':'An toàn và bảo vệ thực vật','RICE':'Lúa, cây đồng ruộng và rau','FACILITY':'Nhà kính, cây ăn quả và nhận diện liên quan','FLOWER':'Hoa và thuật ngữ liên quan'}
rows='\n'.join(f"| {names.get(k,k)} | {summary['missingByDomain'].get(k,0)} | {summary['heldByDomain'].get(k,0)} |" for k in sorted(set(summary['missingByDomain'])|set(summary['heldByDomain'])))
text=f'''# Tổng kết tiến trình nông nghiệp — 28/10/2026

**Trạng thái: đang thực hiện; chưa hoàn tất toàn bộ phạm vi và chưa sẵn sàng phát hành.**

Đợt38 đã hoàn thiện và tích hợp sáu bài2号 về phân loại cây–quan sát cây giống, đất–thoát nước, an toàn, điều kiện rau–hạt giống, vật liệu nhà kính và ví dụ phân loại hoa. Có36đơn vị nội dung,72bản dịch trực tiếp từ Nhật và73mục đối chiếu nguồn mới được thể hiện. Đây không phải73năng lực độc lập để tạo câu hỏi.

| Hạng mục | Hiện có | Phần chưa hoàn tất |
|---|---:|---|
| Bài Nhật |195|Tiếp tục đối chiếu khoảng trống nguồn|
| Đơn vị nội dung |1170|Chưa có mẫu số kiến thức độc lập đầy đủ|
| Bài × ngôn ngữ |2340; đủ12ngôn ngữ cho195bài|Duyệt bản ngữ và chuyên môn|
| Hình raster |62|Nhận diện cây, phương pháp tưới, dụng cụ và triệu chứng chưa đủ|
| Câu hỏi tuần |421|Mở rộng theo mục tiêu học được kiểm chứng|
| Đề thi thử |4/20;160/800câu|16đề và640câu|

Hai tài liệu có237trang được kiểm kê. Kiểm tra ảnh trang bằngAI không đồng nghĩa đã xử lý ngữ nghĩa đầy đủ. Các đợt bổ sung đã thể hiện455mục từ danh mục thiếu ban đầu; còn1104mục ứng viên thiếu/một phần và301mục giữ lại để xác minh. Các lần xuất hiện có thể trùng giữa trang/tài liệu, nên chưa thể công bố phần trăm bao phủ kiến thức.

| Nhóm trong danh mục nguồn | Ứng viên thiếu/một phần | Giữ lại từ danh mục nền |
|---|---:|---:|
{rows}

Cần tiếp tục đối chiếu ngữ nghĩa các ứng viên: không phải mọi dòng còn mở đều là một kiến thức độc lập thực sự chưa được dạy. Mục tiêu nhận diện qua hình vẫn mở khi mới có văn bản hoặc tên gọi. Các mục có nguồn mâu thuẫn, điều kiện sản phẩm/quy định hoặc cần kiểm định chuyên môn giữ nguyên trạng thái xác minh.

Hàng chờ mock35 có20ứng viên ngoài app và17đề xuất đã loại. Chưa đủ căn cứ để chứng nhận toàn bộ800câu độc lập. Phải đối chiếu cả phương án sai và lý do của581câu hiện có trước khi hoàn thiện đề mới.

## Kiểm định và phát hành

Đạt kiểm tra dữ liệu/liên kết nguồn, giữ nội dung cũ, bản dịch đủ ngôn ngữ vàhash, kiểm tra trạng thái lưu, kiểm tra hồi quy đánh giá, TypeScript trong phạm vi thay đổi và trình đọc bằng trình duyệt giả lập. Xem `reader-qa.json` và `manifest.json` cho số ca chính xác. Có adapter giao diện/lưu trữ và phông kiểm tra; không thay thế kiểm thử Expo sản xuất hoặc thiết bị thật.

Chưa hoàn tất: duyệt chuyên môn/người bản ngữ; kiểm thử thiết bị thật và bảnbuild sản xuất; đo thời lượng học thực tế; chốt số tuần dựa trên khối lượng nguồn đầy đủ; hoàn thiện hình nhận diện và16đề còn thiếu. Trạng thái releaseReady vẫn false.

Lưu bền vững chỉ được xác nhận sau commit, fetch và WORK PERSISTENCE PASS. Bằng chứng cổng lưu được xác minh sau khi xuất báo cáo; không tạo commit chỉ để ghi SHA.
'''
for before,after in {'bài2号':'bài 2号','36đơn':'36 đơn','72bản':'72 bản','73mục':'73 mục','73năng':'73 năng','2340; đủ12ngôn ngữ cho195bài':'2.340; đủ 12 ngôn ngữ cho 195 bài','16đề':'16 đề','640câu':'640 câu','237trang':'237 trang','455mục':'455 mục','1104mục':'1.104 mục','301mục':'301 mục','20ứng':'20 ứng','17đề':'17 đề','800câu':'800 câu','581câu':'581 câu'}.items():text=text.replace(before,after)
(P/'COMPLETION_REPORT_VI.md').write_text(text)
print(json.dumps({k:summary[k] for k in ['overallStatus','japaneseLessons','translationPairs','candidateMissingOrPartialSourceOccurrences','baselineHeldSourceOccurrences','missingByDomain','heldByDomain']},ensure_ascii=False))
