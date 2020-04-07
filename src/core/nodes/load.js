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
 * Load an image (jpg, png, gif)
 *
 */
export const load = async (args) => {

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
      alert('There has been a problem with your fetch operation:', error);
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

