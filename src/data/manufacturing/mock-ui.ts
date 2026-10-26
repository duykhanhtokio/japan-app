import data from './mock-ui-translations.json';
export type MockLabel=keyof typeof data.locales.ja;
export function manufacturingMockUi(locale:string,key:MockLabel):string{return (data.locales[locale as keyof typeof data.locales]??data.locales.ja)[key]??data.locales.ja[key];}
