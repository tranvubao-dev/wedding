/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, Lock, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Guest } from './types';
import { INITIAL_GUESTS } from './data';
import { WEDDING_CONFIG } from './config';
import { WEDDING_IMAGES } from './images.config';
import NavigationDrawer from './components/NavigationDrawer';
import InvitationView from './components/InvitationView';
import EventDetailsView from './components/EventDetailsView';
import RsvpView from './components/RsvpView';
import GuestAdminView from './components/GuestAdminView';
import Toast from './components/Toast';

type ActiveTab = 'INVITATION' | 'DETAILS' | 'RSVP' | 'ADMIN';

const normalizeGuestGroup = (group: string, relation: Guest['relation'] = 'NONE') => {
  const groupCopy = WEDDING_CONFIG.copy.adminView;
  const [groomGroup, brideGroup] = groupCopy.groupOptions;
  const validGroups: readonly string[] = groupCopy.groupOptions;
  const legacyBrideGroups: readonly string[] = groupCopy.legacyBrideGroups;
  const legacyGroomGroups: readonly string[] = groupCopy.legacyGroomGroups;

  if (validGroups.includes(group)) return group;
  if (legacyBrideGroups.includes(group)) return brideGroup;
  if (legacyGroomGroups.includes(group)) return groomGroup;
  return relation === 'BRIDE' ? brideGroup : groomGroup;
};

export default function App() {
  const copy = WEDDING_CONFIG.copy;
  const [activeTab, setActiveTab] = useState<ActiveTab>('INVITATION');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [currentGuestName, setCurrentGuestName] = useState<string>(copy.common.guest);
  const [currentGuestGroup, setCurrentGuestGroup] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    document.title = copy.app.pageTitle;
  }, [copy.app.pageTitle]);

  // Admin authentication states
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Dynamic App Theme States
  const [themeTone, setThemeTone] = useState(() => {
    return localStorage.getItem('wedding_theme_tone') || WEDDING_CONFIG.colors.primary;
  });
  const [themeAccent, setThemeAccent] = useState(() => {
    return localStorage.getItem('wedding_theme_accent') || WEDDING_CONFIG.colors.accent;
  });

  const handleThemeChange = (tone: string, accent: string) => {
    setThemeTone(tone);
    setThemeAccent(accent);
    localStorage.setItem('wedding_theme_tone', tone);
    localStorage.setItem('wedding_theme_accent', accent);
  };

  // Background Music States
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userManuallyPaused = useRef(false);

  // Background Music Management Effect
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://res.cloudinary.com/dp2vpbmjg/video/upload//fl_attachment:wedding_murjqb//v1781189747/wedding_murjqb.mp3?_s=public-apps');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }

    const audio = audioRef.current;

    // Try starting audio immediately
    const startAudio = () => {
      if (userManuallyPaused.current) return;
      audio.play()
        .then(() => {
          setIsMusicPlaying(true);
          // Remove event listeners once play commences successfully
          removeInteractionListeners();
        })
        .catch(err => {
          // Failure is expected when the browser blocks un-triggered autoplay initially
          console.log(copy.logs.autoplayBlocked);
        });
    };

    // Fallback callbacks
    const handleInteraction = () => {
      startAudio();
    };

    const addInteractionListeners = () => {
      window.addEventListener('click', handleInteraction, { once: true });
      window.addEventListener('scroll', handleInteraction, { once: true });
      window.addEventListener('touchstart', handleInteraction, { once: true });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    // Attempt immediately
    startAudio();

    // Setup fallback trigger
    addInteractionListeners();

    return () => {
      removeInteractionListeners();
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      userManuallyPaused.current = true;
      setIsMusicPlaying(false);
    } else {
      userManuallyPaused.current = false;
      audioRef.current.play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch(err => {
          console.warn(copy.logs.audioPlayFailed, err);
        });
    }
  };

  // Initialize guest list and check URL search parameters
  useEffect(() => {
    // 1. Local Storage initialization
    const storedGuests = localStorage.getItem('eternal_wedding_guests');
    let loadedGuests: Guest[] = INITIAL_GUESTS;
    if (storedGuests) {
      try {
        const parsedGuests: unknown = JSON.parse(storedGuests);
        if (Array.isArray(parsedGuests)) {
          loadedGuests = parsedGuests;
        }
      } catch (e) {
        console.error(copy.logs.guestsParseFailed, e);
      }
    }
    const normalizedGuests = loadedGuests.map((guest) => ({
      ...guest,
      group: normalizeGuestGroup(guest.group || '', guest.relation),
    }));
    setGuests(normalizedGuests);
    localStorage.setItem('eternal_wedding_guests', JSON.stringify(normalizedGuests));

    // 2. URL Params parsing
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');
    const groupParam = urlParams.get('group');

    if (toParam) {
      setCurrentGuestName(toParam);
    }
    if (groupParam) {
      setCurrentGuestGroup(normalizeGuestGroup(groupParam));
    }

    // Restore admin access only from the current tab's authenticated session.
    const isStoredAdmin = sessionStorage.getItem('eternal_wedding_admin') === 'true';
    if (isStoredAdmin) {
      setIsAdmin(true);
    }
  }, []);

  const saveGuestsToStorage = (updatedGuests: Guest[]) => {
    setGuests(updatedGuests);
    localStorage.setItem('eternal_wedding_guests', JSON.stringify(updatedGuests));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  const handleAddGuest = (name: string, group: string) => {
    const newGuest: Guest = {
      id: `g_${Date.now()}`,
      name,
      group: normalizeGuestGroup(group),
      status: 'DRAFT',
      rsvpStatus: 'PENDING',
      guestsCount: 1,
      relation: 'NONE',
      updatedAt: new Date().toISOString()
    };
    const updated = [newGuest, ...guests];
    saveGuestsToStorage(updated);
    triggerToast(copy.toast.guestAdded.replace('{name}', name));
  };

  const handleDeleteGuest = (id: string) => {
    const targetGuest = guests.find(g => g.id === id);
    const updated = guests.filter(g => g.id !== id);
    saveGuestsToStorage(updated);
    if (targetGuest) {
      triggerToast(copy.toast.guestDeleted.replace('{name}', targetGuest.name));
    }
  };

  // Quick RSVP Submit from main view
  const handleRsvpSubmit = (name: string, attending: boolean, count: number) => {
    const matchedIdx = guests.findIndex(g => g.name.toLowerCase() === name.toLowerCase());

    if (matchedIdx !== -1) {
      const updated = [...guests];
      updated[matchedIdx] = {
        ...updated[matchedIdx],
        rsvpStatus: attending ? 'ATTENDING' : 'DECLINED',
        status: 'CONFIRMED',
        guestsCount: count,
        updatedAt: new Date().toISOString()
      };
      saveGuestsToStorage(updated);
    } else {
      // Add as new guest
      const newGuest: Guest = {
        id: `g_${Date.now()}`,
        name,
        group: normalizeGuestGroup(currentGuestGroup),
        status: 'CONFIRMED',
        rsvpStatus: attending ? 'ATTENDING' : 'DECLINED',
        guestsCount: count,
        relation: 'NONE',
        updatedAt: new Date().toISOString()
      };
      saveGuestsToStorage([newGuest, ...guests]);
    }
    triggerToast((attending ? copy.toast.rsvpAttending : copy.toast.rsvpReceived).replace('{name}', name));
  };

  // Complete RSVP form submission from RSVP tab
  const handleRsvpComplete = (guestData: Partial<Guest>) => {
    const name = guestData.name || '';
    const matchedIdx = guests.findIndex(g => g.name.toLowerCase() === name.toLowerCase());

    if (matchedIdx !== -1) {
      const updated = [...guests];
      updated[matchedIdx] = {
        ...updated[matchedIdx],
        ...guestData,
        updatedAt: new Date().toISOString()
      } as Guest;
      saveGuestsToStorage(updated);
    } else {
      const newGuest: Guest = {
        id: `g_${Date.now()}`,
        name,
        group: normalizeGuestGroup(currentGuestGroup, guestData.relation || 'GROOM'),
        status: 'CONFIRMED',
        rsvpStatus: guestData.rsvpStatus || 'ATTENDING',
        guestsCount: guestData.guestsCount ?? 1,
        relation: guestData.relation || 'NONE',
        blessing: guestData.blessing,
        updatedAt: new Date().toISOString()
      };
      saveGuestsToStorage([newGuest, ...guests]);
    }
    triggerToast(copy.toast.rsvpTabReceived.replace('{name}', name));
  };

  const handleAddQuickBlessing = (name: string, blessing: string) => {
    const matchedIdx = guests.findIndex(g => g.name.toLowerCase() === name.toLowerCase());
    if (matchedIdx !== -1) {
      const updated = [...guests];
      updated[matchedIdx] = {
        ...updated[matchedIdx],
        blessing: blessing,
        status: 'CONFIRMED',
        updatedAt: new Date().toISOString()
      };
      saveGuestsToStorage(updated);
    } else {
      const newGuest: Guest = {
        id: `g_${Date.now()}`,
        name,
        group: normalizeGuestGroup(currentGuestGroup),
        status: 'CONFIRMED',
        rsvpStatus: 'PENDING',
        guestsCount: 0,
        relation: 'NONE',
        blessing: blessing,
        updatedAt: new Date().toISOString()
      };
      saveGuestsToStorage([newGuest, ...guests]);
    }
    triggerToast(copy.toast.blessingAdded);
  };

  // Trigger previewing a custom invitation for a guest
  const handlePreviewGuest = (guest: Guest) => {
    setCurrentGuestName(guest.name);
    setCurrentGuestGroup(guest.group);
    setActiveTab('INVITATION');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(copy.toast.previewGuest.replace('{name}', guest.name));
  };

  const handleNavigateToDetails = () => {
    setActiveTab('DETAILS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRsvp = () => {
    setActiveTab('RSVP');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPIN = passcodeInput.trim();
    // Valid admin test PINs: 2512 (wedding date 25/12), 1204, or 1234
    if ((copy.adminLogin.allowedPins as readonly string[]).includes(cleanPIN)) {
      setIsAdmin(true);
      sessionStorage.setItem('eternal_wedding_admin', 'true');
      setShowPasscodeModal(false);
      setPasscodeInput('');
      setPasscodeError('');
      setActiveTab('ADMIN');
      triggerToast(copy.adminLogin.loginSuccess);
    } else {
      setPasscodeError(copy.adminLogin.wrongPin);
    }
  };

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container botanical-overlay min-h-screen flex flex-col overflow-x-hidden">

      {/* Dynamic Theme Color Overrides */}
      <style>{`
        :root {
          --color-primary: ${themeTone} !important;
          --color-primary-container: ${themeAccent} !important;
          --color-surface-tint: ${themeTone} !important;
          --color-outline: ${themeTone}80 !important;
        }
        
        /* Overrides for hardcoded arbitrary classes referencing old colors */
        .bg-\[\#775a19\] {
          background-color: ${themeTone};
        }
        .text-\[\#775a19\] {
          color: ${themeTone};
        }
        .border-\[\#775a19\] {
          border-color: ${themeTone};
        }
        .hover\:bg-\[\#775a19\]:hover {
          background-color: ${themeTone};
        }
        .hover\:text-\[\#775a19\]:hover {
          color: ${themeTone};
        }
        .hover\:border-\[\#775a19\]:hover {
          border-color: ${themeTone};
        }
        .focus-within\:border-\[\#775a19\]:focus-within {
          border-color: ${themeTone};
        }
        .active\:border-\[\#775a19\]:active {
          border-color: ${themeTone};
        }
        .focus\:border-\[\#775a19\]:focus {
          border-color: ${themeTone};
        }
        .bg-\[\#775a19\]\/10 {
          background-color: ${themeTone}1a;
        }
        .bg-\[\#775a19\]\/5 {
          background-color: ${themeTone}0d;
        }
        .bg-\[\#775a19\]\/12 {
          background-color: ${themeTone}1f;
        }
        .hover\:bg-\[\#775a19\]\/10:hover {
          background-color: ${themeTone}1a;
        }
        .hover\:bg-\[\#775a19\]\/12:hover {
          background-color: ${themeTone}1f;
        }

        .bg-\[\#c5a059\] {
          background-color: ${themeAccent};
        }
        .text-\[\#c5a059\] {
          color: ${themeAccent};
        }
        .border-\[\#c5a059\] {
          border-color: ${themeAccent};
        }
        .hover\:bg-\[\#c5a059\]:hover {
          background-color: ${themeAccent};
        }
        .text-\[\#c5a059\]\/10 {
          color: ${themeAccent}1a;
        }
        .bg-\[\#e6e3d4\] {
          background-color: ${themeTone}13;
        }
        .border-\[\#e3d1b4\] {
          border-color: ${themeTone}3b;
        }
        .border-\[\#d1c5b4\] {
          border-color: ${themeTone}4d;
        }
        
        .luxury-card:hover {
          box-shadow: 0 10px 30px -15px ${themeTone}14 !important;
          border-color: ${themeTone}59 !important;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${themeTone}3b !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${themeTone} !important;
        }
      `}</style>

      {/* Top Application Header Bar */}
      <header className="bg-white border-b border-outline-variant fixed top-0 left-0 right-0 z-50 h-16 transition-all shadow-sm">
        <div className="flex justify-between items-center w-full px-5 md:px-16 h-full">

          {/* Hamburger menu & Brand Label */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="text-[#775a19] hover:opacity-80 transition-opacity p-1.5 focus:outline-none focus:ring-1 focus:ring-primary/20 rounded"
              aria-label={copy.accessibility.toggleNavigation}
            >
              <Menu size={22} />
            </button>
            <h1 className="font-serif text-xl md:text-2xl text-[#775a19] font-semibold tracking-tight select-none">
              {copy.app.brand}
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => { setActiveTab('INVITATION'); window.scrollTo({ top: 0 }); }}
              className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${activeTab === 'INVITATION' ? 'text-[#775a19]' : 'text-[#605f53] hover:text-[#775a19]'
                }`}
            >
              {copy.navigation.invitation}
              {activeTab === 'INVITATION' && (
                <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#775a19]" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('DETAILS'); window.scrollTo({ top: 0 }); }}
              className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${activeTab === 'DETAILS' ? 'text-[#775a19]' : 'text-[#605f53] hover:text-[#775a19]'
                }`}
            >
              {copy.navigation.details}
              {activeTab === 'DETAILS' && (
                <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#775a19]" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('RSVP'); window.scrollTo({ top: 0 }); }}
              className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${activeTab === 'RSVP' ? 'text-[#775a19]' : 'text-[#605f53] hover:text-[#775a19]'
                }`}
            >
              {copy.navigation.rsvp}
              {activeTab === 'RSVP' && (
                <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#775a19]" />
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => { setActiveTab('ADMIN'); window.scrollTo({ top: 0 }); }}
                className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${activeTab === 'ADMIN' ? 'text-[#775a19]' : 'text-[#605f53] hover:text-[#775a19]'
                  }`}
              >
                {copy.navigation.guests}
                {activeTab === 'ADMIN' && (
                  <motion.div layoutId="activeNavIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#775a19]" />
                )}
              </button>
            )}
          </nav>

          {/* User Status representation icon */}
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveTab('ADMIN');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-[#775a19] hover:opacity-85 transition-opacity flex items-center gap-1.5 focus:outline-none py-1.5 px-3 rounded border border-[#775a19]/20 bg-[#775a19]/5 text-xs font-sans font-bold uppercase tracking-wider"
                  title={copy.navigation.guests}
                >
                  <User size={15} />
                  <span className="hidden sm:inline">{copy.adminLogin.adminButton}</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdmin(false);
                    sessionStorage.removeItem('eternal_wedding_admin');
                    setActiveTab('INVITATION');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    triggerToast(copy.adminLogin.logout);
                  }}
                  className="text-red-700 hover:text-red-900 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-[10px] font-sans font-bold py-1.5 px-2.5 rounded uppercase tracking-wider"
                  title={copy.adminLogin.logoutButton}
                >
                  Thoát
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowPasscodeModal(true);
                  setPasscodeInput('');
                  setPasscodeError('');
                }}
                className="text-[#605f53] hover:text-[#775a19] transition-colors p-1.5 focus:outline-none border border-transparent hover:border-[#775a19]/25 rounded-full"
                title={copy.adminLogin.loginTitle}
              >
                <User size={20} />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Slideout Mobile Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        isAdmin={isAdmin}
        onSelect={(tab) => {
          if (tab === 'ADMIN' && !isAdmin) {
            setShowPasscodeModal(true);
            setIsDrawerOpen(false);
            return;
          }
          setActiveTab(tab as ActiveTab);
          setIsDrawerOpen(false);
          window.scrollTo({ top: 0 });
        }}
      />

      {/* Main Subview Canvas */}
      <main className="pt-16 flex-grow flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeTab === 'INVITATION' ? currentGuestName : '')}
            initial={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center"
          >
            {activeTab === 'INVITATION' && (
              <InvitationView
                guestName={currentGuestName}
                guestGroup={currentGuestGroup}
                onRsvpSubmit={handleRsvpSubmit}
                onNavigateToDetails={handleNavigateToDetails}
                guests={guests}
                onAddQuickBlessing={handleAddQuickBlessing}
              />
            )}

            {activeTab === 'DETAILS' && (
              <EventDetailsView
                onNavigateToRsvp={handleNavigateToRsvp}
                guestGroup={currentGuestGroup}
              />
            )}

            {activeTab === 'RSVP' && (
              <RsvpView
                currentGuestName={currentGuestName}
                onRsvpComplete={handleRsvpComplete}
              />
            )}

            {activeTab === 'ADMIN' && (
              <div className="w-full max-w-[1140px] px-6 py-12">
                <GuestAdminView
                  guests={guests}
                  onAddGuest={handleAddGuest}
                  onDeleteGuest={handleDeleteGuest}
                  onPreviewGuest={handlePreviewGuest}
                  onTriggerCopyToast={(name) => triggerToast(copy.toast.copiedGuestLink.replace('{name}', name))}
                  themeTone={themeTone}
                  themeAccent={themeAccent}
                  onChangeTheme={handleThemeChange}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Styled Luxury Wedding Footer */}
      <footer className="bg-white border-t border-outline-variant w-full py-12 flex flex-col items-center justify-center space-y-4 px-5 mt-auto">
        <h2 className="font-serif text-2xl text-[#775a19] font-semibold tracking-tight">
          {copy.app.brand}
        </h2>
        <p className="font-sans text-xs text-neutral-400 text-center max-w-md">
          {copy.app.footerCopyright}
        </p>
        <div className="flex gap-8 mt-2">
          <a href="#" className="font-sans font-semibold text-[11px] text-[#605f53] hover:text-[#775a19] transition-colors uppercase tracking-[0.1em]">
            {copy.app.privacy}
          </a>
          <a href="#" className="font-sans font-semibold text-[11px] text-[#605f53] hover:text-[#775a19] transition-colors uppercase tracking-[0.1em]">
            {copy.app.contact}
          </a>
        </div>
      </footer>

      {/* Passcode verification Modal overlay */}
      <AnimatePresence>
        {showPasscodeModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasscodeModal(false)}
              className="fixed inset-0 bg-black/60 z-[65]"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, translateY: 20 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, translateY: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 m-auto w-[90%] max-w-md h-fit bg-[#faf9f8] p-8 rounded border border-[#e3d1b4] shadow-2xl z-[70] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPasscodeModal(false)}
                className="absolute top-4 right-4 text-[#775a19] hover:bg-[#775a19]/10 p-2 rounded-full transition-colors focus:ring-1 focus:ring-primary/20"
                aria-label={copy.adminLogin.close}
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-[#775a19]/10 text-[#775a19] rounded-full flex items-center justify-center mx-auto">
                  <Lock size={20} />
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-on-surface">{copy.adminLogin.title}</h3>
                  <p className="font-sans text-xs text-[#605f53] mt-1 leading-relaxed">
                    {copy.adminLogin.description}
                  </p>
                </div>

                <form onSubmit={handleVerifyPasscode} className="space-y-4 pt-2">
                  <div className="text-left">
                    <label className="font-sans font-bold text-[10px] text-[#605f53] block tracking-widest uppercase mb-1">
                      {copy.adminLogin.pinLabel}
                    </label>
                    <input
                      type="password"
                      required
                      placeholder={copy.adminLogin.pinPlaceholder}
                      value={passcodeInput}
                      onChange={(e) => {
                        setPasscodeInput(e.target.value);
                        setPasscodeError('');
                      }}
                      className="w-full bg-white border border-[#e3e2e1] active:border-[#775a19] focus:outline-none focus:border-[#775a19] transition-all py-3 px-4 rounded text-center tracking-[0.25em] font-mono text-lg text-on-surface placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-neutral-300"
                    />
                    {passcodeError && (
                      <p className="text-red-700 text-xs font-sans mt-2 text-center font-medium">
                        ⚠️ {passcodeError}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasscodeModal(false)}
                      className="flex-1 border border-[#605f53]/35 text-[#605f53] py-3 text-xs font-sans font-bold uppercase tracking-widest rounded transition-all hover:bg-neutral-100"
                    >
                      {copy.common.skip}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#775a19] hover:bg-[#c5a059] text-white py-3 text-xs font-sans font-bold uppercase tracking-widest rounded transition-all shadow-md active:scale-95"
                    >
                      {copy.common.confirm}
                    </button>
                  </div>
                </form>

                <div className="pt-2">
                  <p className="font-sans text-[10px] text-neutral-400 italic">
                    {copy.adminLogin.hint}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Floating Music Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleMusic}
          className="w-14 h-14 bg-white hover:bg-[#775a19] text-[#775a19] hover:text-white rounded-full flex items-center justify-center shadow-xl border border-[#e3d1b4]/60 transition-all duration-300 relative group active:scale-95 focus:outline-none"
          title={isMusicPlaying ? copy.app.pauseMusicTitle : copy.app.playMusicTitle}
        >
          {isMusicPlaying && (
            <span className="absolute inset-0 rounded-full bg-[#775a19]/10 animate-ping" />
          )}
          {isMusicPlaying ? <Volume2 size={22} className="relative z-10" /> : <VolumeX size={22} className="relative z-10" />}

          {/* Oscillating visual wave when playing */}
          {isMusicPlaying && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-0.5 items-end justify-center bg-white/90 backdrop-blur-sm border border-[#e3d1b4]/40 h-5 px-1.5 py-0.5 rounded-full shadow-sm">
              <span className="w-0.5 h-1.5 bg-[#775a19] rounded-full animate-pulse" />
              <span className="w-0.5 h-3 bg-[#775a19] rounded-full animate-pulse delay-75" />
              <span className="w-0.5 h-2.5 bg-[#775a19] rounded-full animate-pulse delay-150" />
            </div>
          )}
        </button>
      </div>

      {/* Custom Global Toast Component */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

    </div>
  );
}
