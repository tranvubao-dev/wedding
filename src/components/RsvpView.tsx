/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Users, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { Guest } from '../types';
import { WEDDING_CONFIG } from '../config';

interface RsvpViewProps {
  currentGuestName: string;
  onRsvpComplete: (guestData: Partial<Guest>) => Promise<void>;
}

export default function RsvpView({ currentGuestName, onRsvpComplete }: RsvpViewProps) {
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submitLock = useRef(false);
  const copy = WEDDING_CONFIG.copy.rsvpView;
  const [fullName, setFullName] = useState('');
  const [guestsCount, setGuestsCount] = useState<string>(copy.alone);
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [relation, setRelation] = useState<'BRIDE' | 'GROOM'>('BRIDE');
  const [blessing, setBlessing] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (currentGuestName && currentGuestName !== WEDDING_CONFIG.copy.common.guest) {
      setFullName(currentGuestName);
    }
  }, [currentGuestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    if (isAttending === null) return;

    let parsedCount = 1;
    if (guestsCount === copy.plusOne) parsedCount = 2;
    if (guestsCount === copy.plusTwo) parsedCount = 3;
    if (guestsCount === copy.family) parsedCount = 4;
    if (!isAttending) parsedCount = 0;

    if (submitLock.current) return;
    submitLock.current = true;
    setSending(true);
    setSubmitError('');
    try {
      await onRsvpComplete({
        name: fullName.trim(),
        guestsCount: parsedCount,
        relation,
        blessing,
        rsvpStatus: isAttending ? 'ATTENDING' : 'DECLINED',
        status: 'CONFIRMED',
      });

      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        // Reset form if not logged guest
        if (!currentGuestName || currentGuestName === WEDDING_CONFIG.copy.common.guest) {
          setFullName('');
          setBlessing('');
          setIsAttending(null);
          setGuestsCount(copy.alone);
        }
      }, 4000);
    } catch {
      setSubmitError('Chưa gửi được RSVP. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      submitLock.current = false;
      setSending(false);
    }
  };

  return (
    <div className="w-full relative py-6">
      {/* Decorative Botanical corners */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_1.5px_1.5px,#E3D1B4_1.5px,transparent_0)] [background-size:30px_30px] opacity-15 rounded-bl-full pointer-events-none -z-15" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_1.5px_1.5px,#E3D1B4_1.5px,transparent_0)] [background-size:30px_30px] opacity-5 rounded-tr-full pointer-events-none -z-15" />

      <div className="max-w-2xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="font-sans font-semibold text-xs text-primary mb-2 block tracking-[0.2em] uppercase">
            {copy.eyebrow}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-on-surface mb-4 font-bold tracking-tight">
            {copy.title}
          </h2>
          <p className="font-sans text-base text-secondary italic max-w-lg mx-auto leading-relaxed">
            {copy.intro}
          </p>
        </div>

        {/* Form Card */}
        <div className="stationery-panel bg-surface border border-outline-variant/70 p-6 sm:p-8 md:p-12 relative overflow-hidden rounded-sm">
          {/* Floral design water mark */}
          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
            <span className="font-serif text-4xl text-primary text-primary">
              {WEDDING_CONFIG.copy.decoration.flower}
            </span>
          </div>

          {submitError && (
            <p role="alert" className="text-red-700 mb-4">
              {submitError}
            </p>
          )}
          {showConfirmation ? (
            <div className="py-12 text-center text-primary flex flex-col items-center gap-4 animate-fade-in-up">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-2">
                <Heart size={32} className="fill-primary" />
              </div>
              <p className="font-serif text-2xl font-semibold">
                {isAttending ? copy.successAttendingTitle : copy.successDeclinedTitle}
              </p>
              <p className="font-sans text-sm text-secondary">
                {isAttending ? copy.successAttendingDescription : copy.successDeclinedDescription}
              </p>
              <div className="w-12 h-0.5 bg-outline-variant my-2" />
              <p className="text-xs font-sans text-secondary italic">
                {isAttending ? copy.successAttendingFooter : copy.successDeclinedFooter}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Full Name field */}
              <div className="space-y-2">
                <label className="font-sans font-bold text-xs text-secondary block tracking-widest uppercase">
                  {copy.name}
                </label>
                <div className="border-b border-outline-variant focus-within:border-primary transition-colors py-1">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder={copy.namePlaceholder}
                    maxLength={150}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-sans text-base text-on-surface placeholder-neutral-400"
                  />
                </div>
              </div>

              {/* Attendance decision */}
              <fieldset className="space-y-3">
                <legend className="font-sans font-bold text-xs text-secondary block tracking-widest uppercase">
                  {copy.attendanceQuestion}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-all ${isAttending === true ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-secondary hover:border-primary'}`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      checked={isAttending === true}
                      onChange={() => setIsAttending(true)}
                      className="accent-primary"
                    />
                    <span className="font-sans text-sm font-semibold">{copy.attendingChoice}</span>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-all ${isAttending === false ? 'border-red-700 bg-red-50 text-red-800' : 'border-outline-variant text-secondary hover:border-red-700'}`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      checked={isAttending === false}
                      onChange={() => setIsAttending(false)}
                      className="accent-red-700"
                    />
                    <span className="font-sans text-sm font-semibold">{copy.declinedChoice}</span>
                  </label>
                </div>
              </fieldset>

              {/* Grid Column count and friend selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Number of accompanying guest dropdown */}
                {isAttending === true && (
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs text-secondary block tracking-widest uppercase">
                      {copy.partySize}
                    </label>
                    <div className="relative flex items-center border-b border-outline-variant focus-within:border-primary py-1">
                      <Users size={16} className="text-secondary/70 mr-3" />
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-sans text-sm text-on-surface appearance-none cursor-pointer"
                      >
                        <option value={copy.alone}>{copy.alone}</option>
                        <option value={copy.plusOne}>{copy.plusOne}</option>
                        <option value={copy.plusTwo}>{copy.plusTwo}</option>
                        <option value={copy.family}>{copy.family}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Relation choosing */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs text-secondary block tracking-widest uppercase">
                    {copy.relation}
                  </label>
                  <div className="flex gap-6 pt-2">
                    {/* Bride label */}
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="relationship"
                        checked={relation === 'BRIDE'}
                        onChange={() => setRelation('BRIDE')}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 border border-primary rounded-full mr-2.5 flex items-center justify-center transition-colors group-hover:bg-primary/10 ${
                          relation === 'BRIDE' ? 'bg-primary' : ''
                        }`}
                      >
                        <span className="w-1.5 h-1.5 bg-surface rounded-full" />
                      </span>
                      <span className="font-sans font-semibold text-xs text-secondary tracking-widest group-hover:text-primary uppercase">
                        {WEDDING_CONFIG.copy.common.bride}
                      </span>
                    </label>

                    {/* Groom label */}
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="relationship"
                        checked={relation === 'GROOM'}
                        onChange={() => setRelation('GROOM')}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 border border-primary rounded-full mr-2.5 flex items-center justify-center transition-colors group-hover:bg-primary/10 ${
                          relation === 'GROOM' ? 'bg-primary' : ''
                        }`}
                      >
                        <span className="w-1.5 h-1.5 bg-surface rounded-full" />
                      </span>
                      <span className="font-sans font-semibold text-xs text-secondary tracking-widest group-hover:text-primary uppercase">
                        {WEDDING_CONFIG.copy.common.groom}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Lời chúc / Blessing */}
              <div className="space-y-2">
                <label className="font-sans font-bold text-xs text-secondary block tracking-widest uppercase">
                  {copy.blessing} (tên và lời chúc sẽ hiển thị công khai)
                </label>
                <div className="border border-outline-variant rounded-sm p-4 bg-surface-container-low/30 focus-within:border-primary focus-within:bg-surface transition-all">
                  <textarea
                    rows={4}
                    value={blessing}
                    onChange={(e) => setBlessing(e.target.value)}
                    placeholder={copy.blessingPlaceholder}
                    maxLength={2000}
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 font-sans text-sm text-on-surface placeholder-neutral-400 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={sending || isAttending === null}
                className={`w-full py-4 font-sans font-bold text-xs tracking-[0.15em] transition-all rounded shadow-md active:scale-95 transform duration-150 uppercase ${isAttending === null ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'metal-button bg-primary hover:bg-primary-container text-white'}`}
              >
                {sending ? 'Đang gửi…' : copy.submit}
              </button>
            </form>
          )}
        </div>

        {/* Aesthetic Image Support on bottom */}
        <div className="mt-16 grid grid-cols-2 gap-4 pb-12">
          <div className="stationery-panel bg-surface border border-outline-variant rounded shadow-sm overflow-hidden h-[180px] md:h-[240px]">
            <img
              src={WEDDING_CONFIG.images.rsvpInvitation}
              alt={copy.image1Alt}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="stationery-panel bg-surface border border-outline-variant rounded shadow-sm overflow-hidden h-[180px] md:h-[240px] translate-y-6">
            <img
              src={WEDDING_CONFIG.images.rsvpReception}
              alt={copy.image2Alt}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
