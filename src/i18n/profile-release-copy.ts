import copy from './profile-release-copy.json';
export type ProfileCopyKey=keyof typeof copy.en;
export function profileText(language:string,key:ProfileCopyKey,params:Record<string,string|number>={}){
 const row=copy[language as keyof typeof copy]??copy.en;
 return (row[key]??copy.en[key]).replace(/\{(\w+)\}/g,(token,name:string)=>String(params[name]??token));
}
