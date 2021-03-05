import type { Plugin } from 'vite'
import path from 'path'

type PluginConfig = {
  main: string
}

export default (config: PluginConfig): Plugin => {
  const mainModuleId = '\0main'
  const entryModuleId = '@foo/main.js'
  return {
    name: 'vite:foo',
    resolveId(id) {
      if (id === mainModuleId) {
        return id
      }
      if (id === entryModuleId) {
        return path.resolve(__dirname, '../client/main.js')
      }
    },
    load(id) {
      // This misdirection is where the HMR dead end appears.
      if (id === mainModuleId) {
        return `export {default} from "/${config.main}"`
      }
    },
  }
}
