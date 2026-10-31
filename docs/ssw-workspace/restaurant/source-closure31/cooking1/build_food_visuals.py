"""Atlas bytes stay intact; per-object crop boxes support narrow-screen reader cards."""
from pathlib import Path
import json,hashlib,shutil
from PIL import Image
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).resolve().parent;DEST=ROOT/'assets/restaurant/source31/cooking1'
inputs={'fish':'/workspace/scratch/8c34e3cace7a/generated_images/exec-177f5dae-18b9-449a-a207-bba6bd081742.png','produce':'/workspace/scratch/8c34e3cace7a/generated_images/exec-3e6b749b-c9d4-4559-9b76-01695205ed27.png'}
for key,p in inputs.items():
 dest=DEST/f'{key}-recognition-atlas-v1.png'
 if Path(p).is_file():shutil.copyfile(p,dest)
 else:assert dest.is_file(),str(dest)
# Explicit morphology read from pixels, not inferred approval from labels or hashes.
fish=[('sawara','サワラ','銀色で細長い体に黒い斑点が列状に見える',9),('asari','アサリ','閉じた楕円形の殻に褐色の模様と細かなすじがある',9),('wakame','ワカメ','茎から分かれたぬれた褐緑色の葉状部が見える',9),('ayu','アユ','細い銀緑色の体とえらの後ろの黄色い部分が見える',9),('surumeika','スルメイカ','細長い胴とひれ、頭側の腕・長い触腕が見える',9),('hotate','ホタテ','放射状のすじを持つ扇状の殻と白い貝柱が見える',9),('katsuo','カツオ','紡錘状の体と腹側の複数の縦方向の縞が見える',9),('salmon','サケ類','銀色の体と背びれの後ろの小さなひれが見える',9),('sanma','サンマ','非常に細長い銀色の体ととがった口先が見える',9),('snow-crab','ズワイガニ','小さな甲らから長い歩脚と二本のはさみが伸びる',9),('oyster','カキ','不規則で粗い殻の中に柔らかな身が見える',9),('fugu','フグ','丸みのある体、斑紋、小さなひれが見える',9)]
produce=[('lotus','れんこん','切断面に複数の丸い穴が並ぶ根茎',10),('strawberry','いちご','表面に小さな粒が並ぶ赤い果実と緑のがく',10),('melon','メロン','網目模様のある丸い表面と上部の柄',10),('watermelon','すいか','縞のある丸い外皮と赤い切断面',10),('bamboo','たけのこ','重なる皮に包まれた先細りの芽',11),('nanohana','菜の花','緑の葉と茎、小さな黄色の花やつぼみ',11),('asparagus','アスパラガス','先端がまとまった細長い緑の茎',11),('soramame','そらまめ','厚い緑のさやの内側に大きな豆',11),('goya','ゴーヤー','表面の大きな凹凸と長い紡錘形',11),('piman','ピーマン','つやのある緑色とふくらんだ部分が分かれた形',11),('broccoli','ブロッコリー','密集した緑の花蕾と太い茎',11),('negi','ねぎ','長い白い下部と細長い緑の葉',11)]
# Source-photo seasonal occurrences, separate from classification/name-only occurrences.
seasons={'bamboo':'春','nanohana':'春','asparagus':'春','soramame':'春','goya':'夏','piman':'夏','peach':'夏','sweet-potato':'秋','chestnut':'秋','persimmon':'秋','asian-pear':'秋','daikon':'冬','chinese-cabbage':'冬','broccoli':'冬','negi':'冬'}
figs=[];checks=[]
def record(key,name,desc,path,page,crop=None,reuse=None,atlas=None):
 im=Image.open(ROOT/path);w,h=im.size;sha=hashlib.sha256((ROOT/path).read_bytes()).hexdigest()
 sr=[{'documentId':'rst-1-cooking','pdfPages':[page],'section':'魚介の旬の写真例' if page==9 else '野菜の分類の写真・名前例' if page==10 else '野菜・果実の旬の写真例'}]
 if key in seasons and page!=11:sr.append({'documentId':'rst-1-cooking','pdfPages':[11],'section':'季節の写真例'})
 units=[11] if page==9 else [13]+([14] if key in seasons else []) if page==10 else [14]
 f={'id':'rst31-cooking1-fig-food-'+key,'lessonId':'rst-1-cook-'+('02' if page==9 else '03'),'factIds':[],'assetFile':path,'svgFile':None,'width':w,'height':h,'sha256':sha,'captionJa':name+'の外形の例。品種や状態で見え方は変わるため、納品名も照合します。','altJa':name+'の認識用画像。','sourceRefs':sr,'scopeLimits':'元資料の写真例に対応する独立画像。実物全個体・品種の同定、安全性や資格を保証しない。','aiPixelReviewed':True,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'rights':{'origin':'reused_project_original_imagegen' if reuse else 'original_imagegen','copiedSourceArtwork':False},'foodKey':key,'foodNameJa':name,'visualDefinitionJa':desc,'unitNumbers':units,'teachingOnly':True}
 if crop:f['cropBox']=crop;assert crop['x']>=0 and crop['y']>=0 and crop['x']+crop['width']<=w and crop['y']+crop['height']<=h
 if reuse:f['rights']['reusedOriginalPath']=reuse;f['rights']['originalBytesSha256']=sha
 if atlas:f['rights']['generator']='built-in image_gen';f['rights']['promptSet']=atlas
 figs.append(f);checks.append({'foodKey':key,'nameJa':name,'pixelIdentityNoteJa':desc+'を実際の生成画素で確認。','sourcePhotoOrNamePages':[s['pdfPages'][0] for s in sr],'notNativeOrDomainApproval':True})
for atlas,items,ys in [('fish',fish,[2,342,667,1022]),('produce',produce,[2,342,651,1022])]:
 for i,(key,name,desc,page) in enumerate(items):
  row=i//4;col=i%4;x=col*384+2;y=ys[row];bottom=338 if row==0 else (664 if atlas=='fish' else 648) if row==1 else 1022
  record(key,name,desc,f'assets/restaurant/source31/cooking1/{atlas}-recognition-atlas-v1.png',page,{'x':x,'y':y,'width':380,'height':bottom-y},atlas=atlas)
reuse=[('cabbage','キャベツ','重なった丸い葉が球状にまとまる'),('carrot','にんじん','橙色で先細りの根'),('chinese-cabbage','はくさい','白い厚い葉柄と黄緑の葉が縦長に重なる'),('cucumber','きゅうり','濃緑色で細長く小さな表面の凹凸がある'),('lettuce','レタス','薄い黄緑色の葉が緩く重なる'),('onion','たまねぎ','薄い褐色の皮で包まれた丸い球'),('potato','じゃがいも','淡褐色の皮に芽のくぼみがある塊茎'),('spinach','ほうれんそう','細い葉柄に緑の葉が付き根元が束になる'),('sweet-potato','さつまいも','赤紫の皮を持つ長い塊根'),('tomato','トマト','赤い丸い実に緑のがくがある'),('eggplant','なす','紫色のつやのある実と緑のがく'),('peach','もも','赤と淡黄色の丸い実に縫合線がある'),('chestnut','くり','褐色でつやのある殻と淡色の底面'),('persimmon','かき','橙色の実の上に大きながくが残る'),('asian-pear','なし','黄褐色の皮に細かな斑点のある丸い実')]
for key,name,desc in reuse:
 source=Path('/workspace/scratch/8c34e3cace7a/cooking31-qa/agri')/(key+'.webp');dest=DEST/(key+'-reuse-v1.webp');
 if source.is_file():shutil.copyfile(source,dest)
 else:assert dest.is_file(),str(dest)
 record(key,name,desc,str(dest.relative_to(ROOT)),11 if key in ['sweet-potato','peach','chestnut','persimmon','asian-pear'] else 10,reuse='assets/agriculture/recognition/'+key+'-v1.webp')
# Existing restaurant daikon is long, matching the source winter-photo shape more closely than the round agricultural cultivar.
record('daikon','だいこん','白く長い先細りの根と緑の葉','assets/restaurant/vegetables-v1.png',11,{'x':384,'y':0,'width':384,'height':512},reuse='assets/restaurant/vegetables-v1.png')
(OUT/'food-figures.json').write_text(json.dumps(figs,ensure_ascii=False,indent=2)+'\n')
(OUT/'food-pixel-review.json').write_text(json.dumps({'scope':'All24 new atlas cells and16 reused originals actually viewed; source-scoped morphological comparisons, no domain/native certification','atlasCropGeometry':'Nonuniform horizontal dividers measured from generated pixels: fish339/340 and665/666; produce339/340 and649/650. Crop boxes exclude divider lines.','individualDetailedCellsViewed':[x[0] for x in fish+produce],'checks':checks,'reuseCaveat':'Agricultural round daikon deliberately not used; long daikon from restaurant8-item image retained.','generatorMode':'built-in image_gen; no public translation/image API','sourcePdfArtworkUsedAsImagegenInput':False},ensure_ascii=False,indent=2)+'\n')
print('food figures',len(figs))
