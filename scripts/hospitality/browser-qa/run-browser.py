"""Local Chromium layout QA for the source-only hospitality guide harness.

Does not install dependencies, mutate app data, or certify physical devices.
"""
import argparse
import functools
import hashlib
import http.server
import json
import shutil
import sys
import threading
from pathlib import Path

GEOMETRY = r'''() => {
  const app = document.getElementById('app'), frame = app.getBoundingClientRect();
  const outside = [...app.querySelectorAll('*')].map(e => ({e, r:e.getBoundingClientRect()}))
    .filter(x => x.r.width > 0 && x.r.height > 0 && (x.r.left < frame.left - .75 || x.r.right > frame.right + .75))
    .map(x => ({tag:x.e.tagName, testid:x.e.getAttribute('data-testid'), text:x.e.textContent.slice(0,80), left:x.r.left, right:x.r.right}));
  const id = name => document.querySelector('[data-testid="' + name + '"]');
  let route = null;
  if (id('hotel-two-route-origin')) {
    const origin=id('hotel-two-route-origin'), connectors=id('hotel-two-route-connectors'), exits=id('hotel-two-route-exits');
    const o=origin.getBoundingClientRect(), c=connectors.getBoundingClientRect(), x=exits.getBoundingClientRect();
    route={originBottom:o.bottom, connectorTop:c.top, connectorBottom:c.bottom, exitsTop:x.top,
      labelsInFlow:c.top >= o.bottom - .5 && x.top >= c.bottom - .5,
      labelClip:[origin,id('hotel-two-route-exit-A'),id('hotel-two-route-exit-B')].some(e => e.scrollHeight > e.clientHeight+1 || e.scrollWidth > e.clientWidth+1)};
  }
  return {viewportWidth:innerWidth, allocatedFrameWidth:frame.width,
    documentScrollWidth:document.documentElement.scrollWidth, documentClientWidth:document.documentElement.clientWidth,
    horizontalOverflow:document.documentElement.scrollWidth > document.documentElement.clientWidth+1, outside, route};
}'''


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def installed_browser():
    mac_chrome = Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    if mac_chrome.is_file():
        return str(mac_chrome)
    return shutil.which('chromium') or shutil.which('google-chrome')


def current_hashes(repo_root, paths):
    return {name: hashlib.sha256((repo_root / name).read_bytes()).hexdigest() for name in paths}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build-dir', type=Path, required=True, help='Output directory returned by build.cjs')
    parser.add_argument('--browser-executable', help='Use an installed Chromium/Google Chrome executable')
    args = parser.parse_args()
    base = args.build_dir.resolve()
    manifest = json.loads((base / 'build-manifest.json').read_text())
    repo_root = Path(manifest['repoRoot'])
    expected = manifest['productionSha256']
    if current_hashes(repo_root, expected) != expected:
        parser.error('Production files changed after bundling; rebuild the QA surface first.')
    bundle_hash = hashlib.sha256((base / 'bundle.js').read_bytes()).hexdigest()
    if bundle_hash != manifest['bundleSha256']:
        parser.error('QA bundle hash differs from build-manifest.json; rebuild it.')
    report = {
        'schemaVersion': 1, 'status': 'not_executed',
        'method': manifest['method'], 'productionSha256': expected,
        'bundleSha256': bundle_hash, 'viewportWidths': [320, 768, 1280],
        'routeLocales': 13, 'nativeLessonBindings': 9,
        'otherRepresentativeLocales': ['ja', 'vi', 'my', 'km'],
        'rubyStates': 'Japanese off/on; translations remain plain',
        'plannedCases': 162, 'completedCases': 0,
        'runtimeErrors': [], 'failures': [], 'results': [], 'screenshots': [],
        'browserRenderingVerified': False, 'physicalIOSAndroidTested': False,
        'nativeOSFontScaleTested': False,
    }
    server = None
    browser = None
    exit_code = 2
    try:
        from playwright.sync_api import sync_playwright
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(base)))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        with sync_playwright() as playwright:
            options = {'headless': True}
            executable = args.browser_executable or installed_browser()
            if executable:
                options['executable_path'] = executable
            browser = playwright.chromium.launch(**options)
            report['browser'] = 'Chromium'
            report['browserVersion'] = browser.version
            page = browser.new_page(viewport={'width': 320, 'height': 900}, device_scale_factor=1)
            page.on('pageerror', lambda error: report['runtimeErrors'].append(str(error)))
            page.goto(f'http://127.0.0.1:{server.server_address[1]}/index.html', wait_until='load')
            page.wait_for_function('window.browserHarnessReady===true', timeout=15000)
            locales = ['ja', 'en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl']
            other = ['hotel-service-01', 'hotel-service-02', 'hotel-service-03', 'hotel-service-04',
                     'hotel-planning-05', 'hotel-restaurant-02', 'hotel-restaurant-03', 'hotel-restaurant-04']
            screenshot_cases = {('hotel-safety-07', 'ja', True, 320), ('hotel-safety-07', 'vi', False, 320),
                                ('hotel-safety-07', 'my', False, 768), ('hotel-restaurant-04', 'ja', True, 320),
                                ('hotel-planning-05', 'vi', False, 1280)}
            for width in report['viewportWidths']:
                page.set_viewport_size({'width': width, 'height': 900})
                cases = [('hotel-safety-07', locale, ruby) for locale in locales
                         for ruby in ([False, True] if locale == 'ja' else [False])]
                cases += [(lesson_id, locale, ruby) for lesson_id in other for locale in ['ja', 'vi', 'my', 'km']
                          for ruby in ([False, True] if locale == 'ja' else [False])]
                for lesson_id, locale, ruby in cases:
                    page.evaluate('async values => await window.renderCase(...values)', [lesson_id, locale, ruby])
                    page.wait_for_timeout(20)
                    geometry = page.evaluate(GEOMETRY)
                    record = {'lessonId': lesson_id, 'locale': locale, 'ruby': ruby, 'viewport': width, **geometry}
                    report['results'].append(record)
                    report['completedCases'] += 1
                    if (lesson_id, locale, ruby, width) in screenshot_cases:
                        screenshot = base / f'{lesson_id}-{locale}-ruby{int(ruby)}-w{width}.png'
                        page.screenshot(path=str(screenshot), full_page=True)
                        report['screenshots'].append(str(screenshot))
            browser.close()
            browser = None
        report['failures'] = [record for record in report['results'] if record['horizontalOverflow'] or record['outside']
                              or (record['route'] and (not record['route']['labelsInFlow'] or record['route']['labelClip']))]
        passed = not report['failures'] and not report['runtimeErrors'] and report['completedCases'] == report['plannedCases']
        report['status'] = 'pass' if passed else 'geometry_or_runtime_failure'
        report['browserRenderingVerified'] = passed
        exit_code = 0 if passed else 1
    except Exception as error:
        report['status'] = 'blocked_or_harness_failed'
        report['blocker'] = {'stage': 'browser launch/page/layout execution', 'error': str(error)}
    finally:
        if browser is not None:
            try:
                browser.close()
            except Exception:
                pass
        if server is not None:
            server.shutdown()
            server.server_close()
        report['productionHashesBeforeAndAfterMatch'] = current_hashes(repo_root, expected) == expected
        if not report['productionHashesBeforeAndAfterMatch']:
            report['status'] = 'production_changed_during_run'
            report['browserRenderingVerified'] = False
            exit_code = 2
        output = base / 'browser-results.json'
        output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        print(json.dumps({'status': report['status'], 'completedCases': report['completedCases'],
                          'failures': len(report['failures']), 'report': str(output),
                          'physicalIOSAndroidTested': False}, ensure_ascii=False))
    return exit_code


if __name__ == '__main__':
    sys.exit(main())
