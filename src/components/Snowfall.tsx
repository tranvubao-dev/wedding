import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { WEDDING_CONFIG } from '../config';

const random = (min: number, max: number) => min + Math.random() * (max - min);

export default function Snowfall() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { enabled, count } = WEDDING_CONFIG.effects.snow;
  const flakes = Number.isFinite(count) ? Math.min(40, Math.max(0, Math.round(count))) : 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || reducedMotion || !container) return;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let previousTime: number | null = null;
    let frame = 0;
    let elapsed = 0;
    let wind = random(-12, 12);
    let targetWind = wind;
    let nextGust = random(2, 5);

    const particles = Array.from(container.querySelectorAll<HTMLElement>('.snowflake')).map(
      (node) => {
        const size = random(12, 24);
        node.style.width = `${size}px`;
        node.style.height = `${size}px`;
        return {
          node,
          size,
          x: random(0, width),
          y: random(-40, height),
          depth: random(0.5, 1.2),
          baseSpeed: random(16, 34),
          speed: random(12, 28),
          fallFactor: random(0.6, 1.4),
          nextChange: random(1, 5),
          vx: random(-8, 8),
          rotation: random(0, 360),
          spin: random(-8, 8),
          phase: random(0, Math.PI * 2),
          sway: random(3, 12),
          frequency: random(0.3, 0.8),
          opacity: random(0.65, 0.93),
        };
      },
    );

    const resize = () => {
      const oldWidth = width || 1;
      const oldHeight = height || 1;
      width = container.clientWidth;
      height = container.clientHeight;
      particles.forEach((p) => {
        p.x *= width / oldWidth;
        p.y *= height / oldHeight;
      });
    };

    const tick = (time: number) => {
      // Integrate in seconds and cap long frames to avoid jumps after a pause.
      const dt = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      elapsed += dt;
      if (elapsed >= nextGust) {
        targetWind = random(-32, 32);
        nextGust = elapsed + random(3, 7);
      }
      wind += (targetWind - wind) * (1 - Math.exp(-dt * 0.45));
      for (const [index, p] of particles.entries()) {
        if (width <= 640 && index >= 14) continue;
        if (elapsed >= p.nextChange) {
          p.fallFactor = random(0.45, 1.5);
          p.spin = random(-12, 12);
          p.nextChange = elapsed + random(2, 6);
        }
        const targetX = wind * p.depth + Math.sin(elapsed * p.frequency + p.phase) * p.sway;
        p.vx += (targetX - p.vx) * (1 - Math.exp(-dt * 0.8));
        p.speed += (p.baseSpeed * p.fallFactor - p.speed) * (1 - Math.exp(-dt * 0.6));
        p.x += p.vx * dt;
        p.y += p.speed * dt;
        p.rotation += (p.spin + Math.sin(elapsed * 0.5 + p.phase) * 5) * dt;
        if (p.y > height + p.size) {
          // Each new fall starts at a fresh position and pace, rather than looping a path.
          p.y = -p.size - random(0, 60);
          p.x = random(0, width);
          p.baseSpeed = random(16, 34);
          p.phase = random(0, Math.PI * 2);
        }
        if (p.x < -p.size * 2) p.x = width + p.size;
        if (p.x > width + p.size * 2) p.x = -p.size;
        const fade = Math.max(0, Math.min(1, (p.y + p.size) / 45, (height + p.size - p.y) / 60));
        p.node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
        p.node.style.opacity = `${p.opacity * fade}`;
      }
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      previousTime = null;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    if (!document.hidden) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [enabled, reducedMotion, flakes]);

  if (!enabled || reducedMotion) return null;
  return (
    <div ref={containerRef} className="snowfall" aria-hidden="true">
      {Array.from({ length: flakes }, (_, index) => (
        <span className="snowflake" key={index}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            focusable="false"
          >
            <path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M9 5l3 3 3-3M9 19l3-3 3 3M4.5 10.5l4.1-1.1-1.1-4.1M16.5 18.7l-1.1-4.1 4.1-1.1M7.5 18.7l1.1-4.1-4.1-1.1M19.5 10.5l-4.1-1.1 1.1-4.1" />
          </svg>
        </span>
      ))}
    </div>
  );
}
