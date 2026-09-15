/*
 * Vietnamese review master for the complete N5 course.
 *
 * Curriculum order follows Minna no Nihongo Shokyu I (lessons 1-25).
 * Explanations, examples, practice prompts, kaiwa and listening situations are
 * original app content.  They are deliberately not copied from the textbook.
 */

const words = (rows) => rows.map((row) => {
  const [japanese, reading, romaji, meaningVi] = row.split('|');
  return { japanese, reading, romaji, meaningVi };
});

const point = (pattern, explanationVi, japanese, reading, translationVi) => ({
  pattern,
  explanationVi,
  example: { japanese, reading, translationVi },
});

const lesson = (number, titleVi, objectiveVi, vocabularyRows, grammar, practiceVi, kaiwaVi, listeningVi) => ({
  number,
  sourceAnchor: `Minna no Nihongo I - Bài ${number}`,
  titleVi,
  objectiveVi,
  vocabulary: words(vocabularyRows),
  grammar,
  practiceVi,
  kaiwaVi,
  listeningVi,
});

const lessons = [
  lesson(1, 'Chào hỏi và giới thiệu bản thân', 'Giới thiệu tên, quốc tịch, nghề nghiệp, cơ quan và tuổi bằng câu danh từ lịch sự.', [
    '私|わたし|watashi|tôi', '私たち|わたしたち|watashitachi|chúng tôi, chúng ta', 'あなた|あなた|anata|bạn, anh, chị',
    'あの人|あのひと|ano hito|người kia', 'あの方|あのかた|ano kata|vị kia (lịch sự)', '皆さん|みなさん|minasan|mọi người, quý vị',
    '先生|せんせい|sensei|thầy, cô; người có chuyên môn', '教師|きょうし|kyoushi|giáo viên (nghề nghiệp)', '学生|がくせい|gakusei|học sinh, sinh viên',
    '会社員|かいしゃいん|kaishain|nhân viên công ty', '社員|しゃいん|shain|nhân viên của một công ty', '銀行員|ぎんこういん|ginkouin|nhân viên ngân hàng',
    '医者|いしゃ|isha|bác sĩ', '研究者|けんきゅうしゃ|kenkyuusha|nhà nghiên cứu', 'エンジニア|エンジニア|enjinia|kỹ sư',
    '大学|だいがく|daigaku|trường đại học', '病院|びょういん|byouin|bệnh viện', '電気|でんき|denki|điện',
    '誰|だれ|dare|ai', 'どなた|どなた|donata|vị nào, ai (lịch sự)', '何歳|なんさい|nansai|bao nhiêu tuổi',
    'おいくつ|おいくつ|oikutsu|bao nhiêu tuổi (lịch sự)', 'はい|はい|hai|vâng, dạ', 'いいえ|いいえ|iie|không',
    '初めまして|はじめまして|hajimemashite|rất hân hạnh được gặp', '失礼ですが|しつれいですが|shitsurei desu ga|xin lỗi, cho phép tôi hỏi',
    'お名前は|おなまえは|onamae wa|tên anh/chị là gì', 'よろしくお願いします|よろしくおねがいします|yoroshiku onegaishimasu|mong được giúp đỡ',
  ], [
    point('N1 は N2 です', 'Dùng は để nêu chủ đề; です xác nhận danh tính hoặc thuộc tính một cách lịch sự.', '私は会社員です。', 'わたしは かいしゃいんです。', 'Tôi là nhân viên công ty.'),
    point('N1 は N2 ではありません', 'Đổi です thành ではありません để phủ định lịch sự.', '木村さんは医者ではありません。', 'きむらさんは いしゃでは ありません。', 'Anh Kimura không phải là bác sĩ.'),
    point('S か', 'Đặt か cuối câu để tạo câu hỏi; thường trả lời bằng はい hoặc いいえ.', '学生ですか。', 'がくせいですか。', 'Bạn là sinh viên phải không?'),
    point('N も', 'も thay cho は khi muốn diễn đạt “cũng”.', 'リンさんも研究者です。', 'リンさんも けんきゅうしゃです。', 'Chị Linh cũng là nhà nghiên cứu.'),
    point('N1 の N2', 'の nối cơ quan hoặc nhóm với người thuộc cơ quan, nhóm đó.', '私はさくら大学の教師です。', 'わたしは さくらだいがくの きょうしです。', 'Tôi là giáo viên của Đại học Sakura.'),
  ], ['Ghép thẻ tên–quốc gia–nghề nghiệp thành 8 câu.', 'Nghe 6 lượt giới thiệu và điền hồ sơ.', 'Thu âm phần tự giới thiệu 4 câu.'],
  ['A: はじめまして。ミンです。', 'B: はじめまして。日本語学校の佐藤です。', 'A: ベトナムから来ました。よろしくお願いします。', 'B: こちらこそ、よろしくお願いします。'],
  'Ba người lần lượt giới thiệu tên, quốc gia và nghề. Người học chọn đúng thẻ hồ sơ cho từng người.'),

  lesson(2, 'Đồ vật và quyền sở hữu', 'Chỉ đồ vật theo khoảng cách, hỏi tên, loại và chủ sở hữu của đồ vật.', [
    'これ|これ|kore|cái này', 'それ|それ|sore|cái đó', 'あれ|あれ|are|cái kia', 'この|この|kono|… này', 'その|その|sono|… đó', 'あの|あの|ano|… kia',
    '本|ほん|hon|sách', '辞書|じしょ|jisho|từ điển', '雑誌|ざっし|zasshi|tạp chí', '新聞|しんぶん|shinbun|báo', 'ノート|ノート|nooto|vở',
    '手帳|てちょう|techou|sổ tay', '名刺|めいし|meishi|danh thiếp', 'カード|カード|kaado|thẻ', '鉛筆|えんぴつ|enpitsu|bút chì',
    'ボールペン|ボールペン|boorupen|bút bi', 'シャープペンシル|シャープペンシル|shaapupenshiru|bút chì kim', '鍵|かぎ|kagi|chìa khóa',
    '時計|とけい|tokei|đồng hồ', '傘|かさ|kasa|ô, dù', '鞄|かばん|kaban|túi, cặp', 'テレビ|テレビ|terebi|tivi',
    'ラジオ|ラジオ|rajio|đài radio', 'カメラ|カメラ|kamera|máy ảnh', 'コンピューター|コンピューター|konpyuutaa|máy tính',
    '車|くるま|kuruma|ô tô', '机|つくえ|tsukue|bàn', '椅子|いす|isu|ghế', 'お土産|おみやげ|omiyage|quà lưu niệm',
    '英語|えいご|eigo|tiếng Anh', '日本語|にほんご|nihongo|tiếng Nhật', '何|なん|nan|cái gì', 'そう|そう|sou|như vậy',
  ], [
    point('これ・それ・あれ', 'これ ở gần người nói, それ gần người nghe, あれ xa cả hai.', 'それは何ですか。', 'それは なんですか。', 'Cái đó là gì?'),
    point('この・その・あの + N', 'Ba từ này luôn đứng trước danh từ, không dùng độc lập.', 'あの鞄は私のです。', 'あの かばんは わたしのです。', 'Chiếc cặp kia là của tôi.'),
    point('N1 の N2', 'の biểu thị nội dung, loại, xuất xứ hoặc sở hữu.', 'これは日本語の辞書です。', 'これは にほんごの じしょです。', 'Đây là từ điển tiếng Nhật.'),
    point('そうです／違います', 'Dùng để xác nhận hoặc sửa lại điều người kia vừa hỏi.', 'いいえ、違います。', 'いいえ、ちがいます。', 'Không, không phải.'),
  ], ['Phân loại 15 đồ vật vào これ・それ・あれ.', 'Hỏi và tìm chủ nhân của 6 món đồ thất lạc.', 'Đọc tên vật rồi chọn đúng ảnh trong 3 giây.'],
  ['A: これはリーさんの傘ですか。', 'B: いいえ、私のではありません。', 'A: では、あの傘ですか。', 'B: はい、そうです。ありがとうございます。'],
  'Tại quầy đồ thất lạc, hai người hỏi về ba đồ vật. Chọn món đúng và chủ sở hữu đúng.'),

  lesson(3, 'Địa điểm, tầng và mua sắm', 'Hỏi vị trí người, đồ vật, quầy hàng; hỏi xuất xứ và giá.', [
    'ここ|ここ|koko|ở đây', 'そこ|そこ|soko|ở đó', 'あそこ|あそこ|asoko|ở đằng kia', 'どこ|どこ|doko|ở đâu',
    'こちら|こちら|kochira|phía này (lịch sự)', 'そちら|そちら|sochira|phía đó (lịch sự)', 'あちら|あちら|achira|phía kia (lịch sự)', 'どちら|どちら|dochira|phía nào (lịch sự)',
    '教室|きょうしつ|kyoushitsu|phòng học', '食堂|しょくどう|shokudou|nhà ăn', '事務所|じむしょ|jimusho|văn phòng', '会議室|かいぎしつ|kaigishitsu|phòng họp',
    '受付|うけつけ|uketsuke|quầy lễ tân', 'ロビー|ロビー|robii|sảnh', '部屋|へや|heya|phòng', 'トイレ|トイレ|toire|nhà vệ sinh',
    '階段|かいだん|kaidan|cầu thang', 'エレベーター|エレベーター|erebeetaa|thang máy', 'エスカレーター|エスカレーター|esukareetaa|thang cuốn',
    '国|くに|kuni|đất nước', '会社|かいしゃ|kaisha|công ty', '家|うち|uchi|nhà', '電話|でんわ|denwa|điện thoại',
    '靴|くつ|kutsu|giày', 'ネクタイ|ネクタイ|nekutai|cà vạt', 'ワイン|ワイン|wain|rượu vang', '売り場|うりば|uriba|quầy bán hàng',
    '地下|ちか|chika|tầng hầm', '何階|なんがい|nangai|tầng mấy', '円|えん|en|yên', 'いくら|いくら|ikura|bao nhiêu tiền',
  ], [
    point('ここ／そこ／あそこ は N です', 'Dùng đại từ địa điểm làm chủ đề rồi nêu tên nơi.', 'ここは受付です。', 'ここは うけつけです。', 'Đây là quầy lễ tân.'),
    point('N は どこですか', 'Dùng どこ để hỏi vị trí; どちら lịch sự hơn.', '会議室はどこですか。', 'かいぎしつは どこですか。', 'Phòng họp ở đâu?'),
    point('N は place です', 'Đưa đối tượng lên chủ đề rồi nêu nơi nó ở.', '靴売り場は二階です。', 'くつうりばは にかいです。', 'Quầy giày ở tầng hai.'),
    point('どこの N／いくら', 'どこの hỏi nước hoặc hãng; いくら hỏi giá.', 'この時計はいくらですか。', 'この とけいは いくらですか。', 'Chiếc đồng hồ này giá bao nhiêu?'),
  ], ['Dùng sơ đồ trung tâm thương mại để trả lời 10 câu vị trí.', 'Nghe giá và kéo nhãn đúng vào 8 sản phẩm.', 'Đóng vai khách–nhân viên bán hàng.'],
  ['A: すみません。かばん売り場はどこですか。', 'B: 三階です。エスカレーターの右です。', 'A: このかばんはいくらですか。', 'B: 六千八百円です。'],
  'Nghe thông báo tầng và giá của bốn món hàng, sau đó điền bản đồ mua sắm.'),

  lesson(4, 'Giờ giấc và sinh hoạt hằng ngày', 'Nói giờ, ngày, lịch làm việc và chia động từ lịch sự ở hiện tại, quá khứ.', [
    '起きます|おきます|okimasu|thức dậy', '寝ます|ねます|nemasu|ngủ', '働きます|はたらきます|hatarakimasu|làm việc', '休みます|やすみます|yasumimasu|nghỉ',
    '勉強します|べんきょうします|benkyou shimasu|học', '終わります|おわります|owarimasu|kết thúc', 'デパート|デパート|depaato|bách hóa',
    '銀行|ぎんこう|ginkou|ngân hàng', '郵便局|ゆうびんきょく|yuubinkyoku|bưu điện', '図書館|としょかん|toshokan|thư viện', '美術館|びじゅつかん|bijutsukan|bảo tàng mỹ thuật',
    '今|いま|ima|bây giờ', '時|じ|ji|giờ', '分|ふん|fun|phút', '半|はん|han|rưỡi', '何時|なんじ|nanji|mấy giờ', '何分|なんぷん|nanpun|mấy phút',
    '午前|ごぜん|gozen|buổi sáng, AM', '午後|ごご|gogo|buổi chiều, PM', '朝|あさ|asa|buổi sáng', '昼|ひる|hiru|buổi trưa', '晩|ばん|ban|buổi tối',
    '一昨日|おととい|ototoi|hôm kia', '昨日|きのう|kinou|hôm qua', '今日|きょう|kyou|hôm nay', '明日|あした|ashita|ngày mai', '明後日|あさって|asatte|ngày kia',
    '今朝|けさ|kesa|sáng nay', '今晩|こんばん|konban|tối nay', '休み|やすみ|yasumi|ngày nghỉ', '昼休み|ひるやすみ|hiruyasumi|giờ nghỉ trưa',
    '毎朝|まいあさ|maiasa|mỗi sáng', '毎晩|まいばん|maiban|mỗi tối', '毎日|まいにち|mainichi|mỗi ngày', '月曜日|げつようび|getsuyoubi|thứ hai',
    '何曜日|なんようび|nanyoubi|thứ mấy', '番号|ばんごう|bangou|số hiệu', '何番|なんばん|nanban|số mấy',
  ], [
    point('今、～時～分です', 'Giờ dùng ～時, phút dùng ～分; 半 diễn đạt 30 phút.', '今、七時十五分です。', 'いま、しちじ じゅうごふんです。', 'Bây giờ là 7 giờ 15 phút.'),
    point('Vます／Vません', 'Hai dạng lịch sự dùng cho hiện tại và tương lai.', '日曜日は働きません。', 'にちようびは はたらきません。', 'Chủ nhật tôi không làm việc.'),
    point('Vました／Vませんでした', 'Dùng để khẳng định hoặc phủ định hành động quá khứ.', '昨日、勉強しました。', 'きのう、べんきょうしました。', 'Hôm qua tôi đã học.'),
    point('time に V', 'に đánh dấu thời điểm cụ thể; thường không đi với 今日, 毎日.', '六時半に起きます。', 'ろくじはんに おきます。', 'Tôi thức dậy lúc 6 giờ rưỡi.'),
    point('～から～まで', 'から là điểm bắt đầu, まで là điểm kết thúc.', '図書館は九時から六時までです。', 'としょかんは くじから ろくじまでです。', 'Thư viện mở từ 9 giờ đến 6 giờ.'),
  ], ['Xếp 10 hoạt động vào dòng thời gian một ngày.', 'Đổi 12 động từ sang bốn dạng lịch sự.', 'Gọi điện hỏi giờ làm việc của một địa điểm.'],
  ['A: 図書館は何時からですか。', 'B: 午前九時からです。', 'A: 何時までですか。', 'B: 午後七時までです。月曜日は休みです。'],
  'Nghe lịch mở cửa của thư viện, ngân hàng và bảo tàng; chọn ngày và giờ có thể đến.'),

  lesson(5, 'Đi lại, ngày tháng và phương tiện', 'Nói đi, đến, về đâu; thời gian, phương tiện và người đi cùng.', [
    '行きます|いきます|ikimasu|đi', '来ます|きます|kimasu|đến', '帰ります|かえります|kaerimasu|về', '学校|がっこう|gakkou|trường học',
    'スーパー|スーパー|suupaa|siêu thị', '駅|えき|eki|nhà ga', '飛行機|ひこうき|hikouki|máy bay', '船|ふね|fune|tàu thủy',
    '電車|でんしゃ|densha|tàu điện', '地下鉄|ちかてつ|chikatetsu|tàu điện ngầm', '新幹線|しんかんせん|shinkansen|tàu cao tốc', 'バス|バス|basu|xe buýt',
    'タクシー|タクシー|takushii|taxi', '自転車|じてんしゃ|jitensha|xe đạp', '歩いて|あるいて|aruite|đi bộ', '人|ひと|hito|người',
    '友達|ともだち|tomodachi|bạn', '彼|かれ|kare|anh ấy, bạn trai', '彼女|かのじょ|kanojo|cô ấy, bạn gái', '家族|かぞく|kazoku|gia đình',
    '一人で|ひとりで|hitori de|một mình', '先週|せんしゅう|senshuu|tuần trước', '今週|こんしゅう|konshuu|tuần này', '来週|らいしゅう|raishuu|tuần sau',
    '先月|せんげつ|sengetsu|tháng trước', '今月|こんげつ|kongetsu|tháng này', '来月|らいげつ|raigetsu|tháng sau', '去年|きょねん|kyonen|năm ngoái',
    '今年|ことし|kotoshi|năm nay', '来年|らいねん|rainen|năm sau', '何月|なんがつ|nangatsu|tháng mấy', '何日|なんにち|nannichi|ngày mấy, mấy ngày',
    'いつ|いつ|itsu|khi nào', '誕生日|たんじょうび|tanjoubi|sinh nhật', '普通|ふつう|futsuu|tàu thường', '急行|きゅうこう|kyuukou|tàu tốc hành',
  ], [
    point('place へ 行きます／来ます／帰ります', 'へ đánh dấu hướng hoặc đích của chuyển động; に cũng có thể dùng.', '来月、京都へ行きます。', 'らいげつ、きょうとへ いきます。', 'Tháng sau tôi sẽ đi Kyoto.'),
    point('vehicle で V', 'で đánh dấu phương tiện; đi bộ dùng 歩いて, không dùng で.', '駅まで自転車で行きます。', 'えきまで じてんしゃで いきます。', 'Tôi đi xe đạp đến ga.'),
    point('person と V', 'と đánh dấu người cùng thực hiện hành động; 一人で là một mình.', '友達と日本へ来ました。', 'ともだちと にほんへ きました。', 'Tôi đã đến Nhật cùng bạn.'),
    point('いつ／何月何日', 'Dùng để hỏi thời điểm, tháng và ngày.', '誕生日は何月何日ですか。', 'たんじょうびは なんがつ なんにちですか。', 'Sinh nhật bạn là ngày tháng nào?'),
  ], ['Lập hành trình gồm ngày, điểm đến và phương tiện.', 'Nghe 8 vé rồi chọn đúng người đi cùng.', 'Hỏi–đáp sinh nhật và kế hoạch tuần sau.'],
  ['A: 土曜日、どこへ行きますか。', 'B: 家族と箱根へ行きます。', 'A: 何で行きますか。', 'B: 電車で行きます。'],
  'Nghe bốn kế hoạch cuối tuần, điền ai–đi đâu–bằng gì–với ai.'),

  lesson(6, 'Hành động thường ngày và lời mời', 'Diễn đạt ăn, uống, xem, đọc, làm ở đâu; mời và cùng làm.', [
    '食べます|たべます|tabemasu|ăn', '飲みます|のみます|nomimasu|uống', '吸います|すいます|suimasu|hút', '見ます|みます|mimasu|xem, nhìn',
    '聞きます|ききます|kikimasu|nghe', '読みます|よみます|yomimasu|đọc', '書きます|かきます|kakimasu|viết', '買います|かいます|kaimasu|mua',
    '撮ります|とります|torimasu|chụp', 'します|します|shimasu|làm', '会います|あいます|aimasu|gặp', 'ご飯|ごはん|gohan|cơm, bữa ăn',
    '朝ご飯|あさごはん|asagohan|bữa sáng', '昼ご飯|ひるごはん|hirugohan|bữa trưa', '晩ご飯|ばんごはん|bangohan|bữa tối', 'パン|パン|pan|bánh mì',
    '卵|たまご|tamago|trứng', '肉|にく|niku|thịt', '魚|さかな|sakana|cá', '野菜|やさい|yasai|rau', '果物|くだもの|kudamono|trái cây',
    '水|みず|mizu|nước', 'お茶|おちゃ|ocha|trà', '紅茶|こうちゃ|koucha|hồng trà', '牛乳|ぎゅうにゅう|gyuunyuu|sữa', 'ジュース|ジュース|juusu|nước trái cây',
    'ビール|ビール|biiru|bia', 'お酒|おさけ|osake|rượu', 'たばこ|たばこ|tabako|thuốc lá', '手紙|てがみ|tegami|thư',
    'レポート|レポート|repooto|báo cáo', '写真|しゃしん|shashin|ảnh', '店|みせ|mise|cửa hàng', '庭|にわ|niwa|vườn',
    '宿題|しゅくだい|shukudai|bài tập về nhà', 'テニス|テニス|tenisu|quần vợt', 'サッカー|サッカー|sakkaa|bóng đá', 'お花見|おはなみ|ohanami|ngắm hoa',
  ], [
    point('N を V', 'を đánh dấu đối tượng trực tiếp của hành động.', '毎朝、牛乳を飲みます。', 'まいあさ、ぎゅうにゅうを のみます。', 'Mỗi sáng tôi uống sữa.'),
    point('place で V', 'で đánh dấu nơi hành động diễn ra.', '図書館で本を読みます。', 'としょかんで ほんを よみます。', 'Tôi đọc sách ở thư viện.'),
    point('Vませんか', 'Dùng để mời người khác làm cùng một cách lịch sự.', '一緒に昼ご飯を食べませんか。', 'いっしょに ひるごはんを たべませんか。', 'Bạn ăn trưa cùng tôi nhé?'),
    point('Vましょう', 'Dùng để đồng ý hoặc đề nghị cùng làm.', '駅で会いましょう。', 'えきで あいましょう。', 'Chúng ta gặp nhau ở ga nhé.'),
  ], ['Chọn đúng trợ từ を hoặc で trong 12 câu.', 'Lập thực đơn và mô tả bữa sáng.', 'Mời bạn đi xem phim rồi thống nhất giờ và nơi gặp.'],
  ['A: 日曜日、一緒に映画を見ませんか。', 'B: いいですね。どこで見ますか。', 'A: 駅前の映画館で見ましょう。', 'B: では、二時に駅で会いましょう。'],
  'Nghe ba lời mời; xác định hoạt động, địa điểm, giờ và câu trả lời.'),

  lesson(7, 'Công cụ, ngôn ngữ và cho–nhận', 'Nói làm bằng công cụ/ngôn ngữ; trao và nhận đồ vật, thông tin.', [
    '切ります|きります|kirimasu|cắt', '送ります|おくります|okurimasu|gửi', 'あげます|あげます|agemasu|cho, tặng', 'もらいます|もらいます|moraimasu|nhận',
    '貸します|かします|kashimasu|cho mượn', '借ります|かります|karimasu|mượn', '教えます|おしえます|oshiemasu|dạy, cho biết', '習います|ならいます|naraimasu|học từ ai',
    'かけます|かけます|kakemasu|gọi điện', '手|て|te|tay', '箸|はし|hashi|đũa', 'スプーン|スプーン|supuun|thìa', 'ナイフ|ナイフ|naifu|dao',
    'フォーク|フォーク|fooku|nĩa', 'はさみ|はさみ|hasami|kéo', 'ファクス|ファクス|fakusu|fax', 'ワープロ|ワープロ|waapuro|máy xử lý văn bản',
    'パソコン|パソコン|pasokon|máy tính cá nhân', 'パンチ|パンチ|panchi|dụng cụ bấm lỗ', 'ホッチキス|ホッチキス|hotchikisu|dập ghim',
    'セロテープ|セロテープ|seroteepu|băng dính', '消しゴム|けしゴム|keshigomu|tẩy', '紙|かみ|kami|giấy', '花|はな|hana|hoa',
    'シャツ|シャツ|shatsu|áo sơ mi', 'プレゼント|プレゼント|purezento|quà tặng', '荷物|にもつ|nimotsu|hành lý, bưu kiện', 'お金|おかね|okane|tiền',
    '切符|きっぷ|kippu|vé', 'クリスマス|クリスマス|kurisumasu|Giáng sinh', '父|ちち|chichi|bố tôi', '母|はは|haha|mẹ tôi',
    'お父さん|おとうさん|otousan|bố của người khác', 'お母さん|おかあさん|okaasan|mẹ của người khác', 'もう|もう|mou|đã, rồi', 'まだ|まだ|mada|chưa',
  ], [
    point('tool／language で V', 'で đánh dấu công cụ, phương tiện hoặc ngôn ngữ dùng để làm.', 'はさみで紙を切ります。', 'はさみで かみを きります。', 'Tôi cắt giấy bằng kéo.'),
    point('「word」は language で何ですか', 'Dùng để hỏi một từ được nói thế nào trong ngôn ngữ khác.', '「ありがとう」は英語で何ですか。', '「ありがとう」は えいごで なんですか。', '“Arigatou” trong tiếng Anh là gì?'),
    point('A は B に N をあげます', 'A trao vật cho B; người nhận đi với に.', '私は妹に本をあげました。', 'わたしは いもうとに ほんを あげました。', 'Tôi đã tặng em gái một cuốn sách.'),
    point('A は B に／から N をもらいます', 'A nhận vật từ B; nguồn cho đi với に hoặc から.', '先生に辞書をもらいました。', 'せんせいに じしょを もらいました。', 'Tôi đã nhận từ điển từ giáo viên.'),
    point('もう Vました', 'もう + quá khứ hỏi hoặc xác nhận việc đã hoàn tất; phủ định dùng まだです.', 'もう宿題を送りました。', 'もう しゅくだいを おくりました。', 'Tôi đã gửi bài tập rồi.'),
  ], ['Chọn công cụ phù hợp để hoàn thành 8 hành động.', 'Vẽ sơ đồ mũi tên cho–nhận.', 'Gọi điện xin số điện thoại và xác nhận đã ghi.'],
  ['A: その花はきれいですね。', 'B: ありがとうございます。友達にもらいました。', 'A: 誕生日のプレゼントですか。', 'B: はい。私は友達にケーキをあげました。'],
  'Nghe bốn tình huống trao quà và xác định ai cho ai vật gì.'),

  lesson(8, 'Tính từ và mô tả', 'Mô tả người, vật, nơi chốn bằng tính từ い/な và mức độ.', [
    'ハンサム|ハンサム|hansamu|đẹp trai', '綺麗|きれい|kirei|đẹp, sạch', '静か|しずか|shizuka|yên tĩnh', '賑やか|にぎやか|nigiyaka|nhộn nhịp',
    '有名|ゆうめい|yuumei|nổi tiếng', '親切|しんせつ|shinsetsu|tốt bụng', '元気|げんき|genki|khỏe, năng động', '暇|ひま|hima|rảnh',
    '便利|べんり|benri|tiện lợi', '素敵|すてき|suteki|tuyệt, đẹp', '大きい|おおきい|ookii|to', '小さい|ちいさい|chiisai|nhỏ',
    '新しい|あたらしい|atarashii|mới', '古い|ふるい|furui|cũ', 'いい|いい|ii|tốt', '悪い|わるい|warui|xấu, tệ',
    '暑い|あつい|atsui|nóng (thời tiết)', '寒い|さむい|samui|lạnh (thời tiết)', '冷たい|つめたい|tsumetai|lạnh (đồ vật)', '難しい|むずかしい|muzukashii|khó',
    '易しい|やさしい|yasashii|dễ', '高い|たかい|takai|cao, đắt', '安い|やすい|yasui|rẻ', '低い|ひくい|hikui|thấp',
    '面白い|おもしろい|omoshiroi|thú vị', '美味しい|おいしい|oishii|ngon', '忙しい|いそがしい|isogashii|bận', '楽しい|たのしい|tanoshii|vui',
    '白い|しろい|shiroi|trắng', '黒い|くろい|kuroi|đen', '赤い|あかい|akai|đỏ', '青い|あおい|aoi|xanh',
    '桜|さくら|sakura|hoa anh đào', '山|やま|yama|núi', '町|まち|machi|thị trấn', '食べ物|たべもの|tabemono|đồ ăn',
    '所|ところ|tokoro|nơi, chỗ', '寮|りょう|ryou|ký túc xá', '生活|せいかつ|seikatsu|cuộc sống', '仕事|しごと|shigoto|công việc',
  ], [
    point('N は い-adj です', 'Tính từ い đứng trước です; khi bổ nghĩa danh từ giữ nguyên い.', 'この本は面白いです。', 'この ほんは おもしろいです。', 'Cuốn sách này thú vị.'),
    point('N は な-adj です', 'Tính từ な không có な trước です, nhưng cần な khi đứng trước danh từ.', 'ここは静かな町です。', 'ここは しずかな まちです。', 'Đây là một thị trấn yên tĩnh.'),
    point('い-adj くないです', 'Bỏ い và thêm くないです để phủ định; いい đổi thành よくないです.', '今日は寒くないです。', 'きょうは さむくないです。', 'Hôm nay không lạnh.'),
    point('な-adj ではありません', 'Thêm ではありません sau tính từ な để phủ định lịch sự.', 'この店は賑やかではありません。', 'この みせは にぎやかでは ありません。', 'Cửa hàng này không nhộn nhịp.'),
    point('とても／あまり', 'とても đi với khẳng định “rất”; あまり đi với phủ định “không…lắm”.', 'この料理はとても美味しいです。', 'この りょうりは とても おいしいです。', 'Món này rất ngon.'),
  ], ['Phân loại tính từ い và な.', 'Mô tả hai thành phố bằng 6 đặc điểm.', 'Chọn đánh giá phù hợp cho nhà hàng và khách sạn.'],
  ['A: 新しい寮はどうですか。', 'B: きれいで便利です。', 'A: 部屋は広いですか。', 'B: いいえ、あまり広くないです。'],
  'Nghe ba người đánh giá nơi ở; chọn đặc điểm tích cực và tiêu cực.'),

  lesson(9, 'Sở thích, năng lực và lý do', 'Nói thích/ghét, giỏi/kém, hiểu và có; nối nguyên nhân bằng から.', [
    '分かります|わかります|wakarimasu|hiểu', 'あります|あります|arimasu|có', '好き|すき|suki|thích', '嫌い|きらい|kirai|ghét, không thích',
    '上手|じょうず|jouzu|giỏi', '下手|へた|heta|kém', '料理|りょうり|ryouri|nấu ăn, món ăn', '飲み物|のみもの|nomimono|đồ uống',
    'スポーツ|スポーツ|supootsu|thể thao', '野球|やきゅう|yakyuu|bóng chày', 'ダンス|ダンス|dansu|khiêu vũ', '音楽|おんがく|ongaku|âm nhạc',
    '歌|うた|uta|bài hát', 'クラシック|クラシック|kurashikku|nhạc cổ điển', 'ジャズ|ジャズ|jazu|nhạc jazz', 'コンサート|コンサート|konsaato|buổi hòa nhạc',
    'カラオケ|カラオケ|karaoke|karaoke', '歌舞伎|かぶき|kabuki|kịch Kabuki', '絵|え|e|tranh', '字|じ|ji|chữ', '漢字|かんじ|kanji|chữ Hán',
    '平仮名|ひらがな|hiragana|chữ Hiragana', '片仮名|かたかな|katakana|chữ Katakana', '細かいお金|こまかいおかね|komakai okane|tiền lẻ', 'チケット|チケット|chiketto|vé',
    '時間|じかん|jikan|thời gian', '用事|ようじ|youji|việc bận', '約束|やくそく|yakusoku|cuộc hẹn, lời hứa', 'よく|よく|yoku|rõ, tốt; thường',
    '大体|だいたい|daitai|đại khái', '沢山|たくさん|takusan|nhiều', '少し|すこし|sukoshi|một ít', '全然|ぜんぜん|zenzen|hoàn toàn không',
    '早く|はやく|hayaku|sớm, nhanh', '速く|はやく|hayaku|nhanh (tốc độ)', 'どうして|どうして|doushite|tại sao', '残念|ざんねん|zannen|đáng tiếc',
  ], [
    point('N が好き／嫌いです', 'Đối tượng của 好き・嫌い thường đi với が.', '私はジャズが好きです。', 'わたしは ジャズが すきです。', 'Tôi thích nhạc jazz.'),
    point('N が上手／下手です', 'Nói năng lực được đánh giá; không nên dùng 上手 để tự khen mình.', '妹は料理が上手です。', 'いもうとは りょうりが じょうずです。', 'Em gái tôi nấu ăn giỏi.'),
    point('N が分かります／あります', 'が đánh dấu nội dung hiểu hoặc thứ mình có.', '日本語が少し分かります。', 'にほんごが すこし わかります。', 'Tôi hiểu một chút tiếng Nhật.'),
    point('S1 から、S2', 'から đặt sau nguyên nhân; có thể trả lời câu hỏi どうして.', '用事がありますから、行きません。', 'ようじが ありますから、いきません。', 'Vì có việc nên tôi không đi.'),
  ], ['Tạo hồ sơ sở thích và kỹ năng.', 'Nghe lý do nhận/từ chối 5 lời mời.', 'Nói 4 câu có から để giải thích lựa chọn.'],
  ['A: 今晩、カラオケに行きませんか。', 'B: すみません。今日は約束がありますから。', 'A: そうですか。残念ですね。', 'B: また今度お願いします。'],
  'Nghe bốn cuộc hẹn và xác định người nào đi, người nào từ chối và vì sao.'),

  lesson(10, 'Sự tồn tại và vị trí', 'Dùng あります/います và từ chỉ vị trí để mô tả bản đồ, phòng và người.', [
    'います|います|imasu|có, ở (người/động vật)', 'あります|あります|arimasu|có, ở (đồ vật)', '色々|いろいろ|iroiro|nhiều loại', '男の人|おとこのひと|otoko no hito|người đàn ông',
    '女の人|おんなのひと|onna no hito|người phụ nữ', '男の子|おとこのこ|otoko no ko|bé trai', '女の子|おんなのこ|onna no ko|bé gái', '犬|いぬ|inu|chó',
    '猫|ねこ|neko|mèo', '木|き|ki|cây', '物|もの|mono|đồ vật', 'フィルム|フィルム|firumu|phim chụp ảnh', '電池|でんち|denchi|pin',
    '箱|はこ|hako|hộp', 'スイッチ|スイッチ|suicchi|công tắc', '冷蔵庫|れいぞうこ|reizouko|tủ lạnh', 'テーブル|テーブル|teeburu|bàn',
    'ベッド|ベッド|beddo|giường', '棚|たな|tana|giá, kệ', 'ドア|ドア|doa|cửa', '窓|まど|mado|cửa sổ', 'ポスト|ポスト|posuto|hòm thư',
    'ビル|ビル|biru|tòa nhà', '公園|こうえん|kouen|công viên', '喫茶店|きっさてん|kissaten|quán cà phê', '本屋|ほんや|honya|hiệu sách',
    '乗り場|のりば|noriba|bến, chỗ lên xe', '県|けん|ken|tỉnh', '上|うえ|ue|trên', '下|した|shita|dưới', '前|まえ|mae|trước',
    '後ろ|うしろ|ushiro|sau', '右|みぎ|migi|phải', '左|ひだり|hidari|trái', '中|なか|naka|trong', '外|そと|soto|ngoài',
    '隣|となり|tonari|kế bên', '近く|ちかく|chikaku|gần', '間|あいだ|aida|giữa', '奥|おく|oku|phía trong cùng',
  ], [
    point('place に N がいます', 'います dùng cho người và động vật tồn tại ở một nơi.', '公園に子供がいます。', 'こうえんに こどもが います。', 'Có trẻ em ở công viên.'),
    point('place に N があります', 'あります dùng cho đồ vật, thực vật và sự kiện.', '机の上に鍵があります。', 'つくえの うえに かぎが あります。', 'Có chìa khóa trên bàn.'),
    point('N は place にいます／あります', 'Khi đối tượng đã biết là chủ đề, dùng は rồi nêu vị trí.', '先生は事務所にいます。', 'せんせいは じむしょに います。', 'Giáo viên ở văn phòng.'),
    point('N1 の position に N2', 'Dùng の nối vật mốc với từ vị trí.', '銀行は駅と郵便局の間にあります。', 'ぎんこうは えきと ゆうびんきょくの あいだに あります。', 'Ngân hàng nằm giữa ga và bưu điện.'),
  ], ['Đặt 12 người/vật vào sơ đồ phòng theo câu nghe.', 'Mô tả bản đồ bằng ít nhất 6 từ vị trí.', 'Trò chơi tìm đồ vật trong 60 giây.'],
  ['A: すみません。ATMはどこですか。', 'B: 一階にあります。エレベーターの左です。', 'A: 近くにトイレもありますか。', 'B: はい、ATMの隣にあります。'],
  'Nghe mô tả một tầng nhà và kéo các biểu tượng vào đúng vị trí.'),

  lesson(11, 'Số lượng, bộ đếm và khoảng thời gian', 'Đếm người/vật, nói thời lượng, tần suất và mất bao lâu.', [
    'います|います|imasu|có (con cái)', 'かかります|かかります|kakarimasu|mất, tốn', '休みます|やすみます|yasumimasu|nghỉ', '一つ|ひとつ|hitotsu|một cái',
    '二つ|ふたつ|futatsu|hai cái', '三つ|みっつ|mittsu|ba cái', '四つ|よっつ|yottsu|bốn cái', '五つ|いつつ|itsutsu|năm cái',
    '六つ|むっつ|muttsu|sáu cái', '七つ|ななつ|nanatsu|bảy cái', '八つ|やっつ|yattsu|tám cái', '九つ|ここのつ|kokonotsu|chín cái',
    '十|とお|too|mười cái', '幾つ|いくつ|ikutsu|bao nhiêu cái', '一人|ひとり|hitori|một người', '二人|ふたり|futari|hai người',
    '人|にん|nin|người (bộ đếm)', '台|だい|dai|máy, xe', '枚|まい|mai|vật mỏng', '回|かい|kai|lần',
    'りんご|りんご|ringo|táo', '蜜柑|みかん|mikan|quýt', 'サンドイッチ|サンドイッチ|sandoicchi|bánh sandwich', 'カレー|カレー|karee|cà ri',
    'アイスクリーム|アイスクリーム|aisukuriimu|kem', '切手|きって|kitte|tem', '葉書|はがき|hagaki|bưu thiếp', '封筒|ふうとう|fuutou|phong bì',
    '両親|りょうしん|ryoushin|bố mẹ', '兄弟|きょうだい|kyoudai|anh chị em', '兄|あに|ani|anh trai tôi', '姉|あね|ane|chị gái tôi',
    '弟|おとうと|otouto|em trai', '妹|いもうと|imouto|em gái', '外国|がいこく|gaikoku|nước ngoài', '留学生|りゅうがくせい|ryuugakusei|du học sinh',
    '時間|じかん|jikan|tiếng, giờ', '週間|しゅうかん|shuukan|tuần', 'か月|かげつ|kagetsu|tháng', '年|ねん|nen|năm',
    'ぐらい|ぐらい|gurai|khoảng', 'どのくらい|どのくらい|dono kurai|bao lâu, khoảng bao nhiêu', '全部で|ぜんぶで|zenbu de|tổng cộng', '皆|みんな|minna|tất cả mọi người',
    'だけ|だけ|dake|chỉ',
  ], [
    point('quantity + counter', 'Số lượng thường đứng sau tân ngữ, trước động từ.', 'りんごを三つ買いました。', 'りんごを みっつ かいました。', 'Tôi đã mua ba quả táo.'),
    point('period + V', 'Khoảng thời gian không dùng に.', '日本語を二年間勉強します。', 'にほんごを にねんかん べんきょうします。', 'Tôi học tiếng Nhật trong hai năm.'),
    point('period に frequency V', 'Dùng に để nói số lần trong một khoảng thời gian.', '一週間に二回泳ぎます。', 'いっしゅうかんに にかい およぎます。', 'Tôi bơi hai lần một tuần.'),
    point('どのくらい／～ぐらい', 'Hỏi và trả lời thời lượng hoặc lượng ước chừng.', '駅までどのくらいかかりますか。', 'えきまで どのくらい かかりますか。', 'Đến ga mất khoảng bao lâu?'),
  ], ['Chọn bộ đếm đúng cho 20 đồ vật.', 'Tính tổng tiền và số lượng trong giỏ hàng.', 'Hỏi thời gian đi lại và tần suất hoạt động.'],
  ['A: ご家族は何人ですか。', 'B: 五人です。両親と兄と妹がいます。', 'A: 日本にどのくらいいますか。', 'B: 一年ぐらいいます。'],
  'Nghe bốn người nói gia đình, thời gian ở Nhật và tần suất học; điền bảng số liệu.'),

  lesson(12, 'Quá khứ tính từ và so sánh', 'Nói cảm nhận quá khứ; so sánh hai đối tượng và chọn nhất trong nhóm.', [
    '簡単|かんたん|kantan|đơn giản', '近い|ちかい|chikai|gần', '遠い|とおい|tooi|xa', '速い|はやい|hayai|nhanh', '遅い|おそい|osoi|chậm, muộn',
    '多い|おおい|ooi|nhiều', '少ない|すくない|sukunai|ít', '暖かい|あたたかい|atatakai|ấm', '涼しい|すずしい|suzushii|mát', '甘い|あまい|amai|ngọt',
    '辛い|からい|karai|cay', '重い|おもい|omoi|nặng', '軽い|かるい|karui|nhẹ', 'いい|いい|ii|tốt', '季節|きせつ|kisetsu|mùa',
    '春|はる|haru|mùa xuân', '夏|なつ|natsu|mùa hè', '秋|あき|aki|mùa thu', '冬|ふゆ|fuyu|mùa đông', '天気|てんき|tenki|thời tiết',
    '雨|あめ|ame|mưa', '雪|ゆき|yuki|tuyết', '曇り|くもり|kumori|trời nhiều mây', 'ホテル|ホテル|hoteru|khách sạn', '空港|くうこう|kuukou|sân bay',
    '海|うみ|umi|biển', '世界|せかい|sekai|thế giới', 'パーティー|パーティー|paatii|bữa tiệc', '祭り|まつり|matsuri|lễ hội', '試験|しけん|shiken|kỳ thi',
    'すき焼き|すきやき|sukiyaki|sukiyaki', '刺身|さしみ|sashimi|sashimi', 'お寿司|おすし|osushi|sushi', '天ぷら|てんぷら|tenpura|tempura', '豚肉|ぶたにく|butaniku|thịt lợn',
    '鶏肉|とりにく|toriniku|thịt gà', '牛肉|ぎゅうにく|gyuuniku|thịt bò', 'レモン|レモン|remon|chanh vàng', 'どちら|どちら|dochira|cái nào trong hai', '一番|いちばん|ichiban|nhất',
    'ずっと|ずっと|zutto|hơn hẳn; suốt', '初めて|はじめて|hajimete|lần đầu',
  ], [
    point('N／な-adj でした・ではありませんでした', 'Dùng でした cho quá khứ, ではありませんでした cho phủ định quá khứ.', '昨日は雨でした。', 'きのうは あめでした。', 'Hôm qua trời mưa.'),
    point('い-adj かったです・くなかったです', 'Bỏ い rồi thêm かったです; phủ định là くなかったです.', '旅行は楽しかったです。', 'りょこうは たのしかったです。', 'Chuyến đi đã rất vui.'),
    point('A は B より adj', 'より đánh dấu đối tượng làm mốc so sánh.', '電車はバスより速いです。', 'でんしゃは バスより はやいです。', 'Tàu điện nhanh hơn xe buýt.'),
    point('A と B とどちらが adj', 'Hỏi lựa chọn giữa hai; trả lời bằng ～のほうが.', '夏と冬とどちらが好きですか。', 'なつと ふゆと どちらが すきですか。', 'Bạn thích mùa hè hay mùa đông hơn?'),
    point('N の中で X が一番 adj', 'Nêu đối tượng nổi bật nhất trong một nhóm.', '果物の中でりんごが一番好きです。', 'くだものの なかで りんごが いちばん すきです。', 'Trong các loại quả, tôi thích táo nhất.'),
  ], ['Đổi 10 nhận xét hiện tại sang quá khứ.', 'So sánh phương tiện theo giá và tốc độ.', 'Chọn mùa, món ăn, thành phố yêu thích nhất và giải thích.'],
  ['A: 北海道の旅行はどうでしたか。', 'B: とても楽しかったです。でも寒かったです。', 'A: 東京より寒かったですか。', 'B: はい、ずっと寒かったです。'],
  'Nghe bốn đánh giá chuyến đi và xác định nơi, thời tiết, cảm nhận, so sánh.'),

  lesson(13, 'Mong muốn và mục đích di chuyển', 'Nói muốn có, muốn làm; đi đâu để làm việc gì.', [
    '遊びます|あそびます|asobimasu|chơi', '泳ぎます|およぎます|oyogimasu|bơi', '迎えます|むかえます|mukaemasu|đón', '疲れます|つかれます|tsukaremasu|mệt',
    '出します|だします|dashimasu|gửi, nộp, lấy ra', '入ります|はいります|hairimasu|vào', '出ます|でます|demasu|ra', '結婚します|けっこんします|kekkon shimasu|kết hôn',
    '買い物します|かいものします|kaimono shimasu|mua sắm', '食事します|しょくじします|shokuji shimasu|dùng bữa', '散歩します|さんぽします|sanpo shimasu|đi dạo',
    '大変|たいへん|taihen|vất vả, nghiêm trọng', '欲しい|ほしい|hoshii|muốn có', '寂しい|さびしい|sabishii|cô đơn', '広い|ひろい|hiroi|rộng', '狭い|せまい|semai|hẹp',
    '市役所|しやくしょ|shiyakusho|tòa thị chính', 'プール|プール|puuru|hồ bơi', '川|かわ|kawa|sông', '経済|けいざい|keizai|kinh tế', '美術|びじゅつ|bijutsu|mỹ thuật',
    '釣り|つり|tsuri|câu cá', 'スキー|スキー|sukii|trượt tuyết', '会議|かいぎ|kaigi|cuộc họp', '登録|とうろく|touroku|đăng ký', '週末|しゅうまつ|shuumatsu|cuối tuần',
    '何か|なにか|nanika|cái gì đó', 'どこか|どこか|dokoka|nơi nào đó', '喉|のど|nodo|cổ họng', 'お腹|おなか|onaka|bụng', '空きます|すきます|sukimasu|đói, trống',
    '注文|ちゅうもん|chuumon|gọi món', '定食|ていしょく|teishoku|suất ăn', '牛丼|ぎゅうどん|gyuudon|cơm bò', '少々|しょうしょう|shoushou|một chút (lịch sự)',
  ], [
    point('N がほしいです', 'Dùng để nói bản thân muốn sở hữu vật; câu hỏi có thể hỏi người nghe.', '新しい自転車がほしいです。', 'あたらしい じてんしゃが ほしいです。', 'Tôi muốn một chiếc xe đạp mới.'),
    point('Vます-stem + たいです', 'Bỏ ます và thêm たいです để nói muốn làm; tân ngữ dùng を hoặc が.', '週末、海で泳ぎたいです。', 'しゅうまつ、うみで およぎたいです。', 'Cuối tuần tôi muốn bơi ở biển.'),
    point('place へ Vます-stem に行きます', 'Dùng phần trước ます + に để nêu mục đích di chuyển.', '駅へ友達を迎えに行きます。', 'えきへ ともだちを むかえに いきます。', 'Tôi đi ga để đón bạn.'),
    point('何か／どこか', 'か sau nghi vấn tạo nghĩa không xác định; thường không cần trợ từ を/へ trước động từ.', 'どこかへ遊びに行きたいです。', 'どこかへ あそびに いきたいです。', 'Tôi muốn đi đâu đó chơi.'),
  ], ['Tạo danh sách ba thứ muốn có và ba việc muốn làm.', 'Chọn mục đích phù hợp cho 8 chuyến đi.', 'Đóng vai gọi món tại nhà hàng.'],
  ['A: 週末、何をしたいですか。', 'B: 山へ写真を撮りに行きたいです。', 'A: いいですね。私も行きたいです。', 'B: では、土曜日の朝、駅で会いましょう。'],
  'Nghe bốn người nói mong muốn cuối tuần và ghép với địa điểm, mục đích.'),

  lesson(14, 'Thể て và yêu cầu', 'Tạo thể て của động từ; yêu cầu, đề nghị giúp và mô tả hành động đang diễn ra.', [
    '点けます|つけます|tsukemasu|bật', '消します|けします|keshimasu|tắt', '開けます|あけます|akemasu|mở', '閉めます|しめます|shimemasu|đóng',
    '急ぎます|いそぎます|isogimasu|vội', '待ちます|まちます|machimasu|đợi', '止めます|とめます|tomemasu|dừng, đỗ', '曲がります|まがります|magarimasu|rẽ',
    '持ちます|もちます|mochimasu|cầm, mang', '取ります|とります|torimasu|lấy', '手伝います|てつだいます|tetsudaimasu|giúp', '呼びます|よびます|yobimasu|gọi',
    '話します|はなします|hanashimasu|nói', '見せます|みせます|misemasu|cho xem', '教えます|おしえます|oshiemasu|chỉ, nói cho biết', '始めます|はじめます|hajimemasu|bắt đầu',
    '降ります|ふります|furimasu|rơi (mưa, tuyết)', 'コピーします|コピーします|kopii shimasu|sao chép', 'エアコン|エアコン|eakon|máy điều hòa', 'パスポート|パスポート|pasupooto|hộ chiếu',
    '名前|なまえ|namae|tên', '住所|じゅうしょ|juusho|địa chỉ', '地図|ちず|chizu|bản đồ', '塩|しお|shio|muối', '砂糖|さとう|satou|đường',
    '読み方|よみかた|yomikata|cách đọc', '方|かた|kata|cách', 'ゆっくり|ゆっくり|yukkuri|chậm rãi', 'すぐ|すぐ|sugu|ngay lập tức',
    'また|また|mata|lại, nữa', '後で|あとで|atode|sau đó', 'もう少し|もうすこし|mou sukoshi|thêm một chút', 'もう|もう|mou|thêm, nữa',
    '真っ直ぐ|まっすぐ|massugu|thẳng', '信号|しんごう|shingou|đèn giao thông', '角|かど|kado|góc', '橋|はし|hashi|cầu',
  ], [
    point('Vて-form', 'Quy tắc: う・つ・る→って; む・ぶ・ぬ→んで; く→いて; ぐ→いで; す→して; nhóm 2 bỏ ます + て.', 'ここで少し待って。', 'ここで すこし まって。', 'Hãy đợi một chút ở đây.'),
    point('Vてください', 'Dùng thể て + ください để yêu cầu lịch sự.', '住所を書いてください。', 'じゅうしょを かいてください。', 'Xin hãy viết địa chỉ.'),
    point('Vましょうか', 'Đề nghị làm giúp người khác; người nghe có thể nhận hoặc từ chối.', '荷物を持ちましょうか。', 'にもつを もちましょうか。', 'Tôi mang hành lý giúp nhé?'),
    point('Vています', 'Diễn đạt hành động đang diễn ra tại thời điểm nói.', '今、雨が降っています。', 'いま、あめが ふっています。', 'Bây giờ trời đang mưa.'),
  ], ['Chuyển 30 động từ sang thể て theo nhóm.', 'Thực hiện chuỗi chỉ dẫn trên bản đồ.', 'Đề nghị giúp trong 6 tình huống.'],
  ['A: すみません。市役所はどこですか。', 'B: この道を真っ直ぐ行って、二つ目の角を右へ曲がってください。', 'A: 橋の近くですか。', 'B: はい。地図を描きましょうか。'],
  'Nghe bốn chỉ dẫn ngắn; theo đường trên bản đồ và chọn đích đến.'),

  lesson(15, 'Xin phép, cấm đoán và trạng thái', 'Xin phép, nói điều không được làm; dùng ています cho trạng thái, nghề và thói quen.', [
    '立ちます|たちます|tachimasu|đứng', '座ります|すわります|suwarimasu|ngồi', '使います|つかいます|tsukaimasu|dùng', '置きます|おきます|okimasu|đặt',
    '作ります|つくります|tsukurimasu|làm, chế tạo', '売ります|うります|urimasu|bán', '知ります|しります|shirimasu|biết', '住みます|すみます|sumimasu|sống, cư trú',
    '研究します|けんきゅうします|kenkyuu shimasu|nghiên cứu', '資料|しりょう|shiryou|tài liệu', 'カタログ|カタログ|katarogu|catalog', '時刻表|じこくひょう|jikokuhyou|thời gian biểu',
    '服|ふく|fuku|quần áo', '製品|せいひん|seihin|sản phẩm', 'ソフト|ソフト|sofuto|phần mềm', '専門|せんもん|senmon|chuyên môn',
    '歯医者|はいしゃ|haisha|nha sĩ', '床屋|とこや|tokoya|tiệm cắt tóc nam', 'プレイガイド|プレイガイド|pureigaido|quầy bán vé', '独身|どくしん|dokushin|độc thân',
    '特に|とくに|tokuni|đặc biệt', '思い出します|おもいだします|omoidashimasu|nhớ lại', 'ご家族|ごかぞく|gokazoku|gia đình của người khác',
    '高校|こうこう|koukou|trường cấp ba', '日本橋|にほんばし|nihonbashi|Nihonbashi',
  ], [
    point('Vてもいいです', 'Diễn đạt được phép làm một việc.', 'ここに座ってもいいです。', 'ここに すわっても いいです。', 'Bạn có thể ngồi đây.'),
    point('Vてもいいですか', 'Dùng để xin phép; câu trả lời lịch sự tránh phủ định quá trực tiếp.', 'この資料を見てもいいですか。', 'この しりょうを みても いいですか。', 'Tôi xem tài liệu này được không?'),
    point('Vてはいけません', 'Diễn đạt quy định cấm hoặc hành động không được phép.', 'ここで写真を撮ってはいけません。', 'ここで しゃしんを とっては いけません。', 'Không được chụp ảnh ở đây.'),
    point('Vています（状態・習慣）', 'Ngoài hành động đang diễn ra, ています còn chỉ trạng thái, nghề hoặc thói quen kéo dài.', '東京に住んでいます。', 'とうきょうに すんでいます。', 'Tôi đang sống ở Tokyo.'),
    point('知っています／知りません', 'Phủ định tự nhiên của 知っています là 知りません.', '田中さんを知りません。', 'たなかさんを しりません。', 'Tôi không biết anh Tanaka.'),
  ], ['Phân loại biển báo: được phép/không được phép.', 'Xin phép trong lớp, ký túc xá và bảo tàng.', 'Phỏng vấn nơi ở, nghề nghiệp và tình trạng gia đình.'],
  ['A: この部屋で食べてもいいですか。', 'B: すみません。ここで食べてはいけません。', 'A: どこで食べられますか。', 'B: 一階の食堂を使ってください。'],
  'Nghe nội quy của ba địa điểm và đánh dấu hành động được phép hoặc bị cấm.'),

  lesson(16, 'Nối hành động và đặc điểm', 'Nói chuỗi hành động, thứ tự trước–sau; nối tính từ và danh từ để mô tả.', [
    '乗ります|のります|norimasu|lên, đi (phương tiện)', '降ります|おります|orimasu|xuống', '乗り換えます|のりかえます|norikaemasu|đổi tàu, xe', '浴びます|あびます|abimasu|tắm vòi sen',
    '入れます|いれます|iremasu|cho vào', '出します|だします|dashimasu|lấy ra', '入ります|はいります|hairimasu|vào', '出ます|でます|demasu|ra',
    '辞めます|やめます|yamemasu|nghỉ, bỏ', '押します|おします|oshimasu|ấn, đẩy', '若い|わかい|wakai|trẻ', '長い|ながい|nagai|dài',
    '短い|みじかい|mijikai|ngắn', '明るい|あかるい|akarui|sáng', '暗い|くらい|kurai|tối', '背が高い|せがたかい|se ga takai|cao người',
    '頭がいい|あたまがいい|atama ga ii|thông minh', '体|からだ|karada|cơ thể', '頭|あたま|atama|đầu', '髪|かみ|kami|tóc',
    '顔|かお|kao|mặt', '目|め|me|mắt', '耳|みみ|mimi|tai', '口|くち|kuchi|miệng', '歯|は|ha|răng', 'お腹|おなか|onaka|bụng',
    '足|あし|ashi|chân', 'サービス|サービス|saabisu|dịch vụ', 'ジョギング|ジョギング|jogingu|chạy bộ', 'シャワー|シャワー|shawaa|vòi sen',
    '緑|みどり|midori|màu xanh lá, cây xanh', '寺|おてら|otera|chùa', '神社|じんじゃ|jinja|đền Thần đạo', '留学生|りゅうがくせい|ryuugakusei|du học sinh',
    'まず|まず|mazu|trước hết', '次に|つぎに|tsugi ni|tiếp theo', 'どうやって|どうやって|douyatte|bằng cách nào', 'どの|どの|dono|cái nào',
  ], [
    point('Vて、Vて、それから V', 'Nối các hành động theo thứ tự thời gian.', '朝、起きて、顔を洗って、朝ご飯を食べます。', 'あさ、おきて、かおを あらって、あさごはんを たべます。', 'Buổi sáng tôi thức dậy, rửa mặt rồi ăn sáng.'),
    point('Vてから、V', 'Nhấn mạnh hành động thứ hai xảy ra sau khi hoàn tất hành động thứ nhất.', '宿題をしてから、テレビを見ます。', 'しゅくだいを してから、テレビを みます。', 'Làm bài xong tôi mới xem tivi.'),
    point('い-adj くて／な-adj で／N で', 'Nối hai đặc điểm cùng chủ đề; tránh nối hai ý đối lập bằng cách này.', 'この町は静かで、緑が多いです。', 'この まちは しずかで、みどりが おおいです。', 'Thị trấn này yên tĩnh và nhiều cây xanh.'),
    point('どうやって', 'Hỏi phương pháp hoặc lộ trình.', '空港までどうやって行きますか。', 'くうこうまで どうやって いきますか。', 'Đi đến sân bay bằng cách nào?'),
  ], ['Xếp 10 hành động buổi sáng theo thứ tự.', 'Ghép lộ trình có đổi tàu.', 'Mô tả người bằng ngoại hình và tính cách.'],
  ['A: 京都駅からお寺までどうやって行きますか。', 'B: バスに乗って、五つ目で降ります。', 'A: 降りてから、遠いですか。', 'B: いいえ、歩いて三分です。'],
  'Nghe ba lộ trình có chuyển phương tiện và chọn tuyến đúng.'),

  lesson(17, 'Thể ない, nghĩa vụ và không cần thiết', 'Tạo thể ない; cấm mềm, nghĩa vụ bắt buộc và việc không cần làm.', [
    '覚えます|おぼえます|oboemasu|nhớ', '忘れます|わすれます|wasuremasu|quên', '無くします|なくします|nakushimasu|làm mất', '出します|だします|dashimasu|nộp',
    '払います|はらいます|haraimasu|trả tiền', '返します|かえします|kaeshimasu|trả lại', '出かけます|でかけます|dekakemasu|đi ra ngoài', '脱ぎます|ぬぎます|nugimasu|cởi',
    '持って行きます|もっていきます|motte ikimasu|mang đi', '持って来ます|もってきます|motte kimasu|mang đến', '心配します|しんぱいします|shinpai shimasu|lo lắng', '残業します|ざんぎょうします|zangyou shimasu|làm thêm giờ',
    '出張します|しゅっちょうします|shucchou shimasu|đi công tác', '飲みます|のみます|nomimasu|uống thuốc', '入ります|はいります|hairimasu|tắm bồn', '大切|たいせつ|taisetsu|quan trọng',
    '大丈夫|だいじょうぶ|daijoubu|ổn, không sao', '危ない|あぶない|abunai|nguy hiểm', '問題|もんだい|mondai|vấn đề, câu hỏi', '答え|こたえ|kotae|câu trả lời',
    "禁煙|きんえん|kin'en|cấm hút thuốc", '健康保険証|けんこうほけんしょう|kenkou hokenshou|thẻ bảo hiểm y tế', '風邪|かぜ|kaze|cảm cúm', '熱|ねつ|netsu|sốt',
    '病気|びょうき|byouki|bệnh', '薬|くすり|kusuri|thuốc', 'お風呂|おふろ|ofuro|bồn tắm', '上着|うわぎ|uwagi|áo khoác',
    '下着|したぎ|shitagi|đồ lót', '二三日|にさんにち|nisannichi|hai ba ngày', 'までに|までに|made ni|trước hạn', 'ですから|ですから|desu kara|vì vậy',
  ], [
    point('Vない-form', 'Nhóm 1 đổi âm hàng い sang hàng あ + ない; う→わない. Nhóm 2 bỏ ます + ない; します→しない; 来ます→こない.', '今日は出かけない。', 'きょうは でかけない。', 'Hôm nay tôi không ra ngoài.'),
    point('Vないでください', 'Yêu cầu người khác đừng làm một việc.', 'ここでたばこを吸わないでください。', 'ここで たばこを すわないで ください。', 'Xin đừng hút thuốc ở đây.'),
    point('Vなければなりません', 'Diễn đạt nghĩa vụ bắt buộc “phải làm”.', '明日までにレポートを出さなければなりません。', 'あしたまでに レポートを ださなければ なりません。', 'Tôi phải nộp báo cáo trước ngày mai.'),
    point('Vなくてもいいです', 'Diễn đạt không cần phải làm.', '土曜日は来なくてもいいです。', 'どようびは こなくても いいです。', 'Thứ bảy không cần đến.'),
    point('N までに', 'までに là hạn chót; khác まで là hành động kéo dài đến một mốc.', '九時までに会社へ行きます。', 'くじまでに かいしゃへ いきます。', 'Tôi đến công ty trước 9 giờ.'),
  ], ['Chuyển 30 động từ sang thể ない.', 'Xử lý 8 tình huống sức khỏe bằng phải/không cần.', 'Đọc bảng nội quy và hạn nộp.'],
  ['A: 熱がありますね。今日はお風呂に入らないでください。', 'B: 薬を飲まなければなりませんか。', 'A: はい。食事の後で飲んでください。', 'B: 明日は会社へ行ってもいいですか。'],
  'Nghe chỉ dẫn của bác sĩ và chọn việc phải làm, không được làm, không cần làm.'),

  lesson(18, 'Khả năng, sở thích và trước khi', 'Dùng thể từ điển để nói khả năng, sở thích và hành động trước một mốc.', [
    'できます|できます|dekimasu|có thể; hoàn thành', '洗います|あらいます|araimasu|rửa', '弾きます|ひきます|hikimasu|chơi nhạc cụ', '歌います|うたいます|utaimasu|hát',
    '集めます|あつめます|atsumemasu|sưu tập', '捨てます|すてます|sutemasu|vứt', '換えます|かえます|kaemasu|đổi', '運転します|うんてんします|unten shimasu|lái xe',
    '予約します|よやくします|yoyaku shimasu|đặt trước', '見学します|けんがくします|kengaku shimasu|tham quan học tập', 'ピアノ|ピアノ|piano|đàn piano', 'メートル|メートル|meetoru|mét',
    '国際|こくさい|kokusai|quốc tế', '現金|げんきん|genkin|tiền mặt', '趣味|しゅみ|shumi|sở thích', '日記|にっき|nikki|nhật ký',
    'お祈り|おいのり|oinori|cầu nguyện', '課長|かちょう|kachou|trưởng phòng', '部長|ぶちょう|buchou|trưởng bộ phận', '社長|しゃちょう|shachou|giám đốc công ty',
    '動物|どうぶつ|doubutsu|động vật', '馬|うま|uma|ngựa', 'インターネット|インターネット|intaanetto|Internet', '特に|とくに|tokuni|đặc biệt',
    'へえ|へえ|hee|ồ, thế à', 'なかなか|なかなか|nakanaka|mãi không; khá', '牧場|ぼくじょう|bokujou|trang trại chăn nuôi', '本当|ほんとう|hontou|thật',
  ], [
    point('V dictionary-form', 'Thể từ điển là dạng cơ bản: nhóm 1 kết thúc âm hàng う; nhóm 2 ～る; します→する; 来ます→くる.', '毎朝、新聞を読む。', 'まいあさ、しんぶんを よむ。', 'Mỗi sáng tôi đọc báo.'),
    point('N／V辞書形 ことができます', 'Nói khả năng làm một việc hoặc điều kiện cho phép.', '私は車を運転することができます。', 'わたしは くるまを うんてんすることが できます。', 'Tôi có thể lái ô tô.'),
    point('趣味は N／V辞書形ことです', 'Dùng danh từ hoặc động từ danh hóa bằng こと để nói sở thích.', '趣味は写真を撮ることです。', 'しゅみは しゃしんを とることです。', 'Sở thích của tôi là chụp ảnh.'),
    point('V辞書形／N の 前に', 'Diễn đạt làm A trước B; danh từ nối bằng の.', '寝る前に日記を書きます。', 'ねる まえに にっきを かきます。', 'Trước khi ngủ tôi viết nhật ký.'),
  ], ['Chuyển động từ sang thể từ điển.', 'Tạo thẻ hồ sơ “tôi có thể…”.', 'Sắp xếp việc cần làm trước chuyến đi.'],
  ['A: 趣味は何ですか。', 'B: 古い切手を集めることです。', 'A: 外国の切手もありますか。', 'B: はい。旅行する前に、切手の店を調べます。'],
  'Nghe bốn người nói sở thích và khả năng; ghép người với hoạt động đúng.'),

  lesson(19, 'Kinh nghiệm, liệt kê và thay đổi', 'Dùng thể た nói kinh nghiệm, liệt kê hành động và sự thay đổi trạng thái.', [
    '登ります|のぼります|noborimasu|leo', '泊まります|とまります|tomarimasu|trọ, ở lại', '掃除します|そうじします|souji shimasu|dọn dẹp', '洗濯します|せんたくします|sentaku shimasu|giặt',
    '練習します|れんしゅうします|renshuu shimasu|luyện tập', 'なります|なります|narimasu|trở thành', '眠い|ねむい|nemui|buồn ngủ', '強い|つよい|tsuyoi|mạnh',
    '弱い|よわい|yowai|yếu', '調子がいい|ちょうしがいい|choushi ga ii|tình trạng tốt', '調子が悪い|ちょうしがわるい|choushi ga warui|tình trạng không tốt',
    '調子|ちょうし|choushi|tình trạng', 'ゴルフ|ゴルフ|gorufu|golf', '相撲|すもう|sumou|sumo', 'パチンコ|パチンコ|pachinko|pachinko',
    'お茶|おちゃ|ocha|trà đạo', '日|ひ|hi|ngày', '一度|いちど|ichido|một lần', '一度も|いちども|ichido mo|chưa một lần nào',
    '段々|だんだん|dandan|dần dần', 'もうすぐ|もうすぐ|mou sugu|sắp', 'お陰様で|おかげさまで|okagesama de|nhờ trời, nhờ anh/chị', '乾杯|かんぱい|kanpai|cạn ly',
    'ダイエット|ダイエット|daietto|ăn kiêng', '無理|むり|muri|quá sức, không thể', '体にいい|からだにいい|karada ni ii|tốt cho sức khỏe',
  ], [
    point('Vた-form', 'Thể た có quy tắc giống thể て, thay て/で bằng た/だ.', '昨日、富士山に登った。', 'きのう、ふじさんに のぼった。', 'Hôm qua tôi đã leo núi Phú Sĩ.'),
    point('Vたことがあります', 'Nói kinh nghiệm đã từng làm; thời điểm cụ thể không dùng trong mẫu này.', '北海道へ行ったことがあります。', 'ほっかいどうへ いったことが あります。', 'Tôi đã từng đi Hokkaido.'),
    point('Vたり、Vたりします', 'Liệt kê một số hành động tiêu biểu, không nhấn thứ tự.', '休みの日は掃除したり、料理したりします。', 'やすみの ひは そうじしたり、りょうりしたり します。', 'Ngày nghỉ tôi dọn dẹp, nấu ăn và làm những việc khác.'),
    point('い-adj く／な-adj・N に なります', 'Diễn đạt sự thay đổi trạng thái.', '日本語がだんだん上手になりました。', 'にほんごが だんだん じょうずに なりました。', 'Tiếng Nhật của tôi dần giỏi hơn.'),
  ], ['Phỏng vấn “đã từng… chưa?”.', 'Lập nhật ký ngày nghỉ bằng ～たり.', 'Mô tả thay đổi thời tiết, sức khỏe và năng lực.'],
  ['A: 日本で温泉に入ったことがありますか。', 'B: はい、一度あります。', 'A: どうでしたか。', 'B: とても気持ちよかったです。また行きたいです。'],
  'Nghe bốn kinh nghiệm du lịch và xác định việc đã từng làm cùng cảm nhận.'),

  lesson(20, 'Thể thông thường trong giao tiếp thân mật', 'Chuyển câu lịch sự sang thể thông thường và trò chuyện với bạn bè.', [
    '要ります|いります|irimasu|cần', '調べます|しらべます|shirabemasu|tìm hiểu, tra cứu', '直します|なおします|naoshimasu|sửa', '修理します|しゅうりします|shuuri shimasu|sửa chữa',
    '電話します|でんわします|denwa shimasu|gọi điện', '僕|ぼく|boku|tôi (nam)', '君|きみ|kimi|cậu, bạn', 'うん|うん|un|ừ', 'ううん|ううん|uun|không',
    'サラリーマン|サラリーマン|sarariiman|nhân viên văn phòng', '言葉|ことば|kotoba|từ ngữ, ngôn ngữ', '物価|ぶっか|bukka|giá cả', '着物|きもの|kimono|kimono',
    'ビザ|ビザ|biza|thị thực', '初め|はじめ|hajime|đầu tiên', '終わり|おわり|owari|kết thúc', 'こっち|こっち|kocchi|phía này (thân mật)',
    'そっち|そっち|socchi|phía đó (thân mật)', 'あっち|あっち|acchi|phía kia (thân mật)', 'どっち|どっち|docchi|phía nào (thân mật)',
    '皆で|みんなで|minna de|mọi người cùng', 'けど|けど|kedo|nhưng', '国へ帰る|くにへかえる|kuni e kaeru|về nước', 'どうする|どうする|dou suru|làm thế nào',
  ], [
    point('Động từ thể thường', 'Hiện tại khẳng định dùng thể từ điển; phủ định ～ない; quá khứ ～た; phủ định quá khứ ～なかった.', '明日、映画を見る？', 'あした、えいがを みる？', 'Ngày mai xem phim không?'),
    point('Tính từ い thể thường', 'Bỏ です; các dạng phủ định/quá khứ giữ cách chia tính từ.', '昨日は忙しかった。', 'きのうは いそがしかった。', 'Hôm qua bận.'),
    point('N／な-adj thể thường', 'Hiện tại khẳng định dùng だ (thường có thể lược trong câu hỏi); phủ định じゃない; quá khứ だった.', '今日は暇？', 'きょうは ひま？', 'Hôm nay rảnh không?'),
    point('Thể thường + けど', 'けど nối ý “nhưng” hoặc làm câu nói mềm hơn.', '行きたいけど、時間がない。', 'いきたいけど、じかんが ない。', 'Tôi muốn đi nhưng không có thời gian.'),
  ], ['Chuyển 20 câu lịch sự sang thân mật và ngược lại.', 'Chọn cách nói phù hợp với bạn/thầy/khách.', 'Trò chuyện lập kế hoạch cuối tuần.'],
  ['A: 明日、暇？', 'B: うん。どうしたの？', 'A: 新しいカフェへ行かない？', 'B: いいね。何時に会う？'],
  'Nghe các cặp bạn bè nói nhanh bằng thể thường; chọn kế hoạch cuối cùng.'),

  lesson(21, 'Ý kiến, lời nói và phỏng đoán', 'Nêu suy nghĩ, truyền đạt lời nói; xác nhận thông tin và dự đoán.', [
    '思います|おもいます|omoimasu|nghĩ', '言います|いいます|iimasu|nói', '足ります|たります|tarimasu|đủ', '勝ちます|かちます|kachimasu|thắng',
    '負けます|まけます|makemasu|thua', 'あります|あります|arimasu|được tổ chức', '役に立ちます|やくにたちます|yaku ni tachimasu|có ích', '無駄|むだ|muda|lãng phí',
    '不便|ふべん|fuben|bất tiện', '同じ|おなじ|onaji|giống', '凄い|すごい|sugoi|tuyệt, ghê', '首相|しゅしょう|shushou|thủ tướng',
    '大統領|だいとうりょう|daitouryou|tổng thống', '政治|せいじ|seiji|chính trị', 'ニュース|ニュース|nyuusu|tin tức', 'スピーチ|スピーチ|supiichi|bài phát biểu',
    '試合|しあい|shiai|trận đấu', 'アルバイト|アルバイト|arubaito|việc làm thêm', '意見|いけん|iken|ý kiến', '話|はなし|hanashi|câu chuyện',
    'ユーモア|ユーモア|yuumoa|hài hước', 'デザイン|デザイン|dezain|thiết kế', '交通|こうつう|koutsuu|giao thông', 'ラッシュ|ラッシュ|rasshu|giờ cao điểm',
    '最近|さいきん|saikin|gần đây', '多分|たぶん|tabun|có lẽ', 'きっと|きっと|kitto|chắc chắn', '本当に|ほんとうに|hontou ni|thật sự',
    'そんなに|そんなに|sonna ni|đến mức đó', 'について|について|ni tsuite|về, liên quan đến', '仕方がありません|しかたがありません|shikata ga arimasen|không còn cách nào',
  ], [
    point('plain-form と思います', 'Nêu ý kiến hoặc phỏng đoán của người nói; danh từ/tính từ な dùng だ trước と.', '明日は雨が降ると思います。', 'あしたは あめが ふると おもいます。', 'Tôi nghĩ ngày mai trời sẽ mưa.'),
    point('S／plain-form と言います', 'Trích dẫn trực tiếp hoặc gián tiếp lời nói.', '先生は「来週テストをします」と言いました。', 'せんせいは「らいしゅう テストを します」と いいました。', 'Giáo viên nói tuần sau sẽ kiểm tra.'),
    point('plain-form でしょう', 'Dùng khi muốn người nghe xác nhận hoặc thể hiện phỏng đoán khá chắc.', 'この店は安いでしょう。', 'この みせは やすいでしょう。', 'Cửa hàng này rẻ nhỉ?'),
    point('N についてどう思いますか', 'Hỏi ý kiến về một chủ đề.', '日本の交通についてどう思いますか。', 'にほんの こうつうについて どう おもいますか。', 'Bạn nghĩ gì về giao thông Nhật Bản?'),
  ], ['Phân biệt sự thật và ý kiến trong 10 câu.', 'Tóm tắt tin ngắn bằng ～と言いました.', 'Tranh luận nhẹ về học online và giao thông.'],
  ['A: 明日の試合、どちらが勝つと思う？', 'B: 青いチームが勝つと思う。', 'A: 私も。最近、とても強いでしょう。', 'B: うん。でも赤いチームも上手だよ。'],
  'Nghe bốn dự đoán và xác định người nói nghĩ ai thắng, thời tiết hoặc kế hoạch sẽ thế nào.'),

  lesson(22, 'Mệnh đề bổ nghĩa danh từ', 'Dùng câu thể thường đứng trước danh từ để xác định người, vật và nơi.', [
    '着ます|きます|kimasu|mặc áo', '履きます|はきます|hakimasu|mặc quần, đi giày', '被ります|かぶります|kaburimasu|đội', 'かけます|かけます|kakemasu|đeo kính',
    '生まれます|うまれます|umaremasu|được sinh ra', 'コート|コート|kooto|áo khoác', 'スーツ|スーツ|suutsu|com-lê', 'セーター|セーター|seetaa|áo len',
    '帽子|ぼうし|boushi|mũ', '眼鏡|めがね|megane|kính', 'よく|よく|yoku|thường', 'おめでとうございます|おめでとうございます|omedetou gozaimasu|xin chúc mừng',
    '家賃|やちん|yachin|tiền nhà', 'うーん|うーん|uun|ừm', 'ダイニングキッチン|ダイニングキッチン|dainingu kicchin|bếp kiêm phòng ăn', '和室|わしつ|washitsu|phòng kiểu Nhật',
    '押し入れ|おしいれ|oshiire|tủ âm tường', '布団|ふとん|futon|đệm futon', 'アパート|アパート|apaato|căn hộ', 'マンション|マンション|manshon|chung cư',
    '人|ひと|hito|người', '物|もの|mono|vật', '場所|ばしょ|basho|địa điểm', '昨日|きのう|kinou|hôm qua', '会った人|あったひと|atta hito|người đã gặp',
    '買った本|かったほん|katta hon|cuốn sách đã mua', '住んでいる町|すんでいるまち|sunde iru machi|thị trấn đang sống',
  ], [
    point('plain-form + N', 'Mệnh đề thể thường đứng trước danh từ; không đặt の giữa động từ và danh từ.', 'あそこにいる人は私の兄です。', 'あそこに いる ひとは わたしの あにです。', 'Người đang ở đằng kia là anh tôi.'),
    point('N が／を V + N', 'Trong mệnh đề bổ nghĩa, chủ ngữ nhỏ thường dùng が; danh từ được bổ nghĩa có thể giữ vai trò khác trong câu chính.', '母が作った料理を食べました。', 'ははが つくった りょうりを たべました。', 'Tôi đã ăn món mẹ nấu.'),
    point('Vる／Vた／Vない + N', 'Có thể dùng hiện tại, quá khứ hoặc phủ định để xác định danh từ.', '明日着る服を準備します。', 'あした きる ふくを じゅんびします。', 'Tôi chuẩn bị quần áo sẽ mặc ngày mai.'),
  ], ['Ghép 12 mệnh đề với đúng người/vật.', 'Tìm căn hộ theo năm yêu cầu.', 'Mô tả một người để bạn đoán.'],
  ['A: あそこで写真を撮っている人は誰ですか。', 'B: 先週入った新しい社員です。', 'A: 赤い帽子を被っている人ですか。', 'B: はい、そうです。'],
  'Nghe mô tả nhiều người trong một bức tranh và chọn đúng nhân vật.'),

  lesson(23, 'Khi nào và điều kiện tự nhiên', 'Dùng とき cho thời điểm; と cho kết quả tự động hoặc quy luật.', [
    '聞きます|ききます|kikimasu|hỏi', '回します|まわします|mawashimasu|xoay', '引きます|ひきます|hikimasu|kéo', '変えます|かえます|kaemasu|đổi',
    '触ります|さわります|sawarimasu|chạm', '出ます|でます|demasu|đi ra, hiện ra', '動きます|うごきます|ugokimasu|chuyển động', '歩きます|あるきます|arukimasu|đi bộ',
    '渡ります|わたります|watarimasu|băng qua', '曲がります|まがります|magarimasu|rẽ', '寂しい|さびしい|sabishii|cô đơn', 'お湯|おゆ|oyu|nước nóng',
    '音|おと|oto|âm thanh', 'サイズ|サイズ|saizu|kích cỡ', '故障|こしょう|koshou|hỏng hóc', '道|みち|michi|đường', '交差点|こうさてん|kousaten|ngã tư',
    '信号|しんごう|shingou|đèn giao thông', '角|かど|kado|góc', '橋|はし|hashi|cầu', '駐車場|ちゅうしゃじょう|chuushajou|bãi đỗ xe',
    '建物|たてもの|tatemono|tòa nhà', '外国人登録証|がいこくじんとうろくしょう|gaikokujin tourokushou|thẻ đăng ký người nước ngoài', '何度も|なんども|nando mo|nhiều lần',
  ], [
    point('V／adj／N の とき', 'とき chỉ thời điểm; động từ trước とき quyết định hành động đã hoàn tất hay chưa. Danh từ nối bằng の, tính từ な dùng な.', '分からないとき、先生に聞きます。', 'わからない とき、せんせいに ききます。', 'Khi không hiểu, tôi hỏi giáo viên.'),
    point('V辞書形 と、result', 'Diễn đạt kết quả tự động, quy luật hoặc chỉ đường; mệnh đề sau không dùng ý chí, mệnh lệnh hay lời mời.', 'このボタンを押すと、ドアが開きます。', 'この ボタンを おすと、ドアが あきます。', 'Ấn nút này thì cửa mở.'),
    point('place を movement-verb', 'を có thể đánh dấu nơi đi qua hoặc rời khỏi.', '橋を渡って、右へ曲がります。', 'はしを わたって、みぎへ まがります。', 'Qua cầu rồi rẽ phải.'),
  ], ['Chọn dạng trước とき theo thứ tự thời gian.', 'Thao tác máy theo hướng dẫn điều kiện と.', 'Đi theo 8 chỉ dẫn trên bản đồ.'],
  ['A: 駅を出ると、大きい交差点があります。', 'B: 交差点で右へ曲がりますか。', 'A: はい。橋を渡ると、左に病院があります。', 'B: 分かりました。ありがとうございます。'],
  'Nghe chỉ đường có と và đánh dấu các mốc theo đúng thứ tự.'),

  lesson(24, 'Cho–nhận hành động', 'Diễn đạt làm giúp, được giúp và ai đó làm cho mình.', [
    'くれます|くれます|kuremasu|cho tôi/người phía tôi', '連れて行きます|つれていきます|tsurete ikimasu|dẫn đi', '連れて来ます|つれてきます|tsurete kimasu|dẫn đến',
    '送ります|おくります|okurimasu|đưa, tiễn', '紹介します|しょうかいします|shoukai shimasu|giới thiệu', '案内します|あんないします|annai shimasu|hướng dẫn',
    '説明します|せつめいします|setsumei shimasu|giải thích', '入れます|いれます|iremasu|pha, cho vào', 'お祖父さん|おじいさん|ojiisan|ông', 'お祖母さん|おばあさん|obaasan|bà',
    '準備|じゅんび|junbi|chuẩn bị', '意味|いみ|imi|ý nghĩa', 'お菓子|おかし|okashi|bánh kẹo', '全部|ぜんぶ|zenbu|toàn bộ',
    '自分で|じぶんで|jibun de|tự mình', '他に|ほかに|hoka ni|ngoài ra', '弁当|べんとう|bentou|cơm hộp', '母の日|ははのひ|haha no hi|Ngày của Mẹ',
  ], [
    point('A は B に Vてあげます', 'A làm giúp B; tránh dùng trực tiếp với người trên vì dễ tạo cảm giác ban ơn.', '私は友達に日本語を教えてあげました。', 'わたしは ともだちに にほんごを おしえて あげました。', 'Tôi đã dạy tiếng Nhật giúp bạn.'),
    point('A は B に Vてもらいます', 'A nhận sự giúp đỡ từ B; nhấn lợi ích A nhận được.', '私は先生に作文を直してもらいました。', 'わたしは せんせいに さくぶんを なおして もらいました。', 'Tôi đã nhờ giáo viên sửa bài văn.'),
    point('B が 私／người phía tôi に Vてくれます', 'Người khác chủ động làm điều có lợi cho người nói hoặc người thân của người nói.', '友達が駅まで送ってくれました。', 'ともだちが えきまで おくって くれました。', 'Bạn đã đưa tôi đến ga.'),
  ], ['Vẽ hướng lợi ích cho 12 câu てあげる/てもらう/てくれる.', 'Kể ba lần được người khác giúp.', 'Đóng vai nhờ hướng dẫn sử dụng.'],
  ['A: 引っ越しは終わりましたか。', 'B: はい。友達が荷物を運んでくれました。', 'A: 家具はどうしましたか。', 'B: 兄に車で運んでもらいました。'],
  'Nghe bốn việc chuẩn bị và xác định ai giúp ai, bằng hành động nào.'),

  lesson(25, 'Điều kiện たら và nhượng bộ ても', 'Nói giả định, việc sẽ làm sau một mốc chắc chắn và kết quả trái mong đợi.', [
    '考えます|かんがえます|kangaemasu|suy nghĩ', '着きます|つきます|tsukimasu|đến nơi', '留学します|りゅうがくします|ryuugaku shimasu|du học', '取ります|とります|torimasu|lấy; thêm tuổi',
    '田舎|いなか|inaka|quê, nông thôn', '大使館|たいしかん|taishikan|đại sứ quán', 'グループ|グループ|guruupu|nhóm', 'チャンス|チャンス|chansu|cơ hội',
    '億|おく|oku|một trăm triệu', 'もし|もし|moshi|nếu', 'いくら|いくら|ikura|dù bao nhiêu', '転勤|てんきん|tenkin|chuyển công tác',
    'こと|こと|koto|việc, chuyện', '一杯飲みます|いっぱいのみます|ippai nomimasu|uống một ly', 'お世話になりました|おせわになりました|osewa ni narimashita|cảm ơn đã giúp đỡ thời gian qua',
    '頑張ります|がんばります|ganbarimasu|cố gắng', 'どうぞお元気で|どうぞおげんきで|douzo ogenki de|chúc anh/chị mạnh khỏe',
  ], [
    point('plain-past + ら', 'Gắn ら vào thể quá khứ để tạo điều kiện “nếu/khi”. Danh từ và tính từ な dùng だったら.', '時間があったら、旅行したいです。', 'じかんが あったら、りょこうしたいです。', 'Nếu có thời gian, tôi muốn đi du lịch.'),
    point('Vたら、future action', 'Khi mệnh đề trước là sự kiện chắc chắn trong tương lai, mệnh đề sau xảy ra sau khi nó hoàn tất.', '駅に着いたら、電話してください。', 'えきに ついたら、でんわして ください。', 'Khi đến ga, hãy gọi điện.'),
    point('Vても／adj くても／N でも', 'Diễn đạt “dù… thì…” khi kết quả không thay đổi như dự đoán.', '雨が降っても、試合をします。', 'あめが ふっても、しあいを します。', 'Dù mưa vẫn tổ chức trận đấu.'),
    point('もし～たら', 'もし làm rõ giả định; không bắt buộc nhưng hữu ích khi mở câu.', 'もし一億円あったら、何をしますか。', 'もし いちおくえん あったら、なにを しますか。', 'Nếu có một trăm triệu yên, bạn sẽ làm gì?'),
  ], ['Hoàn thành 12 tình huống giả định.', 'Phân biệt と và たら trong quy luật/kế hoạch.', 'Nói lời tạm biệt và kế hoạch sau khi chuyển nơi ở.'],
  ['A: 来月、大阪へ転勤します。', 'B: そうですか。寂しくなりますね。', 'A: 大阪へ行っても、日本語の勉強を続けます。', 'B: 駅に着いたら、連絡してください。どうぞお元気で。'],
  'Nghe cuộc chia tay và xác định lý do chuyển đi, kế hoạch sau khi đến và lời dặn.'),
];

module.exports = lessons;
module.exports.default = lessons;
