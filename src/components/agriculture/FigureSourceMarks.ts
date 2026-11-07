import type {FigureMark} from './ZoomableFigure';
const fuelImageSha='6640241bcf7e127d4c7f65ad97b938d60d37ec0a0788a0d1148ea05fece26938';
/** Marks are geometry-bound to inspected source pixels; never guess for another revision. */
export function agricultureFigureSourceMarks(figure:{id:string;assetSha256?:string;width:number;height:number}):FigureMark[]{
 if(figure.id!=='agr-f40-safety-media-fuel-container-source-sign'||figure.assetSha256!==fuelImageSha||figure.width!==1536||figure.height!==1024)return [];
 // Inspected right kerosene-container body, below the handle/caps and inside its outline.
 return [{kind:'cross',x:.73,y:.57,width:.12,height:.18,color:'#ce3434',label:'資料の右側の灯油用ポリ容器に対応するガソリン禁止表示'}];
}
