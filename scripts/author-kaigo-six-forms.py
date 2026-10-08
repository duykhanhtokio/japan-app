"""Independent authored items; mechanical serialization/ruby/answer arrangement only.
Do not use source questions or noun-substitution templates as input.
"""
from pathlib import Path
import json, hashlib, random, re, copy
from fugashi import Tagger
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'docs/ssw-workspace/kaigo/drafts'
tagger=Tagger()
forms={}
def q(kind,n,section,pages,stem,vi,*options,passage='',passage_vi='',figure=None):
    assert len(options)==4
    opts=[o.split('¦') for o in options]
    assert all(len(o)==3 for o in opts)
    forms.setdefault((kind,n),[]).append(dict(sectionId=section,pages=pages,promptJa=stem,promptVi=vi,opts=opts,passageJa=passage,passageVi=passage_vi,figure=figure))

# Skills 02: fundamental care, bodies, communication, daily support, five visual judgements.
q('skills',2,'fundamentals',[10,13],'本人は封筒に宛名を書けますが、細かい文字が見えにくいと言います。自立を支える対応はどれですか。','Bác tự viết được địa chỉ nhưng khó đọc chữ nhỏ. Cách nào hỗ trợ tự lập?',
'表示を読みやすくし、本人が宛名を書く。¦Chuẩn bị chữ dễ đọc, để bác viết phần làm được.¦Điều chỉnh môi trường giúp dùng năng lực còn lại.',
'見えにくいので、宛名と本文をすべて代筆する。¦Viết thay cả địa chỉ và nội dung vì bác khó nhìn.¦Khó đọc không chứng minh không thể viết.',
'自分で書けるので、表示の調整はしない。¦Không chỉnh chữ vì bác tự viết được.¦Bỏ nhu cầu hỗ trợ tiếp cận thông tin.',
'家族に宛先を決めてもらい、本人に写してもらう。¦Để gia đình chọn nơi gửi rồi bác chép lại.¦Chuyển quyền lựa chọn sang gia đình.')
q('skills',2,'fundamentals',[16],'利用者の写真を研修で使いたい時、適切なのはどれですか。','Muốn dùng ảnh người sử dụng trong đào tạo, cần làm gì?',
'目的と共有範囲を説明し、同意と施設の手順を確認する。¦Giải thích mục đích, phạm vi chia sẻ và kiểm đồng ý, quy trình.¦Ảnh cá nhân cần xử lý theo đồng ý và quy trình.',
'施設内の研修なので、本人への確認は省く。¦Bỏ xác nhận vì đào tạo nội bộ.¦Nội bộ không tự thay đồng ý.',
'撮影の同意があれば、研修への使用も認められたとする。¦Coi đồng ý chụp là đồng ý dùng đào tạo.¦Mục đích sử dụng khác cần xác nhận.',
'名前を消せば、誰にでも自由に見せられる。¦Xóa tên rồi cho bất kỳ ai xem.¦Ảnh vẫn có thể nhận diện cá nhân.')
q('skills',2,'fundamentals',[20,21],'飲み込みに関する訓練を専門とする職種はどれですか。','Nghề chuyên môn nào phụ trách huấn luyện liên quan đến nuốt?',
'言語聴覚士。¦Chuyên viên ngôn ngữ và thính giác (ST).¦ST có chuyên môn giao tiếp và ăn–nuốt.',
'理学療法士。¦Chuyên viên vật lý trị liệu (PT).¦PT tập trung chức năng vận động.',
'介護支援専門員。¦Chuyên gia hỗ trợ chăm sóc.¦Vai trò chính là phối hợp kế hoạch, dịch vụ.',
'管理栄養士。¦Chuyên gia quản lý dinh dưỡng.¦Phụ trách dinh dưỡng, không phải chức danh huấn luyện nuốt.')
q('skills',2,'fundamentals',[22],'職員が利用者の自宅へ行って生活を支援するサービスはどれですか。','Nhân viên đến nhà người sử dụng hỗ trợ sinh hoạt là loại dịch vụ nào?',
'訪問型のサービス。¦Dịch vụ đến thăm tại nhà.¦Địa điểm hỗ trợ là nhà người sử dụng.',
'通所型のサービス。¦Dịch vụ đi đến cơ sở trong ngày.¦Người sử dụng đến cơ sở, khác tình huống.',
'入所型のサービス。¦Dịch vụ sống tại cơ sở.¦Không phải hỗ trợ tại nhà trong câu hỏi.',
'施設での短期宿泊サービス。¦Dịch vụ lưu trú ngắn tại cơ sở.¦Vẫn là lưu trú cơ sở, không phải nhân viên đến nhà.')
q('skills',2,'fundamentals',[24,115],'体温の記録に必要な情報はどれですか。','Thông tin nào cần trong ghi chép nhiệt độ?',
'測った日時、測定値、測定した条件。¦Ngày giờ, trị số và điều kiện đo.¦Giúp so sánh kết quả đúng bối cảnh.',
'本人の年齢だけと、職員の予想した原因。¦Chỉ tuổi và nguyên nhân nhân viên đoán.¦Không thay trị số và thời điểm đo.',
'前日の数値を、今日の数値として書いたもの。¦Chép trị số hôm qua thành hôm nay.¦Làm sai sự thật quan sát.',
'数値を省き、元気そうという印象だけ。¦Bỏ trị số, chỉ ghi trông khỏe.¦Ấn tượng không thay kết quả đo.')
q('skills',2,'fundamentals',[29],'標準予防策について正しい考え方はどれですか。','Cách hiểu đúng về phòng ngừa chuẩn là gì?',
'診断の有無に関係なく、血液や排せつ物に注意する。¦Dù chưa chẩn đoán nhiễm bệnh, vẫn xét nguy cơ từ máu, chất bài tiết.¦Không dựa riêng vào có hay không chẩn đoán để phòng ngừa.',
'感染症と分かった人の血液だけに注意する。¦Chỉ lưu ý máu của người đã biết nhiễm bệnh.¦Bỏ nguy cơ chưa được phát hiện.',
'透明な体液なら、素手で扱ってよい。¦Dịch trong suốt thì dùng tay trần được.¦Màu không chứng minh không có nguy cơ.',
'手袋をしていれば、汚れた場所から清潔な場所へ続けて触れる。¦Mang găng thì chạm liên tiếp chỗ bẩn và sạch.¦Găng có thể mang nhiễm bẩn sang vùng sạch.')
q('skills',2,'fundamentals',[34],'腰への負担を減らすための業務上の対応はどれですか。','Cách làm việc nào giảm gánh nặng cho lưng?',
'必要な人数と用具を確認し、無理な持ち上げを避ける。¦Kiểm số người, dụng cụ cần và tránh nâng quá sức.¦Tổ chức hỗ trợ phù hợp thay vì dùng sức một mình.',
'慣れた作業なら、重さに関係なく一人で持ち上げる。¦Quen việc thì nâng một mình bất kể nặng nhẹ.¦Quen việc không loại nguy cơ quá sức.',
'腰が痛くても、予定の介助を同じ方法で続ける。¦Đau lưng vẫn tiếp tục cách hỗ trợ cũ.¦Cần báo và điều chỉnh, không bỏ qua tình trạng.',
'用具を取りに行く手間を省き、腕の力だけで支える。¦Bỏ lấy dụng cụ, chỉ dùng sức tay.¦Tiện lợi không thay biện pháp giảm tải.')
q('skills',2,'fundamentals',[10,12],'車いすを使う人も地域の集まりに参加できるよう入口を整える考え方はどれですか。','Điều chỉnh lối vào để người dùng xe lăn tham gia sinh hoạt cộng đồng thể hiện điều gì?',
'障害の有無にかかわらず地域で暮らす機会を支える。¦Hỗ trợ cơ hội sống trong cộng đồng dù có hay không khuyết tật.¦Môi trường tiếp cận giúp tham gia bình đẳng.',
'障害がある人は、地域活動とは別の場所に限定する。¦Giới hạn người khuyết tật ở nơi riêng.¦Tạo tách biệt thay vì cơ hội tham gia.',
'家族が参加すれば、本人の参加は不要と考える。¦Gia đình tham gia rồi thì bác không cần.¦Gia đình không thay quyền tham gia của bác.',
'入口を変えず、本人が使う用具をやめてもらう。¦Không chỉnh lối vào, yêu cầu bỏ dụng cụ.¦Đặt rào cản lên người thay vì điều chỉnh môi trường.')
q('skills',2,'fundamentals',[16],'居室の清掃中、個人宛ての手紙を見つけました。適切なのはどれですか。','Khi dọn phòng thấy thư riêng, cách xử lý phù hợp là gì?',
'中身を読まず、扱い方を本人に確かめる。¦Không đọc nội dung, hỏi bác cách xử lý.¦Thư riêng thuộc đời tư và lựa chọn của bác.',
'重要か判断するため、先に中身を読む。¦Đọc trước để biết quan trọng không.¦Tự đọc vượt phạm vi dọn dẹp.',
'片付けの依頼があるので、古い手紙は捨てる。¦Được nhờ dọn nên vứt thư cũ.¦Nhờ dọn không đồng nghĩa đồng ý vứt.',
'本人に聞かず、家族への連絡用に写真を撮る。¦Chụp gửi gia đình mà không hỏi.¦Tạo thêm sử dụng thông tin chưa đồng ý.')
q('skills',2,'fundamentals',[118],'同僚から新しい介助方法を頼まれましたが、内容を理解できていません。適切なのはどれですか。','Đồng nghiệp nhờ cách hỗ trợ mới nhưng bạn chưa hiểu, nên làm gì?',
'開始前に内容と自分の役割を確認する。¦Kiểm nội dung và vai trò của mình trước khi bắt đầu.¦Không thực hiện thao tác khi chưa hiểu trách nhiệm.',
'理解したと答え、介助中に推測して合わせる。¦Nói đã hiểu rồi đoán trong khi làm.¦Che giấu phần chưa hiểu gây rủi ro.',
'前に似た作業をしたので、今回も同じとする。¦Coi giống việc trước vì từng làm gần giống.¦Tình huống mới cần xác nhận.',
'利用者の前で始めてから、手順の意味を聞く。¦Bắt đầu rồi mới hỏi ý nghĩa quy trình.¦Xác nhận phải trước phần phụ thuộc chưa hiểu.')
q('skills',2,'mind_body',[53],'中枢神経に含まれる組合せはどれですか。','Cặp bộ phận nào thuộc thần kinh trung ương?',
'脳と脊髄。¦Não và tủy sống.¦Hai bộ phận chính của thần kinh trung ương.',
'脳と末梢の感覚神経。¦Não và dây cảm giác ngoại biên.¦Dây ngoại biên không thuộc trung ương.',
'脊髄と手の筋肉。¦Tủy sống và cơ bàn tay.¦Cơ không phải thần kinh trung ương.',
'心臓と自律神経。¦Tim và thần kinh tự chủ.¦Tim không thuộc thần kinh trung ương.')
q('skills',2,'mind_body',[46],'暑い時に発汗して体温を調整する働きに関係するものはどれですか。','Tiết mồ hôi khi nóng để điều chỉnh thân nhiệt liên quan đến gì?',
'恒常性。¦Hằng tính nội môi.¦Cơ thể điều chỉnh để giữ trạng thái tương đối ổn định.',
'見当識。¦Định hướng thời gian, nơi chốn.¦Là chức năng nhận thức, không cơ chế điều hòa thân nhiệt.',
'実行機能。¦Chức năng thực hành.¦Liên quan tổ chức hành động.',
'エピソード記憶。¦Trí nhớ sự kiện.¦Ghi nhớ trải nghiệm không phải cơ chế tiết mồ hôi.')
q('skills',2,'mind_body',[58],'耳で受けた振動を神経の信号へ変える部位はどれですか。','Bộ phận tai nào chuyển rung động thành tín hiệu thần kinh?',
'蝸牛。¦Ốc tai.¦Chuyển rung động thành tín hiệu.',
'鼓膜。¦Màng nhĩ.¦Nhận dao động âm thanh, không phải bộ phận chuyển tín hiệu hỏi ở đây.',
'耳小骨。¦Xương con tai.¦Truyền, khuếch đại dao động.',
'網膜。¦Võng mạc.¦Thuộc mắt, không tai.')
q('skills',2,'mind_body',[62],'栄養素の吸収に主に関わる消化管はどれですか。','Đoạn ống tiêu hóa chủ yếu hấp thụ chất dinh dưỡng là gì?',
'小腸。¦Ruột non.¦Đây là vị trí chính hấp thụ dinh dưỡng.',
'食道。¦Thực quản.¦Chủ yếu vận chuyển thức ăn.',
'直腸。¦Trực tràng.¦Liên quan tích phân và nhu cầu đại tiện.',
'口腔。¦Khoang miệng.¦Nhai và trộn thức ăn, không vị trí hấp thụ chính.')
q('skills',2,'mind_body',[94],'認知症の人が、作業の順番を組み立てることに困っています。関連する障害はどれですか。','Người sa sút trí tuệ khó tổ chức thứ tự công việc, liên quan rối loạn nào?',
'実行機能障害。¦Rối loạn chức năng thực hành.¦Khó tổ chức và tiến hành chuỗi hành động.',
'見当識障害。¦Rối loạn định hướng.¦Khó nhận thời gian, nơi, người.',
'聴覚障害。¦Khiếm thính.¦Câu không mô tả khó nghe.',
'視野の障害。¦Rối loạn thị trường.¦Câu không cung cấp dấu hiệu vùng nhìn.')
q('skills',2,'mind_body',[68,70],'高齢者の体調を見る時の注意として適切なのはどれですか。','Cần lưu ý gì khi quan sát sức khỏe người cao tuổi?',
'症状が典型的でなくても、普段と比べる。¦Dù không có triệu chứng điển hình, vẫn kiểm thay đổi so với thường ngày.¦Biểu hiện có thể không điển hình và có khác biệt cá nhân.',
'熱がなければ、体調の変化はないと判断する。¦Không sốt thì kết luận không đổi tình trạng.¦Một dấu hiệu không loại mọi thay đổi.',
'同じ年齢なら、全員の基準値は同じと考える。¦Cùng tuổi thì trị số nền giống nhau.¦Bỏ khác biệt cá nhân.',
'食べた量だけで、心身の状態をすべて判断する。¦Chỉ dựa lượng ăn kết luận toàn tình trạng.¦Cần nhiều thông tin, không một chỉ số.')
q('skills',2,'communication',[102,104],'本人が「今日は人の多い所で疲れました」と話しました。傾聴する返答はどれですか。','Bác nói hôm nay mệt ở nơi đông người. Câu nào thể hiện lắng nghe?',
'疲れたのですね。どの時に感じましたか。¦Bác mệt phải không. Bác cảm thấy vậy lúc nào?¦Nhắc lại đúng ý và mở cơ hội nói thêm.',
'人が嫌いなのですね。参加はやめましょう。¦Bác ghét người đông, dừng tham gia nhé.¦Thêm kết luận và quyết định bác chưa nói.',
'次は楽しいはずなので、気にしないでください。¦Lần sau vui thôi, bác đừng để ý.¦Bỏ trải nghiệm hiện tại.',
'疲れた理由は分かりました。もう説明は不要です。¦Tôi hiểu nguyên nhân, không cần nói thêm.¦Chưa hỏi đủ mà tự kết luận.')
q('skills',2,'communication',[108],'見えにくい人に初めて声をかける時、適切なのはどれですか。','Lần đầu bắt chuyện với người khó nhìn, nên làm gì?',
'本人を呼び、名前と役割を名乗る。¦Gọi tên bác, giới thiệu tên và vai trò mình.¦Giúp biết ai đang nói chuyện trước hỗ trợ.',
'手を握ってから、誰かを当ててもらう。¦Nắm tay rồi để đoán ai.¦Chạm bất ngờ, thiếu giới thiệu.',
'近くに立ち、視線が合うまで黙って待つ。¦Đứng gần im lặng chờ nhìn vào mắt.¦Không cung cấp thông tin tiếp cận bằng lời.',
'家族にだけ説明し、本人への紹介は省く。¦Chỉ giải thích gia đình, bỏ giới thiệu bác.¦Bác là người trực tiếp giao tiếp.')
q('skills',2,'communication',[115],'本人の発言と職員の観察を分けた記録はどれですか。','Ghi chép nào phân biệt lời bác và quan sát của nhân viên?',
'本人は「足が重い」と発言。職員は足首の腫れを観察。¦Bác nói chân nặng; nhân viên thấy cổ chân sưng.¦Ghi rõ nguồn từng thông tin.',
'足が重いと言ったので、病名は心臓病と確定。¦Nói chân nặng nên xác định bệnh tim.¦Tự chẩn đoán từ dữ kiện không đủ.',
'職員が腫れを見たので、本人も痛いと言った。¦Thấy sưng nên ghi bác nói đau.¦Biến quan sát thành lời chưa nói.',
'本人の発言は感想なので、記録から除いた。¦Lời bác là cảm nhận nên loại khỏi ghi chép.¦Trải nghiệm chủ quan vẫn là dữ liệu cần.')
q('skills',2,'communication',[118],'申し送りで聞き取れなかった時刻があります。適切なのはどれですか。','Không nghe rõ một giờ trong bàn giao, nên làm gì?',
'聞き取れなかった時刻を伝え、再確認する。¦Nói giờ chưa nghe rõ và hỏi lại.¦Xác nhận điểm thiếu thay vì đoán.',
'前日の時刻と同じだと考えて記録する。¦Ghi theo giờ hôm qua.¦Không có bằng chứng hai ngày giống.',
'話の流れから時刻を決め、後で知らせる。¦Tự suy giờ từ nội dung rồi báo sau.¦Suy đoán không thay xác nhận.',
'他の内容が分かったので、時刻の確認は省く。¦Hiểu phần khác rồi nên bỏ giờ.¦Phần chưa hiểu vẫn ảnh hưởng hành động.')
q('skills',2,'physical_care',[120,121],'食堂へ歩く以外に、移動の支援が生活へもたらす意味はどれですか。','Ngoài đến phòng ăn, hỗ trợ di chuyển có ý nghĩa gì?',
'本人が行きたい場所や活動に関わる機会を増やす。¦Tăng cơ hội đến nơi, tham gia hoạt động bác muốn.¦Di chuyển gắn với phạm vi sống và tham gia.',
'到着したら、本人の満足を確認する必要がなくなる。¦Đến nơi rồi không cần hỏi hài lòng.¦Đến nơi không chứng minh đáp ứng nguyện vọng.',
'毎回同じ道なら、障害物の確認を省ける。¦Cùng đường thì bỏ kiểm vật cản.¦Môi trường có thể thay đổi.',
'歩ける人には、用具を使う希望を聞かなくてよい。¦Người đi được thì không hỏi muốn dùng dụng cụ.¦Khả năng và nhu cầu hỗ trợ phải xét cá nhân.')
q('skills',2,'physical_care',[124],'背中が下で、顔が上を向く寝姿勢はどれですか。','Tư thế nằm lưng ở dưới, mặt hướng lên gọi là gì?',
'仰臥位。¦Nằm ngửa.¦Đúng mô tả hướng thân và mặt.',
'腹臥位。¦Nằm sấp.¦Bụng ở dưới.',
'側臥位。¦Nằm nghiêng.¦Một bên thân ở dưới.',
'端座位。¦Ngồi mép giường buông chân.¦Là tư thế ngồi, không nằm.')
q('skills',2,'physical_care',[127],'仙骨部に新しい赤みを見つけました。適切なのはどれですか。','Phát hiện vùng xương cùng mới đỏ, nên làm gì?',
'見つけた部位と状態を医療職へ報告する。¦Báo bộ phận và tình trạng cho nhân viên y tế.¦Đỏ mới cần đánh giá phù hợp, không tự kết luận.',
'本人が痛くないと言えば、記録を省く。¦Bác không đau thì bỏ ghi chép.¦Không đau không xóa quan sát đỏ.',
'赤い部分を強くこすって、血行を良くする。¦Chà mạnh vùng đỏ để tăng tuần hoàn.¦Không tự dùng thao tác có thể tổn thương.',
'色だけで原因を決め、自己判断で薬を塗る。¦Tự xác định nguyên nhân và bôi thuốc.¦Vượt dữ kiện và trách nhiệm chăm sóc.')
q('skills',2,'physical_care',[127],'褥瘡の危険を考える時、確認する寝具の状態はどれですか。','Xét nguy cơ loét tì đè cần kiểm tình trạng nào của đồ giường?',
'皮膚に当たるしわや湿り、体への圧迫。¦Nếp nhăn, ẩm chạm da và áp lực lên cơ thể.¦Liên quan ma sát, ẩm và tì đè.',
'掛け布団の色が、隣の人とそろっているか。¦Màu chăn có giống người bên cạnh không.¦Không phải yếu tố tì đè hỏi ở đây.',
'洗濯した日付だけで、今の状態は見ない。¦Chỉ ngày giặt, không xem hiện trạng.¦Ngày giặt không thay kiểm trực tiếp.',
'本人が選んだ寝具なので、しわは確認しない。¦Bác chọn nên không kiểm nhăn.¦Tôn trọng sở thích vẫn cần an toàn.')
q('skills',2,'physical_care',[145],'食べ物を口に入れる前に、色やにおいから食べ物だと分かる段階はどれですか。','Nhận thức thức ăn qua màu, mùi trước đưa vào miệng là giai đoạn nào?',
'先行期。¦Giai đoạn nhận biết trước ăn.¦Nhận thức thức ăn trước nhai và nuốt.',
'準備期。¦Giai đoạn chuẩn bị.¦Trong quá trình nuốt, giai đoạn này nhai tạo viên thức ăn.',
'咽頭期。¦Giai đoạn hầu họng.¦Thức ăn đi qua họng khi nuốt.',
'食道期。¦Giai đoạn thực quản.¦Vận chuyển xuống dạ dày.')
q('skills',2,'physical_care',[146,149],'同じ献立でも食事形態が利用者ごとに違います。配膳時に適切なのはどれですか。','Cùng thực đơn nhưng dạng thức ăn khác mỗi người, cần làm gì?',
'本人の食事指示とトレー表示を照合する。¦Đối chiếu chỉ dẫn của bác và nhãn khay.¦Cùng thực đơn không chứng minh dạng thức ăn phù hợp.',
'料理名が同じなら、形態の違いは確認しない。¦Tên món giống thì bỏ kiểm dạng.¦Dạng liên quan khả năng ăn–nuốt.',
'本人が希望したら、職員だけで形態を変更する。¦Bác muốn thì nhân viên tự đổi dạng.¦Cần xác nhận chỉ dẫn và người phụ trách.',
'見た目が柔らかければ、全員に同じ物を出す。¦Trông mềm thì phục vụ như nhau.¦Quan sát bề ngoài không thay kế hoạch cá nhân.')
q('skills',2,'physical_care',[150,151],'食事の途中で本人が「少し休みたい」と話しました。適切なのはどれですか。','Giữa bữa bác muốn nghỉ một chút, nên làm gì?',
'食べるのをいったん止め、状態と希望を確認する。¦Tạm dừng ăn, kiểm tình trạng và mong muốn.¦Điều chỉnh theo bác, không ép tốc độ.',
'残りが少ないので、続けて口へ運ぶ。¦Còn ít nên tiếp tục đưa vào miệng.¦Bỏ nhu cầu dừng và quan sát an toàn.',
'休みたいと言ったので、食事が終わったと記す。¦Muốn nghỉ nên ghi bữa đã kết thúc.¦Nghỉ tạm không đồng nghĩa kết thúc.',
'返事を待たず、食事の量を自分で増やす。¦Không chờ trả lời, tự tăng lượng ăn.¦Không theo mong muốn và tình trạng.')
q('skills',2,'physical_care',[148],'本人はスプーンを持てますが、皿が動いて食べにくいと言います。検討する用具はどれですか。','Bác cầm thìa được nhưng đĩa trượt gây khó ăn. Dụng cụ nào nên xét?',
'皿の下に置く滑り止めマット。¦Tấm chống trượt đặt dưới đĩa.¦Nhắm đúng vấn đề đĩa di chuyển.',
'飲み物用の取っ手付きコップ。¦Cốc có quai cho đồ uống.¦Không giải quyết đĩa trượt.',
'衣服用の大きなボタン。¦Cúc áo lớn.¦Thuộc thay đồ, không vấn đề ăn.',
'歯磨き用のスポンジブラシ。¦Bàn chải mút vệ sinh miệng.¦Không giữ đĩa ổn định.')
q('skills',2,'physical_care',[153],'腎臓で作られた尿を膀胱へ運ぶ管はどれですか。','Ống đưa nước tiểu từ thận đến bàng quang là gì?',
'尿管。¦Niệu quản.¦Nối thận với bàng quang.',
'尿道。¦Niệu đạo.¦Đưa nước tiểu từ bàng quang ra ngoài.',
'食道。¦Thực quản.¦Vận chuyển thức ăn.',
'気管。¦Khí quản.¦Thuộc đường hô hấp.')
q('skills',2,'physical_care',[156,159],'いつもと違う水のような便が出ました。報告に適切なのはどれですか。','Phân dạng nước khác thường ngày, báo thế nào phù hợp?',
'排便の時刻、便の様子、本人の訴えを伝える。¦Báo giờ đại tiện, dạng phân và lời bác.¦Cung cấp sự thật để nhân viên y tế đánh giá.',
'一度の便だけで、感染症の病名を断定する。¦Chỉ một lần phân mà khẳng định bệnh nhiễm.¦Không đủ dữ kiện chẩn đoán.',
'昨日は普通だったので、今日も普通と伝える。¦Hôm qua bình thường nên báo hôm nay như vậy.¦Bỏ thay đổi đã thấy.',
'他の人と同じ便だったと、見ずに記録する。¦Không xem mà ghi giống người khác.¦Không phải quan sát thực.')
q('skills',2,'physical_care',[160,161],'トイレの場所が分からず困っている人への支援はどれですか。','Người khó tìm nhà vệ sinh cần hỗ trợ thế nào?',
'場所を分かりやすく示し、必要な移動支援を確認する。¦Chỉ nơi dễ hiểu và kiểm hỗ trợ di chuyển cần.¦Giải quyết rào cản nhận biết và đi tới nơi.',
'排尿の感覚がない人だと決める。¦Kết luận bác không cảm giác buồn tiểu.¦Khó tìm nơi không chứng minh mất cảm giác.',
'場所を覚えるまで、排せつを待ってもらう。¦Chờ đến khi nhớ nơi mới đi vệ sinh.¦Bỏ nhu cầu và hỗ trợ hiện tại.',
'迷ったので、今後は必ずおむつを使うと決める。¦Tự quyết từ nay luôn dùng tã.¦Không đánh giá khả năng và mong muốn cá nhân.')
q('skills',2,'physical_care',[167,168,169],'おむつ交換で汚れた物を扱った後、清潔な物へ触れる前に大切なのはどれですか。','Sau xử lý vật bẩn khi thay tã, trước chạm vật sạch cần gì?',
'手袋と手指衛生を適切に切り替える。¦Đổi găng, thực hiện vệ sinh tay phù hợp.¦Ngăn mang nhiễm bẩn từ khâu bẩn sang sạch.',
'同じ手袋のまま、清潔な物を先に用意する。¦Dùng găng cũ chuẩn bị vật sạch.¦Có thể nhiễm bẩn vật sạch.',
'手袋を外したら、手指衛生は必要ないとする。¦Tháo găng rồi coi không cần vệ sinh tay.¦Tháo găng không thay vệ sinh tay.',
'清潔な物に触れた後で、汚れの有無を見る。¦Chạm vật sạch rồi mới kiểm bẩn.¦Kiểm sau không ngăn lây nhiễm đã xảy ra.')
q('skills',2,'physical_care',[170,171],'整容が本人の生活へもたらす意味はどれですか。','Chỉnh trang có ý nghĩa gì với đời sống của bác?',
'好みや個性を表し、人との関わりにもつながる。¦Thể hiện sở thích, cá tính và hỗ trợ giao tiếp xã hội.¦Ý nghĩa ngoài việc sạch sẽ đơn thuần.',
'施設で同じ髪型にすれば、本人の選択は不要になる。¦Cùng kiểu tóc thì bác không cần chọn.¦Bỏ cá tính và quyền chọn.',
'清潔なら、外見についての希望は聞かなくてよい。¦Sạch rồi thì bỏ hỏi nguyện vọng diện mạo.¦Sở thích vẫn có ý nghĩa.',
'衣服を替えることだけで、健康状態も確認済みとなる。¦Thay áo là coi đã kiểm sức khỏe.¦Hoạt động chỉnh trang không tự thay quan sát.')
q('skills',2,'physical_care',[172,174],'右側に麻痺がある人が上着を着る時、一般的な原則はどれですか。','Người liệt bên phải mặc áo, nguyên tắc chung nào đúng?',
'動かしにくい右側から袖を通す。¦Xỏ tay áo bên phải khó cử động trước.¦Mặc bên liệt trước để giảm gánh nặng; cách hỗ trợ cụ thể theo kế hoạch.',
'左側から袖を通し、右側は強く引いて通す。¦Xỏ trái trước rồi kéo mạnh phải.¦Kéo mạnh tăng nguy cơ và ngược nguyên tắc.',
'着る時と脱ぐ時は、常に同じ側から始める。¦Mặc và cởi luôn bắt đầu cùng bên.¦Hai quá trình có nguyên tắc khác nhau.',
'本人が着たい服なら、麻痺の状態は考えなくてよい。¦Áo bác muốn thì không xét liệt.¦Sở thích không thay xét chức năng và an toàn.')
q('skills',2,'physical_care',[180,181],'爪の周囲に赤みと腫れがあります。爪のケアで適切なのはどれですか。','Da quanh móng đỏ và sưng, cần làm gì?',
'状態を医療職に報告し、ケアの方法を確認する。¦Báo y tế, xác nhận cách chăm sóc.¦Bất thường cần đánh giá, không tự cắt xử lý.',
'腫れた所まで深く切って、原因を取り除く。¦Cắt sâu đến chỗ sưng để bỏ nguyên nhân.¦Tự can thiệp có thể tổn thương.',
'本人が急ぐので、確認なしで普段どおり切る。¦Bác vội nên cắt như cũ không kiểm.¦Thời gian không thay kiểm bất thường.',
'痛みを聞いていないので、異常なしと記す。¦Chưa hỏi đau nên ghi không bất thường.¦Chưa hỏi không đồng nghĩa không đau, đã có dấu hiệu.')
q('skills',2,'physical_care',[182,183],'歯の有無に関わらず口腔を清潔にする主な目的はどれですか。','Dù còn hay mất răng, mục tiêu chính của giữ sạch khoang miệng là gì?',
'口の清潔を保ち、口腔内の細菌を減らす。¦Giữ sạch miệng và giảm vi khuẩn khoang miệng.¦Góp phần phòng vấn đề răng miệng và viêm phổi hít, không bảo đảm tuyệt đối.',
'食事をしない日は、口の清潔を確認しなくてよい。¦Ngày không ăn thì không cần kiểm vệ sinh miệng.¦Không ăn không loại nhu cầu vệ sinh.',
'歯がない人には、口腔ケアの目的がない。¦Không răng thì không có mục tiêu vệ sinh miệng.¦Niêm mạc, lưỡi và răng giả vẫn cần chăm sóc phù hợp.',
'歯磨きをすれば、飲み込みの状態は正常と分かる。¦Đánh răng xong chứng minh nuốt bình thường.¦Vệ sinh không phải kết quả đánh giá nuốt.')
q('skills',2,'physical_care',[184],'義歯を清潔に保つ対応はどれですか。','Cách giữ vệ sinh răng giả nào phù hợp?',
'本人用と確認し、材質と手順に合う方法で洗う。¦Xác nhận đúng răng giả của bác, rửa theo chất liệu, quy trình.¦Đúng chủ và phương pháp phù hợp, không tự áp cách cho mọi vật.',
'隣の人の義歯と一緒にし、形で見分ける。¦Trộn răng giả người bên cạnh rồi phân theo hình.¦Nguy cơ nhầm chủ và nhiễm bẩn.',
'汚れが見えなければ、毎回洗わず戻す。¦Không thấy bẩn thì trả lại không rửa.¦Bề ngoài không loại vi khuẩn.',
'どの義歯も、沸騰した湯だけで洗う。¦Mọi răng giả đều rửa nước sôi.¦Có thể làm hỏng vật liệu, không theo cách phù hợp.')
q('skills',2,'physical_care',[189],'入浴の前に室温を確認する理由として適切なのはどれですか。','Vì sao kiểm nhiệt độ phòng trước tắm?',
'脱衣所と浴室の急な温度差を小さくするため。¦Giảm chênh lệch nhiệt độ đột ngột giữa chỗ thay đồ và tắm.¦Điều chỉnh môi trường để giảm ảnh hưởng xấu của thay đổi nhiệt độ.',
'室温が合えば、本人の体調確認を省けるため。¦Phòng phù hợp thì bỏ kiểm sức khỏe.¦Môi trường không thay quan sát cá nhân.',
'室温だけで、湯温も同じと判断できるため。¦Từ nhiệt độ phòng biết nước cùng nhiệt.¦Hai đại lượng cần kiểm riêng.',
'前日に測れば、当日の測定は不要になるため。¦Đo hôm trước rồi hôm nay khỏi kiểm.¦Môi trường có thể thay đổi.')
q('skills',2,'physical_care',[196,197],'清拭中、まだ拭いていない部分への配慮はどれですか。','Trong lau người, nên làm gì với phần chưa lau?',
'必要な部分だけを出し、他の部分は覆う。¦Chỉ bộc lộ phần cần, che phần còn lại.¦Giữ riêng tư và tránh mất nhiệt.',
'手早く進めるため、初めから全身を出す。¦Bộc lộ toàn thân từ đầu để làm nhanh.¦Tăng lộ da và mất nhiệt.',
'本人が見えないので、覆う必要はないとする。¦Bác không nhìn thấy nên không cần che.¦Riêng tư và giữ ấm vẫn cần.',
'説明への同意があれば、覆い方の確認は省く。¦Đã đồng ý giải thích thì bỏ kiểm cách che.¦Đồng ý không bỏ biện pháp bảo vệ trong chăm sóc.')
q('skills',2,'physical_care',[198,200,202],'床の物を片付ける時、本人の生活を支える対応はどれですか。','Dọn vật dưới sàn thế nào vừa an toàn vừa tôn trọng đời sống?',
'安全と希望を確かめ、置き場所を相談する。¦Kiểm an toàn lối đi, hỏi mong muốn và bàn nơi đặt.¦Phối hợp an toàn với ý nghĩa đồ vật cho bác.',
'安全のためなら、本人の物はすべて廃棄する。¦Vì an toàn thì vứt hết đồ bác.¦Không cần thiết và bỏ đồng ý.',
'本人の物なので、転倒の危険があっても何もしない。¦Đồ bác nên có nguy cơ cũng không làm gì.¦Tôn trọng không đồng nghĩa bỏ an toàn.',
'見た目をそろえるため、毎日違う場所へ移す。¦Mỗi ngày chuyển nơi khác cho đẹp.¦Không xét khả năng tìm và thói quen bác.')
q('skills',2,'cbt_practical',[189],'図の浴室を使う前の対応はどれですか。','Trước dùng phòng tắm trong hình, cách xử lý nào phù hợp?',
'床の水と段差を確認し、安全な環境を整える。¦Kiểm nước trên sàn, bậc và chuẩn bị môi trường an toàn.¦Hai nguy cơ hiện rõ trong hình cần xử lý trước sử dụng.',
'手すりがあるので、床の水はそのままにする。¦Có tay vịn nên để nước trên sàn.¦Tay vịn không loại nguy cơ trượt.',
'湯温だけを確認し、段差は使用後に見る。¦Chỉ kiểm nước tắm, bậc xem sau.¦Nguy cơ di chuyển cần kiểm trước.',
'本人が入浴を希望したので、環境の確認を省く。¦Bác muốn tắm nên bỏ kiểm môi trường.¦Đồng ý không thay kiểm an toàn.',figure=('s02-bath','A: 濡れた床。B: 入口の段差。C: 手すり。','A: Sàn ướt; B: Bậc lối vào; C: Tay vịn.',['A  WET FLOOR','B  STEP AT ENTRY','C  HANDRAIL']))
q('skills',2,'cbt_practical',[161],'図の排せつ環境で、始める前に確認する点はどれですか。','Trong môi trường bài tiết ở hình, cần kiểm gì trước bắt đầu?',
'呼び出しボタンが本人から届くか確認する。¦Kiểm bác có với được nút gọi.¦Hình cho thấy nút ở ngoài tầm với, cần điều chỉnh theo kế hoạch.',
'ボタンが部屋にあれば、届くかは確認しない。¦Có nút trong phòng thì bỏ kiểm tầm với.¦Có dụng cụ không chứng minh sử dụng được.',
'カーテンがあるので、呼び出す方法は不要とする。¦Có rèm nên không cần cách gọi.¦Riêng tư không thay phương thức hỗ trợ.',
'座る前に押せたので、座った後も届くとする。¦Trước ngồi bấm được nên sau ngồi cũng được.¦Tầm với thay đổi theo tư thế.',figure=('s02-call','A: 本人の位置。B: 手の届く範囲。C: 範囲の外にある呼び出しボタン。','A: Vị trí bác; B: Tầm tay với; C: Nút gọi ngoài vùng đó.',['A  USER SEATED','B  REACH AREA','C  CALL BUTTON OUTSIDE B']))
q('skills',2,'cbt_practical',[201],'図の洗濯物を扱う判断はどれですか。','Xử lý đồ giặt trong hình thế nào?',
'汚れの種類に応じ、清潔な物と分けて手順を確認する。¦Phân loại theo vết bẩn, tách đồ sạch và kiểm quy trình.¦Đồ dính chất bài tiết cần tránh nhiễm bẩn đồ sạch.',
'全部白い布なので、同じかごにまとめる。¦Đều vải trắng nên cho cùng giỏ.¦Màu không thay phân biệt nhiễm bẩn.',
'乾いているので、汚れた布も清潔な布と扱う。¦Đã khô nên coi đồ bẩn như sạch.¦Khô không chứng minh sạch.',
'においだけで判断し、表示と汚れは確認しない。¦Chỉ ngửi, bỏ nhãn và vết bẩn.¦Không đủ thông tin xử lý.',figure=('s02-laundry','A: 清潔な布。B: 便で汚れた布。C: まだ分類していないかご。','A: Vải sạch; B: Vải dính phân; C: Giỏ chưa phân loại.',['A  CLEAN CLOTH','B  FAECES ON CLOTH','C  UNSORTED BASKET']))
q('skills',2,'cbt_practical',[146,149],'図の食事指示とトレーを見た判断はどれですか。','Đối chiếu chỉ dẫn ăn và khay trong hình, cần làm gì?',
'食事形態が指示と違うため、提供前に確認する。¦Dạng thức ăn khác chỉ dẫn, kiểm trước phục vụ.¦Đúng người nhưng dạng khác vẫn chưa phù hợp.',
'利用者番号が同じなので、そのまま提供する。¦Cùng mã bác nên phục vụ ngay.¦Mã đúng không chứng minh dạng đúng.',
'職員がその場で形態を変え、確認を省く。¦Nhân viên tự đổi dạng tại chỗ, bỏ xác nhận.¦Không tự điều chỉnh chỉ dẫn chuyên môn.',
'トレーが先に届いたので、指示をトレーに合わせる。¦Khay đến trước nên sửa chỉ dẫn theo khay.¦Đồ chuẩn bị không thay chỉ dẫn đã xác nhận.',figure=('s02-meal','指示: 利用者07、形態M。トレー: 利用者07、形態N。MとNは異なる食事形態です。','Chỉ dẫn: người 07, dạng M; khay: người 07, dạng N; M và N khác nhau.',['ORDER  ID 07 / M','TRAY  ID 07 / N','M AND N ARE DIFFERENT']))
q('skills',2,'cbt_practical',[200],'図の収納計画で、まだ決まっていないことはどれですか。','Trong kế hoạch cất đồ ở hình, việc nào chưa được quyết định?',
'箱Cの置き場所。¦Nơi đặt hộp C.¦Chỉ A và B có vị trí đã được bác chọn.',
'箱Aを棚へ置くこと。¦Đặt A lên kệ.¦Hình đã ghi bác chọn vị trí A.',
'箱Bを机へ置くこと。¦Đặt B lên bàn.¦Đã được ghi xác nhận.',
'AとBについて本人に確認したこと。¦Đã xác nhận A, B với bác.¦Thông tin đó có trong hình.',figure=('s02-storage','本人が確認済み: 箱Aは棚、箱Bは机。箱Cの置き場所は未確認。','Bác đã xác nhận: A lên kệ, B lên bàn; C chưa xác nhận.',['A  SHELF: CONFIRMED','B  DESK: CONFIRMED','C  LOCATION: UNCONFIRMED']))

# Skills 03 uses distinct decisions and mechanisms rather than renamed scenarios.
q('skills',3,'fundamentals',[10,12,13],'本人が活動を断りました。理由を聞いた後の対応で適切なのはどれですか。','Bác từ chối hoạt động, sau hỏi lý do cần làm gì?',
'意思を尊重し、別の過ごし方や必要な支援を相談する。¦Tôn trọng ý muốn, bàn cách sinh hoạt khác và hỗ trợ cần.¦Từ chối một hoạt động không mất quyền được hỗ trợ.',
'家族が勧めた活動なので、そのまま参加させる。¦Gia đình khuyên nên cho tham gia.¦Gia đình không thay quyết định của bác.',
'断ったので、その日の支援をすべて中止する。¦Từ chối rồi dừng mọi hỗ trợ trong ngày.¦Phạm vi từ chối không bao trùm mọi hỗ trợ.',
'理由を聞けば、職員の判断で意思を変更できる。¦Hỏi lý do xong nhân viên được đổi ý bác.¦Lắng nghe không chuyển quyền quyết định.')
q('skills',3,'fundamentals',[16],'廊下で利用者の病歴について話す前に、特に考えることはどれですか。','Trước trao đổi bệnh sử của bác ở hành lang cần lưu ý gì?',
'共有の必要性と、周囲に聞かれない場所かどうか。¦Sự cần thiết chia sẻ và nơi có bị người khác nghe không.¦Thông tin cần trao đổi trong phạm vi và môi trường phù hợp.',
'職員同士なら、周囲に誰がいても話せること。¦Nhân viên với nhau thì ai ở gần cũng nói được.¦Người ngoài có thể nghe thông tin riêng.',
'小声なら、同意や共有範囲は確認しなくてよいこと。¦Nói nhỏ thì không cần kiểm đồng ý, phạm vi.¦Âm lượng không thay quyền sử dụng thông tin.',
'病名を略して言えば、個人情報でなくなること。¦Viết tắt bệnh thì không còn dữ liệu cá nhân.¦Vẫn có thể gắn với cá nhân.')
q('skills',3,'fundamentals',[20,21],'利用者の食事内容と栄養の調整を相談する職種はどれですか。','Nghề nào để tham vấn điều chỉnh bữa ăn và dinh dưỡng?',
'管理栄養士。¦Chuyên gia quản lý dinh dưỡng.¦Có chuyên môn nội dung bữa ăn, dinh dưỡng.',
'理学療法士。¦Chuyên viên vật lý trị liệu.¦Chuyên môn chính về vận động.',
'作業療法士。¦Chuyên viên hoạt động trị liệu.¦Không phải chức danh phụ trách dinh dưỡng hỏi ở đây.',
'介護支援専門員。¦Chuyên gia hỗ trợ chăm sóc.¦Phối hợp dịch vụ không thay chuyên môn dinh dưỡng.')
q('skills',3,'fundamentals',[22],'利用者が朝に自宅から施設へ行き、夕方に帰るサービスはどれですか。','Sáng đi từ nhà đến cơ sở, chiều về nhà là dịch vụ loại nào?',
'通所型のサービス。¦Dịch vụ đi cơ sở ban ngày.¦Không sống tại cơ sở hay nhân viên đến nhà.',
'訪問型のサービス。¦Dịch vụ đến nhà.¦Nhân viên đến nhà thay vì bác đến cơ sở.',
'入所型のサービス。¦Dịch vụ nội trú.¦Có sinh sống tại cơ sở, khác đi về trong ngày.',
'自宅での夜間訪問サービス。¦Dịch vụ thăm nhà ban đêm.¦Địa điểm, thời gian không khớp tình huống.')
q('skills',3,'fundamentals',[24],'いつもより動作が遅いことに気づきました。最初の情報整理として適切なのはどれですか。','Thấy động tác chậm hơn thường ngày, bước tổng hợp thông tin nào đúng?',
'普段との違い、見た時刻、本人の言葉を分けて確認する。¦Kiểm thay đổi, giờ thấy và lời bác, phân biệt từng nguồn.¦Giữ sự thật để phối hợp đánh giá.',
'年齢だけを理由に、いつもと同じと記録する。¦Dựa tuổi ghi giống thường ngày.¦Bỏ thay đổi đã thấy.',
'動作だけで病名を確定し、本人に伝える。¦Từ động tác xác định bệnh và báo bác.¦Chưa đủ dữ kiện chẩn đoán.',
'理由が分かるまで、変化を誰にも知らせない。¦Chưa biết nguyên nhân thì không báo ai.¦Không cần đợi nguyên nhân để báo thay đổi.')
q('skills',3,'fundamentals',[29],'感染予防で、汚れた用具と清潔な用具を区別する理由はどれですか。','Vì sao phân biệt dụng cụ bẩn và sạch để phòng nhiễm?',
'汚れを清潔な場所や別の利用者へ運ばないため。¦Tránh mang bẩn tới vùng sạch, người khác.¦Ngăn truyền nhiễm bẩn giữa hoạt động.',
'同じ職員が使えば、分類しなくても安全だから。¦Một nhân viên dùng thì không phân cũng an toàn.¦Cùng người thao tác không loại truyền nhiễm.',
'見た目が同じなら、使用後も清潔だから。¦Trông giống thì sau dùng vẫn sạch.¦Mắt nhìn không xác nhận sạch.',
'手袋を付ければ、用具の汚れはなくなるから。¦Mang găng thì dụng cụ hết bẩn.¦Găng không làm sạch dụng cụ.')
q('skills',3,'fundamentals',[34],'勤務中に職員が強い疲労を感じています。安全な業務のための対応はどれですか。','Nhân viên mệt nhiều trong ca, ứng xử nào giúp công việc an toàn?',
'状態を担当者に伝え、休息や業務調整を相談する。¦Báo tình trạng, bàn nghỉ và điều chỉnh công việc.¦Quản lý sức khỏe nhân viên là phần của an toàn chăm sóc.',
'利用者の前では普通に見えるので、報告しない。¦Trông bình thường trước bác nên không báo.¦Bề ngoài không thay mức mệt thực.',
'疲れは個人の問題なので、無理な介助を続ける。¦Mệt là chuyện cá nhân nên tiếp tục hỗ trợ quá sức.¦Ảnh hưởng an toàn và chất lượng công việc.',
'同僚の予定を確認せず、担当をすべて任せて帰る。¦Chưa kiểm phân công đã giao hết rồi về.¦Cần phối hợp, tránh gián đoạn hỗ trợ.')
q('skills',3,'fundamentals',[16],'利用者を子供扱いする言葉や呼び方を避ける理由はどれですか。','Vì sao tránh lời, cách xưng hô coi người sử dụng như trẻ nhỏ?',
'一人の成人としての尊厳と希望する呼び方を尊重するため。¦Tôn trọng phẩm giá người trưởng thành và cách gọi họ muốn.¦Nhu cầu chăm sóc không làm mất tư cách cá nhân.',
'年齢が高い人には、誰でも同じ呼び方を使うため。¦Người cao tuổi đều dùng một cách gọi.¦Bỏ khác biệt và sở thích.',
'親しければ、本人の希望を聞く必要がないため。¦Thân rồi nên không cần hỏi cách gọi.¦Sự thân mật không thay nguyện vọng.',
'呼び方を変えるだけで、すべての同意が得られるため。¦Đổi cách gọi là có mọi đồng ý.¦Xưng hô không thay đồng ý cho từng hỗ trợ.')
q('skills',3,'fundamentals',[118],'事故の報告で原因がまだ分からない場合、適切なのはどれですか。','Khi chưa biết nguyên nhân sự cố, nên báo thế nào?',
'確認した経過と、原因が未確認であることを伝える。¦Báo diễn biến đã kiểm và nguyên nhân chưa xác nhận.¦Không che giấu cũng không biến giả thuyết thành sự thật.',
'報告の形を整えるため、最もありそうな原因を書く。¦Viết nguyên nhân có vẻ nhất để báo đủ.¦Suy đoán không phải sự thật.',
'原因欄が埋まるまで、必要な連絡を延期する。¦Chờ điền nguyên nhân mới liên lạc.¦Có thể làm chậm phản ứng cần.',
'誰も見ていなければ、事故ではなかったと記す。¦Không ai thấy thì ghi không có sự cố.¦Thiếu quan sát không xóa sự kiện đã phát hiện.')
q('skills',3,'fundamentals',[10,12],'生活の方針について本人と家族の希望が違います。介護職の対応はどれですか。','Bác và gia đình muốn khác nhau về sinh hoạt, người chăm sóc nên làm gì?',
'本人の意向を確かめ、関係者と相談して支援を考える。¦Kiểm ý bác, cùng người liên quan bàn hỗ trợ.¦Không tự ưu tiên gia đình hoặc bỏ phối hợp.',
'家族が費用を払うので、本人の意向は確認しない。¦Gia đình trả phí nên không hỏi bác.¦Chi trả không thay quyền tự quyết.',
'本人と家族の意見を聞かず、職員の便利さで決める。¦Không hỏi, quyết theo tiện nhân viên.¦Không lấy người sử dụng làm chủ thể.',
'意見が違うので、説明や相談をすべて中止する。¦Khác ý nên dừng mọi giải thích, tham vấn.¦Cần làm rõ và phối hợp thay vì bỏ hỗ trợ.')
q('skills',3,'mind_body',[55],'リラックスして休んでいる時に優位になりやすい神経はどれですか。','Khi thư giãn nghỉ ngơi, thần kinh nào dễ chiếm ưu thế?',
'副交感神経。¦Thần kinh đối giao cảm.¦Liên quan hoạt động nghỉ ngơi; không suy mọi chỉ số giống nhau.',
'交感神経。¦Thần kinh giao cảm.¦Thường liên quan hoạt động, căng thẳng.',
'視神経。¦Thần kinh thị giác.¦Truyền thông tin nhìn, không nhóm tự chủ hỏi ở đây.',
'聴神経。¦Thần kinh thính giác.¦Truyền tín hiệu nghe.')
q('skills',3,'mind_body',[44],'新しい職員の名前を初めて覚える働きはどれですか。','Lần đầu ghi nhớ tên nhân viên mới là hoạt động nào?',
'記銘。¦Ghi nhận thông tin mới.¦Giai đoạn tiếp nhận, ghi nhớ mới.',
'保持。¦Lưu giữ.¦Duy trì thông tin đã ghi nhớ.',
'想起。¦Hồi tưởng.¦Lấy thông tin đã lưu ra.',
'見当識。¦Định hướng.¦Nhận thời gian, nơi, người, không tên giai đoạn trí nhớ.')
q('skills',3,'mind_body',[57],'光の刺激を受け取る目の組織はどれですか。','Mô mắt tiếp nhận kích thích ánh sáng là gì?',
'網膜。¦Võng mạc.¦Tiếp nhận hình ảnh, tín hiệu được truyền qua thần kinh thị giác.',
'水晶体。¦Thủy tinh thể.¦Điều chỉnh hội tụ, không mô thụ nhận hỏi ở đây.',
'鼓膜。¦Màng nhĩ.¦Thuộc tai.',
'蝸牛。¦Ốc tai.¦Chuyển dao động âm thanh.')
q('skills',3,'mind_body',[59],'呼吸によって体へ取り入れるものと外へ出すものの組合せはどれですか。','Hô hấp đưa gì vào và thải gì ra?',
'酸素を取り入れ、二酸化炭素を出す。¦Nhận ôxy, thải cacbon điôxit.¦Đúng chức năng trao đổi khí.',
'二酸化炭素を取り入れ、酸素を出す。¦Nhận cacbon điôxit, thải ôxy.¦Đảo chiều chức năng chính.',
'栄養素を取り入れ、尿を出す。¦Nhận dinh dưỡng, thải nước tiểu.¦Thuộc tiêu hóa và tiết niệu.',
'食物を取り入れ、便を出す。¦Nhận thức ăn, thải phân.¦Không mô tả hô hấp.')
q('skills',3,'mind_body',[80],'本人の活動を考える時、身体機能だけでなく確認することはどれですか。','Xét hoạt động của bác, ngoài chức năng cơ thể cần kiểm gì?',
'環境、本人の希望、参加したい生活場面。¦Môi trường, mong muốn và tình huống đời sống muốn tham gia.¦ICF xem mối quan hệ chức năng, hoạt động, tham gia, bối cảnh.',
'診断名が同じ人に使った方法だけ。¦Chỉ cách đã dùng cho người cùng bệnh.¦Cùng bệnh không đồng nhất bối cảnh.',
'職員が一番早く終えられる順番だけ。¦Chỉ thứ tự nhân viên làm nhanh nhất.¦Không xét mục tiêu và môi trường bác.',
'できない動作だけで、生活全体を決めること。¦Chỉ động tác không làm được để quyết mọi sinh hoạt.¦Bỏ khả năng còn lại và tham gia.')
q('skills',3,'mind_body',[93,94,95],'認知症の行動・心理症状を考える時、適切なのはどれですか。','Xem xét triệu chứng hành vi, tâm lý trong sa sút trí tuệ thế nào?',
'身体の不調や周囲の環境、関わり方も確認する。¦Kiểm khó chịu cơ thể, môi trường, cách giao tiếp.¦Không chỉ gắn mọi hành vi với một nhãn bệnh.',
'認知症なら、行動の理由を考える必要はない。¦Có sa sút thì khỏi xét lý do hành vi.¦Nhu cầu, bối cảnh vẫn cần hiểu.',
'不安を話したら、すべて記憶障害と記録する。¦Nói lo thì ghi hết là rối loạn trí nhớ.¦Phân loại không khớp biểu hiện.',
'同じ診断なら、全員に同じ言葉だけを使う。¦Cùng chẩn đoán thì chỉ dùng một câu cho mọi người.¦Cần đáp theo cá nhân và tình huống.')
q('skills',3,'communication',[102,104],'本人が話し終わる前に、職員が何度も話題を変えています。改善する対応はどれですか。','Nhân viên liên tục đổi chủ đề trước khi bác nói xong, sửa thế nào?',
'話を遮らず、内容を確かめてから次の話へ進む。¦Không ngắt, xác nhận ý trước chuyển chủ đề.¦Cho người nói cơ hội diễn đạt đầy đủ.',
'時間を短くするため、職員が結論を言って終える。¦Nhân viên tự kết luận cho nhanh.¦Bỏ trải nghiệm, lời bác.',
'本人の話は聞かず、予定表だけを読み上げる。¦Không nghe, chỉ đọc lịch.¦Không trao đổi hai chiều.',
'質問を増やし、返答の途中にも次の質問をする。¦Thêm câu hỏi cả lúc chưa trả lời xong.¦Tiếp tục ngắt lời và tạo tải.')
q('skills',3,'communication',[102,108],'位置を説明する「そちらにあります」が伝わりません。適切な言い方はどれですか。','Nói ở đằng đó mà bác không hiểu, nên diễn đạt thế nào?',
'本人から見た方向と距離を、具体的な言葉で示す。¦Nói hướng theo bác và khoảng cách cụ thể.¦Thay chỉ trỏ mơ hồ bằng mốc rõ.',
'同じ言葉を大声で繰り返すだけにする。¦Chỉ lặp cùng câu to hơn.¦Âm lượng không giải quyết mốc vị trí thiếu.',
'職員の左右を、本人にも同じと考えて伝える。¦Coi trái phải mình cũng là của bác.¦Hướng phụ thuộc vị trí người.',
'分からない時は、説明せずに本人の手を動かす。¦Không hiểu thì không nói, tự di chuyển tay bác.¦Thiếu xác nhận và xin phép.')
q('skills',3,'communication',[115],'客観的な情報として記録できるものはどれですか。','Thông tin khách quan nào có thể ghi chép?',
'職員が測った体温の値。¦Trị số nhiệt độ nhân viên xác nhận.¦Là dữ liệu đo.',
'本人が感じている不安。¦Nỗi lo bác cảm thấy.¦Là thông tin chủ quan vẫn cần ghi, không phải khách quan hỏi ở đây.',
'職員が予想した転倒の原因。¦Nguyên nhân ngã nhân viên đoán.¦Là phán đoán chưa kiểm.',
'家族が希望した今後の生活。¦Mong muốn tương lai của gia đình.¦Là nguyện vọng, không trị số/quan sát hỏi ở đây.')
q('skills',3,'communication',[118],'相談への返事を同僚から受けました。伝達の誤りを減らす対応はどれですか。','Được đồng nghiệp trả lời tham vấn, làm gì giảm sai truyền đạt?',
'理解した内容と担当を言い返し、合っているか確かめる。¦Nhắc lại nội dung, phân công và kiểm đúng.¦Xác nhận hai chiều, không chỉ ghi nhớ riêng.',
'返事が来たので、確認せず実施済みと記録する。¦Có trả lời nên ghi đã làm.¦Trả lời không chứng minh thực hiện.',
'言い返すと失礼なので、不明な点も聞かない。¦Sợ bất lịch sự nên không hỏi cả chỗ chưa rõ.¦Xác nhận phù hợp giảm hiểu nhầm.',
'自分の予定に合わせ、返事の内容を変更して伝える。¦Sửa lời đáp theo lịch mình rồi truyền.¦Làm sai thông tin nguồn.')
q('skills',3,'physical_care',[121],'ADLとして分類される活動はどれですか。','Hoạt động nào thuộc ADL?',
'食事を口へ運んで食べること。¦Đưa thức ăn vào miệng và ăn.¦Hoạt động cơ bản hằng ngày.',
'銀行で生活費を管理すること。¦Quản lý sinh hoạt phí tại ngân hàng.¦Thuộc IADL.',
'店で食材を買いそろえること。¦Mua đủ nguyên liệu tại cửa hàng.¦Thuộc IADL.',
'電話で訪問の予定を調整すること。¦Điều chỉnh lịch thăm qua điện thoại.¦Thuộc hoạt động công cụ IADL.')
q('skills',3,'physical_care',[124],'体の右側を下にして横向きに寝る姿勢はどれですか。','Nằm nghiêng bên phải phía dưới là tư thế nào?',
'右側臥位。¦Nằm nghiêng phải.¦Tên dựa trên bên thân ở dưới.',
'左側臥位。¦Nằm nghiêng trái.¦Bên dưới ngược mô tả.',
'仰臥位。¦Nằm ngửa.¦Lưng ở dưới.',
'腹臥位。¦Nằm sấp.¦Bụng ở dưới.')
q('skills',3,'physical_care',[126],'長期の活動低下で筋力や関節の動きが低下することについて適切なのはどれですか。','Giảm hoạt động lâu khiến giảm sức cơ, vận động khớp: hiểu thế nào?',
'廃用症候群に関わる変化として、支援計画で考える。¦Xét là thay đổi liên quan hội chứng không sử dụng trong kế hoạch.¦Không chỉ nhìn một chức năng; hoạt động phù hợp cần đánh giá cá nhân.',
'休めば必ず改善するので、活動の検討は不要とする。¦Nghỉ là chắc tốt nên không xét hoạt động.¦Nghỉ kéo dài có thể làm giảm chức năng.',
'年齢が原因なので、生活の活動とは関係ないとする。¦Do tuổi nên không liên quan hoạt động.¦Bỏ ảnh hưởng của giảm sử dụng.',
'全員に同じ運動量を、確認なしで増やす。¦Tăng cùng lượng vận động mọi người không kiểm.¦Cần kế hoạch phù hợp sức khỏe, không áp đồng loạt.')
q('skills',3,'physical_care',[127],'褥瘡を予防する支援を考える時の組合せはどれですか。','Nhóm yếu tố nào cần xét khi phòng loét tì đè?',
'圧迫、皮膚の状態、活動、栄養の状態。¦Áp lực, da, hoạt động và dinh dưỡng.¦Cần xét nhiều yếu tố phối hợp.',
'寝具の色、部屋の番号、職員の年齢。¦Màu đồ giường, số phòng, tuổi nhân viên.¦Không là nhóm yếu tố tì đè.',
'本人の髪型、テレビ番組、洗剤の香り。¦Kiểu tóc, chương trình TV, mùi xà phòng.¦Không trực tiếp đáp nhóm hỏi.',
'食器の数、予定表の色、棚の高さ。¦Số bát, màu lịch, chiều cao kệ.¦Không đủ các yếu tố phòng loét.')
q('skills',3,'physical_care',[145],'食べ物を口からのどへ送る時、主に関わる部位はどれですか。','Đưa viên thức ăn từ miệng về họng chủ yếu liên quan bộ phận nào?',
'舌。¦Lưỡi.¦Đẩy viên thức ăn trong giai đoạn miệng.',
'胃。¦Dạ dày.¦Thức ăn đến sau thực quản.',
'膀胱。¦Bàng quang.¦Thuộc tiết niệu.',
'耳小骨。¦Xương con tai.¦Thuộc nghe.')
q('skills',3,'physical_care',[146,149],'食物アレルギーの情報が配膳票と申し送りで違います。適切なのはどれですか。','Thông tin dị ứng ở phiếu ăn và bàn giao khác nhau, nên làm gì?',
'提供前に担当者へ照会し、本人用の条件を確認する。¦Hỏi người phụ trách trước phục vụ, kiểm điều kiện của bác.¦Không đoán giữa hai thông tin mâu thuẫn.',
'新しい紙に見える方だけを選んで提供する。¦Chọn tờ trông mới rồi phục vụ.¦Bề ngoài không xác nhận thông tin đúng.',
'食べた後の反応を見て、どちらが正しいか決める。¦Cho ăn rồi nhìn phản ứng để quyết đúng.¦Không thử ăn để kiểm dị ứng.',
'本人が空腹なので、確認せず少量だけ提供する。¦Bác đói nên cho ít mà chưa kiểm.¦Lượng ít không thay xác nhận điều kiện.')
q('skills',3,'physical_care',[150],'食事介助の速さを決める情報として適切なのはどれですか。','Dựa thông tin nào để điều chỉnh tốc độ hỗ trợ ăn?',
'本人の食べる様子、飲み込み、希望。¦Cách ăn, nuốt và mong muốn của bác.¦Cần đáp theo cá nhân trong lúc ăn.',
'次の職員の休憩時刻だけ。¦Chỉ giờ nghỉ nhân viên tiếp.¦Lịch nhân viên không thay tốc độ an toàn của bác.',
'同じ年齢の別の人の食事時間だけ。¦Chỉ thời gian người khác cùng tuổi.¦Khác biệt cá nhân vẫn cần xét.',
'昨日食べ終えた時刻だけで、今日は観察しない。¦Chỉ giờ kết thúc hôm qua, hôm nay không xem.¦Tình trạng có thể thay đổi.')
q('skills',3,'physical_care',[151],'見えにくい人に料理の位置を伝える時の基準はどれですか。','Giải thích vị trí món cho người khó nhìn, lấy mốc nào?',
'本人から見た配置を、共通の基準で示す。¦Bố trí bát theo góc nhìn bác bằng mốc cùng hiểu.¦Cần mốc hướng thống nhất, có thể dùng mặt đồng hồ.',
'向かいにいる職員から見た左右だけを伝える。¦Chỉ trái phải theo người đối diện.¦Có thể đảo hướng đối với bác.',
'「そこ」と言い、指で示すだけにする。¦Chỉ nói đằng đó rồi chỉ tay.¦Thông tin nhìn chưa đủ tiếp cận.',
'料理の名前だけを言い、位置は説明しない。¦Chỉ tên món, không vị trí.¦Không giải quyết nhu cầu xác định vị trí.')
q('skills',3,'physical_care',[154],'便がたまり、便意に関わる刺激が生じる部位はどれですか。','Bộ phận chứa phân và tạo kích thích liên quan buồn đại tiện là gì?',
'直腸。¦Trực tràng.¦Thành trực tràng chịu kích thích khi có phân.',
'食道。¦Thực quản.¦Vận chuyển thức ăn, không chứa phân.',
'尿管。¦Niệu quản.¦Vận chuyển nước tiểu.',
'口腔。¦Khoang miệng.¦Tiếp nhận, nhai thức ăn.')
q('skills',3,'physical_care',[158],'排尿の動作やトイレへの移動が間に合わず、尿が漏れる状態に関係する分類はどれですか。','Són vì không kịp động tác tiểu hay đi đến nhà vệ sinh liên quan loại nào?',
'機能性尿失禁。¦Tiểu không tự chủ do chức năng.¦Liên quan khó thực hiện hành động/đi tới nơi; không chẩn đoán cá nhân chỉ từ câu.',
'腹圧性尿失禁。¦Tiểu không tự chủ do áp lực bụng.¦Thường liên quan tăng áp lực khi ho, hắt hơi.',
'溢流性尿失禁。¦Tiểu không tự chủ do tràn.¦Liên quan chứa đầy, tắc đường thoát, không cơ chế nêu.',
'反射性尿失禁。¦Tiểu không tự chủ do phản xạ.¦Liên quan phản xạ thần kinh, khác khó hành động.')
q('skills',3,'physical_care',[159],'便秘が続き、普段の支援でも改善していません。適切なのはどれですか。','Táo bón kéo dài chưa cải thiện với hỗ trợ thường, nên làm gì?',
'排便の経過と体調を医療職へ報告する。¦Báo diễn biến đại tiện và tình trạng cho y tế.¦Cần đánh giá khi không cải thiện, không tự chỉ định thuốc.',
'職員の判断で下剤の量を増やす。¦Nhân viên tự tăng thuốc nhuận tràng.¦Vượt vai trò và chỉ dẫn.',
'食事量だけが原因と決めて、報告を省く。¦Kết luận chỉ do lượng ăn, không báo.¦Có nhiều nguyên nhân, chưa xác nhận.',
'本人が言わなければ、記録を更新しない。¦Bác không nói thì khỏi cập nhật.¦Theo dõi quan sát không phụ thuộc chỉ lời tự báo.')
q('skills',3,'physical_care',[161,163],'トイレで一人になる希望がある時、適切なのはどれですか。','Bác muốn ở một mình trong nhà vệ sinh, cần làm gì?',
'安全と必要な見守りを確かめ、プライバシーも守る。¦Kiểm an toàn, quan sát cần và bảo vệ riêng tư.¦Cân bằng theo cá nhân; không mặc định bỏ mọi quan sát.',
'希望があれば、状態に関係なく見守りをすべて外す。¦Có nguyện vọng thì bỏ quan sát bất kể tình trạng.¦Nguyện vọng không tự loại hỗ trợ an toàn cần.',
'見守りのため、廊下から常に見えるようにする。¦Để luôn nhìn từ hành lang vì quan sát.¦Cần bảo vệ riêng tư, bố trí phù hợp.',
'ボタンを置けば、届くかや使えるかは確認しない。¦Có nút gọi rồi thì khỏi kiểm dùng, tầm với.¦Dụng cụ cần sử dụng được.')
q('skills',3,'physical_care',[172,173],'左側に麻痺がある人が上着を脱ぐ時、一般的な原則はどれですか。','Người liệt trái cởi áo, nguyên tắc chung nào đúng?',
'動かしやすい右側から脱ぐ。¦Cởi bên phải dễ cử động trước.¦Cởi bên khỏe trước giảm gánh nặng; thao tác theo kế hoạch.',
'動かしにくい左側から強く引いて脱ぐ。¦Kéo mạnh bên trái khó cử động trước.¦Ngược nguyên tắc, có nguy cơ tổn thương.',
'両腕を同時に、速く引き抜く。¦Rút nhanh cùng lúc hai tay.¦Không xét khả năng và an toàn.',
'服を選べれば、脱ぐ時の支援は不要と決める。¦Chọn được áo thì không cần hỗ trợ cởi.¦Tự chọn không chứng minh tự làm.')
q('skills',3,'physical_care',[174,179],'着替えの後、本人が「袖が引っ張られる」と話しました。適切なのはどれですか。','Sau thay áo bác nói tay áo bị kéo căng, nên làm gì?',
'着心地を聞き、しわやずれ、体調を確認する。¦Hỏi cảm giác, kiểm nhăn, lệch và tình trạng.¦Cần xem khó chịu sau hỗ trợ, không coi mặc xong là đủ.',
'着替えは終わったので、訴えは後で聞く。¦Đã mặc xong nên nghe sau.¦Bỏ phản hồi trực tiếp.',
'本人が選んだ服なので、調整はできないとする。¦Bác chọn áo nên không chỉnh được.¦Sở thích không cấm điều chỉnh phù hợp.',
'腕を強く引いて、袖の長さだけを合わせる。¦Kéo tay mạnh để chỉnh độ dài.¦Không xác nhận nguyên nhân, có thể tổn thương.')
q('skills',3,'physical_care',[180],'髪を整える前に確認する情報はどれですか。','Trước chỉnh tóc cần kiểm thông tin nào?',
'本人の好み、髪や頭皮の状態、使う用具。¦Sở thích, tóc, da đầu và dụng cụ.¦Chọn chăm sóc phù hợp cá nhân.',
'同じ部屋の人の髪型だけ。¦Chỉ kiểu tóc người cùng phòng.¦Không thay sở thích, tình trạng bác.',
'職員の好きな髪型だけ。¦Chỉ kiểu nhân viên thích.¦Không lấy bác làm chủ thể.',
'写真の見た目だけで、頭皮は確認しない。¦Chỉ ảnh, bỏ kiểm da đầu.¦Thiếu dữ liệu chăm sóc hiện tại.')
q('skills',3,'physical_care',[184],'義歯を保管する前の確認として適切なのはどれですか。','Trước bảo quản răng giả cần kiểm gì?',
'本人の物か、容器と保管方法が適切か。¦Đúng của bác, hộp và cách bảo quản phù hợp không.¦Ngăn nhầm lẫn, hư hỏng và bảo đảm vệ sinh.',
'同じ形なら、別の人の容器に入れてよいか。¦Cùng hình thì cho hộp người khác được không.¦Không dùng hình để thay xác định chủ.',
'乾くほど清潔になるので、乾燥させたか。¦Càng khô càng sạch nên kiểm đã làm khô chưa.¦Có loại vật liệu hỏng khi khô.',
'容器が閉まれば、洗ったかは確認しないこと。¦Đóng nắp rồi không kiểm đã rửa.¦Đóng hộp không chứng minh vệ sinh.')
q('skills',3,'physical_care',[187],'皮膚が外界と体の内部の間で果たす役割の説明はどれですか。','Da đóng vai trò gì giữa môi trường ngoài và bên trong cơ thể?',
'体の保護、感覚、体温調整に関わる。¦Tham gia bảo vệ cơ thể, cảm giác và điều hòa thân nhiệt.¦Da có cả chức năng bảo vệ, cảm giác và điều hòa.',
'体温を調整するが、外からの刺激は感じない。¦Điều hòa thân nhiệt nhưng không cảm nhận kích thích ngoài.¦Sai vì da cũng có chức năng cảm giác.',
'体を保護するが、発汗には関わらない。¦Bảo vệ cơ thể nhưng không tham gia tiết mồ hôi.¦Sai vì tuyến mồ hôi của da tham gia điều hòa thân nhiệt.',
'感覚に関わるが、外界から体を保護しない。¦Tham gia cảm giác nhưng không bảo vệ cơ thể khỏi môi trường ngoài.¦Sai vì da cũng bảo vệ cơ thể.')
q('skills',3,'physical_care',[191,193],'洗身や体を拭く時の皮膚への配慮はどれですか。','Lưu ý da khi rửa, lau người là gì?',
'強くこすらず、皮膚の状態を見ながら行う。¦Không chà mạnh, thực hiện trong khi xem tình trạng da.¦Tránh làm tổn thương da.',
'赤みがある部分ほど、力を入れてこする。¦Vùng đỏ càng chà mạnh.¦Có thể tăng tổn thương.',
'清潔にする目的なら、本人の痛みは確認しない。¦Mục đích sạch nên không hỏi đau.¦Cảm giác và tình trạng vẫn cần kiểm.',
'一度同意があれば、途中の状態変化は見ない。¦Đồng ý một lần rồi không xem thay đổi.¦Đồng ý không thay quan sát liên tục.')
q('skills',3,'physical_care',[195],'女性の陰部を清潔にする時、感染予防に関わる原則はどれですか。','Nguyên tắc liên quan phòng nhiễm khi vệ sinh vùng kín nữ là gì?',
'尿道側から肛門側へ、汚れを戻さない方向で行う。¦Từ phía niệu đạo về hậu môn, tránh đưa bẩn ngược lại.¦Giảm mang bẩn tới niệu đạo; thao tác cụ thể theo hướng dẫn đã duyệt.',
'肛門側から尿道側へ、同じ面で繰り返す。¦Từ hậu môn lên niệu đạo, lặp cùng mặt.¦Có thể đưa nhiễm bẩn tới niệu đạo.',
'手袋をしていれば、方向と汚れを気にしない。¦Có găng rồi không cần xét hướng, bẩn.¦Găng không thay kỹ thuật phòng nhiễm.',
'温度を感じにくければ、熱い湯をそのまま使う。¦Khó cảm nhiệt thì dùng nước nóng nguyên.¦Nguy cơ bỏng, cần xác nhận nhiệt phù hợp.')
q('skills',3,'physical_care',[199,201],'調理と洗濯で、本人に合う方法を選ぶ時の確認はどれですか。','Chọn cách nấu, giặt phù hợp bác cần kiểm gì?',
'食事の条件と、衣類の材質や汚れの種類。¦Điều kiện bữa ăn, chất liệu áo và loại vết bẩn.¦Mỗi hoạt động có điều kiện riêng cần đối chiếu.',
'どちらも同じ手順なら、個別の条件は不要。¦Cùng quy trình thì bỏ điều kiện riêng.¦Không áp một cách cho mọi nhu cầu.',
'調理の見た目だけで、洗濯の方法も決める。¦Từ hình thức món quyết cả cách giặt.¦Hai nguồn dữ kiện không thay nhau.',
'早く終わる方法なら、表示や指示は読まない。¦Cách nhanh thì không đọc nhãn, chỉ dẫn.¦Tốc độ không thay phù hợp, an toàn.')
q('skills',3,'cbt_practical',[202],'図の夜間の通路を整える対応はどれですか。','Cần chỉnh lối đi ban đêm trong hình thế nào?',
'通路の障害物と明るさを確認し、本人に合う環境にする。¦Kiểm vật cản, ánh sáng và chỉnh theo bác.¦Hai điều kiện ảnh hưởng tiếp cận, di chuyển an toàn.',
'昼間に使えたので、夜間の確認は省く。¦Ban ngày dùng được nên tối khỏi kiểm.¦Ánh sáng thay đổi.',
'照明を付ければ、床のコードは確認しない。¦Bật đèn rồi bỏ kiểm dây dưới sàn.¦Sáng không loại vật cản.',
'コードをまたぐ方法を、本人だけに任せる。¦Để bác tự bước qua dây.¦Chưa xử lý nguy cơ môi trường.',figure=('s03-night','A: 夜間に暗い通路。B: 床を横切るコード。C: 居室。','A: Lối đi tối ban đêm; B: Dây ngang sàn; C: Phòng ở.',['A  DARK PASSAGE','B  CABLE ACROSS FLOOR','C  USER ROOM']))
q('skills',3,'cbt_practical',[118],'図の連絡経過から、まだ確認が必要なことはどれですか。','Theo diễn biến liên lạc trong hình, điều nào còn cần kiểm?',
'担当者が連絡を受け、対応を引き受けたか。¦Người phụ trách đã nhận và tiếp nhận xử lý chưa.¦Gửi đi không chứng minh có người nhận nhiệm vụ.',
'職員が連絡を送ったか。¦Nhân viên đã gửi chưa.¦Hình ghi đã gửi.',
'送信した時刻があるか。¦Có giờ gửi chưa.¦Giờ gửi đã có.',
'返信が未確認と記されているか。¦Có ghi trả lời chưa xác nhận không.¦Hình ghi rõ điều này.',figure=('s03-contact','A: 十四時、連絡を送信。B: 返信は未確認。C: 対応結果は未確認。','A: 14:00 đã gửi; B: Chưa xác nhận trả lời; C: Chưa xác nhận kết quả.',['14:00  MESSAGE SENT','REPLY: UNCONFIRMED','OUTCOME: UNCONFIRMED']))
q('skills',3,'cbt_practical',[16,196],'図の清拭環境を整える対応はどれですか。','Cần chỉnh môi trường lau người trong hình thế nào?',
'外からの視線を遮り、必要な部分だけを出す。¦Che tầm nhìn bên ngoài, chỉ lộ phần cần.¦Cần cả riêng tư và giữ phần cơ thể chưa chăm sóc được che.',
'本人が室内にいるので、入口は開いたままでよい。¦Bác trong phòng nên cứ mở cửa.¦Hành lang vẫn nhìn được.',
'タオルがあれば、カーテンは確認しない。¦Có khăn thì khỏi kiểm rèm.¦Khăn nhỏ không tự chặn tầm nhìn từ ngoài.',
'短時間なら、全身を出して作業を進める。¦Làm ngắn thì bộc lộ toàn thân.¦Thời gian ngắn không bỏ riêng tư, giữ ấm.',figure=('s03-privacy','A: 開いた入口。B: 廊下から見えるベッド。C: 小さいタオル。','A: Cửa mở; B: Giường nhìn thấy từ hành lang; C: Khăn nhỏ.',['A  OPEN DOOR','B  BED VISIBLE FROM HALL','C  SMALL TOWEL']))
q('skills',3,'cbt_practical',[184],'図の義歯と容器を見て、適切な判断はどれですか。','Đối chiếu răng giả và hộp trong hình, quyết định nào đúng?',
'表示が一致していないので、本人用か確認してから扱う。¦Nhãn không khớp, kiểm đúng của bác trước xử lý.¦Không đoán chủ theo vị trí, hình dạng.',
'同じ机にあったので、同じ人の物と決める。¦Cùng bàn nên coi cùng chủ.¦Địa điểm không chứng minh chủ.',
'容器の表示を義歯に合わせ、自分で変更する。¦Tự đổi nhãn hộp theo răng giả.¦Chưa xác nhận không sửa nhận dạng.',
'形が似ていれば、表示が違っても使ってもらう。¦Hình giống thì nhãn khác cũng cho dùng.¦Có thể nhầm vật cá nhân.',figure=('s03-denture','義歯の管理票: 利用者18。容器の表示: 利用者81。持ち主は未確認。','Phiếu quản lý răng giả: 18; nhãn hộp: 81; chủ chưa xác nhận.',['DENTURE CARD: ID 18','CONTAINER: ID 81','OWNER: UNCONFIRMED']))
q('skills',3,'cbt_practical',[146,149],'図の配膳記録から分かることはどれですか。','Từ ghi chép phục vụ bữa ăn trong hình biết được gì?',
'準備は確認済みだが、提供と食べた量は未確認。¦Đã kiểm chuẩn bị, chưa kiểm phục vụ, lượng ăn.¦Các giai đoạn không tự suy ra nhau.',
'準備済みなので、食べ終わったと分かる。¦Chuẩn bị xong nên biết đã ăn hết.¦Chuẩn bị không chứng minh ăn.',
'食べた量が不明なので、準備も未実施と分かる。¦Lượng ăn chưa rõ nên biết chưa chuẩn bị.¦Thiếu kết quả không xóa giai đoạn đã xác nhận.',
'提供が未確認なので、本人は食事を断ったと分かる。¦Chưa kiểm phục vụ nên biết bác từ chối.¦Không có lời từ chối trong dữ kiện.',figure=('s03-stages','A: トレー準備済み。B: 本人への提供は未確認。C: 食べた量は未確認。','A: Khay đã chuẩn bị; B: Chưa kiểm đã đưa bác; C: Lượng ăn chưa kiểm.',['A  TRAY READY','B  SERVED: UNCONFIRMED','C  INTAKE: UNCONFIRMED']))

# Japanese 02: words, five bounded exchanges, five independently written documents.
q('japanese',2,'care_vocabulary',[206],'「端座位」を表す説明はどれですか。','Giải thích nào chỉ tư thế 端座位?',
'ベッドの端に座り、足を下ろす姿勢。¦Ngồi mép giường, hạ chân xuống.¦Đúng nghĩa tư thế ngồi mép giường.',
'背中を下にして、ベッドへ寝る姿勢。¦Nằm trên giường lưng ở dưới.¦Đó là nằm ngửa.',
'体の横を下にして、ベッドへ寝る姿勢。¦Nằm một bên thân ở dưới.¦Đó là nằm nghiêng.',
'両足で体を支え、床の上に立つ姿勢。¦Đứng trên sàn bằng hai chân.¦Đó là tư thế đứng.')
q('japanese',2,'care_vocabulary',[150],'「むせる」に近い様子はどれですか。','Biểu hiện nào gần nghĩa むせる?',
'飲食物の刺激でせき込む。¦Ho sặc do kích thích từ đồ ăn uống.¦Đúng nghĩa sặc; không tự suy mức khẩn cấp từ từ đơn lẻ.',
'食べ物を歯で細かくかむ。¦Dùng răng nhai nhỏ thức ăn.¦Nghĩa của nhai.',
'食事前に、おなかがすく。¦Đói trước bữa.¦Không phải sặc.',
'食事の後に、満腹になる。¦No sau bữa.¦Không phải sặc.')
q('japanese',2,'care_vocabulary',[181,224],'「爪やすり」は何をする用具ですか。','爪やすり là dụng cụ làm gì?',
'爪の先を整える。¦Chỉnh, giũa đầu móng.¦Đúng chức năng giũa móng.',
'髪の毛をとかす。¦Chải tóc.¦Dùng lược, không giũa móng.',
'歯の表面を磨く。¦Chải bề mặt răng.¦Dùng bàn chải răng.',
'肌の水分を拭く。¦Lau nước trên da.¦Dùng khăn phù hợp.')
q('japanese',2,'care_vocabulary',[208],'「歩行器」はどの場面で使う用具ですか。','歩行器 là dụng cụ dùng trong tình huống nào?',
'歩く時に体を支える。¦Đỡ cơ thể khi đi.¦Là khung hỗ trợ đi, chọn theo đánh giá cá nhân.',
'食事の時に皿を固定する。¦Cố định đĩa khi ăn.¦Thuộc dụng cụ ăn.',
'寝ている時に尿を受ける。¦Hứng nước tiểu khi nằm.¦Thuộc dụng cụ bài tiết.',
'髪を洗った後に乾かす。¦Làm khô tóc sau gội.¦Thuộc máy sấy tóc.')
q('japanese',2,'care_vocabulary',[189,230],'「脱衣所」の場所はどれですか。','脱衣所 là nơi nào?',
'入浴前後に着替える場所。¦Nơi cởi, mặc quần áo trước, sau tắm.¦Đúng nghĩa chỗ thay đồ.',
'食事を調理して盛り付ける場所。¦Nơi nấu, bày món.¦Bếp, không chỗ thay đồ.',
'職員が勤務の引き継ぎをする場所。¦Nơi nhân viên bàn giao ca.¦Không phải định nghĩa hỏi.',
'洗濯物を外で乾かす場所。¦Nơi phơi đồ giặt bên ngoài.¦Không chỗ thay đồ.')
q('japanese',2,'care_conversation',[102,104],'本人の希望を確認する返答はどれですか。','Câu đáp nào xác nhận đúng mong muốn của bác?',
'窓の近くで休んでから、参加を考えるのですね。¦Bác nghỉ gần cửa sổ rồi mới xét tham gia.¦Giữ thứ tự và quyết định chưa chốt.',
'参加した後で、窓の近くで休むのですね。¦Tham gia rồi nghỉ gần cửa sổ.¦Đảo thứ tự.',
'休みたいので、今日の参加は取り消すのですね。¦Muốn nghỉ nên hủy tham gia hôm nay.¦Thêm kết luận chưa nói.',
'窓の近くなら、すぐ参加できるのですね。¦Gần cửa sổ thì tham gia ngay được.¦Không có điều kiện này trong lời bác.',passage='本人：窓の近くで少し休んでから、集まりに行くか考えたいです。',passage_vi='Bác: Tôi muốn nghỉ gần cửa sổ một chút, sau đó mới nghĩ có đi buổi gặp không.')
q('japanese',2,'care_conversation',[118],'依頼が伝わったか確かめるため、まず確認することはどれですか。','Để kiểm tra yêu cầu đã được hiểu, trước tiên xác nhận điều gì?',
'佐藤さんが依頼を受けたか。¦Sato đã nhận yêu cầu chưa.¦Mới nhắn đi, chưa có trả lời.',
'依頼を送ったのは誰か。¦Ai gửi yêu cầu.¦Đồng nghiệp đã nói mình gửi.',
'佐藤さんが作業を終えたか。¦Sato đã làm xong chưa.¦Chưa xác nhận nhận nhiệm vụ, không thể coi đã làm.',
'依頼の内容を変えてよいか。¦Được đổi nội dung yêu cầu không.¦Không phải điểm thiếu nêu trong hội thoại.',passage='同僚：佐藤さんへ準備をお願いするメッセージを送りました。\n職員：返事は来ましたか。\n同僚：まだ見ていません。',passage_vi='Đồng nghiệp: Tôi gửi tin nhờ Sato chuẩn bị. Nhân viên: Có trả lời chưa? Đồng nghiệp: Tôi chưa xem.')
q('japanese',2,'care_conversation',[102],'本人の言葉に沿った確認はどれですか。','Câu xác nhận nào đúng với lời bác?',
'音が気になるので、静かな所で説明を聞きたいのですね。¦Bác muốn nghe giải thích nơi yên vì tiếng ồn.¦Giữ lý do, nhu cầu, không tự kết luận nghe kém.',
'聞こえないので、説明は不要なのですね。¦Bác không nghe được nên không cần giải thích.¦Không phải điều bác nói.',
'説明が嫌なので、今日は話さないのですね。¦Bác ghét giải thích nên không nói hôm nay.¦Gán ý từ chối chưa có.',
'音がある方が、説明を聞きやすいのですね。¦Có tiếng ồn thì bác nghe dễ hơn.¦Ngược mong muốn.',passage='本人：テレビの音が気になります。静かな所で説明を聞けますか。',passage_vi='Bác: Tiếng TV làm tôi khó chịu. Tôi nghe giải thích ở nơi yên được không?')
q('japanese',2,'care_conversation',[115,118],'報告に含めるべき内容はどれですか。','Nội dung nào cần đưa vào báo cáo?',
'右肩が重いと話した。原因はまだ不明。¦Bác nói vai phải nặng, nguyên nhân chưa rõ.¦Không chuyển cảm giác thành chẩn đoán.',
'職員が右肩の傷を見たという事実。¦Sự thật nhân viên thấy vết thương vai phải.¦Chưa quan sát vết thương trong dữ kiện.',
'左肩の痛みがなくなったという本人の言葉。¦Lời bác nói vai trái hết đau.¦Sai bên và nội dung.',
'荷物を持ったためだと確定した原因。¦Nguyên nhân đã xác định do mang đồ.¦Chưa xác nhận nguyên nhân.',passage='本人：右肩が重い感じがします。\n職員：いつからですか。\n本人：昼ごろからです。理由は分かりません。',passage_vi='Bác: Tôi thấy vai phải nặng. Nhân viên: Từ lúc nào? Bác: Khoảng trưa. Tôi không biết vì sao.')
q('japanese',2,'care_conversation',[200],'職員が引き受けた作業はどれですか。','Nhân viên đã nhận làm việc nào?',
'残す新聞を、まとめる前に一緒に見る。¦Trước gom báo, cùng bác kiểm tờ giữ.¦Phải xác nhận trước theo đề nghị.',
'新聞を全部捨ててから、本人に知らせる。¦Vứt hết rồi báo bác.¦Không được nhờ vứt hết.',
'残す新聞を職員だけで選ぶ。¦Nhân viên tự chọn báo giữ.¦Bác muốn cùng xem.',
'新聞以外の本もまとめて処分する。¦Vứt chung sách ngoài báo.¦Ngoài phạm vi.',passage='本人：新聞をまとめる前に、残す物を一緒に見てください。\n職員：はい。確認してからまとめます。',passage_vi='Bác: Trước gom báo, cùng tôi xem tờ giữ nhé. Nhân viên: Vâng, kiểm xong tôi mới gom.')
q('japanese',2,'care_documents',[115,118],'午前の作業について正しいものはどれですか。','Thông tin nào đúng về công việc buổi sáng?',
'点検の終了後に、石田職員が準備を始める。¦Sau kiểm xong, Ishida bắt đầu chuẩn bị.¦Giữ thứ tự và phân công.',
'石田職員が点検し、森職員が準備する。¦Ishida kiểm, Mori chuẩn bị.¦Đảo người phụ trách.',
'準備を終えてから、点検を始める。¦Chuẩn bị xong rồi bắt đầu kiểm.¦Đảo thứ tự.',
'二人とも九時に準備を終える。¦Cả hai chuẩn bị xong 9 giờ.¦Không ghi thời điểm kết thúc chuẩn bị.',passage='作業表\n九時から森職員が用具を点検する。石田職員は、点検終了の連絡を受けてから準備を始める。終了時刻は未定。',passage_vi='Bảng công việc: Mori kiểm dụng cụ từ 9 giờ. Ishida bắt đầu chuẩn bị sau nhận báo kiểm xong. Chưa chốt giờ kết thúc.')
q('japanese',2,'care_documents',[115,118],'この案内から分かることはどれですか。','Thông tin nào đọc được từ thông báo?',
'受付は一時五十分、相談は二時から。¦Tiếp nhận 13:50, tư vấn từ 14:00.¦Phân biệt giờ tiếp nhận và bắt đầu.',
'受付と相談は、どちらも午後二時十分から。¦Tiếp nhận và tư vấn đều từ 14:10.¦Sai giờ và gộp hai mốc.',
'会場は食堂で、受付は午後一時から。¦Nơi là phòng ăn, tiếp nhận từ 13 giờ.¦Không khớp thông báo.',
'相談は午前に行い、受付は不要。¦Tư vấn buổi sáng, không cần tiếp nhận.¦Ngược nội dung.',passage='生活相談の案内\n十一月六日、会議室B。受付：午後一時五十分から。相談：午後二時から二時三十分まで。',passage_vi='Thông báo tư vấn sinh hoạt: ngày 6/11, phòng họp B. Tiếp nhận 13:50; tư vấn 14:00–14:30.')
q('japanese',2,'care_documents',[115],'記録で確認済みのことはどれですか。','Việc nào đã được xác nhận trong ghi chép?',
'本人が午後の散歩を希望したこと。¦Bác muốn đi dạo chiều.¦Đã ghi lời nguyện vọng, không ghi thực hiện.',
'午後の散歩を終えたこと。¦Đã đi dạo chiều xong.¦Chưa kiểm thực hiện.',
'散歩の途中に休憩したこと。¦Đã nghỉ giữa đi dạo.¦Chưa có diễn biến này.',
'散歩に必要な用具の点検を終えたこと。¦Kiểm xong dụng cụ cần đi dạo.¦Không có thông tin kiểm dụng cụ.',passage='十一時、本人は「午後に庭を歩きたい」と話した。午後の体調、用具、実施状況は未確認。',passage_vi='11 giờ bác nói muốn đi trong vườn vào chiều. Tình trạng chiều, dụng cụ và việc thực hiện chưa kiểm.')
q('japanese',2,'care_documents',[199,245],'この献立の変更について正しいものはどれですか。','Thông tin nào đúng về thay đổi thực đơn?',
'昼食の副菜だけが変更され、主菜は同じ。¦Chỉ món phụ trưa đổi, món chính giữ.¦Giữ đúng phạm vi thay đổi.',
'夕食の主菜が変更された。¦Đổi món chính tối.¦Sai bữa và loại món.',
'昼食の主食と主菜が両方変更された。¦Cả món lương thực và món chính trưa đổi.¦Không có hai thay đổi đó.',
'全員の食事形態が同じものに変更された。¦Đổi dạng thức ăn mọi người thành giống nhau.¦Không nêu thay đổi dạng cá nhân.',passage='十一月八日の献立変更\n昼食の副菜を、煮物から和え物へ変更します。主食と主菜は変更しません。個別の食事形態は別に確認してください。',passage_vi='Thay đổi ngày 8/11: món phụ trưa từ món ninh sang món trộn. Món lương thực và chính không đổi. Kiểm dạng ăn cá nhân riêng.')
q('japanese',2,'care_documents',[115,118],'申し送りで、次の職員が行う確認はどれですか。','Theo bàn giao, nhân viên tiếp cần kiểm gì?',
'本人が希望する時間と、支援の担当者。¦Giờ bác muốn và người phụ trách hỗ trợ.¦Hai điểm còn chưa xác nhận ghi rõ.',
'既に終了した入浴の感想だけ。¦Chỉ cảm tưởng về lần tắm đã xong.¦Chưa ghi đã tắm.',
'前日の予定を、今日も実施済みとして記すこと。¦Ghi lịch hôm qua là hôm nay đã làm.¦Không phải yêu cầu và làm sai thực hiện.',
'本人に聞かず、午前中の予定へ決めること。¦Không hỏi, chốt lịch sáng.¦Giờ mong muốn vẫn cần hỏi.',passage='申し送り\n本人は洗髪の相談を希望。希望する時間はまだ聞いていない。支援の担当も未定。次の勤務者は、本人と担当者に確認してください。',passage_vi='Bàn giao: bác muốn bàn việc gội đầu; chưa hỏi giờ muốn, chưa chốt người hỗ trợ. Ca tiếp xác nhận với bác và người phụ trách.')

# Japanese 03: different terms, requests, boundaries and text operations.
q('japanese',3,'care_vocabulary',[207],'「浮腫」を表す言葉はどれですか。','Từ nào diễn đạt 浮腫?',
'むくみ。¦Phù, sưng do tích dịch.¦Đúng nghĩa từ chuyên ngành.',
'かゆみ。¦Ngứa.¦Cảm giác ngứa, không phù.',
'めまい。¦Chóng mặt.¦Không nghĩa phù.',
'息切れ。¦Hụt hơi.¦Không nghĩa phù.')
q('japanese',3,'care_vocabulary',[219],'「尿意」の意味はどれですか。','尿意 có nghĩa gì?',
'尿を出したいと感じること。¦Cảm thấy muốn tiểu.¦Là nhu cầu cảm nhận, chưa chứng minh đã tiểu.',
'便を出したいと感じること。¦Cảm thấy muốn đại tiện.¦Đó là 便意.',
'尿をためる袋のこと。¦Túi tích nước tiểu.¦Đó là bàng quang.',
'尿を受ける用具のこと。¦Dụng cụ hứng tiểu.¦Không phải cảm giác.')
q('japanese',3,'care_vocabulary',[238],'「換気」とは何ですか。','換気 là gì?',
'室内の空気を入れ替えること。¦Thay đổi không khí trong phòng.¦Đúng nghĩa thông khí.',
'衣類の汚れを洗い落とすこと。¦Giặt bẩn trên áo.¦Nghĩa giặt, không thông khí.',
'床の水分を拭き取ること。¦Lau nước trên sàn.¦Nghĩa lau, không thông khí.',
'寝具のしわを伸ばすこと。¦Làm phẳng đồ giường.¦Không đổi không khí.')
q('japanese',3,'care_vocabulary',[194],'「足浴」を表すものはどれですか。','Mô tả nào chỉ 足浴?',
'足を湯につけて洗うこと。¦Ngâm, rửa chân bằng nước ấm.¦Là tắm phần chân, không toàn thân.',
'全身を浴槽の湯につけること。¦Ngâm toàn thân trong bồn.¦Đó là tắm toàn thân.',
'髪を湯で洗うこと。¦Gội tóc bằng nước.¦Đó là gội đầu.',
'顔をタオルで拭くこと。¦Lau mặt bằng khăn.¦Không phải ngâm rửa chân.')
q('japanese',3,'care_vocabulary',[245],'記録の「未確認」が示す意味はどれですか。','未確認 trong ghi chép nghĩa là gì?',
'まだ確かめていない。¦Chưa xác nhận.¦Không đồng nghĩa không xảy ra.',
'起きていないと確定した。¦Đã xác định không xảy ra.¦Chưa xác nhận khác phủ định đã kiểm.',
'確認して、問題がないと分かった。¦Đã kiểm, biết không có vấn đề.¦Ngược chưa kiểm.',
'確認を終え、支援も終了した。¦Đã kiểm và hỗ trợ xong.¦Thêm hai kết quả chưa có.')
q('japanese',3,'care_conversation',[102,104],'本人が選んだ内容はどれですか。','Bác đã chọn điều nào?',
'説明を聞いてから、道具を選ぶ。¦Nghe giải thích rồi chọn dụng cụ.¦Quyết định dụng cụ còn sau giải thích.',
'青い道具を使うと決めた。¦Chốt dùng dụng cụ xanh.¦Chưa chọn màu.',
'道具を使わないと決めた。¦Chốt không dùng dụng cụ.¦Không có từ chối.',
'職員に選択をすべて任せた。¦Giao hết quyền chọn cho nhân viên.¦Bác muốn tự quyết sau nghe.',passage='職員：青い道具と白い道具があります。\n本人：違いを説明してもらってから、自分で選びたいです。',passage_vi='Nhân viên: Có dụng cụ xanh, trắng. Bác: Giải thích khác nhau rồi tôi muốn tự chọn.')
q('japanese',3,'care_conversation',[118],'確認した時間の関係はどれですか。','Quan hệ thời gian đã xác nhận là gì?',
'集合は十時、開始は十時十五分。¦Tập trung 10:00, bắt đầu 10:15.¦Hai mốc có chức năng khác nhau.',
'集合は十時十五分、開始は十時。¦Tập trung 10:15, bắt đầu 10:00.¦Đảo mốc.',
'集合も開始も、十時十五分。¦Cả tập trung, bắt đầu 10:15.¦Gộp hai giờ.',
'集合は十時、開始はまだ未定。¦Tập trung 10:00, bắt đầu chưa chốt.¦Đã xác nhận giờ bắt đầu.',passage='同僚：集合は十時です。\n職員：開始も十時ですか。\n同僚：いいえ、開始は十時十五分です。',passage_vi='Đồng nghiệp: Tập trung 10 giờ. Nhân viên: Bắt đầu cũng 10 giờ? Đồng nghiệp: Không, bắt đầu 10:15.')
q('japanese',3,'care_conversation',[16,200],'許可されたことはどれですか。','Việc nào được cho phép?',
'机の上の紙を、本人と一緒に分けること。¦Cùng bác phân giấy trên bàn.¦Giữ vật, nơi và phạm vi đã đồng ý.',
'引き出しを開けて、手紙を読むこと。¦Mở ngăn kéo, đọc thư.¦Đã yêu cầu không mở.',
'机の紙を、職員だけで捨てること。¦Nhân viên tự vứt giấy trên bàn.¦Phân cùng bác khác tự vứt.',
'引き出しの中の紙も、一緒に分けること。¦Phân cả giấy trong ngăn kéo.¦Ngoài phạm vi đồng ý.',passage='本人：机の上の紙は一緒に分けてください。引き出しは開けないでください。\n職員：机の上だけですね。',passage_vi='Bác: Cùng tôi phân giấy trên bàn, đừng mở ngăn kéo. Nhân viên: Chỉ trên bàn nhé.')
q('japanese',3,'care_conversation',[104],'本人の気持ちを確かめる返答はどれですか。','Câu nào xác nhận cảm xúc bác phù hợp?',
'初めてなので、説明を先に聞きたいのですね。¦Lần đầu nên bác muốn nghe giải thích trước.¦Phản ánh lý do và nhu cầu đã nói.',
'初めてなので、利用をやめるのですね。¦Lần đầu nên bác bỏ sử dụng.¦Chưa có quyết định bỏ.',
'説明を聞けば、不安は必ずなくなります。¦Nghe giải thích là chắc hết lo.¦Hứa kết quả chưa biết.',
'他の人が使うので、説明なしで大丈夫です。¦Người khác dùng nên khỏi giải thích.¦Không đáp nhu cầu bác.',passage='本人：この用具は初めてです。使う前に説明を聞きたいです。',passage_vi='Bác: Lần đầu tôi dùng dụng cụ này. Tôi muốn nghe giải thích trước dùng.')
q('japanese',3,'care_conversation',[115,118],'この時点で確かめたことはどれですか。','Đến thời điểm này đã xác nhận gì?',
'窓が開いており、本人が寒いと発言。¦Cửa sổ mở và bác nói lạnh.¦Một quan sát, một lời bác; chưa kiểm điều chỉnh.',
'窓を閉め、本人が暖かくなったこと。¦Đóng cửa rồi bác ấm lên.¦Chưa thực hiện, chưa kiểm kết quả.',
'本人が発熱していること。¦Bác sốt.¦Không có đo nhiệt.',
'暖房が故障したこと。¦Máy sưởi hỏng.¦Chưa kiểm nguyên nhân.',passage='職員：窓が開いていました。\n本人：少し寒いです。\n職員：寒いのですね。室温と窓の調整を確認します。',passage_vi='Nhân viên: Cửa sổ đang mở. Bác: Tôi hơi lạnh. Nhân viên: Bác lạnh, tôi sẽ kiểm nhiệt độ phòng và việc chỉnh cửa.')
q('japanese',3,'care_documents',[115,118],'変更後の案内で正しいものはどれですか。','Điều nào đúng theo thông báo sau thay đổi?',
'相談の場所だけが会議室Cへ変わった。¦Chỉ nơi tư vấn đổi sang phòng họp C.¦Ngày, giờ vẫn như cũ.',
'相談の日が十一月十三日へ変わった。¦Ngày tư vấn đổi 13/11.¦Thông báo không đổi ngày.',
'相談の開始時刻が午後四時へ変わった。¦Đổi bắt đầu 16 giờ.¦Không đổi giờ.',
'相談は取り消され、行われない。¦Hủy, không tổ chức tư vấn.¦Chỉ đổi nơi, không hủy.',passage='相談場所の変更\n十一月十二日、午後三時の相談は、相談室Aから会議室Cへ変更します。日付と開始時刻は同じです。',passage_vi='Đổi nơi tư vấn: ngày 12/11 lúc 15 giờ, từ phòng tư vấn A sang phòng họp C. Ngày, giờ bắt đầu giữ nguyên.')
q('japanese',3,'care_documents',[115],'この記録から言えることはどれですか。','Có thể kết luận điều nào từ ghi chép?',
'見た時コップは空。飲んだ人は未確認。¦Lúc xem cốc rỗng, nhưng chưa biết ai uống.¦Trạng thái cốc không chứng minh người uống.',
'本人がコップの水を最後まで飲み終えた。¦Bác uống hết nước.¦Không thấy người uống.',
'本人は水を全く飲まなかった。¦Bác hoàn toàn không uống.¦Không có dữ kiện phủ định.',
'職員が水を捨てた。¦Nhân viên đổ nước.¦Không có diễn biến này.',passage='十五時十分、職員が机を見るとコップは空だった。飲むところは見ていない。本人への確認もまだしていない。',passage_vi='15:10 nhân viên thấy cốc trên bàn rỗng. Không thấy lúc uống, cũng chưa hỏi bác.')
q('japanese',3,'care_documents',[115,118],'準備について正しいものはどれですか。','Thông tin nào đúng về chuẩn bị?',
'布は西職員、容器は本田職員。¦Nishi chuẩn bị vải, Honda chuẩn bị hộp.¦Khớp cả hai phân công.',
'本田職員が布と容器を両方準備する。¦Honda chuẩn bị cả vải, hộp.¦Vải phân công Nishi.',
'西職員が布と容器を両方準備する。¦Nishi chuẩn bị cả vải, hộp.¦Hộp phân công Honda.',
'容器は利用者本人が準備する。¦Bác tự chuẩn bị hộp.¦Không có phân công cho bác.',passage='準備担当表\n西職員：布。\n本田職員：容器。\n二人は準備した物を使用前に一緒に確認する。',passage_vi='Bảng phân công: Nishi chuẩn bị vải, Honda chuẩn bị hộp. Hai người cùng kiểm đồ trước sử dụng.')
q('japanese',3,'care_documents',[200,245],'本人が同意していない作業はどれですか。','Việc nào bác chưa đồng ý?',
'古い雑誌を捨てること。¦Vứt tạp chí cũ.¦Giấy xác nhận nêu chưa đồng ý vứt.',
'雑誌を種類ごとに分けること。¦Phân tạp chí theo loại.¦Đã đồng ý.',
'分けた雑誌を同じ棚へ戻すこと。¦Trả tạp chí phân xong về cùng kệ.¦Trong phạm vi đồng ý.',
'本人と一緒に雑誌を確認すること。¦Cùng bác kiểm tạp chí.¦Giấy yêu cầu làm cùng.',passage='整理の確認票\n本人と一緒に雑誌を種類ごとに分け、同じ棚に戻す。廃棄への同意はまだない。机の上の写真は対象外。',passage_vi='Phiếu xác nhận: cùng bác phân tạp chí theo loại, trả cùng kệ. Chưa đồng ý vứt; ảnh trên bàn ngoài phạm vi.')
q('japanese',3,'care_documents',[115,118],'申し送りの順番に合う対応はどれですか。','Hành động nào đúng thứ tự bàn giao?',
'返答を確認し、説明と同意の後に支援する。¦Kiểm trả lời y tế, giải thích và nhận đồng ý rồi hỗ trợ.¦Đủ xác nhận, giải thích và nhận đồng ý trước hỗ trợ.',
'本人へ説明すれば、看護職の返答は待たない。¦Giải thích bác rồi không chờ trả lời y tế.¦Bỏ điều kiện phải xác nhận.',
'先に支援を終え、後から返答を確認する。¦Hỗ trợ xong rồi mới kiểm trả lời.¦Đảo trình tự.',
'返答が来た時点で、支援も終了したと記す。¦Có trả lời là ghi hỗ trợ xong.¦Xác nhận không chứng minh thực hiện.',passage='申し送り\n支援方法について看護職に照会中。返答を確認し、本人に説明して同意を得てから支援する。現在は未実施。',passage_vi='Bàn giao: đang hỏi y tế về cách hỗ trợ. Xác nhận trả lời, giải thích và nhận đồng ý bác trước hỗ trợ. Hiện chưa thực hiện.')

REVIEW=dict(aiEditorialReviewed=True,domainHumanReviewed=False,nativeLanguageReviewed=False,publisherReviewed=False,rightsReviewed=False,runtimeIntegrated=False,releaseReady=False)
def hira(s):return ''.join(chr(ord(c)-96) if '\u30a1'<=c<='\u30f6' else c for c in s)
# Whole-phrase overrides are applied before dictionary segmentation, including dates,
# side/posture names, anatomical cochlea (not the snail reading), and counter readings.
OVERRIDES={'便秘':'べんぴ','空気':'くうき','空腹':'くうふく','便':'べん','空':'から','箱':'はこ','何を':'なにを','開いた':'あいた','開いて':'あいて','右側臥位':'みぎそくがい','左側臥位':'ひだりそくがい','仰臥位':'ぎょうがい','腹臥位':'ふくがい','側臥位':'そくがい','端座位':'たんざい','恒常性':'こうじょうせい','蝸牛':'かぎゅう','褥瘡':'じょくそう','清拭':'せいしき','足浴':'そくよく','尿意':'にょうい','浮腫':'ふしゅ','手指衛生':'しゅしえいせい','尿失禁':'にょうしっきん','機能性':'きのうせい','腹圧性':'ふくあつせい','溢流性':'いつりゅうせい','反射性':'はんしゃせい','廃用症候群':'はいようしょうこうぐん','咽頭期':'いんとうき','先行期':'せんこうき','食道期':'しょくどうき','準備期':'じゅんびき','爪やすり':'つめやすり','十一月六日':'じゅういちがつむいか','十一月八日':'じゅういちがつようか','十一月十二日':'じゅういちがつじゅうににち','十一月十三日':'じゅういちがつじゅうさんにち','九時':'くじ','十時':'じゅうじ','十五時':'じゅうごじ','十四時':'じゅうよじ','二時':'にじ','三時':'さんじ','四時':'よじ','一時':'いちじ','十五分':'じゅうごふん','十分':'じゅっぷん','三十分':'さんじゅっぷん','五十分':'ごじゅっぷん','十一時':'じゅういちじ','佐藤':'さとう','石田':'いしだ','本田':'ほんだ','西職員':'にししょくいん','森職員':'もりしょくいん','仙骨部':'せんこつぶ','記銘':'きめい','想起':'そうき','小腸':'しょうちょう','直腸':'ちょくちょう','脊髄':'せきずい','耳小骨':'じしょうこつ','鼓膜':'こまく','網膜':'もうまく','水晶体':'すいしょうたい','義歯':'ぎし','口腔':'こうくう','食物':'しょくもつ','麻痺':'まひ','右側':'みぎがわ','左側':'ひだりがわ','二人':'ふたり','一人':'ひとり','両腕':'りょううで','両足':'りょうあし'}
override_pattern=re.compile('|'.join(map(re.escape,sorted(OVERRIDES,key=len,reverse=True))))
inventory={}
def ruby(text):
    result=[]
    def tokenize(part):
        # Preserve whitespace exactly; the UI recognizes standalone newline tokens.
        for segment in re.split('(\\s+)',part):
            if not segment:continue
            if segment.isspace():
                result.extend({'text':c} for c in segment);continue
            offset=0
            for w in tagger(segment):
                at=segment.find(w.surface,offset)
                assert at>=offset
                if at>offset:result.append({'text':segment[offset:at]})
                token={'text':w.surface}
                if re.search('[一-龯々]',w.surface):
                    kana=hira(w.feature.kana or '')
                    assert kana and not re.search('[一-龯]',kana),(w.surface,w.feature)
                    token['readingKana']=kana;inventory.setdefault(w.surface,set()).add(kana)
                result.append(token);offset=at+len(w.surface)
            if offset<len(segment):result.append({'text':segment[offset:]})
    start=0
    for match in override_pattern.finditer(text):
        tokenize(text[start:match.start()]);word=match.group();kana=OVERRIDES[word]
        result.append({'text':word,'readingKana':kana});inventory.setdefault(word,set()).add(kana);start=match.end()
    tokenize(text[start:]);assert ''.join(t['text'] for t in result)==text
    return result
def save(p,value):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':
    import html, cairosvg
    labels={
      's02-bath':['A  ぬれたゆか','B  いりぐちのだんさ','C  てすり'],
      's02-call':['A  すわっているひと','B  てがとどくはんい','C  ボタンは B のそと'],
      's02-laundry':['A  きれいなぬの','B  べんでよごれたぬの','C  まだわけていないかご'],
      's02-meal':['しじ  ID 07 / M','トレー  ID 07 / N','M と N は ちがうかたち'],
      's02-storage':['A  たな: かくにんずみ','B  つくえ: かくにんずみ','C  ばしょ: みかくにん'],
      's03-night':['A  くらいろうか','B  ゆかをよこぎるコード','C  へや'],
      's03-contact':['14:00  れんらくをおくった','へんじ: みかくにん','けっか: みかくにん'],
      's03-privacy':['A  あいたいりぐち','B  ろうかからみえるベッド','C  ちいさいタオル'],
      's03-denture':['ぎしのかんりひょう: ID 18','ようき: ID 81','もちぬし: みかくにん'],
      's03-stages':['A  トレー: じゅんびずみ','B  ていきょう: みかくにん','C  たべたりょう: みかくにん']}
    support=[];collection=[];figure_records=[]
    for kind in ['skills','japanese']:
      collection.append({'id':f'kaigo-{kind}-mock-01','path':f'kaigo-{kind}-mock-01.json'})
      for n in [2,3]:
        raw=forms[kind,n];count=45 if kind=='skills' else 15
        assert len(raw)==count,(kind,n,len(raw))
        base=json.loads((D/f'kaigo-{kind}-mock-01.json').read_text())
        m={k:copy.deepcopy(base[k]) for k in ['sourceMetadata','policy','scoringScopeVi','coverageLimitsVi']}
        m.update(id=f'kaigo-{kind}-mock-{n:02}',version=1,status='independent_new_form_ai_editorial_human_review_pending',language='ja',supportLanguage='vi_after_submission',durationMinutes=60 if kind=='skills' else 30,durationMs=3600000 if kind=='skills' else 1800000,measuredDuration=False,sectionBlueprint=copy.deepcopy(base['sectionBlueprint']),questionCount=count,questions=[],structureSource={'url':'https://www.mhlw.go.jp/stf/newpage_000117702.html','checkedAt':'2026-10-08','use':'counts_duration_categories_only'},review=REVIEW.copy(),runtimeIntegrated=False,appIntegrationReady=False,releaseReady=False,officialExam=False,furiganaStatus='dictionary_plus_contextual_ai_editorial_overrides_native_pending')
        rng=random.Random(20261008+n+(0 if kind=='skills' else 100))
        positionOffset=({2:3,3:1} if kind=='skills' else {2:1,3:2})[n]
        positions=[(i+positionOffset)%4 for i in range(count)]
        while True:
            rng.shuffle(positions)
            if not any(positions[i]==positions[i-1]==positions[i-2] for i in range(2,count)):break
        for i,r in enumerate(raw):
            target=positions[i];wrong=r['opts'][1:].copy();rng.shuffle(wrong);ordered=wrong;ordered.insert(target,r['opts'][0])
            qq={'id':m['id']+f'-q{i+1:02}','sectionId':{'care_vocabulary':'terms','care_conversation':'dialogue','care_documents':'documents'}.get(r['sectionId'],r['sectionId']),'promptJa':r['promptJa'],'optionsJa':[x[0] for x in ordered],'correctIndex':target,'rationalesVi':[('Đúng: ' if j==target else 'Sai: ')+x[2] for j,x in enumerate(ordered)],'sourceRefs':[{'printedPage':p,'pdfPage':p+2,'purpose':'verified knowledge/term only; independent expression'} for p in r['pages']],'review':REVIEW.copy(),'pointValue':1,'practiceScope':'independent_full_mock_for_internal_test_not_official','editorialCompetencyVi':r['promptVi'],'furigana':{'prompt':ruby(r['promptJa']),'options':[ruby(x[0]) for x in ordered]}}
            entry={'questionId':qq['id'],'promptVi':r['promptVi'],'optionsVi':[x[1] for x in ordered],'displayGate':'after_submission_only','translationStatus':'ai_original_content_translation_native_pending'}
            if r['passageJa']:
                qq['passageJa']=r['passageJa'];qq['furigana']['passage']=ruby(r['passageJa']);entry['passageVi']=r['passageVi']
            if r['figure']:
                key,ja,vi,_=r['figure'];qq['figurePath']='mock-figures/'+key+'.svg';qq['figureDescriptionJa']=ja;qq['furigana']['figureDescription']=ruby(ja);entry['figureDescriptionVi']=vi
                # Original fact/decision cards: three separated conditions. Text is kana
                # so there is no kanji inside bitmap without a reading.
                lines=labels[key];shapes=[]
                for j,line in enumerate(lines):
                    y=35+j*122
                    shapes.append(f'<rect x="34" y="{y}" width="732" height="102" rx="15" fill="{["#eaf2fb","#fff0d3","#e5f3e9"][j]}" stroke="#283c55" stroke-width="2"/><text x="62" y="{y+62}" font-family="Noto Sans JP, sans-serif" font-size="29" fill="#142335">{html.escape(line)}</text>')
                svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420"><rect width="800" height="420" fill="#fffdf5"/>'+''.join(shapes)+'</svg>'
                svg_path=D/qq['figurePath'];svg_path.parent.mkdir(exist_ok=True);svg_path.write_text(svg)
                png=ROOT/'assets/kaigo/practical'/f'{key}.png';cairosvg.svg2png(bytestring=svg.encode(),write_to=str(png))
                figure_records.append({'key':key,'svg':str(svg_path.relative_to(ROOT)),'png':str(png.relative_to(ROOT)),'independentlyCreated':True,'labelsKana':lines,'domainHumanReviewed':False})
            m['questions'].append(qq);support.append(entry)
        m['answerArrangementEvidence']={'seed':20261008+n+(0 if kind=='skills' else 100),'algorithm':'balanced_position_multiset_seeded_shuffle_max_identical_run_two_then_freeze','runtimeShuffle':False}
        save(D/(m['id']+'.json'),m);collection.append({'id':m['id'],'path':m['id']+'.json'})
    save(D/'kaigo-mock-review-support-expanded-vi.json',{'version':1,'displayGate':'after_submission_only','humanNativeReviewed':False,'runtimeIntegrated':False,'entries':support})
    save(D/'mock-collection.json',{'version':1,'approvedAt':'2026-10-08','scopeVi':'6 đề tổng: 3 kỹ năng và 3 tiếng Nhật, 180 câu; không phải 6 cặp','forms':collection,'reviewSupportPaths':['kaigo-mock-review-support-vi.json','kaigo-mock-review-support-expanded-vi.json'],'mandatoryCurriculumUnchanged':True,'humanReviewed':False,'releaseReady':False})
    save(ROOT/'docs/ssw-workspace/kaigo/reviews/mock-expansion-furigana.json',{'version':1,'contextualOverrides':OVERRIDES,'surfaces':{k:sorted(v) for k,v in sorted(inventory.items())},'reviewedByNativeSpeaker':False,'automaticReadingsAreCandidates':True})
    save(ROOT/'docs/ssw-workspace/kaigo/reviews/mock-expansion-figures.json',{'figures':figure_records,'aiVisualReviewed':False,'domainHumanReviewed':False})
    print('AUTHORED four independent new forms, 120 questions, 480 option rationales, 10 figures; native/domain pending')
