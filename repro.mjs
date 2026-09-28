// Repro for https://github.com/NativeScript/NativeScript/issues/11470
//
// Under pnpm's isolated node linker, a workspace package's own dependency
// lives at <workspace>/<pkg>/node_modules/<dep>/ — not under the app root
// and not under the workspace root. `resolveCandidateFilePath`
// (hmr/server/websocket-module-specifiers.js) only probes projectRoot and
// workspaceRoot, so /ns/m requests for such modules return 404 and the
// HTTP-ESM dev-session boot fails with a network error.

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { mkdtempSync } from 'node:fs';
import { rmSync } from 'node:fs';

const req = createRequire(import.meta.url);
const m = await import(
	pathToFileURL(
		join(dirname(req.resolve('@nativescript/vite')), 'hmr/server/websocket-module-specifiers.js')
	).href
);

// Fake pnpm-isolated workspace:
//   <ws>/apps/demo              projectRoot (vite root, has no ui-image)
//   <ws>/                       workspaceRoot (no node_modules hoist)
//   <ws>/packages/gif/node_modules/@scope/transitive-dep/index.js
const ws = mkdtempSync(join(tmpdir(), 'ns-11470-'));
const appRoot = join(ws, 'apps/demo');
const depFile = join(ws, 'packages/gif/node_modules/@scope/transitive-dep/index.js');
mkdirSync(appRoot, { recursive: true });
mkdirSync(dirname(depFile), { recursive: true });
writeFileSync(depFile, 'export const ok = 1;\n');

const spec = '/node_modules/@scope/transitive-dep/index.js';
const resolved = m.resolveCandidateFilePath(spec, appRoot, ws);

console.log('candidate spec :', spec);
console.log('file exists at :', depFile, '->', existsSync(depFile));
console.log('resolved       :', resolved);
console.log(
	resolved === null
		? '\n-> BUG: returns null -> /ns/m 404 -> dev-session boot fails'
		: '\n-> ok'
);

rmSync(ws, { recursive: true, force: true });
