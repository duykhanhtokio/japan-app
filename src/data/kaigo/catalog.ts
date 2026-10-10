import {kaigoCourse,kaigoAtomicKnowledge,kaigoDailyPlan,kaigoLanguageSupplements} from './index';

export type StudySelection={kind:'lesson'|'mock'|'atomic'|'language';id:string;day?:number};
export const kaigoTopics=[
 {id:'dignity',titleVi:'Tôn nghiêm và tự lập',guideVi:'Hỏi mong muốn → xin phép → xác nhận phần hỗ trợ; ôn chất lượng sống và quyền lựa chọn.'},
 {id:'safety',titleVi:'An toàn và nhiễm khuẩn',guideVi:'Nhận diện nguy cơ → bảo vệ người liên quan → báo và kiểm lại; ôn vệ sinh tay, sức khỏe nhân viên và dự phòng.'},
 {id:'body',titleVi:'Cơ thể và tinh thần',guideVi:'Hiểu cơ chế → phân biệt thuật ngữ → ghi dữ kiện trong bối cảnh; không tự chẩn đoán từ một biểu hiện.'},
 {id:'communication',titleVi:'Giao tiếp và khác biệt cá nhân',guideVi:'Lắng nghe → hỏi lại → xác nhận ý; điều chỉnh theo khả năng nghe, nhìn, hiểu và mong muốn của từng người.'},
 {id:'movement',titleVi:'Di chuyển',guideVi:'Nhu cầu và khả năng → môi trường, dụng cụ → phối hợp; hình tình huống không thay huấn luyện chuyển người.'},
 {id:'meals',titleVi:'Ăn uống',guideVi:'Mong muốn → kế hoạch cá nhân → phần tự làm → ghi lượng và phản ứng; không tự chọn chế độ hay kỹ thuật nuốt.'},
 {id:'excretion',titleVi:'Bài tiết',guideVi:'Tiếp nhận kín đáo → xác nhận hỗ trợ → quan sát, ghi và bàn giao; tách lời bác khỏi nguyên nhân chưa biết.'},
 {id:'hygiene',titleVi:'Chỉnh trang, tắm và vệ sinh',guideVi:'Lựa chọn và riêng tư → đồ dùng, môi trường → phần đã đồng ý → kết quả thực; không mở rộng sự đồng ý.'},
 {id:'daily-life',titleVi:'Việc nhà và dịch vụ',guideVi:'Hoạt động có ý nghĩa → phần tham gia → nơi cung cấp dịch vụ → mục tiêu và kết quả hỗ trợ.'},
 {id:'handoff',titleVi:'Văn bản và bàn giao',guideVi:'Ai, khi nào, việc gì đã xác nhận → điều chưa biết → người nhận và bước tiếp; đọc rõ hiệu lực và trách nhiệm.'},
 {id:'review',titleVi:'Ôn tổng hợp',guideVi:'Tự trả lời → đối chiếu lý do → chọn chủ đề còn yếu → thử một ca khác. Thi thử và chữa lỗi là hai buổi riêng.'},
] as const;
export type TopicId=typeof kaigoTopics[number]['id'];
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\u0111/g,'d').toLowerCase();
export function topicFor(parentDay:number,title:string):TopicId{
 const t=norm(title);
 if(/ban giao|ghi chep|ho so|van ban|thong bao|bao cao|nguoi nhan|du kien|quan sat va dieu/.test(t))return 'handoff';
 if(/ve sinh tay|rua tay|ban tay|gang|nhiem khuan|du phong|tham hoa|lung|co hoc|khuan|an toan|su co|nguy co|dien tap|suc khoe nhan vien/.test(t))return 'safety';
 if(/tri nho|cam xuc|cang thang|noi moi|nhiet do|huyet ap|dau hieu|mach|ho hap|co the|co quan|than kinh|xuong|giai phau|so do/.test(t)||parentDay===8||parentDay===9)return 'body';
 if(/giao tiep|lang nghe|nghe|nhin|sa sut|khuyet tat|lao hoa/.test(t)||parentDay>=10&&parentDay<=12)return 'communication';
 if(/dich vu|chat luong song|muc tieu|danh gia/.test(t))return /dich vu|muc tieu|danh gia/.test(t)?'daily-life':'dignity';
 if(parentDay<=7)return 'dignity';
 if(parentDay<=14)return 'safety';
 if(parentDay<=21)return 'movement';
 if(parentDay<=28)return 'meals';
 if(parentDay<=35)return 'excretion';
 if(parentDay<=42)return 'hygiene';
 if(parentDay<=44||parentDay===49)return 'daily-life';
 if(parentDay<=48)return 'handoff';
 return 'review';
}
export type CatalogEntry=StudySelection&{day:number;parentDay:number;titleVi:string;topicId:TopicId;typeVi:string;practiceTitleVi?:string;mockPart?:number;mockParts?:number;testID:string;searchText:string};
export const kaigoCatalog:CatalogEntry[]=[
 ...kaigoDailyPlan.baseDays.map(d=>({kind:d.mockId?'mock':'lesson',id:(d.mockId??d.lessonId)!,day:d.day,parentDay:d.baseDay,titleVi:d.titleVi+(d.parts>1?` · phần ${d.part}/${d.parts}`:''),topicId:d.mockId?'review':topicFor(d.baseDay,d.titleVi),typeVi:d.mockId?'Thi thử':d.baseDay===56?'Chữa đề và ôn lỗi':'Bài học',mockPart:d.mockId?d.part:undefined,mockParts:d.mockId?d.parts:undefined,practiceTitleVi:kaigoCourse.lessons.find(l=>l.id===d.lessonId)?.titleVi,testID:d.part===1?`kaigo-day-${d.baseDay}`:`kaigo-day-${d.baseDay}-part-${d.part}`})),
 ...kaigoAtomicKnowledge.days.map(d=>{const units=d.unitIds.map(id=>kaigoAtomicKnowledge.units.find(u=>u.id===id)!);return {kind:'atomic',id:String(d.day),day:d.day,parentDay:units[0].parentDay,titleVi:units.map(u=>u.titleVi).join(' · '),topicId:topicFor(units[0].parentDay,units[0].titleVi),typeVi:'Kiến thức chi tiết',testID:`kaigo-atomic-day-${d.day}`};}),
 ...kaigoLanguageSupplements.days.map(d=>{const g=kaigoLanguageSupplements.groups.find(g=>g.id===d.groupId)!;return {kind:'language',id:String(d.day),day:d.day,parentDay:g.parentDay,titleVi:g.titleVi,topicId:topicFor(g.parentDay,g.titleVi),typeVi:'Đọc hiểu tình huống',testID:`kaigo-language-day-${d.day}`};}),
].map(d=>({...d,searchText:norm(`${d.titleVi} ${d.typeVi} ${kaigoTopics.find(t=>t.id===d.topicId)?.titleVi} ${d.day} ${kaigoCourse.lessons.find(l=>l.day===d.parentDay)?.titleVi??''}`)} as CatalogEntry)).sort((a,b)=>a.day-b.day);
export function searchCatalog(entries:CatalogEntry[],query:string){const q=norm(query.trim());return !q?entries:/^\d+$/.test(q)?entries.filter(e=>e.day===Number(q)):entries.filter(e=>e.searchText.includes(q));}
export function validSelection(value:unknown):value is StudySelection{
 if(!value||typeof value!=='object')return false;const x=value as StudySelection;
 return kaigoCatalog.some(e=>e.kind===x.kind&&e.id===x.id)||(x.kind==='mock'&&kaigoCourse.mocks.some(m=>m.id===x.id))||(x.kind==='lesson'&&kaigoCourse.candidates.some(l=>l.id===x.id));
}

export function activityLabel(entry:CatalogEntry){return entry.kind==='mock'?'THI':entry.typeVi==='Chữa đề và ôn lỗi'?'CHỮA ĐỀ':'HỌC';}
export const kaigoWeeks=Array.from({length:Math.ceil(kaigoCatalog.length/7)},(_,i)=>{
 const entries=kaigoCatalog.slice(i*7,i*7+7);
 return {week:i+1,firstDay:entries[0].day,lastDay:entries[entries.length-1].day,entries,studyCount:entries.filter(e=>activityLabel(e)==='HỌC').length,examCount:entries.filter(e=>e.kind==='mock').length,reviewCount:entries.filter(e=>activityLabel(e)==='CHỮA ĐỀ').length,topics:kaigoTopics.filter(t=>entries.some(e=>e.topicId===t.id)).map(t=>t.titleVi)};
});
