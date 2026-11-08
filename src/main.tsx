import { StrictMode } from 'react';
import { MotionConfig } from 'motion/react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WEDDING_CONFIG } from './config';
import { optimizedImage, responsiveImage } from './imageUtils';

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

// Warm a small set of photos once the first screen is idle; respect data-saving networks.
const connection = (
  navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
).connection;
if (!connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType || '')) {
  const warmPhotos = () => {
    const photos = [
      {
        src: WEDDING_CONFIG.images.invitationPortrait,
        sizes: '(max-width: 960px) calc(100vw - 48px), 912px',
      },
      {
        src: WEDDING_CONFIG.content.albumImages[0]?.url,
        sizes: '(max-width: 1140px) calc(100vw - 48px), 1092px',
      },
    ];
    photos.forEach(({ src, sizes }) => {
      if (!src) return;
      const image = new Image();
      image.decoding = 'async';
      image.fetchPriority = 'low';
      image.sizes = sizes;
      image.srcset = responsiveImage(src) || '';
      image.src = optimizedImage(src, 960);
    });
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(warmPhotos, { timeout: 3000 });
  else setTimeout(warmPhotos, 1500);
}
