import json, pathlib, hashlib
base=pathlib.Path(__file__).resolve().parents[1]
out=pathlib.Path(__file__).resolve().parent
notes='''Induced voltage is perpendicular to BOTH current and magnetic field, not merely one.
Right-angle relation between directions is retained.
Magnetic-field quantity and gaussmeter measurement both retained; source definition itself is broad.
Coil magnetic-flux/current relationship retained, without invented units or proportionality.
Charge-storage capability retained.
Relative lead/lag between AC waveforms retained, not frequency difference.
Illuminance at receiver retained, not source luminous intensity.
Conversion from light to electrical information retained.
Receives the light under measurement, not an emitting part.
One resistance-measurement method mentioned by lesson, without claiming universal applicability.
Resistance derived from measured voltage AND current retained.
Instrument/source/wiring/connections assembly retained.
Simultaneously usable signal input count retained.
Frequency range linked to ability to observe fast signals retained.
Sampling count PER SECOND retained.
Capacity for storing acquired data retained.
Different metals and thermoelectric EMF temperature sensing retained.
Reference-side junction in EMF temperature reading retained.
Specified lead TYPE connecting thermocouple and instrument retained; not any wire.
Protective covering of conductor retained.
Individual thin wires making stranded wire retained.
Terminal attached by tool compression retained; not soldering.
Area of a cut cross section retained.
Material joining region retained.
Molten solder SPREADING over joining surface retained. Target solder wording is conventional, not alloy-composition certification.
Lowering temperature retained.
Less than REQUIRED solder quantity retained, not zero solder.
Main/reference scale retained.
Lines or displays for quantity reading retained.
OUTSIDE diameter retained.
Measuring-instrument contact surface retained.
Force exerted by measurement face on object retained.
Mechanism equalizing measuring force retained, not dimension adjustment.
Reference line for scale reading retained.
Fractional part below integer part retained; source definition is elementary.
Both endpoints share the SAME TWO nodes retained; not one common node.
Successive connections on SAME path retained.
Charge remains AFTER supply turned off retained.
Positive/negative distinction retained.
Potential difference BETWEEN TWO points retained.
Magnitude of charge flow retained.
Opposition to current retained.
Value specified as use condition retained, not measured value.
TIME until repetition retained, not repetitions per second.
Repetitions PER SECOND retained.
Deviation magnitude FROM REFERENCE retained.
Shape representing time variation retained.
Externally observable state compared WITH standard retained.
Failure to satisfy requirements/standard retained.
Separate management to avoid mixing retained.
History/route tracing retained.
Notifying work progress or results retained.
Delivering necessary information to relevant people retained.
Seeking opinion/instructions for decision or response retained.
Repeating received contents to confirm retained.
Anticipating hazardous events BEFORE work retained.
Damage/injury from accident retained.
Concrete method reducing risk/problem retained.
Judgment against a standard retained.
Differences/spread among values retained.
PRODUCT requirement allowable boundary retained; not process control limits.
TIME-ORDERED process monitoring chart retained; not product tolerance chart.
Distribution of values among ranges retained.
Event count according to definition retained.
Cumulative sequential proportion retained.
Grouping by specified criteria retained.
Magnitude of impact IF event occurs retained; not event probability.
DRAWING LENGTH / ACTUAL LENGTH ratio retained; order is important.
Drawing larger than actual retained.
Drawing smaller than actual retained.
Center/axis indicator retained.
Relative physical positions retained.
ELECTRICAL equipment/terminal connections retained.
Identifier for terminal retained.
Legend explains drawing symbols/expressions retained.
Material used to conduct electricity retained.
Material using magnetic effects retained.
Poor conductivity and conductor separation BOTH retained.
Retaining performance against heat retained, without invented temperature.
Displayed reference/nominal value retained.
Allowed deviation range FROM reference retained.
Multiplying number retained.
Permitted power UNDER specified conditions retained.
Equivalent resistance for multiple resistors retained.
Voltage division across SERIES portions retained.
Current division across PARALLEL branches retained.
Split circuit path retained.
Direction in which diode passes current more readily retained; target phrasing slightly elliptical but direction clear.
Opposite to forward direction retained.
Current direction alignment retained, no claim of ripple-free output.
Voltage limit UNDER specified conditions retained.
Phenomenon due to accumulated charge retained.
Component damage by static discharge retained.
Object holding charge retained.
Distinguishing from others retained; Filipino identification wording remains contextual.
AND requires ALL conditions retained.
OR requires AT LEAST ONE condition retained, not exclusive OR.
NOT flips 0/1 retained.
Signal provided TO control retained.
Inspection/servicing BEFORE failure to reduce failures retained.'''.splitlines()
assert len(notes)==100,len(notes)
limits={'tl':100,'th':30,'km':30,'my':19}
for loc in limits:
 if (out/f'{loc}-review.json').exists():
  print(f'{loc}: existing subsequent review preserved; no overwrite')
  continue
 inp=base/'language'/'term-review-inputs'/f'{loc}.json'
 data=json.loads(inp.read_text()); records=[]
 for i,r in enumerate(data['records']):
  reviewed=i<limits[loc]
  records.append({**r,'decision':'ai_semantic_match_no_change' if reviewed else 'pending_unread','contextNote':notes[i] if reviewed else 'Not yet read against Japanese meaning; no semantic approval inferred from existence/hash.','reviewScope':'AI source-meaning vs target-text comparison; not native-speaker acceptance' if reviewed else 'pending','before':r['target'] if reviewed else None,'after':r['target'] if reviewed else None,'nativeReviewed':False,'domainExpertReviewed':False})
 doc={'locale':loc,'inputSha256':hashlib.sha256(inp.read_bytes()).hexdigest(),'totalSlots':len(records),'aiSemanticReviewed':limits[loc],'pendingUnread':len(records)-limits[loc],'records':records}
 (out/f'{loc}-review.json').write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
print('Wrote 4,308 tracked slots; 179 explicit contextual AI comparisons, 4,129 pending unread; no native acceptance.')
