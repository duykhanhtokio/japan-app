import {restaurantLesson} from '@/data/restaurant';
import {sourceLesson31,type SourceFigure31,type SourceLesson31,type SourceQuestion31} from '@/data/restaurant/source31';
import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import data from '@/data/restaurant/royal-quiz-figure-bindings.json';
const questionIdentity=(q:SourceQuestion31)=>({id:q.id,sourceHash:q.sourceHash,stemJa:q.stemJa,optionsJa:q.optionsJa,correctIndex:q.correctIndex,explanationJa:q.explanationJa,optionReasonsJa:q.optionReasonsJa,figureIds:q.figureIds??[]});
/** Neutral original pixels/crops only, under the actual canonical lesson/exam/question identity. */
export function restaurantQuizFigureAllowed(row:SourceLesson31,q:SourceQuestion31,figure:SourceFigure31):boolean{
 const b=data.bindings.find(x=>x.question.id===q.id&&x.figure.id===figure.id);if(!b||figure.quizSafe!==true||!sameRestaurantFigureIdentity(b.figure,figure))return false;
 if(row.lessonId!==b.lessonId||row.lessonSourceHash!==b.lessonSourceHash||row.sourceHash!==b.rowSourceHash||row.exam?.id!==b.examId||row.exam?.sourceHash!==b.examSourceHash||JSON.stringify(questionIdentity(q))!==JSON.stringify(b.question))return false;
 const lesson=restaurantLesson(b.lessonId,b.level as '1'|'2'),current=lesson?sourceLesson31(lesson):null,canonical=current?.exam?.questions.find(x=>x.id===q.id);
 return !!current&&current.sourceHash===b.rowSourceHash&&current.exam?.id===b.examId&&current.exam?.sourceHash===b.examSourceHash&&!!canonical&&JSON.stringify(questionIdentity(canonical))===JSON.stringify(b.question)&&current.figures.some(f=>sameRestaurantFigureIdentity(f,figure));
}
export function restaurantNeutralQuestionFigureLabel(language='ja'):string{return (data.neutralLabels as Record<string,string>)[language]??data.neutralLabels.ja;}
