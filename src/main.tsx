import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Enable Fast Refresh for development
if (import.meta.hot) {
  import.meta.hot.accept()
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)