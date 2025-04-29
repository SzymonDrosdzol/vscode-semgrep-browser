import React from 'react';
import ReactDOM from 'react-dom/client';
import { SemgrepBrowserApp } from './semgrepBrowserApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SemgrepBrowserApp />
  </React.StrictMode>
);
