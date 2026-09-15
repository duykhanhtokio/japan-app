export type PrefectureInfo = { id:string; slug:string; nameJa:string; nameEn:string; icon:string };
const raw:Array<[string,string,string,string]>=[
['hokkaido','北海道','Hokkaido','❄️'],['aomori','青森県','Aomori','🍎'],['iwate','岩手県','Iwate','🏯'],['miyagi','宮城県','Miyagi','🌙'],['akita','秋田県','Akita','🏮'],['yamagata','山形県','Yamagata','🍒'],['fukushima','福島県','Fukushima','🏰'],
['ibaraki','茨城県','Ibaraki','🌊'],['tochigi','栃木県','Tochigi','⛩️'],['gunma','群馬県','Gunma','♨️'],['saitama','埼玉県','Saitama','🏙️'],['chiba','千葉県','Chiba','🗼'],['tokyo','東京都','Tokyo','🗼'],['kanagawa','神奈川県','Kanagawa','⛴️'],
['niigata','新潟県','Niigata','🌾'],['toyama','富山県','Toyama','🏔️'],['ishikawa','石川県','Ishikawa','⛩️'],['fukui','福井県','Fukui','🦖'],['yamanashi','山梨県','Yamanashi','🗻'],['nagano','長野県','Nagano','🏔️'],['gifu','岐阜県','Gifu','🏡'],['shizuoka','静岡県','Shizuoka','🍵'],['aichi','愛知県','Aichi','🏯'],
['mie','三重県','Mie','⛩️'],['shiga','滋賀県','Shiga','🎸'],['kyoto','京都府','Kyoto','⛩️'],['osaka','大阪府','Osaka','🐙'],['hyogo','兵庫県','Hyogo','🏯'],['nara','奈良県','Nara','🦌'],['wakayama','和歌山県','Wakayama','🍊'],
['tottori','鳥取県','Tottori','🐪'],['shimane','島根県','Shimane','⛩️'],['okayama','岡山県','Okayama','🍑'],['hiroshima','広島県','Hiroshima','⛩️'],['yamaguchi','山口県','Yamaguchi','🌉'],
['tokushima','徳島県','Tokushima','💃'],['kagawa','香川県','Kagawa','🍜'],['ehime','愛媛県','Ehime','🍊'],['kochi','高知県','Kochi','🐟'],
['fukuoka','福岡県','Fukuoka','🍜'],['saga','佐賀県','Saga','🏺'],['nagasaki','長崎県','Nagasaki','⛪'],['kumamoto','熊本県','Kumamoto','🏯'],['oita','大分県','Oita','♨️'],['miyazaki','宮崎県','Miyazaki','🌊'],['kagoshima','鹿児島県','Kagoshima','🌋'],['okinawa','沖縄県','Okinawa','🏝️']];
export const prefectures:PrefectureInfo[]=raw.map(([slug,nameJa,nameEn,icon],i)=>({id:`PRF-${String(i+1).padStart(3,'0')}`,slug,nameJa,nameEn,icon}));
export const prefectureById=new Map(prefectures.map(x=>[x.id,x]));
export const prefectureBySlug=new Map(prefectures.map(x=>[x.slug,x]));
