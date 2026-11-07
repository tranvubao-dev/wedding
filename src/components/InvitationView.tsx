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
  Send
} from 'lucide-react';
import { ALBUM_IMAGES } from '../data';
import { Guest } from '../types';
import { WEDDING_CONFIG } from '../config';
// import { WEDDING_IMAGES } from '../images.config';

interface InvitationViewProps {
  guestName: string;
  guestGroup: string;
  onRsvpSubmit: (name: string, attending: boolean, guestsCount: number) => void;
  onNavigateToDetails: () => void;
  guests: Guest[];
  onAddQuickBlessing?: (name: string, blessing: string) => void;
}

export default function InvitationView({
  guestName,
  guestGroup,
  onRsvpSubmit,
  onNavigateToDetails,
  guests,
  onAddQuickBlessing
}: InvitationViewProps) {
  const copy = WEDDING_CONFIG.copy.invitationView;
  const [groomGroup, brideGroup] = WEDDING_CONFIG.copy.adminView.groupOptions;
  const selectedGroup = guestGroup || groomGroup;
  const schedule = selectedGroup === brideGroup
    ? WEDDING_CONFIG.guestSchedules.bride
    : WEDDING_CONFIG.guestSchedules.groom;
  const ceremonyMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schedule.ceremonyAddress)}`;
  // RSVP Form States
  const [rsvpName, setRsvpName] = useState(guestName !== WEDDING_CONFIG.copy.common.guest ? guestName : '');
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [guestsCount, setGuestsCount] = useState(1);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Lightbox Modal States for Photo Album
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Blessing Wall Form States
  const [blessingName, setBlessingName] = useState(guestName !== WEDDING_CONFIG.copy.common.guest ? guestName : '');
  const [blessingMessage, setBlessingMessage] = useState('');
  const [blessingLikes, setBlessingLikes] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  // Countdown States
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  // The countdown follows the selected invitation's ceremony date and time.
  useEffect(() => {
    const targetDate = new Date(schedule.countdownTarget).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft(prev => ({ ...prev, isCompleted: true }));
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isCompleted: false
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule.countdownTarget]);

  // Sync RSVP and Blessing Name when prop guestName updates
  useEffect(() => {
    if (guestName && guestName !== WEDDING_CONFIG.copy.common.guest) {
      setRsvpName(guestName);
      setBlessingName(guestName);
    }
  }, [guestName]);

  // Blessing Likes tracker load/save
  useEffect(() => {
    const storedLikes = localStorage.getItem('eternal_wedding_blessing_likes');
    const storedUserLikes = localStorage.getItem('eternal_wedding_user_likes');
    if (storedLikes) {
      try {
        setBlessingLikes(JSON.parse(storedLikes));
      } catch (e) {
        console.error(e);
      }
    }
    if (storedUserLikes) {
      try {
        setUserLiked(JSON.parse(storedUserLikes));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLikeBlessing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const hasLiked = userLiked[id];
    const newLikes = { ...blessingLikes };
    const newUserLiked = { ...userLiked };

    if (hasLiked) {
      newLikes[id] = Math.max(0, (newLikes[id] || 1) - 1);
      newUserLiked[id] = false;
    } else {
      newLikes[id] = (newLikes[id] || 0) + 1;
      newUserLiked[id] = true;
    }

    setBlessingLikes(newLikes);
    setUserLiked(newUserLiked);
    localStorage.setItem('eternal_wedding_blessing_likes', JSON.stringify(newLikes));
    localStorage.setItem('eternal_wedding_user_likes', JSON.stringify(newUserLiked));
  };

  const handleQuickRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    if (isAttending === null) return;

    onRsvpSubmit(rsvpName, isAttending, isAttending ? guestsCount : 0);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  const handleSendBlessingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blessingName.trim() || !blessingMessage.trim()) return;

    if (onAddQuickBlessing) {
      onAddQuickBlessing(blessingName, blessingMessage);
    }
    setBlessingMessage('');
  };

  // Filter out any guests who have left actual blessings to feature on the wall
  const activeWishes = guests.filter(g => g.blessing && g.blessing.trim());

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
      <section className="relative w-full h-[760px] md:h-[860px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHxG9Nwno9b7LenxKfrpFGEXk4JLb26izVgt2ncC9i-0PI6G3xXB11tXH3G_MnYkGzqACTyLXfCbgaRT3_BW2K15dXSX4eWmJ6F9H96mjJuHJMIbsynBa7qtdkArAacdwvnvp8odB8p6-FVmw3HM0zhvG3eNH4vyXwf100eGPyLGuiLj9Ks-jAr7fSnyYe2QLbeA0dmxOzAi-j-x52FnvfQqjZXcO3at3Ud9b16dbqZIY-1w8nzsQT4vzAbAXS0vh1s2W_S9o3ZpLk"
            alt={copy.altHero}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background/95" />
        </div>

        {/* Floating invitation box */}
        <div className="relative z-10 w-[92%] md:w-[600px] bg-white p-8 md:p-14 border border-[#E3D1B4] text-center shadow-2xl rounded animate-fade-in-up">
          <span className="font-sans font-bold text-xs tracking-[0.35em] block mb-4 text-[#775a19] uppercase">
            {schedule.invitationTitle}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-[#222] mb-3 font-bold tracking-tight">
            {WEDDING_CONFIG.couple.groomName} &amp; {WEDDING_CONFIG.couple.brideName}
          </h2>
          <div className="w-24 h-[1px] bg-[#E3D1B4] mx-auto my-6" />

          <div className="space-y-1 mb-8">
            <p className="font-serif text-xl md:text-2xl text-[#605f53] italic">
              {schedule.dateLine}
            </p>
            <p className="font-sans text-[10px] tracking-widest text-[#a19a8e] uppercase font-bold">
              {schedule.lunarDate}
            </p>
          </div>

          {/* Personalized Greeting Unit */}
          <div className="bg-[#e6e3d4]/45 py-6 px-5 mb-8 rounded border border-[#E3D1B4]/60 relative overflow-hidden">
            <div className="absolute -top-3 -right-3 text-[#775a19] opacity-5 select-none text-7xl font-serif">
              ✿
            </div>
            <p className="font-sans font-bold text-[10px] text-[#605f53] tracking-[0.2em] mb-2 uppercase">
              {copy.invitationTo}
            </p>
            <p className="font-serif text-2xl md:text-3xl font-bold text-[#775a19] tracking-tight">
              {guestName}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={onNavigateToDetails}
              className="w-full sm:w-auto bg-[#775a19] hover:bg-[#c5a059] active:scale-95 text-white font-sans font-bold text-xs py-4 px-10 rounded-sm hover:shadow-md transition-all duration-300 uppercase tracking-widest"
            >
              {copy.seeDetails}
            </button>
            <a
              href="#rsvp-fast"
              className="w-full sm:w-auto border border-[#775a19] text-[#775a19] hover:bg-[#775a19]/5 active:scale-95 font-sans font-bold text-xs py-4 px-10 rounded-sm transition-all duration-300 uppercase tracking-widest text-center"
            >
              {copy.quickRsvp}
            </a>
          </div>
        </div>

        {/* Scroll cue element */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center select-none cursor-pointer">
          <span className="text-[10px] font-sans text-[#775a19] tracking-[0.2em] mb-1 uppercase font-bold">{copy.scrollAlbum}</span>
          <ChevronDown size={18} className="text-[#c5a059]" />
        </div>
      </section>

      {/* Countdown Timer Block */}
      <section className="w-full max-w-[1140px] px-6 py-12 text-center">
        <div className="bg-[#faf9f8] border border-[#e3d1b4]/50 p-8 md:p-12 rounded shadow-sm">
          <span className="font-sans font-bold text-[10px] text-[#775a19] tracking-[0.3em] block mb-4 uppercase">
            {copy.countdownEyebrow}
          </span>
          <h3 className="font-serif text-2xl md:text-4xl text-on-surface font-semibold mb-8">
            {copy.countdownTitle}
          </h3>

          <div className="grid grid-cols-4 gap-2 md:gap-6 max-w-2xl mx-auto">
            {/* Days Card */}
            <div className="bg-white border border-[#e3d1b4]/30 rounded-lg p-3 md:p-6 shadow-sm flex flex-col items-center">
              <span className="font-sans font-bold text-3xl md:text-5xl text-[#775a19]">
                {timeLeft.days.toString().padStart(2, '0')}
              </span>
              <span className="font-sans text-[10px] md:text-xs text-[#605f53] font-bold uppercase tracking-wider mt-2">
                {copy.days}
              </span>
            </div>

            {/* Hours Card */}
            <div className="bg-white border border-[#e3d1b4]/30 rounded-lg p-3 md:p-6 shadow-sm flex flex-col items-center">
              <span className="font-sans font-bold text-3xl md:text-5xl text-[#775a19]">
                {timeLeft.hours.toString().padStart(2, '0')}
              </span>
              <span className="font-sans text-[10px] md:text-xs text-[#605f53] font-bold uppercase tracking-wider mt-2">
                {copy.hours}
              </span>
            </div>

            {/* Minutes Card */}
            <div className="bg-white border border-[#e3d1b4]/30 rounded-lg p-3 md:p-6 shadow-sm flex flex-col items-center">
              <span className="font-sans font-bold text-3xl md:text-5xl text-[#775a19]">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </span>
              <span className="font-sans text-[10px] md:text-xs text-[#605f53] font-bold uppercase tracking-wider mt-2">
                {copy.minutes}
              </span>
            </div>

            {/* Seconds Card */}
            <div className="bg-white border border-[#e3d1b4]/30 rounded-lg p-3 md:p-6 shadow-sm flex flex-col items-center">
              <span className="font-sans font-bold text-3xl md:text-5xl text-[#775a19] transition-all w-12 text-center inline-block">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </span>
              <span className="font-sans text-[10px] md:text-xs text-[#605f53] font-bold uppercase tracking-wider mt-2">
                {copy.seconds}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Portrait Grid (Slide Trình Chiếu) */}
      <section className="w-full max-w-[1140px] px-6 py-12 text-center">
        <span className="font-sans font-bold text-[10px] text-[#775a19] tracking-[0.3em] block mb-4 uppercase">
          {copy.albumEyebrow}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl text-on-surface font-semibold mb-4 text-center">
          {copy.albumTitle}
        </h3>
        <p className="font-sans text-xs text-[#605f53] mb-12 max-w-md mx-auto leading-relaxed">
          {copy.albumDescription}
        </p>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {ALBUM_IMAGES.map((img, idx) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden group cursor-pointer bg-neutral-100 border border-[#e3d1b4]/30 shadow-md aspect-[3/4] md:aspect-square rounded"
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4 md:p-6 text-left" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 text-left">
                <span className="font-sans text-[10px] font-bold text-[#c5a059] uppercase tracking-widest block mb-1">{copy.viewPortrait}</span>
                <p className="font-serif text-sm text-white font-medium leading-tight">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Screen Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 select-none">
            {/* Close trigger overlay */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all focus:outline-none z-50"
              aria-label={copy.closeAlbum}
            >
              <X size={26} />
            </button>

            {/* Left Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-white/15 p-3 rounded-full transition-all focus:outline-none z-50"
              aria-label={copy.previousImage}
            >
              <ChevronLeft size={28} />
            </button>

            {/* Right Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-white/15 p-3 rounded-full transition-all focus:outline-none z-50"
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
                  src={ALBUM_IMAGES[lightboxIndex].url}
                  alt={ALBUM_IMAGES[lightboxIndex].caption}
                  className="rounded-lg shadow-2xl max-w-full max-h-[75vh] md:max-h-[80vh] object-contain mx-auto border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Footer Label and counter */}
            <div className="bg-gradient-to-t from-black via-black/80 to-transparent p-6 text-center text-white space-y-2 pb-12">
              <span className="font-mono text-xs text-neutral-400">
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
      <section className="w-full max-w-[1140px] px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Couple Intertwined Hands Image */}
          <div className="md:col-span-7 h-[380px] md:h-[550px] relative overflow-hidden rounded group border border-[#e3e2e1]">
            <img
              src="https://res.cloudinary.com/dp2vpbmjg/image/upload/v1781190833/Brown_and_Gray_Minimalist_Photo_Frame_Mockup_Pinterest_Pin_1_fn4v5v.png"
              alt={WEDDING_CONFIG.copy.accessibility.coupleRings}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <span className="font-sans font-semibold text-xs tracking-widest uppercase text-[#c5a059] block mb-1">
                {copy.memoryEyebrow}
              </span>
              <p className="font-serif text-2xl md:text-3xl font-medium">{copy.memoryTitle}</p>
            </div>
          </div>

          {/* Ceremony Card Info */}
          <div className="md:col-span-5 bg-[#f4f3f2] p-8 md:p-10 flex flex-col justify-center border border-[#d1c5b4] relative rounded">
            <Sparkles className="text-[#c5a059] absolute top-6 right-6 opacity-40 animate-pulse" size={32} />

            <h3 className="font-serif text-3xl text-on-surface mb-6 font-semibold">{schedule.ceremonyTitle}</h3>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-[#e6e3d4] p-3 rounded-full text-[#775a19]">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-sans font-bold text-xs text-[#605f53] tracking-widest uppercase mb-1">
                    {copy.timeLabel}
                  </p>
                  <p className="font-sans text-sm text-[#4e4639]">{schedule.ceremonyTimeLabel}</p>
                  <p className="font-serif text-lg text-on-surface font-semibold">{schedule.ceremonyTime}</p>
                  <p className="font-sans text-sm text-[#4e4639]">{schedule.ceremonyDate}</p>
                  <p className="font-sans text-sm text-[#4e4639]">{copy.receptionArrivalLabel}: {schedule.receptionArrivalTime}</p>
                  <p className="font-sans text-sm text-[#4e4639]">{schedule.receptionTitle}: {schedule.receptionTime}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-[#e6e3d4] p-3 rounded-full text-[#775a19]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-sans font-bold text-xs text-[#605f53] tracking-widest uppercase mb-1">
                    {copy.venueLabel}
                  </p>
                  <p className="font-serif text-lg text-on-surface font-semibold">{schedule.ceremonyVenueName}</p>
                  <p className="font-sans text-sm text-[#4e4639] leading-relaxed">
                    {schedule.ceremonyAddress}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={ceremonyMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 block py-3.5 text-center border border-[#775a19] text-[#775a19] font-sans font-bold text-xs rounded-sm hover:bg-[#775a19] hover:text-white active:scale-95 transition-all uppercase tracking-wider shadow-sm"
            >
              {copy.mapButton}
            </a>
          </div>

          {/* Message / Quote Box */}
          <div className="md:col-span-12 bg-[#faf9f8] p-10 text-center border-t border-b border-[#d1c5b4] relative my-4 rounded-sm">
            <div className="max-w-2xl mx-auto italic text-[#4e4639] text-base md:text-lg font-serif leading-relaxed">
              "{copy.loveQuote}"
            </div>
            <div className="mt-6 flex justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]/85" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]/45" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#775a19]/25" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Wishing Wall & Blessings Portal (Bức tường Chúc phúc) */}
      <section className="w-full max-w-[1140px] px-6 py-12 text-center bg-transparent">
        <span className="font-sans font-bold text-[10px] text-[#775a19] tracking-[0.3em] block mb-4 uppercase">
          {copy.wishesEyebrow}
        </span>
        <h3 className="font-serif text-3xl md:text-4xl text-on-surface font-semibold mb-3">
          {copy.wishesTitle}
        </h3>
        <p className="font-sans text-xs text-[#605f53] mb-12 max-w-lg mx-auto leading-relaxed">
          {copy.wishesDescription}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Senders Wall displaying blessings */}
          <div className="lg:col-span-7 space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar text-left">
            {activeWishes.length === 0 ? (
              <div className="bg-white p-12 border border-[#e3d1b4]/40 rounded-lg text-center shadow-inner space-y-3">
                <span className="text-3xl">{WEDDING_CONFIG.copy.decoration.dove}</span>
                <p className="font-serif italic text-neutral-400">{copy.noWishes}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeWishes.map((g) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-[#e3d1b4]/45 p-6 rounded shadow-sm hover:shadow-md relative overflow-hidden transition-all duration-300 group"
                  >
                    {/* Flower deco detail */}
                    <div className="absolute top-1 right-2 text-[#775a19]/10 text-xl font-serif select-none pointer-events-none">
                      ✿
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="bg-[#775a19]/10 text-[#775a19] text-[9px] font-sans font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                          {g.group || copy.guestFallback}
                        </span>
                        <h4 className="font-serif text-base font-bold text-[#222] mt-1.5 tracking-tight">
                          {g.name}
                        </h4>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-[#4e4639] italic leading-relaxed py-1 border-t border-dotted border-gray-100 my-2">
                      "{g.blessing}"
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-2 font-mono">
                      <span>
                        {g.updatedAt ? new Date(g.updatedAt).toLocaleDateString('vi-VN') : copy.newWish}
                      </span>

                      {/* Interactive Love Counter */}
                      <button
                        onClick={(e) => handleLikeBlessing(g.id, e)}
                        className={`flex items-center gap-1 py-1 px-2 rounded-full border transition-all ${userLiked[g.id]
                          ? 'bg-red-50 border-red-200 text-red-600 font-bold shadow-sm'
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-500 hover:text-red-500'
                          }`}
                        title={userLiked[g.id] ? copy.unlike : copy.like}
                      >
                        <Heart size={10} className={userLiked[g.id] ? 'fill-red-600' : ''} />
                        <span>{blessingLikes[g.id] || (g.id === 'g1' ? 12 : g.id === 'g3' ? 8 : g.id === 'g4' ? 6 : g.id === 'g5' ? 9 : 0)}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick write-blessing form */}
          <div className="lg:col-span-5 bg-[#faf9f8] p-8 border border-[#d1c5b4] rounded shadow-md text-left">
            <h4 className="font-serif text-xl font-bold text-on-surface mb-2">{copy.wishFormTitle}</h4>
            <p className="font-sans text-xs text-[#605f53] mb-6 leading-relaxed">
              {copy.wishFormDescription}
            </p>

            <form onSubmit={handleSendBlessingSubmit} className="space-y-4">
              <div>
                <label className="font-sans font-bold text-[9px] text-[#605f53] uppercase tracking-wider block mb-1">
                  {copy.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={copy.namePlaceholder}
                  value={blessingName}
                  onChange={(e) => setBlessingName(e.target.value)}
                  className="w-full bg-white border border-[#e3e2e1] active:border-[#775a19] focus:outline-none focus:border-[#775a19] transition-all py-2.5 px-3 rounded text-sm placeholder:text-neutral-300 text-on-surface"
                />
              </div>

              <div>
                <label className="font-sans font-bold text-[9px] text-[#605f53] uppercase tracking-wider block mb-1">
                  {copy.wishLabel}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={copy.wishPlaceholder}
                  value={blessingMessage}
                  onChange={(e) => setBlessingMessage(e.target.value)}
                  className="w-full bg-white border border-[#e3e2e1] active:border-[#775a19] focus:outline-none focus:border-[#775a19] transition-all py-2.5 px-3 rounded text-sm placeholder:text-neutral-300 text-on-surface resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#775a19] hover:bg-[#c5a059] active:scale-95 text-white font-sans font-bold text-xs py-3 rounded hover:shadow transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Send size={12} />
                {copy.sendWish}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* RSVP Quick Form Section */}
      <section className="w-full bg-[#e6e3d4] py-16 px-4 flex justify-center" id="rsvp-fast">
        <div className="max-w-lg w-full bg-white p-8 md:p-12 shadow-md border border-[#E3D1B4] text-center rounded">
          <h3 className="font-serif text-2xl md:text-3xl text-[#775a19] mb-3 font-semibold">
            {copy.rsvpTitle}
          </h3>
          <p className="font-sans text-sm text-secondary mb-8 leading-relaxed">
            {copy.rsvpDescription}
          </p>

          {submitSuccess ? (
            <div className="py-8 px-4 flex flex-col items-center gap-3 text-[#775a19]">
              <CheckCircle2 size={48} className="animate-bounce text-[#775a19]" />
              <p className="font-serif text-xl font-semibold">{copy.rsvpSuccessTitle}</p>
              <p className="font-sans text-sm text-[#4e4639] leading-relaxed">
                {copy.rsvpSuccessDescription}
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuickRsvpSubmit} className="space-y-6">
              <div className="relative border-b border-[#7f7667] focus-within:border-[#775a19] transition-colors py-2">
                <input
                  type="text"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder={copy.rsvpNamePlaceholder}
                  required
                  className="w-full text-center bg-transparent border-none focus:outline-none focus:ring-0 text-lg font-sans placeholder-[#8c8273]/60 text-on-surface"
                />
              </div>

              <div className="flex justify-center gap-8 py-2">
                <button
                  type="button"
                  onClick={() => setIsAttending(true)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${isAttending === true
                    ? 'bg-[#775a19] border-[#775a19] text-white font-bold shadow-sm'
                    : 'border-[#7f7667]/45 text-secondary hover:border-[#775a19]'
                    }`}
                >
                  <CheckCircle2 size={16} />
                  <span className="font-sans text-xs tracking-wider uppercase font-semibold">{copy.attending}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAttending(false)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all ${isAttending === false
                    ? 'bg-red-800 border-red-800 text-white font-bold shadow-sm'
                    : 'border-[#7f7667]/45 text-secondary hover:border-red-800'
                    }`}
                >
                  <XCircle size={16} />
                  <span className="font-sans text-xs tracking-wider uppercase font-semibold">{copy.notAttending}</span>
                </button>
              </div>

              {isAttending === true && (
                <div className="bg-[#f4f3f2] p-5 rounded border border-[#E3D1B4]/40 animate-fade-in-up">
                  <label className="font-sans text-xs text-[#605f53] block mb-2 font-bold uppercase tracking-wider">
                    {copy.partySize}
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-8 h-8 rounded-full border border-[#7f7667] text-[#775a19] hover:bg-[#775a19] hover:text-white text-lg font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-lg font-sans font-bold text-on-surface w-12 text-center">
                      {guestsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(guestsCount + 1)}
                      className="w-8 h-8 rounded-full border border-[#7f7667] text-[#775a19] hover:bg-[#775a19] hover:text-white text-lg font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isAttending === null}
                className={`w-full font-sans font-bold text-xs py-4 uppercase tracking-widest rounded-sm transition-all shadow-md ${isAttending !== null
                  ? 'bg-[#775a19] text-white hover:bg-[#c5a059] cursor-pointer'
                  : 'bg-[#eeeeed] text-[#7f7667] cursor-not-allowed'
                  }`}
              >
                {copy.sendRsvp}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
