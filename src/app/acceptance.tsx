import {isLockedOrganizationRoute} from '@/config/release-features';
import {Redirect} from 'expo-router';
import {ScrollView,Text,View} from 'react-native';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {RoyalButton,RoyalBackButton} from '@/components/ui/RoyalSurface';
import {pushPrepared,backPrepared} from '@/components/ui/prepareSceneRoute';
import {DEVELOPMENT_FEATURES} from '@/config/development-features';

const entries=[
 ['Đăng ký thông tin cơ bản','/register'],['Đăng ký công việc','/register/work'],
 ['Hồ sơ / các hạng mục đăng ký','/profile'],['Cài đặt','/settings'],
 ['JLPT / học tập','/learn'],['Kiểm tra bản nghe JLPT','/jlpt-listening-review'],
 ['Hội thoại / tất cả khu vực','/world'],['Lịch sử hội thoại','/world/dialogue-history'],
 ['Các ngành Tokutei','/specified-skills'],['Nông nghiệp','/specified-skills/agriculture'],
 ['Xây dựng','/specified-skills/kensetsu'],['Sản xuất','/specified-skills/manufacturing'],
 ['Sản xuất thực phẩm','/specified-skills/food-manufacturing'],['Nhà hàng','/specified-skills/restaurant'],
 ['Khách sạn','/specified-skills/hospitality'],['Điều dưỡng','/specified-skills/kaigo'],
 ['Game nông trại','/game'],['Nhiệm vụ','/tasks'],['Ví điểm / Premium','/economy'],
 ['Cổng dịch vụ','/portal'],['Doanh nghiệp','/portal/company'],['Giáo dục','/portal/education'],
 ['Lớp học','/portal/education/classroom'],['Quản lý đào tạo','/portal/education/dashboard'],
 ['Khóa N5','/portal/education/n5'],['Tạo lớp','/portal/education/new-class'],
 ['Thanh toán giáo dục','/portal/education/payment'],['Hướng dẫn giáo dục','/portal/education/welcome'],
 ['Hỗ trợ','/portal/support'],['Tiến độ lao động','/portal/worker-progress'],
 ['Từ điển','/dictionary'],['Khám phá','/explore'],['Kiểm tra âm thanh','/audio-test'],
 ['Hội thoại khởi đầu','/npc-starter'],['Nhật ký hội thoại','/conversation-log'],
 ...['N5','N4','N3','N2','N1'].flatMap(level=>[[`${level} · Học tập`,`/${level}`],[`${level} · Kiểm tra`,`/${level}/test`]]),
] as const;
export default function AcceptanceScreen(){
 if(!DEVELOPMENT_FEATURES.acceptanceReview)return <Redirect href="/home"/>;
 return <RoyalPageBackground><SafeAreaView style={{flex:1}}><View style={{paddingHorizontal:16}}><RoyalBackButton onPress={()=>{void backPrepared();}}/></View><ScrollView contentContainerStyle={{padding:16,gap:8,width:'100%',maxWidth:900,alignSelf:'center'}}><Text style={{fontSize:22,color:'#fff3cf'}}>Nghiệm thu bản người học</Text><Text style={{color:'#fff3cf',lineHeight:24}}>Mở các màn hình đã có để kiểm tra. Chức năng cần máy chủ hoặc tài khoản xác thực vẫn báo trạng thái thật; màn hình này không tạo giao dịch hay quyền trả phí giả.</Text>{entries.filter(([,route])=>!isLockedOrganizationRoute(route)).map(([label,route])=><RoyalButton key={route} compact label={label} onPress={()=>{void pushPrepared(route as Parameters<typeof pushPrepared>[0]);}}/>)}</ScrollView></SafeAreaView></RoyalPageBackground>;
}
