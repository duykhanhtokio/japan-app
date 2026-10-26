from importlib.machinery import SourceFileLoader
from pathlib import Path
p=Path(__file__).parent;m=SourceFileLoader('tlew',str(p/'author-weekly-helper.py')).load_module()
m.emit(10,'''IV/KIVsa same shelf. Bago wiring,ano ang match?|Structure,rating,area,destination,specified part.|Same color,same item.|Same-numbermm/mm².|Fits screw,no wire check.|Hindi name lamang;spec/instruction.|Color,hindi identity.|Length/area iba.|Wire kailangan din terminal compatibility.
Flux product nagbago. Residue?|Same solvent lahat.|Shiny,no inspection.|Check cleaning need/method sa specs/approved process.|Lead-free,lahat poor quality.|Iba solvents/conditions.|Hindi onefeature ang lahat.|Flux-dependent requirements.|Hindi alloy class ang quality.
Same-shape thermistor/fixed resistor. Replacement?|Same now-value,laging puwede.|Passive,no heat/charge care.|Check temperature characteristics,rating,purpose.|Alltwo-terminal same.|Iba temperaturebehavior.|Passive≠nohazard.|Kailangan role/conditions match.|Hindi terminalcount ang function.
Rotating workpiece,fixed tool cuts diameter. Machine?|Milling lamang|Allmachines tools rotate|Lux meter|Lathe|Milling rotates tool.|Iba sa machine.|Light meter,hindi machining.|Lathe rotates workpiece.
Same material/temp,length2,area3. Rratio?|6|2/3|3/2|1/6|Hindi multiplied area.|Proportional length,inversearea.|Inverse ratio.|Reversed length factor.
25Hzperiod sa ms?|25ms|40ms|0.04ms|400ms|Frequency numeral as period.|1/25s=0.04s=40ms.|Wrong s-ms.|One digit big.
18V,40Ωseries(120Ωparallel240Ω). Total current?|0.045A|1.5A|18A|0.15A|Allthree series.|Decimal one off.|Ignored totalR.|Parallel80+40=120Ω;18/120=0.15A.
Stranded area fits,but terminal hole/screw not. Ano?|Force dahil area fits.|Basta thinner screw.|Specified terminal fits wire at screw.|Enlarge hole noapproval.|Mount fit affects quality.|Unilateral designchange.|Both sides mustfit.|Approval sa machiningchange.
Malaking bend agad sa bagong solder. Check?|Joint/land damage inspection at approval.|Shiny,no inspection.|More solder curesall.|No movementrecord.|Cooling motion/force sanhi.|Shine≠quality.|Hindi amount lahat.|Record facts for action.
NCwithautomatic toolchange. Basic description?|NCluxunit.|NCnointerference.|Lathe always toolrotation.|Machining-center feature.|Numerical control.|Kailangan initialchecks.|Workpiece normally rotates.|Ihiwalay NC/autochange relation.
IdealDC24V120Ωpower?|4.8W|0.2W|2880W|4.8Wh|I=0.2A,P=24×0.2=4.8W.|Current as power.|V×Rnotpower.|Wpower,no time.
Idealcoil-only sine current vs voltage?|Leads|Lags|Samewavealways|Samephysical quantity|IdealC.|IdealLphase.|Iba rin saRin-phase.|Iba quantities/units.'''.splitlines())
m.emit(11,'''Pn depletion layer?|Hole,wala atoms/fixedcharge.|Proofn-typewhole negative.|Sameasmetalinside.|Regionfewmobilemajoritycarriers/internalfield.|Hindi vanished matter.|n/pmajority distinction.|Specialsemiconductorjunction.|Ihiwalay carriers/field.
Gatepin assumed BJTbase order. Ano?|Threeterminal same.|CheckFETtype,pins,drive,rating.|hFEsetsall maxvoltage.|ColorselectIGBT.|Shapecount≠arrangement.|Type-dependentcontrol/pinrole.|Gain≠maxrating.|Color≠spec.
Fullscale100,indication64,5Vrange. Reading?|64V|12.8V|3.2V|0.32V|No rangeconversion.|Inverseratio.|64/100×5=3.2V.|Onedigit small.
Planned32,done25,held2,unstarted5. Handover?|Identifyrecord states/counts/unfinished.|All32done.|Mixheld/good.|Deleteunstarted5.|Tracebreakdown/state.|False state.|Preventmixing.|Actual/record mismatch.
Binaryx+x・y simplified?|x|y|x・y|NOT x|Absorptionx.|Mismatchx=1,y=0.|Mismatchx=1,y=0.|Not sameasnegation.
SSROFFbefore replacement:understanding?|Touch all terminals.|Checkleakage/residualvoltage,spec/isolation.|AllSSRmechanicalfullopen.|Contactoralwaysshortprotection.|Off≠novoltage.|Ihiwalay output/safeisolation.|Mainlysemiconductor.|Switch/protection separate.
Basic3son-delay,input2s. Output?|FirstON3safteroff.|ImmediateONalways.|Inputshorterthansetting,noON.|Allmodelsholdshortinput.|Confusedoffdelayanddirection.|Ignoreddelay.|Basicondelayassumption.|Holdseparatespec.
p-typemajoritycarrier?|Metalfragments|Allphosphorusatoms|Voltageparticle|Holes|Notcarrier.|Phosphorusdonor,n-type.|Voltagenotparticle.|p-typeholesmajority.
Periodicgeneration vs extractsignalfromreceivedwave?|Logistics/grease|Oscillation/demodulation|Bothpowerstabilizationonly|Demodulation/oscillation|Notcircuitroles.|Differentpurposes.|Iba sa supportingpower.|Reversedroles.
DMMmanualhasACcurrentrange. Relationtobook?|Ignoremanual,neverpossible.|Functionmeansallvoltagesafe.|Range,freeconnection.|Notalltestersincapable;checkmodelterminals/rating/procedure.|Modelsdiffer.|Safetyratinglimits.|Specifiedconnection.|Modeldifferences/safety.
EquivalentNOT(x+y)?|(NOT x)+(NOT y)|x・y|(NOT x)・(NOT y)|x+y|Changednegationscope.|Notallinputsequal.|DeMorgan:negatedOR=ANDofnegations.|Nonegation.
Basicoff-delay,inputOFFat4s,setting2s. OutputOFFtime?|6s|2s|4s|ForeverONalways|4+2=6s.|Ignoredstarttime.|Ignoreddelay.|Holdisotherspec,notbasic.'''.splitlines())
print('Authored24furtherTagalogelectricalweeklyquestions;total132')
