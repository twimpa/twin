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

import {Functions} as FUN from '../common.js';

export class FunFactory {

  static fun(keyword) {
    // Check `keyword` exists. 
    let key = keyword.indexOf(Object.keys(FUN));
    if (key !== -1) {
      key = FUN[keyword];
    }
    switch(key) {
    case FUN.TWIN_ADV_MM: break;
    case FUN.TWIN_AGGREGATE: break;
    case FUN.TWIN_BASIC_MM: break;
    case FUN.TWIN_DEBUG: break;
    case FUN.TWIN_DUPLICATE: break;
    case FUN.TWIN_ENDSELECT: break;
    case FUN.TWIN_FILL: break;
    case FUN.TWIN_FOLD: break;
    case FUN.TWIN_GET_STORAGE: break;
    case FUN.TWIN_GETTER: break;
    case FUN.TWIN_IFTHENELSE: break;
    case FUN.TWIN_IJ_SAMPLES: break;
    case FUN.TWIN_IMAGE_CALC: break;
    case FUN.TWIN_IMAGE_MATH: break;
    case FUN.TWIN_INFO: return info; break;
    case FUN.TWIN_INSPECT: break;
    case FUN.TWIN_MATHS_ADV: break;
    case FUN.TWIN_MATHS: break;
    case FUN.TWIN_MERGE_COLORS: break;
    case FUN.TWIN_MONTAGE: break;
    case FUN.TWIN_NEW: break;
    case FUN.TWIN_OPEN_RASTER: return load; break;
    case FUN.TWIN_PROJECT: break;
    case FUN.TWIN_RANGE: return nrange; break;
    case FUN.TWIN_RESIZE: break;
    case FUN.TWIN_ROI: break;
    case FUN.TWIN_ROTATE: break;
    case FUN.TWIN_SELECT_FUNC: break;
    case FUN.TWIN_SET_STORAGE: break;
    case FUN.TWIN_SETTER: break;
    case FUN.TWIN_SPLIT_COLORS: break;
    case FUN.TWIN_STATS: break;
    case FUN.TWIN_TEST_IMAGE: break;
    case FUN.TWIN_THRESHOLD: break;
    case FUN.TWIN_TO_STACK: break;
    case FUN.TWIN_TRANSFORM: break;
    case FUN.TWIN_TYPE: break;
    case FUN.TWIN_ZIP: break;
    default: throw new Error('Unknown function');
  }

} // End of class FunFactory

