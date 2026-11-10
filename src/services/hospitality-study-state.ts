export type HotelRecord={revision:string;answers:Record<string,number>;submitted:boolean;completed:boolean};
export type HotelProgress={version:1;lessons:Record<string,HotelRecord>;archive?:Record<string,Record<string,HotelRecord>>};
export const hotelProgressKey=(learner:string)=>`@japan_app_hospitality_v1:${encodeURIComponent(learner)}`;
export function restoreHotelProgress(raw:string|null):HotelProgress|null {
 if(raw===null)return {version:1,lessons:{}};
 try{const p=JSON.parse(raw);if(p?.version!==1||!p.lessons||typeof p.lessons!=='object'||Array.isArray(p.lessons))return null;
 for(const [id,r] of Object.entries(p.lessons) as [string,HotelRecord][]){
 if(!id.startsWith('hotel-')||!r||typeof r.revision!=='string'||typeof r.submitted!=='boolean'||typeof r.completed!=='boolean'||!r.answers||typeof r.answers!=='object'||Array.isArray(r.answers))return null;
 if(Object.values(r.answers).some(v=>!Number.isInteger(v)||v<0||v>3))return null;
 }return p;
 }catch{return null;}
}
export function hotelRecord(progress:HotelProgress,id:string,revision:string):HotelRecord {
 const r=progress.lessons[id];return r?.revision===revision?r:{revision,answers:{},submitted:false,completed:false};
}

export function updateHotelRecord(progress:HotelProgress,id:string,record:HotelRecord):HotelProgress {
 const old=progress.lessons[id];const archive=old&&old.revision!==record.revision?{...progress.archive,[id]:{...progress.archive?.[id],[old.revision]:old}}:progress.archive;
 return {...progress,...(archive?{archive}:{}),lessons:{...progress.lessons,[id]:record}};
}
