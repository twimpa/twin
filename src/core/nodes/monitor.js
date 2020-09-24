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

/*
 * Display in full-size a raster.
 * This node triggers the pipeline of full-size raster(s).
 * 
 * @param {object} args - A collection of parameters
 * 
 * @author Jean-Christophe Taveau.
 */
export const monitor = async (node_id,args) => {
  // Step #1: Find the input(s) or node variable.s
  let arg_names = TWIN.graph.getNode(node_id).getArguments();
  const input = arg_names.find( a => a.includes(`in_data__`) );
  
  // Step #2: Run if `input` available
  if (input) {
    _monitor(node_id,args[input]);
  }
  return args;
}

// Private
const _monitor = (id,an_input) => {
  let area = document.querySelector(`#node_${id} textarea`);
  area.innerHTML = an_input.toString() || JSON.stringify(an_input);
  
}
