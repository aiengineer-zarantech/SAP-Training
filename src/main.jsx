import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const root = document.getElementById('root');
const app = <StrictMode><App /></StrictMode>;
// Pages are prerendered at build time, so hydrate. Fall back to a fresh render in dev.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
