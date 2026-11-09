import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Gift, Heart, QrCode, ChevronUp } from 'lucide-react';
import { WEDDING_CONFIG } from '../config';

type Recipient = 'bride' | 'groom';

function GiftCard({ recipient }: { recipient: Recipient }) {
  const { copy, gifts, images, couple } = WEDDING_CONFIG;
  const text = copy.gifts;
  const info = gifts[recipient];
  const src = recipient === 'bride' ? images.qrBride : images.qrGroom;
  const name = recipient === 'bride' ? couple.brideName : couple.groomName;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const available = !!src && failedSrc !== src;
  return (
    <article className="gift-recipient" aria-label={`${text[recipient]} ${name}`}>
      <p className="wedding-eyebrow">{text[recipient]}</p>
      <h4 className="font-couple gift-recipient-name">{name}</h4>
      <div className="gift-qr-frame">
        {available ? (
          <img
            src={src}
            alt={`${text[recipient]} ${name} — mã QR nhận quà`}
            width="260"
            height="260"
            decoding="async"
            onError={() => setFailedSrc(src)}
          />
        ) : (
          <div className="gift-qr-pending">
            <QrCode size={40} strokeWidth={1} aria-hidden="true" />
            <p>{text.unavailable}</p>
          </div>
        )}
      </div>
      {available && <p className="gift-scan-hint">{info.demo ? text.demo : text.scan}</p>}
      {(info.bankName || info.accountName || info.accountNumber) && (
        <dl className="gift-bank-info">
          {info.bankName && (
            <div>
              <dt className="sr-only">Ngân hàng</dt>
              <dd>{info.bankName}</dd>
            </div>
          )}
          {info.accountName && (
            <div>
              <dt>{text.accountName}</dt>
              <dd>{info.accountName}</dd>
            </div>
          )}
          {info.accountNumber && (
            <div>
              <dt>{text.accountNumber}</dt>
              <dd>{info.accountNumber}</dd>
            </div>
          )}
        </dl>
      )}
    </article>
  );
}

export default function GiftPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const { gifts, copy, couple } = WEDDING_CONFIG;
  if (!gifts.enabled) return null;
  const text = copy.gifts;
  return (
    <div className="gift-section">
      <div className="gift-trigger-row">
        <button
          type="button"
          className="gift-trigger"
          aria-expanded={isOpen}
          aria-controls="wedding-gift-panel"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="gift-trigger-text">{isOpen ? text.close : text.button}</span>
          <span className="gift-trigger-icon metal-button">
            {isOpen ? (
              <ChevronUp size={23} aria-hidden="true" />
            ) : (
              <Gift size={24} strokeWidth={1.5} aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="wedding-gift-panel"
            role="region"
            aria-labelledby="gift-panel-title"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="gift-panel-reveal"
          >
            <div className="gift-panel stationery-panel">
              <Heart size={22} strokeWidth={1.2} className="gift-heart" aria-hidden="true" />
              <p className="wedding-eyebrow">{text.eyebrow}</p>
              <h3 id="gift-panel-title" className="font-serif gift-panel-title">
                {text.title}
              </h3>
              <p className="gift-thank-you">{text.thankYou}</p>
              <div className="gift-cards">
                <GiftCard recipient="bride" />
                <GiftCard recipient="groom" />
              </div>
              <p className="font-serif italic text-secondary mt-8">{text.footer}</p>
              <p className="font-couple gift-signature">
                {couple.groomName} &amp; {couple.brideName}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
