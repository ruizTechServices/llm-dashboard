import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx is running');
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

const renderApp = () => {
  try {
    console.log('Attempting to render React app');
    const root = document.getElementById('root');
    if (!root) {
      throw new Error('Root element not found');
    }
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('React app mounted successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
    // Display error message on the page
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `<h1>Error rendering app</h1><pre>${error}</pre>`;
    document.body.appendChild(errorDiv);
  }
}

renderApp();