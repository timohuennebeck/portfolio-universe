import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import GalaxyPortfolio from './GalaxyPortfolio.jsx';

// Deliberately not wrapped in StrictMode: its double mount/unmount in
// development tears down the WebGL context and then asks for a second one on
// the same canvas, which the browser will not grant.
createRoot(document.getElementById('root')).render(<GalaxyPortfolio />);
