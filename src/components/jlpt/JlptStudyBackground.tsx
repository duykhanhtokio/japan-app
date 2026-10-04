import { createContext, useContext, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';

const SharedBackdrop = createContext(false);

export default function JlptStudyBackground({children,enabled=true}:PropsWithChildren<{enabled?:boolean}>) {
 const inherited = useContext(SharedBackdrop);
 if (inherited) return <View style={{flex:1}}>{children}</View>;
 return <SharedBackdrop.Provider value={true}><RoyalPageBackground enabled={enabled}>{children}</RoyalPageBackground></SharedBackdrop.Provider>;
}
