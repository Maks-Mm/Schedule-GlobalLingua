//src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css'; // Only import your global CSS
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);