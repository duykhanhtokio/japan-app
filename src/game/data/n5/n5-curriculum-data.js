/* Complete Vietnamese N5 curriculum: 16 weeks, 25 Minna I anchors. */
const minnaLessons = require('./n5-minna-lessons');

const slug = (value) => value.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
const toVocabulary = (item, lessonNumber) => ({
  japanese: item.japanese, reading: item.reading, romaji: item.romaji,
  meaningKey: `n5.minna.lesson_${lessonNumber}.vocabulary.${slug(item.romaji)}`,
  reviewMeaningVi: item.meaningVi,
});
const toGrammar = (item, lessonNumber, index) => ({
  pattern: item.pattern,
  explanationKey: `n5.minna.lesson_${lessonNumber}.grammar.${index + 1}.explanation`,
  reviewExplanationVi: item.explanationVi,
  example: {
    japanese: item.example.japanese, reading: item.example.reading,
    translationKey: `n5.minna.lesson_${lessonNumber}.grammar.${index + 1}.example`,
    reviewTranslationVi: item.example.translationVi,
  },
});
const rewards = (checkpoint, week) => ({
  xp: checkpoint ? 300 + week * 10 : 150,
  coins: checkpoint ? 120 + week * 5 : 45,
  key: checkpoint && [1, 4, 8, 12, 16].includes(week) ? 1 : 0,
});
const activity = (id, kind, title, minutes, instruction, completionRule) => ({ id, kind, title, minutes, instruction, completionRule });

const kanaDays = [
  ['Hiragana ① · Chữ cơ bản và âm ghép', 'Học Romaji, phát âm và thứ tự nét của 46 chữ; làm quen ゃ・ゅ・ょ nhỏ.', ['46 chữ Hiragana', 'Romaji', 'phát âm', 'thứ tự nét', 'きゃ・しゅ・ちょ'], [
    ['sound', 'kana', 'Âm và Romaji', 25, 'Mỗi chữ hiện lớn, Romaji bên dưới; nghe tốc độ thường/chậm rồi đọc lại.', 'Nhận diện đúng ít nhất 42/46 chữ.'],
    ['stroke', 'writing', 'Thứ tự nét có hướng dẫn', 35, 'Nét đánh số, màu khác nhau, đầu nét to rồi thu dần; đồ theo đường sáng.', 'Mỗi chữ đạt hướng nét từ 80%.'],
    ['combo', 'kana', 'Âm ghép cơ bản', 20, 'So sánh きや/きゃ, しゆ/しゅ, ちよ/ちょ.', 'Đúng 8/9 cặp nghe.'],
    ['break', 'break', 'Nghỉ chủ động', 10, 'Rời màn hình, thư giãn mắt và nhắc lại 5 chữ không nhìn đáp án.', 'Hết bộ đếm nghỉ.'],
    ['card', 'quiz', 'Thẻ hình ghi nhớ', 20, 'Lật Kana → hình → từ neo → Romaji.', 'Mỗi thẻ yếu được gọi lại sau 3–5 thẻ.'],
    ['exit', 'quiz', 'Exit quiz', 10, 'Trộn chữ→âm, âm→chữ và nhận diện nét.', 'Đạt 80%.'],
  ]],
  ['Hiragana ② · Biến âm và âm đặc biệt', 'Học 濁音・半濁音, đủ nhóm 拗音, っ nhỏ, ん và nguyên âm dài.', ['が–ご', 'ざ–ぞ', 'だ–ど', 'ば–ぼ', 'ぱ–ぽ', 'きゃ–ぴょ', 'っ・ん'], [
    ['srs', 'review', 'Ôn thích ứng', 15, 'Ưu tiên chữ sai hoặc phản hồi trên 3 giây.', 'Mỗi chữ yếu đúng lại hai lần.'],
    ['dakuon', 'kana', 'Biến âm', 25, 'Nghe và so sánh か/が, さ/ざ, た/だ, は/ば/ぱ.', 'Mỗi nhóm đạt 80%.'],
    ['youon', 'kana', 'Âm ghép đầy đủ', 25, 'Luyện 11 nhóm × 3 âm bằng thẻ âm thanh.', 'Đúng ít nhất 28/33.'],
    ['break', 'break', 'Nghỉ chủ động', 10, 'Nghỉ mắt và đọc lại âm sai.', 'Hết bộ đếm nghỉ.'],
    ['special', 'writing', 'っ nhỏ, ん và âm dài', 25, 'Nghe cặp tối thiểu rồi chọn vị trí ngắt/kéo dài.', 'Đúng 16/20.'],
    ['exit', 'quiz', 'Exit quiz', 20, '40 câu hỗn hợp; câu sai quay lại sau ba câu.', 'Đạt 85%.'],
  ]],
  ['Hiragana ③ · Tổng kiểm tra', 'Kiểm tra nhận diện, nghe, viết và phản xạ; không thêm chữ mới.', ['46 chữ', '25 biến âm', '33 âm ghép', 'っ・ん・trường âm'], [
    ['recognition', 'checkpoint', 'Nhận diện hai chiều', 25, 'Kana→Romaji và âm→Kana xen kẽ.', 'Tổng đạt 90%.'],
    ['dictation', 'listening', 'Nghe và viết', 25, 'Nghe 25 âm/từ rồi chọn hoặc viết Kana.', 'Đạt 80%.'],
    ['writing', 'writing', 'Kiểm tra nét', 20, 'Viết 15 chữ lấy từ lịch sử lỗi.', 'Hướng nét đạt 80%.'],
    ['break', 'break', 'Nghỉ chủ động', 10, 'Thả lỏng tay và mắt.', 'Hết bộ đếm nghỉ.'],
    ['dog', 'dog_game', 'Game chó · Hiragana', 30, 'Đúng: bé rút chân, chó cắn hụt. Sai: chó ngoạm mũi giày rồi phát lại âm.', 'Đạt 85% trong 30 câu.'],
    ['report', 'review', 'Báo cáo lỗi', 10, 'Tạo bộ thẻ ôn cá nhân.', 'Lưu lịch SRS.'],
  ]],
  ['Katakana ① · Chữ cơ bản và từ mượn', 'Học 46 chữ, Romaji, nét viết và phân biệt シ/ツ・ソ/ン.', ['46 chữ Katakana', 'Romaji', 'シ/ツ', 'ソ/ン', 'キャ・シュ・チョ'], [
    ['sound', 'kana', 'Âm và Romaji', 25, 'Nghe, nhìn Romaji rồi đọc lại từng hàng.', 'Nhận diện đúng ít nhất 42/46.'],
    ['stroke', 'writing', 'Nét viết Katakana', 35, 'Luyện nét màu, đầu nét to; tập trung シ/ツ và ソ/ン.', 'Hướng nét đạt 80%.'],
    ['combo', 'kana', 'Âm ghép cơ bản', 20, 'Luyện キャ・キュ・キョ và các nhóm đầu.', 'Đúng 8/9.'],
    ['break', 'break', 'Nghỉ chủ động', 10, 'Nghỉ mắt, đọc biển hiệu quanh mình nếu có.', 'Hết bộ đếm nghỉ.'],
    ['image', 'quiz', 'Thẻ đồ vật', 20, 'Chọn Katakana phù hợp với hình đồ vật/từ mượn.', 'Đúng 16/20.'],
    ['exit', 'quiz', 'Exit quiz', 10, 'Nhận diện, nghe và nét.', 'Đạt 80%.'],
  ]],
  ['Katakana ② · Biến âm và âm mở rộng', 'Học ガ–ポ, キャ–ピョ, ティ・ファ・フォ・ウィ, ッ nhỏ và dấu ー.', ['ガ–ポ', 'キャ–ピョ', 'ティ・ファ・フォ', 'ッ・ー'], [
    ['srs', 'review', 'Ôn thích ứng', 15, 'Tập trung cặp gần hình.', 'Mỗi chữ yếu đúng lại hai lần.'],
    ['dakuon', 'kana', 'Biến âm và âm ghép', 25, 'Luyện theo nhóm âm có nghe đối chiếu.', 'Mỗi nhóm đạt 80%.'],
    ['extra', 'kana', 'Âm mở rộng', 20, 'Luyện ティ・ディ・ファ・フィ・フェ・フォ・ウィ・ウェ・ウォ.', 'Đúng 16/20.'],
    ['break', 'break', 'Nghỉ chủ động', 10, 'Thư giãn mắt.', 'Hết bộ đếm nghỉ.'],
    ['long', 'writing', 'ッ nhỏ và ー', 25, 'Phân biệt âm ngắt và âm kéo dài trong từ mượn.', 'Đúng 16/20.'],
    ['exit', 'quiz', 'Exit quiz', 25, '40 câu hỗn hợp.', 'Đạt 85%.'],
  ]],
  ['Katakana ③ · Tổng kiểm tra', 'Kiểm tra bảng chữ, từ mượn, biển hiệu và chính tả.', ['46 chữ', 'biến âm', 'âm ghép', 'âm mở rộng', 'ッ・ー'], [
    ['recognition', 'checkpoint', 'Nhận diện hai chiều', 25, 'Katakana→Romaji và âm→Katakana.', 'Tổng đạt 90%.'],
    ['dictation', 'listening', 'Nghe chính tả', 25, 'Nghe 25 từ có âm đặc biệt.', 'Đạt 80%.'],
    ['life', 'quiz', 'Đọc trong đời sống', 20, 'Menu, biển hiệu, bản đồ và tên đồ vật.', 'Đúng 16/20.'],
    ['break', 'break', 'Nghỉ chủ động', 10, 'Thả lỏng tay và mắt.', 'Hết bộ đếm nghỉ.'],
    ['dog', 'dog_game', 'Game chó · Katakana', 30, 'Chọn chữ/từ đúng trước khi hết thời gian.', 'Đạt 85%.'],
    ['report', 'review', 'Báo cáo lỗi', 10, 'Tạo bộ thẻ ôn cá nhân.', 'Lưu lịch SRS.'],
  ]],
];

let nextDay = 1;
const days = kanaDays.map(([title, subtitle, focusItems, rows], index) => ({
  day: nextDay++, calendarDay: index + 1, week: 1, phase: 'kana', lessonNumber: null,
  title, subtitle, estimatedMinutes: 120, isCheckpoint: index === 2 || index === 5, focusItems,
  vocabulary: [], grammar: [],
  activities: rows.map((row) => activity(`kana-${index + 1}-${row[0]}`, ...row.slice(1))),
  practiceVi: [], kaiwaVi: [], listeningVi: '', rewards: rewards(index === 2 || index === 5, 1),
}));
days.push({
  day: nextDay++, calendarDay: 7, week: 1, phase: 'kana', lessonNumber: null,
  title: 'Event tuần 1 · Tổng kiểm tra hai bảng chữ',
  subtitle: 'Trộn Hiragana và Katakana; kiểm tra nghe, đọc, viết và phản xạ để mở khóa lộ trình N5.',
  estimatedMinutes: 75, isCheckpoint: true,
  focusItems: ['92 chữ cơ bản', 'biến âm', 'âm ghép', 'âm đặc biệt', 'từ neo bằng hình'], vocabulary: [], grammar: [],
  activities: [
    activity('kana-final-mix', 'checkpoint', '92 chữ xen kẽ', 20, 'Hai bảng được trộn ngẫu nhiên.', 'Mỗi bảng đạt 85%, chung đạt 90%.'),
    activity('kana-final-listen', 'listening', 'Nghe → chọn → viết', 15, '30 âm/từ gần âm và gần hình.', 'Đạt 80%.'),
    activity('kana-final-stroke', 'writing', 'Nét chữ yếu', 10, 'Viết 10 chữ từ lịch sử lỗi.', 'Hướng nét đạt 80%.'),
    activity('kana-final-dog', 'dog_game', 'Chung kết game chó', 20, '30 câu phản xạ hai bảng.', 'Đạt 85%.'),
    activity('kana-final-report', 'review', 'Báo cáo và SRS', 10, 'Lập lịch ôn 1–3–7–14–30 ngày.', 'Mở khóa tuần 2.'),
  ],
  practiceVi: ['Không học lại toàn bộ nếu chỉ yếu một nhóm.'], kaiwaVi: [], listeningVi: 'Nghe âm và từ ngắn, không dựa vào thứ tự bảng chữ.', rewards: rewards(true, 1),
});

const lessonSessions = minnaLessons.flatMap((sourceLesson) => {
  const vocabulary = sourceLesson.vocabulary.map((item) => toVocabulary(item, sourceLesson.number));
  const grammar = sourceLesson.grammar.map((item, index) => toGrammar(item, sourceLesson.number, index));
  const cut = Math.ceil(vocabulary.length / 2);
  const grammarCut = Math.max(1, Math.ceil(grammar.length / 2));
  return [
    { half: 'A', title: `Bài ${sourceLesson.number}A · ${sourceLesson.titleVi}`,
      subtitle: `${sourceLesson.objectiveVi} Buổi A tập trung nhận biết từ mới và hình thành mẫu câu.`,
      vocabulary: vocabulary.slice(0, cut), grammar: grammar.slice(0, grammarCut),
      focusItems: ['Từ mới nửa đầu', ...grammar.slice(0, grammarCut).map((item) => item.pattern)],
      activities: (day) => [
        activity(`d${day}-recall`, 'review', 'Gọi lại kiến thức cũ', 10, 'SRS lấy nội dung sai ở các buổi trước.', '12 lượt; mục yếu đúng lại hai lần.'),
        activity(`d${day}-vocab`, 'vocabulary', 'Từ vựng · Nhận biết', 25, 'Nghe → nhìn chữ → đọc → xem nghĩa tiếng Việt → chọn tình huống.', 'Mỗi từ đúng ở hai dạng câu hỏi.'),
        activity(`d${day}-grammar`, 'grammar', 'Ngữ pháp · Hình thành', 25, 'Xem cấu trúc, giải thích, câu có Hiragana và bản dịch rồi thay thế thành phần.', 'Đúng 8/10 và tự ghép hai câu.'),
        activity(`d${day}-break`, 'break', 'Nghỉ chủ động', 10, 'Rời màn hình, thả lỏng mắt; không mở nội dung mới.', 'Hết bộ đếm nghỉ.'),
        activity(`d${day}-practice`, 'quiz', 'Bài tập nhận biết', 20, sourceLesson.practiceVi[0], 'Đạt 80%; câu sai quay lại sau ba câu.'),
        activity(`d${day}-listen`, 'listening', 'Nghe có mục tiêu', 15, sourceLesson.listeningVi, 'Nắm ít nhất 4/5 thông tin chính.'),
        activity(`d${day}-exit`, 'quiz', 'Exit quiz', 15, 'Trộn từ vựng, trợ từ và mẫu câu của buổi.', 'Đạt 80% để hoàn thành buổi.'),
      ] },
    { half: 'B', title: `Bài ${sourceLesson.number}B · Luyện dùng trong tình huống`,
      subtitle: `${sourceLesson.objectiveVi} Buổi B tập trung gọi lại, sản xuất câu, nghe và Kaiwa.`,
      vocabulary: vocabulary.slice(cut), grammar: grammar.slice(grammarCut),
      focusItems: ['Từ mới nửa sau', ...grammar.slice(grammarCut).map((item) => item.pattern), 'Kaiwa', 'shadowing'],
      activities: (day) => [
        activity(`d${day}-recall`, 'review', 'Gọi lại không nhìn đáp án', 15, 'Nhận diện chữ và nghĩa hai chiều; ôn lại từ buổi A.', 'Đạt 80% trước khi mở bài mới.'),
        activity(`d${day}-vocab`, 'vocabulary', 'Từ vựng · Gọi tên', 15, 'Nhìn hình/tình huống rồi tự gọi từ; sau đó mới hiện gợi ý.', 'Mỗi từ gọi đúng ít nhất một lần.'),
        activity(`d${day}-grammar`, 'grammar', 'Ngữ pháp · Sản xuất', 25, sourceLesson.practiceVi[1] || sourceLesson.practiceVi[0], 'Hoàn thành 8 câu và nói hai câu cá nhân.'),
        activity(`d${day}-break`, 'break', 'Nghỉ chủ động', 10, 'Nghỉ mắt, nhắc lại ba mẫu câu không nhìn.', 'Hết bộ đếm nghỉ.'),
        activity(`d${day}-listen`, 'listening', 'Nghe và shadowing', 20, sourceLesson.listeningVi, 'Nghe hiểu 80% và shadowing hai lượt.'),
        activity(`d${day}-kaiwa`, 'speaking', 'Kaiwa theo vai', 20, sourceLesson.practiceVi[2] || 'Đổi vai và hoàn thành hội thoại.', 'Hoàn thành hai vai; phát âm mục tiêu đạt 75%.'),
        activity(`d${day}-exit`, 'quiz', 'Quiz tích hợp', 15, 'Trộn nghe, chọn phản hồi, sắp câu và nói một câu.', 'Đạt 85%; mục sai vào SRS.'),
      ] },
  ].map((session) => ({ ...session, sourceLesson }));
});

for (let week = 2; week <= 11; week += 1) {
  const contentSessions = lessonSessions.slice((week - 2) * 5, (week - 2) * 5 + 5);
  contentSessions.forEach((session, index) => {
    const day = nextDay++;
    days.push({ day, calendarDay: index + 1, week, phase: 'minna', lessonNumber: session.sourceLesson.number,
      lessonHalf: session.half, title: session.title, subtitle: session.subtitle, estimatedMinutes: 120,
      isCheckpoint: false, focusItems: session.focusItems, vocabulary: session.vocabulary, grammar: session.grammar,
      activities: session.activities(day), practiceVi: session.sourceLesson.practiceVi,
      kaiwaVi: session.sourceLesson.kaiwaVi, listeningVi: session.sourceLesson.listeningVi, rewards: rewards(false, week) });
  });
  const covered = [...new Set(contentSessions.map((item) => item.sourceLesson.number))];
  const day = nextDay++;
  days.push({ day, calendarDay: 6, week, phase: 'weekly-event', lessonNumber: null,
    title: `Event tuần ${week} · Minna bài ${covered[0]}–${covered[covered.length - 1]}`,
    subtitle: 'Bài kiểm tra tích hợp có thưởng; sai không mất tiến độ nhưng tự tạo nhiệm vụ sửa điểm yếu.',
    estimatedMinutes: 120, isCheckpoint: true, focusItems: ['Từ vựng hai chiều', 'ngữ pháp', 'nghe', 'đọc', 'Kaiwa'],
    vocabulary: contentSessions.flatMap((item) => item.vocabulary).slice(0, 24),
    grammar: contentSessions.flatMap((item) => item.grammar),
    activities: [
      activity(`d${day}-warm`, 'review', 'Khởi động SRS', 10, '10 câu từ lịch sử lỗi.', 'Hoàn thành.'),
      activity(`d${day}-vocab`, 'checkpoint', 'Thử thách từ vựng', 25, 'Chữ↔nghĩa, nghe, hình và chọn ngữ cảnh.', 'Đạt 80%.'),
      activity(`d${day}-grammar`, 'checkpoint', 'Thử thách ngữ pháp', 25, 'Trợ từ, chia dạng, sắp câu và chọn phản hồi.', 'Đạt 80%.'),
      activity(`d${day}-break`, 'break', 'Nghỉ bắt buộc', 10, 'Rời màn hình để phục hồi tập trung.', 'Hết bộ đếm nghỉ.'),
      activity(`d${day}-listen`, 'listening', 'Nghe tích hợp', 20, 'Ba đoạn ngắn dùng nội dung các bài trong tuần.', 'Đạt 4/5 câu.'),
      activity(`d${day}-read`, 'reading', 'Đọc tích hợp', 15, 'Một tin nhắn và một thông báo ngắn.', 'Đạt 4/5 câu.'),
      activity(`d${day}-speak`, 'speaking', 'Kaiwa phản xạ', 10, 'Chọn vai, phản hồi trong 5 giây.', 'Hoàn thành 6 lượt.'),
      activity(`d${day}-report`, 'review', 'Báo cáo và thưởng', 5, 'Vàng ≥90; bạc 80–89; đồng 65–79; dưới 65 tạo buổi sửa.', 'Lưu báo cáo tuần.'),
    ], practiceVi: ['Không bắt học lại phần đã thành thạo.'], kaiwaVi: [],
    listeningVi: 'Nội dung nghe mới từ phạm vi bài trong tuần.', rewards: rewards(true, week) });
}

const allVocabulary = minnaLessons.flatMap((sourceLesson) => sourceLesson.vocabulary.map((item) => toVocabulary(item, sourceLesson.number)));
const allGrammar = minnaLessons.flatMap((sourceLesson) => sourceLesson.grammar.map((item, index) => toGrammar(item, sourceLesson.number, index)));
const reviewPhases = [
  [12, 'consolidation', 'Củng cố từ vựng và Kanji nền N5', 'Gọi lại toàn bộ từ theo chủ đề, âm đọc và câu ngắn; sửa nhóm dễ nhầm.', [
    ['Danh từ: người, nơi, đồ vật', 'Phân loại, nghe và gọi tên không nhìn nghĩa.'], ['Động từ: nhóm và cặp hành động', 'Chia ます・て・ない・辞書・た theo cụm.'],
    ['Tính từ và trạng từ', 'Nhận diện loại từ, phủ định, quá khứ và mức độ.'], ['Số, thời gian và bộ đếm', 'Luyện cách đọc bất quy tắc bằng tình huống.'],
    ['Kanji nhận diện trong từ', 'Đọc từ quen thuộc; không học Kanji tách khỏi từ.']]],
  [13, 'grammar-review', 'Củng cố ngữ pháp và biến đổi câu', 'Kết nối 25 bài thành hệ thống thay vì nhớ từng mẫu rời.', [
    ['Trợ từ は・が・を・に・へ・で・と', 'Chọn theo vai trò và ý nghĩa trong tình huống.'], ['Các thể động từ N5', 'Chuyển dạng nhanh và dùng đúng mẫu đi kèm.'],
    ['Tính từ, danh từ và so sánh', 'Hiện tại, quá khứ, phủ định, nối và so sánh.'], ['Mệnh đề, thời điểm và điều kiện', 'Ôn bổ nghĩa danh từ, とき・と・たら・ても.'],
    ['Cho–nhận, mong muốn và ý kiến', 'Phân biệt hướng lợi ích, たい・ほしい・と思う.']]],
  [14, 'skills', 'Đọc và nghe theo chuẩn N5', 'Tăng tốc lấy thông tin trong thông báo, tin nhắn, hội thoại và chỉ dẫn.', [
    ['Đọc bảng biểu và thông báo', 'Quét giờ, giá, địa điểm, điều kiện trước khi đọc toàn câu.'], ['Đọc tin nhắn và email ngắn', 'Xác định người gửi, mục đích và việc cần làm.'],
    ['Nghe câu phản hồi nhanh', 'Chọn đáp lời phù hợp trong 5 giây.'], ['Nghe hội thoại có nhiệm vụ', 'Đọc lựa chọn trước, nghe mốc thông tin và loại nhiễu.'],
    ['Đọc–nghe tích hợp', 'Đối chiếu lịch, bản đồ, menu với nội dung nghe.']]],
  [15, 'mock', 'Thi thử và chiến lược thời gian', 'Làm hai đề mô phỏng, phân tích lỗi và sửa theo nguyên nhân.', [
    ['Mini mock 1 · Chữ và từ', 'Làm có giờ; phân loại lỗi âm đọc, ngữ cảnh, tốc độ.'], ['Mini mock 1 · Ngữ pháp và đọc', 'Giữ thời gian cho bài đọc, không mắc ở một câu.'],
    ['Mini mock 1 · Nghe', 'Dùng lần nghe duy nhất; ghi mốc thông tin.'], ['Phòng sửa lỗi cá nhân', 'Làm câu mới cùng kỹ năng, không lặp đáp án cũ.'],
    ['Full mock 1', 'Mô phỏng đủ phần, điều kiện gần ngày thi.']]],
  [16, 'final', 'Hoàn thiện và chứng nhận N5', 'Đóng lỗ hổng cuối, làm full mock cuối và tạo kế hoạch duy trì.', [
    ['Top 30 lỗi cá nhân', 'Ôn theo xác suất quên và mức ảnh hưởng điểm.'], ['Phản xạ từ và chia dạng', 'Chuỗi ngắn có thời gian, dừng trước khi mệt.'],
    ['Nghe điểm yếu cuối', 'Luyện đúng loại câu hỏi thường sai.'], ['Full mock 2', 'Đề mới hoàn toàn, đo độ ổn định.'],
    ['Buổi nhẹ trước tốt nghiệp', 'Ôn ngắn, nghe dễ, chuẩn bị tâm lý và lịch duy trì.']]],
].map(([week, phase, title, goal, sessions]) => ({ week, phase, title, goal, sessions }));

reviewPhases.forEach((definition) => {
  definition.sessions.forEach(([title, instruction], index) => {
    const day = nextDay++;
    const start = ((definition.week - 12) * 5 + index) * 24;
    const selectedVocab = Array.from({ length: Math.min(24, allVocabulary.length) }, (_, offset) => allVocabulary[(start + offset * 7) % allVocabulary.length]);
    const selectedGrammar = Array.from({ length: Math.min(6, allGrammar.length) }, (_, offset) => allGrammar[(start + offset * 5) % allGrammar.length]);
    days.push({ day, calendarDay: index + 1, week: definition.week, phase: definition.phase, lessonNumber: null,
      title: `${definition.title} · ${title}`, subtitle: instruction, estimatedMinutes: 120,
      isCheckpoint: definition.phase === 'mock' && title.startsWith('Full'), focusItems: [title, 'SRS cá nhân', 'kỹ năng làm bài'],
      vocabulary: selectedVocab, grammar: selectedGrammar,
      activities: [
        activity(`d${day}-srs`, 'review', 'SRS cá nhân', 15, 'Ôn đúng nhóm sắp quên hoặc hay sai.', 'Mục yếu đúng lại hai lần.'),
        activity(`d${day}-core`, definition.phase === 'skills' ? 'reading' : definition.phase === 'mock' ? 'checkpoint' : 'quiz', title, 35, instruction, 'Đạt mục tiêu riêng của buổi.'),
        activity(`d${day}-analysis`, 'review', 'Phân tích lỗi', 15, 'Gắn nguyên nhân: chưa biết, nhầm, đọc sót, nghe sót, thiếu thời gian.', 'Mỗi lỗi có hành động sửa.'),
        activity(`d${day}-break`, 'break', 'Nghỉ bắt buộc', 10, 'Rời màn hình và nghỉ mắt.', 'Hết bộ đếm nghỉ.'),
        activity(`d${day}-listen`, 'listening', 'Nghe có mục tiêu', 20, 'Nghe câu/hội thoại N5 mới, không lặp nội dung sách.', 'Đạt 80%.'),
        activity(`d${day}-transfer`, 'quiz', 'Chuyển giao sang câu mới', 20, 'Giải câu mới cùng kỹ năng vừa sửa.', 'Đúng ba câu liên tiếp.'),
        activity(`d${day}-report`, 'review', 'Exit report', 5, 'Cập nhật độ thành thạo và lịch ôn.', 'Lưu báo cáo.'),
      ], practiceVi: [instruction], kaiwaVi: [], listeningVi: 'Bài nghe gốc của app theo phạm vi N5.', rewards: rewards(false, definition.week) });
  });
  const day = nextDay++;
  days.push({ day, calendarDay: 6, week: definition.week, phase: 'weekly-event', lessonNumber: null,
    title: definition.week === 16 ? 'Event tốt nghiệp N5' : `Event tuần ${definition.week} · ${definition.title}`,
    subtitle: definition.week === 16 ? 'Đề tổng kết, báo cáo năng lực và mở chứng nhận hoàn thành lộ trình.' : 'Thử thách tổng hợp và nhận thưởng tuần.',
    estimatedMinutes: 120, isCheckpoint: true, focusItems: ['đúng', 'ổn định', 'tốc độ', 'sửa điểm yếu'],
    vocabulary: allVocabulary.slice((definition.week - 12) * 30, (definition.week - 12) * 30 + 30),
    grammar: allGrammar.slice((definition.week - 12) * 8, (definition.week - 12) * 8 + 8),
    activities: [
      activity(`d${day}-vocab`, 'checkpoint', 'Từ vựng', 25, 'Nhận diện, nghe và dùng trong câu.', 'Đạt 80%.'),
      activity(`d${day}-grammar`, 'checkpoint', 'Ngữ pháp–đọc', 30, 'Chia dạng, sắp câu và đọc ngắn.', 'Đạt 80%.'),
      activity(`d${day}-break`, 'break', 'Nghỉ bắt buộc', 10, 'Rời màn hình.', 'Hết bộ đếm nghỉ.'),
      activity(`d${day}-listen`, 'listening', 'Nghe', 25, 'Nghe theo dạng N5.', 'Đạt 80%.'),
      activity(`d${day}-repair`, 'review', 'Sửa tức thì', 20, 'Làm câu mới cùng nguyên nhân lỗi.', 'Đúng lại hai lần.'),
      activity(`d${day}-reward`, 'checkpoint', 'Báo cáo và thưởng', 10, 'Trao hạng và phần thưởng theo kết quả.', 'Lưu báo cáo.'),
    ], practiceVi: ['Vàng ≥90; bạc 80–89; đồng 65–79; dưới 65 nhận buổi sửa không phạt tiến độ.'],
    kaiwaVi: [], listeningVi: 'Bài nghe mới theo phạm vi N5.', rewards: rewards(true, definition.week) });
});

const weekTitles = {
  1: ['Kana trong 7 ngày', 'Đọc, nghe và viết Hiragana/Katakana; mở khóa N5.'],
  2: ['Minna bài 1–3', 'Giới thiệu, đồ vật, địa điểm và mua sắm.'], 3: ['Minna bài 3–5', 'Giờ giấc, sinh hoạt, ngày tháng và đi lại.'],
  4: ['Minna bài 6–8', 'Hành động, lời mời, công cụ, cho–nhận và tính từ.'], 5: ['Minna bài 8–10', 'Mô tả, sở thích, lý do, sự tồn tại và vị trí.'],
  6: ['Minna bài 11–13', 'Số lượng, so sánh, mong muốn và mục đích.'], 7: ['Minna bài 13–15', 'Mục đích, thể て, yêu cầu, xin phép và trạng thái.'],
  8: ['Minna bài 16–18', 'Chuỗi hành động, thể ない, nghĩa vụ và khả năng.'], 9: ['Minna bài 18–20', 'Khả năng, kinh nghiệm, thay đổi và thể thông thường.'],
  10: ['Minna bài 21–23', 'Ý kiến, mệnh đề bổ nghĩa, thời điểm và điều kiện と.'], 11: ['Minna bài 23–25', 'Chỉ đường, cho–nhận hành động và điều kiện たら・ても.'],
};
const weeks = Array.from({ length: 16 }, (_, index) => {
  const week = index + 1; const review = reviewPhases.find((item) => item.week === week);
  const [title, goal] = weekTitles[week] || [review.title, review.goal];
  return { week, title, goal, days: days.filter((day) => day.week === week) };
});
const curriculum = {
  id: 'jlpt-n5-minna-vi-complete-v1', version: 1, reviewScope: 'complete-vietnamese-master',
  targetFullCourseDays: days.length, weeklyStudySessions: 6, dailyTargetMinutes: 120,
  localePolicy: ['native-language', 'ja', 'en'], sourcePolicy: 'Minna I lesson order; original app examples, practice, kaiwa and listening',
  stats: { weeks: weeks.length, sessions: days.length, minnaLessons: minnaLessons.length,
    vocabularyEntries: allVocabulary.length, uniqueVocabularyEntries: new Set(allVocabulary.map((item) => `${item.japanese}|${item.reading}`)).size,
    grammarPoints: allGrammar.length },
  lessons: minnaLessons, weeks, days,
};
module.exports = curriculum;
module.exports.default = curriculum;
