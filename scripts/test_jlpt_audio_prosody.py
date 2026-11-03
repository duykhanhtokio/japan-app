import ast
import copy
import json
import unittest
import tempfile
from unittest.mock import patch
import importlib.util
from pathlib import Path
from jlpt_audio_prosody import load_profile, apply_query, cache_key, fingerprint, turn_pause, candidate_root, query_parts
spec = importlib.util.spec_from_file_location('prosody_batch', Path(__file__).with_name('prepare-jlpt-prosody-batch.py'))
batch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(batch)
inventory = batch.inventory
install_spec = importlib.util.spec_from_file_location('prosody_install', Path(__file__).with_name('install-jlpt-prosody-batch.py'))
installer = importlib.util.module_from_spec(install_spec)
install_spec.loader.exec_module(installer)


ROOT = Path(__file__).resolve().parent.parent


class ProsodyTests(unittest.TestCase):
    def setUp(self):
        self.profile = load_profile(ROOT / 'src/data/jlpt-original/prosody-candidate.json')
        self.query = {'speedScale': .9, 'intonationScale': 1, 'prePhonemeLength': .1, 'postPhonemeLength': .1,
                      'accent_phrases': [{'accent': 2, 'is_interrogative': True,
                                          'moras': [{'text': 'カ', 'pitch': 5, 'vowel_length': .1}],
                                          'pause_mora': {'text': '、', 'vowel_length': .4}},
                                         {'accent': 1, 'moras': [], 'pause_mora': None}]}

    def test_preserves_engine_phonemes_accents_and_question_flag(self):
        before = copy.deepcopy(self.query)
        for level in self.profile['levels']:
            for mode in ('dialogue', 'narration'):
                q = apply_query(self.query, self.profile, level, mode)
                self.assertEqual(q['accent_phrases'][0]['moras'], before['accent_phrases'][0]['moras'])
                self.assertEqual(q['accent_phrases'][0]['accent'], 2)
                self.assertIs(q['accent_phrases'][0]['is_interrogative'], True)
                self.assertAlmostEqual(q['accent_phrases'][0]['pause_mora']['vowel_length'], .38)
                self.assertEqual(q['outputSamplingRate'], 24000)
                self.assertIs(q['outputStereo'], False)
        self.assertEqual(self.query, before)

    def test_cache_binds_all_effective_inputs(self):
        key = lambda p=self.profile, text='会いましょう。', speaker=118, engine='0.25.2', level='n5', mode='dialogue': cache_key(text, speaker, engine, p, level, mode)
        old = key()
        variants = [key(text='会いましょう？'), key(text='会い ましょう。'), key(speaker=21), key(engine='0.25.3'), key(level='n1'), key(mode='narration')]
        for section, field in [('query', 'postPhonemeLength'), ('query', 'dialogueIntonation'), ('boundary', 'questionExtraSeconds')]:
            p = copy.deepcopy(self.profile)
            p[section][field] += .01
            variants.append(key(p=p))
        self.assertTrue(all(x != old for x in variants))
        self.assertEqual(len(set(variants)), len(variants))
        self.assertEqual(old, key(p=json.loads(json.dumps(self.profile, sort_keys=True))))
        with self.assertRaises(ValueError):
            key(engine='')

    def test_distinct_boundaries_and_exact_time_conversion(self):
        for level in self.profile['levels']:
            plain = turn_pause(self.profile, level, 'そうです。', 'a', 'b')
            question = turn_pause(self.profile, level, 'どうですか？', 'a', 'b')
            hesitation = turn_pause(self.profile, level, 'それは…', 'a', 'b')
            same = turn_pause(self.profile, level, 'そうです。', 'a', 'a')
            self.assertLess(same, plain)
            self.assertLess(plain, question)
            self.assertLess(question, hesitation)
            self.assertEqual(turn_pause(self.profile, level, '終わり。', 'a', None), .5)
            # 24000 Hz × seconds × 2 bytes = 48 bytes per millisecond.
            self.assertEqual(round(plain * 24000) * 2, round(plain * 1000) * 48)
        self.assertEqual(60 * 24000, 1440000)
        self.assertEqual(60000, self.profile['midListeningMusicMs'])

    def test_bounded_inference_keeps_all_phrases_and_pauses(self):
        q = copy.deepcopy(self.query)
        phrase = q['accent_phrases'][0]
        q['accent_phrases'] = [copy.deepcopy(phrase) for _ in range(10)]
        parts = query_parts(q, 3)
        self.assertGreater(len(parts), 1)
        self.assertEqual([p for part in parts for p in part['accent_phrases']], q['accent_phrases'])
        self.assertEqual(parts[0]['prePhonemeLength'], q['prePhonemeLength'])
        self.assertEqual(parts[-1]['postPhonemeLength'], q['postPhonemeLength'])
        self.assertTrue(all(p['prePhonemeLength'] == 0 for p in parts[1:]))
        self.assertTrue(all(p['postPhonemeLength'] == 0 for p in parts[:-1]))
        with self.assertRaises(ValueError):
            query_parts(q, 0)

    def test_candidate_must_not_write_live_assets(self):
        for target in ('assets/jlpt-original', '..', '/tmp/prosody-output'):
            with self.assertRaises(ValueError):
                candidate_root(ROOT, target, 'profile.json')
        with self.assertRaises(ValueError):
            candidate_root(ROOT, None, 'profile.json')
        with self.assertRaises(ValueError):
            candidate_root(ROOT, 'docs/jlpt-workspace/audio-prosody-candidates/test', None)
        self.assertEqual(candidate_root(ROOT, None, None), ROOT)
        self.assertEqual(candidate_root(ROOT, 'docs/jlpt-workspace/audio-prosody-candidates/test', 'profile.json').parent.name, 'audio-prosody-candidates')

    def test_rejects_missing_engine_fields(self):
        q = copy.deepcopy(self.query)
        del q['accent_phrases']
        with self.assertRaises(ValueError):
            apply_query(q, self.profile, 'n5', 'dialogue')
        q = copy.deepcopy(self.query)
        q['accent_phrases'][0]['pause_mora']['vowel_length'] = float('nan')
        with self.assertRaises(ValueError):
            apply_query(q, self.profile, 'n5', 'dialogue')

    def test_full_original_corpus_queue_without_audio_claims(self):
        rows = inventory(self.profile)
        self.assertEqual(len(rows), 30)
        self.assertEqual(len({r['examId'] for r in rows}), 30)
        self.assertEqual(sum(r['listeningResponses'] for r in rows), 882)
        for level in self.profile['levels']:
            self.assertEqual(len([r for r in rows if r['level'] == level]), 6)
        self.assertTrue(all(not r['installedInApp'] and not r['perceptualApproval'] for r in rows))

    def test_install_metadata_preserves_all_authored_content_and_answers(self):
        prefix = 'docs/jlpt-workspace/audio-prosody-candidates/test'
        for row in inventory(self.profile):
            folder = ROOT / f"src/data/jlpt-original/{row['level']}/{row['number']:02d}"
            master, org, old = (json.loads((folder / file).read_text()) for file in
                ('master.ja.json', 'listening-organization.ja.json', 'audio.manifest.json'))
            candidate = copy.deepcopy(old)
            candidate['durationMs'] -= 1234
            candidate['orientationSegments'][0]['endMs'] -= 123
            candidate['prosody'] = {'profile': self.profile, 'profileSha256': fingerprint(self.profile)}
            candidate['continuousAudioPath'] = prefix + '/' + candidate['continuousAudioPath']
            candidate['break']['path'] = prefix + '/' + candidate['break']['path']
            for item in candidate['items']:
                item['path'] = prefix + '/' + item['path']
            before = copy.deepcopy((master, org, candidate))
            new_master, new_org, manifest = installer.metadata(master, org, candidate, old, prefix, self.profile)
            self.assertEqual({k: v for k, v in master.items() if k != 'audio'}, {k: v for k, v in new_master.items() if k != 'audio'})
            self.assertEqual({k: v for k, v in org.items() if k != 'openingBell'}, {k: v for k, v in new_org.items() if k != 'openingBell'})
            self.assertEqual(new_master['audio']['durationMs'], candidate['durationMs'])
            self.assertEqual(manifest['currentMasterSha256'], installer.hashlib.sha256(installer.encoded(new_master)).hexdigest())
            self.assertEqual(manifest['organizationSha256'], installer.hashlib.sha256(installer.encoded(new_org)).hexdigest())
            self.assertTrue(manifest['prosody']['installedInApp'])
            self.assertFalse(manifest['prosody']['candidateOnly'])
            self.assertFalse(new_master['audio']['perceptualApproval'])
            self.assertEqual([i['turns'] for i in manifest['items']], [i['turns'] for i in old['items']])
            self.assertEqual((master, org, candidate), before)
        with self.assertRaises(ValueError):
            installer.installed_path(prefix + '/../other.mp3', prefix)

    def test_resume_validates_complete_candidates_and_preserves_invalid_ones(self):
        row = {'level': 'n5', 'number': 1}
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            with patch.object(batch, 'validate_candidate') as validate:
                self.assertIsNone(batch.completed_candidate(row, output, self.profile))
                validate.assert_not_called()
                manifest = output / 'src/data/jlpt-original/n5/01/audio.manifest.json'
                manifest.parent.mkdir(parents=True)
                manifest.write_text('{}')
                validate.return_value = {'status': 'rendered_candidate_needs_listening'}
                self.assertEqual(batch.completed_candidate(row, output, self.profile), validate.return_value)
                validate.assert_called_once_with(row, output, self.profile)
                validate.side_effect = AssertionError('profile or PCM mismatch')
                with self.assertRaisesRegex(AssertionError, 'profile or PCM mismatch'):
                    batch.completed_candidate(row, output, self.profile)
                self.assertEqual(manifest.read_text(), '{}')

    def test_both_renderers_wire_candidate_and_boundary_controls(self):
        for name in ('generate-jlpt-original-audio.py', 'generate-jlpt-original-n2-audio.py'):
            source = (ROOT / 'scripts' / name).read_text()
            ast.parse(source)
            self.assertIn('render_root=candidate_root(', source)
            self.assertIn('key=cache_key(', source)
            self.assertIn('q=apply_query(', source)
            self.assertEqual(source.count('silence(script_gap('), 2)
            self.assertIn("if index==0:return settings['afterIntroSeconds']", source)
            self.assertIn("if not prosody:return settings['betweenTurnsSeconds']", source)
            self.assertIn("manifest_path=render_root/", source)
            self.assertIn("assert music_end-music_start==60000", source)


if __name__ == '__main__':
    unittest.main()
