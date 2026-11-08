import { StrictMode } from 'react';
import { MotionConfig } from 'motion/react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WEDDING_CONFIG } from './config';

// Apply configured fonts before the first render, including Tailwind font utilities.
const fonts = WEDDING_CONFIG.fonts;
for (const family of ['sans', 'serif', 'mono', 'coupleNames'] as const) {
  document.documentElement.style.setProperty(`--wedding-font-${family}`, fonts[family]);
}
if (fonts.stylesheetUrl) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = fonts.stylesheetUrl;
  document.head.appendChild(stylesheet);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
