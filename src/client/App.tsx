import React, { useEffect } from 'react'

import logo from './logo.svg'
import './App.css'

export const App: React.FunctionComponent = () => {
  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((data) => console.log(data))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React adsga sdg
        </a>
      </header>
    </div>
  )
}
