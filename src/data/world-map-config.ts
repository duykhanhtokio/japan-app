import { MapPlacement, ResponsiveMapAssets, WorldMapItem } from '@/components/world/ResponsiveWorldMap';

export type RegionMapId = 'hokkaido' | 'tohoku' | 'kanto' | 'chubu' | 'kansai' | 'chugoku' | 'shikoku' | 'kyushu';

const palette = [
    ['#dcecff', '#4b91db'], ['#ffe1e5', '#ef7182'], ['#ddf8f6', '#35ada9'],
    ['#fff1bd', '#dca91f'], ['#ffe4cf', '#ee8a42'], ['#eadcff', '#9c67d6'],
    ['#e6f5d7', '#78ad47'], ['#ffd9ee', '#d95a9e'], ['#dce5ff', '#586fd1'],
];
const landColor:Record<string,[string,string]>={
 hokkaido:['#dcecff','#3f86cf'],tohoku:['#e6f6d5','#73aa42'],kanto:['#fff0bd','#d69a20'],chubu:['#ffe1e5','#df6679'],kansai:['#ffe1e5','#e27082'],chugoku:['#eadcff','#8659c8'],shikoku:['#ddf8f6','#36a7a5'],kyushu:['#ffd9ee','#d85a9d'],
 gunma:['#fff0bd','#ce8a24'],tochigi:['#ffe1e5','#db5e70'],ibaraki:['#eadcff','#8757ca'],saitama:['#dcecff','#527bd0'],tokyo:['#ffd9ee','#d8428d'],chiba:['#e6f5d7','#63aa4e'],kanagawa:['#ddf8f6','#2da5aa'],
 niigata:['#dcecff','#4287ca'],toyama:['#ddf8f6','#34a8a5'],ishikawa:['#fff0bd','#d3a11d'],fukui:['#eadcff','#8c5dcc'],yamanashi:['#e6f5d7','#65aa4b'],nagano:['#fff0bd','#d5a01c'],gifu:['#ffe1e5','#df6b77'],shizuoka:['#dcecff','#477bc6'],aichi:['#ffe4cf','#e27d38'],
 hyogo:['#dcecff','#4986d1'],kyoto:['#ffe1e5','#dc6779'],shiga:['#ddf8f6','#35aaa6'],osaka:['#fff0bd','#d59f1e'],nara:['#ffe4cf','#e4823c'],wakayama:['#eadcff','#8b5bc7'],mie:['#e6f5d7','#67a948'],
};

type XY=[number,number];
const place=(pa:XY,pl:XY,la:XY,ll:XY):Record<'phone'|'tablet'|'landscape',MapPlacement>=>({
    phone:{anchor:{x:pa[0],y:pa[1]},label:{x:pl[0],y:pl[1]}},
    tablet:{anchor:{x:pa[0],y:pa[1]},label:{x:pl[0],y:pl[1]}},
    landscape:{anchor:{x:la[0],y:la[1]},label:{x:ll[0],y:ll[1]}},
});
const P:Record<string,ReturnType<typeof place>>={
 hokkaido:place([.76,.26],[.86,.20],[.58,.20],[.76,.16]),tohoku:place([.67,.41],[.84,.35],[.59,.37],[.77,.31]),kanto:place([.65,.56],[.84,.55],[.59,.50],[.79,.49]),chubu:place([.51,.55],[.34,.47],[.54,.48],[.31,.43]),kansai:place([.39,.57],[.20,.54],[.50,.54],[.27,.58]),chugoku:place([.23,.59],[.12,.67],[.46,.57],[.25,.70]),shikoku:place([.34,.67],[.39,.76],[.49,.63],[.48,.80]),kyushu:place([.17,.75],[.13,.83],[.43,.70],[.72,.73]),
 doo:place([.54,.55],[.25,.38],[.52,.53],[.20,.33]),donan:place([.29,.69],[.18,.76],[.45,.65],[.20,.72]),dohoku:place([.49,.39],[.50,.26],[.51,.39],[.50,.17]),doto:place([.72,.48],[.84,.45],[.59,.47],[.82,.39]),
 aomori:place([.53,.33],[.24,.28],[.52,.28],[.22,.24]),iwate:place([.62,.43],[.83,.38],[.56,.40],[.81,.34]),miyagi:place([.58,.57],[.82,.57],[.55,.51],[.81,.51]),akita:place([.40,.43],[.17,.42],[.47,.40],[.20,.39]),yamagata:place([.43,.57],[.18,.59],[.48,.51],[.20,.56]),fukushima:place([.49,.70],[.50,.79],[.50,.64],[.50,.80]),
 gunma:place([.30,.42],[.14,.36],[.46,.41],[.18,.32]),tochigi:place([.52,.39],[.50,.27],[.52,.38],[.48,.18]),ibaraki:place([.75,.48],[.85,.43],[.59,.46],[.82,.38]),saitama:place([.39,.55],[.17,.54],[.48,.50],[.20,.51]),tokyo:place([.42,.63],[.20,.68],[.49,.58],[.22,.69]),chiba:place([.68,.65],[.84,.68],[.58,.59],[.80,.68]),kanagawa:place([.35,.70],[.45,.79],[.47,.64],[.47,.81]),
 niigata:place([.65,.36],[.83,.30],[.57,.37],[.80,.27]),toyama:place([.52,.46],[.66,.40],[.52,.45],[.70,.39]),ishikawa:place([.35,.45],[.18,.36],[.46,.44],[.24,.35]),fukui:place([.26,.57],[.14,.56],[.43,.53],[.19,.52]),yamanashi:place([.68,.59],[.85,.55],[.58,.54],[.82,.53]),nagano:place([.59,.50],[.81,.43],[.55,.47],[.79,.42]),gifu:place([.47,.61],[.30,.66],[.50,.55],[.28,.64]),shizuoka:place([.63,.72],[.79,.73],[.56,.64],[.80,.69]),aichi:place([.38,.72],[.36,.80],[.47,.64],[.48,.80]),
 hyogo:place([.31,.42],[.14,.34],[.45,.43],[.19,.32]),kyoto:place([.54,.37],[.50,.25],[.53,.39],[.50,.18]),shiga:place([.68,.43],[.85,.36],[.58,.43],[.82,.34]),osaka:place([.45,.58],[.26,.61],[.49,.53],[.23,.58]),nara:place([.57,.62],[.75,.64],[.54,.56],[.78,.58]),wakayama:place([.36,.70],[.23,.77],[.46,.63],[.24,.75]),mie:place([.71,.64],[.85,.72],[.59,.58],[.81,.70]),
 tottori:place([.54,.36],[.50,.25],[.52,.38],[.50,.18]),shimane:place([.34,.43],[.15,.39],[.46,.43],[.19,.36]),okayama:place([.59,.52],[.82,.47],[.55,.49],[.81,.43]),hiroshima:place([.42,.58],[.19,.61],[.49,.53],[.20,.58]),yamaguchi:place([.28,.62],[.16,.72],[.44,.57],[.22,.72]),
 tokushima:place([.64,.57],[.83,.55],[.56,.51],[.80,.46]),kagawa:place([.53,.42],[.50,.29],[.52,.41],[.50,.20]),ehime:place([.35,.50],[.16,.47],[.46,.47],[.20,.43]),kochi:place([.47,.65],[.44,.77],[.50,.58],[.49,.78]),
 fukuoka:place([.46,.35],[.22,.28],[.49,.36],[.21,.26]),saga:place([.33,.43],[.15,.42],[.44,.42],[.19,.40]),nagasaki:place([.24,.52],[.13,.57],[.41,.48],[.18,.55]),kumamoto:place([.46,.51],[.25,.57],[.49,.48],[.25,.56]),oita:place([.64,.44],[.83,.39],[.57,.43],[.81,.36]),miyazaki:place([.61,.61],[.82,.60],[.56,.55],[.81,.57]),kagoshima:place([.43,.69],[.42,.80],[.49,.64],[.48,.80]),okinawa:place([.76,.79],[.82,.83],[.63,.68],[.79,.75]),
};
const item=(id:string,ja:string,en:string,icon:string,index:number,progress='0/15'):WorldMapItem=>{const tone=landColor[id]??palette[index%palette.length];return{id,ja,en,icon,progress,color:tone[0],border:tone[1],positions:P[id]}};

export const japanAssets: ResponsiveMapAssets = {
    phone: require('../../assets/app/maps/regions/japan-phone.png'),
    tablet: require('../../assets/app/maps/regions/japan-tablet.png'),
    landscape: require('../../assets/app/maps/regions/japan-landscape.png'),
};

export const japanRegions: WorldMapItem[] = [
    item('hokkaido', '北海道', 'Hokkaido', '❄️', 0, '0/20'),
    item('tohoku', '東北', 'Tohoku', '🏮', 1, '0/25'),
    item('kanto', '関東', 'Kanto', '🗼', 2, '5/30'),
    item('chubu', '中部', 'Chubu', '🗻', 3, '0/25'),
    item('kansai', '関西', 'Kansai', '⛩️', 4, '0/25'),
    item('chugoku', '中国', 'Chugoku', '🌉', 5, '0/20'),
    item('shikoku', '四国', 'Shikoku', '🍜', 6, '0/15'),
    item('kyushu', '九州・沖縄', 'Kyushu & Okinawa', '🌋', 7, '0/20'),
];

const assets = (name: RegionMapId): ResponsiveMapAssets => ({
    phone: name === 'hokkaido' ? require('../../assets/app/maps/regions/hokkaido-phone.png')
        : name === 'tohoku' ? require('../../assets/app/maps/regions/tohoku-phone.png')
        : name === 'kanto' ? require('../../assets/app/maps/regions/kanto-phone.png')
        : name === 'chubu' ? require('../../assets/app/maps/regions/chubu-phone.png')
        : name === 'kansai' ? require('../../assets/app/maps/regions/kansai-responsive-phone.png')
        : name === 'chugoku' ? require('../../assets/app/maps/regions/chugoku-phone.png')
        : name === 'shikoku' ? require('../../assets/app/maps/regions/shikoku-phone.png')
        : require('../../assets/app/maps/regions/kyushu-phone.png'),
    tablet: name === 'hokkaido' ? require('../../assets/app/maps/regions/hokkaido-tablet.png')
        : name === 'tohoku' ? require('../../assets/app/maps/regions/tohoku-tablet.png')
        : name === 'kanto' ? require('../../assets/app/maps/regions/kanto-tablet.png')
        : name === 'chubu' ? require('../../assets/app/maps/regions/chubu-tablet.png')
        : name === 'kansai' ? require('../../assets/app/maps/regions/kansai-responsive-tablet.png')
        : name === 'chugoku' ? require('../../assets/app/maps/regions/chugoku-tablet.png')
        : name === 'shikoku' ? require('../../assets/app/maps/regions/shikoku-tablet.png')
        : require('../../assets/app/maps/regions/kyushu-tablet.png'),
    landscape: name === 'hokkaido' ? require('../../assets/app/maps/regions/hokkaido-landscape.png')
        : name === 'tohoku' ? require('../../assets/app/maps/regions/tohoku-landscape.png')
        : name === 'kanto' ? require('../../assets/app/maps/regions/kanto-landscape.png')
        : name === 'chubu' ? require('../../assets/app/maps/regions/chubu-landscape.png')
        : name === 'kansai' ? require('../../assets/app/maps/regions/kansai-responsive-landscape.png')
        : name === 'chugoku' ? require('../../assets/app/maps/regions/chugoku-landscape.png')
        : name === 'shikoku' ? require('../../assets/app/maps/regions/shikoku-landscape.png')
        : require('../../assets/app/maps/regions/kyushu-landscape.png'),
});

export const regionMaps: Record<RegionMapId, { assets: ResponsiveMapAssets; items: WorldMapItem[] }> = {
    hokkaido: { assets: assets('hokkaido'), items: [
        item('doo', '道央', 'Central Hokkaido', '🏙️', 0), item('donan', '道南', 'Southern Hokkaido', '🌃', 1),
        item('dohoku', '道北', 'Northern Hokkaido', '🪻', 2), item('doto', '道東', 'Eastern Hokkaido', '🐦', 3),
    ] },
    tohoku: { assets: assets('tohoku'), items: [
        item('aomori', '青森', 'Aomori', '🍎', 0), item('iwate', '岩手', 'Iwate', '🏯', 1), item('miyagi', '宮城', 'Miyagi', '🌙', 2),
        item('akita', '秋田', 'Akita', '🏮', 3), item('yamagata', '山形', 'Yamagata', '🍒', 4), item('fukushima', '福島', 'Fukushima', '🏰', 5),
    ] },
    kanto: { assets: assets('kanto'), items: [
        item('gunma', '群馬', 'Gunma', '🗻', 0), item('tochigi', '栃木', 'Tochigi', '⛩️', 1), item('ibaraki', '茨城', 'Ibaraki', '🏖️', 2),
        item('saitama', '埼玉', 'Saitama', '🏙️', 3), item('tokyo', '東京', 'Tokyo', '🗼', 4, '5/30'), item('chiba', '千葉', 'Chiba', '🗼', 5), item('kanagawa', '神奈川', 'Kanagawa', '⛴️', 6),
    ] },
    chubu: { assets: assets('chubu'), items: [
        item('niigata', '新潟', 'Niigata', '🌾', 0), item('toyama', '富山', 'Toyama', '🏔️', 1), item('ishikawa', '石川', 'Ishikawa', '⛩️', 2),
        item('fukui', '福井', 'Fukui', '🦖', 3), item('yamanashi', '山梨', 'Yamanashi', '🗻', 4), item('nagano', '長野', 'Nagano', '🏔️', 5),
        item('gifu', '岐阜', 'Gifu', '🏡', 6), item('shizuoka', '静岡', 'Shizuoka', '🍵', 7), item('aichi', '愛知', 'Aichi', '🏯', 8),
    ] },
    kansai: { assets: assets('kansai'), items: [
        item('hyogo','兵庫','Hyogo','🏯',0), item('kyoto','京都','Kyoto','⛩️',1), item('shiga','滋賀','Shiga','🎸',2),
        item('osaka','大阪','Osaka','🐙',3), item('nara','奈良','Nara','🦌',4), item('wakayama','和歌山','Wakayama','🍊',5), item('mie','三重','Mie','⛩️',6),
    ] },
    chugoku: { assets: assets('chugoku'), items: [
        item('tottori', '鳥取', 'Tottori', '🐪', 0), item('shimane', '島根', 'Shimane', '⛩️', 1), item('okayama', '岡山', 'Okayama', '🍑', 2),
        item('hiroshima', '広島', 'Hiroshima', '⛩️', 3), item('yamaguchi', '山口', 'Yamaguchi', '🌉', 4),
    ] },
    shikoku: { assets: assets('shikoku'), items: [
        item('tokushima', '徳島', 'Tokushima', '💃', 0), item('kagawa', '香川', 'Kagawa', '🍜', 1),
        item('ehime', '愛媛', 'Ehime', '🍊', 2), item('kochi', '高知', 'Kochi', '🐟', 3),
    ] },
    kyushu: { assets: assets('kyushu'), items: [
        item('fukuoka', '福岡', 'Fukuoka', '🍜', 0), item('saga', '佐賀', 'Saga', '🏺', 1), item('nagasaki', '長崎', 'Nagasaki', '⛪', 2),
        item('kumamoto', '熊本', 'Kumamoto', '🏯', 3), item('oita', '大分', 'Oita', '♨️', 4), item('miyazaki', '宮崎', 'Miyazaki', '🌊', 5),
        item('kagoshima', '鹿児島', 'Kagoshima', '🌋', 6), item('okinawa', '沖縄', 'Okinawa', '🏯', 7),
    ] },
};
