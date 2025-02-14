import React, { StrictMode } from 'react'
import { ReactDOM } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.css'
import App from './App.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <BrowserRouter>
    
    <App />

    </BrowserRouter>
  </StrictMode>,
)
