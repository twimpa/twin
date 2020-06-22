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

import {Node} from '../gui/node.js';
import {Observer} from '../core/Observer';

export class Monitor extends Observer {

  /**
   * @constructor
   */
  constructor() {
    this.state = {
      value: 0
    }
  }
  
  /**
   * Create Node GUI
   */
  createMarkup(node_id,state) {
    const template_ui =    {
    "id": "TWIN_MONITOR",
    "class": "information",
    "description": "Monitor",
    "tags": ["console","display","log","print","show","tap"],
    "help": ["Look at data through the pipeline. Network tap https://en.wikipedia.org/wiki/Network_tap"],
    "properties": [
      {"label": "Data", "output": "metadata","name":"out_data"},
      {"label": "Data", "input": "metadata","name": "in_data"},
      {"text": "null","name": "log"}
    ]
  };
  
    this.node = new Node(node_id,template_ui,this.state);
  }

  /**
   * Run component's engine
   */
  async run(state) {
  // TODO
    // Step #1: Find the input(s) or node variable.s
    let arg_names = TWIN.graph.getNode(node_id).getArguments();
    const input = arg_names.find( a => a.includes(`in_data__`) );
    
    // Step #2: Run if `input` available
    if (input) {
      this._monitor(node_id,args[input]);
    }
    return args;
  }
  
  update() {
  
  }

  // Private
  _monitor(id,an_input) {
    let area = document.querySelector(`#node_${id} textarea`);
    area.innerHTML = an_input.toString() || JSON.stringify(an_input);
    
  }
} // End of Monitor
