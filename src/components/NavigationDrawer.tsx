/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, Calendar, MailCheck, Settings, X, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WEDDING_CONFIG } from '../config';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelect: (tab: string) => void;
  isAdmin: boolean;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelect,
  isAdmin
}: NavigationDrawerProps) {
  const copy = WEDDING_CONFIG.copy.navigation;
  const appCopy = WEDDING_CONFIG.copy.app;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 z-[55]"
          />

          {/* Drawer Panel Container */}
          <motion.div
            initial={{ translateX: '-100%' }}
            animate={{ translateX: 0 }}
            exit={{ translateX: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 left-0 z-[60] flex flex-col py-8 bg-[#faf9f8] h-full w-80 shadow-2xl border-r border-[#e3d1b4]/40"
          >
            {/* Header branding block */}
            <div className="px-8 mb-8 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold text-primary tracking-[0.25em] block mb-1 uppercase">
                  {copy.menuLabel}
                </span>
                <h3 className="font-serif text-2xl text-on-surface font-semibold tracking-tight">
                  {appCopy.brand}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#775a19] hover:bg-[#775a19]/10 p-2 rounded-full transition-colors focus:ring-1 focus:ring-primary/20"
                aria-label={copy.drawerClose}
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav items list */}
            <nav className="flex flex-col px-4 gap-1 flex-grow">

              {/* Invitation button */}
              <button
                onClick={() => onSelect('INVITATION')}
                className={`flex items-center gap-4 py-3.5 px-6 rounded-full transition-all text-left ${activeTab === 'INVITATION'
                    ? 'bg-[#775a19] text-white font-semibold shadow-sm'
                    : 'text-neutral-600 hover:bg-[#e6e3d4]/40'
                  }`}
              >
                <Sparkles size={18} className={activeTab === 'INVITATION' ? 'text-white' : 'text-[#775a19]'} />
                <span className="font-sans font-bold text-xs tracking-widest uppercase">
                  {copy.invitation}
                </span>
              </button>

              {/* Event details button */}
              <button
                onClick={() => onSelect('DETAILS')}
                className={`flex items-center gap-4 py-3.5 px-6 rounded-full transition-all text-left ${activeTab === 'DETAILS'
                    ? 'bg-[#775a19] text-white font-semibold shadow-sm'
                    : 'text-neutral-600 hover:bg-[#e6e3d4]/40'
                  }`}
              >
                <Calendar size={18} className={activeTab === 'DETAILS' ? 'text-white' : 'text-[#775a19]'} />
                <span className="font-sans font-bold text-xs tracking-widest uppercase">
                  {copy.details}
                </span>
              </button>

              {/* RSVP button */}
              <button
                onClick={() => onSelect('RSVP')}
                className={`flex items-center gap-4 py-3.5 px-6 rounded-full transition-all text-left ${activeTab === 'RSVP'
                    ? 'bg-[#775a19] text-white font-semibold shadow-sm'
                    : 'text-neutral-600 hover:bg-[#e6e3d4]/40'
                  }`}
              >
                <MailCheck size={18} className={activeTab === 'RSVP' ? 'text-white' : 'text-[#775a19]'} />
                <span className="font-sans font-bold text-xs tracking-widest uppercase">
                  {copy.rsvp}
                </span>
              </button>

              {/* Guest Admin manager portal */}
              {isAdmin && (
                <button
                  onClick={() => onSelect('ADMIN')}
                  className={`flex items-center gap-4 py-3.5 px-6 rounded-full transition-all text-left ${activeTab === 'ADMIN'
                      ? 'bg-[#775a19] text-white font-semibold shadow-sm'
                      : 'text-neutral-600 hover:bg-[#e6e3d4]/40'
                    }`}
                >
                  <Settings size={18} className={activeTab === 'ADMIN' ? 'text-white' : 'text-[#775a19]'} />
                  <span className="font-sans font-bold text-xs tracking-widest uppercase">
                    {copy.guests}
                  </span>
                </button>
              )}

            </nav>

            {/* Bottom branding or decorative panel */}
            <div className="pt-6 px-8 border-t border-[#e3d1b4]/40 text-center text-[#7f7667]/75">
              <div className="flex justify-center gap-1.5 mb-2">
                <HeartHandshake size={16} className="text-[#c5a059]" />
              </div>
              <p className="font-serif text-sm italic">"{appCopy.footerQuote}"</p>
              <p className="font-sans text-[10px] tracking-wide mt-1 text-neutral-400 capitalize">
                {appCopy.footerBrand}
              </p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
