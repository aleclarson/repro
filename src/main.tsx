import React from 'react'
import ReactDOM from 'react-dom'
function useTest(name: string) {
  const [state, setState] = React.useState(0)
  console.log(name + '.render:', state)
  React.useEffect(() => {
    console.log(name + ':' + state)
    setState(1)
  })
  return state
}

function Root1() {
  const state = useTest('Root1')
  return (
    <div>
      {'' + state}
      {state && <Child1 />}
    </div>
  )
}
function Child1() {
  const state = useTest('Child1')
  return (
    <div>
      {'' + state}
      {state && <Child2 />}
    </div>
  )
}
function Child2() {
  const state = useTest('Child2')
  return <div>{'' + state}</div>
}

function Root2() {
  React.useEffect(() => {
    console.log('Root2')
  }, [])
  return null
}

ReactDOM.render(<Root1 />, document.querySelector('#root1'))
ReactDOM.render(<Root2 />, document.querySelector('#root2'))
