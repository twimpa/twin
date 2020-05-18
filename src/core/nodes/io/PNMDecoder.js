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

import {TWRaster} from '../../TWRaster.js';
import {FileInfo} from './FileInfo.js';

export class PNMDecoder {
  
  static decode(ascii_buffer) {
  
    /** Functions **/
    const bitmapToRGB = (values) => Uint8Array.from( 
      {length: values.length * 4}, (_,i) => {
        return (i%4 === 3) ? 255 : (values[Math.floor(i/4.0)] === '1') ? 0 : 255;
    });

    // Bitmap 1=black (true) and 0=white (false)
    const bitmap = (values,nPixels) => Uint8ClampedArray.from({length: nPixels}, (_,i) => (values[i] === 1) ? 0 : 255);
    
    // Gray8
    const gray8 = (values,nPixels,maxI) => Uint8ClampedArray.from({length: nPixels}, (_,i) => values[i] * 255 / maxI);

    // Gray16
    const gray16 = (values,nPixels,maxI) => Uint16Array.from({length: nPixels}, (_,i) => values[i] * 65535 / maxI);

    // Gray 8 or 16
    const gray = (values,nPixels,maxValue) => (maxValue > 255) ? gray16(values,nPixels,maxValue) : gray8(values,nPixels,maxValue);

    // RGB - Add Alpha Channel
    const rgba8 = (values,nPixels,maxI) => Uint8ClampedArray.from({length: nPixels}, (_,i) => (i%4 === 3) ? 255 : values[Math.floor(i/4.0)*3 + (i%4)]);

    const types = {P1: TWRaster.BITMAP, P2: TWRaster.GRAY8, P21: TWRaster.GRAY16, P3: TWRaster.RGBA8};
    
    const get_pixels = {P1: bitmap, P2: gray, P3: rgba8};
    const bytes = {P1: 1, P2: 1, P3: 4};
    
    /*** M A I N ***/
    
    // Step #1: Header
    const magic = ascii_buffer[0] + ascii_buffer[1];
    // Remove comments. Text between '#' and EOL.
    let cleaned = ascii_buffer.replace(/(\#[^\n\r]*(?:[\n\r]+|$))/g,'');
    let lines = cleaned.split(/\s+/);
    console.log(lines);
    // Read next line(s) of header
    const width = +lines[1].trim(); // `+` sign equivalent of parseInt(..)
    const height = +lines[2].trim();
    const maxIntensity = (magic === 'P1') ? 255 : +lines[3].trim();
    const type = (magic === 'P2'  && maxIntensity > 255) ? types['P21'] : types[magic];
    console.log(magic,type,width,height,maxIntensity);
    // Step #2: Get Pixels
    lines = (magic === 'P1') ? lines.slice(3) : lines.slice(4);
    if (magic === 'P1' && lines[0].length > 1) {
      lines = [...lines.join('')];
    }
    const intensities = lines.map( v => parseInt(v));

    console.info('intensities');
    console.log(intensities);
    const pixels = get_pixels[magic](intensities, width * height * bytes[magic],maxIntensity);
    /*
    switch (magic) {
    case 'P1':
      pixels = bitmap(intensities.splice(0, width * height)); // Remove extra-numerous values
      break;
    case 'P2':
      pixels = (maxIntensity > 255) ? gray16(intensities.splice(0, width * height),maxIntensity) : gray8(intensities.splice(0, width * height),maxIntensity);
      break;
    case 'P3': break;
      pixels = rgba8(intensities.splice(0, width * height * 3)); break;
    }
*/
    console.info('pixels');
    console.log(pixels);
    return new TWRaster(pixels,type,width,height);
  }
} // End of class PNMDecoder


