/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, Lock, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Guest } from './types';
import { WEDDING_CONFIG } from './config';
import NavigationDrawer from './components/NavigationDrawer';
import InvitationView from './components/InvitationView';
import EventDetailsView from './components/EventDetailsView';
import RsvpView from './components/RsvpView';
import GuestAdminView from './components/GuestAdminView';
import Toast from './components/Toast';
import OpeningInvitation from './components/OpeningInvitation';
import { localStore } from './storage';
import { supabase, requireSupabase, loadGuests, submitGuest, checkAdmin } from './supabase';

const readThemeColor = (key: string, fallback: string) => {
  const value = localStore.getItem(key);
  return value && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
};

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
  const [isOpened, setIsOpened] = useState(false);
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
  const [adminEmail, setAdminEmail] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [dataError, setDataError] = useState('');

  // Dynamic App Theme States
  const [themeTone, setThemeTone] = useState(() => {
    return readThemeColor('wedding_ivory_metal_tone', WEDDING_CONFIG.colors.primary);
  });
  const [themeAccent, setThemeAccent] = useState(() => {
    return readThemeColor('wedding_ivory_metal_accent', WEDDING_CONFIG.colors.accent);
  });

  const handleThemeChange = (tone: string, accent: string) => {
    setThemeTone(tone);
    setThemeAccent(accent);
    localStore.setItem('wedding_ivory_metal_tone', tone);
    localStore.setItem('wedding_ivory_metal_accent', accent);
  };

  // Background Music States
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userManuallyPaused = useRef(false);

  useEffect(() => {
    const audio = new Audio(WEDDING_CONFIG.audio.backgroundMusic);
    audio.loop = WEDDING_CONFIG.audio.loop;
    audio.volume = Math.min(1, Math.max(0, WEDDING_CONFIG.audio.volume));
    audio.preload = 'none';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isOpened) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpened]);

  const openInvitation = () => {
    setIsOpened(true);
    setActiveTab('INVITATION');
    window.scrollTo({ top: 0, behavior: 'instant' });
    userManuallyPaused.current = false;
    void audioRef.current
      ?.play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false));
    setTimeout(
      () => document.getElementById('invitation-title')?.focus({ preventScroll: true }),
      800,
    );
  };

  const navigateTo = (tab: ActiveTab, sectionId?: string) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
    const id =
      sectionId ||
      (tab === 'DETAILS'
        ? 'wedding-details'
        : tab === 'RSVP'
          ? 'wedding-rsvp'
          : tab === 'ADMIN'
            ? 'wedding-admin'
            : 'wedding-invitation');
    // Wait for the public page to mount when returning from administration.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
          block: 'start',
        });
      }),
    );
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      userManuallyPaused.current = true;
      setIsMusicPlaying(false);
    } else {
      userManuallyPaused.current = false;
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((err) => {
          console.warn(copy.logs.audioPlayFailed, err);
        });
    }
  };

  // Read personalized invitation parameters.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');
    const groupParam = urlParams.get('group');

    if (toParam) {
      setCurrentGuestName(toParam);
    }
    if (groupParam) {
      setCurrentGuestGroup(normalizeGuestGroup(groupParam));
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    const updateAdmin = async () => {
      try {
        const admin = await checkAdmin();
        if (alive) setIsAdmin(admin);
      } catch {
        if (alive) setIsAdmin(false);
      }
    };
    void updateAdmin();
    const { data } = supabase.auth.onAuthStateChange(() => {
      // Run database queries outside the auth callback lock.
      setTimeout(() => {
        if (alive) void updateAdmin();
      }, 0);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try {
        const rows = await loadGuests(isAdmin);
        if (alive) {
          setGuests(rows);
          setDataError('');
        }
      } catch {
        if (alive)
          setDataError(
            supabase
              ? 'Không tải được dữ liệu. Vui lòng thử lại sau.'
              : 'Chưa kết nối Supabase. RSVP và lời chúc chưa thể gửi.',
          );
      }
    };
    setGuests([]);
    void refresh();
    const timer = setInterval(refresh, 30000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [isAdmin]);

  const refreshGuests = async () => {
    try {
      setGuests(await loadGuests(isAdmin));
      setDataError('');
    } catch {
      setDataError('Đã lưu nhưng chưa tải lại được dữ liệu. Vui lòng tải lại trang.');
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  const newResponse = (data: Partial<Guest>): Guest => ({
    id: crypto.randomUUID(),
    name: data.name?.trim() || '',
    group: normalizeGuestGroup(currentGuestGroup, data.relation || 'NONE'),
    status: 'CONFIRMED',
    rsvpStatus: 'PENDING',
    guestsCount: 0,
    relation: 'NONE',
    ...data,
    updatedAt: new Date().toISOString(),
  });

  const handleAddGuest = async (name: string, group: string) => {
    const guest = newResponse({
      name,
      group: normalizeGuestGroup(group),
      status: 'DRAFT',
      guestsCount: 1,
    });
    const { error } = await requireSupabase().from('wedding_guests').insert(guest);
    if (error) throw error;
    await refreshGuests();
    triggerToast(copy.toast.guestAdded.replace('{name}', name));
  };

  const handleDeleteGuest = async (id: string) => {
    try {
      const { error } = await requireSupabase().from('wedding_guests').delete().eq('id', id);
      if (error) throw error;
      await refreshGuests();
    } catch {
      triggerToast('Không xóa được khách mời. Vui lòng thử lại.');
    }
  };

  const handleRsvpComplete = async (data: Partial<Guest>) => {
    await submitGuest(newResponse(data));
    await refreshGuests();
    triggerToast(copy.toast.rsvpTabReceived.replace('{name}', data.name || ''));
  };

  const handleAddQuickBlessing = async (name: string, blessing: string) => {
    await submitGuest(newResponse({ name, blessing }));
    await refreshGuests();
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
    navigateTo('DETAILS');
  };

  const handleNavigateToRsvp = () => {
    navigateTo('RSVP');
  };

  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginBusy) return;
    setLoginBusy(true);
    setPasscodeError('');
    try {
      const client = requireSupabase();
      const { error } = await client.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: passcodeInput,
      });
      if (error) throw error;
      if (!(await checkAdmin())) {
        await client.auth.signOut();
        throw new Error('Tài khoản chưa được cấp quyền quản trị.');
      }
      setIsAdmin(true);
      setShowPasscodeModal(false);
      setPasscodeInput('');
      setActiveTab('ADMIN');
    } catch {
      setPasscodeError(
        'Không đăng nhập được. Kiểm tra kết nối, email, mật khẩu và quyền quản trị.',
      );
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await requireSupabase().auth.signOut();
      if (error) throw error;
      setIsAdmin(false);
      setGuests([]);
      setActiveTab('INVITATION');
    } catch {
      triggerToast('Không đăng xuất được. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container botanical-overlay min-h-screen flex flex-col overflow-x-hidden">
      <style>{`
        :root {
          --color-primary: ${themeTone};
          --color-primary-container: ${themeAccent};
          --color-surface-tint: ${themeTone};
          --color-outline: ${WEDDING_CONFIG.colors.border};
          --color-background: ${WEDDING_CONFIG.colors.background};
          --color-surface: ${WEDDING_CONFIG.colors.paper};
          --color-surface-container-lowest: ${WEDDING_CONFIG.colors.paper};
          --color-surface-container-low: ${WEDDING_CONFIG.colors.soft};
          --color-surface-container: ${WEDDING_CONFIG.colors.soft};
          --color-outline-variant: ${WEDDING_CONFIG.colors.border};
          --color-on-surface: ${WEDDING_CONFIG.colors.ink};
          --color-on-background: ${WEDDING_CONFIG.colors.ink};
          --color-secondary: ${WEDDING_CONFIG.colors.muted};
          --color-couple-ink: ${WEDDING_CONFIG.colors.coupleNames};
          --metal-light: ${WEDDING_CONFIG.colors.metallicLight};
          --metal-dark: ${WEDDING_CONFIG.colors.metallicDark};
          --champagne: ${WEDDING_CONFIG.colors.gold};
          --paper-texture: url('${WEDDING_CONFIG.images.paperTexture}');
        }
      `}</style>

      <div inert={!isOpened}>
        {/* Top Application Header Bar */}
        <header className="wedding-header fixed top-0 left-0 right-0 z-50 h-16">
          <div className="flex justify-between items-center w-full pl-5 pr-16 md:pl-16 h-full">
            {/* Hamburger menu & Brand Label */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-primary hover:opacity-80 transition-opacity p-1.5 focus:outline-none focus:ring-1 focus:ring-primary/20 rounded"
                aria-label={copy.accessibility.toggleNavigation}
              >
                <Menu size={22} />
              </button>
              <h1 className="font-serif text-xl md:text-2xl text-primary font-semibold tracking-tight select-none">
                <img src={WEDDING_CONFIG.images.monogram} alt="Logo NB" width="70" height="45" />
              </h1>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => {
                  navigateTo('INVITATION');
                  document
                    .getElementById('wedding-invitation')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${
                  activeTab === 'INVITATION' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                {copy.navigation.invitation}
                {activeTab === 'INVITATION' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  navigateTo('DETAILS');
                  document
                    .getElementById('wedding-details')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${
                  activeTab === 'DETAILS' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                {copy.navigation.details}
                {activeTab === 'DETAILS' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>

              <button
                onClick={() => {
                  navigateTo('RSVP');
                  document.getElementById('wedding-rsvp')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${
                  activeTab === 'RSVP' ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                {copy.navigation.rsvp}
                {activeTab === 'RSVP' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>

              <a
                className="text-[10px] tracking-widest text-secondary hover:text-primary uppercase"
                href="#wedding-album"
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo('INVITATION', 'wedding-album');
                }}
              >
                {copy.experience.albumNav}
              </a>
              <a
                className="text-[10px] tracking-widest text-secondary hover:text-primary uppercase"
                href="#wedding-wishes"
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo('INVITATION', 'wedding-wishes');
                }}
              >
                {copy.experience.wishesNav}
              </a>
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('ADMIN');
                    window.scrollTo({ top: 0 });
                  }}
                  className={`font-sans font-bold text-xs tracking-widest uppercase transition-colors relative py-1 ${
                    activeTab === 'ADMIN' ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`}
                >
                  {copy.navigation.guests}
                  {activeTab === 'ADMIN' && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
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
                    className="text-primary hover:opacity-85 transition-opacity flex items-center gap-1.5 focus:outline-none py-1.5 px-3 rounded border border-primary/20 bg-primary/5 text-xs font-sans font-bold uppercase tracking-wider"
                    title={copy.navigation.guests}
                  >
                    <User size={15} />
                    <span className="hidden sm:inline">{copy.adminLogin.adminButton}</span>
                  </button>
                  <button
                    onClick={handleLogout}
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
                  // Vùng bấm trong suốt: mở đăng nhập admin, không hiển thị icon hay tooltip.
                  type="button"
                  className="w-10 h-10 shrink-0 cursor-default border-0 bg-transparent"
                  aria-label={copy.adminLogin.loginTitle}
                >
                  <span className="sr-only">{copy.adminLogin.loginTitle}</span>
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
            if (tab === 'ALBUM' || tab === 'WISHES') {
              navigateTo('INVITATION', tab === 'ALBUM' ? 'wedding-album' : 'wedding-wishes');
              return;
            }
            if (tab === 'ADMIN' && !isAdmin) {
              setShowPasscodeModal(true);
              setIsDrawerOpen(false);
              return;
            }
            navigateTo(tab as ActiveTab);
            const id =
              tab === 'DETAILS'
                ? 'wedding-details'
                : tab === 'RSVP'
                  ? 'wedding-rsvp'
                  : 'wedding-invitation';
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Main Subview Canvas */}
        <main className="pt-16 flex-grow flex flex-col items-center">
          {dataError && (
            <p role="alert" className="w-full bg-amber-50 text-amber-900 p-4 text-center">
              {dataError}
            </p>
          )}
          <div className="w-full flex flex-col items-center">
            {activeTab !== 'ADMIN' && (
              <InvitationView
                guestName={currentGuestName}
                guestGroup={currentGuestGroup}
                onNavigateToDetails={handleNavigateToDetails}
                guests={guests}
                onAddQuickBlessing={handleAddQuickBlessing}
                detailsContent={
                  <EventDetailsView
                    onNavigateToRsvp={handleNavigateToRsvp}
                    guestGroup={currentGuestGroup}
                  />
                }
                rsvpContent={
                  <RsvpView
                    currentGuestName={currentGuestName}
                    onRsvpComplete={handleRsvpComplete}
                  />
                }
              />
            )}

            {activeTab === 'ADMIN' && isAdmin && (
              <div id="wedding-admin" className="w-full max-w-[1140px] px-6 py-12">
                <GuestAdminView
                  guests={guests}
                  onAddGuest={handleAddGuest}
                  onDeleteGuest={handleDeleteGuest}
                  onPreviewGuest={handlePreviewGuest}
                  onTriggerCopyToast={(name) =>
                    triggerToast(copy.toast.copiedGuestLink.replace('{name}', name))
                  }
                  themeTone={themeTone}
                  themeAccent={themeAccent}
                  onChangeTheme={handleThemeChange}
                />
              </div>
            )}
          </div>
        </main>

        <footer className="wedding-footer">
          <p className="font-couple text-5xl mb-6">
            {WEDDING_CONFIG.couple.groomName} &amp; {WEDDING_CONFIG.couple.brideName}
          </p>
          <p className="font-serif text-xl italic max-w-md mx-auto text-secondary leading-relaxed">
            {copy.experience.closingMessage}
          </p>
          <div className="fine-rule" />
          <button
            className="text-xs underline underline-offset-8 text-secondary min-h-11"
            onClick={() => {
              setIsOpened(false);
              audioRef.current?.pause();
              setIsMusicPlaying(false);
            }}
          >
            {copy.experience.replayInvitation}
          </button>
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
                className="fixed inset-0 m-auto w-[90%] max-w-md h-fit bg-background p-8 rounded border border-outline-variant shadow-2xl z-[70] overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowPasscodeModal(false)}
                  className="absolute top-4 right-4 text-primary hover:bg-primary/10 p-2 rounded-full transition-colors focus:ring-1 focus:ring-primary/20"
                  aria-label={copy.adminLogin.close}
                >
                  <X size={18} />
                </button>

                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <Lock size={20} />
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-on-surface">
                      {copy.adminLogin.title}
                    </h3>
                    <p className="font-sans text-xs text-secondary mt-1 leading-relaxed">
                      {copy.adminLogin.description}
                    </p>
                  </div>

                  <form onSubmit={handleVerifyPasscode} className="space-y-4 pt-2">
                    <div className="text-left">
                      <label className="block text-sm mb-2" htmlFor="admin-email">
                        Email quản trị
                      </label>
                      <input
                        id="admin-email"
                        type="email"
                        required
                        autoComplete="username"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full border p-3 rounded mb-4"
                      />
                      <label className="font-sans font-bold text-[10px] text-secondary block tracking-widest uppercase mb-1">
                        {copy.adminLogin.pinLabel}
                      </label>
                      <input
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder={copy.adminLogin.pinPlaceholder}
                        value={passcodeInput}
                        onChange={(e) => {
                          setPasscodeInput(e.target.value);
                          setPasscodeError('');
                        }}
                        className="w-full bg-surface border border-outline-variant active:border-primary focus:outline-none focus:border-primary transition-all py-3 px-4 rounded text-center tracking-[0.25em] font-mono text-lg text-on-surface placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-neutral-300"
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
                        className="flex-1 border border-secondary/35 text-secondary py-3 text-xs font-sans font-bold uppercase tracking-widest rounded transition-all hover:bg-neutral-100"
                      >
                        {copy.common.skip}
                      </button>
                      <button
                        type="submit"
                        disabled={loginBusy}
                        className="flex-1 metal-button bg-primary hover:bg-primary-container text-white py-3 text-xs font-sans font-bold uppercase tracking-widest rounded transition-all shadow-md active:scale-95"
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
        <div className="fixed top-3 right-3 z-50">
          <button
            onClick={toggleMusic}
            className="w-10 h-10 bg-surface hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center border border-outline-variant/60 transition-all duration-300 relative group active:scale-95 focus:outline-none"
            title={isMusicPlaying ? copy.app.pauseMusicTitle : copy.app.playMusicTitle}
          >
            {isMusicPlaying ? (
              <Volume2 size={22} className="relative z-10" />
            ) : (
              <VolumeX size={22} className="relative z-10" />
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
      <AnimatePresence>
        {!isOpened && (
          <OpeningInvitation
            guestName={currentGuestName}
            guestGroup={currentGuestGroup}
            onOpen={openInvitation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
