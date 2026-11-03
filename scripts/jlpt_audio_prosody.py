"""Candidate-only synthesis controls shared by both original-JLPT renderers."""
import copy
import hashlib
import json
import math
from pathlib import Path

SPOKEN_TEXT_NORMALIZATION = 'strip-ascii-layout-spaces-v1'


def speech_query_text(text):
    """Match the approved Japanese renderer's treatment of layout spaces.

    Keep the written source unchanged. ASCII spaces in beginner learning text
    are not requested breath pauses; OpenJTalk otherwise inserts pause moras.
    """
    normalized = text.replace(' ', '')
    if not normalized:
        raise ValueError('Empty spoken query')
    return normalized


def validate_voice_catalog(speakers, casting):
    available = {style['id']: (speaker['name'], style['name'])
                 for speaker in speakers for style in speaker['styles']}
    for role in casting['roles'].values():
        if available.get(role['speakerId']) != (role['name'], role['style']):
            raise ValueError('Engine does not match the approved voice: ' + role['name'])


def acquire_engine_slot(root, *, blocking=True, slots=2, exclusive=False):
    """Bound all batch/direct renders to two engines; honor legacy slot zero."""
    import fcntl
    import time
    if slots not in (1, 2):
        raise ValueError('Only one or two production engines are supported')
    folder = Path(root) / 'docs/jlpt-workspace/audio-prosody-candidates'
    folder.mkdir(parents=True, exist_ok=True)
    if exclusive:
        from contextlib import ExitStack
        stack = ExitStack()
        try:
            for name in ('voicevox-engine.lock', 'voicevox-engine-1.lock'):
                handle = stack.enter_context((folder / name).open('a'))
                fcntl.flock(handle.fileno(), fcntl.LOCK_EX | (0 if blocking else fcntl.LOCK_NB))
            return stack
        except BaseException:
            stack.close()
            raise
    while True:
        for number in range(slots):
            name = 'voicevox-engine.lock' if number == 0 else 'voicevox-engine-1.lock'
            handle = (folder / name).open('a')
            try:
                fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                return handle
            except BlockingIOError:
                handle.close()
            except BaseException:
                handle.close()
                raise
        if not blocking:
            raise BlockingIOError('All production engine slots are occupied')
        time.sleep(.25)


def acquire_render_lock(output, level, number):
    """Serialize direct and batch renderer invocations for one candidate form."""
    import fcntl
    folder = Path(output) / 'form-locks'
    folder.mkdir(parents=True, exist_ok=True)
    handle = (folder / f'{level}-{int(number):02d}.render.lock').open('a')
    fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
    return handle


def reuse_rendered_candidate(root, output, profile, level, number):
    manifest = Path(output) / f'src/data/jlpt-original/{level}/{int(number):02d}/audio.manifest.json'
    if not manifest.is_file():
        return False
    import importlib.util
    spec = importlib.util.spec_from_file_location('prosody_reuse_validation', Path(root) / 'scripts/prepare-jlpt-prosody-batch.py')
    batch = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(batch)
    row = next(row for row in batch.inventory(profile) if row['level'] == level and row['number'] == int(number))
    batch.validate_candidate(row, Path(output), profile)
    return True


def load_profile(path):
    profile = json.loads(Path(path).read_text())
    if profile.get('schemaVersion') != 1 or not profile.get('revision'):
        raise ValueError('Invalid prosody profile')
    for level in ('n5', 'n4', 'n3', 'n2', 'n1'):
        row = profile['levels'][level]
        for key in ('dialogueSpeed', 'narrationSpeed', 'turnSeconds'):
            value = row[key]
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
                raise ValueError(f'Invalid {level}/{key}')
        if not .7 <= row['dialogueSpeed'] <= 1.2 or not .7 <= row['narrationSpeed'] <= 1.2:
            raise ValueError('Candidate speed outside bounded synthesis range')
    for key in ('humanReviewed', 'nativeReviewed', 'perceptualApproval'):
        if profile.get(key) is not False:
            raise ValueError('Candidate profile cannot claim listening acceptance')
    if profile['midListeningMusicMs'] != 60000:
        raise ValueError('Preserve exact 60000 ms instrumental rest')
    limit = profile.get('inferenceMaxMoras', 160)
    if isinstance(limit, bool) or not isinstance(limit, int) or not 8 <= limit <= 512:
        raise ValueError('Invalid inference part size')
    for section in ('query', 'boundary'):
        for key, value in profile[section].items():
            if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0 or value > 2:
                raise ValueError(f'Invalid {section}/{key}')
    return profile


def fingerprint(profile):
    return hashlib.sha256(json.dumps(profile, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def speech_settings(profile, level, mode):
    if mode not in ('narration', 'dialogue'):
        raise ValueError('Unknown speech purpose')
    row = profile['levels'][level]
    settings = profile['query']
    return {'speedScale': row['narrationSpeed' if mode == 'narration' else 'dialogueSpeed'],
            'intonationScale': settings['narrationIntonation' if mode == 'narration' else 'dialogueIntonation'],
            'prePhonemeLength': settings['prePhonemeLength'], 'postPhonemeLength': settings['postPhonemeLength'],
            'outputSamplingRate': 24000, 'outputStereo': False}


def apply_query(query, profile, level, mode):
    """Keep engine phrase/accent/mora structure; never guess word-level pitch."""
    result = copy.deepcopy(query)
    settings = speech_settings(profile, level, mode)
    for required in ('speedScale', 'intonationScale', 'prePhonemeLength', 'postPhonemeLength', 'accent_phrases'):
        if required not in result:
            raise ValueError('Unsupported engine AudioQuery: ' + required)
    result.update(settings)
    # Scale existing phrase pauses rather than flattening every boundary to one
    # interval. Speech phonemes, accents and interrogative flags stay untouched.
    for phrase in result['accent_phrases']:
        pause = phrase.get('pause_mora')
        if pause is not None:
            length = pause.get('vowel_length')
            if not isinstance(length, (int, float)) or isinstance(length, bool) or not math.isfinite(length) or length < 0:
                raise ValueError('Invalid engine pause mora')
            pause['vowel_length'] = length * profile['query']['pauseMoraScale']
    return result


def cache_key(text, speaker_id, engine_version, profile, level, mode, query_text=None):
    if not engine_version:
        raise ValueError('Actual engine version is required for the new cache')
    data = {'text': text, 'speaker': speaker_id, 'engineVersion': engine_version, 'profile': profile,
            'level': level, 'mode': mode, 'querySettings': speech_settings(profile, level, mode)}
    if query_text is not None:
        if query_text != speech_query_text(text):
            raise ValueError('Unexpected spoken text normalization')
        if query_text != text:
            # Unchanged queries can reuse verified WAVs. Changed queries bind
            # BOTH the written source and the actual engine input in the key.
            data.update(queryText=query_text, textNormalization=SPOKEN_TEXT_NORMALIZATION)
    return hashlib.sha256(json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def query_parts(query, max_moras):
    """Bound inference memory at existing pause boundaries, not character cuts.

    Compute pronunciation/accent from the complete utterance first. Retain every
    resulting phrase and pause, and add no extra edge silence between parts.
    """
    if not isinstance(max_moras, int) or isinstance(max_moras, bool) or max_moras < 1:
        raise ValueError('Invalid inference part size')
    phrases = query['accent_phrases']
    groups, current, count = [], [], 0
    for phrase in phrases:
        current.append(phrase)
        count += len(phrase['moras'])
        if count >= max_moras and phrase.get('pause_mora') is not None:
            groups.append(current)
            current, count = [], 0
    if current:
        groups.append(current)
    if not groups:
        return [copy.deepcopy(query)]
    parts = []
    for i, phrases in enumerate(groups):
        part = copy.deepcopy(query)
        part['accent_phrases'] = copy.deepcopy(phrases)
        if i:
            part['prePhonemeLength'] = 0
        if i != len(groups) - 1:
            part['postPhonemeLength'] = 0
        parts.append(part)
    return parts


def turn_pause(profile, level, text, actor, next_actor):
    if next_actor is None:
        return profile['boundary']['beforePromptSeconds']
    pause = profile['levels'][level]['turnSeconds']
    ending = text.rstrip()
    if ending.endswith(('?', '？')):
        pause += profile['boundary']['questionExtraSeconds']
    elif ending.endswith(('…', '...', '、')):
        pause += profile['boundary']['hesitationExtraSeconds']
    if actor == next_actor:
        pause -= profile['boundary']['sameActorReductionSeconds']
    return round(max(.15, min(.8, pause)), 3)


def candidate_root(root, candidate_dir, profile_path):
    """No opt-in profile may overwrite installed audio or manifests."""
    if bool(candidate_dir) != bool(profile_path):
        raise ValueError('--prosody-profile and --candidate-dir must be supplied together')
    if not candidate_dir:
        return root
    target = (root / candidate_dir).resolve()
    allowed = (root / 'docs/jlpt-workspace/audio-prosody-candidates').resolve()
    if target != allowed and allowed not in target.parents:
        raise ValueError('Candidate output must stay under docs/jlpt-workspace/audio-prosody-candidates')
    return target
