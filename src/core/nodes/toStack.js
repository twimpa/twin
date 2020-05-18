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
 * Convert a 2D raster/image into a stack
 *
 */
export const toStack = async (node_id,args) => {
  // Step #1: Find the input(s) or node variable.s
  let arg_names = TWIN.graph.getNode(node_id).getArguments();
  const input = arg_names.find( a => a.includes('__TO__') );
  const nRows = arg_names.find( a => a.includes('nrows__') ) || 1;
  const nCols = arg_names.find( a => a.includes('ncols__') ) || 1;
  const border = arg_names.find(a => a.includes('border__')) || 0;

  // Step #2: Run
  let stack = args[input].toStack(nRows,nCols,border);

  // Step #3: Update output(s)
  args[`${out}__TO_${node_id}`] = stack;
  // Dispatch depending of edges
  
  return args;
}


