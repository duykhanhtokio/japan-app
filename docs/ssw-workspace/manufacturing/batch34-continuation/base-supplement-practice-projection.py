"""Preserve historical audit receipts for the exact additive practice integration."""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[2]
BASE='947fecd8eb083f596810f8cb5884dff9db2b7aadc5e40cdb95a546125edd8b5f'
AFTER='916478a8a44dd7abeba7bbf91d72b68b0caa25fceb4c75d01a0d0ec77582e88e'
def historical_course(raw):
    digest=hashlib.sha256(raw).hexdigest()
    assert digest in (BASE,AFTER),'Unknown manufacturing course revision'
    if digest==BASE:return raw
    original=(ROOT/'docs/ssw-workspace/manufacturing/batch32-caliper-practice/base-ManufacturingCourse.tsx').read_bytes()
    assert hashlib.sha256(original).hexdigest()==BASE,'Historical course snapshot drift'
    return original
