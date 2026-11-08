import {useContext} from 'react';
import {StudyNavigationContext} from './StudyNavigation';
import {RoyalButton} from '@/components/ui/RoyalSurface';

/** Reuse the approved Royal artwork and typography; do not draw a replacement button. */
export function StudyAction({title,onPress,disabled=false,testID}:{title:string;onPress:()=>void;disabled?:boolean;testID?:string}){
 const singleLine=useContext(StudyNavigationContext);
 return <RoyalButton singleLine={singleLine} compact label={title} accessibilityLabel={title} testID={testID} disabled={disabled} onPress={onPress} style={{minWidth:0}}/>;
}
