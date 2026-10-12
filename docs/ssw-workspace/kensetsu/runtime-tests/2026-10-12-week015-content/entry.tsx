import React from 'react';
import {createRoot} from 'react-dom/client';
import {KensetsuCourse} from '/workspace/scratch/ec8177f5adc0/week008/japan-app/src/components/kensetsu/KensetsuCourse';
createRoot(document.getElementById('root')!).render(<KensetsuCourse learner={new URLSearchParams(location.search).get('learner')??'qa-learner'} onBack={()=>{}}/>);
