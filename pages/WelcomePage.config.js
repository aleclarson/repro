import React from 'react'
import { config, animated, useSpring } from 'react-spring'

const App = () => {
  const props = useSpring({
    from: { opacity: 0 },
    to: async next => {
      while (1) {
        await next({ opacity: 1, config: config.stiff })
        await next({ opacity: 0 })
      }
    },
  })
  return (
    <animated.div
      style={{
        ...props,
        backgroundColor: 'blue',
        width: 100,
        height: 100,
      }}
    />
  )
}

export default {
  route: '/',
  view: App,
  title: 'react-spring repro', // <title>
  doNotRenderInBrowser: false,
}
