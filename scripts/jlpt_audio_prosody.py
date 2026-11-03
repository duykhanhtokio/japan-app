"""Candidate-only synthesis controls shared by both original-JLPT renderers."""
import copy
import hashlib
import json
import math
from pathlib import Path


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


def cache_key(text, speaker_id, engine_version, profile, level, mode):
    if not engine_version:
        raise ValueError('Actual engine version is required for the new cache')
    data = {'text': text, 'speaker': speaker_id, 'engineVersion': engine_version, 'profile': profile,
            'level': level, 'mode': mode, 'querySettings': speech_settings(profile, level, mode)}
    return hashlib.sha256(json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


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
