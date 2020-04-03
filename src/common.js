/*
 *  TWIN: Tiny Web Image Nodes
 *  Copyright (C) 2019  Jean-Christophe Taveau.
 *
 *  This file is part of TWIN
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TWIN.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';

const KEYWORDS = [
  'TWIN_ADV_MM',
  'TWIN_AGGREGATE',
  'TWIN_BASIC_MM',
  'TWIN_DEBUG',
  'TWIN_DUPLICATE',
  'TWIN_ENDSELECT',
  'TWIN_FILL',
  'TWIN_FOLD',
  'TWIN_GET_STORAGE',
  'TWIN_GETTER',
  'TWIN_IFTHENELSE',
  'TWIN_IJ_SAMPLES',
  'TWIN_IMAGE_CALC',
  'TWIN_IMAGE_MATH',
  'TWIN_INFO',
  'TWIN_INSPECT',
  'TWIN_MATHS',
  'TWIN_MATHS_ADV',
  'TWIN_MERGE_COLORS',
  'TWIN_MONTAGE',
  'TWIN_NEW',
  'TWIN_OPEN_RASTER,
  'TWIN_PROJECT',
  'TWIN_RANGE',
  'TWIN_RESIZE',
  'TWIN_ROI',
  'TWIN_ROTATE',
  'TWIN_SELECT_FUNC',
  'TWIN_SET_STORAGE',
  'TWIN_SETTER',
  'TWIN_SPLIT_COLORS',
  'TWIN_STATS',
  'TWIN_TEST_IMAGE',
  'TWIN_THRESHOLD',
  'TWIN_TO_STACK',
  'TWIN_TRANSFORM',
  'TWIN_TYPE',
  'TWIN_ZIP'
];

const Functions = {
  TWIN_ADV_MM      : 1,
  TWIN_AGGREGATE   : 2,
  TWIN_BASIC_MM    : 3,
  TWIN_DEBUG       : 4,
  TWIN_DUPLICATE   : 5,
  TWIN_ENDSELECT   : 6,
  TWIN_FILL        : 7,
  TWIN_FOLD        : 8,
  TWIN_GET_STORAGE : 9,
  TWIN_GETTER      : 10,
  TWIN_IFTHENELSE  : 11,
  TWIN_IJ_SAMPLES  : 12,
  TWIN_IMAGE_CALC  : 13,
  TWIN_IMAGE_MATH  : 14,
  TWIN_INFO        : 15,
  TWIN_INSPECT     : 16,
  TWIN_MATHS_ADV   : 17,
  TWIN_MATHS       : 18,
  TWIN_MERGE_COLORS: 19,
  TWIN_MONTAGE     : 20,
  TWIN_NEW         : 21,
  TWIN_OPEN_RASTER : 22,
  TWIN_PROJECT     : 23,
  TWIN_RANGE       : 24,
  TWIN_RESIZE      : 25,
  TWIN_ROI         : 26,
  TWIN_ROTATE      : 27,
  TWIN_SELECT_FUNC : 28,
  TWIN_SET_STORAGE : 29,
  TWIN_SETTER      : 30,
  TWIN_SPLIT_COLORS: 31,
  TWIN_STATS       : 32,
  TWIN_TEST_IMAGE  : 33,
  TWIN_THRESHOLD   : 34,
  TWIN_TO_STACK    : 35,
  TWIN_TRANSFORM   : 36,
  TWIN_TYPE        : 37,
  TWIN_ZIP         : 38
}
   
Object.freeze(Functions);
