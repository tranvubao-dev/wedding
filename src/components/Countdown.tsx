import { memo, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../config';

function remainingTime(target: string) {
  const raw = new Date(target).getTime() - Date.now();
  const difference = Number.isFinite(raw) ? Math.max(0, raw) : 0;
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor(difference / 3600000) % 24,
    minutes: Math.floor(difference / 60000) % 60,
    seconds: Math.floor(difference / 1000) % 60,
  };
}

export default memo(function Countdown({ target, dateLine }: { target: string; dateLine: string }) {
  const copy = WEDDING_CONFIG.copy.invitationView;
  const [timeLeft, setTimeLeft] = useState(() => remainingTime(target));
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => setTimeLeft(remainingTime(target));
    const visibility = () => {
      clearInterval(timer);
      if (!document.hidden) {
        update();
        timer = setInterval(update, 1000);
      }
    };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [target]);
  return (
    <section className="countdown-section" aria-labelledby="countdown-title">
      <div className="countdown-panel">
        <div className="countdown-ornament" aria-hidden="true">
          <span />
          <Heart size={18} />
          <span />
        </div>
        <p className="wedding-eyebrow">{copy.countdownEyebrow}</p>
        <h3 id="countdown-title" className="countdown-title font-serif">
          {copy.countdownTitle}
        </h3>
        <div className="countdown-grid">
          {[
            { unit: 'days', value: timeLeft.days, label: copy.days },
            { unit: 'hours', value: timeLeft.hours, label: copy.hours },
            { unit: 'minutes', value: timeLeft.minutes, label: copy.minutes },
            { unit: 'seconds', value: timeLeft.seconds, label: copy.seconds },
          ].map(({ unit, value, label }) => (
            <div key={unit} className={`countdown-unit countdown-unit-${unit}`}>
              <div className="countdown-number-frame">
                <motion.span
                  key={`${unit}-${value}`}
                  initial={{ opacity: 0.4, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="countdown-number"
                >
                  {value.toString().padStart(2, '0')}
                </motion.span>
              </div>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
        <p className="countdown-date font-serif">{dateLine}</p>
      </div>
    </section>
  );
});
