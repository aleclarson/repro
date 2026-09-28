// Repro for https://github.com/NativeScript/NativeScript/issues/11471
//
// `extractDirectExportedNames` (hmr/server/websocket-core-bridge.js) scans
// module code for `export` declarations with regexes but never masks
// comments. A commented-out `export const X` line in a CJS star-export
// target produces a phantom name, which `expandStarExports` then emits as
// `export { X } from "<url>"` — a binding the served module never provides,
// so it fails at link time on device.

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const req = createRequire(import.meta.url);
const serverDir = join(
	dirname(req.resolve('@nativescript/vite')),
	'hmr/server'
);
const bridge = await import(
	pathToFileURL(join(serverDir, 'websocket-core-bridge.js')).href
);
const helpers = await import(
	pathToFileURL(join(serverDir, 'websocket-served-module-helpers.js')).href
);

// A CJS module like @nativescript-community/ui-image's index-common.js:
// real CommonJS exports plus commented-out migration notes.
const cjsTarget = `module.exports = {};
// export const roundRadiusProperty = {};
exports.createView = () => {};
`;

// 1. The primitive scanner picks up the commented-out name.
const names = bridge.extractDirectExportedNames(cjsTarget);
console.log('extractDirectExportedNames:', names);
console.log(
	names.includes('roundRadiusProperty')
		? '  -> BUG: phantom name from a // comment\n'
		: '  -> ok\n'
);

// 2. Through the full path: an importer with a star re-export of a
// node_modules file gets `export { <phantom> }` injected — which the
// device then cannot link (the CJS module provides no such binding).
const importer = 'export * from "/node_modules/ui-image/index-common.js";\n';
const expanded = await helpers.expandStarExports(
	importer,
	null, // server unused when a shared transformer is provided
	null, // projectRoot
	false,
	async () => ({ code: cjsTarget }), // stands in for transformRequest
	'/src/index.js'
);
console.log('expanded importer:', expanded.trim());
console.log(
	expanded.includes('export { roundRadiusProperty }')
		? '\n-> BUG: emits an export binding that does not exist in the target'
		: '\n-> ok'
);
