import { Image, Platform } from 'react-native';
import DecodedArtwork from './DecodedArtwork';

// Preserve the native content-image contract. On web, paint fixed-size approved
// artwork immediately; do not wait for RN web's image-load state update.
export default (Platform.OS === 'web' ? DecodedArtwork : Image) as typeof Image;
