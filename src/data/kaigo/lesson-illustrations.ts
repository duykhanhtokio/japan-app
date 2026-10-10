import type {ImageSourcePropType} from 'react-native';
import {topicFor} from './catalog';

const assets={
 choice:require('../../../assets/kaigo/lessons/choice-v1.webp'),
 safety:require('../../../assets/kaigo/lessons/safety-v1.webp'),
 communication:require('../../../assets/kaigo/lessons/communication-v1.webp'),
 movement:require('../../../assets/kaigo/lessons/movement-v1.webp'),
 meals:require('../../../assets/kaigo/lessons/meals-v1.webp'),
 privacy:require('../../../assets/kaigo/lessons/privacy-v1.webp'),
 'daily-life':require('../../../assets/kaigo/lessons/daily-life-v1.webp'),
 handoff:require('../../../assets/kaigo/lessons/handoff-v1.webp'),
 infection:require('../../../assets/kaigo/lessons/infection-v1.webp'),
 observation:require('../../../assets/kaigo/lessons/observation-v1.webp'),
};
const descriptions={
 choice:'Bác cân nhắc vẽ màu hoặc nghe âm thanh; nhân viên lắng nghe để bác tự chọn. Cần hỗ trợ thao tác vẫn có thể giữ quyền lựa chọn.',
 safety:'Vùng sàn ướt được đánh dấu và báo cho đồng nghiệp. Nhận ra nguy cơ cần đi cùng việc bảo vệ người liên quan và kiểm lại kết quả.',
 communication:'Bác chỉ vào thẻ có hình chiếc cốc; nhân viên xác nhận ý thay vì đoán. Có thể phối hợp lời nói, hình và cử chỉ theo từng người.',
 movement:'Bác ngồi trên xe lăn chỉ hướng muốn đi. Cần xác nhận mong muốn, đường đi và cách hỗ trợ; hình này không hướng dẫn thao tác chuyển người.',
 meals:'Bác đang tự cầm thìa và ra hiệu muốn tạm dừng. Lắng nghe mong muốn và phần bác tự làm; không suy ra chế độ ăn hay kỹ thuật nuốt từ hình.',
 privacy:'Nhân viên gõ cửa và chờ trước khi vào. Xin phép, che chắn và chia sẻ đúng phạm vi giúp giữ sự riêng tư trong chăm sóc.',
 'daily-life':'Bác tự gấp chiếc khăn đã chọn; nhân viên làm phần riêng bên cạnh. Mục tiêu là giữ hoạt động có ý nghĩa và phần tham gia phù hợp của bác.',
 handoff:'Một người nêu dữ kiện, người kia ghi và xác nhận. Có người nhận báo cáo chưa đồng nghĩa mọi việc đã được xử lý xong.',
 infection:'Nhân viên làm khô tay bằng giấy sau rửa, vùng cổ tay không bị trang sức che. Hình nhắc một điểm kiểm; không mô tả đầy đủ quy trình vệ sinh tay.',
 observation:'Bác chỉ vị trí ở vai của chính mình; nhân viên nghe và ghi. Lời bác, vị trí đã xác nhận và điều quan sát cần được phân biệt với chẩn đoán.',
};
export type LessonIllustration={key:keyof typeof assets;source:ImageSourcePropType;captionVi:string;aspectRatio:number};
export function illustrationFor(parentDay:number,title:string):LessonIllustration{
 const topic=topicFor(parentDay,title);const t=title.toLowerCase();
 const key:keyof typeof assets=/trí nhớ/.test(t)?'daily-life':/cảm xúc|động lực|căng thẳng/.test(t)?'communication':/ăn uống|thực đơn|khay|tự ăn|ép ăn|nhịp ăn/.test(t)?'meals':/vệ sinh tay|rửa tay|găng|nhiễm khuẩn|khử khuẩn/.test(t)?'infection':
  /bàn giao|phân công|diễn tập|số đo|trí nhớ|giảm tải|sức khỏe nhân viên/.test(t)?'handoff':
  /trang phục|chỉnh trang|việc nhà/.test(t)?'daily-life':
  topic==='dignity'?'choice':topic==='body'?'observation':topic==='excretion'||topic==='hygiene'?'privacy':topic==='review'?'handoff':topic;
 return {key,source:assets[key],captionVi:descriptions[key],aspectRatio:1619/(key==='safety'||key==='daily-life'?971:972)};
}
