import { readFile } from "node:fs/promises"
import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const root = new URL(".", import.meta.url)

await execFileAsync("pnpm", ["exec", "panda", "build", "-c", "panda.config.ts"], {
  cwd: root,
})

const css = await readFile(new URL("styled-system/styles.css", root), "utf8")
const mdRule = css.match(/@media[^\{]*\{[\s\S]*?\.md\\:.*?\{[\s\S]*?\}\s*\}/u)?.[0]

if (!mdRule?.includes("max-width: 48rem")) {
  throw new Error(`Expected the md selector to use max-width.\n${css}`)
}

if (mdRule.includes("min-width")) {
  throw new Error(`Expected the md selector not to use min-width.\n${mdRule}`)
}

console.log("md selector was overridden:")
console.log(mdRule)
