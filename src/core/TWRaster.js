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
  
  preview(parent) {
    // Preview in canvas
    // Check if canvas `preview` already exists
    let canvas = document.createElement("canvas");
    canvas.id = 'preview';
    parent.appendChild(canvas);
    canvas.width = this.width;   // width defined in displayBuffer
    canvas.height = this.height; // height defined in displayBuffer
    // TODO
    canvas.style.width = `128px`; // Width from parent
    // If the raster is small, set `no-interpolation` mode.
    canvas.style.imageRendering = 'optimizespeed';
    let ctx = canvas.getContext('2d');
    let imgData = ctx.createImageData(this.width, this.height);
    imgData.data.set(TWRaster.gray8ToRGBA(this.pixels) ); 
    ctx.putImageData(imgData, 0, 0); 
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
  
  }
  
} // End of class TWRaster
