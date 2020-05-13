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

export class CSVDecoder {
  
  static decode(ascii_buffer) {
  
    /** Functions **/
    const bitmapToRGB = (values) => Uint8Array.from( 
      {length: values.length * 4}, (_,i) => {
        return (i%4 === 3) ? 255 : (values[Math.floor(i/4.0)] === '1') ? 0 : 255;
    });

    // Bitmap 1=black (true) and 0=white (false)
    const bitmap = (values) => Uint8ClampedArray.from({length: values.length}, (_,i) => (values[i] === 1) ? 0 : 255);
    
    // Gray8
    const gray8 = (values) => new Uint8ClampedArray(values);

    // Gray16
    const gray16 = (values) => new Uint16Array(values);

    // Gray 8 or 16
    const gray = (values,maxValue) => (maxValue > 255) ? gray16(values) : gray8(values);

    // RGB - Add Alpha Channel
    const rgba8 = (values) => Uint32Array.from({length: values.length / 3}, (_,i) => (values[i*3]<<24) | (values[i*3+1]<<16) |(values[i*3+2]<<8) | 0xff);

    const types = {P1: FileInfo.BITMAP, P2: FileInfo.GRAY8, P3: FileInfo.RGB};
    
    const get_pixels = {'P1': bitmap, P2: gray, P3: rgba8};
    
    /*** M A I N ***/
    
    // Step #1: Header

    let lines = ascii_buffer.split(/\n/);
    // Read next line(s) of header
    const width = lines[0].length; // `+` sign equivalent of parseInt(..)
    const height = lines.length;
    const maxIntensity = -1;
    console.log(width,height);
    // Step #2: Get Pixels
    const intensities = ascii_buffer.split(/[\s,;:|]/).splice(0, width * height).map( (v) => +v);
    console.info('intensities');
    console.log(intensities);
    const pixels = gray(intensities,Math.max(...intensities)); // Remove extra-numerous values
    console.info('pixels');
    console.log(pixels);
    return new TWRaster(pixels,type,width,height);
  }
} // End of class CSVDecoder


