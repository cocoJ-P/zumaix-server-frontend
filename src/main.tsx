import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/globals.css';
import './styles/layout.css';
import './styles/intelligence.css';
import './styles/submissions.css';
import './styles/discoveries.css';
import './styles/discovery-feedback.css';
import './styles/service-cases.css';
import './styles/opportunities.css';
import './styles/crawls.css';
import './styles/enterprises.css';
import './styles/leads.css';
import './styles/dashboard.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
