import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './nav.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './themeContext';
import { useState } from 'react';
const root = ReactDOM.createRoot(document.getElementById('root'));
document.body.style.backgroundColor = 'green';
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
