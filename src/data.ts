/**
 * Runtime data sourced from the editable wedding configuration.
 * @license SPDX-License-Identifier: Apache-2.0
 */

import { WEDDING_CONFIG } from './config';
import { Guest } from './types';

export const INITIAL_GUESTS: Guest[] = [...WEDDING_CONFIG.content.initialGuests];
export const ALBUM_IMAGES = WEDDING_CONFIG.content.albumImages;
