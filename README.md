# Repro for NativeScript/NativeScript#11472

The `/ns/m` CSS branch transforms `${spec}?inline` on the
workspace-root-relative spec it was handed. When the CSS file lives in a
sibling workspace package (outside vite `root`), that transform can't
resolve — the branch falls through and the device receives the web CSS
module calling `__vite__updateStyle`, which is undefined on NativeScript.

## Run

```sh
npm install
node repro.mjs
```

## Expected

All three probes show `export default "<css>"`, or at minimum the device
never receives a DOM-oriented module.

## Actual

```
A  transformRequest("/pkgs/ui/style.css?inline")
   -> "THREW: Denied ID /pkgs/ui/style.css?inline"
B  transformRequest("/@fs<abs>/style.css")  [what the device gets]
   contains __vite__updateStyle: true
C  transformRequest("/@fs<abs>/style.css?inline")  [wanted shape]
   -> "export default \":root { color: red; }\\n\""
-> BUG: the spec form the CSS branch uses cannot resolve outside vite root
```

Suggested fix direction: resolve the spec to `/@fs/<abs>` before appending
`?inline`.
