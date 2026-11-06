"""Recovery guards: preserve recordings only across proven printed-only edits."""
import copy
import hashlib
import importlib.util
import json
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


HERE = Path(__file__).resolve().parent
def module(name, file):
    spec = importlib.util.spec_from_file_location(name, HERE / file)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result

batch = module('batch_rebind_tests', 'prepare-jlpt-prosody-batch.py')
installer = module('installer_rebind_tests', 'install-jlpt-prosody-batch.py')
builder = module('builder_rebind_tests', 'build-jlpt-original-audio-revisions.py')


class RebindTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.folder = 'src/data/jlpt-original/n3/03'
        self.master_path = self.root / self.folder / 'master.ja.json'
        self.master_path.parent.mkdir(parents=True)
        self.original = {'examId': 'jpapp-n3-original-03-v1', 'passages': {}, 'questions': [
            {'id': 'printed', 'section': 'grammar_reading', 'group': 7, 'number': 5, 'correctOptionId': '4', 'prompt': 'before'},
            {'id': 'spoken', 'section': 'listening', 'group': 1, 'number': 1, 'correctOptionId': '1', 'script': [['adultFemale', 'independent test speech']]}]}
        self.master_path.write_text(json.dumps(self.original))
        self.organization = self.root / self.folder / 'listening-organization.ja.json'
        self.organization.write_text('{}')
        self.casting = self.root / 'src/data/jlpt-original/voice-casting.json'
        self.casting.write_text('{}')
        subprocess.run(['git', 'init', '-q'], cwd=self.root, check=True)
        subprocess.run(['git', 'add', '.'], cwd=self.root, check=True)
        subprocess.run(['git', '-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-qm', 'frozen audio input'], cwd=self.root, check=True)
        self.commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=self.root, text=True).strip()
        self.manifest = {'masterSha256': batch.digest(self.master_path), 'continuousSha256': 'unchanged-audio'}
        self.current = copy.deepcopy(self.original)
        self.current['questions'][0]['prompt'] = 'printed correction'
        self.write_current()

    def write_current(self):
        self.master_path.write_text(json.dumps(self.current))
        self.row = {'level': 'n3', 'number': 3, 'masterSha256': batch.digest(self.master_path),
                    'organizationSha256': batch.digest(self.organization), 'castingSha256': batch.digest(self.casting)}

    def evidence(self):
        with patch.object(batch, 'ROOT', self.root):
            return batch.written_only_rebind_evidence(self.row, self.manifest, self.commit)

    def test_allows_printed_correction_and_retains_recording_hash(self):
        result = self.evidence()
        self.assertEqual(result['changedWrittenQuestionIds'], ['printed'])
        self.assertEqual(result['recordingMasterSha256'], self.manifest['masterSha256'])
        self.assertFalse(result['audioRegenerated'])

    def test_rejects_changed_spoken_script(self):
        self.current['questions'][1]['script'][0][1] = 'different speech'
        self.write_current()
        with self.assertRaisesRegex(AssertionError, 'Listening content changed'):
            self.evidence()

    def test_rejects_changed_answer_identity_or_order(self):
        self.current['questions'][0]['correctOptionId'] = '2'
        self.write_current()
        with self.assertRaisesRegex(AssertionError, 'identity, order or key'):
            self.evidence()

    def test_rejects_unrelated_source_commit(self):
        self.manifest['masterSha256'] = '0' * 64
        with self.assertRaisesRegex(AssertionError, 'supplied Git source'):
            self.evidence()

    def test_rejects_casting_or_organization_changes(self):
        self.organization.write_text('{"instructions":"changed"}')
        self.write_current()
        with self.assertRaisesRegex(AssertionError, 'Organization or casting'):
            self.evidence()

    def test_rejects_non_question_change(self):
        self.current['passages']['new'] = 'new passage'
        self.write_current()
        with self.assertRaisesRegex(AssertionError, 'non-question'):
            self.evidence()


class CompleteSetTests(unittest.TestCase):
    def rows(self):
        return [{'examId': f'jpapp-{level}-original-{number:02d}-v1', 'status': 'rendered_candidate_needs_listening', 'installedInApp': True}
                for level in ('n5', 'n4', 'n3', 'n2', 'n1') for number in range(1, 7)]

    def test_24_candidates_cannot_install(self):
        rows = self.rows()
        for row in rows[-6:]:
            row['status'] = 'missing_complete_candidate'
        with self.assertRaisesRegex(ValueError, 'No audio installed'):
            installer.require_complete_batch(rows)

    def test_complete_set_can_pass_preflight(self):
        installer.require_complete_batch(self.rows())

    def test_unique_but_wrong_30_forms_cannot_install(self):
        rows = self.rows()
        rows[-1]['examId'] = 'unrelated-form'
        with self.assertRaisesRegex(ValueError, 'canonical 30'):
            installer.require_complete_batch(rows)

    def test_candidates_cannot_activate_migration(self):
        report = {'forms': self.rows(), 'installedNewAudioForms': 0}
        with self.assertRaisesRegex(AssertionError, 'before all 30'):
            builder.require_installed_set(report)

    def test_missing_install_receipt_cannot_activate_migration(self):
        rows = self.rows()
        rows[-1]['installedInApp'] = False
        with self.assertRaisesRegex(AssertionError, 'Incomplete installation'):
            builder.require_installed_set({'forms': rows, 'installedNewAudioForms': 30})

    def test_failed_live_write_rolls_back_prior_canonical_writes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            output = root / 'candidates'
            originals = {}
            rows = self.rows()
            for row in rows:
                identity = row['examId'].split('-')
                row.update(level=identity[1], number=int(identity[3]))
                folder = f"src/data/jlpt-original/{row['level']}/{row['number']:02d}"
                live = root / folder
                live.mkdir(parents=True)
                for name, content in [('master.ja.json', {'examId': row['examId'], 'audio': {'state': 'old'}}),
                                      ('listening-organization.ja.json', {}), ('audio.manifest.json', {'state': 'old'})]:
                    path = live / name
                    path.write_text(json.dumps(content))
                    originals[path] = path.read_bytes()
                asset = f"assets/jlpt-original/{row['level']}/{row['number']:02d}/audio/"
                paths = ['candidates/' + asset + name for name in ('full.mp3', 'music.mp3')]
                for relative in paths:
                    source = root / relative
                    source.parent.mkdir(parents=True, exist_ok=True)
                    source.write_bytes(b'replacement-test-recording')
                    canonical = root / relative.removeprefix('candidates/')
                    canonical.parent.mkdir(parents=True, exist_ok=True)
                    canonical.write_bytes(b'old-test-recording')
                    originals[canonical] = canonical.read_bytes()
                candidate = output / folder / 'audio.manifest.json'
                candidate.parent.mkdir(parents=True)
                candidate.write_text(json.dumps({'continuousAudioPath': paths[0], 'break': {'path': paths[1]}, 'items': []}))
            report = root / 'report.json'
            report.write_text(json.dumps({'profileSha256': 'test-profile', 'forms': rows}))
            originals[report] = report.read_bytes()
            copy = installer.atomic_copy
            calls = 0
            def fail_third_write(source, target, **kwargs):
                nonlocal calls
                calls += 1
                if calls == 3:
                    raise OSError('injected disk write failure')
                return copy(source, target, **kwargs)
            def metadata(master, organization, candidate, previous, prefix, profile):
                result = copy_module.deepcopy(master)
                result['audio'] = {'state': 'new'}
                return result, organization, {'state': 'new'}
            import copy as copy_module
            with patch.object(installer, 'ROOT', root), patch.object(installer.batch, 'ROOT', root), \
                 patch.object(installer, 'load_profile', return_value={}), \
                 patch.object(installer, 'fingerprint', return_value='test-profile'), \
                 patch.object(installer, 'candidate_root', return_value=output), \
                 patch.object(installer.batch, 'validate_candidate'), patch.object(installer.batch, 'check_snapshot'), \
                 patch.object(installer, 'metadata', side_effect=metadata), \
                 patch.object(installer, 'atomic_copy', side_effect=fail_third_write), \
                 patch('sys.argv', ['install', '--report', 'report.json', '--install']):
                with self.assertRaisesRegex(OSError, 'injected disk write failure'):
                    installer.main()
            self.assertEqual(calls, 3)
            self.assertTrue(all(path.read_bytes() == content for path, content in originals.items()))


if __name__ == '__main__':
    unittest.main()
