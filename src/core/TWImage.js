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


class TWImage extends TWRaster {
  constructor(element,x,y,w,h,preview=false) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.source = element;
    this.type = 4; // RGBA
    if (element.tagName === 'CANVAS') {
      this.source = element;
    }
    else {
      // Copy from <img> to <canvas>
      this.source = document.createElement('canvas');
      this.id = `${element.id}_cnvs`;
      document.body.append(this.source);
      this.source.style.display = 'none';
      this.source.width = w;
      this.source.height = h;
      this.context = this.source.getContext('2d');
      this.context.drawImage(element, 0, 0);

    }
    if (preview) {
      this.canvas = document.createElement('canvas');
      this.id = `${element.id}_cnvs`;
      document.body.append(this.canvas);
      this.canvas.style.display = 'none';
      this.canvas.width = w;
      this.canvas.height = h;
      this.context = this.canvas.getContext('2d');
      this.context.drawImage(element, 0, 0);
    }

    this.rois = [];
    this.transforms = [];
  }

  minmax(pixels,roi) {
    //Init
    let _min = pixels[0];
    let _max = pixels[0];
    // roi is a circle only
    let cx = this.width * roi.cx;
    let cy = this.height * roi.cy;
    let radius2 = (roi.radius * Math.min(this.width,this.height))**2;
    // Assume image is a gray-level. Only check the first channel
    for (let i = 0; i < pixels.length; i+= this.type) {
      let x = (i/this.type) % this.width;
      let y = Math.floor(i / this.type / this.width);
      if ( (x - cx)**2 + (y - cy)**2 < radius2) {
        _min = (_min > pixels[i]) ? pixels[i] : _min; 
        _max = (_max <= pixels[i]) ? pixels[i] : _max; 
      }
    }
    return [_min,_max];
  }
  
  
  normalize(roi) {
    let ctx = this.source.getContext('2d');
    if (this.raw) {
      let [rmin,rmax] = this.minmax(this.raw,roi);
      console.log(rmin,rmax);
      let delta = 255.0 / (rmax - rmin);
      for (let i = 0; i < this.raw.length; i++) {
        this.raw[i] = (this.raw[i] - rmin) * delta ;  
      }
    }
    else {
      let u8pixels = ctx.getImageData(0,0,this.width,this.height).data;
      let [u8min, u8max] = this.minmax(u8pixels,roi);
      let delta = 255 / (u8max - u8min);
      for (let i = 0; i < u8pixels.length; i+=4) {
        u8pixels[i] = (u8pixels[i] - u8min) * delta ; 
        u8pixels[i+1] = (u8pixels[i+1] - u8min) * delta; 
        u8pixels[i+2] = (u8pixels[i+2] - u8min) * delta; 
      }
      let idata;
      idata = new ImageData(u8pixels,this.width,this.height);
      ctx.putImageData(idata,0,0);
    }
    return this;
  }
  
  toStack(nRows, nCols, border=0, preview = false) {
    let w = this.width / nCols;
    let h = this.height / nRows;
    let stack = [];
    for (let y = 0; y < this.height; y+=h) {
      for (let x = 0; x < this.width; x+=w) {
        let slice = new TWImage(this.source, 0,0,this.width,this.height);
        slice.transforms.push({type:'crop',cropx:x,cropy:y,cropw:w,croph:h, sw: w, sh: h});
        stack.push(slice);
      }
    }
    if (preview) {
      let c = document.createElement('canvas');
      c.id = `${this.id}_${x}_${y}`;
      //c.style.display = 'none';
      c.width = w;
      c.height = h;
      let ctx = c.getContext('2d');
      console.log(x,y,w,h);
      ctx.drawImage(this.source,x,y,w,h,0,0,w,h);
      document.body.append(c);
    }
    return new TWStack(stack);
  }
  
  resize(new_width, new_height, mode = TWIN.NEAREST, preview = false) {
    let idx = this.transforms.map( t => t.type).indexOf('crop');
    if (idx === -1) {
      this.transforms.push({type:'crop',cropx:0,cropy:0,cropw:this.width,croph:this.height, sw: new_width,sh: new_height});
    }
    else {
      this.transforms[idx].sw = new_width;
      this.transforms[idx].sh = new_height;
    }
    return this;
  }
  
  rotate(angle_degrees, mode = TWIN.NEAREST, preview = false) {

    this.transforms.push({type:'rotate',angle: angle_degrees,interpolation: mode});

    if (preview) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context.save();
      this.context.translate(this.width / 2, this.height / 2);
      this.context.rotate(angle_degrees / 180.0 * Math.PI);
      this.context.drawImage(this.data, -(this.width / 2), -(this.height / 2));
      this.context.restore();
    }
    return this;
  }
  
  show(id) {
    let canvas = document.createElement('canvas');
    canvas.id = `show_${id}`;
    document.body.append(canvas);
    canvas.width = this.width;
    canvas.height = this.height;

    let ctx = canvas.getContext('2d');
    let idata;
    if (this.raw) {
      idata = new ImageData(to_rgba(this.raw),this.width,this.height);
    }
    else {
      let u8pixels = this.source.getContext('2d').getImageData(0,0,this.width,this.height).data;
      idata = new ImageData(u8pixels,this.width,this.height);
    }
    ctx.putImageData(idata,0,0);
    
  }


} // End of class TWImage

