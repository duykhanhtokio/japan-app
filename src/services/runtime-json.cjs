const {inflate} = require('pako');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// React Native/Hermes and web share this decoder; no Node Buffer or native
// file-system/VOICEVOX dependency is needed in the shipped application.
function decodeRuntimeJson(encoded) {
  const padding = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0;
  const bytes = new Uint8Array(encoded.length / 4 * 3 - padding);
  let bits = 0, count = 0, offset = 0;
  for (let i = 0; i < encoded.length && encoded[i] !== '='; i++) {
    const digit = alphabet.indexOf(encoded[i]);
    if (digit < 0) throw new Error('Invalid runtime data encoding');
    bits = (bits << 6) | digit;
    count += 6;
    if (count >= 8) {
      count -= 8;
      bytes[offset++] = (bits >>> count) & 255;
    }
  }
  return JSON.parse(inflate(bytes, {to:'string'}));
}

module.exports = {decodeRuntimeJson};
