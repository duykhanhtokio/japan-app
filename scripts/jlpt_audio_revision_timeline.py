"""Build old→new playback anchors without changing any saved answer or question."""
import re


def playback_revision(old, new, level, session_key, has_bell=True):
    if old['examId'] != new['examId'] or old['continuousSha256'] == new['continuousSha256']:
        raise ValueError('Expected one original exam with a replacement recording')
    points = {}

    def bind(before, after):
        if not isinstance(before, int) or not isinstance(after, int) or before < 0 or after < 0:
            raise ValueError('Timeline anchors must use nonnegative integer milliseconds')
        # Historical shortened-opening manifests differ at the final closing
        # endpoint by at most 2 ms; use the measured full-track endpoint there.
        if abs(before - old['durationMs']) <= 2:
            before = old['durationMs']
        if abs(after - new['durationMs']) <= 2:
            after = new['durationMs']
        if before in points and points[before] != after:
            raise ValueError(f'Conflicting timeline anchor {before}: {points[before]} vs {after}')
        points[before] = after

    def absolute(item, offset):
        value = item['startMs'] + offset
        # Global and segment-relative PCM rounding can differ by one ms.
        for boundary in ('startMs', 'endMs'):
            if abs(value - item[boundary]) <= 1:
                return item[boundary]
        return value

    bind(0, 0)
    bind(old['durationMs'], new['durationMs'])
    replacement = {item['questionId']: item for item in new['items']}
    assert set(replacement) == {item['questionId'] for item in old['items']}
    for item in old['items']:
        target = replacement[item['questionId']]
        assert item['group'] == target['group'] and item['number'] == target['number']
        for key in ('startMs', 'endMs'):
            bind(item[key], target[key])
        if item.get('responseWindows'):
            windows = {window['questionId']: window for window in target['responseWindows']}
            assert set(windows) == {window['questionId'] for window in item['responseWindows']}
            for window in item['responseWindows']:
                other = windows[window['questionId']]
                length = window['answerEndOffsetMs'] - window['answerStartOffsetMs']
                assert length == other['answerEndOffsetMs'] - other['answerStartOffsetMs']
                end_before = absolute(item, window['answerEndOffsetMs'])
                end_after = absolute(target, other['answerEndOffsetMs'])
                bind(end_before, end_after)
                bind(end_before - length, end_after - length)
                bind(absolute(item, window['questionStartOffsetMs']), absolute(target, other['questionStartOffsetMs']))
        else:
            seconds = old['settings']['answerPauseSecondsByProblem'][str(item['group'])]
            assert seconds == new['settings']['answerPauseSecondsByProblem'][str(item['group'])]
            milliseconds = seconds * 1000
            assert milliseconds == round(milliseconds) and milliseconds > 0
            bind(item['endMs'] - round(milliseconds), target['endMs'] - round(milliseconds))

    def orientation_key(segment):
        return segment['role'], segment.get('problem'), segment.get('exampleId')

    orientations = {orientation_key(segment): segment for segment in new['orientationSegments']}
    assert set(orientations) == {orientation_key(segment) for segment in old['orientationSegments']}
    for segment in old['orientationSegments']:
        target = orientations[orientation_key(segment)]
        for key in ('startMs', 'endMs', 'exampleStartMs', 'exampleEndMs'):
            if key in segment:
                bind(segment[key], target[key])
    if has_bell:
        bind(old['orientationSegments'][0]['endMs'] - 2000, new['orientationSegments'][0]['endMs'] - 2000)
    assert old['break']['musicDurationMs'] == new['break']['musicDurationMs'] == 60000
    for key in ('announcementStartMs', 'musicStartMs', 'musicEndMs', 'resumeAnnouncementEndMs'):
        bind(old['break'][key], new['break'][key])
    anchors = sorted([before, after] for before, after in points.items())
    for left, right in zip(anchors, anchors[1:]):
        if left[0] >= right[0] or left[1] >= right[1]:
            raise ValueError(f'Nonmonotonic replacement timeline: {left} → {right}')
    identity = re.fullmatch(r'jpapp-(n[1-5])-original-(0[1-6])-v1', old['examId'])
    assert identity and identity[1].upper() == level
    assert re.fullmatch(f'jlpt:jpapp:{identity[1]}:original:{identity[2]}:v[1-9][0-9]*', session_key)
    return {'examId': old['examId'], 'level': level, 'sessionKey': session_key,
            'fromAudioSha256': old['continuousSha256'], 'toAudioSha256': new['continuousSha256'], 'anchors': anchors}
