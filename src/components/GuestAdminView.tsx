/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  MailCheck,
  Search,
  Filter,
  Copy,
  Eye,
  Plus,
  Trash2,
  TrendingUp,
  PartyPopper,
  Sparkles
} from 'lucide-react';
import { Guest, WeddingStats } from '../types';
import { WEDDING_CONFIG } from '../config';

interface GuestAdminViewProps {
  guests: Guest[];
  onAddGuest: (name: string, group: string) => void;
  onDeleteGuest: (id: string) => void;
  onPreviewGuest: (guest: Guest) => void;
  onTriggerCopyToast: (guestName: string) => void;
  themeTone: string;
  themeAccent: string;
  onChangeTheme: (tone: string, accent: string) => void;
}

export default function GuestAdminView({
  guests,
  onAddGuest,
  onDeleteGuest,
  onPreviewGuest,
  onTriggerCopyToast,
  themeTone,
  themeAccent,
  onChangeTheme,
}: GuestAdminViewProps) {
  const copy = WEDDING_CONFIG.copy.adminView;
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestGroup, setNewGuestGroup] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('ALL');

  // Theme Customizer Preset Values
  const THEME_PRESETS = copy.presets;

  const [customTone, setCustomTone] = useState(themeTone);
  const [customAccent, setCustomAccent] = useState(themeAccent);

  const handleSelectPreset = (tone: string, accent: string) => {
    setCustomTone(tone);
    setCustomAccent(accent);
    onChangeTheme(tone, accent);
  };

  const handleCustomToneChange = (val: string) => {
    setCustomTone(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChangeTheme(val, customAccent);
    }
  };

  const handleCustomAccentChange = (val: string) => {
    setCustomAccent(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChangeTheme(customTone, val);
    }
  };

  // Compute stats
  const totalGuests = guests.length;
  // Each guestsCount includes the invitee and anyone accompanying them.
  const totalPeopleAttending = guests
    .filter((g) => g.rsvpStatus === 'ATTENDING')
    .reduce((sum, g) => sum + g.guestsCount, 0);

  const attendingInvitations = guests.filter((g) => g.rsvpStatus === 'ATTENDING').length;
  const declinedInvitations = guests.filter((g) => g.rsvpStatus === 'DECLINED').length;
  const pendingInvitations = guests.filter((g) => g.rsvpStatus === 'PENDING').length;

  const respondedCount = attendingInvitations + declinedInvitations;
  const responseRate = totalGuests > 0 ? Math.round((respondedCount / totalGuests) * 100) : 0;

  // Handle invitation link copying
  const handleCopyLink = (guest: Guest) => {
    const personalUrl = new URL(window.location.href);
    personalUrl.search = '';
    personalUrl.hash = '';
    personalUrl.searchParams.set('to', guest.name);
    if (guest.group) personalUrl.searchParams.set('group', guest.group);

    navigator.clipboard.writeText(personalUrl.toString())
      .then(() => {
        onTriggerCopyToast(guest.name);
      })
      .catch((err) => {
        console.error(WEDDING_CONFIG.copy.logs.clipboardFailed, err);
      });
  };

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    onAddGuest(newGuestName.trim(), newGuestGroup.trim() || WEDDING_CONFIG.copy.adminView.groupOptions[0]);
    setNewGuestName('');
    setNewGuestGroup('');
  };

  // Extract unique groups for filters
  const allGroups = Array.from(new Set(guests.map((g) => g.group).filter(Boolean)));

  // Filter & Search logic
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.group.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterGroup === 'ALL') return matchesSearch;
    return matchesSearch && guest.group === filterGroup;
  });

  return (
    <div className="w-full">
      {/* Intro section */}
      <div className="mb-10 animate-fade-in-up">
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-2 font-bold select-none tracking-tight">
          {copy.title}
        </h2>
        <p className="font-sans text-sm text-[#605f53] max-w-2xl leading-relaxed">
          {copy.description}
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Creation & Theme Settings) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          
          {/* Creation section */}
          <section className="bg-white border border-[#e3e2e1] p-8 rounded relative overflow-hidden group hover:border-[#d1c5b4] transition-all shadow-sm">
            {/* Ornamental watermark */}
            <div className="absolute -top-6 -right-6 opacity-8 pointer-events-none transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 text-[#775a19]">
              <span className="font-serif text-[130px] leading-none">{WEDDING_CONFIG.copy.decoration.flower}</span>
            </div>

            <form onSubmit={handleCreateGuest} className="flex flex-col justify-between h-full">
              <div>
                <h3 className="font-serif text-2xl text-[#775a19] mb-6 font-semibold flex items-center gap-2">
                  <PartyPopper size={20} />
                  {copy.addTitle}
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="font-sans font-bold text-[11px] text-[#605f53] block tracking-widest uppercase">
                      {copy.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      placeholder={copy.namePlaceholder}
                      className="w-full bg-transparent border-b border-[#e3e2e1] py-3 text-base text-on-surface placeholder-neutral-300 focus:outline-none focus:border-[#775a19] focus:ring-0 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-sans font-bold text-[11px] text-[#605f53] block tracking-widest uppercase">
                      {copy.group}
                    </label>
                    <select
                      value={newGuestGroup}
                      onChange={(e) => setNewGuestGroup(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-[#e3e2e1] py-3 text-base text-on-surface focus:outline-none focus:border-[#775a19] focus:ring-0 transition-all font-sans"
                    >
                      <option value="" disabled>{copy.groupPlaceholder}</option>
                      {copy.groupOptions.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  className="w-full bg-[#775a19] hover:bg-[#c5a059] text-white py-4 px-6 font-sans font-bold text-xs tracking-widest hover:shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer rounded-sm"
                >
                  <span>{copy.create}</span>
                  <Plus size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </section>

          {/* Theme Color Customizer section */}
          <section className="bg-white border border-[#e3e2e1] p-8 rounded relative overflow-hidden group hover:border-[#d1c5b4] transition-all shadow-sm">
            <h3 className="font-serif text-2xl text-primary mb-3 font-semibold flex items-center gap-2">
              <Sparkles size={20} className="text-primary animate-pulse" />
              {copy.themeTitle}
            </h3>
            <p className="font-sans text-xs text-neutral-500 mb-6 leading-relaxed">
              {copy.themeDescription}
            </p>

            <div className="space-y-5">
              <div>
                <label className="font-sans font-bold text-[10px] text-[#605f53] block tracking-widest uppercase mb-2">
                  {copy.themePresetsLabel}
                </label>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {THEME_PRESETS.map((preset) => {
                    const isActive = themeTone.toLowerCase() === preset.tone.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleSelectPreset(preset.tone, preset.accent)}
                        className={`flex flex-col items-start p-2.5 rounded border text-left transition-all cursor-pointer ${
                          isActive
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-[#e3e2e1] hover:border-[#d1c5b4]'
                        }`}
                      >
                        <span className="font-sans font-semibold text-[11px] text-[#1a1c1c] block mb-1.5 leading-tight truncate w-full">
                          {preset.name}
                        </span>
                        <div className="flex gap-1 mb-1 items-center">
                          <span
                            className="w-4.5 h-4.5 rounded-full border border-black/10 inline-block flex-shrink-0"
                            style={{ backgroundColor: preset.tone }}
                          />
                          <span
                            className="w-4.5 h-4.5 rounded-full border border-black/10 inline-block flex-shrink-0"
                            style={{ backgroundColor: preset.accent }}
                          />
                        </div>
                        <span className="text-[8.5px] font-sans text-neutral-400 font-medium truncate w-full">
                          {preset.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom selection block */}
              <div className="border-t border-dotted border-[#e3e2e1] pt-4 mt-3 space-y-3">
                <label className="font-sans font-bold text-[10px] text-[#605f53] block tracking-widest uppercase">
                  {copy.customColorLabel}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Primary Tone input */}
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] text-neutral-400 block">{copy.primaryColor}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-7 h-7 rounded border border-[#e3e2e1] overflow-hidden flex-shrink-0 cursor-pointer">
                        <input
                          type="color"
                          value={customTone}
                          onChange={(e) => handleCustomToneChange(e.target.value)}
                          className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                        />
                      </div>
                      <input
                        type="text"
                        value={customTone}
                        onChange={(e) => handleCustomToneChange(e.target.value)}
                        placeholder={WEDDING_CONFIG.colors.primary}
                        className="w-full bg-transparent border border-[#e3e2e1] py-1 px-1.5 rounded text-[11px] text-on-surface focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>

                  {/* Accent Highlight input */}
                  <div className="space-y-1">
                    <span className="font-sans text-[10px] text-neutral-400 block">{copy.accentColor}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-7 h-7 rounded border border-[#e3e2e1] overflow-hidden flex-shrink-0 cursor-pointer">
                        <input
                          type="color"
                          value={customAccent}
                          onChange={(e) => handleCustomAccentChange(e.target.value)}
                          className="absolute inset-0 w-full h-full p-0 border-none cursor-pointer scale-150"
                        />
                      </div>
                      <input
                        type="text"
                        value={customAccent}
                        onChange={(e) => handleCustomAccentChange(e.target.value)}
                        placeholder={WEDDING_CONFIG.colors.accent}
                        className="w-full bg-transparent border border-[#e3e2e1] py-1 px-1.5 rounded text-[11px] text-on-surface focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#f4f3f2] p-2.5 rounded text-[10.5px] font-sans text-[#605f53] leading-relaxed border border-dashed border-[#e3e2e1]/80">
                  {copy.themeHint}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Counters & Recents List (Right columns) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Stats count 1 */}
          <div className="bg-[#cac7b8]/35 border border-[#e3e2e1] p-6 rounded flex flex-col justify-between hover:shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-white/70 text-[#775a19] rounded-full">
                <Users size={18} />
              </div>
              <span className="font-sans font-bold text-[9px] text-[#48473c] bg-white/60 px-2 py-1 rounded">
                {copy.invitationsMetric}
              </span>
            </div>
            <div className="mt-4">
              <p className="font-serif text-4xl md:text-5xl font-bold text-[#775a19] tracking-tight">
                {totalGuests}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="font-sans font-medium text-xs text-secondary-container text-neutral-600">
                  {attendingInvitations} {copy.attendingInvitationsSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Stats count 2 */}
          <div className="bg-[#b3a388]/20 border border-[#e3e2e1] p-6 rounded flex flex-col justify-between hover:shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-white/70 text-[#6a5d45] rounded-full">
                <MailCheck size={18} />
              </div>
              <span className="font-sans font-bold text-[9px] text-[#231a08] bg-white/60 px-2 py-1 rounded">
                {copy.responseMetric}
              </span>
            </div>
            <div className="mt-4">
              <p className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight">
                {responseRate}%
              </p>
              <p className="font-sans font-medium text-xs text-neutral-600 mt-0.5">
                {respondedCount} {copy.responded} {totalGuests} {copy.respondedSuffix}
              </p>
            </div>
          </div>

          {/* Total confirmed attendee count */}
          <div className="bg-[#775a19]/10 border border-[#d1c5b4] p-6 rounded flex flex-col justify-between hover:shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-white/70 text-[#775a19] rounded-full">
                <Users size={18} />
              </div>
              <span className="font-sans font-bold text-[9px] text-[#48473c] bg-white/60 px-2 py-1 rounded">
                {copy.peopleAttendingMetric}
              </span>
            </div>
            <div className="mt-4">
              <p className="font-serif text-4xl md:text-5xl font-bold text-[#775a19] tracking-tight">
                {totalPeopleAttending} {copy.peopleUnit}
              </p>
              <p className="font-sans font-medium text-xs text-neutral-600 mt-0.5">
                {copy.peopleAttendingDescription}
              </p>
            </div>
          </div>

          {/* Table Recent Invitations */}
          <div className="md:col-span-2 bg-white border border-[#e3e2e1] rounded overflow-hidden flex flex-col h-[520px] shadow-sm">
            
            {/* Table actions bar */}
            <div className="p-5 border-b border-[#e3e2e1] flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="font-sans font-bold text-xs text-[#775a19] uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} />
                {copy.listTitle} ({filteredGuests.length})
              </h3>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                
                {/* Search input */}
                <div className="relative flex items-center bg-surface-container-low px-3 py-1.5 rounded-sm border border-outline-variant/50 w-full sm:w-48 focus-within:border-[#775a19] transition-all">
                  <Search size={14} className="text-secondary/70 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none w-full font-sans"
                  />
                </div>

                {/* Filter Selector */}
                <div className="relative flex items-center bg-surface-container-low px-2 py-1.5 rounded-sm border border-outline-variant/50">
                  <Filter size={13} className="text-secondary/70 mr-1.5" />
                  <select
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none cursor-pointer pr-4 font-sans font-semibold"
                  >
                    <option value="ALL">{copy.allGroups}</option>
                    {allGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* List items block */}
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {filteredGuests.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-neutral-400 py-10">
                  <Users size={32} className="opacity-40" />
                  <p className="text-xs font-sans">{copy.noResults}</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f4f3f2]/70 sticky top-0 border-b border-[#e3e2e1]">
                      <th className="p-4 font-sans font-bold text-[10px] text-[#605f53] uppercase tracking-widest">
                        {copy.guestColumn}
                      </th>
                      <th className="p-4 font-sans font-bold text-[10px] text-[#605f53] uppercase tracking-widest text-center">
                        {copy.partySizeColumn}
                      </th>
                      <th className="p-4 font-sans font-bold text-[10px] text-[#605f53] uppercase tracking-widest">
                        {copy.groupColumn}
                      </th>
                      <th className="p-4 font-sans font-bold text-[10px] text-[#605f53] uppercase tracking-widest">
                        {copy.statusColumn}
                      </th>
                      <th className="p-4 font-sans font-bold text-[10px] text-[#605f53] uppercase tracking-widest text-right">
                        {copy.actionsColumn}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e2e1]/40">
                    {filteredGuests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-[#f4f3f2]/40 transition-colors group">
                        
                        {/* Guest name & blessing if available */}
                        <td className="p-4 font-sans">
                          <p className="font-semibold text-sm text-[#1a1c1c]">{guest.name}</p>
                          {guest.blessing && (
                            <p className="text-[10px] text-primary italic max-w-xs truncate" title={guest.blessing}>
                              💬 "{guest.blessing}"
                            </p>
                          )}
                        </td>

                        {/* Confirmed total people for this invitation */}
                        <td className="p-4 text-center font-sans text-sm font-semibold text-[#4e4639]">
                          {guest.rsvpStatus === 'ATTENDING'
                            ? `${guest.guestsCount} ${copy.peopleUnit}`
                            : copy.notConfirmedCount}
                        </td>

                        {/* Guest group tag */}
                        <td className="p-4">
                          <span className="font-sans font-bold text-[9px] px-2.5 py-1 bg-[#e6e3d4] text-[#48473c] rounded-full uppercase tracking-wider">
                            {guest.group}
                          </span>
                        </td>

                        {/* Status tag */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                guest.rsvpStatus === 'ATTENDING'
                                  ? 'bg-emerald-600'
                                  : guest.rsvpStatus === 'DECLINED'
                                  ? 'bg-red-500'
                                  : 'bg-amber-400'
                              }`}
                            />
                            <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#4e4639]">
                              {guest.rsvpStatus === 'ATTENDING'
                                ? copy.attending
                                : guest.rsvpStatus === 'DECLINED'
                                ? copy.declined
                                : copy.pending}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            
                            {/* Copy personal link */}
                            <button
                              onClick={() => handleCopyLink(guest)}
                              className="p-1.5 text-[#775a19] bg-[#775a19]/5 hover:bg-[#775a19]/12 active:scale-95 rounded transition-all flex items-center gap-1"
                              title={copy.copyLinkTitle}
                            >
                              <Copy size={13} />
                              <span className="hidden sm:inline font-sans font-bold text-[9px] uppercase tracking-wider">
                                {copy.copyLink}
                              </span>
                            </button>

                            {/* View invitation */}
                            <button
                              onClick={() => onPreviewGuest(guest)}
                              className="p-1.5 text-[#605f53] bg-[#605f53]/5 hover:bg-[#605f53]/12 active:scale-95 rounded transition-all flex items-center gap-1"
                              title={copy.previewTitle}
                            >
                              <Eye size={13} />
                              <span className="hidden sm:inline font-sans font-bold text-[9px] uppercase tracking-wider">
                                {copy.preview}
                              </span>
                            </button>

                            {/* Delete invitation */}
                            <button
                              onClick={() => onDeleteGuest(guest.id)}
                              className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded transition-all"
                              title={copy.deleteTitle}
                            >
                              <Trash2 size={13} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* View templates footer */}
            <div className="bg-[#f4f3f2] p-4 text-center border-t border-[#e3e2e1] text-xs font-sans text-secondary italic">
              {copy.listFooter}
            </div>
          </div>

        </div>

      </div>

      {/* Visual Break Section at bottom of bento grid */}
      <section className="mt-16 bg-[#e9e8e7] p-8 md:p-12 border border-[#d1c5b4] rounded relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h3 className="font-serif text-3xl font-semibold text-[#775a19] tracking-tight">
            {copy.masterpieceTitle}
          </h3>
          <p className="font-sans text-sm text-[#4e4639] leading-relaxed max-w-xl">
            {copy.masterpieceDescription}
          </p>
          <div className="pt-2">
            <button className="px-6 py-3 border border-[#775a19] text-[#775a19] hover:bg-[#775a19] hover:text-white transition-all font-sans font-semibold text-xs uppercase tracking-widest rounded-sm">
              {copy.templates}
            </button>
          </div>
        </div>

        <div className="w-full md:w-[320px] aspect-video rounded overflow-hidden border border-[#d1c5b4] shadow-md z-10 transition-transform hover:scale-[1.02] duration-300">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp3Tju2h4uCePrj_jT2mocgw3d3oEq8f3O2uYp1yyO2_JQDbRrCVqAKowDO5Af1mmB7GKD9EW3Y5LivMXtIUoL1A5JvhZqC4e0NYzu6MXHlUCYNH_KNo2goNxmr0YnMI7WU_RTggHbK4-mip4SGnxVoMoDmn-UMq2FtYmwvHzEI5PV9At-5aajUplwwE2_jONdoaJI3INXSeQnhfsaZe7Jo31CM4-CBV2pszI12DJ6qE0GO_G6ufwEjtAkA2BCuweuAE_r7_R4G-Wi"
            alt={copy.tabletAlt}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

    </div>
  );
}
