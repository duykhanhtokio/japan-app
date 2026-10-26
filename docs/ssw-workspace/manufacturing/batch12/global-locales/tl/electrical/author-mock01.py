from importlib.machinery import SourceFileLoader
from pathlib import Path
p=Path(__file__).parent;m=SourceFileLoader('tlem',str(p/'author-mock-helper.py')).load_module()
m.emit(1,'theory','''Ang1.5mm²ng stranded wire ay conductor area,hindi diameter1.5mm.|mm²ay area,mmay length;tiyakin sa compatibility table.
Kung0.01mmang least scale,laging hanggang0.01mmang error sa lahat ng paggamit.|Naaapektuhan ng posisyon,contact,at kondisyon ang aktuwal na sukat.
Kahit malaki ang range,hindi puwede sa equipment na lampas sa safety rating ng meter.|Magkaibang kondisyon ang function range at safety rating.
Walang kaugnayan sa traceability ang product number at inspection revision.|Kailangan malaman kung ano at aling pamantayan ang ginamit sa paghatol.
Kung nasa gitna ng specification ang average,tiyak na lahat ay pasok.|Magkaibang impormasyon ang average at variation.
Tiyakin ang line type upang hindi ipagkamali ang center line sa outline na puputulin.|Magkakaiba ang kahulugan ng line types.
Sa karaniwang four-band resistor,ikatlo ang multiplier.|Ihiwalay ang unang dalawang band,multiplier,at tolerance.
Sa isang diode,agad laging patag at constant DC ang resulta.|Magkaiba ang rectification at smoothing.
Maaaring bawasan ng planadong pagpapalit ang failure ngunit gastos din ang pagpapalit ng magagamit pa.|Parehong isaalang-alang ang prevention at replacement cost.
Iba ang voltage-regulator stabilization sa A/D signal conversion mismo.|Magkaiba ang power function at signal conversion.
Laging parehong direksiyon ang consistency measurement at lahat ng grade numbers.|Huwag paghaluin ang magkakaibang marking systems.
Lahat ng contact-opening devices ay ligtas sa short current kahit walang rating check.|Tiyakin ang breaking capacity at layunin.
Kasama sa logistics quality ang tamang produkto,dami,address,at pangakong deadline.|Customer requirement din ang tumpak na delivery.
Appearance lamang ang burr at walang epekto sa mounting.|Suriin din ang epekto sa susunod na proseso.
Basic metal file ay maximum force sa return lamang.|Bawasan ang puwersa sa pagbalik.
Pagsamahin ang company management at worker procedure compliance upang bawasan ang hazard.|Hindi kapalit ng isa ang papel ng iba.
Tumutulong ang extinguisher/AED signs sa paghahanap ng kanilang lokasyon.|Ihiwalay ang equipment at evacuation signs.
Sa tatlong aktuwal,laging hawakan ng bare hand ang live part upang alamin ang sanhi.|Kailangan din ang safety conditions sa direktang pag-check.
ISO14001ay environmental-management standard.|Isa itong management-system standard.
Lahat ng used/recovered batteries ay walang voltage at puwedeng i-short.|Hindi kusang nawawala ang energy dahil bago o luma.
Magkaibang dimensiyon ang diameterφat radiusR.|Dalawang beses ng radius ang diameter.
Kasya ang terminal hole sa screw,kaya hindi kailangan ang conductor fit.|Matugunan ang saklaw ng parehong panig.
Piliin ang drill/end mill ayon sa edge position at gamit.|Itugma ang layunin ng makina at tool.
N/p ay simpleng negatibo/positibong charge lamang ng buong materyal.|Unawain nang hiwalay ang carrier at impurity.
Tama ang total,kaya puwedeng completed record ang held products.|Kailangan din ang state identification.
Magkaiba ang change na dini-delay ng basic on/off-delay.|Sundan ang timing ng on o off.
Isang dagdag failure,laging mas mataas ang rate kahit anong operating time.|Kailangan ang denominator ng rate.
Sa negative-resist concept,naiiwan ang exposure-hardened protective film.|Tiyakin ang film na iiwan ayon sa paraan.
Sa parehong frequency,mas maraming poles ay mas mababang synchronous speed.|Inversely proportional sa poles ang Ns.
Kahit pudpod ang ruler end,laging hindi nagbabago ang origin sa lahat ng uri.|Tiyakin ang istruktura at kondisyon ng reference point.'''.splitlines())
m.emit(1,'practical','''Resistor1kΩ,±5%tolerance. Ano ang marked range?|950～1050Ω|995～1005Ω|1000～1050Ω|500～1500Ω|5%ng1000Ωay50Ω;kaya950～1050Ω. Tingnan din ang ratings/test conditions.|Ginawang±0.5%ang±5%,isang digit na mali.|Inalis ang lower side na950～999Ω.|±50%ito,hindi specified±5%.
Hanapin saNs=120f/pang synchronous speed ng50Hz・6pole induction machine.|1000min⁻¹|3000min⁻¹|36000min⁻¹|600min⁻¹|120×50/6=1000min⁻¹;field speed ito,hindi guaranteed actual loaded rotor.|3000ay2poles sa50Hz,hindi6.|Divide6,hindi multiply para36000.|1000ang120×50/6,hindi600.
Walang load ang transformer secondary ngunit rated voltage ang primary. Angkop na pasya?|Walang load,kaya primary walang voltage.|May core loss;kaya hindi walang power o hazard.|Hawakan ang copper upang subukan.|Walang frequency condition.|May supply voltage sa primary kahit no-load.|May core loss mula changing flux;hindi nawawala ang primary voltage/danger.|Electric-shock risk sa paghawak ng energized winding.|Kaugnay ng frequency ang core flux;kaya sundin ang takda.
Normal ang electronics appearance ngunit posibleng walang static control sa handling. Ano?|Bare-hand terminals upang subukan.|Walang spark,kaya good nang walang kondisyon.|Alisin lahat ng packaging at iwan.|Huwag appearance lamang;check/identify ayon sa procedure.|Maaaring dagdagan pa ng static ang bare-hand touch.|Maaaring static damage kahit walang nakitang spark.|Nawawala ang static/ibang protection.|Maaaring hindi makita sa labas ang damage;gamitin ang history at specified inspection/hold.
Parehong failure count sa nakaraang taon ngunit kalahati ang operating hours. Paano ihambing?|Walang batayan,pinakamaikling replacement interval.|Same count,kaya tiyak parehong state.|Itapon records,huwag compare.|Isama ang operating hours/production at ibang conditions.|Hindi comparison o tamang replacement ang ungrounded shortening.|Sa kalahating oras,nagbabago ang failures per hour kahit parehong count.|Walang operating-condition comparison kung records wala.|Hindi counts lamang;tingnan ang paggamit,downtime,at repairs.
Hindi pa solid ang solder nang mapansin ang wire misalignment. Ano?|Hilahin nang malakas bago tumigas.|Walang cooling,ibaluktot ang katabi.|Huwag galawin,palamigin,suriin ang rework sa standard.|Shiny,kaya ship nang walang inspection.|Galaw habang tumitigas ay poor connection.|Force sa katabi bago cool ay naipapasa sa joint.|Cooling,saka inspect;approved rework at rejudgment.|Hindi shine lamang ang joint/internal quality.
Tugma ang relay coil voltage ngunit kulang ang contact capacity sa load. Ano?|Coil fits,kaya use agad.|SSR,kaya walang heat check.|Tiyakin ang device na pasok pati contact conditions.|Alisin ang load protection.|Hindi coil voltage lamang kung undersized contact.|May heat/cooling ratings din angSSR.|Iba ang coil/contact ratings;hindi shape/coil lamang ang load-switch fit.|Hindi nalulutas ng removed protection ang undersize;mas hazard sa failure.
May mungkahing gloves sa rotating drill-press work. Ano?|Cloth gloves sa rotating chips.|Check entanglement at specified PPE sa procedure.|Lahat ng gloves laging mas safe.|MayOJT,kaya omit safety.|Maaaring mahila pati glove sa chips.|Gloves maaaring hazard;itugma training/PPE sa tiyak na panganib.|Maaaring mahila sa rotation;hindi pareho sa lahat.|Kailangan pa rin ang procedure/PPE checks kahitOJT.
Same tool setting ngunit dimension change matapos material lot change. Ano?|Match4Mchanges kasama material at measurement conditions.|Operator lamang cause.|Gawing center ang recorded average.|Itapon lot records.|4M:tao,machine,material,method;tingnan ang actual/records sa change/result.|Hindi operator lamang dahil lot nagbago.|Hindi binabago ng record ang product/cause at nawawala reliability.|Walang matching change point/dimension kung lot record wala.
12piraso bawat kahon,5kahon,shipping paper54. Anong mismatch?|Less cushion fixes count.|Actual60vs54,difference6.|Tamang address,ignore difference.|Actual54rin,kaya match.|Hindi cushion ang product-count solution.|12×5=60;alamin ang6difference at itugma bago ship.|Hindi tamang count dahil address lamang.|Actual12×5=60,hindi54.'''.splitlines())
print('Authored40completeTagalogelectricalmock01questions')
