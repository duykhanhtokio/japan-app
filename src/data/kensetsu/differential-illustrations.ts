import type { ImageSourcePropType } from 'react-native';
export const differentialIllustrations: Record<string, ImageSourcePropType> = {
 'assets/kensetsu/differential/b3.png': require('../../../assets/kensetsu/differential/b3.png'),
 'assets/kensetsu/differential/b4.png': require('../../../assets/kensetsu/differential/b4.png'),
 'assets/kensetsu/differential/b5.png': require('../../../assets/kensetsu/differential/b5.png'),
 'assets/kensetsu/differential/b6.png': require('../../../assets/kensetsu/differential/b6.png'),
 'assets/kensetsu/differential/b7.png': require('../../../assets/kensetsu/differential/b7.png'),
 'assets/kensetsu/differential/c3.png': require('../../../assets/kensetsu/differential/c3.png'),
 'assets/kensetsu/differential/c5.png': require('../../../assets/kensetsu/differential/c5.png'),
 'assets/kensetsu/differential/c6.png': require('../../../assets/kensetsu/differential/c6.png'),
 'assets/kensetsu/differential/c7.png': require('../../../assets/kensetsu/differential/c7.png'),
 'assets/kensetsu/differential/b8.png': require('../../../assets/kensetsu/differential/b8.png'),
};
export const differentialIllustrationAspectRatios: Record<string,number> = Object.fromEntries(Object.keys(differentialIllustrations).map(path=>[path,1200/650]));
