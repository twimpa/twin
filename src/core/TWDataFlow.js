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

import {FuncFactory} from '../core/funcFactory.js';

class TWDataFlow {

  constructor(nodes) {
    this.pipeline = [];
    this.lastProducer = -1;
    this.firstConsumer = 0;
  }

  add(node) {
    // Add function (core engine of the node)
    node.engine = FuncFactory.func(template.name);
        
    if (node.isProducer()) {
      this.pipeline.unshift(node.engine);
      this.lastProducer++;
      this.firstConsumer++;
    }
    else if (node.isConsumer()) {
      this.pipeline.push(node.engine);
    }
    else {
      // Producer AND Consumer - must be inserted between `lastProducer` and `firstConsumer`.
      let index = this.lastProducer;
      // Check inputs and outputs indexes

      this.pipeline.splice(index,0,node.engine);
      this.firstConsumer++;
    }
  }
  
  remove(node) {
  
  }
  
  async run(pipeline,root) {
    let result = root;
    for (const func of pipeline) {
      result = await func(result);
    }
    return result;
  }

} // End of class TWDataFlow
