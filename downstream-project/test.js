const reducer = require('./reducer')

const initialState = { name: 'john' }

const newState = reducer(initialState, { type: 'CAPITALIZE_NAME' })

console.log(JSON.stringify(initialState) + ' -> ' + JSON.stringify(newState))
