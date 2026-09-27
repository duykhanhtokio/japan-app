import fs from 'node:fs';

const catalog = fs.readFileSync('src/components/jlpt/ApprovedJlptExamCatalog.tsx', 'utf8');
const auditRegistry = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const failures = [];
if (!catalog.includes("selected?.kind === 'structured'")) failures.push('structured renderer branch missing');
if (!catalog.includes('<N1OfficialTrial')) failures.push('approved structured UI missing');
if (catalog.includes('ApprovedMockExam') || catalog.includes('MOCK_JLPT_EXAMS') || catalog.includes("kind === 'mock'")) failures.push('non-standard mock exam is reachable from catalog');
if (catalog.includes('PENDING_JLPT_EXAMS') || catalog.includes("kind === 'pending'")) failures.push('incomplete exam is reachable from runnable catalog');
if (!auditRegistry.includes('MOCK_JLPT_EXAMS') || !auditRegistry.includes('PENDING_JLPT_EXAMS')) failures.push('mock/pending audit metadata must remain preserved');
if (catalog.includes('ApprovedScannedExam') || catalog.includes('writtenPages') || catalog.includes('listeningPages')) failures.push('full-page scanned renderer is reachable from catalog');
if (failures.length) { console.error('JLPT STRUCTURED EXAMS FAILED'); failures.forEach((item) => console.error(`- ${item}`)); process.exit(1); }
console.log('JLPT STRUCTURED EXAMS PASS: runnable catalog exposes only structured source-backed exams; mock/pending metadata remains preserved for audit.');
