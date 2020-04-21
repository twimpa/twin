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
  "TWIN_ADV_MM",
  "TWIN_AGGREGATE",
  "TWIN_BASIC_MM",
  "TWIN_DEBUG",
  "TWIN_DUPLICATE",
  "TWIN_ENDSELECT",
  "TWIN_FILL",
  "TWIN_FOLD",
  "TWIN_GET_STORAGE",
  "TWIN_GETTER",
  "TWIN_IFTHENELSE",
  "TWIN_IJ_SAMPLES",
  "TWIN_IMAGE_CALC",
  "TWIN_IMAGE_MATH",
  "TWIN_INFO",
  "TWIN_INSPECT",
  "TWIN_MATH_MACRO",
  "TWIN_MATHS",
  "TWIN_MATHS_ADV",
  "TWIN_MERGE_COLORS",
  "TWIN_MONTAGE",
  "TWIN_NEW",
  "TWIN_OPEN_RASTER",
  "TWIN_PROJECT",
  "TWIN_RANGE",
  "TWIN_RESIZE",
  "TWIN_ROI",
  "TWIN_ROTATE",
  "TWIN_SAVE_TIFF",
  "TWIN_SELECT_FUNC",
  "TWIN_SET_STORAGE",
  "TWIN_SETTER",
  "TWIN_SPLIT_COLORS",
  "TWIN_STATS",
  "TWIN_TAB_DATA",
  "TWIN_TEST_IMAGE",
  "TWIN_THRESHOLD",
  "TWIN_TO_STACK",
  "TWIN_TRANSFORM",
  "TWIN_TYPE",
  "TWIN_VIDEO",
  "TWIN_VIEW_2D",
  "TWIN_VIEW_3D",
  "TWIN_VIEW_PLOT",
  "TWIN_VIEW_PLOT",
  "TWIN_VIEW_STACK",
  "TWIN_ZIP"
];



export const Functions = {
  TWIN_ADV_MM: 1,
  TWIN_FOLD: 2,
  TWIN_BASIC_MM: 3,
  TWIN_DEBUG: 4,
  TWIN_DUPLICATE: 5,
  TWIN_ENDSELECT: 6,
  TWIN_FILL: 7,
  TWIN_UNFOLD: 8,
  TWIN_GET_STORAGE: 9,
  TWIN_GETTER: 10,
  TWIN_IFTHENELSE: 11,
  TWIN_IJ_SAMPLES: 12,
  TWIN_IMAGE_CALC: 13,
  TWIN_IMAGE_MATH: 14,
  TWIN_INFO: 15,
  TWIN_INSPECT: 16,
  TWIN_MATH_MACRO: 17,
  TWIN_MATHS: 18,
  TWIN_MATHS_ADV: 19,
  TWIN_MERGE_COLORS: 20,
  TWIN_MONTAGE: 21,
  TWIN_NEW: 22,
  TWIN_OPEN_RASTER: 23,
  TWIN_PROJECT: 24,
  TWIN_RANGE: 25,
  TWIN_RESIZE: 26,
  TWIN_ROI: 27,
  TWIN_ROTATE: 28,
  TWIN_SAVE_TIFF: 29,
  TWIN_SELECT_FUNC: 30,
  TWIN_SET_STORAGE: 31,
  TWIN_SETTER: 32,
  TWIN_SPLIT_COLORS: 33,
  TWIN_STATS: 34,
  TWIN_TAB_DATA: 35,
  TWIN_TEST_IMAGE: 36,
  TWIN_THRESHOLD: 37,
  TWIN_TO_STACK: 38,
  TWIN_TRANSFORM: 39,
  TWIN_TYPE: 40,
  TWIN_VIDEO: 41,
  TWIN_VIEW_2D: 42,
  TWIN_VIEW_3D: 43,
  TWIN_VIEW_PLOT: 45,
  TWIN_VIEW_STACK: 46,
  TWIN_ZIP: 47 
};

   
Object.freeze(Functions);
