const { produce } = require('immer')
const capitalizeNameSubreducer = require('capitalize-name-subreducer')

const appReducer = (state, action) => produce(state, (draft) => {
  switch (action.type) {
    case 'CAPITALIZE_NAME':
      capitalizeNameSubreducer(draft)
      break
  }
})

module.exports = appReducer
