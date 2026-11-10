import type {SourceFigure31} from '@/data/restaurant/source31';
import data from '@/data/restaurant/royal-currency-denominations.json';
import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';

/** Identify only exact current teaching figures; test images retain their neutral labels. */
export function restaurantCurrencyDenomination(figure:SourceFigure31,language='ja'):string|null{
 if(figure.quizSafe!==false||figure.cropBox)return null;
 const binding=data.bindings.find(b=>sameRestaurantFigureIdentity(b.figure,figure));
 if(!binding)return null;
 const row=require('../../data/restaurant/source31/1.json').lessons[data.lessonId];
 if(row?.sourceHash!==data.rowSourceHash||!row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure)))return null;
 try{return new Intl.NumberFormat(language,{style:'currency',currency:'JPY',currencyDisplay:'code',maximumFractionDigits:0}).format(binding.yen);}
 catch{return new Intl.NumberFormat('en',{style:'currency',currency:'JPY',currencyDisplay:'code',maximumFractionDigits:0}).format(binding.yen);}
}
export function restaurantCurrencyLabel(figure:SourceFigure31,label:string,language='ja'):string{
 const denomination=restaurantCurrencyDenomination(figure,language);
 return denomination?`${denomination} — ${label}`:label;
}
