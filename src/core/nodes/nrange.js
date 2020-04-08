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
 * Python `range(..)`
 *
 * @author Jean-Christophe Taveau
 */
export const nrange = (nodeID,start,end,step=1) => async (args) => {
  // Get `start@<nodeID>`, `end@<nodeID>`, and `step@<nodeID>` from heap
  // Set results in the heap
  args[`array@{nodeID}`] = Array.from({length: Math.abs(Math.floor((end - start) / step))}, (_,i) => start + i * step);
  return args;
};
