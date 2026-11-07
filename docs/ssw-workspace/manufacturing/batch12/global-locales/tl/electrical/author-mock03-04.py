from importlib.machinery import SourceFileLoader
from pathlib import Path
p=Path(__file__).parent;m=SourceFileLoader('tlem',str(p/'author-mock-helper.py')).load_module()
m.emit(3,'theory','''Stripping length ay item na tinitiyak sa connection at work standard.|Kailangan ang tagubiling angkop sa terminal/proseso.
Huwag alisin sa pagbasa ang nakikitang0.5mm sleeve line.|Pagsamahin ang sleeve/thimble values.
Laging I=V×R ang current ng ideal resistor.|Hatiin ang voltage sa resistance at itugma ang unit.
Madaling ulat kung konklusyon,saka target,oras,dami.|Linawin ang konklusyon,specific facts,at kailangang pasya.
Kahit spec-in,suriin ang trend na lumilihis sa isang direksiyon sa oras.|Hiwalay ding bantayan ang process stability.
Magkalapit sa connection diagram,kaya laging magkatabi sa actual.|Iba ang logical connection at physical layout.
Huwag tiyakin ang original resistor value sa nasunog na kulay lamang.|Kailangan ang original specification/model.
Walang static sa daliri,kaya tiyak na walang ICdamage.|Maaaring hindi nakikita ang damage.
Kapaki-pakinabang sa investigation ang oras/kondisyon ng abnormal sound.|Gawing traceable ang specific facts.
CPU ang display screen lamang.|Ihiwalay ang output at processing.
Sa self-hold,laging forever energized kahit open stop path.|Pinuputol ng stop ang buong holding path.
Huwag paulit-ulit reset ng protection na may amoy sunog habang unknown cause.|May worsening failure/restart danger.
Lahat ng cured resin ay maaaring same-state remold anumang ulit sa init.|Tingnan ang resin class/history.
Surface plate ay reference plane,hindi dimension display sa pagpatong.|Ihiwalay ang reference at meter role.
Sa deburring,hindi kailangan check kahit lampas ang hole diameter.|Nakasisira ng conformity ang sobrang cutting.
5S cleanliness ay isang discard at wala nang maintenance.|Kailangan ang pagpapanatili at habits.
Corrosive sign ay kaugnay ng damage sa metal/skin.|Ituring na hazard information.
PDCAAct ginagamit ang evaluation sa method/next plan.|Isama ang evaluation sa susunod.
Kg/N ay same quantity/unit kahit walang conversion conditions.|Ihiwalay ang quantities.
Technical-standard interpretation ay PSEproduct scope lamang,hindi equipment requirements.|Kinokongkreto nito ang equipment technical requirements,hindi PSEclassification lamang.
Transition fit ay maaaring clearance/interference ayon sa tolerances.|Tingnan ang tolerance-range relation.
Walang melting-point/process check kahit nagbago ang solder alloy.|May qualified conditions ayon sa alloy.
Sa same-voltage ideal resistors,mas maliitRmas malaking power.|P=V²/R sa parehong kondisyon.
Depletion layer ay vacuum hole na walang matter/charge.|Huwag ipaghalo ang kaunting carrier at walang material.
Sa binary logic,x+x=x.|Hindi ordinaryong addition ang OR.
P=NTlamang ay lagingW kahit walang conversion/2π.|P=2πNT/60ang min⁻¹conversion.
Isang collected number ay automatic predictive maintenance sa lahat.|Kailangan ang judgment/operation conditions.
SIbase ng thermodynamic temperature ayK,luminous intensity aycd.|Itugma ang pitong quantities/units.
Tugma secondary voltage,kaya unlimited load ang lahat ng transformer.|Sundin capacity/temperature ratings.
Piliin ang hacksaw/file nang hiwalay ang cutting/hand finishing.|Hacksaw sa cut,file sa hand finish at iba pa.'''.splitlines())
m.emit(3,'practical','''Caliper least0.05mm,main18mm,fraction0.45mm. Reading?|18.90mm|18.05mm|18.45mm|18.0045mm|Dinoble ang0.45mm.|0.05ang least,hindi fraction0.45.|18+0.45=18.45;hindi least reading mismo ang idinadagdag.|0.45ginawang0.0045,maling decimal.
Rotating workpiece,tool sa diameter/thread. Machine?|Milling|Lathe|Drill press|Surface grinder|Tool rotation ang milling,iba sa lathe.|Workpiece rotation sa lathe;tool sa milling;ihiwalay motions.|Rotating drill feed sa hole ang drill press.|Wheel plane finish,hindi turned diameter/thread.
Siliconn/pmajority carriers:anong pares?|n electrons,p holes|Parehong holes|Parehong electrons|n holes,p electrons|Majority types,hindi simpleng charge ng whole material.|Electrons angn.|Holes angp.|Baligtad ang correspondence.
Elementong temperature-dependent resistance?|CdScell|Varistor|Thermistor|Fixed resistor|Pangunahing light-resistance.|Pangunahing applied-voltage resistance,iba sa temperature.|Temperature/resistance;check rating/characteristics separately.|Specified resistance,hindi pangalan ng temperature-sensing element.
Inspection ng off equipment na may capacitor. Ano?|Specified residual-charge procedure.|Basta short sa screwdriver.|Touch all kaagad dahiloff.|Passive,kaya no shock.|Maaaring charge afteroff;sundin isolation/charge measures.|Unauthorizedshort,discharge/spark risk.|Maaaring charge afteroff.|Passive≠no stored-charge shock.
Device na mainly semiconductor switching,walang moving contacts?|Contactor|Reed relay|SSR|Ordinary relay|Moving contacts,iba saSSR.|Magnetic contact,hindi semiconductor-only.|Mainlysemiconductor;checkoffleakage/heat kahit no contacts.|Electromagnetically moving contacts.
ClassF155°Cexample. Interpretation?|All equipment ambient155°C.|Allmaterial melt155°C.|Conductor155mm².|Conditional insulation class,iba sa product ambient.|Iba insulation/whole equipment ambient.|Hindi allmaterial meltingpoint.|Temperature,hindi area.|Material/system classification,hindi all-product environment permission.
Continuous sensorvoltage to computer number. Function?|Low-passfilter lamang|A/D|Amplification lamang|D/A|Frequency selection,hindi digitizing.|Analog-to-digital;D/Areverse.|Amplification notencoding.|Digital-to-analog reverse.
50Hzsine period?|20s|2ms|50ms|20ms|0.02sginawang20s,malingmilliseconds.|1/50=0.02,hindi0.002s.|Hindi50frequency asms.|T=1/50=0.02s=20ms;ihiwalay reversal/cycles.
IdealDC24Ωat12V. Power?|0.5W|288W|36W|6W|0.5Acurrent;times12V=6W.|V×R,hindiV²/R.|Hindi sum/difference12/24;144/24.|P=144/24=6W;I0.5A,magkaiba angvalues.'''.splitlines())
m.emit(4,'theory','''Itugma ang crimp die profile sa terminal type.|Specified terminal at angkop na tool ang kombinasyon.
Pantay na force kung pinakamadiin bawat sukat.|Excess force ang deformation/variation.
Nakuha ang current,kaya walang supply/resistor rating check.|Iba ang calculation at real compatibility.
Kulay lamang ang nakita,kaya huwag proven burning cause ang sabihin.|Ihiwalay ang observation at inferred cause.
Histogram laging chronological at upper-control-line monitoring.|Iba ang purpose sa time-series control chart.
Sa maraming sheets,itugma ang device symbols/terminal numbers.|Tiyakin ang ID at reference.
Same resistance,kaya ignore power/temp ratings.|Tingnan pati ibang specifications.
Static control pagkatapos lamang ng lahat ng trabaho.|Mag-prevent bago handling.
Maaaring may charge ang capacitor kahit poweroff.|Kailangan residual-energy check at actions.
Binary1101ay decimal1101rin.|8+4+0+1=13.
Non-latching relay/returned start input ang assumptions ng no restart sa power return.|Tiyakin ang circuit/inputstate.
Parehong unlimited storage lamang ang solar/storage batteries.|Huwag sa pangalang battery ipaghalo ang roles.
Iba ang FRPelectrical properties sa glass/carbon fibers.|Fiber,resin,direction,quantity ang properties.
Heightgauge sa height/marking mula reference plane.|Itugma ang dimension at instrumentpurpose.
Positive-positive laging attraction,positive-negative repulsion.|Ihiwalay ang force direction sa sign.
Fixed item sa threefixed ay pagtatakda ng ilalagay sa lugar.|Linawin ang bagay.
Tiyakin ang local exhaust bago chemicalwork.|Kailangan vapor-exposure prevention.
Anyoldstandard puwede basta samefactory.|Tingnan ang applicability/revision.
m/Mlaging same multiplier bilangprefix.|Panatilihin ang case.
Huwag lumang itemcount lamang ang current legal scope.|Tiyakin ang time/scope conditions.
Lahat LED/photodiode ay lightemission lamang sa samedirection.|Ihiwalay ang light roles/arrows.
Residuecleaning ayon sa flux at productspec.|Tiyakin ang type/processconditions.
W/Whsamequantity kahit walang time.|Ihiwalay ang consumption rate/total.
FETgate/BJTbase iba ang names/drive.|Tingnan ang type/datasheet.
x・0=xatx+1=0lagi.|Gamitin angAND/ORat0/1laws.
Starting-reduction ratios may connection/equipment assumptions.|Kailangan windingfit,protection,approval.
PPMlaging same number sa percentage.|Iba conversion multipliers.
Mol angSIbase ng amountofsubstance.|Ihiwalay mol sa derived resistanceunit.
Iba ang polarity/missing-parts at soldercrack checks.|Ihiwalay ang maraming assembly items.
Chamfering ay unlimited enlargement ng buong hole lamang.|Panatilihin edge shape/dimensional requirements.'''.splitlines())
m.emit(4,'practical','''Standard4N·m,toolibangunit. Ano?|Checkunits/conversion/tool applicability,bago set.|Alisinwasher para easy.|Number4lamang.|Maximum sa pakiramdam.|Value/unit angtorque;hindi same number sa differentunit.|Changesconfiguration,hindi unitsolution.|Maaaring hindi4N·mang4sa ibangunit.|Excess torque/partdamage risk.
Kakaibang vibration. Centralreportinfo?|Blame lamang|Uninvestigated cause lamang|No record,sabihing normal|Equipmentnumber,time,operatingstate,observed vibration|Walang investigationfacts sa blame.|Hinalangcause bilangfact,malingmessage.|Observedabnormal,kaya hindi unrecordednormal.|Ihiwas facts/hula;safety/report ayonprocedure.
CoilK3atmalayongcontactK3. Paano?|EraseIDs,appearancewiring.|NearestK2asK3.|SameequipmentID,tracebehavior.|Malayo,kaya unrelated.|IDlost,cannottrace.|ID,hindi proximity;huwagpalitanK2.|Developeddiagram separatescoil/contact;ID/reference.|Sameequipment maaaring hiwalay parafunction.
IdealtransformerN1=400,N2=800,V1=24V. V2?|24V|48V|1200V|12V|Unequalturns,ratio not1.|Secondary2times,kaya48V;capacity/lossnotfromratiolamang.|Sumturnsasvoltage,hindi ratio.|Inverse;moresecondary,stepup.
ReplacementtransistorB/C/Edifferentorder. Ano?|Samepackage,ignoremaxrating.|Threelegs,anyorientation.|RandomB/Eexchange.|Checkmodelpinout/ratingfit.|Underratingdamagekahitsamepackage.|Pinorder modeldependent.|Differentterminals,notarbitrarysame.|Shapealone≠compatible;electrical/pinsboth.
3defects/20000shipped. PPM?|15PPM|1500PPM|0.00015PPM|150PPM|3/20000×100000,hindi million.|Ten timeslarge.|Ratio0.00015,thenmillion.|3/20000×1000000=150;matchcountdefinition/period.
App equal-points:theory20/30,practical5/10. Judgment?|Theorymet,practicalbelow,nooverallpass.|25total,lagingpass.|5/10=50%meets60%.|Theorypass,sapat.|Required20/30at6/10separately;5fails. Not guarantee of unpublished officialweights/correctcount.|No totalcompensation.|50%below60%.|Practical independently6/10.
Stranded2.0mm²,tool“solid2.0mm”only. Bago start?|Same2.0,use.|Checktoolapplicability sa strandedarea/terminal.|Crushterminalwithpliers.|Cuthalfconductor.|Solid diameter≠strandedarea.|mm diameter,mm²area;samenumbernotfit;matchwire/terminal/tool.|Pliersnotguaranteedcrimpshape/pressure.|Cutstrandslosesarea/performance.
Dialzero sa reference,susuriin comparisondeviation. Need?|Pointermoves,noreference record.|Otherface/pahilis bawatisa.|Sameface,contactdirection,plungeconditions.|Dirtysurfaceplate.|Unknownreferencecannotlinkdeviation/size/spec.|Extra measurementdifference.|Comparisondependsreference/posture;elsecannotseparateproduct/conditiondifference.|Dirtchangesreference/posture,error.
SupplierISOcertificate. Productinspection?|Checkcertscope/productneeds,do requiredtests.|Ignorestandardversion.|Automaticallproductpass.|Stopinspectionwithoutreading.|Organizationcert≠individualconformity;scope/needsseparate.|Versionneeded.|Notautomaticall-itempass.|Couldfailcontract/productneeds.'''.splitlines())
print('Authored80furtherTagalogelectricalmock03–04questions;total160')
