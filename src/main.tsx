import  { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { VoteProvider } from './context/VoteContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <VoteProvider>
        <App />
      </VoteProvider>
    </BrowserRouter>
  </StrictMode>
);
 