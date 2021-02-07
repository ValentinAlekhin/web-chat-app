import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Join from './pages/Join/Join.jsx'
import Chat from './pages/Chat/Chat.jsx'

const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/chat" exact component={Chat} />
  </Router>
)

export default App
