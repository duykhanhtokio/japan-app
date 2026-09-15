# Japan App Royal A+F V19.3 update

This is a code-and-asset update for the existing full Japan App source. It does
not include `node_modules` or unrelated media.

    cd /Users/doduykhanh/japan-app
    unzip -o "$HOME/Downloads/japan-app-royal-hud-map-prefecture-v19.3-code-only.zip" -d .
    npm install
    npx tsc --noEmit
    npm run audit:royal-controls
    npx expo start --clear

Expected source marker:

    grep -n "royal-hud-map-prefecture-v19.3" src/components/ui/RoyalPositioning.ts

The ZIP overwrites only the included source, documentation, audit, and Royal
HUD/map asset files. Existing backgrounds, city images, audio and data remain
untouched.
