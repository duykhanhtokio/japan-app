import data from './ui-translations.json';
type Labels=typeof data.locales.ja;
export type ManufacturingLabel=keyof Labels;
export function manufacturingUi(locale:string,key:ManufacturingLabel):string {
 const labels=data.locales[locale as keyof typeof data.locales]??data.locales.ja;
 return labels[key]??data.locales.ja[key];
}
