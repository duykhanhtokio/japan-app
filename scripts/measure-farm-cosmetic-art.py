"""Regenerate visible bounds from the original cosmetic PNGs (requires Pillow)."""
import json
import re
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / "src/game/data/farm-cosmetic-assets.ts"
measurements = {}
for key, relative in re.findall(r'"([^"]+)": require\("([^"]+)"\)', source.read_text()):
    with Image.open(source.parent / relative) as original:
        image = original.convert("RGBA")
        # Exclude imperceptible export noise, retaining antialiased visible edges.
        bounds = image.getchannel("A").point(lambda alpha: 255 if alpha >= 8 else 0).getbbox()
        if bounds:
            measurements[key] = {"width": image.width, "height": image.height, "bounds": list(bounds)}
output = source.with_name("farm-cosmetic-art-bounds.json")
output.write_text(json.dumps(measurements, ensure_ascii=False, indent=2) + "\n")
print(f"Measured {len(measurements)} original cosmetic assets")
