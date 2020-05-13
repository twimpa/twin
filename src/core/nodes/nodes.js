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

///////////: N O D E S :///////////

/*
 * start time for performance measurement.
 *
 *
 */
 const start = async (args) => {
  args.time_start = performance.now();
  return args;
}

/*
 * End time for performance measurement.
 *
 *
 */
const end = async (args) => {
  args.performance = performance.now() - args.time_start;
  console.info(`Performance: ${args.performance} milliseconds.`);
  return args;
}

/*
 * Python `range(..)`
 *
 * @author Jean-Christophe Taveau
 */
const nrange = (start,end,step=1) => async (args) => {
  args.array = Array.from({length: Math.abs(Math.floor((end - start) / step))}, (_,i) => start + i * step);
  return args;
};

/*
 * Split the stack slices in a stream/dataflow
 *
 * @author Jean-Christophe Taveau
 */
const forEach = async (args) => {
  // TODO Check `input` is a stack, an array, something iterable
  args.input = new TWStackSplitter(args.input);
  return args;
}


/*
 * Get information of raster
 *
 */
const info = async (args) => {
  args.width = args.input.width;
  args.height = args.input.height
  return args;
};

/*
 * Load an image (jpg, png, gif)
 *

const load = async (args) => {

  const preloadRaster = (path) => {
    return fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(a_blob => {
      return new Promise( (resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(a_blob);
      });
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });

  }
  
  // Main
  let raster = await preloadRaster(args.path);
  let w = raster.naturalWidth;
  let h = raster.naturalHeight;
  // Create canvas
  let canvas = document.createElement('canvas');
  canvas.id = `fetch`;
  document.body.append(canvas);
  canvas.style.display = 'none';
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(raster, 0, 0);

  console.log(w,h);
  args.input = new TWImage(canvas,0,0,w,h);
  return args;
}
*/

/*
 * Normalize a raster
 *
 */
const normalize = (roi) => async (args) => {
  // TODO Check if `input`is an image
  args.input = args.input.normalize(roi);
  return args;
}

/*
 * Convert a 2D raster/image into a stack
 *
 */
const toStack = (nRows,nCols,border) => async (args) => {
  // TODO Check if `input`is an image
  args.input = args.input.toStack(nRows,nCols,border);
  return args;
}

/*
 * Resize a 2D raster
 *
 */
const resize = (new_width,new_height,type=-1) => async (args) => {
  // TODO Check if `input` is an image
  args.input = args.input.resize(new_width, new_height, type);
  return args;
}

/*
 * Rotate a 2D raster
 *
 */
const rotate = async (args) =>{
  // TODO Check `input`is an image
  args.input = args.input.rotate(args.array);
  return args;
}

/*
 * Save in the current stack. Must be used in conjunction with `forEach(..)`
 *
 */
const saveInStack = async (args) =>{
  // TODO Check `input`is an image
  args.input = args.input.saveInStack();
  return args;
}

/*
 * Display in full-size a raster.
 * This node triggers the pipeline of full-size raster(s).
 * 
 * @param {object} args - A collection of parameters
 * 
 * @author Jean-Christophe Taveau.
 */
const show = async (args) => {
  args.input.show(args.count);
}

/*
 * Z-project a stack to get an image (2D raster)
 *
 */
const zproject = async (args) => {
  // TODO Check `input`is an image
  args.input = args.input.zproject();
  return args;
}

