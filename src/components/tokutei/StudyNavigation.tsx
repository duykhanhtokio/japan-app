import {Children,createContext,type PropsWithChildren} from 'react';
import {View} from 'react-native';

export const StudyNavigationContext=createContext(false);

/** Equal-width controls keep the same outer gutters, including at larger text sizes. */
export function StudyNavigation({children}:PropsWithChildren){
 return <StudyNavigationContext.Provider value={true}><View testID="study-navigation" style={{width:'100%',flexDirection:'row',flexWrap:'nowrap',alignItems:'center',gap:12}}>{Children.map(children,child=>child==null?null:<View style={{flex:1,minWidth:0}}>{child}</View>)}</View></StudyNavigationContext.Provider>;
}
