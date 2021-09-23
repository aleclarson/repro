import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { DecoratedClass } from './DecoratedClass'

const deco = new DecoratedClass()
deco.hello()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
