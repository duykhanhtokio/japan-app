import React from 'react';
import {createRoot} from 'react-dom/client';
import {KensetsuCourse} from '/workspace/scratch/ec8177f5adc0/week015/publish-repo/src/components/kensetsu/KensetsuCourse';
createRoot(document.getElementById('root')!).render(<KensetsuCourse learner={new URLSearchParams(location.search).get('learner')??'qa-learner'} onBack={()=>{}}/>);
