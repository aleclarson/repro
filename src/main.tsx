import React from 'react'
import { AppRegistry, View, Text } from 'react-native'

function useTest(name: string) {
  const [state, setState] = React.useState(false)
  console.log(name + '.render:', state)
  React.useEffect(() => {
    console.log(name + ':' + state)
    setState(true)
  })
  return state
}

function Root1() {
  const state = useTest('Root1')
  return (
    <View>
      <Text>{'' + state}</Text>
      {state && <Child1 />}
    </View>
  )
}
function Child1() {
  const state = useTest('Child1')
  return (
    <View>
      <Text>{'' + state}</Text>
      {state && <Child2 />}
    </View>
  )
}
function Child2() {
  const state = useTest('Child2')
  return <Text>{'' + state}</Text>
}

function Root2() {
  React.useEffect(() => {
    console.log('Root2')
  }, [])
  return null
}

AppRegistry.registerComponent('Root1', () => Root1)
AppRegistry.registerComponent('Root2', () => Root2)
