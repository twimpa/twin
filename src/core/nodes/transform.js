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
 * Transform a 2D raster
 *
 * @author Jean-Christophe Taveau
 */
const transform = async (args) => {
  // TODO Check `input` is an image (aka raster 2D)
  switch (args.transform) {
  case 'fliph': fliph(); break;
  case 'flipv': flipv(); break;
  case 'resize': resize(); break;
  case 'rotate': rotate(); break;
  case 'translate': translate(); break;
  default: 
    alert('Unknown transform');
  }
  return args;
}



/*
 * Rotate a 2D raster
 *
 */
const rotate = async (args) =>{
  // TODO Check `input`is an image (aka raster 2D)
  args.input = args.input.rotate(args.array);
  return args;
}
