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
    const magic = ascii_buffer[0] + ascii_buffer[1];
    // Remove comments. Text between '#' and EOL.
    let cleaned = ascii_buffer.replace(/(\#[^\n\r]*(?:[\n\r]+|$))/g,'');
    let lines = cleaned.split(/\s/);
    // Read next line(s) of header
    const width = +lines[1].trim(); // `+` sign equivalent of parseInt(..)
    const height = +lines[2].trim();
    const maxIntensity = (magic === 'P1') ? 255 : +lines[3].trim();
    const type = types[magic];
    console.log(magic,width,height);
    // Step #2: Get Pixels
    const intensities = (magic === 'P1') ? lines.slice(3).map( (v) => parseInt(v)) : lines.slice(4).map( (v) => parseInt(v));
    console.info('intensities');
    console.log(intensities);
    const pixels = bitmap(intensities.splice(0, width * height)); // Remove extra-numerous values
    console.info('pixels');
    console.log(pixels);
    return new TWRaster(pixels,type,width,height);
  }
} // End of class PNMDecoder


