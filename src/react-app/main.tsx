import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/react-app/index.css';
import App from '@/react-app/App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in the document.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
