import fs from 'node:fs';
const route = fs.readFileSync('src/app/[level]/[section].tsx', 'utf8');
const catalog = fs.readFileSync('src/components/jlpt/ApprovedJlptExamCatalog.tsx', 'utf8');
const failures = [];
if (!route.includes('onBack={()=>router.back()}')) failures.push('top-level catalog must own router.back()');
if (catalog.includes('router.back(') || catalog.includes('router.replace(')) failures.push('catalog internals must not mutate the router');
if (!catalog.includes("BackHandler.addEventListener('hardwareBackPress'")) failures.push('hardware Back interception is missing while an exam is selected');
if (!catalog.includes("navigation.addListener('beforeRemove'")) failures.push('iPhone swipe/route Back interception is missing while an exam is selected');
if (!catalog.includes('setSelected(null)')) failures.push('selected exam must return to catalog through state');
if (!catalog.includes('APPROVED_N1_EXAMS.filter')) failures.push('catalog must select structured exams for every level');
if (catalog.includes('ApprovedMockExam') || catalog.includes('MOCK_JLPT_EXAMS') || catalog.includes('PENDING_JLPT_EXAMS')) failures.push('catalog navigation must not expose mock or incomplete exams');
if (failures.length) { console.error('JLPT NAVIGATION CONTRACT FAILED'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log('JLPT NAVIGATION CONTRACT PASS: router Back only at catalog boundary; internal Back returns to catalog once.');
