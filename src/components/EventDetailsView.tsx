import { optimizedImage, responsiveImage } from '../imageUtils';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, MapPin, Compass, Sparkles, Utensils, Award } from 'lucide-react';
import { WEDDING_CONFIG } from '../config';

interface EventDetailsViewProps {
  onNavigateToRsvp: () => void;
  guestGroup: string;
}

export default function EventDetailsView({ onNavigateToRsvp, guestGroup }: EventDetailsViewProps) {
  const copy = WEDDING_CONFIG.copy.detailsView;
  const [groomGroup, brideGroup] = WEDDING_CONFIG.copy.adminView.groupOptions;
  const selectedGroup = guestGroup || groomGroup;
  const schedule =
    selectedGroup === brideGroup
      ? WEDDING_CONFIG.guestSchedules.bride
      : WEDDING_CONFIG.guestSchedules.groom;
  const programSections = schedule.programSections.map(
    (sectionKey) => WEDDING_CONFIG.program[sectionKey],
  );
  const buildCalendarUrl = (title: string, time: string, dateIso: string, location: string) => {
    const [year, month, day] = dateIso.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const start = new Date(year, month - 1, day, hours, minutes);
    const end = new Date(start.getTime() + copy.calendarDurationMinutes * 60 * 1000);
    const formatCalendarDate = (date: Date) =>
      `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}00`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      ctz: 'Asia/Ho_Chi_Minh',
      text: title,
      dates: `${formatCalendarDate(start)}/${formatCalendarDate(end)}`,
      details: copy.intro,
      location,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };
  return (
    <div className="w-full">
      {/* Hero Header Section */}
      <section className="relative h-[480px] md:h-[580px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 botanical-overlay stationery-hero" aria-hidden="true">
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
        <div className="relative text-center z-10 px-6 max-w-xl animate-fade-in-up">
          <p className="font-sans font-semibold text-xs text-on-surface mb-4 tracking-[0.35em] uppercase">
            {schedule.invitationTitle}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-on-surface mb-6 font-bold tracking-wide">
            {copy.title}
          </h2>
          <div className="w-16 h-[1.5px] bg-surface mx-auto mb-6" />
          <p className="font-sans text-sm text-on-surface/95 leading-relaxed tracking-wide">
            {copy.intro}
          </p>
          <p className="mt-4 font-serif text-on-surface text-lg">{schedule.dateLine}</p>
          <p className="mt-1 font-sans text-xs text-on-surface/85">{schedule.lunarDate}</p>
          <p className="mt-4 inline-block rounded-full border border-outline-variant/50 px-4 py-2 font-sans text-xs font-semibold text-on-surface">
            {copy.groupScheduleLabel}: {selectedGroup}
          </p>
        </div>
      </section>

      {/* Main Content Info Grid */}
      <div className="max-w-[1140px] mx-auto px-6 -mt-16 relative z-20 pb-24">
        {/* Ceremory & Reception dual cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Ceremony Card */}
          <div className="stationery-panel bg-surface border border-outline-variant p-8 md:p-12 shadow-sm flex flex-col items-center text-center rounded hover:shadow-md transition-all">
            <div className="bg-surface-container-low/40 p-4 rounded-full text-primary mb-6">
              <Sparkles size={32} />
            </div>
            <h3 className="font-serif text-2xl text-on-surface mb-1 font-semibold">
              {schedule.ceremonyTitle}
            </h3>
            <p className="font-sans font-bold text-xs text-secondary mb-6 tracking-widest uppercase">
              {copy.ceremonyType}
            </p>

            <div className="space-y-2 mb-8 text-secondary">
              <p className="font-serif text-2xl font-bold text-primary">{schedule.ceremonyTime}</p>
              <p className="font-sans text-sm font-semibold">{schedule.ceremonyDate}</p>
              <p className="font-sans text-xs text-secondary">{schedule.ceremonyTimeLabel}</p>
              <p className="font-sans text-xs text-secondary italic">
                {schedule.ceremonyVenueName}: {schedule.ceremonyAddress}
              </p>
            </div>

            <div className="w-full h-[1px] bg-outline-variant/50 mb-6" />

            <a
              href={buildCalendarUrl(
                schedule.ceremonyTitle,
                schedule.ceremonyTime,
                schedule.ceremonyDateIso,
                `${schedule.ceremonyVenueName}, ${schedule.ceremonyAddress}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs font-bold text-primary hover:text-primary-container flex items-center gap-1.5 transition-colors uppercase tracking-wider py-1 border-b border-primary hover:border-primary-container"
            >
              <Calendar size={13} />
              {WEDDING_CONFIG.copy.common.calendar}
            </a>
          </div>

          {/* Reception Card */}
          <div className="stationery-panel bg-surface border border-outline-variant p-8 md:p-12 shadow-sm flex flex-col items-center text-center rounded hover:shadow-md transition-all">
            <div className="bg-surface-container-low/40 p-4 rounded-full text-primary mb-6">
              <Utensils size={32} />
            </div>
            <h3 className="font-serif text-2xl text-on-surface mb-1 font-semibold">
              {schedule.receptionTitle}
            </h3>
            <p className="font-sans font-bold text-xs text-secondary mb-6 tracking-widest uppercase">
              {copy.receptionType}
            </p>

            <div className="space-y-2 mb-8 text-secondary">
              <p className="font-serif text-2xl font-bold text-primary">
                {copy.guestArrivalLabel}: {schedule.receptionArrivalTime}
              </p>
              {schedule.receptionTime !== schedule.receptionArrivalTime && (
                <p className="font-serif text-lg font-semibold text-primary">
                  {copy.receptionScheduleLabel}: {schedule.receptionTime}
                </p>
              )}
              <p className="font-sans text-sm font-semibold">{schedule.receptionDate}</p>
              <p className="font-sans text-xs text-secondary italic">
                {schedule.receptionVenueName}: {schedule.receptionAddress}
              </p>
            </div>

            <div className="w-full h-[1px] bg-outline-variant/50 mb-6" />

            <a
              href={buildCalendarUrl(
                schedule.receptionTitle,
                schedule.receptionTime,
                schedule.receptionDateIso,
                `${schedule.receptionVenueName}, ${schedule.receptionAddress}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs font-bold text-primary hover:text-primary-container flex items-center gap-1.5 transition-colors uppercase tracking-wider py-1 border-b border-primary hover:border-primary-container"
            >
              <Calendar size={13} />
              {WEDDING_CONFIG.copy.common.calendar}
            </a>
          </div>
        </div>

        {/* Location & Map Section */}
        <section className="bg-surface-container-low border border-outline-variant p-8 md:p-12 rounded shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Location content */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-block bg-primary/10 px-3 py-1 rounded-sm text-primary font-sans font-bold text-[10px] tracking-widest">
                {copy.locationBadge}
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-on-surface font-semibold tracking-tight">
                {copy.locationTitle}
              </h3>

              <div className="space-y-6 text-on-surface">
                <div>
                  <p className="font-serif text-xl font-bold text-on-surface">
                    {schedule.receptionVenueName}
                  </p>
                </div>

                <div>
                  <p className="font-sans font-bold text-[11px] text-primary mb-1 tracking-widest uppercase">
                    {schedule.receptionAddress}
                  </p>
                  {/* <p className="font-sans text-sm text-secondary leading-relaxed">
                    {schedule.ceremonyAddress}
                  </p> */}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href={schedule.receptionAddressMap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="metal-button bg-primary hover:bg-primary-container text-white px-6 py-3.5 font-sans font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 shadow-sm"
                >
                  <Compass size={14} />
                  {copy.directions}
                </a>
                <button
                  onClick={onNavigateToRsvp}
                  className="border border-primary hover:bg-primary/5 text-primary px-6 py-3.5 font-sans font-bold text-xs uppercase tracking-widest rounded-sm transition-all"
                >
                  {copy.rsvp}
                </button>
              </div>
            </div>

            {/* Right Map Image */}
            <div className="lg:col-span-7 h-[320px] lg:h-[380px] w-full bg-outline-variant relative overflow-hidden rounded border border-outline-variant group shadow-inner">
              <img
                src={optimizedImage(schedule.receptionImagemap, 960)}
                srcSet={responsiveImage(schedule.receptionImagemap)}
                sizes="(max-width: 1024px) calc(100vw - 96px), 600px"
                loading="lazy"
                decoding="async"
                alt={copy.mapAlt}
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-primary p-4 rounded-full shadow-2xl border border-white/20 animate-pulse">
                  <MapPin size={28} className="text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Schedule / Timeline Section */}
        <section className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans font-semibold text-xs text-primary mb-2 tracking-[0.35em] uppercase">
              {copy.timelineEyebrow}
            </p>
            <h3 className="font-serif text-3xl md:text-4xl text-on-surface font-semibold">
              {copy.timelineTitle}
            </h3>
            <div className="mt-4 flex justify-center text-primary opacity-75">
              <Award size={20} className="animate-spin-slow" />
            </div>
          </div>

          <div className="relative">
            {/* Central Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-[1.5px] bg-outline-variant" />

            {/* Timeline Events Stack */}
            <div className="space-y-12 relative">
              {programSections.map((section) => (
                <div key={section.title} className="relative">
                  <div className="text-center bg-background border border-outline-variant rounded px-5 py-4 mb-10 relative z-10">
                    <h4 className="font-serif text-xl font-bold text-on-surface">
                      {section.title}
                    </h4>
                    <p className="font-sans text-sm text-secondary mt-1">{section.dateText}</p>
                  </div>
                  <div className="space-y-12">
                    {section.events.map((event, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <div
                          key={`${event.time}-${event.title}`}
                          className={`flex flex-col md:flex-row items-center justify-between group ${
                            isEven ? '' : 'md:flex-row-reverse'
                          }`}
                        >
                          {/* Time & description text block */}
                          <div
                            className={`md:w-5/12 text-center mb-4 md:mb-0 ${
                              isEven ? 'md:text-right' : 'md:text-left'
                            }`}
                          >
                            <span className="font-sans font-bold text-sm text-primary block mb-1">
                              {event.time}
                            </span>
                            <h4 className="font-serif text-lg font-bold text-on-surface">
                              {event.title}
                            </h4>
                            <p className="font-sans text-sm text-secondary mt-1 leading-relaxed">
                              {event.location}
                            </p>
                          </div>

                          {/* Central Indicator Node */}
                          <div className="z-10 bg-surface border-2 border-primary w-4.5 h-4.5 rounded-full group-hover:scale-135 transition-transform duration-300 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          </div>

                          {/* Empty block for spacing on other side */}
                          <div className="md:w-5/12 hidden md:block" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
