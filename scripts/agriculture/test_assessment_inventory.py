"""Regression checks for accidental capacity claims and stale assessment evidence."""
import copy
import unittest

from assessment_inventory import build, digest, load


class AssessmentEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.baseline = load()
        cls.question_count = len({q['id'] for key in ['weekly', 'mocks']
                                  for e in cls.baseline[key]['exams'] for q in e['questions']})

    def changed(self):
        return copy.deepcopy(self.baseline)

    def rebind_review(self, data):
        data['review']['reviewedInputHashes'] = {
            key: digest(data[key]) for key in ['lessons', 'weekly', 'mocks', 'candidates']
        }

    def test_real_data_never_implies_certified_capacity(self):
        report = build(self.baseline)
        self.assertEqual(report['summary']['uniqueExistingQuestions'], self.question_count)
        self.assertFalse(report['capacityFor800Certified'])
        self.assertTrue(all(not r['independentObjectiveCertified'] for r in report['paragraphCandidates']))
        self.assertTrue(all(not r['eligibleForAutomaticQuestionGeneration'] for r in report['locallyScreenedCandidates']))

    def test_prose_change_without_source_hash_is_rejected(self):
        data = self.changed()
        data['lessons']['lessons'][0]['paragraphs'][0]['textJa'] += 'changed'
        with self.assertRaisesRegex(ValueError, 'content/hash mismatch'):
            build(data)

    def test_missing_knowledge_binding_is_rejected(self):
        data = self.changed()
        data['weekly']['exams'][0]['questions'][0]['knowledgeIds'] = ['missing']
        with self.assertRaisesRegex(ValueError, 'invalid question knowledge'):
            build(data)

    def test_stale_question_source_is_rejected(self):
        data = self.changed()
        data['mocks']['exams'][0]['questions'][0]['lessonSourceHash'] = '0' * 64
        with self.assertRaisesRegex(ValueError, 'stale question lesson'):
            build(data)

    def test_shared_question_id_counts_once_but_preserves_uses(self):
        data = self.changed()
        extra = copy.deepcopy(data['weekly']['exams'][0])
        extra['id'] += '-fixture'
        data['weekly']['exams'].append(extra)
        self.rebind_review(data)
        report = build(data)
        self.assertEqual(report['summary']['uniqueExistingQuestions'], self.question_count)
        qid = extra['questions'][0]['id']
        row = next(r for r in report['existingAssessments'] if r['questionId'] == qid)
        self.assertEqual(len(row['uses']), 2)

    def test_conflicting_shared_question_is_rejected(self):
        data = self.changed()
        extra = copy.deepcopy(data['weekly']['exams'][0])
        extra['id'] += '-fixture'
        extra['questions'][0]['stemJa'] += 'changed'
        data['weekly']['exams'].append(extra)
        with self.assertRaisesRegex(ValueError, 'conflicting shared question'):
            build(data)

    def test_weekly_question_cannot_be_relabelled_as_mock(self):
        data = self.changed()
        data['mocks']['exams'][0]['questions'][0] = copy.deepcopy(data['weekly']['exams'][0]['questions'][0])
        with self.assertRaisesRegex(ValueError, 'weekly/mock question ID reuse'):
            build(data)

    def test_ai_screen_cannot_upgrade_native_approval(self):
        data = self.changed()
        data['review']['decisions'][0]['nativeReviewed'] = True
        with self.assertRaisesRegex(ValueError, 'cannot claim external approval'):
            build(data)

    def test_changed_answer_invalidates_editorial_snapshot(self):
        data = self.changed()
        q = data['weekly']['exams'][0]['questions'][0]
        q['correctIndex'] = (q['correctIndex'] + 1) % 4
        with self.assertRaisesRegex(ValueError, 'editorial review stale'):
            build(data)

    def test_stale_candidate_source_is_rejected(self):
        data = self.changed()
        data['candidates']['new2goCandidateObjectives'][0]['lessonSourceHash'] = '0' * 64
        self.rebind_review(data)
        with self.assertRaisesRegex(ValueError, 'stale candidate lesson'):
            build(data)

    def test_missing_review_decision_is_rejected(self):
        data = self.changed()
        data['review']['decisions'].pop()
        with self.assertRaisesRegex(ValueError, 'coverage mismatch'):
            build(data)

    def test_comparison_to_unknown_question_is_rejected(self):
        data = self.changed()
        data['review']['decisions'][0]['relatedQuestionIds'] = ['missing']
        with self.assertRaisesRegex(ValueError, 'unknown comparison question'):
            build(data)

    def test_summary_and_page_holds_never_clear_candidate(self):
        report = build(self.baseline)
        flagged = [r for r in report['paragraphCandidates']
                   if r['sourcePageHoldIdsForReview'] or r['summaryTitleSignal']]
        self.assertTrue(flagged)
        self.assertTrue(all(r['status'] == 'requires_atomic_objective_and_global_semantic_review' for r in flagged))


if __name__ == '__main__':
    unittest.main()
