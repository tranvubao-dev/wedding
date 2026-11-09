/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Calendar,
  MapPin,
  ChevronDown,
  CheckCircle2,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Heart,
  Send,
} from 'lucide-react';
import { ALBUM_IMAGES } from '../data';
import Countdown from './Countdown';
import GiftPanel from './GiftPanel';
import { optimizedImage, responsiveImage } from '../imageUtils';
import { Guest } from '../types';
import { WEDDING_CONFIG } from '../config';
import { useWishLikes } from '../useWishLikes';

interface InvitationViewProps {
  detailsContent: React.ReactNode;
  rsvpContent: React.ReactNode;
  guestName: string;
  guestGroup: string;
  onNavigateToDetails: () => void;
  guests: Guest[];
  onAddQuickBlessing?: (name: string, blessing: string) => Promise<void>;
}

export default function InvitationView({
  detailsContent,
  rsvpContent,
  guestName,
  guestGroup,
  onNavigateToDetails,
  guests,
  onAddQuickBlessing,
}: InvitationViewProps) {
  const [sendingWish, setSendingWish] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const wishLock = useRef(false);
  const copy = WEDDING_CONFIG.copy.invitationView;
  const [groomGroup, brideGroup] = WEDDING_CONFIG.copy.adminView.groupOptions;
  const selectedGroup = guestGroup || groomGroup;
  const schedule =
    selectedGroup === brideGroup
      ? WEDDING_CONFIG.guestSchedules.bride
      : WEDDING_CONFIG.guestSchedules.groom;
  // Lightbox Modal States for Photo Album
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Blessing Wall Form States
  const [blessingName, setBlessingName] = useState(
    guestName !== WEDDING_CONFIG.copy.common.guest ? guestName : '',
  );
  const [blessingMessage, setBlessingMessage] = useState('');
  const likes = useWishLikes(
    guests.filter((guest) => guest.blessing?.trim()).map((guest) => guest.id),
  );

  // Sync RSVP and Blessing Name when prop guestName updates
  useEffect(() => {
    if (guestName && guestName !== WEDDING_CONFIG.copy.common.guest) {
      setBlessingName(guestName);
    }
  }, [guestName]);

  const handleSendBlessingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blessingName.trim() || !blessingMessage.trim()) return;

    if (wishLock.current || !onAddQuickBlessing) return;
    wishLock.current = true;
    setSendingWish(true);
    setSubmitError('');
    try {
      await onAddQuickBlessing(blessingName.trim(), blessingMessage.trim());
      setBlessingMessage('');
    } catch {
      setSubmitError('Chưa gửi được lời chúc. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      wishLock.current = false;
      setSendingWish(false);
    }
  };

  // Filter out any guests who have left actual blessings to feature on the wall
  const activeWishes = guests.filter((g) => g.blessing && g.blessing.trim());

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'Tab') {
        const buttons = Array.from(
          document.querySelectorAll<HTMLButtonElement>('[data-gallery-dialog] button'),
        );
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
      if (event.key === 'ArrowRight')
        setLightboxIndex((index) => (index === null ? null : (index + 1) % ALBUM_IMAGES.length));
      if (event.key === 'ArrowLeft')
        setLightboxIndex((index) =>
          index === null ? null : (index - 1 + ALBUM_IMAGES.length) % ALBUM_IMAGES.length,
        );
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxIndex !== null]);

  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const elements = document.querySelectorAll('.wedding-reveal');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove('reveal-ready'));
    };
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
      return;
    const neighbours = [-1, 1].map((offset) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = optimizedImage(
        ALBUM_IMAGES[(lightboxIndex + offset + ALBUM_IMAGES.length) % ALBUM_IMAGES.length].url,
        1920,
      );
      return image;
    });
    return () => {
      neighbours.forEach((image) => {
        image.onload = null;
      });
    };
  }, [lightboxIndex]);

  // Lightbox handlers
  const handleNextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % ALBUM_IMAGES.length);
  };

  const handlePrevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + ALBUM_IMAGES.length) % ALBUM_IMAGES.length);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Invitation Showcase */}
      <section
        id="wedding-invitation"
        className="invitation-hero relative w-full overflow-hidden flex items-center justify-center"
      >
        <div className="absolute inset-0 z-0 botanical-overlay stationery-hero" aria-hidden="true">
          <img
            src={WEDDING_CONFIG.images.stationeryFlowers}
            alt=""
            className="stationery-flowers stationery-flowers-top"
          />
          <img
            src={WEDDING_CONFIG.images.stationeryFlowers}
            alt=""
            className="stationery-flowers stationery-flowers-bottom"
          />
        </div>

        {/* Floating invitation box */}
        <div className="relative z-10 w-[92%] md:w-[680px] invitation-paper text-center animate-fade-in-up">
          <span className="font-sans font-bold text-xs tracking-[0.35em] block mb-4 text-primary uppercase">
            {schedule.invitationTitle}
          </span>
          <h2
            id="invitation-title"
            tabIndex={-1}
            className="couple-heading font-couple outline-none"
          >
            <span>{WEDDING_CONFIG.couple.groomName}</span>
            <span className="couple-ampersand" aria-hidden="true">
              &
            </span>
            <span className="sr-only"> &amp; </span>
            <span>{WEDDING_CONFIG.couple.brideName}</span>
          </h2>
          {/* <h2 className="font-couple text-3xl md:text-5xl text-[#5C4033] mb-3 font-bold leading-tight">
            {WEDDING_CONFIG.couple.groomName} &amp; {WEDDING_CONFIG.couple.brideName}
          </h2> */}
          <div className="w-24 h-[1px] bg-outline-variant mx-auto my-6" />

          <div className="space-y-1 mb-8">
            <p className="font-serif text-xl md:text-2xl text-secondary italic">
              {schedule.dateLine}
            </p>
            <p className="font-sans text-[10px] tracking-widest text-secondary uppercase font-bold">
              {schedule.lunarDate}
            </p>
          </div>

          {/* Personalized Greeting Unit */}
          <div className="py-5 px-5 mb-5 relative overflow-hidden">
            <p className="font-sans font-bold text-[10px] text-secondary tracking-[0.2em] mb-2 uppercase">
              {copy.invitationTo}
            </p>
            <p className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight">
              {guestName}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={onNavigateToDetails}
              className="w-full sm:w-auto metal-button bg-primary hover:bg-primary-container active:scale-95 text-white font-sans font-bold text-xs py-4 px-10 rounded-sm hover:shadow-md transition-all duration-300 uppercase tracking-widest"
            >
              {copy.seeDetails}
            </button>
            <a
              href="#wedding-rsvp"
              className="w-full sm:w-auto border border-primary text-primary hover:bg-primary/5 active:scale-95 font-sans font-bold text-xs py-4 px-10 rounded-sm transition-all duration-300 uppercase tracking-widest text-center"
            >
              {copy.quickRsvp}
            </a>
          </div>
        </div>

        {/* Scroll cue element */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center select-none">
          <span className="text-[10px] font-sans text-primary tracking-[0.2em] mb-1 uppercase font-bold">
            {copy.scrollAlbum}
          </span>
          <ChevronDown size={18} className="text-primary-container" />
        </div>
      </section>

      <Countdown target={schedule.countdownTarget} dateLine={schedule.dateLine} />

      <section id="wedding-details" className="w-full scroll-mt-16">
        {detailsContent}
      </section>
      <section className="wedding-portrait wedding-reveal" aria-label={copy.memoryTitle}>
        <p className="wedding-eyebrow text-center mb-8">
          {WEDDING_CONFIG.copy.experience.portraitEyebrow}
        </p>
        <figure>
          <img
            src={optimizedImage(WEDDING_CONFIG.images.invitationPortrait, 960)}
            srcSet={responsiveImage(WEDDING_CONFIG.images.invitationPortrait)}
            sizes="(max-width: 960px) calc(100vw - 48px), 912px"
            alt={copy.altHero}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <figcaption className="font-serif italic text-secondary text-center text-xl sm:text-2xl px-6 mt-8 leading-relaxed">
            {copy.loveQuote}
          </figcaption>
        </figure>
      </section>
      {/* Wedding Portrait Grid (Slide Trình Chiếu) */}
      <section
        id="wedding-album"
        className="wedding-reveal w-full max-w-[1140px] px-6 py-12 text-center"
      >
        <span className="font-sans font-bold text-[10px] text-primary tracking-[0.3em] block mb-4 uppercase">
          {copy.albumEyebrow}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl text-on-surface font-semibold mb-4 text-center">
          {copy.albumTitle}
        </h3>
        <p className="font-sans text-xs text-secondary mb-12 max-w-md mx-auto leading-relaxed">
          {copy.albumDescription}
        </p>

        {/* Masonry Grid */}
        <div className="editorial-album">
          {ALBUM_IMAGES.map((img, idx) => (
            <motion.button
              type="button"
              aria-label={`${copy.viewPortrait}: ${img.caption}`}
              key={img.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="album-image relative overflow-hidden group cursor-pointer bg-surface-container-low"
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={optimizedImage(img.url, 640)}
                srcSet={responsiveImage(img.url)}
                sizes={
                  idx % 5 === 0
                    ? '(max-width: 1140px) calc(100vw - 48px), 1092px'
                    : '(max-width: 1140px) calc((100vw - 80px) / 2), 530px'
                }
                decoding="async"
                alt={img.caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4 md:p-6 text-left" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 text-left">
                <span className="font-sans text-[10px] font-bold text-primary-container uppercase tracking-widest block mb-1">
                  {copy.viewPortrait}
                </span>
                <p className="font-serif text-sm text-white font-medium leading-tight">
                  {img.caption}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section id="wedding-rsvp" className="w-full scroll-mt-16 wedding-rsvp-section">
        {rsvpContent}
      </section>
      {/* Lightbox Screen Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div
            data-gallery-dialog
            role="dialog"
            aria-modal="true"
            aria-label={copy.albumTitle}
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 select-none"
          >
            {/* Close trigger overlay */}
            <button
              autoFocus
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-3 hover:bg-surface/10 rounded-full transition-all focus:outline-none z-50"
              aria-label={copy.closeAlbum}
            >
              <X size={26} />
            </button>

            {/* Left Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-surface/15 p-3 rounded-full transition-all focus:outline-none z-50"
              aria-label={copy.previousImage}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Right Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-surface/15 p-3 rounded-full transition-all focus:outline-none z-50"
              aria-label={copy.nextImage}
            >
              <ChevronRight size={28} />
            </button>

            {/* Image Canvas Frame */}
            <div className="flex-grow flex items-center justify-center p-4">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="max-w-4xl max-h-[75vh] md:max-h-[80vh] relative"
              >
                <img
                  src={optimizedImage(ALBUM_IMAGES[lightboxIndex].url, 1920)}
                  decoding="async"
                  alt={ALBUM_IMAGES[lightboxIndex].caption}
                  className="rounded-lg shadow-2xl max-w-full max-h-[75vh] md:max-h-[80vh] object-contain mx-auto border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Footer Label and counter */}
            <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-center text-white space-y-2 pb-12">
              <span className="font-mono text-xs text-secondary">
                {lightboxIndex + 1} / {ALBUM_IMAGES.length}
              </span>
              <p className="font-serif text-lg md:text-xl text-neutral-100 italic">
                "{ALBUM_IMAGES[lightboxIndex].caption}"
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Aesthetic Bento Grid Details */}

      {/* Interactive Wishing Wall & Blessings Portal (Bức tường Chúc phúc) */}
      <section
        id="wedding-wishes"
        className="wedding-reveal w-full max-w-[1000px] px-6 py-16 md:py-24 text-center bg-transparent scroll-mt-16"
      >
        {likes.error && (
          <p role="alert" className="text-sm text-red-700 mb-4">
            {likes.error}{' '}
            <button type="button" className="underline min-h-11 px-2" onClick={likes.retry}>
              Thử lại
            </button>
          </p>
        )}

        <span className="font-sans font-bold text-[10px] text-primary tracking-[0.3em] block mb-4 uppercase">
          {copy.wishesEyebrow}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl text-on-surface font-semibold mb-3">
          {copy.wishesTitle}
        </h3>
        <p className="font-sans text-xs text-secondary mb-12 max-w-lg mx-auto leading-relaxed">
          {copy.wishesDescription}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Senders Wall displaying blessings */}
          <div className="lg:col-span-7 space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar text-left">
            {activeWishes.length === 0 ? (
              <div className="bg-surface p-12 border border-outline-variant/40 rounded-lg text-center shadow-inner space-y-3">
                <span className="text-3xl">{WEDDING_CONFIG.copy.decoration.dove}</span>
                <p className="font-serif italic text-secondary">{copy.noWishes}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeWishes.map((g) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface border border-outline-variant/45 p-6 rounded shadow-sm hover:shadow-md relative overflow-hidden transition-all duration-300 group"
                  >
                    {/* Flower deco detail */}
                    <div className="absolute top-1 right-2 text-primary/10 text-xl font-serif select-none pointer-events-none">
                      ✿
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="bg-primary/10 text-primary text-[9px] font-sans font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                          {g.group || copy.guestFallback}
                        </span>
                        <h4 className="font-serif text-base font-bold text-on-surface mt-1.5 tracking-tight">
                          {g.name}
                        </h4>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-secondary italic leading-relaxed py-1 border-t border-dotted border-gray-100 my-2">
                      "{g.blessing}"
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-secondary pt-2 font-mono">
                      <span>
                        {g.updatedAt
                          ? new Date(g.updatedAt).toLocaleDateString('vi-VN')
                          : copy.newWish}
                      </span>

                      {/* Interactive Love Counter */}
                      <button
                        type="button"
                        disabled={likes.pending[g.id] || !likes.states[g.id]}
                        aria-pressed={likes.states[g.id]?.liked ?? false}
                        aria-label={likes.states[g.id]?.liked ? copy.unlike : copy.like}
                        onClick={(e) => {
                          e.stopPropagation();
                          void likes.toggle(g.id);
                        }}
                        className={`flex items-center gap-1 py-1 px-2 rounded-full border transition-all ${
                          likes.states[g.id]?.liked
                            ? 'bg-red-50 border-red-200 text-red-600 font-bold shadow-sm'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-secondary hover:text-red-500'
                        }`}
                        title={likes.states[g.id]?.liked ? copy.unlike : copy.like}
                      >
                        <Heart
                          size={10}
                          className={likes.states[g.id]?.liked ? 'fill-red-600' : ''}
                        />
                        <span>{likes.states[g.id]?.total ?? '—'}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick write-blessing form */}
          <div className="lg:col-span-5 bg-background p-8 border border-outline-variant rounded shadow-md text-left">
            <h4 className="font-serif text-xl font-bold text-on-surface mb-2">
              {copy.wishFormTitle}
            </h4>
            <p className="font-sans text-xs text-secondary mb-6 leading-relaxed">
              {copy.wishFormDescription} Tên và lời chúc bạn gửi sẽ hiển thị công khai.
            </p>

            <form onSubmit={handleSendBlessingSubmit} className="space-y-4">
              <div>
                <label className="font-sans font-bold text-[9px] text-secondary uppercase tracking-wider block mb-1">
                  {copy.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={copy.namePlaceholder}
                  maxLength={150}
                  value={blessingName}
                  onChange={(e) => setBlessingName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant active:border-primary focus:outline-none focus:border-primary transition-all py-2.5 px-3 rounded text-sm placeholder:text-neutral-300 text-on-surface"
                />
              </div>

              <div>
                <label className="font-sans font-bold text-[9px] text-secondary uppercase tracking-wider block mb-1">
                  {copy.wishLabel}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={copy.wishPlaceholder}
                  maxLength={2000}
                  value={blessingMessage}
                  onChange={(e) => setBlessingMessage(e.target.value)}
                  className="w-full bg-surface border border-outline-variant active:border-primary focus:outline-none focus:border-primary transition-all py-2.5 px-3 rounded text-sm placeholder:text-neutral-300 text-on-surface resize-none leading-relaxed"
                />
              </div>

              {submitError && (
                <p role="alert" className="text-red-700 mb-3">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={sendingWish}
                className="w-full metal-button bg-primary hover:bg-primary-container active:scale-95 text-white font-sans font-bold text-xs py-3 rounded hover:shadow transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Send size={12} />
                {sendingWish ? 'Đang gửi…' : copy.sendWish}
              </button>
            </form>
          </div>
        </div>
        <GiftPanel />
      </section>
    </div>
  );
}
