const { join } = require('path')

const nodeModules = join(__dirname, 'node_modules')
const reactPkgJson = join(nodeModules, 'react', 'package.json')

module.exports = {
  resolver: {
    extraNodeModules: {
      // Help the React renderer find react-native
      'react-native': nodeModules,
    },
    rewriteImport(moduleName, context) {
      if (moduleName == 'react') {
        // Ensure only one React copy exists
        return context.getPackageMainPath(reactPkgJson)
      }
      return moduleName
    },
  },
}
