/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Guest {
  id: string;
  name: string;
  group: string;
  status: 'SENT' | 'DRAFT' | 'CONFIRMED' | 'DECLINED';
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'PENDING';
  guestsCount: number; // Total attendees on the invitation, including the invitee
  relation: 'BRIDE' | 'GROOM' | 'NONE';
  blessing?: string;
  updatedAt?: string;
}

export interface WeddingStats {
  totalGuests: number;
  attendingCount: number;
  declinedCount: number;
  pendingCount: number;
  responseRate: number;
}
