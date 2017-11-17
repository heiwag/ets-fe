import React from 'react'
import { Provider } from 'mobx-react'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter as Router } from 'react-router-dom'
import routes from 'routes'
import rootStore from './stores/root'
import './App.scss'

const App = () => (
  <Provider {...rootStore.stores}>
    <Router>
      {renderRoutes(routes)}
    </Router>
  </Provider>
)

export default App
