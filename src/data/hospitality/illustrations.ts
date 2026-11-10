import type {ImageSourcePropType} from 'react-native';
import {hotelIllustrationSourceKnown,hotelIllustrationSourceMatches} from './illustration-source-guards';
const figures:Record<string,()=>ImageSourcePropType>={
 'hotel-front-01':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-front-01.webp'),
 'hotel-front-02':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-front-02.webp'),
 'hotel-front-03':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-front-03.webp'),
 'hotel-front-04':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-front-04.webp'),
 'hotel-front-05':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-front-05.webp'),
 'hotel-front-06':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-front-06.webp'),
 'hotel-front-07':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-front-07.webp'),
 'hotel-front-08':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-front-08.webp'),
 'hotel-planning-01':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-planning-01.webp'),
 'hotel-planning-02':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week01/hotel-planning-02.webp'),
 'hotel-planning-03':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-planning-03-royal-ink-v2.webp'),
 'hotel-planning-04':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-planning-04-royal-ink-v2.webp'),
 'hotel-planning-05':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-planning-05.webp'),
 'hotel-planning-06':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-planning-06-royal-material-v2.webp'),
 'hotel-planning-07':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-planning-07.webp'),
 'hotel-service-01':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-service-01.webp'),
 'hotel-service-02':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-service-02.webp'),
 'hotel-service-03':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-service-03.webp'),
 'hotel-service-04':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-service-04.webp'),
 'hotel-service-05':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week02/hotel-service-05.webp'),
 'hotel-service-06':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-service-06.webp'),
 'hotel-restaurant-01':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-restaurant-01.webp'),
 'hotel-restaurant-02':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-restaurant-02.webp'),
 'hotel-restaurant-03':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-restaurant-03-three-dishes-v2.webp'),
 'hotel-restaurant-04':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-restaurant-04.webp'),
 'hotel-restaurant-05':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-restaurant-05.webp'),
 'hotel-restaurant-06':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-restaurant-06.webp'),
 'hotel-restaurant-07':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week04/hotel-restaurant-07.webp'),
 'hotel-restaurant-08':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week05/hotel-restaurant-08.webp'),
 'hotel-restaurant-09':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week05/hotel-restaurant-09.webp'),
 'hotel-safety-01':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week03/hotel-safety-01.webp'),
 'hotel-safety-02':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week04/hotel-safety-02.webp'),
 'hotel-safety-03':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week04/hotel-safety-03.webp'),
 'hotel-safety-04':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week04/hotel-safety-04.webp'),
 'hotel-safety-05':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week04/hotel-safety-05.webp'),
 'hotel-safety-06':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week06/hotel-safety-06.webp'),
 'hotel-safety-07':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week06/hotel-safety-07.webp'),
 'hotel-safety-08':()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week06/hotel-safety-08.webp'),
};
export function hasHotelIllustration(id:string):boolean{return hotelIllustrationSourceKnown(id)||Object.prototype.hasOwnProperty.call(figures,id);}
export function hotelIllustration(id:string,revision:string):ImageSourcePropType|null{return hotelIllustrationSourceMatches(id,revision)?figures[id]?.()??null:null;}

export {hotelIllustrationAlt,hotelIllustrationAspectRatio} from './royal-illustration-metadata';

export {hotelIllustrationUnavailableText,hotelIllustrationRetryText} from './illustration-source-guards';
