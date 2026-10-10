import type {ImageSourcePropType} from 'react-native';
type ParagraphArt={source:ImageSourcePropType;aspectRatio:number;captionVi:string};
// Register only visually inspected, newly authored, section-specific artwork.
// Missing entries are not silently counted as covered by generic lesson pictures.
export const paragraphIllustrations:Record<string,ParagraphArt>={
 'kaigo-foundation-01-knowledge-0':{source:require('../../../assets/kaigo/paragraphs/foundation-01-team-v1.webp'),aspectRatio:1619/972,captionVi:'Các vai chuyên môn lắng nghe mong muốn của người sử dụng và cùng phối hợp; minh hoạ không thể hiện thao tác điều trị.'},
 'kaigo-foundation-01-summary':{source:require('../../../assets/kaigo/paragraphs/foundation-01-overview-v1.webp'),aspectRatio:1619/972,captionVi:"Người sử dụng chọn hoạt động sinh hoạt; nhân viên chăm sóc lắng nghe và phối hợp với các vai chuyên môn."},
 'kaigo-foundation-01-knowledge-1':{source:require('../../../assets/kaigo/paragraphs/foundation-01-resources-v1.webp'),aspectRatio:1619/972,captionVi:"Thông tin về bữa ăn được trao đổi với chuyên viên dinh dưỡng; kế hoạch và nguồn lực được phối hợp đúng vai."},
 'kaigo-foundation-01-knowledge-2':{source:require('../../../assets/kaigo/paragraphs/foundation-01-role-boundary-v1.webp'),aspectRatio:1619/971,captionVi:"Nhân viên chăm sóc giới thiệu phần việc của mình và liên hệ điều dưỡng khi cần phối hợp."},
 'kaigo-foundation-01-knowledge-3':{source:require('../../../assets/kaigo/paragraphs/foundation-01-first-meeting-v1.webp'),aspectRatio:1618/972,captionVi:"Lần đầu nhân viên chăm sóc gặp người sử dụng tại phòng ở và chào hỏi đúng vai."},
 'kaigo-foundation-01-words':{source:require('../../../assets/kaigo/paragraphs/foundation-01-vocabulary-v1.webp'),aspectRatio:1619/972,captionVi:"Chào hỏi, người phụ trách và điều dưỡng được nhận biết qua một cảnh trao đổi trong cơ sở chăm sóc."},
 'kaigo-foundation-01-dialogue':{source:require('../../../assets/kaigo/paragraphs/foundation-01-short-greeting-v1.webp'),aspectRatio:1619/972,captionVi:"Nhân viên xác nhận cách xưng hô người sử dụng mong muốn và kết thúc lời chào ngắn theo ý của bác."},
 'kaigo-foundation-01-transfer-legacy':{source:require('../../../assets/kaigo/paragraphs/foundation-01-phone-time-v1.webp'),aspectRatio:1619/972,captionVi:"Người sử dụng sắp nhận điện thoại; nhân viên giới thiệu ngắn và tôn trọng giới hạn thời gian."},
 'kaigo-foundation-01-reading':{source:require('../../../assets/kaigo/paragraphs/foundation-01-handoff-note-v1.webp'),aspectRatio:1619/972,captionVi:"Nhân viên ghi lại vai phụ trách, cách xưng hô mong muốn và yêu cầu chào hỏi ngắn để bàn giao."},
 'kaigo-language-transfer-240':{source:require('../../../assets/kaigo/paragraphs/foundation-01-vegetable-choice-v1.webp'),aspectRatio:1619/972,captionVi:"Người sử dụng cùng chọn rau và muốn nhân viên đảm nhiệm khâu nấu; hai bên xác nhận phần việc."},
};
