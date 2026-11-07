from importlib.machinery import SourceFileLoader
from pathlib import Path
p=Path(__file__).parent;m=SourceFileLoader('tlem',str(p/'author-mock-helper.py')).load_module()
m.emit(2,'theory','''Kung natanggal ang cover,walang epekto sa connection quality ang putol na strand.|Inspection target ang conductor damage;hindi stripping success lamang ang pass.
Malapit sa tolerance boundary,kaya puwedeng i-round sa pass side sa record.|Panatilihin ang actual value at judgment procedure.
8mAay0.008A sa pormulang A ang unit.|1A=1000mA.
May inspected label,kaya unconditional ignore ang susunod na abnormality.|Hindi label lamang ang guarantee ng kasalukuyang pass.
Control limits para sa monitoring,spec limits para sa product requirements.|Huwag pag-isahin ang dalawang limits.
Hidden lines ay hugis ng karaniwang hindi nakikitang bahagi.|Basahin ayon sa drawing rules at line purpose.
Gold tolerance sa ordinaryong four-band ay laging±50%.|Tiyakin ang correspondence ng marking system.
May iba-ibang layunin ang Zener at ibang diode types.|Tiyakin ang uri at specification.
Predictive maintenance ang pasya mula vibration/temperature condition.|Ihiwalay ang monitoring sa tugon matapos failure.
AM,FM,PMay pare-parehong carrier-amplitude change lamang.|Ihiwalay ang quantity na binabago sa modulation.
Sa basic self-hold,parallel sa start ang sariling relay contact.|Ipinagpapatuloy ng contact path ang energization.
Isang wiring breaker ang unconditional protection sa lahat ng leakage/shock.|Hiwalay na piliin ang kailangang protection functions.
Keep-dry sign ay guarantee ng laman kahit paulanan.|Handling conditions ang ipinapakita ng sign.
Maaaring difference mula reference ang dial-gauge indication.|Tiyakin ang division at reference.
Maaaring piliin ang maliit na needle file ayon sa detail shape.|Protektahan ang iiwan at unti-unting tapusin.
Hindi alam ang tool ngunit malapit deadline,kaya malayang subukan.|Tiyakin ang compatibility at permission.
Pareho ang container color,kaya puwedeng ibang-product SDS.|Ibang produkto,maaaring ibang hazards/handling.
Tiyakin ang inspection conditions at denominator sa improvement rates.|May epekto ang denominator at comparison conditions.
MayJIS,kaya walang accuracy check matapos mahulog.|Hindi unconditional guarantee ng present state ang mark.
Hiwalay ang PSE type at installation/worker requirements.|Magkaiba ang product system at installation/duty.
Huwag parehong order basahin ang roughnessμmat lengthmm.|Iba ang quantity requirement at unit.
Trapezoidal thread para sa fastening lamang,hindi machine feed.|Bahaging kaugnay ng machine feed at iba pa ito.
Sa parehong material/temp,Rproportional length,inverse area.|Gamitin angR=ρℓ/S.
Phosphorus sa silicon ay p-type na holes ang majority.|Phosphorus donor:n-type/electrons;boron acceptor:p-type.
Walang anumang epekto ang mahabang trabaho sa experienced worker.|Sundin ang break management at iba pa.
Ns=120f/pay synchronous speed ng rotating field.|May slip sa aktuwal na induction speed.
Lahat ng “hoshu” sa lahat ng standard/site ay post-failure repair lamang.|Iwasan ang general terms;basahin ang tiyak na gawain.
Iba ang target ng exposed unwanted-copper etch at residual-film strip.|Protektahan at iwan ang needed copper pattern.
Parehong shaft torque at2beses actualrpm,kaya2beses mechanical power.|Proportional sa produkto ngN/TangP.
Kahit tanggal handle,parehong safe kung mahigpit ang kamay sa dulo.|Tiyakin ang tool integrity at injury prevention.'''.splitlines())
m.emit(2,'practical','''Hindi na alam ang chemical name matapos ilipat sa lalagyan. Ano ang gagawin?|Amuyin,hulaan,ihalo.|Itigil ang paggamit at tiyakin ang ID/SDS sa responsable.|Hawakan ang kaunti nang walang PPE.|Mukhang tubig,kaya sa drinking container.|Smell/mixing ay maling ID/harmful-reaction risk.|Hindi mapipili ang hazard measures kung walang ID;tingnan ang label/docs,hindi hula.|Kahit kaunti,skin damage;huwag hawakan ang unknown chemical.|Maaaring clear hazardous liquid;drinking container ay accidental ingestion.
Basic on-delay5s,input off matapos3s. Output?|Laging5sonpagkataposoff.|Hindi aabot sa setting,kaya hindi on.|Agad on sa input.|Holdonafter3s kahit input.|Timing mula sustained input,hindi off-hold time.|Basic input mustcontinue5s;hiwalay ang retention ng modelo.|Maydelay,kaya hindi sabay.|Offsa3sbago5s,kaya nawawala ang kondisyon.
Tamang product/count,maling customer address. Bago ship?|Ipadala dahil tamang laman.|Dagdag cushion.|Itago ang partnumber sa label.|Stop,itugma actual/paper/address,correct.|Hindi tamang customer,kaya kulang shipping conditions.|Shock protection,hindi address fix.|Hindi corrected ang address at sira ID.|Kasama sa logistics ang address;hindi box strength/count ang lunas.
IdealDC6V,desired2mA. Resistance?|12kΩ|0.333kΩ|3Ω|3kΩ|6×2mA,hindiV/I.|V/I,hindiI/V;itugma units.|2mAginawang2A,kaya1000difference.|R=6/0.002=3000Ω=3kΩ;convertmAtoA.
0.5ms/div,8divperiod. Frequency?|250Hz|0.25Hz|4Hz|4000Hz|T=0.5×8=4ms=0.004s;f=1/0.004=250Hz.|4msginawang4s.|4msperiod,hindi4Hz.|Reciprocal0.004say250,hindi4000.
0.01mmmicrometer,sleeve8.5mm,thimble17. Dimension?|8.67mm|8.17mm|10.2mm|8.517mm|8.5+17×0.01=8.67mm;ihiwalay sleeve0.5atthimblemultiplier.|Nakaligtaan ang0.5.|17×0.1ngunit0.01angdivision.|17divay0.17,hindi0.017mm.
Samevolume material mass3timeswater. Specificgravity?|1/3kg|3kg/m³|3|3kgkahitvolume|Ratio3,hindiinverseokg.|Densityratio,hindi densityunitkg/m³.|Samevolume,kaya massratio3,dimensionless;walang mass/densityunit.|Samevolumecondition;kaya hindi3kgmass.
Scale1:2,drawingwritten80mm. Manufacturelength?|160mm|80mm|Papermeasurementonly|40mm|Hindi inverse-scale multiplication sa written.|Drawing size lamang ang scale;written80mmanggawin.|Printscale affects ruler;kaya written anguna.|Reapplying scale giveshalf ngspecified80.
Actual600min⁻¹,torque3N·m,P=2πNT/60. Approxoutput?|1800W|30W|188W|11310W|Kulang angular conversion/2π;humigit-kumulangsampungbesesmalaki.|600min⁻¹=10s⁻¹,kaya2π×10×3≈188W.|2π×600×3/60=60π≈188.5W;ihiwalay input/shaft dahil losses.|Hindi hinati sa60para rpm-to-second.
Sameshaft/holenominal,ibang tolerances. Fitneeds?|Hole toleranceonly|Nominalnumberonly|Combination ng both allowable sizes|Shafttoleranceonly|Kulang shaft sizes sa min/maxclearance.|Hindi nominal angmax/minclearance/interference.|Clearance/interference/transition from combination,hindi nominalmatch.|Kailangan din holelimits parafit.'''.splitlines())
print('Authored40furtherTagalogelectricalmock02questions;total80')
