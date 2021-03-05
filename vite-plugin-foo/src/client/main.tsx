import React from 'react'
import ReactDOM from 'react-dom'
import Main from '\0main'

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
)

if (import.meta.hot) {
  import.meta.hot!.accept(module => {
    alert('Hot update received')
  })
}
