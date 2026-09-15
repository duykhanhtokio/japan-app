import fs from 'node:fs';

const catalog = fs.readFileSync('src/components/jlpt/ApprovedJlptExamCatalog.tsx', 'utf8');
const failures = [];
if (!catalog.includes("selected?.kind === 'structured'")) failures.push('structured renderer branch missing');
if (!catalog.includes('<N1OfficialTrial')) failures.push('approved structured UI missing');
if (!catalog.includes("selected?.kind === 'mock'")) failures.push('mock renderer branch missing');
if (!catalog.includes("selected?.kind === 'pending'")) failures.push('pending status branch missing');
if (catalog.includes('ApprovedScannedExam') || catalog.includes('writtenPages') || catalog.includes('listeningPages')) failures.push('full-page scanned renderer is reachable from catalog');
if (failures.length) { console.error('JLPT STRUCTURED EXAMS FAILED'); failures.forEach((item) => console.error(`- ${item}`)); process.exit(1); }
console.log('JLPT STRUCTURED EXAMS PASS: ready exams use approved UI; pending exams remain visible without scanned-page runtime.');
