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


import {PNMDecoder} from './io/PNMDecoder.js';
import {CSVDecoder} from './io/CSVDecoder.js';
import {TWRaster} from '../TWRaster.js';


/*
 * Load an image (jpg, png, gif)
 *
 */
export const load = async (node_id,args) => {

  
  /*
   * Loader of `Portable Any Map`
   */
  const loadASCIIRaster = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    })
    .then(a_text => {
      // Return a raster with TypedArray for pixels
      const raster = PNMDecoder.decode(a_text);
      console.log(raster);
      return raster;
    })
    .catch((error) => {
      alert(`ERR: Could not fetch the file ${file.path}`, error);
    });
  }
  
  /*
   * Loader of Web supported File Format: GIF, JPEG, PNG
   */
  const loadRaster = (file) => {
    return new Promise( (resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = URL.createObjectURL(file);
    })
    .then(img => {
      console.log('Load...');
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      console.log(w,h);
      // Create canvas
      let canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0,0,w,h).data;
      return new TWRaster(pixels,TWRaster.RGBA8,w,h,1);
      // return canvas;
    })
    .catch((error) => {
      alert('There has been a problem with your fetch operation:', error);
    });
  }
  
  
  const loader = (file) => {
    console.log('LOAD');
    let path = file.name;
    let extension = path.split('.').pop();
    let canvas;
    console.log(extension);
    switch (extension) {
    case 'csv':
    case 'CSV': /* Comma-Separated Values */
    case 'tsv':
    case 'TSV': /* Tab-Separated Values */
    case 'pbm':
    case 'PBM': /* Portable Bitmap */
    case 'pgm':
    case 'PGM': /* Portable Graymap */
    case 'ppm':
    case 'PPM': /* Portable Pixmap */
      console.log('Parse Portable Any Map');
      canvas = loadASCIIRaster(file); break;
    default: // GIF, JPG, PNG
      canvas = loadRaster(file);
    }
    return canvas; // raster
  }
  
  // Main
  // Step #1: Find the input(s) or node variable.s
  let arg_names = TWIN.graph.getNode(node_id).getArguments();
  // `load` is a Producer ... no input
  let filename = arg_names.find( a => a.includes('__AT__') );
  let out = `raster__FROM__${node_id}`;
  
  // Step #2: Run
  let raster = await loader(args[filename]);

  // Step #3: Update output(s)
  raster.preview(document.querySelector(`#node_${node_id} .preview`) || document.body);
  // console.log(raster.width,raster.height);
  args[out] = raster; // new TWImage(raster,0,0,canvas.width,canvas.height);
  // Dispatch to other nodes according to edges
  return TWIN.graph.dispatch(out,args);
}

/* 
var my_array = // Uint32Array(...) TODO;
var img_data = ctx.createImageData(canvas.width, canvas.height);
var myArray = new Uint8ClampedArray(pixelCount);
ctx.putImageData(my_array,0,0);
var sourceBuffer32  = new UInt32Array(myArray.buffer);

Endianness

var my_buffer = new ArrayBuffer(size);
var dataView = new DataView(my_buffer);

var uint32lsb = dataView.getUint32(pos, true); // true = little-endian

function isLSB() {
    var b = new Uint8Array([255, 0]);
    return ((new Uint16Array(b, b.buffer))[0] === 255);
}


*/
