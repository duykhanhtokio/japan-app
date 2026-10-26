from importlib.machinery import SourceFileLoader
from pathlib import Path
p=Path(__file__).parent;m=SourceFileLoader('tlem',str(p/'author-mock-helper.py')).load_module()
m.emit(5,'theory','''Maaaring hindi sapat ang tipak na solder sa malamig na joint.|Kailangan ang wastong joint heating at wetting.
Kahit parehong pangalan,iba ang outside at inside measurement.|Tiyakin ang modelo,range,at gamit.
s/div sa horizontal axis ay voltage bawat div.|Horizontal ang time,vertical ang voltage at iba pa.
Unknown terminal number:kabit sa pinakamalapit na hula,saka report.|Lutasin ang hindi malinaw bago magtrabaho.
Iba ang defect count at defective-product count kung maraming defect sa isa.|Itakda kung ano ang isang bilang.
Lahat ng contacts ay pareho ang switching direction sa actuation.|a closes,b opens;isama ang state.
Magkaibang current sa series resistors kahit walang branch.|Pareho ang steady current sa iisang landas.
Huwag ituring na same sa specified ESDbag ang ordinaryong clear bag.|Tiyakin ang uri/compatibility ng packaging.
Parehong capacitance,kaya decoration lamang ang voltage/polarity.|Itugma ang maraming specification conditions.
Barcode beep lamang ay hindi garantiya ng processing/display update.|Tiyakin ang facts sa bawat functionstage.
Umiikot,kaya automatic ang position,speed,force requirements.|Ihiwalay ang control targets at specification.
Kailangan ang conversion/compatibility ng solarDCsaACequipment.|Ihiwalay ang generation atDC/ACconversion.
Maaaring kamukha ang ibang materials,kaya match loading records.|Hindi laging makikita sa appearance ang material error.
LCR ay voltage/DCcurrent lamang,hindi capacitance/inductance.|Sinusukat nito ang inductance,capacitance,resistance,at iba pa.
Sa same point-charge conditions,distance2times,force1/4.|Inverse square ng distance.
5Ssort:itapon lahat ng unknown nang walang pahintulot.|Panatilihin ang identification/assigned checks.
Lahat ng walang injury ay irrelevant sa safety.|Ibahagi pati accident precursors.
QCfrequency ang nagtatakda ng inspection timing.|Basahin kung ano,kailan,paano kokontrolin.
1mm²=10⁻³m²;same length conversion.|Square ng length factor ang area.
Ihiwalay ang issuer/scope ng industryJEM/JEITA.|Magkaiba ang issuer/field.
Hindi kailanman malayo ang coil/contact sa drawing.|Maaaring hiwalay para madaling basahin.
Sobrang init/force ay maaaring land damage.|Sundin ang thermal/mechanical limits ng part/board.
50Hzperiod ay50ms.|1/50segundo=0.020segundo.
Iba ang switching-time characteristics at maxratings.|Hindi substitute ng limits ang characteristics.
NOT(x・y)=(NOT x)・(NOT y)sa lahat.|Nagpapalit angAND/ORsaDeMorgan.
Current2times,copper loss laging kalahati.|Sa sameR,I²Rkaya4times.
Hindi laging pareho ang no-stacking at stack-limit.|Sundin ang labels/specification.
Hall sensors para sa flux-density detection.|Gamit ang EMFna may relation sa current/field.
Environmental test appearance lamang,no temp/humidity/vibration.|Ihiwalay ang applied environment at appearance checks.
Ihiwalay ang magnetic properties ng electrical steel/permanent magnet.|Iba ang core loss/permeability at permanent retention requirements.'''.splitlines())
m.emit(5,'practical','''Ideal60Ωparallel120Ω. Equivalent?|180Ω|40Ω|90Ω|7200Ω|Series sum ang180.|1/R=1/60+1/120=3/120;kaya40Ω;mas mababa sa60Ωbranch ang check.|Average lamang,hindi reciprocal sum.|Kailangan divide by sum,bukod product.
May protective film pa matapos subtractive etch. Next concept?|Strip sa takda,iwan needed conductor.|Laging ship kahit no parts.|Allchemicals mix kahit method.|Tunawin lahat needed conductor.|Sa negative example,huling alisin ang film;actual strip/wash sa material/process specs.|Omitted next stages/inspection ang unconditional shipping.|May reaction risks/process conditions;kaya hindi random mix.|Mawawala ang intended pattern.
2.4kΩsaΩ?|2400Ω|0.0024Ω|2400000Ω|24Ω|k=1000;kaya2.4×1000=2400.|Multiply1000,hindi divide.|Million,hindi k1000.|Hindi10ang k,kaya hindi24.
Isang andar ng finished product,kaya lifespan guarantee? Pasya?|Insulation resistance/withstand same.|Ihiwalay one-functioncheck at required reliability.|Appearance guarantees all environment.|Oneoperation all-life guarantee.|Iba purpose/applied conditions.|Iba ang function/environment/reliability/safety tests;hindi oneoperation ang life.|Hindi appearance ang temp/humidity/vibration resistance.|Hindi required-period reliability ang onecheck.
Induction nameplate vs actual speed. Synchronous?|Frequencyonly,no poles.|Same actualshaft kahit fullload.|Actualrotor only varying load.|Rotating-field speed,iba sa loaded rotor.|Ns=120f/p,poles din.|May slip,kaya hiwalay shaft/field.|Field frequency/poles,hindi actualshaftalias.|Huwag actual loaded-speed guarantee ang formula.
IdealACprimary120V,N1=600,N2=150. Secondary?|480V|750V|30V|90V|Inverse ratio;fewer secondary,kaya down.|Turns sum notvoltage.|120×150/600=30V;idealratio,real rating/connection separate.|Proportionalratio,hindi turnsdifference subtraction.
Same windingR,current2times. CopperI²Rratio?|4|Hindi nagbabago|2|1/2|Square:(2I)²R=4I²R.|Currentchanged,kaya loss.|Square4,hindi2.|FixedR,currentincrease increases,hindi half.
Third-angle right view saan sa front?|Itaas|Ibaba|Kanan|Kaliwa lamang|Topview ang itaas.|Hindi rightview location.|Right sa kanan,top sa taas;checkprojection symbol.|Firstangle confusion;thirdright sa kanan.
Ibang grease brand ang dumating. Ano?|Doblequantity.|Checkspec/mixingpermission;noapproval,no mix.|Kamay sa movingpart para feel.|Samecolor,mix.|Morequantity notcompatibility solution.|Type,fit,quantity matter;mix/overgreasing defects;keep safety.|Entanglement sa operatingparts.|Samecolor notsame baseoil/thickener.
Spec19.90～20.10mm,actual19.80,20.00,20.20mm. Pasya?|Averagecenter,allpass.|Averageonlyrecord.|Controlchart automatic pass.|Average20.00,but twoends outside.|19.80/20.20out kahit center.|Averagehidesindividualfailures.|Processmonitoring,hindi specchange.|Individualspecvsaverage;threepoints notwholecapability guarantee.'''.splitlines())
m.emit(6,'theory','''Walang epekto sa solder quality ang position correction habang solidifying.|Hawakan,palamigin,suriin ayon sa standard.
Sa0.01mmscale,thimble17ay17mm.|Idagdag ang17×0.01mm.
Period ang oras bago maulit ang same state/same direction.|Piliin ang tamang corresponding points.
Huwag sabihing zero ang stock sa hindi pa nasuring imbakan.|Ihiwalay ang confirmed scope at unknown.
Pareto ascending only at no cumulative ratio.|Gamit sa pagkilala ng maraming categories.
Tingnan ang legend/standard kung may oldsymbols.|May standard/version differences.
Same endpoints ng parallel branches ngunit voltage laging iba ayon saR.|Common ang endpoint potential difference.
Parehong matugunan ang ESDcontrol at human-shock prevention.|Iayon ang ESDsa safety.
Same structure/gamit sa lahat ang coil/capacitor.|Iba ang structure/properties.
Hindi kailangan ihiwalay ang before/after mounting sa “board.”|Linawin ang manufacturing stage.
Feedback ang detected state na ibinabalik upang itama ang command difference.|Tiyakin ang detection/command relation.
Outage usability ay depende sa function/conditions.|Tingnan functions,capacity,wiring,at iba pa.
Nominal hexbolt diameter ay lahat ng tool across-flats.|Ibang bahagi ang sinusukat.
May kinalaman ang reference junction,compensation wire,polarity sa thermocouple.|Tiyakin ang measurement system.
Movingwire,laging sustained induced current kahit open circuit.|Ihiwalay ang EMFat circuit current.
Bagong work,kaya recheck hazards/training.|Tiyakin ang changed-duty conditions.
OSHMS oneplan,no postimplementation results.|Tuloy-tuloy na management cycle.
Maaaring kasama sa abnormalresponse ang hold,report,affected scope.|Trace targets/scope upang maiwasan ang outflow.
pHsame dimension ng density,kg/m³unit.|Huwag ipaghalo physical quantity/index.
Export:match country/contract standards.|Tiyakin ang destination/differences.
Ladderpicture unconditional actual switch state.|Ihiwalay input,logic,output.
Thermistor zero-resistance wire sa lahat,kahit temperature.|Gamit ang temperatureproperties sa purpose.
Idealcapacitor sine current leads voltage.|Ihiwalay idealL/Cphase.
MemoryICatregulator same replacements lahat.|Ihiwalay storage/powerstabilization.
May auto-return/maintained pushbutton types.|Tiyakin ang component type.
Colorless/odorlessSF6,kaya free atmosphericrelease.|Hindi smell ang safety/environment check.
Warehouse name lamang,hindi allshippingPPMpass.|Tiyakin target,period,contract.
LCRneverfrequencydependent,kaya no settingrecord.|Itugma part/meter conditions.
Lesspackaging kailangan pa rin protective requirements.|Huwag costlamang ang dahilan sa lessprotection.
Iba ang remanence at coercivity ng permanent magnet.|Tiyakin pareho ayon sa gamit.'''.splitlines())
m.emit(6,'practical','''Solarcell,battery,conditioner:anong pares?|Lahat same storage|Generation,storage,DC/ACconversion|Storage,generation,machining|Drawing,packaging,generation|Iba ang tatlong roles.|Iba ang generation/storage/conversion;outage fit ayon system.|Solar generation,battery storage;reverse ito.|Energy roles,hindi drawing/packing.
x=0,y=1. NOT(x・y)?|0|2|1|Laging katuladxna0|AND0lamang,nawalaNOT.|Binary0/1,hindi2.|AND0,NOT1;NOTxORNOTy=1rin.|NOTapplied,kaya hindix0.
Cylinder correctdirection ngunit slow. Info?|Unauthorizedmaxpressure.|Samequantity angforce/direction/speed.|Irecord flow at ibang speedchecks.|Directionvalvefault agad.|Risk overrating,hindi flowcheck.|Iba angforce-pressure,speed-flow,direction.|Flowrelatedspeed,hindi faultproof;separateobservations/approvedinspection.|Hindi enough facts para directionfault.
Defects labels12,scratches6,missing2. Top2cumulative?|60%|80%|18%|90%|12labels lamang60%.|18sa20,hindi16.|18count;18/20×100angratio.|Total20,top18=90%;criticalrareseparate.
Extra screws hindi match records pagkatapos. Ano?|Itapon nang palihim.|Checkcount/insidehousing;report missing/mix.|Recordchange lamang.|Silenthandover.|Hidden discard preventsinvestigation.|Mismatchpossiblemissing/mix;matchactual/records,don'thideunknown.|Hidephysicalissues angrecordonly.|Walang info sa silenttransfer.
Tap biglang mabigat. Ano?|Huwag pilitin;checkpilot/tool/chips sa procedure.|Alisinfixture.|RemovePPE,walisin sa kamay.|Extensionpipe para force.|Forcedresistance maybreak/threaddefect;checkconditions,takdangaction.|Movingworkpiece losesaccuracy/safety.|Cutsrisk,againstprocedure.|Forcedtorquebreakstap.
Handfinish smallroundhole. Tool?|Largestflatfile,pilit.|Strongreturnonly.|Matchcrosssection/size sa curve,checkretainedface.|Fileall,no dimensioncheck.|Bigflatdoesn'tfit,hugisdamage.|Againstnormalcutdirection.|Matchshape/size/direction;notfits-only,retainedshapealso.|Overcut/shapeerrornotdetected.
PSEdevice sa differentvoltage equipment. Ano?|PSEallvoltagefit.|Separaterating/purpose/connectionchecks.|Shapeasqualification.|Removeground,lagingworks.|Needrating,notPSEalone.|Notalluses/voltages/workerqualificationguarantee.|Productmark≠workerlicense.|No voltagefix,lossshockprotection.
0.25mmtoμm?|250μm|25μm|2500μm|0.00025μm|1mm=1000μm;0.25×1000=250;matchprefix.|Ten timessmall.|250,hindi2500.|Multiply1000,hindidivide.
Zero-centered symmetricwave6divpeak-valley,2V/div. Amplitude?|24V|12V|3V|6V|Doubled12peak-valley,inverseamplitude.|12peak-valley,half amplitude.|3div×2Vneeded.|Peak-to-peak6×2=12V;symmetryhalf=6V.'''.splitlines())
print('Authored80furtherTagalogelectricalmock05–06questions;total240')
