/*
 *  TWIN: Tiny Web Image Processing Nodes
 *  Copyright (C) 2019-2020 Jean-Christophe Taveau.
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

import {TWImage} from '../TWImage.js';
import {TWStack} from '../TWStack.js';

/*
 * Convert a 2D raster/image into a stack
 *
 */
export const toStack = async (node_id,args) => {

  // Step #1: Find the input(s) or node variable.s
  let arg_names = TWIN.graph.getNode(node_id).getArguments();
  console.log(arg_names);
  const input = arg_names.find( a => a.includes(`raster2d__`) );
  const nRows = arg_names.find( a => a.includes('nrows__') ) || 1;
  const nCols = arg_names.find( a => a.includes('ncols__') ) || 1;
  const border = arg_names.find(a => a.includes('border__')) || 0;
  const out = arg_names.find(a => a.includes('stack__'))
  console.info('RUN TO_STACK',node_id,input, args['raster2d__TO__3'], nRows,nCols,border);
  
  // Step #2: Run if `input` available
  if (input) {
    let stack = _to_stack(args[input],args[nRows],args[nCols],args[border]);
    // Step #3: Update output(s)
    args[out] = stack;
    // Dispatch depending of edges
    return TWIN.graph.dispatch(out,args);
  }
  
  if (preview) {
    stack.preview(document.querySelector(`#node_${node_id} .preview`));
  }
  return args;
}

// Private
const _to_stack = (montage,nRows, nCols, border) => {
  const source = montage.pixels;
  let w = montage.width / nCols;
  let h = montage.height / nRows;
  let stack = [];
  for (let y = 0; y < montage.height; y+=h) {
    for (let x = 0; x < montage.width; x+=w) {
      let slice = new TWImage(source, 0,0,montage.width,montage.height);
      slice.transforms.push({type:'crop',cropx:x,cropy:y,cropw:w,croph:h, sw: w, sh: h});
      stack.push(slice);
    }
  }
  return new TWStack(stack);
}

