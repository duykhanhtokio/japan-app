#!/usr/bin/env python3
"""Flatten existing page color washes into artwork (Pillow; no runtime dependency).

Blur stays in the UI, so cover geometry and device-specific blur are preserved.
Original artwork remains available for cards and dialogue scenes.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPECS = [
    ('life/location-backgrounds/cafe/01-clear-morning.jpg', 'study-light.png', (255, 255, 255), .45),
    ('life/location-backgrounds/cafe/01-clear-morning.jpg', 'profile-details.png', (11, 24, 48), .50),
    ('welcome/welcome-japan-landscape-v2.png', 'profile-light.png', (255, 255, 255), .45),
    ('registration/registration-bg.jpg', 'registration.png', (5, 20, 35), .09),
    ('registration/registration-bg.jpg', 'registration-work.png', (225, 246, 253), .42),
    ('learn/learn-bg.jpg', 'n5-journey.png', (238, 244, 255), .46),
]

if __name__ == '__main__':
    output = ROOT / 'assets/app/backgrounds'
    output.mkdir(parents=True, exist_ok=True)
    for source, name, color, opacity in SPECS:
        image = Image.open(ROOT / 'assets/app' / source).convert('RGB')
        Image.blend(image, Image.new('RGB', image.size, color), opacity).save(output / name, optimize=True)
    print(f'Flattened {len(SPECS)} page backgrounds.')
