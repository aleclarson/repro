const vm = require("vm");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const convertSourceMap = require("convert-source-map");

const USE_ESBUILD = true;
const USE_REMAPPING = true;

const sourcemapChain = [];

const bundlePath = path.resolve("bundle.js");
const bundle = fs.readFileSync(bundlePath, "utf8");

let transformed;

if (USE_ESBUILD) {
  const esbuild = require("esbuild");
  const result = esbuild.transformSync(
    USE_REMAPPING ? convertSourceMap.removeComments(bundle) : bundle,
    {
      format: "cjs",
      target: "es2020",
      sourcemap: true,
      sourcefile: "bundle.js",
      sourcesContent: false,
    }
  );
  sourcemapChain.push(JSON.parse(result.map));
  transformed = result.code;
} else {
  const sucrase = require("sucrase");
  const result = sucrase.transform(
    USE_REMAPPING ? convertSourceMap.removeComments(bundle) : bundle,
    {
      transforms: ["imports"],
      filePath: bundlePath,
      sourceMapOptions: {
        compiledFilename: "bundle.js",
      },
    }
  );
  sourcemapChain.push(result.sourceMap);
  transformed = result.code;
}

// The bundle sourcemap must be at the end.
if (USE_REMAPPING) {
  sourcemapChain.push(convertSourceMap.fromSource(bundle).sourcemap);
}

const remapping = require("@ampproject/remapping");
const sourcemap = USE_REMAPPING
  ? remapping(sourcemapChain, () => null, true)
  : sourcemapChain[0];

console.log(sourcemap);

const script =
  transformed + "\n" + convertSourceMap.fromObject(sourcemap).toComment();

console.log("\nScript\n⎺⎺⎺⎺⎺⎺");
console.log(
  script
    .split("\n")
    .map((line, i) => chalk.yellow(i + 1 + (i < 10 ? " " : "")) + "  " + line)
    .join("\n")
);

const mod = { exports: {} };
const sandbox = { ...global, module: mod, exports: mod.exports };
vm.runInNewContext(script, sandbox, {
  filename: bundlePath,
});
