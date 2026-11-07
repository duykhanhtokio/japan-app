# Full direct-Japanese supplement prose supersedes the early compact draft.
import runpy
from pathlib import Path
for span in ['085-088','089-093','094-098']:
 runpy.run_path(str(Path(__file__).with_name('repair-supplement-'+span+'.py')))
