const {watch} = require('chokidar')

watch('packages/*/package.json')
  .on('add', p => console.log('add:', p))
  .on('ready', () => {
    console.log('ready')
    process.exit()
  })
