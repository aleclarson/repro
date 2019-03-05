const { produce, isDraft } = require('immer')

// applies immer if upstream isn't using it, otherwise re-uses already proxied object
const withImmer = (state, worker) => {
  isDraft(state)
    ? worker(state, worker)
    : produce(state, worker)
}

const capitalizeNameSubreducer = (state) => withImmer(state, (draft) => {
  draft.name = draft.name.replace(/^\w/, c => c.toUpperCase())
})

module.exports = capitalizeNameSubreducer

