// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';
import './styles/sidebar.css';
import './styles/toast.css';
import './styles/confirm.css';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);