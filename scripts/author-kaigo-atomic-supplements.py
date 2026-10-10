"""Independently authored explanation cards. No source text is copied into output."""
import json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
units=[]
def unit(key,pages,day,title,facts,case,answer,limit='Kiến thức nhận diện và giải thích. Việc chăm sóc thực tế cần đánh giá cá nhân, kế hoạch và hướng dẫn tại cơ sở.'):
    units.append(dict(id='kaigo-atomic-'+key,titleVi=title,parentDay=day,sourcePrintedPages=pages,
      points=[dict(id='kaigo-atomic-'+key+'-'+str(i+1),explanationVi=s) for i,s in enumerate(facts)],
      probe=dict(id='kaigo-atomic-case-'+key,promptVi=case,expectedVi=answer),limitsVi=limit,
      humanReviewed=False,domainReviewed=False,releaseReady=False))

unit('stress',[42,43],8,'Cảm xúc, động lực và các nguồn căng thẳng',[
 'Cùng một tình huống, mỗi người có thể vui, buồn, bực hoặc lo theo cách khác. Nét mặt và thái độ là thông tin để hỏi thêm, không phải kết luận chắc chắn về cảm xúc.',
 'Động lực thể hiện ở mong muốn chủ động làm việc có ý nghĩa với mình. Hỗ trợ người dùng tự chọn mục tiêu có thể giữ động lực tốt hơn việc làm hộ mọi phần.',
 'Tiếng ồn, nóng hoặc lạnh là tác động từ môi trường có thể tạo căng thẳng.',
 'Đói, mệt và thiếu ngủ là các yếu tố cơ thể cần xem khi tìm hiểu căng thẳng.',
 'Sợ hãi, lo âu hoặc quan hệ khó khăn có thể tạo căng thẳng tâm lý và xã hội. Không quy mọi khó chịu cho tính cách.'
 ],'Bác nói phòng sinh hoạt quá ồn nhưng nhân viên ghi “bác không thích giao tiếp”. Cần sửa cách hiểu thế nào?',
 'Ghi lời bác về tiếng ồn và hỏi nhu cầu; chưa có căn cứ kết luận không thích giao tiếp. Xem môi trường, cơ thể và quan hệ thay vì gán tính cách.')
unit('memory',[44],8,'Các lớp trí nhớ không thay thế nhau',[
 'Thông tin mới phải được tiếp nhận, duy trì rồi gọi lại. Khó nhớ có thể nằm ở một hoặc nhiều khâu này.',
 'Trí nhớ ngắn hạn giữ thông tin trong thời gian ngắn; trí nhớ dài hạn có thể duy trì lâu hơn. Hai loại không có cùng nhiệm vụ.',
 'Trí nhớ sự kiện gắn với một trải nghiệm cụ thể; trí nhớ ngữ nghĩa giữ hiểu biết như nghĩa của từ.',
 'Trí nhớ quy trình giúp thực hiện kỹ năng quen thuộc. Gợi mồi là ảnh hưởng của thông tin gặp trước lên xử lý sau, có thể không cần nhớ có ý thức.'
 ],'Bác vẫn biết dùng kéo nhưng quên vừa nghe lịch gì. Có mâu thuẫn không?',
 'Không. Kỹ năng quen thuộc và ghi nhận/gọi lại thông tin lịch là các mặt trí nhớ khác nhau; không dùng một mặt để kết luận mọi mặt còn tốt.')
unit('needs',[45],2,'Nhu cầu thể chất và nhu cầu xã hội',[
 'Trong mô hình Maslow, ăn, uống và ngủ thuộc nhu cầu sinh lý; tránh nguy hiểm thuộc nhu cầu an toàn.',
 'Được gắn bó với người khác khác với được công nhận giá trị, và cả hai đều là nhu cầu xã hội.',
 'Phát triển khả năng, làm việc có ý nghĩa và đạt mục tiêu riêng liên quan tự thực hiện. Mô hình có năm nhóm nhu cầu, không phải quy trình buộc mọi người phải đi qua từng tầng.'
 ],'Nhân viên nói bác cần giúp ăn nên hôm nay không cần hỏi có muốn gặp bạn không. Thiếu ý gì?',
 'Hỗ trợ nhu cầu sinh lý không xóa nhu cầu kết nối và lựa chọn. Hỏi cả khả năng ăn, an toàn và mong muốn gặp bạn.')
unit('temperature',[46,47],9,'Nội môi và điều kiện đo nhiệt',[
 'Nội môi được giữ bằng điều chỉnh. Khi nóng, tỏa nhiệt qua mồ hôi là một ví dụ về phản hồi giúp cân bằng, không phải cơ thể luôn giữ một số bất biến.',
 'Nhiệt độ thay đổi theo thời điểm trong ngày và theo người. Một số đo cần đi cùng thời gian, vị trí và loại thiết bị.',
 'Ở mẫu đo nách, đầu cảm biến tiếp xúc đúng vùng nách và cánh tay khép giữ vị trí. Ví dụ liệt một bên chọn phía không liệt; việc áp dụng theo kế hoạch và hướng dẫn thiết bị.',
 'Thiết bị đo ở tai hoặc trán dùng nguyên lý và vị trí khác. Không đổi vị trí đo rồi so hai số như hoàn toàn cùng điều kiện.'
 ],'Một lần đo ở tai, lần khác ở nách. Chỉ ghi “nhiệt tăng” đã đủ chưa?',
 'Chưa. Phải ghi số, đơn vị, thời điểm, vị trí và thiết bị; so thay đổi cần xét khác biệt điều kiện đo.')
unit('breathing',[48,59,60],9,'Đường khí và những gì cần quan sát',[
 'Các nhãn đường thở cần phân biệt: khoang mũi, hầu, thanh quản, khí quản và phế quản. Phổi nhận khí; trao đổi oxy/carbon dioxide xảy ra tại phế nang.',
 'Nhịp thở chịu ảnh hưởng tuổi, hoạt động, cảm xúc và tình trạng sức khỏe; quan sát cả công thở, âm thanh và đờm, không chỉ đếm.',
 'Môi hoặc móng đổi màu tím xanh có thể là dấu hiệu thiếu oxy cần xử lý khẩn theo tình huống. Không chờ xuất hiện tím mới gọi hỗ trợ khi khó thở.',
 'Ho giúp tống kích thích khỏi đường thở; đờm là chất tiết. Ho kéo dài hoặc đờm thay đổi là dữ kiện cần báo, không tự xác định tác nhân.'
 ],'Bác khó thở mới xuất hiện nhưng môi chưa tím. Có nên chờ đổi màu không?',
 'Không. Gọi hỗ trợ khẩn theo tình huống, ghi điều thực sự quan sát; tím là một dấu hiệu có thể gặp chứ không phải điều kiện bắt buộc.')
unit('pulse',[49],9,'Mạch: vị trí khác nhau, dữ kiện khác nhau',[
 'Mạch động mạch phản ánh sóng tạo từ tim co bóp. Cần ghi tần số, mức đều và độ mạnh trong điều kiện đã đo.',
 'Động mạch quay ở cổ tay, động mạch cánh tay ở vùng khuỷu, động mạch thái dương ở bên đầu và động mạch cảnh ở cổ là các vị trí trong sơ đồ.',
 'Vùng bẹn và mu chân cũng có vị trí bắt mạch. Biết nhãn giải phẫu không đồng nghĩa được tự thực hiện mọi kỹ thuật, nhất là vùng cổ.',
 'Hoạt động, lo lắng, bệnh và tuổi ảnh hưởng nhịp. Không suy tình trạng một người từ tuổi hoặc một số đo duy nhất.'
 ],'Một báo cáo chỉ ghi “mạch bình thường”. Cần dữ kiện nào để người nhận hiểu?',
 'Số đo, đơn vị, vị trí/thời điểm, nhịp đều hay không và đặc điểm quan sát được; không ghi giá trị chưa đo.')
unit('pressure-context',[50,51],9,'Huyết áp và bối cảnh làm thay đổi số đo',[
 'Tâm thu gắn với tim co đẩy máu; tâm trương gắn với tim giãn. Huyết áp là áp lực máu tác động lên thành động mạch.',
 'Phấn khích, hồi hộp và thiếu ngủ có thể làm số đo thay đổi. Chúng là bối cảnh cần ghi, không phải lý do bỏ qua bất thường.',
 'Đổi nhiệt độ hoặc vận động đột ngột có thể ảnh hưởng huyết áp. Tư thế và tình trạng bệnh cũng cần được xét.',
 'Rặn khi đại tiện hoặc cố nhịn nhu cầu bài tiết là các bối cảnh có thể ảnh hưởng tuần hoàn. Không yêu cầu người dùng nhịn để thuận lịch nhân viên.'
 ],'Hai lần đo khác nhau, lần thứ hai vừa sau hoạt động. Nên báo thế nào?',
 'Ghi cả hai số và bối cảnh, thời gian/tư thế; không tự kết luận đã mắc hoặc hết tăng huyết áp.')
unit('pressure-organs',[51,74],10,'Tăng huyết áp và các cơ quan có thể bị ảnh hưởng',[
 'Huyết áp cao kéo dài liên quan nguy cơ tổn thương mạch và cơ quan. Không có triệu chứng vẫn có thể cần được đánh giá.',
 'Não: cần phân biệt nhồi máu do tắc mạch với xuất huyết do mạch vỡ, gồm xuất huyết não và xuất huyết dưới nhện.',
 'Tim: bệnh mạch vành có thể liên quan đau thắt ngực hoặc nhồi máu cơ tim. Xơ vữa là quá trình tổn thương thành mạch, không phải tên một số đo.',
 'Mạch ở võng mạc cũng có thể bị tổn thương. Không chỉ nghĩ huyết áp ảnh hưởng tim mà bỏ mắt và não.'
 ],'Bác không đau đầu nên nhân viên nói không thể có tăng huyết áp. Nhận định đó đúng không?',
 'Không. Triệu chứng không thay đánh giá huyết áp; cần theo kết quả đo và kế hoạch chuyên môn, không tự chỉnh thuốc.')
unit('body-regions',[52],8,'Vị trí cơ thể trong báo cáo',[
 'Đầu và cổ khác với thân; thân gồm các vùng như ngực và bụng.',
 'Chi trên chỉ vùng tay, chi dưới chỉ vùng chân. Báo cáo thêm trái/phải theo cơ thể người dùng.',
 'Lòng bàn tay và lòng bàn chân là mặt tiếp xúc khác với mu tay/mu chân. Tên vị trí chính xác giúp tránh nhầm vùng đau hoặc vùng đã vệ sinh.'
 ],'“Bác đau ở tay” còn thiếu gì khi bàn giao?',
 'Vị trí cụ thể, bên trái/phải, lời bác và thời điểm; không tự thêm nguyên nhân hoặc mức đau chưa hỏi.')
unit('nerves',[53],8,'Đường truyền thần kinh và số đôi',[
 'Não và tủy sống thuộc thần kinh trung ương; các dây ngoại biên liên hệ trung ương với những vùng cơ thể.',
 'Dây thần kinh sọ được mô tả thành 12 đôi; dây thần kinh tủy sống thành 31 đôi. “Đôi” nghĩa là một cặp, không phải tổng số dây riêng lẻ.',
 'Tín hiệu cảm giác đi vào trung ương; lệnh vận động đi ra. Tủy sống vừa truyền tín hiệu vừa tham gia các đáp ứng thần kinh.'
 ],'Người học ghi 12 dây sọ và 31 dây tủy. Cần sửa đơn vị thế nào?',
 'Ghi 12 đôi dây thần kinh sọ và 31 đôi dây thần kinh tủy sống; không bỏ đơn vị đôi.')
unit('brain-parts',[53,54,88],8,'Đọc các nhãn não và nối với chức năng',[
 'Đại não tham gia nhận thức và hoạt động có ý thức; tiểu não phối hợp động tác và cân bằng.',
 'Trung não, cầu não và hành não là các thành phần thân não. Thân não liên quan các chức năng sống như nhịp tim, hô hấp và nuốt.',
 'Gian não gồm những cấu trúc như đồi thị và vùng dưới đồi. Vùng dưới đồi tham gia điều hòa tự chủ, nhiệt và nhịp ngủ.',
 'Những tên này chỉ các vùng có liên hệ với nhau, không phải mỗi nhiệm vụ chỉ do một vùng đơn độc quyết định.'
 ],'Một sơ đồ chỉ ghi “thân não” nhưng đề hỏi cầu não ở nhóm nào. Cần nối nhãn ra sao?',
 'Cầu não cùng trung não và hành não thuộc thân não; phân biệt với đại não và tiểu não.')
unit('autonomic-heart',[55],8,'Tự chủ: tim, mạch và huyết áp',[
 'Giao cảm thường giúp cơ thể đáp ứng hoạt động hoặc căng thẳng; đối giao cảm nổi bật trong nhiều hoạt động nghỉ và phục hồi. Hai hệ điều chỉnh tự động, không đợi mệnh lệnh có ý thức.',
 'Ở tim, tác động giao cảm thường làm nhịp nhanh hơn; đối giao cảm có thể làm nhịp chậm lại.',
 'Giao cảm điều chỉnh trương lực nhiều mạch ngoại biên và có thể làm co mạch. Huyết áp phụ thuộc cả tim và mạch, không có một hiệu ứng đối xứng đơn giản cho mọi cơ quan.',
 'Bảng học mô tả xu hướng huyết áp tăng khi đáp ứng giao cảm. Không dùng tên hệ thần kinh để suy huyết áp của một người chưa đo.'
 ],'Bác đang lo nên có thể ghi luôn “huyết áp tăng” không?',
 'Không. Lo là dữ kiện tâm trạng; huyết áp chỉ ghi số thực đã đo cùng điều kiện. Xu hướng sinh lý không thay số đo cá nhân.')
unit('autonomic-other',[55],8,'Tự chủ: đồng tử, ruột, đường thở và mồ hôi',[
 'Đồng tử thường giãn với tác động giao cảm và co với tác động đối giao cảm. Đây là thay đổi điều chỉnh lượng ánh sáng, không phải bài tự khám thần kinh.',
 'Hoạt động giao cảm có thể giảm vận động tiêu hóa; đối giao cảm thường tăng hoạt động tiêu hóa.',
 'Ở đường thở, tác động giao cảm có thể hỗ trợ giãn phế quản, còn đối giao cảm có thể gây co phế quản; mức thực tế phụ thuộc cơ chế và tình trạng.',
 'Tuyến mồ hôi chủ yếu được điều khiển qua giao cảm. Không dạy rằng đối giao cảm trực tiếp “tắt mồ hôi” như một cặp đối xứng ở mọi nơi.'
 ],'Vì sao không thể vẽ mọi tác động tự chủ thành hai mũi tên ngược nhau hoàn toàn?',
 'Sự phân bố và cơ chế ở mỗi cơ quan khác nhau; ví dụ tuyến mồ hôi chủ yếu chịu chi phối giao cảm. Cần nêu cơ quan và giới hạn của mô hình.')
unit('skeleton-functions',[56],15,'Xương vừa nâng đỡ vừa có chức năng sinh học',[
 'Khung xương nâng đỡ thân và tạo điểm tựa cho vận động cùng cơ, khớp.',
 'Xương bảo vệ cơ quan bên trong; khoáng như canxi được dự trữ ở xương; tủy xương tham gia tạo tế bào máu.',
 'Cột sống có các đường cong sinh lý thường được mô tả bằng dạng chữ S. Không dùng một hình dáng để kết luận bệnh cột sống của người dùng.'
 ],'Chỉ nói xương dùng để đi lại đã đủ chưa?',
 'Chưa: còn nâng đỡ, bảo vệ, dự trữ khoáng và tạo máu; các chức năng này liên quan cả lúc không đi lại.')
unit('skeleton-labels',[56,79],15,'Nhãn xương và các vị trí hay gãy',[
 'Vùng đầu có xương sọ; ở ngực có xương ức và xương sườn. Cột sống gồm các đoạn, trong đó có đốt sống ngực và thắt lưng.',
 'Ở cánh tay có xương cánh tay; cẳng tay có xương quay và xương trụ. Xương đùi nằm ở đùi, khác với hai xương cẳng tay.',
 'Các vị trí gãy thường gặp trong nhóm người cao tuổi được học gồm xương cánh tay, vùng xương quay, cột sống và cổ xương đùi.',
 'Loãng xương làm sức bền xương giảm. Ít vận động kéo dài và thay đổi nội tiết sau mãn kinh có thể góp nguy cơ; không quy mọi đau lưng cho loãng xương.'
 ],'Báo cáo viết “đùi” nhưng hình đánh dấu cổ xương đùi. Nên giữ độ chính xác thế nào?',
 'Nêu đúng vị trí được hồ sơ/hình xác nhận, phân biệt cổ xương đùi với toàn vùng đùi; không tự chẩn đoán gãy từ đau.')
unit('muscle-labels',[57],15,'Nhóm cơ theo vùng và hướng nhìn',[
 'Các nhãn vùng vai/ngực gồm cơ delta và cơ ngực lớn. Vùng cánh tay có cơ nhị đầu ở phía trước và cơ tam đầu nổi bật phía sau.',
 'Vùng hông/mông gồm cơ thắt lưng chậu và cơ mông lớn; đùi có cơ tứ đầu và cơ nhị đầu đùi.',
 'Cơ góp giữ tư thế và tạo vận động; cơ cũng có trong các cơ quan bên trong. Khi đọc hình phải phân biệt nhìn trước với nhìn sau.'
 ],'“Cơ nhị đầu” và “cơ nhị đầu đùi” có phải cùng một nhãn không?',
 'Không. Một nhãn ở cánh tay, một nhãn ở đùi; phải ghi vùng và hướng nhìn, không rút gọn làm mất vị trí.')
unit('senses',[57,58],11,'Từ kích thích giác quan đến tín hiệu thần kinh',[
 'Mắt nhận ánh sáng, tai nhận âm thanh; khứu giác, vị giác và xúc giác nhận các loại kích thích khác. Tín hiệu được truyền qua thần kinh để não xử lý.',
 'Thủy tinh thể giúp hội tụ ánh sáng; võng mạc tiếp nhận/chuyển đổi kích thích ánh sáng; thần kinh thị giác dẫn tín hiệu về não.',
 'Âm thanh làm màng nhĩ rung; chuỗi xương con truyền và khuếch đại rung; ốc tai chuyển rung thành tín hiệu; thần kinh thính giác truyền tín hiệu vào hệ xử lý thính giác.'
 ],'Máy trợ thính làm âm thanh rõ hơn có chứng minh mọi phần đường nghe đều bình thường không?',
 'Không. Đường nghe có nhiều khâu từ tiếp nhận rung đến truyền/xử lý tín hiệu. Chọn hỗ trợ theo đánh giá và cách người dùng muốn giao tiếp.')
unit('circulation',[60,61],28,'Hai vòng tuần hoàn trong một hệ bơm',[
 'Hai tâm nhĩ nhận máu, hai tâm thất đẩy máu. Phía phải đưa máu tới phổi; phía trái đưa máu tới vòng hệ thống.',
 'Tuần hoàn phổi nối tim với phổi để trao đổi khí. Tuần hoàn hệ thống nối tim với các mô để cung cấp và thu hồi chất.',
 'Động mạch đưa máu rời tim, tĩnh mạch đưa máu về tim; mao mạch là mạng nhỏ nơi trao đổi với mô. Mạch phổi cho thấy không thể phân loại động/tĩnh mạch chỉ bằng lượng oxy.',
 'Máu vận chuyển khí, chất dinh dưỡng và chất thải; bạch huyết cũng tham gia vận chuyển dịch và miễn dịch.'
 ],'Tại sao câu “mọi động mạch đều có máu nhiều oxy” sai?',
 'Động mạch được gọi theo hướng rời tim. Động mạch phổi mang máu từ tim tới phổi trước trao đổi khí nên là ngoại lệ với cách suy chỉ theo oxy.')
unit('digestive',[62,154],29,'Đường thức ăn và các đoạn đại tràng',[
 'Thức ăn được đưa từ miệng qua thực quản vào dạ dày. Dạ dày nhào trộn và tiêu hóa nhờ vận động cùng dịch tiêu hóa.',
 'Ruột non đảm nhận phần lớn hấp thu dinh dưỡng và một phần nước; đại tràng hấp thu thêm nước và hình thành phân.',
 'Các nhãn đại tràng cần nhận biết gồm đoạn lên, ngang, xuống và sigma. Trực tràng giữ phân; tín hiệu căng góp cảm giác muốn đại tiện.',
 'Phân ra qua hậu môn khi cơ chế cơ thắt phối hợp phù hợp. Nhu cầu, khả năng giữ và khả năng đến nhà vệ sinh là các phần khác nhau.'
 ],'Người dùng đi không kịp nhà vệ sinh có đủ chứng minh cơ quan bài tiết bị hỏng không?',
 'Không. Cần xem cảm giác, kiểm soát, nhận biết nơi, đường đi, quần áo và thời gian hỗ trợ; không gộp mọi khó khăn thành bệnh cơ quan.')
unit('endocrine',[63],27,'Nhận diện các tuyến nội tiết',[
 'Tuyến nội tiết đưa hormone vào hệ tuần hoàn để điều chỉnh hoạt động. Tên tuyến khác với tên hormone và khác với ống dẫn nước tiểu.',
 'Các nhãn vùng đầu gồm tuyến yên và tuyến tùng; vùng cổ có tuyến giáp và các tuyến cận giáp.',
 'Tuyến ức nằm vùng ngực. Tuyến thượng thận liên quan vùng trên thận; tụy có phần tiết hormone điều hòa đường huyết.',
 'Buồng trứng và tinh hoàn là các tuyến sinh dục trong sơ đồ. Danh sách cần nhận diện gồm chín nhóm nhãn: yên, tùng, giáp, cận giáp, ức, thượng thận, tụy, buồng trứng, tinh hoàn.'
 ],'Thấy “tuyến thượng thận” có nên ghi là cơ quan tạo nước tiểu không?',
 'Không. Tuyến thượng thận là tuyến nội tiết; thận lọc và tạo nước tiểu. Gần nhau về vị trí không làm chúng có cùng chức năng.')
unit('immunity',[64],6,'Miễn dịch và lối sống: tránh suy thành lời hứa',[
 'Miễn dịch là hệ thống bảo vệ có nhiều thành phần trước tác nhân như vi khuẩn và virus; vệ sinh phòng lây vẫn cần ngay khi người khỏe.',
 'Ăn cân đối, vận động vừa sức và ngủ đủ góp duy trì sức khỏe. Căng thẳng kéo dài, quá sức và thiếu ngủ có thể ảnh hưởng khả năng bảo vệ.',
 'Tuổi và bệnh nền cũng ảnh hưởng đáp ứng. Không hứa cười hoặc làm ấm cơ thể sẽ nâng miễn dịch đến mức bảo đảm không nhiễm bệnh.'
 ],'Bác ngủ tốt nên nhân viên bỏ vệ sinh tay. Có liên hệ đúng không?',
 'Không. Thói quen hỗ trợ sức khỏe không thay biện pháp phòng lây; vẫn vệ sinh tay và xử lý sạch–bẩn theo quy trình.')
unit('sleep',[65,66],10,'Nghỉ ngơi, đồng hồ sinh học và chu kỳ ngủ',[
 'Nghỉ giúp giảm tải hoạt động và phục hồi; giấc ngủ hỗ trợ thể chất, tâm trạng và củng cố trí nhớ.',
 'Ánh sáng buổi sáng và nhịp sinh hoạt là các tín hiệu góp đồng bộ đồng hồ ngày/đêm. Cần điều chỉnh theo người, không ép lịch bằng tuổi.',
 'NREM có nhiều giai đoạn với độ sâu khác nhau; REM có chuyển động mắt nhanh và hoạt động não đặc trưng. Các giai đoạn lặp trong đêm.',
 'Người cao tuổi có thể ít giấc sâu, ngủ ngắn hoặc thức nhiều hơn. Không gọi mọi NREM là sâu, mọi REM là nông hoặc mọi khó ngủ là bình thường.'
 ],'Vì sao tóm tắt “NREM = ngủ sâu” có thể làm người học hiểu sai?',
 'NREM chứa nhiều giai đoạn chứ không một mức sâu; phải hiểu chu kỳ và thay đổi cá nhân thay cho hai nhãn tuyệt đối.')
unit('aging',[68,69,70],10,'Thay đổi do tuổi theo từng hệ',[
 'Lịch sử sống, mất người thân hoặc thay đổi vai trò có thể tạo lo lắng, mất mát và bất lực; không xem mọi người cao tuổi có cùng tâm trạng.',
 'Thính lực có thể khó với âm cao; thị lực hoặc trường nhìn có thể thay đổi. Cần hỏi cách hỗ trợ riêng.',
 'Sức cơ giảm góp nguy cơ té; sức nhai, nuốt và cảm nhận vị có thể thay đổi, ảnh hưởng bữa ăn.',
 'Nhu động ruột, chức năng thận, hô hấp và mạch máu có thể thay đổi theo tuổi. Quan sát bài tiết, hô hấp và tuần hoàn trên nền cá nhân.',
 'Nhiều bệnh có thể cùng tồn tại; biểu hiện đôi khi không điển hình và bệnh có thể kéo dài. Không dùng thiếu một triệu chứng để loại trừ tình trạng cần đánh giá.'
 ],'Bác bớt ăn nhưng không sốt. Có thể kết luận chỉ do tuổi không?',
 'Không. So với thường ngày, hỏi cảm giác và báo thay đổi; tuổi và không sốt không giải thích đủ nguyên nhân.')
unit('dehydration',[71],10,'Mất nước: lượng vào, lượng ra và dữ kiện',[
 'Mất nước xảy ra khi nước cơ thể thiếu so với nhu cầu. Ít uống, tiêu chảy, nôn, sốt hoặc ra nhiều mồ hôi là các yếu tố có thể góp phần.',
 'Khô miệng/môi/da và lượng tiểu giảm là dữ kiện quan sát. Mạch nhanh hoặc huyết áp thấp có thể đi cùng, nhưng cần số đo thật.',
 'Cân bằng nước xét cả thức ăn/đồ uống đưa vào và mất qua nước tiểu, mồ hôi cùng các đường khác. Người ít cảm thấy khát vẫn có thể thiếu nước.',
 'Môi trường nóng, hoạt động và tắm là các thời điểm cần lưu ý kế hoạch nước. Mức nghiêm trọng cần hỗ trợ y tế; không tự tăng nước khi có hạn chế tim/thận hoặc vấn đề nuốt.'
 ],'Bác khô miệng và tiểu ít, nhưng hồ sơ có hạn chế nước. Có nên tự cho uống nhiều không?',
 'Không tự đổi hạn chế. Ghi thay đổi, báo để đánh giá và thực hiện kế hoạch phù hợp; dấu gợi ý chưa xác định nguyên nhân hoặc mức bù nước.')
unit('fever-constipation',[72],10,'Sốt và táo bón là hai cơ chế khác nhau',[
 'Điều hòa nhiệt liên quan vùng dưới đồi. Nhiệt cao hơn thường ngày cần đo và xem hoàn cảnh; nhiễm trùng, viêm và rối loạn cơ thể có thể liên quan.',
 'Mệt, ăn ít và đỏ mặt có thể đi cùng sốt, nhưng không phải ai cũng có biểu hiện đầy đủ. Đồ uống chỉ theo khả năng nuốt và kế hoạch.',
 'Táo bón liên quan khó hoặc ít đại tiện, phân cứng và/hoặc cảm giác tống không hết. Giảm hoạt động ruột, sức cơ hoặc nhịn nhu cầu có thể góp phần.',
 'Khoảng vận chuyển 24–72 giờ là số tham khảo trong bài học, không dùng một mốc để chẩn đoán mọi người. Ăn, nước, hoạt động và thời điểm hỗ trợ cần theo kế hoạch; không tự mát-xa bụng hoặc dùng thuốc.'
 ],'Nhân viên cho rằng qua 24 giờ chưa đi tiêu là chắc chắn táo bón. Cần chỉnh gì?',
 'Xem thói quen cá nhân, tính chất phân, khó chịu và thời gian; 24–72 giờ là khoảng tham khảo, không một ngưỡng kết luận.')
unit('edema-itch',[73],10,'Phù và ngứa: mô tả trước khi giải thích',[
 'Phù là dịch tích ở mô. Tim, thận, dinh dưỡng, giảm sức cơ hoặc ngồi lâu có thể liên quan; tăng cân có thể là dữ kiện đi kèm.',
 'Ghi vùng, bên và mức thay đổi phù. Vận động hoặc nâng chân chỉ theo tình trạng và kế hoạch, không coi là cách chữa mọi nguyên nhân.',
 'Ngứa có thể gắn da khô, thay đổi nhiệt/ẩm hoặc vật liệu quần áo; đỏ và phát ban là dữ kiện cần ghi.',
 'Có thể có nguyên nhân khác, kể cả tình trạng lây. Giữ ẩm theo kế hoạch và báo bất thường; không tự chẩn đoán chỉ từ ngứa.'
 ],'Bác gãi tay nhiều, nhân viên ghi ngay “dị ứng áo”. Phần nào chưa có căn cứ?',
 'Nguyên nhân dị ứng chưa xác minh. Ghi vị trí/ngứa/da thực thấy, hỏi thời điểm và liên hệ đánh giá phù hợp.')
unit('insomnia',[74],10,'Khó ngủ: khởi đầu, duy trì và cảm nhận',[
 'Khó vào giấc, thức giữa đêm hoặc cảm giác ngủ không hồi phục là những dạng thông tin khác nhau. Ghi dạng gặp và ảnh hưởng ban ngày.',
 'Mệt, bực và uể oải có thể đi cùng. Xem nhịp ban ngày, hoạt động, ánh sáng, tiếng ồn, đau và nhu cầu bài tiết.',
 'Điều chỉnh môi trường và lịch theo cá nhân; ngủ trưa kéo dài có thể ảnh hưởng đêm nhưng không cấm ngủ trưa mọi người. Khó ngủ ảnh hưởng sinh hoạt cần được đánh giá.'
 ],'Bác thức vì chuông hành lang nhưng ghi là “ngủ kém do tuổi”. Nên sửa gì?',
 'Giữ dữ kiện tiếng chuông/thời điểm và lời bác; xem môi trường, không mặc định nguyên nhân do tuổi hoặc tự dùng thuốc ngủ.')
unit('heart-diseases',[75,76],10,'Tắc, vỡ và giảm khả năng bơm',[
 'Mạch não tắc có thể gây nhồi máu; mạch vỡ có thể gây xuất huyết. Hậu quả phụ thuộc vùng và mức tổn thương.',
 'Đau thắt ngực liên quan thiếu máu cơ tim; nhồi máu cơ tim có tổn thương cơ tim do thiếu máu. Cảm giác đau không đủ để người chăm sóc tự phân biệt chẩn đoán.',
 'Suy tim là hội chứng tim không đáp ứng hiệu quả nhu cầu bơm máu. Khó thở, phù, tăng cân, mệt hoặc tiểu thay đổi là dữ kiện có thể gặp.',
 'Thay đổi thần kinh đột ngột hoặc khó thở/đau ngực đáng ngại cần hỗ trợ khẩn. Nghỉ/tư thế và muối/nước phải theo đánh giá, không tự áp một hạn chế chỉ từ tên bệnh.'
 ],'Nghe tên suy tim, nhân viên tự giảm nước và cho tiếp tục hoạt động. Vì sao chưa phù hợp?',
 'Tên bệnh không xác định mức nước hay hoạt động hôm nay. Xem dấu mới, gọi hỗ trợ khi khẩn và theo kế hoạch đã đánh giá.')
unit('pneumonia',[77],10,'Hít sặc, khó nuốt và viêm phổi',[
 'Viêm phổi có thể liên quan tác nhân nhiễm; sốt, mệt, ăn ít, ho và đờm là các biểu hiện có thể gặp, đôi khi không điển hình.',
 'Hít sặc là chất đi vào đường thở; khó nuốt là rối loạn quá trình nuốt. Hai khái niệm có liên hệ nhưng không đồng nghĩa.',
 'Chất từ miệng/họng có thể đưa vi khuẩn vào phổi và góp viêm phổi hít. Chăm sóc miệng và tư thế ăn phù hợp giúp quản lý nguy cơ, không bảo đảm loại hết nguy cơ.',
 'Sau ăn không cho nằm ngay trong phương án phù hợp; khi có dấu bất thường phải xử lý theo quy trình thay vì tiếp tục đút để thử.'
 ],'Bác không ho khi ăn. Có đủ chứng minh không hít sặc không?',
 'Không. Có hít sặc không gây ho rõ; cần khả năng nuốt, quan sát và kế hoạch đánh giá, không dùng một dấu âm tính để bảo đảm.')
unit('diabetes-types',[78],10,'Phân biệt hai loại đái tháo đường',[
 'Loại 1 thường liên quan hệ miễn dịch phá hủy tế bào beta, gây thiếu insulin. Có thể xuất hiện ở nhiều độ tuổi.',
 'Ở loại 2, cơ thể dùng insulin kém hiệu quả và lượng insulin có thể không đủ. Không phân loại chỉ bằng tuổi hoặc quy bệnh cho “ăn quá nhiều”.',
 'Tăng đường huyết có thể gây khát, tiểu nhiều, mệt và giảm cân không giải thích được; có người ít triệu chứng. Theo dõi và điều trị thuộc kế hoạch chuyên môn.'
 ],'Người cao tuổi chắc chắn chỉ mắc loại 2 có đúng không?',
 'Không. Tuổi không đủ phân loại; loại 1 cũng có thể xuất hiện ở người lớn. Xem chẩn đoán chuyên môn thay vì suy đoán.')
unit('diabetes-complications',[78],10,'Mắt, thận, thần kinh và vết thương',[
 'Đái tháo đường có thể gây tổn thương võng mạc, bệnh thận và tổn thương thần kinh; đây là các nhóm biến chứng khác nhau.',
 'Giảm cảm giác hoặc vết thương chậm lành làm việc quan sát da quan trọng. Không dùng “không đau” để bảo đảm không có tổn thương.',
 'Ăn, hoạt động và thuốc cần phối hợp theo kế hoạch, đồng thời giữ mong muốn và mức hài lòng bữa ăn. Không tự hạn chế thêm hoặc chỉnh thuốc.'
 ],'Bác có vết xước nhưng không đau. Có nên bỏ ghi vì chưa đau không?',
 'Không. Ghi tổn thương thực thấy; giảm cảm giác có thể làm đau không phản ánh đầy đủ. Báo theo kế hoạch và không tự điều trị.')
unit('visual-patterns',[82],11,'Ba kiểu khó nhìn cần phân biệt',[
 'Ám điểm trung tâm làm khó thấy vùng giữa nơi đang nhìn; có thể vẫn thấy vùng xung quanh.',
 'Trường nhìn thu hẹp giảm vùng nhìn thấy. Phóng chữ không tự khôi phục phần trường nhìn đã thiếu.',
 'Bỏ quên một bên không gian liên quan xử lý/chú ý tới không gian, khác với một vùng nhìn chỉ bị che tối. Cần dùng mô tả và đánh giá riêng, không gộp thành cùng một khiếm thị.'
 ],'Người dùng bỏ sót một bên khay. Có thể kết luận chỉ cần chữ to không?',
 'Không. Cần hỏi/đánh giá cách nhìn và nhận biết không gian; tăng cỡ chữ không giải quyết mọi dạng khó nhìn.')
unit('internal-disability',[85,86],13,'Thiết bị hỗ trợ cơ quan và điểm cần bảo vệ',[
 'Máy tạo nhịp hỗ trợ một số rối loạn nhịp. Vùng cấy cần tránh va đập theo hướng dẫn, không tự điều chỉnh thiết bị.',
 'Lọc máu loại bỏ một phần chất thải và dịch. Đường vào cần được bảo vệ; tải lên tay có đường vào, việc tắm và lượng muối/nước phải theo chỉ dẫn của đội điều trị.',
 'Oxy làm tăng nguy cơ cháy khi có nguồn bắt lửa; chuẩn bị nguồn cung/điện dự phòng theo thiết bị. Phòng nhiễm khuẩn vẫn là phần chăm sóc.',
 'Lỗ mở phân hoặc nước tiểu dẫn bài tiết qua vị trí được tạo. Da đỏ, trợt hoặc rò quanh dụng cụ là thông tin cần báo; không tự thay/chỉnh nếu chưa được đào tạo.'
 ],'Có được áp “không tắm ngày lọc máu” vào mọi người chỉ từ bảng học không?',
 'Không áp máy móc. Hiểu cần bảo vệ đường vào và xem tình trạng/quy trình cùng chỉ dẫn của đội điều trị; giữ dữ kiện học khác với chỉ định cá nhân.')
unit('mental-health',[87],11,'Trí tuệ, tâm thần và các biểu hiện',[
 'Khuyết tật trí tuệ liên quan phát triển trí tuệ và thích nghi; rối loạn tâm thần là nhóm tình trạng khác, có thể ảnh hưởng cảm xúc, nhận thức và hành vi.',
 'Trầm cảm có thể gắn khí sắc thấp và giảm hứng thú; hưng cảm là trạng thái khí sắc/năng lượng tăng bất thường. Không chẩn đoán chỉ vì ít nói hoặc nói nhiều.',
 'Ảo giác là trải nghiệm cảm giác không có kích thích tương ứng; hoang tưởng là niềm tin sai lệch cố định theo đánh giá chuyên môn. Tiếp nhận cảm xúc không đồng nghĩa xác nhận niềm tin đó là sự thật.'
 ],'Bác vui và nói nhiều trong một buổi. Có đủ ghi hưng cảm không?',
 'Không. Mô tả hành vi và thay đổi so với thường ngày; chẩn đoán cần đánh giá, không gán nhãn từ một buổi.')
unit('brain-lobes',[88,89],12,'Bốn thùy và các mặt nhận thức',[
 'Thùy trán tham gia tổ chức hành động, điều hành, vận động và điều chỉnh hành vi; thùy đỉnh tham gia tích hợp cảm giác và xử lý không gian.',
 'Thùy thái dương liên quan xử lý âm thanh, ngôn ngữ và trí nhớ; thùy chẩm nổi bật trong xử lý thị giác.',
 'Nhận thức còn gồm nhận ra đồ vật, hiểu/nói, nhớ/gọi lại, lập kế hoạch và hành động. Các chức năng dùng mạng liên vùng; không vẽ mỗi thùy có độc quyền một việc.'
 ],'Bác khó lập trình tự nhưng vẫn nhận ra khuôn mặt. Có phải mọi chức năng đều mất như nhau không?',
 'Không. Các mặt nhận thức có thể khác nhau; cần hỗ trợ đúng phần và giữ khả năng còn lại, không đồng nhất toàn bộ não với một chức năng.')
unit('forgetting',[90,91],12,'Đọc bảng hay quên với điều kiện',[
 'Một so sánh học tập xét quên phần chi tiết hay quên cả sự việc, mức tiến triển, mức người đó nhận ra khó khăn và ảnh hưởng sinh hoạt.',
 'Các khác biệt này là dấu gợi ý, không quy tắc tuyệt đối: người sa sút vẫn có thể nhận biết mình quên, và tiến triển không giống nhau ở mọi nguyên nhân.',
 'Tôn trọng câu chuyện sống, nghe điều làm bác lo, nói ngắn và giữ môi trường quen giúp hỗ trợ. Không đổi phòng chỉ theo tiện lợi nhân viên hoặc thử trí nhớ để làm bác xấu hổ.'
 ],'Bác biết mình quên nên người học loại trừ sa sút trí tuệ. Đã suy quá chỗ nào?',
 'Ý thức được khó khăn không đủ loại trừ. Cần xem chức năng, diễn tiến và đánh giá; bảng học không là công cụ chẩn đoán.')
unit('dementia-types',[92],12,'Đặc điểm từng nhóm sa sút trí tuệ',[
 'Alzheimer thường ảnh hưởng ghi nhớ mới và chức năng tiến triển dần. Sa sút do mạch máu liên quan tổn thương mạch não, có thể diễn tiến theo các đợt/bậc và có biểu hiện khu trú.',
 'Thể Lewy có thể gồm ảo giác thị giác, dao động nhận thức, dấu vận động kiểu Parkinson và hành vi diễn lại giấc mơ trong REM.',
 'Nhóm trán–thái dương có thể nổi bật thay đổi hành vi, ngôn ngữ hoặc hành động lặp. Không yêu cầu mọi người có đủ tất cả đặc điểm và không dùng nhóm triệu chứng để tự xác lập chẩn đoán.'
 ],'Kiến thức REM chung có thay việc hiểu hành vi giấc ngủ trong thể Lewy không?',
 'Không. REM là giai đoạn ngủ; hành vi diễn lại giấc mơ là một đặc điểm có thể liên quan thể Lewy, cần ghi hành vi thực và đánh giá riêng.')
unit('dementia-symptoms',[93,94,95],12,'Cốt lõi, hành vi và nhu cầu chưa được diễn đạt',[
 'Khó ghi nhớ mới, định hướng thời gian/nơi/người, sắp trình tự và hiểu/phán đoán là các nhóm chức năng cốt lõi có thể ảnh hưởng.',
 'BPSD gồm những biểu hiện tâm lý/hành vi như lo âu, ảo giác, hoang tưởng, kích động hoặc đi lại nhiều; chịu tác động của bệnh, môi trường và cách tương tác.',
 'Hành động bị gọi là hung hăng có thể liên quan sợ, đau hoặc nhu cầu bài tiết chưa diễn đạt được. Đi lại có thể có mục đích, không mặc định là vô nghĩa.',
 'Hỏi nhu cầu, quan sát thay đổi và phối hợp giúp tìm nguyên nhân; không biến một nhãn thành lý do tự dùng thuốc hoặc hạn chế thân thể.'
 ],'Bác đi đi lại lại trước bữa ăn. Có nên ghi chỉ là “lang thang” rồi ngăn lại không?',
 'Mô tả việc đi và hỏi nhu cầu/bối cảnh; có thể bác tìm người hoặc có nhu cầu khác. Không gán mục đích và tự hạn chế từ nhãn.')

unit('urination-volume',[153],29,'Tín hiệu đầy bàng quang và con số tham khảo',[
 'Thận tạo nước tiểu; niệu quản đưa tới bàng quang; niệu đạo đưa ra ngoài. Não, thân não và tủy sống phối hợp tín hiệu và kiểm soát tiểu tiện.',
 'Ví dụ học dùng dung tích khoảng 500 ml và cảm giác buồn tiểu quanh 200–300 ml. Đây là các số gần đúng để hiểu cơ chế, không phải yêu cầu phải chờ đầy mới được đi.',
 'Niệu đạo nam thường dài hơn nữ; tuyến tiền liệt bao quanh một đoạn niệu đạo nam. Cấu trúc và chức năng cần phân biệt với khả năng đi tới nhà vệ sinh.'
 ],'Bác muốn đi vệ sinh nhưng chưa biết đã có 200 ml. Có nên bắt chờ không?',
 'Không. Nhu cầu hiện tại cần được tiếp nhận; các lượng minh họa không phải điều kiện để hỗ trợ hay ngưỡng chẩn đoán cá nhân.')
unit('urine-reference',[155,156],31,'Theo dõi nước tiểu và phân: thời gian, lượng và màu',[
 'Bảng học tham khảo dùng 1.000–1.500 ml trong một ngày; nêu lượng cao hơn khoảng 2.000–3.000 ml và lượng thấp quanh 300–500 ml hoặc ít hơn. Không đọc mất cụm “trong ngày”.',
 'Số lần tham khảo là 4–6 trong ngày; bảng gợi chú ý từ 8 lần ban ngày hoặc 2 lần ban đêm. Số lần và tổng thể tích là hai dữ kiện khác nhau.',
 'Màu vàng nhạt/trong thường gặp; đục, đỏ hoặc nâu sẫm cần ghi. Mùi mạnh là thông tin, không đủ tự xác định nhiễm trùng.',
 'Lượng nước vào, thuốc, bệnh, thời tiết và khoảng ghi ảnh hưởng kết quả. Những mốc học không thay tiêu chuẩn chuyên môn có thể phụ thuộc cân nặng/thời gian hoặc kế hoạch cá nhân.'
 ],'600 ml trong nửa ngày có thể đem so ngay với mốc 1.000 ml/ngày không?',
 'Không. Cần cùng thời gian và điều kiện, ghi dữ kiện thật; không tự ngoại suy hoặc chẩn đoán từ khoảng thu chưa đầy đủ.')
unit('diaper-fit',[167,168,169],33,'Độ vừa tã và dữ kiện từ hình minh họa',[
 'Chuẩn bị chống thấm, giữ riêng tư và giải thích trước xoay. Tã bẩn cuộn mặt dính vào trong; ranh giới bẩn–sạch cần đổi vật liệu/găng và vệ sinh tay theo quy trình.',
 'Ví dụ minh họa dùng độ rộng có thể đặt 2–3 ngón ở bụng/đùi để nhắc tránh siết. Với sản phẩm thật, kiểm độ vừa theo nhãn và đánh giá da/cảm giác, không áp số ngón cho mọi tã.',
 'Nếp nhăn và mép cuộn có thể gây khó chịu, ma sát hoặc áp lực. Sau chỉnh, kiểm da, quần áo, ga và sức khỏe; thông thoáng phòng phù hợp mà vẫn giữ ấm.'
 ],'Tã không rò nhưng mép cuộn và bác đau. Đã đạt chăm sóc chưa?',
 'Chưa. Không rò khác với vừa và thoải mái. Chỉnh theo sản phẩm, kiểm da/cảm giác và sạch–bẩn; không chỉ đếm số ngón.')
unit('grooming-figure',[181],39,'Hiểu hình cạo râu và hình cắt móng',[
 'Hình máy cạo điện minh họa tiếp xúc đầu cạo đúng hướng, trong mẫu là gần vuông góc, cùng lực nhẹ và làm phẳng nếp da. Hướng và góc thật phụ thuộc kiểu máy.',
 'Ở ví dụ cắt móng, phần bờ được giữ đều thay vì khoét hai góc hoặc cắt sâu sát phần sống. Giũa phần sắc sau cắt theo hướng dẫn; không tự xử lý móng đau, sưng hoặc bất thường.',
 'Không dùng hình mẫu như bằng chứng mọi loại máy/móng đều cùng một phương pháp. Kiểm tình trạng da, quyền lựa chọn và phạm vi được phép trước thao tác.'
 ],'Nhân viên chỉ nhớ góc máy trong hình nên áp lên một máy cấu tạo khác. Thiếu gì?',
 'Thiếu kiểm kiểu máy và hướng dẫn sản phẩm, tình trạng da, kế hoạch và đồng ý. Hình có điều kiện minh họa, không là quy tắc mọi máy.')
unit('bed-wash-figures',[196,197],40,'Phân vùng lau tại giường và đọc hướng chuyển động',[
 'Bài học có một chuỗi minh họa: vùng mặt, tay, ngực/bụng, lưng, chân rồi vùng sinh dục được làm riêng. Mục đích là tổ chức sạch–bẩn, giữ ấm và không bỏ sót, không ép thứ tự khi tình trạng cần phương án khác.',
 'Lau vùng mắt nhẹ, chú ý sau tai/cổ; ví dụ vùng ngực nữ dùng động tác tròn, vùng lưng theo hướng nhóm cơ. Mũi tên trong bài chỉ hướng và phạm vi, không chỉ trang trí.',
 'Các vùng quanh khớp được làm có hệ thống với lực phù hợp; không áp lực cố định hoặc chà mạnh lên da mỏng/tổn thương.',
 'Nếu dùng xà phòng phải loại phần dư; lau khô ngay từng vùng rồi che lại. Nước chuẩn bị có thể nguội nhanh nên kiểm nhiệt ở tiếp xúc thực, không dùng nước nóng trực tiếp lên da.'
 ],'Lau sạch cả thân rồi mới lau khô và che có giữ cùng mục đích với chu trình từng vùng không?',
 'Không. Để da ướt lâu và phơi rộng làm mất nhiệt; cần sạch–loại dư–khô–che theo vùng, giữ phần sinh dục riêng và theo phạm vi đồng ý.')

unit('adl-iadl',[120,121,198],15,'Di chuyển nối các hoạt động sống',[
 'Di chuyển giúp tiếp cận nơi ăn, bài tiết, tắm và sinh hoạt xã hội; phạm vi hoạt động có thể ảnh hưởng cả chức năng thể chất và tinh thần.',
 'ADL gồm các việc cơ bản như ăn, mặc, tắm, bài tiết và di chuyển; IADL gồm các việc tổ chức cuộc sống như tiền bạc, mua sắm, giặt, đi lại bằng phương tiện và liên lạc.',
 'Một người tự làm ADL vẫn có thể cần hỗ trợ IADL, hoặc có thể quản lý một phần công việc dù cần hỗ trợ vận động. Phải đánh giá từng phần.'
 ],'Bác cần xe lăn nhưng vẫn tự quản lý tiền. Có nên giao người nhà quyết định mọi mua sắm không?',
 'Không. Hạn chế di chuyển không xóa khả năng quyết định/quản lý; hỗ trợ phần cần và giữ lựa chọn của bác.')
unit('posture-names',[123,124,125],18,'Tên tư thế và điểm nâng đỡ',[
 'Ngồi ghế, ngồi mép giường thả chân và ngồi duỗi chân có điểm tựa khác nhau. Nửa nằm/nửa ngồi như Fowler cần kiểm đỡ thân và nguy cơ trượt.',
 'Nằm ngửa, nghiêng và sấp mô tả hướng cơ thể. “Nằm nghiêng phải” cần xác định bên ở dưới, không đổi theo góc nhìn người chăm sóc.',
 'Ví dụ nghiêng dùng đệm vùng trước ngực và giữa chân; nửa ngồi dùng hỗ trợ chân/gối để giảm trượt, theo giường và tình trạng. Không coi tên tư thế là chỉ định phù hợp mọi người.'
 ],'Chỉ ghi “đã kê gối” có chứng minh tư thế thoải mái không?',
 'Không. Cần vùng đỡ, tiếp xúc da, đau/hô hấp/cảm giác và kết quả đã kiểm. Có gối không đồng nghĩa đúng vị trí.')
unit('disuse',[126,127],18,'Ít hoạt động và vùng chịu áp lực',[
 'Ít hoạt động kéo dài có thể làm teo cơ, giảm sức bền xương, cứng khớp và giảm chức năng cảm giác/tinh thần.',
 'Điều hòa huyết áp, tim phổi, cơ quan bên trong và dinh dưỡng cũng có thể bị ảnh hưởng; chóng mặt khi đổi tư thế là dữ kiện cần quan sát.',
 'Những vùng xương nhô như sau đầu, vai, khuỷu, xương cùng/mông và gót là các điểm cần chú ý khi quan sát tì đè theo tư thế.',
 'Áp lực, ma sát và trượt cùng tình trạng da/dinh dưỡng góp nguy cơ. Hoạt động, đổi tư thế, giảm áp và dinh dưỡng phải cá thể hóa, không áp một lịch chung.'
 ],'Ga phẳng nhưng người nằm lâu có chắc không bị loét tì đè không?',
 'Không. Ga phẳng giảm một yếu tố, còn áp lực/thời gian, trượt, da và dinh dưỡng; kiểm da và kế hoạch giảm áp.')
unit('movement-devices',[128,136,137],16,'Điểm tựa và dụng cụ di chuyển',[
 'Gậy chữ T thường nhẹ; gậy nhiều chân có chân đế rộng hơn. Khung tập đi tạo vùng tựa rộng, nhưng mức phù hợp vẫn cần đánh giá.',
 'Máy nâng có loại chạy trên hệ trần hoặc di chuyển trên sàn; dùng đúng hệ có thể giảm tải người chăm sóc. Không thay huấn luyện bằng biết tên máy.',
 'Xe lăn có vành đẩy cho người dùng và tay đẩy cho người hỗ trợ; bàn để chân đỡ chân, không dùng làm bậc đứng.',
 'Lốp mềm có thể làm phanh giữ kém. Kiểm lốp/phanh trước dùng; khi dừng cần cố định theo hướng dẫn, cả xe trống.'
 ],'Gậy nhiều chân luôn tốt hơn mọi loại gậy khác có đúng không?',
 'Không. Vùng tựa rộng là một đặc điểm; chọn cần xét người, nhịp, môi trường và hướng dẫn, không xếp hạng dụng cụ chỉ theo số chân.')
unit('turning-sitting',[129,130,131,132],17,'Đọc mẫu trở mình và ngồi dậy theo điều kiện',[
 'Trước thay tư thế cần tình trạng, giải thích/đồng ý và giường phù hợp người hỗ trợ. Người dùng làm phần có thể, không để minh họa làm thay tất cả.',
 'Mẫu liệt trái đặt bên yếu phía trên khi chuyển sang nằm nghiêng. Gập gối thu gọn thân, rồi điều chỉnh vùng hông/chân để có diện tựa thoải mái.',
 'Mẫu ngồi dậy từ nghiêng phải phối hợp đưa chân ra mép và dùng khuỷu bên khỏe để nâng thân. Độ cao cần cho hai bàn chân có điểm tựa khi ngồi.',
 'Sau đổi tư thế kiểm cảm giác, chóng mặt và bàn chân chạm sàn; không kéo tay yếu hoặc coi hình mẫu là phương pháp cho mọi chấn thương.'
 ],'Mẫu sách liệt trái có được áp y nguyên cho người hạn chế khớp háng không?',
 'Không. Phải xem đánh giá, phạm vi cử động và phương án được huấn luyện; hiểu mục tiêu nâng đỡ/điểm tựa không cho phép áp nguyên động tác.')
unit('standing-cane',[132,133,134,135],19,'Điểm tựa khi đứng và nhịp đi gậy',[
 'Trong mẫu đứng từ ngồi, chân khỏe được đặt thuận để nhận tải; người hỗ trợ ở phía yếu và bảo vệ nguy cơ gối khuỵu. Thân chuyển trước để đưa trọng tâm tới vùng tựa.',
 'Gối khuỵu là mất khả năng giữ tư thế gối dưới tải, có thể gây té. Chóng mặt hoặc đổi tình trạng sau nâng thân cần được kiểm.',
 'Đi ba nhịp tách gậy, chân yếu, chân khỏe; hai nhịp ghép gậy với chân yếu rồi tới chân khỏe. Mẫu ba nhịp thường có nhiều thời điểm giữ ổn định hơn, không đổi nhịp chỉ để nhanh.',
 'Mẫu lên bậc đi gậy→khỏe→yếu; xuống gậy→yếu→khỏe. Người hỗ trợ ở bậc thấp hơn, minh họa là một bậc: sau khi lên, trước khi xuống; tay vịn và điều kiện thực tế cần xét riêng.'
 ],'Câu “chân khỏe lên trước” có nói hết mẫu đi gậy lên bậc không?',
 'Chưa: còn đặt gậy, phía/bậc người hỗ trợ và điều kiện kế hoạch. Câu nhớ hai chân không thay toàn phương án.')
unit('wheelchair-transfer',[137,138,139],20,'Chuyển lên xe khác với đẩy xe',[
 'Trong mẫu liệt một bên, xe đặt phía khỏe và được cố định; điểm vịn bên khỏe và bảo vệ gối yếu được chọn trước chuyển.',
 'Phần đứng/xoay/ngồi phải được phối hợp theo đánh giá. Sau ngồi, kiểm độ sâu và nâng đỡ tư thế, bàn chân, tay/quần áo cùng cảm giác.',
 'Khi đẩy, đặt chân đúng chỗ, giữ tay tránh bánh, nói trước lúc di chuyển và tháo phanh đúng thời điểm. Việc đã chuẩn bị xe không chứng minh chuyển người đã xong.'
 ],'Nhân viên ghi “chuyển xong” khi mới cài phanh và đặt xe. Cần sửa dữ kiện nào?',
 'Ghi mới chuẩn bị xe; chuyển người, tư thế và cảm giác sau chuyển chưa kiểm. Không cho bước sau dựa vào kết quả chưa thực hiện.')
unit('wheelchair-curb',[140,141,142],16,'Bậc và dốc: đọc hướng trong hình',[
 'Mẫu lên bậc dừng và giải thích trước; thanh nâng và tay đẩy phối hợp nâng bánh trước có kiểm soát, rồi bánh sau. Mũi tên tay đẩy hướng nghiêng xuống trong mẫu tạo chuyển động nâng phía trước.',
 'Mẫu xuống bậc quay xe về phía sau, hạ bánh sau trước rồi hạ bánh trước có kiểm soát. Hai hướng không dùng cùng thứ tự bánh.',
 'Mẫu xuống dốc đứng đi lùi có kiểm phía sau để giảm nguy cơ người trượt khỏi ghế; người hỗ trợ có chân đế trước–sau. Loại xe, dốc và năng lực hỗ trợ quyết định phương án thật.',
 'Đây là hiểu mũi tên và trình tự minh họa, không hướng dẫn tự thử trên người. Không đứng lên bàn để chân hoặc cố tăng lực khi điều kiện không phù hợp.'
 ],'Vì sao “cứ nâng bánh trước trước” không đúng cho cả lên và xuống bậc?',
 'Mẫu lên và xuống có hướng/điểm đỡ khác nhau; mẫu xuống lùi hạ bánh sau trước. Cần huấn luyện và điều kiện phù hợp trước áp dụng.')
unit('swallow-stages',[144,145],22,'Năm chặng của ăn và nuốt',[
 'Trước ăn, giác quan nhận ra món, hình/mùi và chuẩn bị nước bọt. Đây là chặng nhận biết chứ chưa là thức ăn đã vào dạ dày.',
 'Trong chặng chuẩn bị miệng, nhai và nước bọt tạo khối thức ăn; chặng miệng dùng lưỡi chuyển khối về hầu.',
 'Chặng hầu có phản xạ nuốt và phối hợp bảo vệ đường thở; sau đó thực quản vận chuyển tới dạ dày.',
 'Khó ở bất kỳ chặng nào có thể ảnh hưởng ăn an toàn. Ăn còn đem lại niềm vui, nhịp sống và kết nối, không chỉ đưa năng lượng vào.'
 ],'Nhai được có chứng minh đã nuốt an toàn không?',
 'Không. Nhai thuộc chặng chuẩn bị; còn chuyển miệng, hầu/bảo vệ đường thở và thực quản.')
unit('food-devices',[146,147,148],24,'Kết cấu, tư thế và dụng cụ ăn',[
 'Cắt nhỏ, xay nhuyễn và làm mềm còn giữ hình là những cách khác nhau. Món dạng lỏng và làm đặc cũng không đồng nghĩa; chọn theo đánh giá nuốt và kế hoạch.',
 'Ngồi sâu, chân có tựa và đầu/cằm phù hợp giúp tổ chức ăn; ngửa cằm là điểm nguy cơ trong ví dụ. Ăn trên giường cần nâng đỡ thân/đầu theo phương án.',
 'Ví dụ nằm nghiêng khi phù hợp đặt bên khỏe ở dưới; gối hỗ trợ vị trí đầu. Không tự chọn tư thế từ tên bệnh.',
 'Nhóm dụng cụ gồm thìa/nĩa dễ cầm, loại cong, đũa hỗ trợ lò xo, đai giữ thìa, đĩa dễ xúc, thảm chống trượt, bát dễ cầm và cốc có tay cầm. Chức năng khác nhau, chọn theo phần người tự làm được.',
 'Món nên giữ nhiệt phù hợp để thưởng thức; phải kiểm nhiệt tiếp xúc và nhận biết nóng/lạnh, không gây bỏng vì muốn giữ món nóng.'
 ],'Thảm chống trượt và thìa cong giải quyết cùng một khó khăn không?',
 'Không. Thảm giúp ổn định đồ trên bàn, thìa cong thay hướng tiếp cận; chọn theo khả năng cụ thể, không dùng dụng cụ để thay mọi tự lập.')
unit('meal-checks',[149,150,151],26,'Trước, trong và sau mỗi miếng ăn',[
 'Trước bữa kiểm sức khỏe, đồng ý, đúng món/dạng, dị ứng/hạn chế, tay sạch và vị trí khay nhìn được. Người hỗ trợ chọn vị trí phù hợp tay thuận hoặc phía khỏe trong ca mẫu.',
 'Làm ẩm miệng có thể là một phần phương án, nhưng trà hoặc canh loãng không phù hợp tất cả người khó nuốt. Không tự dùng để thử nuốt.',
 'Trong mẫu, đưa từ góc miệng bên khỏe khi phù hợp, rút thìa ngang tránh buộc ngửa đầu; chờ xử lý miếng trước và không hỏi khi đang nhai.',
 'Sau bữa hỏi đã kết thúc chưa, kiểm thức ăn lưu và chăm sóc miệng theo khả năng. Ví dụ giữ ngồi khoảng 30 phút; thực tế theo kế hoạch cá nhân.',
 'Vị trí đồng hồ dùng mốc thống nhất từ phía người dùng; cần mô tả cả nhiệt độ và hương vị/nêm, không chỉ vị trí món.'
 ],'Đĩa sạch có chứng minh người dùng ăn đủ và miệng không còn thức ăn không?',
 'Không. Cần lượng thực biết, dấu nuốt và kiểm miệng; đĩa sạch không xác nhận mọi kết quả.')
unit('skin-structure',[187,188],38,'Da: lớp, tuyến và vùng nếp gấp',[
 'Các nhãn cần phân biệt gồm biểu bì, lớp bì và mô mỡ dưới da; chân tóc, tuyến bã, tuyến mồ hôi nằm trong cấu trúc da chứ không đều ở mặt ngoài.',
 'Tuyến mồ hôi ngoại tiết phân bố rộng và góp tỏa nhiệt; tuyến đầu tiết nổi bật ở những vùng như nách. Mùi còn phụ thuộc biến đổi của chất tiết và vi sinh trên da.',
 'Da là hàng rào bảo vệ, nhận kích thích và góp điều hòa nhiệt. Bã nhờn góp duy trì bề mặt; vệ sinh quá mạnh có thể làm tổn thương hàng rào.',
 'Nếp gấp và vùng da áp nhau dễ giữ ẩm/bẩn. Quan sát cả sạch, khô, đỏ và cảm giác, không chỉ số lần lau.'
 ],'Có cần chà mạnh mọi nếp gấp để bảo đảm sạch không?',
 'Không. Làm nhẹ theo tình trạng, loại dư và làm khô phù hợp; da sạch mà trầy vẫn là tổn thương.')
unit('bath-environment',[186,189,190],38,'Môi trường tắm và ý nghĩa của vệ sinh',[
 'Vệ sinh có thể giúp sạch, dễ chịu, thư giãn và nhịp sinh hoạt; không bảo đảm chữa đau khớp hoặc cải thiện mọi bệnh chỉ bằng tắm.',
 'Chênh lệch nhiệt giữa phòng thay và phòng tắm có thể gây gánh nặng tuần hoàn; nước quá nóng cũng tạo tải lên cơ thể.',
 'Sàn ướt/trơn, bậc và dụng cụ hỏng là các điểm nguy cơ riêng. Kiểm lối, điểm tựa và thiết bị trước dùng.',
 'Trước tắm xem sức khỏe, nhu cầu bài tiết và kế hoạch nước; tránh bố trí khi đói hoặc ngay sát bữa nếu phương án không phù hợp. Riêng tư và mức quan sát phải được giải thích.'
 ],'Sàn đã khô có chứng minh môi trường tắm an toàn đủ không?',
 'Chưa. Còn chênh nhiệt, nước, bậc, điểm tựa, thiết bị, sức khỏe và mức hỗ trợ.')
unit('grooming-purpose',[170,171],36,'Chỉnh trang là quyền thể hiện bản thân',[
 'Quần áo và vẻ ngoài góp bảo vệ da, điều chỉnh nhiệt, nhịp sống và sự tự tin/tham gia xã hội; sạch không phải mục đích duy nhất.',
 'Tôn trọng thói quen, sở thích và giá trị cá nhân. Chọn đồ theo mùa, hoạt động hôm nay và khả năng, không chỉ tuổi hoặc ý muốn nhân viên.',
 'Tự làm được một phần vẫn cần được giữ; hỗ trợ thay đồ, chải tóc hoặc mỹ phẩm không xóa quyền từ chối và lựa chọn.'
 ],'Nhân viên chọn áo vì “người cao tuổi nên mặc thế” dù bác muốn áo khác. Thiếu nguyên tắc nào?',
 'Thiếu lựa chọn và cá tính của bác. Hỏi sở thích, xét mùa/hoạt động/tình trạng rồi hỗ trợ phần cần.')
unit('home-environment',[198,199,200,201,202],44,'Việc nhà nối với môi trường và quyền sở hữu',[
 'Lên món, chọn nguyên liệu, chế biến, bày/phục vụ và dọn sau bữa đều thuộc chuỗi nấu ăn; dị ứng, bệnh và sở thích quyết định lựa chọn.',
 'Văn hóa và mùa ảnh hưởng món ăn. Món truyền thống như dịp năm mới là một ví dụ, không một thực đơn buộc mọi người theo.',
 'Dọn bụi/bẩn để an toàn và thoải mái; đồ có vẻ thừa vẫn có thể quan trọng. Hỏi đồng ý trước sắp lại hoặc bỏ.',
 'Giặt theo chất liệu/nhãn; đồ dính bài tiết, máu hoặc chất nôn cần xử lý theo nguy cơ và quy trình, không trộn vào phần sạch.',
 'Môi trường còn gồm chống trượt, tay vịn, tiếp cận tắm/nhà vệ sinh, nhiệt, độ ẩm, thông khí và riêng tư. Dụng cụ hỗ trợ đúng có thể mở khả năng hoạt động.'
 ],'Phòng sạch nhưng bác không với tới nút gọi và không muốn đồ bị bỏ đi. Đã đáp ứng môi trường sống chưa?',
 'Chưa. Cần tiếp cận an toàn, quyền sở hữu/lựa chọn và riêng tư, không chỉ mức sạch.')

unit('dignity',[10,11,12,13,14],2,'Tôn nghiêm, tự lập và chất lượng sống',[
 'Cần hỗ trợ không làm một người mất giá trị hay nhân quyền. Người dùng vẫn là người quyết định về cách sống của mình.',
 'QOL xét hài lòng, hạnh phúc và ý nghĩa sống, không chỉ số việc tự làm hoặc số đo sức khỏe.',
 'Bình thường hóa hướng tới đời sống cộng đồng có quyền và cơ hội, tránh định kiến; không có nghĩa ép mọi người hành xử giống nhau.',
 'Tự lập có cả mặt thể chất và quyết định tinh thần. Dùng khả năng còn lại, hỏi giá trị/mong muốn và hỗ trợ đúng phần.',
 'Nhịp thức, ăn, vệ sinh, hoạt động và ngủ khác nhau; sức khỏe, gia đình, nơi ở và cộng đồng đều liên quan cuộc sống.'
 ],'Bác cần người hỗ trợ mặc áo nhưng muốn tự chọn màu. Tự lập còn ở đâu?',
 'Ở quyền chọn và phần có thể tự làm; hỗ trợ thao tác không chuyển quyền quyết định sang nhân viên.')
unit('privacy-abuse',[16,17,18],4,'Riêng tư và nhận diện hành vi gây hại',[
 'Che phần cơ thể chưa chăm sóc và giải thích mức quan sát giúp giữ riêng tư khi tắm/bài tiết. Tuổi, địa chỉ, bệnh sử và ảnh đều là thông tin cần bảo vệ.',
 'Buộc tay/chân, ngăn xuống giường bằng rào, khóa phòng, dùng đai cản đứng hoặc dùng thuốc quá mức để kiểm soát hành vi có thể tước tự do. Biện pháp gọi là an toàn vẫn cần được xem xét về mục đích/tác động.',
 'Năm nhóm lạm dụng cần nhận diện gồm bạo lực thân thể, gây tổn thương tâm lý, bỏ chăm sóc cần thiết, chiếm lợi tài sản và xâm hại tình dục.',
 'Nghe lời đe dọa hoặc thấy dấu nghi ngờ cần bảo vệ người, ghi sự kiện và báo theo quy trình/đường thông báo phù hợp. Không đợi tự kết luận đủ chứng cứ mới xử lý an toàn; bài này không xác lập kết luận pháp lý cho một ca.'
 ],'Không cho bác ăn để bác nghe lời thuộc nhóm nguy cơ nào?',
 'Có dấu bỏ chăm sóc và gây sợ/tổn thương tâm lý. Cần bảo vệ, ghi lời/hành vi thực và báo; không dùng bữa ăn làm công cụ ép buộc.')
unit('team-roles',[19,20,21],1,'Mỗi vai chuyên môn giải quyết phần khác nhau',[
 'Bác sĩ đánh giá/chẩn đoán và điều trị; điều dưỡng hỗ trợ điều dưỡng và phối hợp y tế theo phạm vi. Người chăm sóc không tự nhận nhiệm vụ chẩn đoán hoặc chỉnh điều trị.',
 'PT tập trung vận động; OT các hoạt động chức năng sinh hoạt; ST giao tiếp và chức năng như nuốt. Các vai phối hợp chứ không thay thế hoàn toàn nhau.',
 'Chuyên gia dinh dưỡng xét dinh dưỡng, món và dạng theo nhu cầu; nhân viên bếp chuẩn bị bữa theo phân công.',
 'Care manager và công tác xã hội tham gia tư vấn/điều phối dịch vụ. Người dùng là trung tâm nhóm; chăm sóc quan sát và chia sẻ thông tin thật với đúng người.'
 ],'Khó nuốt và không rõ dạng bữa hôm nay có nên tự sửa món vì đã biết tên ST không?',
 'Không. Cần xác nhận kế hoạch với vai phụ trách/đội chuyên môn, báo dữ kiện; hiểu vai không cấp quyền tự thay đổi.')
unit('care-process',[22,23],49,'Dịch vụ và chu trình đánh giá lại',[
 'Dịch vụ tới nhà khác với dịch vụ ban ngày người dùng tới cơ sở, và khác với sống tại cơ sở. Thời điểm, nơi và mức hỗ trợ cần được xác nhận.',
 'Quy trình chăm sóc nối thu thập/phân tích thông tin, lập mục tiêu/kế hoạch, thực hiện rồi đánh giá kết quả.',
 'Đánh giá xét kế hoạch có phù hợp và mục tiêu có đạt không, rồi điều chỉnh khi cần. Kế hoạch đã viết không chứng minh đã thực hiện hoặc hiệu quả.'
 ],'Nhân viên ghi đạt mục tiêu chỉ vì đã lên lịch. Còn thiếu gì?',
 'Thiếu thực hiện, phản ứng/kết quả và đánh giá so mục tiêu; phân biệt lịch dự kiến với việc đã làm.')
unit('risk-observation',[24,25,26],21,'Nguy cơ và sự cố suýt xảy ra',[
 'Quan sát gồm lời/hành vi trong tương tác và các số thực đo. So với thường ngày giúp nhận thay đổi nhưng chưa xác định nguyên nhân.',
 'Giày dép tuột, quần quá dài, sàn ướt, dây vướng và dụng cụ hỏng là những điểm nguy cơ khác nhau; khả năng hôm nay có thể khác hôm trước.',
 'Sự cố suýt xảy ra cũng cần ghi, xem nguyên nhân đã biết/chưa biết và chia sẻ biện pháp phòng lặp. Không đợi có thương tích mới rút kinh nghiệm.'
 ],'Xe trượt nhưng bác chưa ngã có thể bỏ ghi không?',
 'Không. Ghi việc xe trượt và điều kiểm được, xem phanh/môi trường theo quy trình, chia sẻ cách phòng; không suy nguyên nhân chưa xác minh.')
unit('infection-chain',[27,28,29,30],6,'Chuỗi lây và lựa chọn bảo vệ',[
 'Vi khuẩn, virus, nấm và ký sinh trùng là các nhóm tác nhân. Sốt, nôn, tiêu chảy, đau bụng, phát ban hoặc sắc mặt đổi cần được báo khi phù hợp; không tự định tác nhân.',
 'Nguồn, đường truyền và người/cơ thể có thể bị nhiễm nối thành chuỗi. Giảm nguồn, chặn đường và hỗ trợ sức khỏe túc chủ có mục đích khác nhau.',
 'Tiếp xúc, giọt bắn và không khí là các đường học cơ bản; ví dụ nguồn xếp noro/O157 với tiếp xúc, cúm với giọt bắn, lao/sởi với không khí. Phương án thật cần xét tác nhân và hướng dẫn hiện hành, không một biện pháp cho tất cả.',
 'Máu, dịch, chất bài tiết và niêm mạc có thể mang nguy cơ dù chưa có chẩn đoán. PPE theo phơi nhiễm: găng, tạp dề, khẩu trang và kính có vai khác nhau; không bắt găng cho mọi việc không có chỉ định.',
 'Khẩu trang cần che mũi, miệng và cằm theo kiểu sản phẩm. Tháo găng giữ mặt bẩn vào trong, bỏ đúng nơi; găng không thay vệ sinh tay.'
 ],'Người chưa được chẩn đoán nhiễm nên có thể chạm chất nôn bằng tay trần không?',
 'Không. Phòng ngừa chuẩn theo nguy cơ tiếp xúc, không đợi tên bệnh; chọn PPE và vệ sinh tay/đồ dùng theo quy trình.')
unit('hand-coverage',[31,32,33],6,'Các vùng bàn tay thường bị bỏ sót',[
 'Lòng, mu, kẽ, đầu ngón/móng, gốc/ngón cái và cổ tay đều cần được tiếp cận; làm một mặt không chứng minh đủ hai tay.',
 'Với rửa xà phòng/nước: làm ướt, tạo bọt bao phủ các vùng, xả hết rồi làm khô. Trang sức/đồng hồ có thể giữ bẩn; xử lý theo chính sách cơ sở.',
 'Với dung dịch chà tay phù hợp: dùng đủ lượng bao phủ, chà các vùng tới khô theo nhãn. Bẩn thấy rõ cần rửa và một số tác nhân cần quy trình riêng.',
 'Tránh chạm lại bề mặt bẩn sau vệ sinh. Thứ tự vùng trong hình giúp kiểm bao phủ, không biến một chuỗi tay vào ảnh thành bằng chứng mọi vùng đã sạch.'
 ],'Hai lòng tay được chà kỹ nhưng ngón cái và móng chưa chạm. Có đủ bao phủ không?',
 'Chưa. Làm đủ các vùng cả hai tay theo phương pháp phù hợp, không coi bọt nhiều là chứng minh mọi vùng được xử lý.')
unit('body-mechanics',[34,35,36,37,38,39],7,'Giảm tải lưng và sức khỏe người hỗ trợ',[
 'Chân đế là vùng bao quanh các điểm tiếp xúc nâng đỡ. Chân đế rộng và trọng tâm thấp có thể tăng ổn định trong điều kiện phù hợp.',
 'Đưa công việc gần thân và dùng nhóm cơ lớn ở chân/hông giúp giảm tải lên lưng. Không cúi lưng dùng riêng cơ lưng để nâng người.',
 'Thu gọn thân, chuyển trọng tâm ngang, điểm tựa/đòn bẩy và hướng mũi chân theo chuyển động là các ý cơ học; tránh xoắn thân dưới tải.',
 'Mẫu kéo có thể giảm yêu cầu lực trong một phương án, nhưng không là phép kéo lê da hoặc tay yếu. Ma sát, thiết bị và khả năng người dùng quyết định cách thật.',
 'Máy nâng/tấm trượt và phối hợp người được huấn luyện có thể cần thiết. Ăn, ngủ, hoạt động vừa sức và trao đổi lo lắng với đồng nghiệp cũng thuộc bảo vệ sức khỏe nhân viên.'
 ],'Người hỗ trợ đã mở rộng chân nên có thể tự nâng mọi người không?',
 'Không. Cơ học giảm một phần tải, không thay dụng cụ, người hỗ trợ, đánh giá và huấn luyện. Không cố làm khi vượt khả năng.')
unit('disaster',[40],7,'Chuẩn bị trước khi có thảm họa',[
 'Động đất, bão và cháy có các nguy cơ khác nhau. Cần biết phương án cơ sở, đường thoát và hệ phối hợp với cộng đồng.',
 'Diễn tập và chuẩn bị vật dụng thiết yếu giúp phản ứng có tổ chức; người dùng có nhu cầu di chuyển/thiết bị cần phương án hỗ trợ riêng.',
 'Ghi địa điểm, người cần hỗ trợ và tình trạng đã kiểm; không coi đã chuẩn bị túi đồ là đã hoàn thành sơ tán.'
 ],'Danh sách có đủ đồ nhưng chưa rõ ai hỗ trợ người dùng oxy khi mất điện. Đã đủ chuẩn bị chưa?',
 'Chưa. Cần trách nhiệm, nguồn dự phòng và phương án di chuyển/liên lạc theo cơ sở, không chỉ danh mục vật dụng.')
unit('communication',[98,99,100,101,102,103],14,'Hai chiều và lựa chọn câu hỏi',[
 'Giao tiếp trao đổi ý nghĩa, tạo tin cậy và hiểu nhu cầu; nói hết lời mình không bảo đảm người kia đã hiểu.',
 'Lời nói, chữ và ngôn ngữ ký hiệu đều thuộc giao tiếp ngôn ngữ; cử chỉ, biểu cảm và tư thế là các tín hiệu phi ngôn ngữ. Ký hiệu không chỉ là động tác tay tùy ý.',
 'Lắng nghe, đồng cảm và tiếp nhận có mục đích khác nhau: hiểu chính xác, thử nhìn từ vị trí người kia và tôn trọng cảm xúc.',
 'Câu đóng giúp xác nhận/lựa chọn; câu mở cho người kia nói rộng. Chỉ dùng câu đóng dễ làm trao đổi một chiều, nhưng hỏi dồn “tại sao” cũng có thể gây cảm giác bị buộc tội.'
 ],'Nhân viên hỏi liên tục “tại sao bác không đi” để luyện câu mở. Cần đổi gì?',
 'Dừng hỏi dồn, tiếp nhận điều bác muốn nói, dùng câu ngắn/mở phù hợp và xác nhận lựa chọn; loại câu không tự bảo đảm cách giao tiếp tốt.')
unit('listening-consent',[104,105,106,107],2,'Lắng nghe và đồng ý sau giải thích',[
 'Nhắc lại ý giúp kiểm hiểu; giữ mốc thời gian, vùng đau và lời người nói thay vì biến thành kết luận của mình.',
 'Ngang tầm mắt, nhịp chậm có khoảng chờ và tư thế hướng tới người nói có thể giúp trao đổi. Khoanh tay/ngả xa có thể tạo cảm giác không lắng nghe; cần xét cá nhân/văn hóa.',
 'Khoảng cách và chạm cơ thể cần hỏi phù hợp người/tình huống; không xem nắm tay là thân thiện với mọi người.',
 'Đưa các lựa chọn, giải thích cả ích lợi và bất lợi bằng cách người dùng hiểu, rồi để họ quyết định. “Đã nói mục đích” không đồng nghĩa đã có đồng ý.'
 ],'Bác gật khi chưa nghe mặt bất lợi, nhân viên ghi đã đồng ý đầy đủ. Thiếu gì?',
 'Cần thông tin cân đối, kiểm hiểu và quyết định thực; không lấy gật đầu đơn độc làm bằng chứng đã hiểu mọi lựa chọn.')
unit('accessible-talk',[108,109,110,111,112,113],11,'Hỗ trợ giao tiếp theo phần khó',[
 'Khi người khó nhìn, gọi tên và giới thiệu mình trước tiếp xúc; mô tả hướng/khoảng cách từ mốc thống nhất. “Đây” hoặc “đằng kia” không đủ mốc.',
 'Vị trí đồng hồ, chữ nổi và đường lát xúc giác phục vụ các loại thông tin khác nhau. Dùng theo khả năng và sở thích, không mặc định ai cũng đọc chữ nổi.',
 'Khi khó nghe, ở phía trước/nơi yên, để nhìn mặt/miệng và nói rõ với âm lượng phù hợp. Nếu tai tốt hơn đã được xác nhận thì xét phía đó, không hét mặc định.',
 'Viết/thiết bị thông tin, ký hiệu, khẩu hình hoặc trợ thính là các lựa chọn. Thiết bị khuếch đại âm không bảo đảm hiểu lời.',
 'Mất ngôn ngữ có thể ảnh hưởng nghe-hiểu, nói, đọc hoặc viết không đồng đều. Câu ngắn, tranh/cử chỉ và câu đóng phù hợp có thể giúp; tránh bắt bẻ lỗi nói nhỏ.',
 'Khi sa sút trí tuệ, lời lặp hoặc khác thực tế cần được tiếp nhận về cảm xúc; dùng câu ngắn và xác nhận dữ kiện, không tranh cãi hay khẳng định điều chưa đúng là thật.'
 ],'Bác nói nhầm tên đồ nhưng đã chỉ đúng thứ muốn dùng. Có cần sửa mọi lỗi trước giúp không?',
 'Không bắt bẻ lỗi nhỏ. Xác nhận ý/nguyện vọng bằng cách phù hợp; nếu thông tin liên quan an toàn chưa rõ thì hỏi rõ, không suy mức hiểu từ phát âm.')
unit('record-handover',[114,115,116,117,118],48,'Ghi chép và người nhận cũng có trách nhiệm',[
 'Kế hoạch, hồ sơ, sổ bàn giao và họp nhóm là những cách chia sẻ khác nhau. Ghi tình trạng, hỗ trợ đã làm và phản ứng/kết quả thực giúp chăm sóc liên tục.',
 'Ghi kịp thời và đúng ngày giờ. Lời/cảm giác của bác là dữ kiện chủ quan; điều quan sát hoặc số đo là dữ kiện khách quan, không phủ nhận bên nào.',
 'Khi nào, ở đâu, ai, việc gì, cách nào và lý do đã biết giúp cấu trúc báo cáo. Nguyên nhân chưa biết phải để chưa biết, không bịa cho đủ 5W1H.',
 'Tên, địa chỉ, điện thoại và ảnh đều cần quản lý; chia sẻ đúng mục đích/người nhận/căn cứ. Không đưa chuyện người dùng lên mạng hoặc kể bên ngoài tùy tiện.',
 'Người gửi tách sự thật với suy đoán, ngắn và đúng mức khẩn. Người nhận ghi chú, nhắc lại và hỏi phần chưa rõ; việc đã liên lạc không chứng minh đã giải quyết.',
 'Thảo luận khi chưa rõ phạm vi hoặc phương án; tình huống khẩn gọi ngay theo quy trình, không đợi hoàn thành biểu mẫu.'
 ],'Người nhận im lặng sau một báo cáo nhiều mốc giờ. Làm thế nào để biết đã hiểu đúng?',
 'Nhắc lại nội dung/việc cần làm và xác nhận mốc, người, dữ kiện chưa kiểm; không coi không phản đối là đã hiểu.')


unit('continence-types',[157,158,159],30,'Chọn dụng cụ và phân biệt cơ chế són tiểu',[
 'Ghế bô có thể giúp người còn nhận biết nhu cầu nhưng khó đến nhà vệ sinh, kể cả ban đêm. Bô tại giường hỗ trợ khi chưa thể đến hoặc ngồi ở nhà vệ sinh; kiểu dụng cụ phải phù hợp cơ thể và khả năng sử dụng.',
 'Tã và miếng thấm giúp quản lý rò rỉ hoặc khó sử dụng nhà vệ sinh. Chúng không thay thế việc tìm nguyên nhân, giữ khả năng chủ động và đánh giá da.',
 'Rò khi ho hoặc hắt hơi gợi nhóm liên quan tăng áp lực bụng; cơn mót đột ngột khó trì hoãn thuộc nhóm tiểu gấp. Hai cơ chế này khác nhau, không gọi cả hai là căng thẳng tâm lý.',
 'Rò từng ít một có thể liên quan giữ nước tiểu và tràn; rò theo phản xạ có thể gặp khi đường thần kinh bị tổn thương. Nhận biết mô tả không đủ để tự chẩn đoán.',
 'Són do chức năng liên quan không hoàn thành việc đến, nhận ra hoặc dùng nhà vệ sinh kịp, ví dụ khó vận động hay định hướng. Hỗ trợ đường đi và thời điểm có thể cần thiết.',
 'Táo bón có thể liên quan chức năng hoặc tổn thương gây cản trở đường ruột. So với nhịp bình thường của từng người, ghi lượng, lần và biểu hiện; không chỉ đếm ngày.',
 'Phân lỏng có thể gây mất nước và kích ứng da. Báo bất thường, nhất là tiêu chảy mới xuất hiện; nước uống, chất xơ, vận động và chăm sóc da phải theo khả năng nuốt, bệnh nền và kế hoạch.'
 ],'Bác biết cần đi nhưng không tìm được nhà vệ sinh. Chỉ thay tã có giải quyết đủ không?',
 'Chưa đủ. Cần kiểm nguyên nhân, đường đi và hỗ trợ đúng thời điểm, giữ riêng tư, theo dõi da; không suy rằng mọi trường hợp rò đều cùng cơ chế.')
unit('toilet-environment',[160,161,162,163,164,165,166],31,'Môi trường và trình tự bài tiết',[
 'Chuỗi bài tiết gồm nhận biết nhu cầu, tới nơi, điều chỉnh quần áo và tư thế, bài tiết, làm sạch, mặc lại rồi rời nơi. Xác định chính bước cần hỗ trợ để giữ phần người dùng còn làm được.',
 'Cửa dễ vận hành, khoảng tiếp cận xe lăn, tay vịn phù hợp và nút gọi trong tầm với hỗ trợ sử dụng nhà vệ sinh. Kiểm mùi, thông thoáng và sự kín đáo cùng với an toàn.',
 'Trong ví dụ liệt nửa người, tay vịn phía có khả năng dùng và hỗ trợ phía yếu giúp chuyển tư thế. Tư thế chân, quần áo và điểm bám phải được kiểm riêng trước khi đứng; không kéo người bằng tay yếu.',
 'Với ghế bô, bố trí vị trí, mặt tựa và độ ổn định phù hợp, giữ vệ sinh và mùi. Việc xong cần hỗ trợ làm sạch, mặc lại, rửa tay và trở về nơi nghỉ an toàn.',
 'Bô tại giường cần đặt đúng vùng hứng, tránh ép da lâu và giữ tư thế được phép. Điều chỉnh giường chỉ khi phù hợp kế hoạch, rồi trả lại độ cao an toàn.',
 'Bình tiểu có kiểu khác nhau; hỗ trợ vị trí và lớp kê chống rò theo thiết bị, cơ thể và khả năng đổi tư thế. Không dùng mô tả giới tính để mặc định một dụng cụ luôn phù hợp.'
 ],'Nút gọi nằm sau lưng và người dùng không thể với tới khi đã ngồi. Thiết kế cần đổi gì?',
 'Đặt và thử nút gọi trong tầm thực tế ở tư thế sử dụng, kiểm tay vịn và đường tiếp cận, đồng thời giữ riêng tư và hỗ trợ theo từng bước.')
unit('clothing-seated',[172,173,174,175,176],34,'Thay áo và quần khi ngồi',[
 'Hỏi lựa chọn quần áo, giải thích và có đồng ý, kiểm sức khỏe, kín đáo và nhiệt độ. Với người khó nhìn, mô tả kiểu dáng và cho cảm nhận chất liệu nếu họ muốn.',
 'Trong ví dụ liệt nửa người, cởi phía khỏe trước và mặc phía yếu trước giúp giảm phạm vi phải vận động ở phía yếu. Người hỗ trợ kiểm ngồi vững và bảo vệ phía dễ mất thăng bằng.',
 'Chỉ hỗ trợ đoạn người dùng chưa làm được như với tay hoặc luồn tay áo, tránh kéo khớp và cánh tay yếu. Sau mặc kiểm nếp đồ lót, vị trí quần áo, đau và cảm giác của người dùng.',
 'Khi thay quần, không yêu cầu giơ chân hoặc đứng nếu làm mất thăng bằng. Nếu được đánh giá có thể đứng thì dùng điểm bám chắc; nếu chưa thể, thực hiện phần thích hợp trong tư thế ngồi theo kế hoạch.',
 'Khi mặc quần, luồn phía yếu trước, phía khỏe sau; kéo tới mức phù hợp trong tư thế ngồi trước khi chuyển đứng nếu được phép. Kiểm cảm giác, da và sức khỏe sau thay.'
 ],'Nhân viên yêu cầu bác nhấc chân để thay quần dù bác ngồi đã nghiêng. Cần điều chỉnh gì?',
 'Dừng cách làm gây mất thăng bằng, kiểm khả năng và tư thế hỗ trợ; giữ lựa chọn và riêng tư, không biến thứ tự cởi/mặc thành yêu cầu phải đứng.')
unit('clothing-bed',[176,177,178,179],35,'Thay quần áo tại giường',[
 'Khi cởi áo trong ví dụ nằm và liệt nửa người, bắt đầu phía khỏe; cuộn phần áo đã tháo vào trong để chuyển qua bên dưới người bằng cách đổi tư thế được đánh giá an toàn.',
 'Ví dụ minh họa xoay nghiêng có phía khỏe ở dưới để lấy áo, rồi tháo phía yếu. Không mặc định quy tắc đó cho mọi bệnh lý, chấn thương hoặc chỉ định tư thế.',
 'Mặc áo bắt đầu phía yếu, sắp phần thân áo dưới người rồi dùng chuyển tư thế phù hợp để trải thẳng. Kiểm đường may ở lưng và hai bên, sau đó hoàn tất phía khỏe.',
 'Quần vẫn theo nguyên tắc cởi khỏe trước, mặc yếu trước trong ví dụ. Chỉ nhờ người dùng nâng hông nếu có khả năng và được phép; không ép làm động tác chưa an toàn.',
 'Kết thúc cần hỏi thoải mái, kiểm đau, da, nếp vải và dấu hiệu sức khỏe. Hoàn tất thao tác chưa có nghĩa trang phục đã phù hợp.'
 ],'Áo đã mặc xong nhưng đường may xoắn ở lưng. Có thể coi buổi chăm sóc đã xong không?',
 'Cần kiểm và sửa nếp/vị trí theo tư thế an toàn, hỏi cảm giác và kiểm da, đau; thao tác xong không chứng minh thoải mái.')
unit('face-hair-makeup',[180,182],34,'Diện mạo theo lựa chọn cá nhân',[
 'Làm sạch mặt có thể giúp dễ chịu; nếu chưa tự rửa được thì hỗ trợ bằng khăn phù hợp và giữ ẩm theo tình trạng da, không mặc định cùng một sản phẩm cho mọi người.',
 'Hỏi kiểu tóc mong muốn, quan sát tóc và da đầu. Lược có tay cầm phù hợp giúp người khó nâng tay giữ phần tự làm; không chà mạnh da đầu để mong tăng tuần hoàn.',
 'Trang điểm là lựa chọn biểu đạt cá nhân. Hỗ trợ theo nguyện vọng và làm sạch mỹ phẩm trước ngủ với cách phù hợp da; không ép người không muốn trang điểm.'
 ],'Bác muốn tự chải tóc nhưng không nâng cánh tay cao được. Có lựa chọn nào ngoài làm hộ hoàn toàn?',
 'Thử dụng cụ và tư thế phù hợp khả năng, kiểm da đầu và hỏi kiểu tóc; để bác tự làm phần có thể, hỗ trợ phần còn lại.')
unit('oral-details',[182,183,184],33,'Chăm sóc miệng và răng giả',[
 'Vệ sinh miệng giúp giảm mảng bám, vấn đề nướu, mùi và gánh vi khuẩn; có thể hỗ trợ vị giác, nước bọt và ăn uống. Không cam kết ngăn hoàn toàn viêm phổi hoặc thay đánh giá nuốt.',
 'Quan sát miệng, làm sạch nhẹ từng vùng để tránh bỏ sót; trong ví dụ liệt nửa người cần kiểm thức ăn còn ở phía yếu. Súc miệng chỉ khi có khả năng an toàn.',
 'Giữ tư thế và đầu ổn định theo kế hoạch, tránh nâng cằm làm tăng nguy cơ khi nuốt. Vị trí phía trước hoặc sau là ví dụ hỗ trợ, không phải lựa chọn áp dụng cho tất cả.',
 'Cầm bàn chải kiểu cầm bút có thể giúp kiểm lực. Dụng cụ mút là lựa chọn cho một số tình huống theo hướng dẫn, không mặc định tương đương làm sạch bằng bàn chải.',
 'Răng giả có loại toàn phần và một phần, hàm trên và hàm dưới. Khi tháo cần làm sạch răng còn lại và miệng; vệ sinh và bảo quản răng giả theo vật liệu và hướng dẫn chuyên môn.',
 'Điều kiện bảo quản răng giả phụ thuộc vật liệu và hướng dẫn nha khoa; không tự chọn để khô, ngâm dung dịch hoặc dùng nhiệt. Dụng cụ chứa và chất làm sạch phải phù hợp sản phẩm. Chảy máu, sưng hay đau cần báo người có chuyên môn.'
 ],'Chỉ rửa răng giả mà bỏ qua răng còn lại đã đủ chưa?',
 'Chưa. Cần chăm sóc cả miệng và răng còn lại theo khả năng; kiểm tổn thương và bảo quản đúng loại, không dùng một công thức chung cho mọi răng giả.')
unit('bath-sequence',[188,191,192,193],37,'Các mốc kiểm trong và sau tắm',[
 'Các vùng như cổ, nách, bẹn và bàn chân cần được chú ý khi làm sạch; kiểm cả nếp da theo cơ thể thực tế, không dùng hình ví dụ làm danh sách đóng.',
 'Hỗ trợ đi lại và che vùng riêng tư. Trong ví dụ liệt nửa người, bảo vệ phía yếu; kiểm nước bằng phương tiện phù hợp và hỏi người dùng trước khi xịt, không chỉ dựa vào tay của nhân viên.',
 'Ví dụ xịt bắt đầu ở phần xa rồi tới thân, phía khỏe trước; tạo bọt và làm sạch nhẹ, kiểm vùng dễ bẩn. Trình tự phải theo dung nạp, thiết bị và kế hoạch, không áp dụng máy móc.',
 'Khi vào bồn, ví dụ bước phía khỏe trước; kiểm tư thế vững và hỗ trợ phần yếu dễ nổi. Theo dõi biểu hiện sức khỏe và không để người cần hỗ trợ ở một mình.',
 'Ra bồn từ từ với hỗ trợ phù hợp vì đổi tư thế có thể gây choáng. Xả sạch và lau thấm nhẹ, làm khô nếp da, giữ ấm, mặc đồ và kiểm tình trạng sau tắm.',
 'Gội bằng phần mềm đầu ngón tay, không cào móng. Máy sấy cần kiểm nhiệt, khoảng cách và luồng khí; dùng tay nhân viên làm mốc không bảo đảm tránh bỏng. Nghỉ và uống theo kế hoạch sau tắm.'
 ],'Nhân viên đã thử nước bằng tay rồi bỏ qua lời bác nói thấy quá nóng. Điều gì còn thiếu?',
 'Phải dừng và kiểm lại theo cảm nhận, nguy cơ và phương tiện phù hợp của người dùng; thử nước một lần không bảo đảm an toàn suốt buổi.')
unit('partial-perineal-wash',[194,195],38,'Vệ sinh một phần và vùng kín',[
 'Ngâm/rửa tay và chân là hình thức vệ sinh một phần, cần nước và dụng cụ phù hợp rồi xả, lau khô. Móng mềm sau ngâm không tự cho phép cắt khi có bệnh nền hoặc bất thường.',
 'Vùng kín dễ bẩn do bài tiết và mồ hôi, cần đồng ý, riêng tư và phòng nhiễm theo quy trình. Nước phải phù hợp vùng da nhạy cảm, không coi nhiệt độ phòng hoặc cảm giác nhân viên là đủ.',
 'Trong ví dụ cơ thể nữ, làm sạch theo hướng từ vùng niệu đạo ra sau, không mang chất bẩn từ hậu môn trở lại bằng cùng mặt khăn. Tổ chức dụng cụ và mặt lau để giữ hướng sạch.',
 'Trong ví dụ cơ thể nam, chú ý da và vùng quanh/phía dưới bìu theo tình trạng thực tế; nâng đỡ nhẹ nếu cần, không kéo mô hoặc thực hiện thao tác xâm lấn ngoài phạm vi.',
 'Lau thấm nhẹ và quan sát đỏ, đau hoặc tổn thương để báo. Găng dùng một lần không thay vệ sinh tay hoặc việc thay găng khi chuyển từ vùng bẩn sang sạch.'
 ],'Nhân viên đeo găng nhưng dùng cùng mặt khăn lau từ sau ra trước. Găng đã xử lý được nguy cơ này chưa?',
 'Chưa. Cần giữ hướng và mặt lau sạch, thay theo quy trình, vệ sinh tay và quan sát da; găng không thay kiểm soát lây nhiễm giữa các vùng.')


# Foundation detail follow-up: append stable point IDs; preserve existing cases and sessions.
def deepen(key, facts):
    u=next(u for u in units if u['id']=='kaigo-atomic-'+key)
    for fact in facts:
        u['points'].append(dict(id=u['id']+'-'+str(len(u['points'])+1),explanationVi=fact))
deepen('dignity',[
 'Quốc gia, văn hóa, phong tục, kinh nghiệm và khả năng làm việc nhà có thể ảnh hưởng cách sống. Hỏi từng người thay vì lấy thói quen của nhân viên làm chuẩn.',
 'Một ngày có thể gồm thay đồ, rửa mặt, bài tiết, đi dạo và giờ uống trà bên cạnh ăn, ngủ, tắm. Mốc sáng/tối trong sơ đồ chỉ minh họa nhịp sống; hỗ trợ phải theo lịch và lựa chọn cá nhân.',
 'Khi cần giúp đỡ, người dùng có thể giảm chủ động. Tìm việc có ý nghĩa và phần họ muốn tự làm để nâng động lực, đồng thời kiểm an toàn; không mặc định mọi người cần chăm sóc đều bi quan.'
])
deepen('privacy-abuse',[
 'Hạn chế vận động có thể làm suy giảm chức năng cơ thể. Ở người sa sút trí tuệ, ép buộc còn có thể tăng bất an, lú lẫn hoặc biểu hiện hành vi khó chịu; không coi ngăn cử động là bảo đảm tình trạng tốt hơn.',
 'Thông tin cá nhân không được đưa lên mạng hoặc chia sẻ tùy tiện. Phải xác nhận căn cứ, phạm vi và người nhận phù hợp; sự đồng ý cho một việc không là đồng ý cho mọi ảnh hoặc mọi kênh.',
 'Gây đau bằng bạo lực thuộc nguy cơ lạm dụng thân thể; lời đe dọa hoặc sỉ nhục gây tổn thương tâm lý. Bỏ bữa ăn hay bỏ hỗ trợ cần thiết là bỏ chăm sóc; chiếm tài sản và hành vi tình dục không được chấp nhận là hai nhóm khác.'
])
deepen('team-roles',[
 'Nha sĩ là vai y tế trong nhóm, liên quan đánh giá và điều trị răng miệng. Khi răng giả gây đau hoặc có tổn thương miệng, người chăm sóc báo dữ kiện và phối hợp khám; không tự mài hay sửa răng giả.',
 'Điều phối dịch vụ có cả trao đổi với người dùng và liên hệ gia đình theo phạm vi phù hợp. Ý kiến gia đình là thông tin hỗ trợ, không tự thay mong muốn của người dùng.',
 'Chuyên gia dinh dưỡng cân nhắc cân bằng dưỡng chất, năng lượng và dạng bữa theo nhu cầu. Người chăm sóc chuyển thông tin ăn uống thực tế, không tự đổi mức năng lượng hoặc kết cấu đã được chỉ định.'
])
deepen('care-process',[
 'Các ví dụ tên dịch vụ cần nối với nơi chăm sóc: trợ giúp tại nhà thuộc nhóm thăm nhà; chăm sóc trong ngày thuộc nhóm đến cơ sở ban ngày; nhà dưỡng lão đặc biệt là ví dụ cơ sở cư trú. Tên nhóm không tự xác định một người đủ điều kiện dùng dịch vụ.',
 'Mục tiêu và việc hỗ trợ cụ thể cần được ghi cho từng người. Đánh giá có thể quay lại thu thập thông tin và sửa kế hoạch; bốn khâu là vòng phản hồi hướng tới cuộc sống người dùng mong muốn.'
])
deepen('risk-observation',[
 'Quan sát cần ghi lại và chuyển dữ kiện cho nhóm chăm sóc để điều chỉnh hỗ trợ. Cảm giác nóng khi chạm không thay số nhiệt độ; không ghi đã đo khi chỉ mới dự định đo.',
 'Trong một ca xe lăn suýt trượt, nếu thực sự xác minh phanh chưa được cài thì ghi điều đó và tổ chức kiểm phanh trước chuyển. Khi chưa xác minh, giữ nguyên phần nguyên nhân chưa rõ; biện pháp cần được chia sẻ để phòng lặp.'
])
deepen('infection-chain',[
 'Kiểm soát lây nhiễm phải xét cả hướng vào cơ sở, hướng ra ngoài và lan giữa người hoặc khu vực bên trong. Vệ sinh tay, xử lý đồ và phối hợp theo quy trình nhằm tránh mang tác nhân vào, đem tác nhân ra hoặc phát tán tại nơi chăm sóc.',
 'Nguồn có thể là vi sinh vật hoặc vật liệu mang tác nhân; tay, đồ vật và thức ăn có thể tham gia đường truyền. Túc chủ có thể là người hoặc động vật. Cắt một mắt xích là mục tiêu của biện pháp, không phải đợi xử lý đủ ba mới làm.',
 'Máu, nước bọt, dịch mũi, chất nôn, nước tiểu và phân là các ví dụ cần xét nguy cơ phơi nhiễm. Chú ý cả da tổn thương và niêm mạc; người chưa có triệu chứng vẫn cần phòng ngừa chuẩn theo công việc.',
 'Kính bảo hộ giúp bảo vệ mắt khi có nguy cơ bắn; tạp dề bảo vệ trang phục theo nguy cơ. Mũ là vật dụng có thể gặp trong bộ bảo hộ, không mặc định phải đeo ở mọi ca; chọn từng món theo công việc và quy trình.',
 'Găng dùng một lần phải thay theo lần chăm sóc, người dùng và lúc chuyển công việc bẩn sang sạch theo quy trình; không mang một đôi đi qua nhiều người. Sau tháo găng vẫn vệ sinh tay.',
 'Sinh hoạt tập thể tạo nhiều cơ hội tiếp xúc nên cần tổ chức kiểm soát lây. Sức đề kháng yếu làm tăng nguy cơ, nhưng khỏe mạnh không có nghĩa miễn nhiễm hoặc được bỏ biện pháp phòng ngừa.'
])
deepen('hand-coverage',[
 'Để kiểm vùng rộng: hai lòng tay tiếp xúc nhau; dùng lòng tay này chà mu tay kia và đổi bên. Bọt hay dung dịch chỉ nằm ở lòng tay chưa chứng minh mu tay đã được xử lý.',
 'Kẽ ngón được tiếp cận bằng đan các ngón và chà; mặt sau ngón cũng cần tiếp xúc. Kiểm cả hai tay, tránh chỉ làm tay thuận.',
 'Ngón cái cần được bàn tay đối diện bao quanh và chà xoay; đầu ngón cùng vùng móng được chà vào lòng tay đối diện. Đổi bên để xử lý đủ hai bộ ngón.',
 'Cổ tay cần được chà riêng theo quy trình đang dùng. Với xà phòng, kết thúc bằng xả kỹ rồi dùng khăn giấy phù hợp để làm khô; với dung dịch chà tay, không xả nước mà tiếp tục chà tới khô theo hướng dẫn sản phẩm.',
 'Khum tay giúp giữ lượng dung dịch được lấy; phải đủ để phủ các vùng theo nhãn. Nhẫn và đồng hồ có thể che bề mặt cần xử lý, nên chuẩn bị theo chính sách cơ sở trước vệ sinh tay; không coi rửa quanh trang sức là luôn đủ.'
])
deepen('body-mechanics',[
 'Một điểm gậy tiếp xúc sàn có thể mở rộng vùng nâng đỡ khi dụng cụ và cách dùng phù hợp. Đây là quan hệ giữa điểm tiếp xúc và chân đế, không là bảo đảm người dùng sẽ không ngã.',
 'Thu gọn tay/chân theo khả năng có thể giúp cơ thể được hỗ trợ gọn hơn; không buộc hoặc ép khớp để tạo tư thế. Dịch chuyển ngang và dùng toàn thân là ý giảm tải, không bỏ qua đánh giá da, đau và khả năng chịu lực.',
 'Điểm tựa giúp tạo mô-men theo nguyên lý đòn bẩy; khoảng cách từ lực tới điểm tựa ảnh hưởng tác dụng. Biết nguyên lý chưa đủ để tự chọn điểm tì trên cơ thể hoặc thực hiện chuyển người.',
 'Bảo vệ lưng cần đồng thời dùng khả năng còn lại của người dùng, dụng cụ phù hợp và cách phối hợp đã huấn luyện. Tư thế tốt không thay nghỉ ngơi, ăn uống, vận động vừa sức hoặc việc báo khi bản thân không đủ khỏe.',
 'Giải tỏa căng thẳng nên theo cách phù hợp bản thân, giữ nhịp ăn/ngủ và trao đổi với đồng nghiệp hoặc người có kinh nghiệm. Không giữ mọi lo lắng một mình hoặc cố làm việc vượt sức.'
])
deepen('disaster',[
 'Nhóm đồ chuẩn bị có thể gồm nước và thực phẩm, thuốc hoặc vật tư theo nhu cầu, bộ sơ cứu, đèn chiếu sáng, radio và pin, đồ giữ ấm, quần áo, vật dụng vệ sinh và bảo vệ đầu. Danh sách phải theo kế hoạch, hạn dùng và nhu cầu thật; không coi hình minh họa là danh sách đủ cho mọi người.',
 'Diễn tập cần kiểm ai hỗ trợ, cách liên lạc và cách di chuyển người cần giúp khi đường thường dùng không khả dụng. Chuẩn bị lúc bình thường giúp giảm lúng túng; không đợi có cháy hoặc động đất mới phân công.'
])
deepen('dignity',[
 'Người chăm sóc có chuyên môn hỗ trợ sinh hoạt cho người gặp khó khăn do tuổi cao hoặc khuyết tật; hỗ trợ nhằm duy trì khả năng và cuộc sống riêng của họ.',
 'Người có và không có khuyết tật cần cơ hội hỗ trợ lẫn nhau, cùng sống trong cộng đồng mà giữ cách sống riêng. Bình thường hóa chống định kiến, không xóa khác biệt cá nhân.'
])
deepen('privacy-abuse',[
 'Lạm dụng xâm hại nhân quyền. Nhận diện nhóm hành vi để bảo vệ người dùng và báo đúng đường, không dùng tên nhóm để tự thay kết luận pháp lý.'
])
deepen('team-roles',[
 'Care manager và công tác xã hội phối hợp kế hoạch hỗ trợ khi dùng dịch vụ, dựa trên trao đổi với người dùng và các bên phù hợp. Kế hoạch điều phối không tự chứng minh dịch vụ đã được cung cấp.'
])
deepen('risk-observation',[
 'Tuổi cao hoặc khuyết tật có thể đi cùng nguy cơ tai nạn khác nhau cần đánh giá cá nhân. Đi lại, di chuyển trong tư thế ngồi hoặc nằm và chuyển giữa giường với phương tiện hỗ trợ đều cần xét nguy cơ; không mặc định người ngồi hoặc nằm thì không thể té.'
])
deepen('body-mechanics',[
 'Cơ học cơ thể xét cách xương, khớp và cơ phối hợp tạo vận động. Mục tiêu hỗ trợ là bảo vệ người dùng và giảm lực, tải lên nhân viên; không dùng một hình tư thế làm bảo đảm an toàn cho mọi ca.'
])


# Body figure gaps: independently explained labels and relationships, 2026-10-09.
deepen('circulation',[
 'Tim có bốn buồng: tâm nhĩ phải, tâm thất phải, tâm nhĩ trái và tâm thất trái. Nhĩ nhận máu về; thất đẩy máu đi. Hai phía phối hợp trong cùng vòng tuần hoàn, không phải hai tim độc lập.',
 'Theo đường máu trở về từ cơ thể: tĩnh mạch chủ trên nhận máu từ vùng trên và tĩnh mạch chủ dưới nhận máu từ vùng dưới; máu vào tâm nhĩ phải, sang tâm thất phải rồi đi qua động mạch phổi tới phổi.',
 'Sau trao đổi khí ở phổi, máu theo tĩnh mạch phổi về tâm nhĩ trái, sang tâm thất trái rồi được đẩy vào động mạch chủ để phân phối tới cơ thể. Hãy tự kể đường đi từ nơi nhận tới nơi đẩy, thay vì chỉ nhớ màu sơ đồ.',
 'Động mạch được gọi theo chiều đi ra khỏi tim, tĩnh mạch theo chiều về tim. Vì thế động mạch phổi mang máu ít oxy và tĩnh mạch phổi mang máu giàu oxy; không dùng một quy tắc màu để gọi tên mọi mạch.'
])
deepen('urination-volume',[
 'Bể thận là vùng thu nhận nước tiểu trong thận trước khi nước tiểu đi xuống niệu quản. Niệu quản dẫn tới bàng quang; niệu đạo dẫn từ bàng quang ra ngoài. Hai tên gần giống chỉ hai đoạn có nhiệm vụ khác nhau.',
 'Thận tạo nước tiểu để thải nước và chất cần loại bỏ; bàng quang chứa tạm nước tiểu trước khi đi tiểu. Đừng gán chức năng tạo nước tiểu cho bàng quang chỉ vì thấy cơ quan này đầy lên.'
])
deepen('stress',[
 'Trải nghiệm sống và giáo dục có thể ảnh hưởng tính cách, suy nghĩ và cách biểu lộ cảm xúc. Tuổi cũng có thể đi cùng thay đổi, nhưng không đủ để đoán một người nghĩ gì; hỏi chính người đó và đối chiếu thói quen riêng.',
 'Vui, giận, buồn và cảm giác thích thú là các ví dụ biểu lộ cảm xúc. Căng thẳng có thể là phản ứng của cả cơ thể và tâm lý trước tác động; ngay sự phấn khích cũng có thể làm cơ thể căng lên, không chỉ trải nghiệm khó chịu.'
])
deepen('needs',[
 'Nhu cầu là điều người ta mong muốn hoặc thấy cần cho đời sống. Trong cách nhóm đang học, sinh lý và an toàn là hai nhóm cơ bản; gắn bó, được công nhận và tự thực hiện là ba nhóm liên quan đời sống xã hội. Cách phân nhóm giúp hỏi đủ nhu cầu, không xếp giá trị con người.'
])
deepen('temperature',[
 'Bốn dấu hiệu sinh tồn đang học gồm nhiệt độ, nhịp thở, mạch và huyết áp. Chúng cung cấp thông tin về trạng thái cơ thể; cần xem cùng triệu chứng và mức thường ngày, không chọn một chỉ số để thay mọi đánh giá.'
])
deepen('breathing',[
 'Khi trao đổi khí, oxy từ không khí đi vào máu còn carbon dioxide từ máu được đưa ra ngoài qua hô hấp. Nhịp thở thường được điều hòa tự động; quan sát thay đổi và khó thở vẫn cần thiết dù người dùng không phải nghĩ về từng lần thở.'
])
deepen('nerves',[
 'Não tiếp nhận và xử lý thông tin, tham gia nhận định rồi phát tín hiệu điều khiển đáp ứng. Có đường thông tin đi vào và đường lệnh đi ra; không đọc mũi tên thần kinh như chỉ truyền một chiều từ não xuống.'
])


deepen('temperature',[
 'Nhiệt độ thường thấp hơn trong giai đoạn ngủ ban đêm và cao hơn vào ban ngày; nhịp cụ thể có thể khác theo giờ ngủ, hoạt động và người. So sánh nên dùng mức thường ngày và điều kiện đo tương ứng.'
])
deepen('pulse',[
 'Nhánh động mạch ở bên đầu trong hình là động mạch thái dương nông. Điểm ở cổ tay được mô tả phía mặt trong, tại động mạch quay; chỉ nhận diện vị trí không thay huấn luyện kỹ thuật đo.',
 'Trẻ nhỏ thường có mạch nhanh hơn người trưởng thành. Ở người cao tuổi, nhịp còn phụ thuộc sức khỏe, thuốc và vận động; không kết luận tuổi càng cao thì mạch luôn càng chậm.'
])
deepen('pressure-context',[
 'Trong một chu kỳ tim, áp lực động mạch đạt mức tâm thu khi tim đẩy máu và mức tâm trương khi tim giãn giữa các lần đập. Nhãn tối đa/tối thiểu nói về hai mức trong chu kỳ, không tự có nghĩa mắc bệnh huyết áp cao/thấp.',
 'Huyết áp biến đổi trong ngày. Muốn hiểu thay đổi cần ghi giờ, tư thế, hoạt động và trạng thái lúc đo; không xem một số đo là mức cố định suốt ngày.'
])
deepen('nerves',[
 'Khi đọc sơ đồ dọc cơ thể, phân biệt vùng đầu, vùng ngực và vùng eo với tên các cơ quan thần kinh. Nhãn vùng chỉ vị trí trên hình; không dùng nó như tên một đôi dây thần kinh.'
])
deepen('autonomic-heart',[
 'Hoạt động, lo lắng, tức giận hoặc căng thẳng có thể đi cùng đáp ứng giao cảm; nghỉ và ngủ thường có vai trò đối giao cảm nổi bật. Điều hòa tự chủ bị rối loạn có thể ảnh hưởng cả thể chất và tâm trạng, nhưng các biểu hiện riêng lẻ không đủ để tự chẩn đoán.'
])
deepen('skeleton-functions',[
 'Bộ xương gồm nhiều xương lớn và nhỏ liên kết thành khung nâng đỡ toàn thân. Cơ, khớp và xương phối hợp khi vận động; không chỉ xương dài ở tay chân mới có nhiệm vụ.'
])
deepen('senses',[
 'Thủy tinh thể là cấu trúc trong suốt có hai mặt cong, giúp điều chỉnh hội tụ. Võng mạc là lớp mô nhạy sáng ở phía sau mắt; tín hiệu từ đây theo thần kinh thị giác tới não. Hình cắt hai chiều biểu diễn dạng cong, không phải quả bóng nằm trong mắt.',
 'Đích xử lý âm thanh có vỏ não thính giác trong đại não. Cần phân biệt bước truyền rung ở màng nhĩ/xương con với bước chuyển thành tín hiệu ở ốc tai và đường thần kinh đưa tín hiệu tới não.'
])
deepen('digestive',[
 'Hệ tiêu hóa gồm ống liên tục từ miệng tới hậu môn cùng các cơ quan tiết dịch và enzyme hỗ trợ phân giải thức ăn. Hấp thu và thải phần còn lại là hai nhiệm vụ khác nhau; đại tràng chủ yếu thu hồi thêm nước, không thay ruột non hấp thu phần lớn dinh dưỡng.'
])
deepen('sleep',[
 'Nghỉ ngơi là giảm hoặc dừng hoạt động để cơ thể và tinh thần thư giãn; ngủ là trạng thái sinh học khác, trong đó não vẫn hoạt động theo các giai đoạn. Nghỉ phù hợp và ngủ có chất lượng giúp phục hồi mệt mỏi, hỗ trợ trí nhớ, cảm xúc và chức năng miễn dịch.',
 'Trong REM, hoạt động não có nét giống lúc thức nhưng người vẫn đang ngủ. Giấc mơ thường gặp ở REM, cũng có thể xảy ra ngoài REM; không dùng cách nói “não không ngủ” để hiểu rằng REM là tỉnh táo.',
 'Thức dậy do nhu cầu đi tiểu hoặc tiếng động là các tình huống cần tìm hiểu khi giấc ngủ bị gián đoạn. Ghi nguyên nhân người dùng kể, môi trường và thay đổi so với thường ngày; không mặc định mọi thức giấc ở tuổi cao đều vô hại.'
])

unit('icf',[80,81],13,'ICF: khả năng sống trong bối cảnh thực tế',[
 'ICF là cách mô tả chức năng, khuyết tật và sức khỏe. Tình trạng sức khỏe được xét cùng chức năng và cấu trúc cơ thể, hoạt động và tham gia; không chỉ ghi tên bệnh rồi suy mọi khả năng.',
 'Chức năng cơ thể là hoạt động sinh lý, còn cấu trúc là các bộ phận giải phẫu. Hoạt động là thực hiện việc cụ thể như mặc áo hoặc quản lý việc nhà; tham gia là góp mặt trong tình huống sống như sinh hoạt cộng đồng hoặc làm việc.',
 'Yếu tố môi trường gồm nơi ở, người hỗ trợ, cộng đồng, dịch vụ và thái độ. Một đặc điểm môi trường có thể giúp hoặc cản hoạt động; yếu tố cá nhân gồm tuổi, trải nghiệm, tính cách và giá trị riêng.',
 'Các mũi tên hai chiều trong mô hình diễn tả tương tác. Khả năng cơ thể ảnh hưởng hoạt động nhưng môi trường và cơ hội tham gia cũng tác động tới cách một người thực hiện việc; mô hình không là chuỗi nguyên nhân chỉ đi một chiều.',
 'Lối tiếp cận có độ dốc phù hợp và đường đi thông thoáng có thể giúp người dùng phương tiện hỗ trợ tiếp cận giao thông. Rào cản không chỉ nằm ở cơ thể; cần hỏi mục tiêu và khả năng hiện có để chọn cách hỗ trợ.'
 ],'Một người muốn tham gia nhóm đọc sách nhưng cửa phòng khó mở khi dùng xe lăn. Chỉ ghi “không tự đi được” đã đủ chưa?',
 'Chưa. Phân biệt chức năng cơ thể, việc di chuyển và mục tiêu tham gia; ghi cửa là rào cản môi trường, hỏi cách hỗ trợ và lối tiếp cận phù hợp thay vì bỏ mục tiêu của người đó.')
unit('motor-disability',[81],13,'Khó vận động: bộ phận, nguyên nhân và khả năng còn lại',[
 'Khó vận động có thể ở tay chân hoặc thân mình, liên quan bệnh hay tai nạn. Tổn thương não hoặc tủy sống, biến dạng xương khớp và co rút khớp là những nhóm cần phân biệt; không dùng một tên chung để đoán cách chuyển người.',
 'Mức ảnh hưởng và vùng ảnh hưởng khác nhau giữa các cá nhân. Một người có thể đồng thời có khó khăn nhận thức, nhưng khó vận động tự nó không chứng minh khả năng hiểu bị giảm.',
 'Gậy, xe lăn và bộ phận giả là các dạng hỗ trợ khác nhau. Lựa chọn, điều chỉnh và huấn luyện sử dụng phải phù hợp mục tiêu, sức khỏe, khả năng và môi trường; có dụng cụ không tự chứng minh dùng an toàn.'
 ],'Người có khó vận động bàn tay trả lời rõ nhưng nhân viên chỉ hỏi người nhà. Cần sửa điều gì?',
 'Trao đổi trực tiếp với người dùng, tạo cách trả lời phù hợp. Khó vận động bàn tay không phải bằng chứng không hiểu; đánh giá riêng từng khả năng và hỏi khi họ muốn người nhà hỗ trợ.')
unit('hearing-disability',[83],11,'Thính giác và lựa chọn đường giao tiếp',[
 'Khó nghe có thể liên quan phần tiếp nhận âm thanh, đường truyền hoặc xử lý tín hiệu. Vị trí ảnh hưởng, mức độ và thời điểm xuất hiện khác nhau; chỉ biết tuổi hoặc thấy đeo máy không đủ để biết người đó nghe gì.',
 'Máy trợ thính hỗ trợ nghe trong điều kiện phù hợp, không khôi phục hoàn toàn mọi âm thanh hay tự bảo đảm hiểu lời nói. Cần kiểm môi trường và hỏi người dùng cách giao tiếp hữu ích.',
 'Viết, ngôn ngữ ký hiệu và quan sát khẩu hình là những lựa chọn có thể phối hợp. Chọn theo kỹ năng, thị giác, ngôn ngữ và mong muốn người dùng; không mặc định ai khó nghe cũng đọc được khẩu hình hoặc biết ký hiệu.'
 ],'Bác đeo máy trợ thính nhưng chưa hiểu thông báo trong phòng ồn. Nhân viên định chỉ tăng giọng. Nên điều chỉnh thế nào?',
 'Hỏi cách bác muốn tiếp nhận, giảm tiếng ồn và dùng lời rõ với hỗ trợ phù hợp như văn bản nếu bác đọc được. Máy trợ thính không là bằng chứng thông báo đã được hiểu.')
unit('aphasia',[84],11,'Mất ngôn ngữ: đánh giá từng khả năng giao tiếp',[
 'Mất ngôn ngữ liên quan tổn thương hệ thống ngôn ngữ đã phát triển, thường sau tổn thương não như đột quỵ. Khó khăn có thể ảnh hưởng hiểu lời, nói, đọc và viết với mức khác nhau.',
 'Khó tạo lời không đồng nghĩa không hiểu, không muốn nói hay mất mọi khả năng nhận thức. Cũng không xem đây chỉ là yếu cơ phát âm; cần phân biệt các khó khăn giao tiếp qua đánh giá phù hợp.',
 'Hình, cử chỉ, bảng lựa chọn, viết hoặc thiết bị hỗ trợ có thể tạo đường trao đổi. Viết không luôn phù hợp vì chính đọc hoặc viết cũng có thể bị ảnh hưởng; thử cách theo khả năng còn lại và kế hoạch chuyên môn.',
 'Dành thời gian trả lời, hỏi từng ý và xác nhận điều người đó muốn truyền đạt. Không tự điền mong muốn chỉ vì họ nói chậm; hỗ trợ nhằm giữ sự tham gia của chính người dùng.'
 ],'Người dùng nói ít sau đột quỵ; khi thử hai hình hoạt động, họ chọn nhất quán một hình. Có thể kết luận không hiểu vì nói ít không?',
 'Không. Ghi riêng đáp ứng với lời và hình, xác nhận lựa chọn bằng cách phù hợp và phối hợp đánh giá chuyên môn. Dùng khả năng còn lại để họ tham gia; không coi một lần chọn hình là đánh giá toàn bộ ngôn ngữ.')
deepen('aging',[
 'Lão hóa diễn ra ở mọi người nhưng mức độ khác nhau, chịu ảnh hưởng sức khỏe và lối sống. Các nhóm giai đoạn đời gồm trẻ nhỏ, tuổi học đường, trưởng thành, trung niên và tuổi cao; tên giai đoạn không quyết định khả năng của từng người.',
 'Thời đại và môi trường sống góp phần tạo lịch sử riêng. Mất bạn đời hoặc bạn bè, thay đổi vai trò và làm việc từng quen trở nên khó có thể gây buồn, sốt ruột hoặc bất lực; hỏi trải nghiệm thay vì mặc định mọi người cao tuổi đều trầm cảm.',
 'Các triệu chứng thường được nhắc cùng tuổi cao còn có mất nước, sốt, táo bón, phù, mất ngủ, suy giảm do ít hoạt động và tổn thương do tì đè. Chúng cần nhận diện riêng, không coi là điều phải chấp nhận chỉ vì tuổi.'
])
deepen('dehydration',[
 'Mất nước có thể đi cùng tăng nhiệt độ; tình trạng nặng có thể nguy hiểm tính mạng và cần điều trị. Ghi các dấu hiệu thật, gọi hỗ trợ theo mức khẩn và không trì hoãn vì người đó không kể khát.',
 'Trước và sau vận động hoặc tắm, xem cơ hội uống và nhiệt độ môi trường theo kế hoạch cá nhân. Nhu cầu nước phải xét giới hạn dịch hoặc khó nuốt; không áp một lượng chung cho mọi người.'
])
deepen('fever-constipation',[
 'Ăn kém, đau bụng hoặc buồn nôn có thể đi cùng táo bón nhưng cũng có nguyên nhân khác. Báo thay đổi và dấu hiệu đáng lo, không chỉ đếm ngày để tự kết luận.',
 'Hình xoa bụng diễn tả tác động theo vùng đại tràng. Nhận biết mục đích của hình không phải chỉ định tự xoa; đau bụng mới, bệnh nền và chống chỉ định cần đánh giá, chỉ thực hiện khi có hướng dẫn phù hợp.'
])
deepen('edema-itch',[
 'Ở người liệt một bên, phía đó có thể dễ phù do giảm vận động và các yếu tố khác. So hai bên và theo dõi cân nặng cùng vị trí, mức phù; không suy mọi sưng một bên đều do liệt.'
])
deepen('heart-diseases',[
 'Hoại tử là tế bào hoặc mô chết. Nhồi máu cơ tim liên quan thiếu máu gây tổn thương cơ tim; đau thắt ngực và nhồi máu không thể phân biệt chắc chỉ qua lời kể mức đau.',
 'Đau đầu, chóng mặt, buồn nôn, thay đổi ý thức, cảm giác hoặc hô hấp có thể xuất hiện trong bệnh mạch não nhưng không phải dấu hiệu riêng chỉ của bệnh đó. Khi có thay đổi cấp, ưu tiên gọi trợ giúp; kế hoạch ăn và vận động là phần quản lý sau đánh giá, không xử trí cấp.',
 'Tư thế ngồi nghiêng về trước trong hình nhằm gợi một cách có thể giảm khó chịu hô hấp. Không ép mọi người có suy tim theo tư thế đó; hỗ trợ tư thế họ chịu được và theo chỉ dẫn, đồng thời báo khó thở.'
])
deepen('skeleton-labels',[
 'Loãng xương làm xương dễ gãy hơn; ít vận động kéo dài, dinh dưỡng và thay đổi hormone là các yếu tố liên quan. Phụ nữ có thể có nguy cơ cao sau mãn kinh nhưng nam giới cũng có thể mắc.',
 'Lưng cong, giảm chiều cao hoặc đau vùng lưng có thể là dữ kiện cần đánh giá, không đủ tự chẩn đoán. Dinh dưỡng có canxi, hoạt động và cơ hội tiếp xúc ánh sáng phù hợp phải theo nhu cầu cá nhân; bảo vệ khỏi ngã là phần quan trọng.'
])
deepen('internal-disability',[
 'Trong chạy thận nhân tạo, máu đi qua đường ra tới bộ lọc, một phần chất thải và nước dư được loại, rồi máu trở lại cơ thể. Bảo vệ đường vào mạch theo chỉ dẫn; lịch tắm, lượng nước và muối phải theo kế hoạch điều trị chứ không suy trực tiếp từ hình.',
 'Hình thiết bị hô hấp gồm bình oxy mang theo và máy tạo oxy cá nhân. Cấp oxy không đồng nghĩa máy thông khí hỗ trợ thở; không tự đổi lưu lượng. Theo hướng dẫn phòng cháy, nguồn dự phòng và phòng nhiễm trùng.',
 'Lỗ mở đưa phân hoặc nước tiểu ra thành bụng có vị trí khác theo loại phẫu thuật; túi thu nhận cần thao tác theo huấn luyện. Không phải mọi rối loạn bàng quang đều có lỗ mở; đỏ, loét, rò hoặc thay đổi bất thường cần báo.'
])
deepen('brain-lobes',[
 'Sơ đồ còn nối thùy trán với hành vi, cảm xúc, động lực và ý định. Khứu giác và vị giác có mạng lưới xử lý liên quan nhiều vùng; không hiểu nhãn mùi ở vùng trán hay vị ở vùng đỉnh như mỗi giác quan chỉ có một trung tâm duy nhất.',
 'Nhận thức gồm ghi nhớ, dùng ngôn ngữ, thực hiện hành động, nhận biết và lên kế hoạch theo thứ tự. Mất một mặt không chứng minh mọi mặt mất; xem người đó đang cần hỗ trợ ở khâu nào.'
])
deepen('forgetting',[
 'Chăm sóc sa sút trí tuệ cần giữ cách sống quen, khả năng còn lại và động lực của người đó. Làm hoạt động cùng nhau và giữ nhịp ngày phù hợp có thể giúp giảm lo; không đổi phòng hoặc đồ quen chỉ để tiện nhân viên.',
 'Lắng nghe trải nghiệm và cảm xúc, dùng lời ngắn dễ theo, dành thời gian và trấn an. Không tranh cãi để buộc người đó thừa nhận sai; thấu cảm không đòi xác nhận một niềm tin chưa có căn cứ là sự thật.'
])
deepen('dementia-types',[
 'Thể Lewy liên quan tích tụ bất thường protein alpha-synuclein trong não. Không học cách giải thích chỉ là teo vùng chẩm; biểu hiện nhận thức, vận động, giấc ngủ và cảm xúc cần được đánh giá cùng nhau.',
 'Biểu hiện và đáp ứng điều trị thay đổi giữa các cá nhân. Không gán người Alzheimer luôn vui hay người thoái hóa trán–thái dương luôn hung hăng; thuốc và tác dụng được bác sĩ đánh giá, không hứa mọi loại thuốc đều làm chậm mọi dạng bệnh.'
])
deepen('dementia-symptoms',[
 'Tên triệu chứng cốt lõi và biểu hiện hành vi/tâm lý giúp nhóm điều cần tìm hiểu, không xếp mức quan trọng. Bệnh lý, khó khăn nhận thức, sức khỏe cơ thể, môi trường và quan hệ có thể cùng ảnh hưởng; không quy mọi hành vi cho tính cách hoặc môi trường riêng lẻ.',
 'Khó định hướng có thể liên quan giờ, nơi hoặc người; khó lập kế hoạch ảnh hưởng chuỗi thao tác, còn khó phán đoán có thể ảnh hưởng quyết định tiền bạc. Những ví dụ này gợi quan sát, không phải mỗi khó khăn đều có ở mọi người.'
])

deepen('aging',[
 'Hình thay đổi theo hệ còn chỉ giảm bảo vệ miễn dịch và hô hấp, thay đổi chức năng thận cùng đi tiểu nhiều lần, thành mạch thay đổi liên quan huyết áp và ruột vận động kém liên quan táo bón. Đây là các xu hướng có thể gặp, không khẳng định mọi thay đổi đều bình thường ở tuổi cao.'
])
deepen('pressure-organs',[
 'Huyết áp cao kéo dài cần được đánh giá cùng tình trạng tim, thận, mạch và lối sống. Đau đầu hoặc hồi hộp có thể xảy ra nhưng nhiều người không có triệu chứng; kế hoạch muối, vận động và thuốc theo đội điều trị, không tự dừng thuốc khi thấy khỏe.'
])
deepen('fever-constipation',[
 'Thời điểm đi vệ sinh sau bữa ăn, hoạt động vừa khả năng và thức ăn có chất xơ là những yếu tố cần xem trong kế hoạch táo bón. Phối hợp nước theo khả năng nuốt và giới hạn dịch; không buộc một giờ hoặc một chế độ ăn cho mọi người.'
])
deepen('pneumonia',[
 'Viêm phổi có thể liên quan vi khuẩn hoặc virus. Viêm phổi do hít sặc có thể xảy ra khi chất từ miệng, kể cả nước bọt mang vi khuẩn, đi vào đường thở; vì vậy vệ sinh miệng có vai trò ngay cả khi không quan sát thấy sặc thức ăn.'
])
deepen('visual-patterns',[
 'Khó nhìn có thể có từ sớm hoặc xuất hiện do bệnh, tai nạn hay tuổi. Thị lực và trường nhìn là hai mặt khác nhau; mất hoàn toàn khả năng nhìn, chỉ còn nhận sáng hoặc trường nhìn bị thu hẹp cần cách hỗ trợ riêng.'
])
deepen('brain-lobes',[
 'Sa sút trí tuệ là suy giảm chức năng nhận thức ảnh hưởng sinh hoạt hoặc tham gia xã hội, với nhiều nguyên nhân khác nhau. Không đồng nhất mọi quên đơn lẻ với bệnh, cũng không dùng tuổi cao để bỏ qua suy giảm mới.'
])

deepen('icf',[
 'Đặc điểm cá nhân trong sơ đồ còn có giới tính cùng tuổi và giá trị sống. Ghi đặc điểm có liên quan với sự đồng ý phù hợp; không dùng giới tính hay tuổi để gán sở thích hoặc mức tự lập.'
])
deepen('mental-health',[
 'Khuyết tật trí tuệ liên quan phát triển và thích nghi, vẫn cần tôn trọng người trưởng thành như người trưởng thành. Khó khăn tâm thần có thể ảnh hưởng phán đoán hoặc kiểm soát hành động ở một số giai đoạn; không đồng nghĩa người đó luôn thiếu năng lực hoặc gây nguy hiểm.',
 'Tâm thần phân liệt và các rối loạn khí sắc là những nhóm bệnh khác nhau. Cần hiểu triệu chứng đang có và hỗ trợ theo kế hoạch, không dùng tên bệnh để đoán mọi hành vi của người dùng.'
])
deepen('dementia-types',[
 'Tổn thương mạch não có thể đi cùng liệt một bên hoặc mất ngôn ngữ; các khả năng có thể không giảm đồng đều. Alzheimer liên quan thay đổi bệnh lý não tiến triển, còn nhóm trán–thái dương có thoái hóa ở các vùng tương ứng; mô tả teo não không thay đánh giá nguyên nhân và chức năng.'
])
deepen('aging',[
 'Khi nhiều bệnh cùng tồn tại, biến chứng và điều trị có thể tương tác. Ghi toàn cảnh theo kế hoạch chăm sóc, không xử lý một triệu chứng như tách rời mọi bệnh và thuốc khác.'
])

unit('nonverbal-dialogue',[104,105,106],14,'Tín hiệu lắng nghe và ranh giới khi tiếp xúc',[
 'Quan sát nét mặt và động tác giúp chọn cách trao đổi, nhưng ý nghĩa cần hỏi và kiểm với người đó. Tránh suy một biểu cảm là bằng chứng chắc về cảm xúc hoặc sự đồng ý.',
 'Hướng mặt tới người nói và điều chỉnh tầm nhìn ngang nhau có thể giảm cảm giác bị nhìn từ trên xuống. Giao tiếp bằng mắt theo mức người đó thấy dễ chịu; không ép nhìn mắt để chứng minh họ lắng nghe.',
 'Giọng nhẹ, nhịp chậm và khoảng chờ cho người kia thời gian xử lý, trả lời. Gật đầu hoặc lời hưởng ứng có thể báo mình đang theo dõi, nhưng không dùng một cái gật để kết luận người dùng đã hiểu hay đã đồng ý chăm sóc.',
 'Khoanh tay, bắt chéo chân hoặc ngả xa có thể tạo cảm giác đóng lại trong một tình huống, song ý nghĩa cử chỉ thay đổi theo văn hóa và cá nhân. Hướng tới người dùng với tư thế thoải mái; không xếp một tư thế thành tính cách.',
 'Khoảng cách gần có thể thân mật với người này nhưng khó chịu với người khác. Một xu hướng văn hóa về khoảng cách không thay việc hỏi mong muốn của chính người dùng.',
 'Ý nghĩa tiếp xúc còn phụ thuộc thời điểm, lực và tần suất. Trước khi chạm, hỏi hoặc giải thích theo khả năng giao tiếp, quan sát phản ứng và dừng khi không được chấp nhận; nắm tay nhẹ là một lựa chọn có điều kiện.'
 ],'Bác lùi lại khi nhân viên đứng sát; nhân viên cho rằng “ở đây ai cũng thích thân mật”. Cần làm gì?',
 'Lùi tới khoảng cách bác thấy dễ chịu và hỏi cách bác muốn trao đổi. Xem phản ứng cá nhân, không lấy giả định văn hóa thay lựa chọn; nếu cần chạm để hỗ trợ thì giải thích và xác nhận phù hợp.')
unit('shared-care-records',[114,115,116,118],48,'Hồ sơ để người tiếp theo hiểu và tiếp tục chăm sóc',[
 'Chia sẻ thông tin chăm sóc và y tế trong nhóm hỗ trợ phối hợp giữa người chăm sóc với các chuyên môn khác. Mục đích gồm nâng chất lượng và bảo đảm chăm sóc theo nhóm, không chỉ hoàn thành một tờ ghi.',
 'Bản kế hoạch xác định hỗ trợ dự định, hồ sơ trường hợp ghi diễn biến và sổ bàn giao truyền điều người tiếp theo cần biết. Họp hoặc trao đổi trực tiếp bổ sung thảo luận; lời nói không tự thay phần hồ sơ cần lưu.',
 'Ghi trong ngày và càng kịp thời càng tốt theo quy trình để tránh mất chi tiết; ghi đúng thời điểm sự việc và thời điểm ghi nếu có khác biệt. Tách tình trạng người dùng, hỗ trợ đã thực hiện và phản ứng sau hỗ trợ.',
 'Đối chiếu dữ kiện chủ quan với quan sát hoặc số đo; nếu kết luận đến từ chuyên môn khác, ghi nguồn kết luận. Người nhận bàn giao ghi chú, lặp lại phần trọng tâm và hỏi điều chưa rõ; trao đổi hai chiều giúp phát hiện thiếu thông tin.'
 ],'Ca sau đọc “mọi việc ổn” nhưng không biết người dùng đã nhận hỗ trợ gì và có đáp ứng ra sao. Cần bổ sung thế nào?',
 'Ghi thời điểm, tình trạng thực, hỗ trợ đã làm và phản ứng được quan sát hoặc người dùng kể; tách nguồn kết luận chuyên môn nếu có. Bàn giao phần cần theo dõi và xác nhận người nhận hiểu, không thêm số đo chưa có.')
deepen('communication',[
 'Mỗi bên đều có thể gửi và nhận thông tin, chia sẻ suy nghĩ và cảm xúc. Sơ đồ hai chiều biểu diễn phản hồi; người chăm sóc cần học cách trao đổi để xây dựng tin cậy với người dùng, gia đình và các chuyên môn.',
 'Thời đại lớn lên và môi trường sống góp phần tạo giá trị riêng. Tôn trọng cảm xúc, suy nghĩ và giá trị, dùng lời lịch sự phù hợp người trưởng thành; không thay lựa chọn bằng điều nhân viên cho là tốt.'
])
deepen('accessible-talk',[
 'Khi thông tin nhìn không đủ, vị trí hoặc khoảng cách có thể khó xác định. Giải thích đặc điểm đồ vật cụ thể, nêu mốc theo phía người dùng hoặc âm thanh đã thống nhất; có thể cho sờ vật để nhận biết khi họ muốn và an toàn.',
 'Ngôn ngữ ký hiệu có thể kết hợp tay, ngón tay, biểu cảm khuôn mặt và chuyển động đầu/cổ theo hệ ngôn ngữ. Máy trợ thính thu âm qua micro, xử lý hoặc khuếch đại rồi đưa âm tới tai; đây là đường hỗ trợ khác với chữ hoặc ký hiệu.',
 'Khó tiếp nhận âm thanh có thể làm người dùng cảm thấy bị bỏ ngoài cuộc, cô đơn hoặc mất mát. Hỏi trải nghiệm, hỗ trợ tâm lý và cơ hội tham gia; không mặc định mọi người khiếm thính đều có cùng cảm xúc.',
 'Công nghệ thông tin và truyền thông có thể hỗ trợ trao đổi, nhưng phải chọn theo khó khăn cụ thể, kỹ năng và mong muốn. Kiểm người đó thực sự sử dụng và hiểu được phương tiện, không chỉ đưa thiết bị là đủ.'
])
deepen('record-handover',[
 'Giữ bí mật và bảo vệ dữ liệu là trách nhiệm nghề nghiệp. Làm rõ mục đích, phạm vi và sự đồng ý hoặc căn cứ phù hợp trước khi chia sẻ; ảnh chụp và thông tin nơi làm việc cũng không được đăng hoặc kể tùy tiện.',
 'Tình trạng công việc của chính nhân viên và điều nhận thấy khi tiếp xúc người dùng cũng có thể cần báo cho nhóm. Chọn thời gian, nơi trao đổi bảo vệ thông tin; tình huống khẩn báo ngay theo quy trình.',
 'Thảo luận là tìm lời khuyên từ đồng nghiệp hoặc chuyên môn khi có vấn đề hay phần chưa hiểu. Nêu điều chưa chắc và hỏi đúng người; không tự quyết vượt phạm vi chỉ vì muốn hoàn tất nhanh.'
])

unit('movement-body-labels',[122],15,'Nhận diện vùng cơ thể khi báo khó vận động',[
 'Vận động dùng cơ cùng xương và khớp. Ở thân, phân biệt đầu, cổ, ngực, bụng, lưng, eo và vùng mông; nói vị trí giúp người nhận báo cáo hiểu phần đang khó chịu.',
 'Ở tay, vai, cánh tay, khuỷu và cổ tay là các mốc khác nhau. Lòng bàn tay khác mu bàn tay; cần nói cả bên trái hay phải của chính người dùng.',
 'Ở chân, phân biệt vùng chân, đầu gối, cổ chân, gót và lòng bàn chân. Lòng bàn chân là mặt dưới bàn chân, không phải vùng gót riêng.',
 'Biết tên vùng giúp quan sát và trao đổi, chưa đủ chọn kỹ thuật chuyển người. Hỏi đau, khả năng tự làm và điều kiện hỗ trợ; không kéo một chi chỉ vì nhận diện đúng tên.'
 ],'Báo cáo ghi “đau tay” trong khi người dùng chỉ vào mặt ngoài bàn tay phải. Cần làm rõ điều gì?',
 'Xác nhận vị trí người dùng chỉ, ghi mu bàn tay phải nếu đúng, thời điểm và điều họ kể; tách quan sát với suy đoán nguyên nhân. Không tự thử kéo tay để xác định bệnh.')
unit('visual-guided-walking',[136],16,'Dẫn đường theo nhịp của người khó nhìn',[
 'Người dẫn điều chỉnh tốc độ theo người dùng, không kéo đi theo nhịp riêng. Thỏa thuận cách nhận hỗ trợ và đánh giá đường đi, dụng cụ cùng khả năng trước khi di chuyển.',
 'Thông báo bằng lời trước khi gặp bậc, góc rẽ hoặc thay đổi tình huống. Nêu rõ điều sắp đến để người dùng có thời gian điều chỉnh, không đợi đã bước vào chỗ thay đổi mới giải thích.',
 'Tư thế dẫn trong hình là một mẫu trao đổi và tiếp xúc có thỏa thuận, không buộc mọi người dùng theo cùng cách. Theo hướng dẫn được huấn luyện và phản hồi người dùng; dừng khi điều kiện không an toàn.'
 ],'Người dẫn thấy sắp rẽ nhưng chỉ báo sau khi đã kéo người dùng sang bên. Cần thay đổi thế nào?',
 'Báo trước góc rẽ bằng lời cụ thể, theo nhịp người dùng và cách hỗ trợ đã thống nhất. Tránh kéo bất ngờ; hỏi phản hồi và dừng nếu đường hoặc khả năng hỗ trợ không phù hợp.')
deepen('posture-names',[
 'Đứng, ngồi và nằm là ba nhóm tư thế theo cách cơ thể được nâng đỡ. Nằm ngửa có vùng tiếp xúc rộng trong ví dụ nhưng không tự là tư thế tốt nhất cho mọi hô hấp, đau hoặc nguy cơ tì đè.',
 'Mẫu nghiêng phải còn có đệm dưới chân phải và giữa hai chân cùng đệm phía trước ngực. Với nửa ngồi, phần giường nâng chân hoặc đệm dưới gối hỗ trợ tư thế; vị trí và dụng cụ phải được kiểm theo cơ thể, da và kế hoạch.'
])
deepen('disuse',[
 'Ít hoạt động kéo dài có thể đi cùng hạ huyết áp khi đứng, hồi hộp hoặc hụt hơi, dinh dưỡng kém và giảm năng lực hoạt động. Đây là các vấn đề cần đánh giá, không tự quy triệu chứng mới đều do ít hoạt động.',
 'Sau nâng đầu giường, thao tác giảm kéo căng hoặc trượt vùng lưng trong hình nhằm giảm lực lên da. Chỉ hiểu mục đích chưa đủ thực hiện nâng người; dùng phương án và dụng cụ đã được huấn luyện, không tự kéo hoặc nhấc cơ thể.',
 'Quan sát da khi thay áo hoặc tắm giúp nhận ra đỏ và thay đổi ở vùng chịu lực. Báo chuyên môn khi thấy bất thường, không đợi thành vết loét; lịch đổi tư thế và cơ hội rời giường theo đánh giá cá nhân.'
])
deepen('movement-devices',[
 'Các phần xe lăn còn gồm tựa lưng, đệm ngồi, gác tay, tựa cẳng chân và bánh trước. Bánh sau đi cùng vành đẩy nhưng là hai phần khác; bàn để chân khác tựa cẳng chân.',
 'Phanh giữ khi dừng khác bộ phanh hỗ trợ ở tay đẩy trong hình. Thanh nâng cân bằng giúp thao tác theo thiết kế; biết vị trí không cho phép thử nâng bánh khi chưa được huấn luyện hoặc dùng khác hướng dẫn xe.'
])
deepen('turning-sitting',[
 'Ở mẫu trở mình, thu gọn bằng gập gối tạo thuận lợi chuyển tư thế, rồi chỉnh hông ra sau và chân tới chỗ thoải mái để diện tiếp xúc khi nghiêng ổn định hơn. Thu gọn và tăng diện tựa là hai thời điểm với mục đích khác, không phải hai chỉ dẫn mâu thuẫn.',
 'Nếu sức khỏe không phù hợp trước thao tác, báo chuyên môn thay vì cố làm. Điều chỉnh độ cao giường vừa giảm tải lưng nhân viên vừa cần đúng mục tiêu: lúc ngồi, hai lòng bàn chân có điểm tựa; để người dùng làm phần có thể.'
])
deepen('standing-cane',[
 'Mẫu đứng còn cho ngồi tiến gần mép, chân khỏe lùi để nhận trọng lượng và thân nghiêng trước; người hỗ trợ ở phía yếu phòng gối khuỵu. Không tự ép người dùng theo mẫu khi sức chịu tải hoặc khớp không phù hợp.',
 'Trong mẫu đi gậy, người hỗ trợ đứng phía sau bên yếu, hỗ trợ thân và eo khi cần theo huấn luyện. Chân yếu bước trước trong nhịp mẫu để bên khỏe giữ tải lúc bắt đầu; so ổn định hai nhịp và ba nhịp cần xét khả năng thật.'
])
deepen('wheelchair-transfer',[
 'Mẫu chuyển dùng tay khỏe vịn gác tay phía xa rồi phối hợp nghiêng thân, đứng, xoay và ngồi sâu; sau đó kiểm nâng đỡ chân và cảm giác. Không dùng trình tự này thay đánh giá chuyển người hoặc tự xoay khi họ không chịu tải được.',
 'Trong mẫu đẩy, tay khỏe có thể vịn gác tay còn tay yếu giữ phía trong để tránh bánh sau; chân ở bàn để chân. Kiểm tay, quần áo và chân trước nhả phanh, nói trước khi xe bắt đầu di chuyển.'
])
deepen('wheelchair-curb',[
 'Hình lên và xuống bậc đều cho chân người hỗ trợ tiếp xúc chắc thanh nâng, tay đẩy hướng nghiêng xuống để kiểm soát nghiêng xe. Hạ bánh phải từ từ; chiều bánh trước/sau khác theo đi lên hay đi lùi xuống, không tăng lực để vượt một bậc không phù hợp.'
])

# Eating detail continuation, 2026-10-10; independent expressions.
deepen('swallow-stages',['Ăn đòi hỏi phối hợp nhiều việc: tới chỗ ăn, giữ tư thế, nhận ra món, điều khiển dụng cụ, đưa thức ăn vào miệng, nhai rồi nuốt. Khó khăn ở một việc không có nghĩa phải làm thay toàn bộ; xác định phần người dùng còn thực hiện được.', 'Cảm giác đói và muốn ăn liên quan hoạt động của não. Mắt và mũi giúp nhận biết món; vị giác nhận hương vị, còn xúc giác góp phần cảm nhận kết cấu trong miệng. Nhận ra món và thích món chưa xác nhận khả năng nuốt.', 'Bữa ăn cung cấp năng lượng và chất dinh dưỡng cho cơ thể hoạt động và duy trì sự sống. Cần nhìn đồng thời giá trị dinh dưỡng, khả năng ăn và trải nghiệm của người dùng; có món trước mặt chưa có nghĩa cơ thể đã nhận đủ dinh dưỡng.', 'Ở chặng hầu, nắp thanh quản tham gia bảo vệ lối vào đường thở cùng sự phối hợp của thanh quản và các cơ liên quan. Thức ăn cần đi về thực quản; không hiểu rằng nhìn thấy cử động nuốt là đã chứng minh đường thở được bảo vệ.'])
deepen('food-devices',['Có thể phân nhóm dụng cụ theo trở ngại: cán dễ nắm và đai giữ hỗ trợ việc giữ dụng cụ; thìa hoặc nĩa cong điều chỉnh hướng đưa tới miệng; đũa có lò xo hỗ trợ thao tác gắp. Chọn sau khi xem người dùng cầm và sử dụng thực tế, không chỉ nhìn tên dụng cụ.', 'Đĩa có thiết kế dễ xúc hỗ trợ lấy thức ăn; tấm chống trượt giữ đồ trên bàn ổn định; bát dễ cầm và cốc có tay cầm hỗ trợ giữ vật chứa. Giữ được cốc là khả năng vận động, không phải bằng chứng loại nước trong cốc phù hợp với kế hoạch nuốt.', 'Ăn trên giường cần phương án hỗ trợ phần thân và đầu phù hợp. Nâng đầu giường có thể làm cơ thể trượt hoặc bị kéo ở vùng tựa; chỉnh hỗ trợ theo kế hoạch và đào tạo, không tự kéo hay nhấc người để bắt chước hình minh họa.'])
deepen('meal-checks',['Quan sát bữa ăn theo diễn biến: tốc độ, tư thế, cách dùng dụng cụ, động tác nhai và nuốt, cùng mong muốn của người dùng. Điều chỉnh hỗ trợ theo thông tin thực sự thu được và kế hoạch; không coi nhịp ăn của nhân viên là nhịp người dùng phải theo.', 'Trình bày thực đơn và hỏi mong muốn khi người dùng có thể trao đổi. Đang nhai thì chờ thời điểm phù hợp trước hỏi; người dùng muốn nghỉ hoặc kết thúc cần được tiếp nhận, không suy rằng phần ăn còn lại là yêu cầu phải tiếp tục.', 'Nhịp hỗ trợ gồm cả lượng mỗi miếng và khoảng chờ, không chỉ số phút của bữa ăn. Quan sát và hỏi vào thời điểm phù hợp theo kế hoạch cá nhân; nhân viên chọn vị trí giúp theo dõi mặt và miệng mà không buộc người dùng ngước đầu để nhìn mình.', 'Khi dùng cách nói vị trí đồng hồ, thống nhất hướng từ chỗ người dùng: 12 giờ ở xa phía trước, 6 giờ gần người, 3 giờ bên phải và 9 giờ bên trái; các số còn lại chỉ hướng nằm giữa. Đây là cách mô tả vị trí đồ, không mô tả lượng thức ăn hoặc thời gian cần ăn.'])

deepen('food-devices',['Hình ngồi ăn minh họa thân hơi hướng trước, chân có tựa và cằm được bố trí phù hợp. Nhận biết các điểm này để hiểu mục tiêu nâng đỡ; không ép người dùng cúi cằm hoặc nghiêng thân theo một hình chung khi phương án nuốt cá nhân khác.'])

# Excretion continuation: independent explanations, 2026-10-10.
deepen('digestive',['Bài tiết giúp cơ thể loại bỏ phần không cần giữ: có nước tiểu, phân, mồ hôi và khí cacbon điôxit qua các đường khác nhau. Quan sát chất thải có thể cung cấp thông tin sức khỏe, nhưng hỗ trợ phải dựa vào lý do người dùng cần giúp ở từng hoạt động.', 'Cảm giác muốn đại tiện có thể giảm sau một thời gian trì hoãn. Tiếp nhận tín hiệu của người dùng và hỗ trợ đúng lúc theo thói quen; đừng hiểu việc hết muốn đi là chứng minh trực tràng đã hết phân.', 'Tư thế đại tiện trong ví dụ có thân hướng trước và gót nhấc, nhằm giải thích quan hệ giữa tư thế và đường thoát phân từ trực tràng. Khi chăm sóc, ưu tiên tựa chân, thăng bằng và tư thế đã đánh giá; không buộc người yếu chân nhón gót hoặc rặn để bắt chước hình.'])
deepen('urine-reference',['Bảng học mô tả mẫu nước tiểu ít mùi hoặc không nhận thấy mùi, đối chiếu với mùi amôniắc rõ. Ghi mùi cùng thời điểm và điều kiện thu; một mẫu để lâu hoặc một mùi riêng không đủ kết luận bệnh.', 'Ví dụ học về phân dùng nhịp 1–2 lần mỗi ngày và màu nâu đậm để đối chiếu. Nhịp bình thường khác giữa từng người; cần ghi thay đổi về số lần, lượng, hình dạng và màu so với chính người đó, cùng bữa ăn và bệnh liên quan.', 'Phân đỏ, đen hoặc nhạt trắng là những màu cần mô tả và báo để được đánh giá theo tình huống. Thức ăn, thuốc và bệnh đều có thể ảnh hưởng màu; không tự xác định nguyên nhân chỉ từ màu nhìn thấy.'])
deepen('continence-types',['Giữ cơ hội đi vệ sinh theo thói quen, lượng nước và chất xơ phù hợp, cùng vận động được phép có thể góp phần hỗ trợ táo bón. Khi tình trạng không cải thiện, báo chuyên môn; không tự tăng nước hoặc chất xơ bất kể hạn chế uống, khả năng nuốt và nguyên nhân tắc nghẽn.', 'Khi tiêu chảy, theo dõi mất nước và bảo vệ da quanh hậu môn khỏi tiếp xúc phân kéo dài. Nếu uống được an toàn, loại và lượng đồ uống phải theo kế hoạch; nhiệt độ dễ chịu không biến nước hoặc đồ uống thể thao thành phương án bù dịch đúng cho mọi người.', 'Lắng nghe khó chịu và lo lắng khi bài tiết, giữ cách trao đổi không gây xấu hổ và ghi quan sát nước tiểu, phân. Dấu hiệu sức khỏe bất thường cần báo kịp thời theo mức khẩn và quy trình, thay vì chỉ hoàn tất thao tác làm sạch.'])
deepen('toilet-environment',['Găng tay và tạp dề dùng một lần là phương tiện bảo vệ trong ví dụ chăm sóc bài tiết. Chọn phương tiện theo đánh giá phơi nhiễm và quy trình; găng không thay vệ sinh tay, và cần đổi từ công việc bẩn sang công việc sạch.', 'Hình môi trường phân biệt tay vịn chữ L dùng làm điểm bám khi chuyển đứng, tay vịn nâng hạ điều chỉnh khoảng tiếp cận, cửa lùa dễ vận hành và nút gọi khi cần giúp hoặc đã xong. Kiểm khả năng với và sử dụng thực tế; hình có tay vịn chưa chứng minh phòng phù hợp người đó.', 'Trong mẫu liệt trái, kiểm ngồi vững trước khi giảm hỗ trợ; cho người dùng chỉnh quần tới mức có thể khi ngồi để giảm việc phải làm lúc đứng. Trước đứng, kiểm vị trí chân khỏe và điểm bám; chỉ để tự hoàn tất nếu đứng ổn định, rồi kiểm quần áo đã chỉnh đủ.', 'Riêng tư cần thống nhất cùng cách gọi và mức giám sát an toàn. Đóng cửa hoặc rời phòng theo mong muốn và đánh giá nguy cơ; không mặc định bỏ người dùng một mình chỉ vì một hình trình tự cho thấy nhân viên bước ra.', 'Bô tại giường cần vật dụng sẵn, rèm hoặc khăn che phù hợp, chống thấm và giường ở mức làm việc an toàn. Chỉ nhờ nâng hông nếu được phép và có khả năng; kiểm vùng hứng, độ ổn định và áp lực da trước dùng, không coi nâng đầu giường là yêu cầu phải rặn.', 'Sau dùng bô, làm sạch theo quy trình, lấy dụng cụ bằng phương án đổi tư thế an toàn, kiểm da và bỏ lớp kê bẩn. Chỉnh quần áo, trả giường về mức an toàn, hỏi và kiểm sức khỏe rồi xử lý vật dụng; không kết thúc ngay khi bô đã lấy ra.'])
deepen('diaper-fit',['Đánh giá sức khỏe và giải thích để có đồng ý trước thay tã; chuẩn bị vật dụng, độ cao giường và chống thấm trước mở tã. Các bước xoay nghiêng, nằm ngửa hoặc nâng hông chỉ dùng khi phù hợp khả năng và kế hoạch, tránh phơi bày cơ thể lâu.', 'Vệ sinh vùng sinh dục bằng nước ở nhiệt độ dễ chịu đã kiểm, chú ý các nếp da và thấm khô nhẹ. Trong ví dụ nữ, hướng làm sạch từ phía niệu đạo về phía hậu môn nhằm tránh đưa chất bẩn ngược lên; dùng vật liệu sạch phù hợp từng lượt và không chà vùng nhạy cảm.', 'Hình thay tã cuộn mặt bẩn vào trong và chuyển sang tã sạch khi đổi tư thế; chú thích nói trình tự đã được giản lược để học. Thực tế phải bảo vệ tã sạch khỏi chạm phần bẩn, tháo hoặc đổi găng đúng ranh giới công việc và vệ sinh tay theo quy trình; không bắt chước việc đặt hai lớp nếu gây nhiễm bẩn.'])

# Grooming continuation, 2026-10-10: independent expressions.
deepen('grooming-purpose',['Chỉnh trang gồm nhiều hoạt động: làm sạch mặt, chăm tóc, râu, móng, mặc quần áo và chăm miệng. Chọn việc theo thói quen và mong muốn, không lấy một kiểu vẻ ngoài do nhân viên thích làm chuẩn cho mọi người.', 'Quần áo phù hợp có thể giúp giữ ấm hoặc thoát nhiệt, bảo vệ da và thuận tiện hoạt động. Việc chuẩn bị vẻ ngoài cũng có thể hỗ trợ nhịp sống và động lực tham gia; lợi ích phụ thuộc cá nhân, không bảo đảm cải thiện mọi chức năng chỉ nhờ thay đồ.'])
deepen('grooming-figure',['Khi hỗ trợ cạo râu, hỏi kiểu râu muốn giữ, kiểm da và hướng dẫn máy, theo dõi vùng đã làm để không bỏ sót hoặc lặp gây kích ứng. Sản phẩm dưỡng sau cạo phải phù hợp da và lựa chọn; nước hoa hồng trong ví dụ không phải sản phẩm bắt buộc.', 'Móng dài hoặc bờ sắc có thể làm xước da; chất bẩn có thể lưu ở móng. Quan sát móng và da quanh móng, báo đau, sưng hoặc thay đổi bất thường. Sau tắm móng có thể mềm hơn, nhưng thời điểm đó không cho phép tự cắt móng có nguy cơ cần chuyên môn.'])
deepen('clothing-bed',['Vị trí nhân viên trong mẫu thay áo nằm khác mẫu ngồi: phần cởi áo minh họa tiếp cận phía khỏe và thao tác nút trước khi thu áo. Hiểu sự khác biệt theo tình huống, không áp một phía đứng cho mọi thao tác; phương án đổi tư thế và bảo vệ vai theo đánh giá, đào tạo.'])
deepen('face-hair-makeup',['Rửa mặt buổi sáng có thể giúp loại bỏ chất bẩn và tạo cảm giác tỉnh táo; nếu dùng khăn ấm phải kiểm nhiệt và khả năng chịu đựng. Làm sạch và giữ ẩm là hai mục tiêu khác nhau, cần chọn cách và sản phẩm theo da.'])
deepen('oral-details',['Răng giả thay thế răng đã mất nhưng vẫn có thể giữ thức ăn và mảng bám. Tháo và làm sạch theo kế hoạch sau ăn, dùng bàn chải và nước theo vật liệu; răng thật còn lại và mô miệng cần chăm riêng, không chỉ rửa phần tháo ra.', 'Vị trí hỗ trợ ngang tầm và đầu được nâng đỡ nhằm tránh buộc người dùng ngửa cằm hoặc mất ổn định. Đây là mục đích của hình trước/sau, không bảo đảm phòng rối loạn nuốt. Nếu súc hoặc dùng dụng cụ mút, làm theo đánh giá miệng–nuốt và đào tạo; kiểm miếng mút còn nguyên theo dụng cụ.'])

# Bathing continuation, 2026-10-10: append facts; preserve prior probes and day IDs.
deepen('skin-structure',[
 'Trong lát cắt da, biểu bì phủ ngoài, lớp bì ở dưới và mô mỡ ở sâu hơn. Chân tóc cùng các tuyến có phần nằm dưới bề mặt; tuyến bã liên quan nang tóc, còn đường dẫn của tuyến mồ hôi đưa chất tiết ra ngoài. Vị trí nhãn giúp phân biệt cơ quan tiết với chất đang ở trên da.',
 'Mồ hôi và bã nhờn có thể góp tạo chất bẩn trên bề mặt. Tỏa nhiệt nhờ mồ hôi không có nghĩa da ẩm kéo dài luôn có lợi; vùng da áp nhau cần làm sạch nhẹ và thấm khô. Mùi còn liên quan vi sinh phân giải chất tiết, không chỉ tên tuyến hoặc lượng mồ hôi.'
])
deepen('bath-environment',[
 'Cần tách mục tiêu sạch và thư giãn khỏi các tác động tuần hoàn, chuyển hóa, cơ–khớp và ăn uống. Làm ấm cơ thể có thể thay đổi điều hòa nhiệt và tuần hoàn; lợi ích về cảm giác, vận động hoặc ăn uống phụ thuộc cá nhân. Không coi tắm là cách bảo đảm phục hồi khớp, chức năng dạ dày hoặc điều chỉnh chuyển hóa ở mọi người.',
 'Trước và trong chăm sóc vệ sinh, hỏi cảm giác và quan sát da trong phạm vi đã đồng ý. Đỏ, đau, trợt hoặc thay đổi bất thường cần được ghi và báo chuyên môn theo tình huống; kiểm sức khỏe chung không thay việc nhìn vùng da đang chăm sóc. Giải thích cách che và mức hỗ trợ để người dùng tiếp tục lựa chọn.',
 'Đồ thay và khăn cần được chuẩn bị sẵn, với quần áo do người dùng chọn khi có thể. Hỏi nhu cầu đi vệ sinh trước buổi tắm vì nhu cầu có thể xuất hiện trong khi tắm; không buộc mọi người phải bài tiết. Vị trí ngồi, chỗ đặt đồ và mức trợ giúp phải phù hợp khả năng đã đánh giá.'
])
deepen('bath-sequence',[
 'Trong mẫu hỗ trợ người yếu một bên tới khu tắm, nhân viên ở phía yếu để bảo vệ thăng bằng, trong khi phần làm quen với nước có thể bắt đầu phía khỏe. Phía người hỗ trợ đứng và phía bắt đầu rửa là hai quyết định khác nhau; phương án thật phải theo đánh giá, huấn luyện và dụng cụ.',
 'Chuẩn bị gội gồm làm ướt tóc và phân bố dầu gội phù hợp trước khi làm sạch nhẹ bằng đầu ngón tay. Giữ nước và sản phẩm khỏi mắt, xả phần dư theo hướng dẫn và hỏi khó chịu; không dùng móng để cào da đầu hoặc chọn sản phẩm chỉ vì tạo nhiều bọt.',
 'Sau khi thấm khô, kiểm vùng da khô hoặc dễ kích ứng và dùng sản phẩm giữ ẩm phù hợp kế hoạch nếu cần. Dưỡng ẩm khác với để nước đọng trong nếp da; nếp gấp vẫn cần được làm khô nhẹ. Không tự bôi sản phẩm mới lên vùng tổn thương hoặc coi kem dưỡng thay việc báo bất thường.'
])
deepen('partial-perineal-wash',[
 'Ngâm tay có thể dùng chậu phù hợp tầm với; ngâm chân cần đồ chứa đủ chỗ cho bàn chân và tư thế vững. Người dùng có thể làm phần còn khả năng trong tư thế ngồi hoặc tại giường theo phương án hỗ trợ. Tên “ngâm tay” và “ngâm chân” chỉ phạm vi rửa, không cho phép dùng chung nước, dụng cụ bẩn hoặc bỏ việc xả và thấm khô.'
])
deepen('bed-wash-figures',[
 'Lau tại giường là một phương án làm sạch khi tắm bồn hoặc vòi sen chưa phù hợp. Lau toàn thân và lau một phần khác nhau về phạm vi đã thống nhất, không phải mức sạch tự động đạt được. Chuẩn bị khăn, chất làm sạch phù hợp, đồ thay và cách giữ ấm; hỏi lại khi người dùng chỉ muốn chăm một vùng.',
 'Khi đọc hướng lau, phân biệt kiểu động tác với lực: nét ngang ở vùng vai, nét tròn tại ngực, bụng hoặc mông và nét dài ở lưng/cạnh thân biểu thị các vùng và chuyển động khác nhau. Dữ kiện hướng giúp không bỏ sót, nhưng không tự xác định lực, số lượt hoặc cho phép áp lên da tổn thương. Vùng mắt, sau tai, cổ và quanh khớp cần được chú ý riêng.',
 'Nước trong đồ chứa, khăn sau làm ướt và nhiệt ở da là ba điểm kiểm khác nhau khi lau. Nước chuẩn bị có thể mất nhiệt nhanh; việc dự trữ nước nóng để điều chỉnh không có nghĩa dùng trực tiếp lên người. Kiểm nhiệt lúc tiếp xúc theo phương tiện và kế hoạch, tránh bưng nước nóng qua người đang nằm; sau mỗi vùng cần loại dư, thấm khô rồi che.'
])

bundle=dict(version=1,date='2026-10-09',scopeVi='Bổ sung các ý chi tiết đã đọc trong khối cơ thể/người cần chăm sóc và một số chú thích thao tác; chưa chứng nhận toàn tài liệu.',
    units=units,allSourceKnowledgeFullyCovered=False,humanReviewed=False,releaseReady=False)
out=ROOT/'docs/ssw-workspace/kaigo/drafts/atomic-supplements-2026-10-09.json'
out.write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n')
runtime=[]
for u in units:
    x={k:v for k,v in u.items() if k not in ['sourcePrintedPages','humanReviewed','domainReviewed','releaseReady']}
    x['contentRevision']=hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    runtime.append(x)
days=[dict(day=58+i,plannedMinutes=30,unitIds=[u['id']],
           studyPlanVi='30 phút dự kiến: 3 phút nối ý đã học · 14 phút đọc một chủ đề · 8 phút tự giải thích ca · 5 phút đối chiếu và sửa. Dừng khi hết 30 phút, giữ phần chưa xong cho ngày sau.') for i,u in enumerate(runtime)]
(ROOT/'src/data/kaigo/atomic-supplements.json').write_text(json.dumps(dict(version=1,units=runtime,days=days,humanReviewed=False,releaseReady=False),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(units=len(units),atomicPoints=sum(len(u['points']) for u in units),additionalDays=len(days)),ensure_ascii=False))
