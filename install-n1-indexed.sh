#!/usr/bin/env bash
set -euo pipefail
expected_original=3921ae53abec4f655342655d7eed4604becee0bebc26ab4909133eb55115832b
expected_new=eede116d0999e6b9b8d2d79310145e0cf72fbcb041e416a90c75551e5945b255
original=assets/jlpt/n1/2012-07/audio/n1-2012-07.mp3
indexed=assets/jlpt/n1/2012-07/audio/n1-2012-07-indexed.m4a
[ "$(shasum -a 256 "$original" | cut -d ' ' -f 1)" = "$expected_original" ] || { echo 'MP3 gốc không khớp; chưa thay đổi dữ liệu.'; exit 1; }
[ "$(shasum -a 256 "$indexed" | cut -d ' ' -f 1)" = "$expected_new" ] || { echo 'File AAC không khớp; chưa thay đổi dữ liệu.'; exit 1; }
node scripts/check-jlpt-approved-ui-lock.mjs
git apply --check N1_2012_07_AUDIO_MAPPING.patch
git apply N1_2012_07_AUDIO_MAPPING.patch
node scripts/check-jlpt-approved-ui-lock.mjs
echo 'Đã chuyển riêng N1 7/2012 sang âm thanh có chỉ mục. Các mốc bạn lưu giữ nguyên.'
