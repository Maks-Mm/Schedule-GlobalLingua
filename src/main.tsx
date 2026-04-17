//src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';
import './styles/sidebar.css';
import './styles/toast.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);