import type {ImageSourcePropType} from 'react-native';
import type {FigureMark} from './ZoomableFigure';
// Immutable versioned module; exact same require identity as the active image resolver.
// Its verified bytes are pinned by fuelImageSha below; never match a URI/name substring.
const fuelContainerSource=require('../../../assets/agriculture/royal-weekly-20261107/week09/fuel-container-appearance-royal-v1.webp') as ImageSourcePropType;
const fuelImageSha='6640241bcf7e127d4c7f65ad97b938d60d37ec0a0788a0d1148ea05fece26938';
/** Marks are geometry-bound to inspected source pixels; never guess for another revision. */
export function agricultureFigureSourceMarks(figure:{id:string;assetSha256?:string;width:number;height:number}):FigureMark[]{
 if(figure.id!=='agr-f40-safety-media-fuel-container-source-sign'||figure.assetSha256!==fuelImageSha||figure.width!==1536||figure.height!==1024)return [];
 // Inspected right kerosene-container body, below the handle/caps and inside its outline.
 return [{kind:'cross',x:.73,y:.57,width:.12,height:.18,color:'#ce3434',label:'資料の右側の灯油用ポリ容器に対応するガソリン禁止表示'}];
}

/** Source-owned mark survives legacy callers that omit the optional marks prop. */
export function agricultureIntrinsicFigureSourceMarks(source:ImageSourcePropType,width:number,height:number):FigureMark[]{
 if(source!==fuelContainerSource||width!==1536||height!==1024)return [];
 return agricultureFigureSourceMarks({id:'agr-f40-safety-media-fuel-container-source-sign',assetSha256:fuelImageSha,width,height});
}
