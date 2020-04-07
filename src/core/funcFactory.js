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

import {Functions} from '../common.js';
import {load} from './nodes/load.js';
import {nrange} from './nodes/nrange.js';


export class FuncFactory {

  static func(keyword) {
    // Check `keyword` exists. 
    let key = Object.keys(Functions).indexOf(keyword);
    console.log(keyword,key);
    if (key !== -1) {
      key = Functions[keyword];
    }
    switch(key) { 
    case Functions.TWIN_ADV_MM: break;
    case Functions.TWIN_AGGREGATE: break;
    case Functions.TWIN_BASIC_MM: break;
    case Functions.TWIN_DEBUG: break;
    case Functions.TWIN_DUPLICATE: break;
    case Functions.TWIN_ENDSELECT: break;
    case Functions.TWIN_FILL: break;
    case Functions.TWIN_FOLD: break;
    case Functions.TWIN_GET_STORAGE: break;
    case Functions.TWIN_GETTER: break;
    case Functions.TWIN_IFTHENELSE: break;
    case Functions.TWIN_IJ_SAMPLES: break;
    case Functions.TWIN_IMAGE_CALC: break;
    case Functions.TWIN_IMAGE_MATH: break;
    case Functions.TWIN_INFO: return info; break;
    case Functions.TWIN_INSPECT: break;
    case Functions.TWIN_MATHS_ADV: break;
    case Functions.TWIN_MATHS: break;
    case Functions.TWIN_MERGE_COLORS: break;
    case Functions.TWIN_MONTAGE: break;
    case Functions.TWIN_NEW: break;
    case Functions.TWIN_OPEN_RASTER: return load; break;
    case Functions.TWIN_PROJECT: break;
    case Functions.TWIN_RANGE: return nrange; break;
    case Functions.TWIN_RESIZE: break;
    case Functions.TWIN_ROI: break;
    case Functions.TWIN_ROTATE: break;
    case Functions.TWIN_SELECT_FUNC: break;
    case Functions.TWIN_SET_STORAGE: break;
    case Functions.TWIN_SETTER: break;
    case Functions.TWIN_SPLIT_COLORS: break;
    case Functions.TWIN_STATS: break;
    case Functions.TWIN_TEST_IMAGE: break;
    case Functions.TWIN_THRESHOLD: break;
    case Functions.TWIN_TO_STACK: break;
    case Functions.TWIN_TRANSFORM: break;
    case Functions.TWIN_TYPE: break;
    case Functions.TWIN_VIEW_2D: break;
    case Functions.TWIN_ZIP: break;
    default: throw new Error(`Unknown Function ${keyword}`);
    }
  }
  

} // End of class FuncFactory

