export const PREFECTURES = [
 ['PRF-001','北海道','Hokkaido','hokkaido'],['PRF-002','青森県','Aomori','tohoku'],['PRF-003','岩手県','Iwate','tohoku'],['PRF-004','宮城県','Miyagi','tohoku'],['PRF-005','秋田県','Akita','tohoku'],['PRF-006','山形県','Yamagata','tohoku'],['PRF-007','福島県','Fukushima','tohoku'],
 ['PRF-008','茨城県','Ibaraki','kanto'],['PRF-009','栃木県','Tochigi','kanto'],['PRF-010','群馬県','Gunma','kanto'],['PRF-011','埼玉県','Saitama','kanto'],['PRF-012','千葉県','Chiba','kanto'],['PRF-013','東京都','Tokyo','kanto'],['PRF-014','神奈川県','Kanagawa','kanto'],
 ['PRF-015','新潟県','Niigata','chubu'],['PRF-016','富山県','Toyama','chubu'],['PRF-017','石川県','Ishikawa','chubu'],['PRF-018','福井県','Fukui','chubu'],['PRF-019','山梨県','Yamanashi','chubu'],['PRF-020','長野県','Nagano','chubu'],['PRF-021','岐阜県','Gifu','chubu'],['PRF-022','静岡県','Shizuoka','chubu'],['PRF-023','愛知県','Aichi','chubu'],
 ['PRF-024','三重県','Mie','kinki'],['PRF-025','滋賀県','Shiga','kinki'],['PRF-026','京都府','Kyoto','kinki'],['PRF-027','大阪府','Osaka','kinki'],['PRF-028','兵庫県','Hyogo','kinki'],['PRF-029','奈良県','Nara','kinki'],['PRF-030','和歌山県','Wakayama','kinki'],
 ['PRF-031','鳥取県','Tottori','chugoku'],['PRF-032','島根県','Shimane','chugoku'],['PRF-033','岡山県','Okayama','chugoku'],['PRF-034','広島県','Hiroshima','chugoku'],['PRF-035','山口県','Yamaguchi','chugoku'],
 ['PRF-036','徳島県','Tokushima','shikoku'],['PRF-037','香川県','Kagawa','shikoku'],['PRF-038','愛媛県','Ehime','shikoku'],['PRF-039','高知県','Kochi','shikoku'],
 ['PRF-040','福岡県','Fukuoka','kyushu'],['PRF-041','佐賀県','Saga','kyushu'],['PRF-042','長崎県','Nagasaki','kyushu'],['PRF-043','熊本県','Kumamoto','kyushu'],['PRF-044','大分県','Oita','kyushu'],['PRF-045','宮崎県','Miyazaki','kyushu'],['PRF-046','鹿児島県','Kagoshima','kyushu'],['PRF-047','沖縄県','Okinawa','kyushu'],
] as const;

export const REGION_NAMES: Record<string,[string,string]> = {
 hokkaido:['北海道','Hokkaido'],tohoku:['東北地方','Tohoku'],chubu:['中部地方','Chubu'],
 kinki:['近畿地方','Kinki'],chugoku:['中国地方','Chugoku'],shikoku:['四国地方','Shikoku'],kyushu:['九州・沖縄地方','Kyushu & Okinawa'],
};
