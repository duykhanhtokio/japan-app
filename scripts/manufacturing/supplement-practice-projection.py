"""Preserve historical audit receipts for the exact additive practice integration."""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[2]
BASE='947fecd8eb083f596810f8cb5884dff9db2b7aadc5e40cdb95a546125edd8b5f'
AFTER='916478a8a44dd7abeba7bbf91d72b68b0caa25fceb4c75d01a0d0ec77582e88e'
CLARIFIED='7c13a9073ad41b721ff5c2d1ce0f753f0ecdeb3a426087b5571c25ce10796225'
TERM_EDITORIAL='b111774eec13e1a6932c4358ce583ff07f1f9b8c4a26ec5cf24470b64d385574'
SUPPLEMENTAL_DIAGRAMS='55e0fda24abe8da991c48178371ca84424273725ed4b8ecf779f7d70fe4b04a2'
BOOLEAN_PRACTICE='0d205ea0f5150852956a13cfb71911108c4feb62ac8fc483f70f04466ba9c74e'
COMPLETION37='5f5ff4e3bd2d200500f578b6e7a0a89d358f29bedb1ff6f48313ba72d42937aa'
RECOGNITION38='0fc06864e60036f4584aab6f6c1f7c479c5dc9adcdf31c3239d9d404cae75587'
def historical_course(raw):
    digest=hashlib.sha256(raw).hexdigest()
    if digest==RECOGNITION38:
        raw=(ROOT/'docs/ssw-workspace/manufacturing/batch38-recognition/base-ManufacturingCourse.tsx').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==COMPLETION37,'Recognition38 predecessor drift'
        digest=COMPLETION37
    if digest==COMPLETION37:
        raw=(ROOT/'docs/ssw-workspace/manufacturing/batch37-completion/base-ManufacturingCourse.tsx').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==BOOLEAN_PRACTICE,'Completion37 predecessor drift'
        digest=BOOLEAN_PRACTICE
    if digest==BOOLEAN_PRACTICE:
        raw=(ROOT/'docs/ssw-workspace/manufacturing/batch36-continuation/base-boolean-ManufacturingCourse.tsx').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==SUPPLEMENTAL_DIAGRAMS,'Boolean practice predecessor snapshot drift'
        digest=SUPPLEMENTAL_DIAGRAMS
    if digest==SUPPLEMENTAL_DIAGRAMS:
        raw=(ROOT/'docs/ssw-workspace/manufacturing/batch36-continuation/base-ManufacturingCourse.tsx').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==TERM_EDITORIAL,'Supplemental predecessor snapshot drift'
        digest=TERM_EDITORIAL
    if digest==TERM_EDITORIAL:
        raw=(ROOT/'docs/ssw-workspace/manufacturing/batch35-continuation/base-ManufacturingCourse.tsx').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==CLARIFIED,'Term editorial predecessor snapshot drift'
        digest=CLARIFIED
    # Strip only the exact paragraph-rendering correction before the older practice layer.
    # A changed component or historical snapshot is still rejected, never normalized freely.
    if digest==CLARIFIED:
        raw=(ROOT/'docs/ssw-workspace/manufacturing/batch34-continuation/base-ManufacturingCourse.tsx').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==AFTER,'Clarification predecessor snapshot drift'
        digest=AFTER
    assert digest in (BASE,AFTER),'Unknown manufacturing course revision'
    if digest==BASE:return raw
    original=(ROOT/'docs/ssw-workspace/manufacturing/batch32-caliper-practice/base-ManufacturingCourse.tsx').read_bytes()
    assert hashlib.sha256(original).hexdigest()==BASE,'Historical course snapshot drift'
    return original
