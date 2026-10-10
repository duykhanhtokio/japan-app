import type {ImageSourcePropType} from 'react-native';
type ParagraphArt={source:ImageSourcePropType;aspectRatio:number;captionVi:string};
// Register only visually inspected, newly authored, section-specific artwork.
// Missing entries are not silently counted as covered by generic lesson pictures.
export const paragraphIllustrations:Record<string,ParagraphArt>={
 'kaigo-foundation-01-knowledge-0':{source:require('../../../assets/kaigo/paragraphs/foundation-01-team-v1.webp'),aspectRatio:1619/972,captionVi:'Các vai chuyên môn lắng nghe mong muốn của người sử dụng và cùng phối hợp; minh hoạ không thể hiện thao tác điều trị.'},
};
