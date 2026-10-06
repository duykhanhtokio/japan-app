"""Compatibility entry point for the independent N5 02 audio generator."""
import runpy
import sys
from pathlib import Path

if '--exam-number' not in sys.argv:
    sys.argv.extend(['--exam-number', '2'])
if '--continuous-bitrate-kbps' not in sys.argv:
    sys.argv.extend(['--continuous-bitrate-kbps', '48'])
runpy.run_path(str(Path(__file__).with_name('generate-jlpt-original-audio.py')), run_name='__main__')
