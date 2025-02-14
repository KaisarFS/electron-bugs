import { Buffer } from 'buffer' // Polyfill untuk Buffer

// Tambahkan Buffer ke global scope
window.Buffer = Buffer

import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
// import { store } from './redux-miscellaneous/Store'
import Theme from './theme'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { AppRoutes } from '../routes'

const isProduction = process.env.NODE_ENV === 'production'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  isProduction ? (
    <HashRouter>
      <Provider store={store}>
        <Theme>
          <App />
        </Theme>
      </Provider>
    </HashRouter>
  ) : (
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <Theme>
            <App />
          </Theme>
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  )
)
