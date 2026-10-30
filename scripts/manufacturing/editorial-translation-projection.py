"""Accept only the exact source-bound editorial-loader extension in historical audits."""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[2]
SNAPSHOT='docs/ssw-workspace/manufacturing/batch33-full-review/integration/'
HASHES={
 'src/data/manufacturing/mocks.ts':('1b8fb9174d20010b2ddda9e6d1780659a0bcc78d5ddf3629939b6395d8beb688','6c49e926660957d32531f90dec10f5f641a12664253ac58b3484c862c000a91c'),
 'src/data/manufacturing/translations.ts':('9d3c3f84cf1180f6bb97d719012f296cee42a9f7d2df226d1b48d63bc92c35ac','d981f76a1d8e6e4f43cf02068440c716b94fd9a00a6cc8ef09a53bd16cafc436'),
 'src/data/manufacturing/source-guides.ts':('5d24678001a56a7fd3915d8e9b11999fb0bfe0b90f753d5cfd730bad7a538d00','25a51dfd21579c6739d4fa5a7e7e3cc963d8562d2e4d6e240a0571a8acacc6e4'),
}
QUESTION_EDITORIAL='81032eb91a0a150f8aad5864f1259bd44a63a4c05037dd6c342e13b2f37f4cc0'
def historical_translation_loader(path,raw):
    assert path in HASHES,'Unknown editorial loader'
    before,after=HASHES[path];digest=hashlib.sha256(raw).hexdigest()
    if path=='src/data/manufacturing/mocks.ts' and digest==QUESTION_EDITORIAL:
        raw=(ROOT/'docs/ssw-workspace/manufacturing/batch35-continuation/exam-review/base-mocks.ts').read_bytes()
        assert hashlib.sha256(raw).hexdigest()==after,'Question editorial predecessor snapshot drift'
        digest=after
    assert digest in (before,after),'Unknown editorial loader revision:'+path
    if digest==before:return raw
    original=(ROOT/SNAPSHOT/('base-'+Path(path).name)).read_bytes()
    assert hashlib.sha256(original).hexdigest()==before,'Historical editorial loader drift'
    return original
