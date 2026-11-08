import {RoyalButton} from '@/components/ui/RoyalSurface';

/** Reuse the approved Royal artwork and typography; do not draw a replacement button. */
export function StudyAction({title,onPress,disabled=false,testID}:{title:string;onPress:()=>void;disabled?:boolean;testID?:string}){
 return <RoyalButton compact label={title} accessibilityLabel={title} testID={testID} disabled={disabled} onPress={onPress} style={{minWidth:0}}/>;
}
