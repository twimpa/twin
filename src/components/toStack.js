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

import {TWImage} from '../core/TWImage.js';
import {TWStack} from '../core/TWStack.js';

/*
 * Convert a 2D raster/image into a stack
 *
 */
export class ToStack extends Observer {
  /**
   * @constructor
   */
  constructor () {
    // Default values
    this.state = {
      raster2d: undefined,
      nRows: 1,
      nCols:1,
      border:0,
      stack: undefined
    }
    
    this.id = node_id;
  }

  get state() {
    return this.state;
  }
  
  set state(state) {
    // Merge
    this.state = Object.assign(this.state,state);
  }
  
  createMarkup(node_id, parent) {
    const template_ui =   {
      "id": "TWIN_TO_STACK",
      "class": "tool",
      "description": "toStack",
      "properties": [
        {"label": "Stack", "widget":"output","name": "stack:stack"},
        {"label": "nRows", "widget":"numerical", "name": "nrows:number"},
        {"label": "nCols", "widget":"numerical", "state": 1, "name": "ncols:number"},
        {"label": "Border", "widget":"numerical", "state": 0, "name": "border:number"},
        {"label": "preview", "widget":"checkbox", "state": false, "name": "preview:boolean"},
        {"label": "Raster","widget":"input", "name": "raster2d:raster"}
      ]
    };
    
    // TODO
    this.node = new Node(node_id,template_ui,this.state);
    parent.appendChild(this.node);
    return this.node;
  }
  

  render() {
  
  }
  
  update() {
  
  }
  
  async run(states) {
    // Step #1: Find the input(s) or node variable.s
    let {input,nRows,nCols,border,output} = this.states[this.node_id];

    console.info('RUN TO_STACK',node_id,input, args['raster2d__TO__3'], nRows,nCols,border);
    
    // Step #2: Run if `input` available
    if (input) {
      let stack = this._to_stack(args[input],args[nRows],args[nCols],args[border]);
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
  _to_stack(montage,nRows, nCols, border) {
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

} // End of class ToStack

