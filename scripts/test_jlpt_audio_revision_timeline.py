import copy
import unittest
from jlpt_audio_revision_timeline import playback_revision


def recording(revised=False):
    shift = -3000 if revised else 0
    # Both response windows and the instrumental break retain their length.
    return {
        'examId': 'jpapp-n2-original-01-v1', 'continuousSha256': ('b' if revised else 'a') * 64,
        'durationMs': 130000 + shift,
        'settings': {'answerPauseSecondsByProblem': {'5': 15}},
        'items': [{'questionId': 'q1', 'group': 5, 'number': 1,
                   'startMs': 90000 + shift, 'endMs': 125000 + shift,
                   'responseWindows': [
                       {'questionId': 'q1', 'questionStartOffsetMs': 1000, 'answerStartOffsetMs': 3000, 'answerEndOffsetMs': 18000},
                       {'questionId': 'q2', 'questionStartOffsetMs': 18000, 'answerStartOffsetMs': 20000, 'answerEndOffsetMs': 35000}]}],
        'orientationSegments': [
            {'role': 'opening_sound_check_and_general_instructions', 'startMs': 1000, 'endMs': 10000 + shift},
            {'role': 'closing', 'startMs': 125000 + shift, 'endMs': 130000 + shift}],
        'break': {'musicDurationMs': 60000, 'announcementStartMs': 18000 + shift,
                  'musicStartMs': 20000 + shift, 'musicEndMs': 80000 + shift,
                  'resumeAnnouncementEndMs': 83000 + shift},
    }


class PlaybackTimelineTests(unittest.TestCase):
    def test_shared_response_windows_and_exact_music(self):
        old, new = recording(), recording(True)
        before = copy.deepcopy((old, new))
        row = playback_revision(old, new, 'N2', 'jlpt:jpapp:n2:original:01:v1')
        points = dict(row['anchors'])
        self.assertEqual(points[20000], 17000)
        self.assertEqual(points[80000] - points[20000], 60000)
        for start, end in [(93000, 108000), (110000, 125000)]:
            self.assertEqual(points[end] - points[start], 15000)
        self.assertEqual((old, new), before)

    def test_final_historical_rounding_uses_measured_duration(self):
        old, new = recording(), recording(True)
        old['orientationSegments'][-1]['endMs'] -= 2
        row = playback_revision(old, new, 'N2', 'jlpt:jpapp:n2:original:01:v1')
        self.assertEqual(row['anchors'][-1], [130000, 127000])
        self.assertNotIn(129998, dict(row['anchors']))

    def test_single_question_answer_window_is_not_scaled_with_speech(self):
        old, new = recording(), recording(True)
        for track in (old, new):
            del track['items'][0]['responseWindows']
        new['items'][0]['startMs'] += 1000
        row = playback_revision(old, new, 'N2', 'jlpt:jpapp:n2:original:01:v1')
        points = dict(row['anchors'])
        self.assertEqual(points[125000] - points[110000], 15000)

    def test_rejects_conflicting_music_or_foreign_session(self):
        old, new = recording(), recording(True)
        new['break']['musicDurationMs'] = 59000
        with self.assertRaises(AssertionError):
            playback_revision(old, new, 'N2', 'jlpt:jpapp:n2:original:01:v1')
        with self.assertRaises(AssertionError):
            playback_revision(recording(), recording(True), 'N2', 'jlpt:n1:2012:07')


if __name__ == '__main__':
    unittest.main()
