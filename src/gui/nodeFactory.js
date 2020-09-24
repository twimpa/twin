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

import * as TWC from '../components/TWC.js';


export class NodeFactory {

  static get(keyword) {
    switch(keyword) {
      case "TWIN_ADV_MM": break;
      case "TWIN_AGGREGATE": break;
      case "TWIN_BASIC_MM": break;
      case "TWIN_DEBUG": break;
      case "TWIN_DUPLICATE": break;
      case "TWIN_ENDSELECT": break;
      case "TWIN_FILL": break;
      case "TWIN_FOLD": break;
      case "TWIN_GET_STORAGE": break;
      case "TWIN_GETTER": break;
      case "TWIN_IFTHENELSE": break;
      case "TWIN_IJ_SAMPLES": break;
      case "TWIN_IMAGE_CALC": break;
      case "TWIN_IMAGE_MATH": break;
      case "TWIN_INFO": break;
      case "TWIN_INSPECT": break;
      case "TWIN_MATH_MACRO": break;
      case "TWIN_MATHS": return new TWC.Maths();
      case "TWIN_MATHS_ADV": break;
      case "TWIN_MERGE_COLORS": break;
      case "TWIN_MONITOR": return new TWC.Monitor();
      case "TWIN_MONTAGE": break;
      case "TWIN_NEW": break;
      case "TWIN_NUMBER": return new TWC.NumberComponent();
      case "TWIN_OPEN_RASTER": return new TWC.Loader();
      case "TWIN_PROJECT": break;
      case "TWIN_RANGE": break;
      case "TWIN_RESIZE": break;
      case "TWIN_ROI": break;
      case "TWIN_ROTATE": break;
      case "TWIN_SAVE_TIFF": break;
      case "TWIN_SELECT_FUNC": break;
      case "TWIN_SET_STORAGE": break;
      case "TWIN_SETTER": break;
      case "TWIN_SPLIT_COLORS": break;
      case "TWIN_STATS": break;
      case "TWIN_TAB_DATA": break;
      case "TWIN_TEST_IMAGE": break;
      case "TWIN_THRESHOLD": break;
      case "TWIN_TO_STACK": return new TWC.ToStack();
      case "TWIN_TRANSFORM": break;
      case "TWIN_TYPE": break;
      case "TWIN_VIDEO": break;
      case "TWIN_VIEW_2D": return new TWC.View2D();
      case "TWIN_VIEW_3D": break;
      case "TWIN_VIEW_PLOT": break;
      case "TWIN_VIEW_PLOT": break;
      case "TWIN_VIEW_STACK": break;
      case "TWIN_ZIP": break;
      default: {
        throw `ERR: Unknown Node ${keyword}`;
      }
    }
  }
  

} // End of class NodeFactory



