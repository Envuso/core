import fs from "fs";
import os from "os";
import path from "path";
import {afterAll, afterEach, beforeAll, describe, expect, test} from "bun:test";
import {app} from "../AppContainer/helpers";
import {inertiaViewHelperGlobal} from "../Packages/Inertia/InertiaViewHelperGlobal";
import {viteViewHelperGlobal} from "../Routing/StaticAssets/GlobalHandlers/ViteViewHelperGlobal";
import {Server} from "../Server/Server";
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

const inject = (opts: any) => app().container().resolve<Server>(Server)._server.inject(opts);

// The test view (src/Resources/Views/testing-inertia.edge) uses {{{ vite(...) }}} and {{{ inertia(page) }}}
const renderInertiaPage = async () => (await inject({method : 'GET', url : '/inertia', headers : {accept : 'text/html'}})).body;

const hotFile = path.join(process.cwd(), 'storage', 'vite.hot');

afterEach(() => {
	fs.rmSync(hotFile, {force : true});
});

describe('inertia() view helper', () => {
	test('embeds the page as JSON that a prop cannot break out of', () => {
		const page = JSON.stringify({component : 'Hello', props : {name : '</script><img src=x onerror=alert(1)>&' + String.fromCharCode(0x2028)}});
		const html = inertiaViewHelperGlobal(page);
		const json = html.slice(html.indexOf('>') + 1, html.indexOf('</script>'));

		expect(html.startsWith('<script data-page="app" type="application/json">')).toBe(true);
		expect(html).toEndWith('<div id="app"></div>');
		expect(json).not.toContain('<');
		expect(json).not.toContain(String.fromCharCode(0x2028));
		// Escaped, not changed
		expect(JSON.stringify(JSON.parse(json))).toBe(page);
	});

	test('the mount id is sanitised', () => {
		expect(inertiaViewHelperGlobal('{}', 'main"><x')).toContain('id="mainx"');
	});
});

describe('vite() view helper', () => {
	test('loads from the dev server while its hot file exists', async () => {
		fs.mkdirSync(path.dirname(hotFile), {recursive : true});
		fs.writeFileSync(hotFile, 'http://localhost:5173/');

		const html = await renderInertiaPage();

		expect(html).toContain('<script type="module" src="http://localhost:5173/@vite/client"></script>');
		expect(html).toContain('<script type="module" src="http://localhost:5173/src/Resources/Ts/app.ts"></script>');
		expect(html).toContain('<script data-page="app" type="application/json">');
	});

	test('uses the build manifest otherwise: CSS (including imported chunks), preloads, entry', () => {
		// A temporary app root: writing into the real assets/ would trigger the asset watcher (a reboot)
		const root = fs.mkdtempSync(path.join(os.tmpdir(), 'envuso-vite-'));
		fs.mkdirSync(path.join(root, 'assets', 'build', '.vite'), {recursive : true});
		fs.writeFileSync(path.join(root, 'assets', 'build', '.vite', 'manifest.json'), JSON.stringify({
			'src/Resources/Ts/app.ts' : {file : 'app-abc.js', css : ['app-abc.css'], imports : ['_shared-def.js'], isEntry : true},
			'_shared-def.js'          : {file : 'shared-def.js', css : ['shared-def.css']},
		}));

		const html = viteViewHelperGlobal(root, 'assets')('src/Resources/Ts/app.ts');
		fs.rmSync(root, {recursive : true, force : true});

		expect(html).toContain('<link rel="stylesheet" href="/assets/build/app-abc.css"/>');
		expect(html).toContain('<link rel="stylesheet" href="/assets/build/shared-def.css"/>');
		expect(html).toContain('<link rel="modulepreload" href="/assets/build/shared-def.js"/>');
		expect(html).toContain('<script type="module" src="/assets/build/app-abc.js"></script>');
		expect(html).not.toContain('@vite/client');
	});

	test('an entry missing from the manifest is an error', () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), 'envuso-vite-'));
		fs.mkdirSync(path.join(root, 'assets', 'build', '.vite'), {recursive : true});
		fs.writeFileSync(path.join(root, 'assets', 'build', '.vite', 'manifest.json'), '{}');

		expect(() => viteViewHelperGlobal(root, 'assets')('src/missing.ts')).toThrow(/isn't an entry/);
		fs.rmSync(root, {recursive : true, force : true});
	});

	test('without a build or a dev server, a full page load is a 500; Inertia visits still work', async () => {
		// The full page needs the assets: a 500 (the message, "no build manifest...", is logged, not shown)
		const page = await inject({method : 'GET', url : '/inertia', headers : {accept : 'text/html'}});
		expect(page.statusCode).toBe(500);

		// An Inertia visit returns the page as JSON, without the root view
		const visit = await inject({method : 'GET', url : '/inertia', headers : {'x-inertia' : 'true', accept : 'text/html, application/xhtml+xml'}});
		expect(visit.statusCode).toBeLessThan(300);
		expect(visit.json().component).toBe('Hello');
	});
});

describe('HTML error pages', () => {
	test('keep their status code (they used to be sent as 200)', async () => {
		for (const [url, code] of [['/testing/view/404', 404], ['/testing/view/500', 500]] as const) {
			const res = await inject({method : 'GET', url, headers : {accept : 'text/html'}});

			expect(res.statusCode).toBe(code);
			expect(res.headers['content-type']).toContain('text/html');
		}
	});
});
