import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './main/App';
import './main/style.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
