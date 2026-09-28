// Repro for https://github.com/NativeScript/NativeScript/issues/11472
//
// @nativescript/vite's /ns/m route handles `.css` requests by transforming
// `${spec}?inline`, where `spec` is the workspace-root-relative URL the
// pipeline emits (e.g. `/packages/ui/tokens.css`). Vite can only resolve a
// root-relative URL against the configured `root` — for a file living in a
// sibling workspace package the transform is denied, the CSS branch falls
// through, and the device receives the DOM-oriented CSS module containing
// `__vite__updateStyle` (undefined on NativeScript).

import { createServer } from 'vite';
import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Layout: vite root = fixture/app, CSS lives in fixture/pkgs/ui (outside
// root, but inside the project so /@fs is allowed).
const ws = join(dirname(fileURLToPath(import.meta.url)), 'fixture');
mkdirSync(join(ws, 'app'), { recursive: true });
mkdirSync(join(ws, 'pkgs/ui'), { recursive: true });
const cssFile = join(ws, 'pkgs/ui/style.css');
writeFileSync(cssFile, ':root { color: red; }\n');

const server = await createServer({
	root: join(ws, 'app'),
	configFile: false,
	logLevel: 'silent',
	server: { middlewareMode: true },
});

// A: what the /ns/m CSS branch sends — root-relative spec + ?inline.
const a = await server
	.transformRequest('/pkgs/ui/style.css?inline')
	.then((r) => r?.code ?? null)
	.catch((e) => `THREW: ${e.message}`);
console.log('A  transformRequest("/pkgs/ui/style.css?inline")');
console.log('   ->', JSON.stringify(String(a).slice(0, 80)));

// B: the fallthrough path — /@fs resolves the file but returns Vite's web
// CSS module, which calls __vite__updateStyle (DOM-only).
const b = await server.transformRequest('/@fs' + cssFile);
console.log('B  transformRequest("/@fs<abs>/style.css")  [what the device gets]');
console.log('   contains __vite__updateStyle:', b?.code?.includes('__vite__updateStyle'));

// C: /@fs + ?inline gives the `export default "<css>"` the branch expects.
const c = await server.transformRequest('/@fs' + cssFile + '?inline');
console.log('C  transformRequest("/@fs<abs>/style.css?inline")  [wanted shape]');
console.log('   ->', JSON.stringify((c?.code ?? 'null').slice(0, 80)));

await server.close();

console.log(
	a === null || String(a).startsWith('THREW')
		? '\n-> BUG: the spec form the CSS branch uses cannot resolve outside vite root'
		: '\n-> ok'
);
