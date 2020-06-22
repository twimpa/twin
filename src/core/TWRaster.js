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

import {FileInfo} from './nodes/io/FileInfo.js';

export class TWRaster {

  /**
   * @constructor
   *
   */
  constructor(pixels,type,w,h,d=1) {
    this.pixels = pixels; // TypedArray
    this.type = type;
    this.width = w;
    this.height = h;
    this.depth = d;
  }
  
    /** 8-bit unsigned integer (0-255). */
  static get GRAY8() {
    return 0;
  }
  
  /**  16-bit signed integer (-32768-32767). Imported signed images
    are converted to unsigned by adding 32768. */
  static get GRAY16_SIGNED() {
    return 1;
  }
  
  /** 16-bit unsigned integer (0-65535). */
  static get GRAY16_UNSIGNED() {
    return 2;
  }
  
  /**  32-bit signed integer. Imported 32-bit integer images are
    converted to floating-point. */
  static get GRAY32_INT() {
    return 3;
  }
  
  /** 32-bit floating-point. */
  static get GRAY32_FLOAT() {
    return 4;
  }

  /** 1-bit unsigned integer (0 and 255). */
  static get BITMAP() {
    return 5;
  }
  /** 24-bit interleaved RGB. Import/export only. */
  static get RGB() {
    return 6;
  }
  
  static get RGBA8() {
    return 8;
  }
  
  preview(canvas) {
    // Preview in canvas
    // Check if canvas `preview` already exists
    /*
    let canvas = document.querySelector(`#node_${parent.id} canvas`);
    canvas.className = 'preview';
    parent.appendChild(canvas);
    */
    canvas.width = this.width;   // width defined in displayBuffer
    canvas.height = this.height; // height defined in displayBuffer
    // TODO
    // canvas.style.width = '94%'; // Width from parent
    // If the raster is small, set `no-interpolation` mode.
    canvas.style.imageRendering = 'optimizespeed';
    let ctx = canvas.getContext('2d');
    let imgData = ctx.createImageData(this.width, this.height);
    switch (this.type) {
    case TWRaster.BITMAP:
    case TWRaster.GRAY8:
      imgData.data.set(TWRaster.gray8ToRGBA(this.pixels) ); 
      break;
    case TWRaster.RGBA8:
      imgData.data.set(this.pixels);
      break;
    }
    
    ctx.putImageData(imgData, 0, 0); 
  }
  
  toString() {
    const types = ['GRAY8','GRAY16_SIGNED','GRAY16_UNSIGNED','GRAY32_INT','GRAY32_FLOAT','BITMAP','RGB','RGBA8'];
    
    const px_txt = this.pixels.reduce((accu,px,i) => ( (i%this.width) === 0) ? `${accu}\n${px},` : `${accu}${px},`, '');
    
    return `type: ${types[this.type]}, width: ${this.width}, height: ${this.height}, depth: ${this.depth},
pixels: ${this.pixels.constructor.name}[${px_txt}]`;
  }
  
  
  /* Private */
  static gray8ToRGBA(values) {
    return Uint8ClampedArray.from( 
      {length: values.length * 4}, 
      (_,i) => {
        return (i%4 === 3) ? 255 : values[Math.floor(i/4.0)];
      }
    );
  }
  
  static gray16ToRGBA(values) {
    // TODO
  }
  
  static RGBToRGBA(values) {
    return values;
  }
  
} // End of class TWRaster
