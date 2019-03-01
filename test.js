const HasteMap = require('jest-haste-map')
const hasFlag = require('has-flag')
const path = require('path')

const rootDir = path.resolve('a')
const hasteMap = new HasteMap({
  name: 'test',
  roots: [rootDir],
  rootDir,
  extensions: ['js', 'json'],
  platforms: [],
  resetCache: hasFlag('--resetCache'),
  retainAllFiles: true,
  maxWorkers: 0,
  watch: true,
})

const onChange = ({hasteFS, moduleMap}) => {
  console.log('')
  console.log('hasteFS:', hasteFS)
  console.log('moduleMap:', moduleMap)
}

hasteMap.build().then(({hasteFS, moduleMap}) => {
  onChange({hasteFS, moduleMap})
  hasteMap.on('change', onChange)
  performChanges()
})

function performChanges() {
  const fs = require('fs')
  const lnf = require('lnf')
  const chalk = require('chalk')

  const linkPath = 'a/node_modules/b'

  q(() => {
    console.log(chalk.yellow('Change symlink:'))
    lnf.sync('../../c', linkPath)
  })

  q(() => {
    console.log(chalk.red('Remove symlink:'))
    fs.unlinkSync(linkPath)
  })

  q(() => {
    console.log(chalk.green('Add symlink:'))
    fs.symlinkSync('../../b', linkPath)
  })

  q(() => {
    console.log(chalk.yellow('Rename symlink:'))
    fs.renameSync(linkPath, linkPath + '2')
  })

  q(() => {
    hasteMap.end()
    fs.renameSync(linkPath + '2', linkPath)
  })
}

const queue = []
function q(fn) {
  if (queue.push(fn) == 1) {
    next()
  }
}
function next() {
  queue[0]()
  setTimeout(() => {
    queue.shift()
    if (queue.length) {
      next()
    }
  }, 250)
}
