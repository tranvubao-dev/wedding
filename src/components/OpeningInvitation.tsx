import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { WEDDING_CONFIG } from '../config';

interface Props {
  guestName: string;
  guestGroup: string;
  onOpen: () => void;
}

export default function OpeningInvitation({ guestName, guestGroup, onOpen }: Props) {
  const reducedMotion = useReducedMotion();
  const { couple, copy, images, guestSchedules } = WEDDING_CONFIG;
  const schedule =
    guestGroup === copy.adminView.groupOptions[1] ? guestSchedules.bride : guestSchedules.groom;
  return (
    <motion.section
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
      className="opening-invitation botanical-overlay"
      initial={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: '-8%' }}
      transition={{ duration: reducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="opening-paper">
        <span className="paper-corner paper-corner-top" aria-hidden="true" />
        <span className="paper-corner paper-corner-bottom" aria-hidden="true" />
        <p className="wedding-eyebrow">{copy.experience.openingEyebrow}</p>
        <div className="opening-monogram">
          <img
            src={images.monogram}
            alt="Logo NB"
            width="210"
            height="109"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <h1 id="opening-title" className="font-couple opening-names">
          <span className="inline-block whitespace-nowrap">{couple.groomName}</span>
          {' & '}
          <span className="inline-block whitespace-nowrap">{couple.brideName}</span>
        </h1>
        <div className="fine-rule" />
        <p className="font-serif text-xl italic text-secondary">{schedule.dateLine}</p>
        <p className="wedding-eyebrow mt-8">{copy.invitationView.invitationTo}</p>
        <p className="font-serif text-2xl sm:text-3xl mt-2 mb-8">{guestName}</p>
        <button autoFocus onClick={onOpen} className="opening-button metal-button">
          {copy.experience.openInvitation}
          <ArrowDown size={15} aria-hidden="true" />
        </button>
        <p className="text-xs text-secondary mt-5 leading-relaxed">{copy.experience.openingNote}</p>
      </div>
    </motion.section>
  );
}
