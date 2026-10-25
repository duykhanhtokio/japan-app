import { useBackdropOcclusion } from '@/components/ui/AppBackdrop';
import { createContext, useContext, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {STUDY_IVORY} from '@/theme/study-surface';

const SharedBackdrop = createContext(false);

export default function JlptStudyBackground({children,enabled=true}:PropsWithChildren<{enabled?:boolean}>) {
 const inherited = useContext(SharedBackdrop);
 useBackdropOcclusion(enabled);
 if (!enabled) return <RoyalPageBackground>{children}</RoyalPageBackground>;
 const style={flex:1,backgroundColor:enabled?STUDY_IVORY:'transparent'};
 if (inherited) return <View style={style}>{children}</View>;
 return <SharedBackdrop.Provider value={true}><View testID="jlpt-ivory-background" style={style}>{children}</View></SharedBackdrop.Provider>;
}
