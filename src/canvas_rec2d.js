// Functional Programming Tools

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const map = f => step => (accu, c, index) => step(accu, f(c,index));
  
const filter = predicate => step => (accu, c, index) => predicate(c) ? step(accu, c, index) : accu;


const range = async (start,end,step=1) => Array.from({length: Math.abs(Math.floor((end - start) / step))}, (_,i) => start + i * step);


const TWIN = {
  NONE: -1,
  NEAREST: 10,
  BILINEAR: 11,
  SUM: 20,
  AVERAGE: 21,
  STD: 22,
  MAX: 23,
  MIN: 24
};

const to_rgba = (pixels) => {
    rgba = new Uint8ClampedArray(pixels.length * 4);
    for (let i = 0; i < pixels.length; i++) {
      rgba[i*4] = pixels[i];
      rgba[i*4+1] = pixels[i];
      rgba[i*4+2] = pixels[i];
      rgba[i*4+3] = 255;
    }
    return rgba;
  }
  
class TWGraph {
  constructor(nodes) {
    this.nodes = nodes;
  }
  
  async run(pipeline,root) {
    let result = root;
    for (const func of pipeline) {
      result = await func(result);
    }
    return result;
  }
    
} // End of class TWGraph


const applyAsync = (acc, val) => acc.then(val);
const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));
/*
 * La fonction composeAsync accepte autant de fonctions que nécessaire comme arguments 
 * et renvoie une nouvelle fonction qui prend une valeur initiale pour la passer 
 * à travers ces étapes de compositions. Cette façon de faire garantit que les fonctions, 
 * qu'elles soient synchrones ou asynchrones, sont exécutées dans le bon ordre :

const transformData = composeAsync(func1, asyncFunc1, asyncFunc2, func2);
transformData(data);
*/

/*
 * Avec ECMAScript 2017, on peut obtenir une composition séquentielle plus 
 * simplement avec les opérateurs await/async :

let result;
for(const f of [func1, func2, func3]) {
  result = await f(result); 
}
 */
 
class TWSplitter {
  constructor(stack) {
    this.stack = stack;
    this.funcs = [];
  }
  
  resize(w,h) {
    const _resize = (w,h) => (slice,i) => slice.resize(w,h);
    
    this.funcs.push(map(_resize(w,h)));
    return this;
  }
  
  rotate(angles) {
    const _rotate = (array) => (slice,i) => slice.rotate(array[i]);
    
    this.funcs.push(map(_rotate(angles)));
    return this;
  }
  
  saveInStack() {
    const arrayConcat = (a, c) => a.concat([c]);
    let ops = pipe(...this.funcs);
    let processed = this.stack.slices.reduce( ops(arrayConcat),[]);
    // Update stack
    this.stack.slices = processed;
    return this.stack;
  }
} // End of TWSplitter

class TWStack {
  constructor(slices) {
    this.slices = slices;
    this.current = -1;
  }

  map(func) {
    this.slices = this.slices.map( func);
    return this;
  }

  applyTransforms(input) {
   let canvas = (document.querySelector('#sandbox')) || document.createElement('canvas');
   // let canvas = document.createElement('canvas');
   canvas.id = 'sandbox';
   canvas.style.display = 'none';
   document.body.append(canvas);
   input.transforms.forEach( (op,i) => {
    let src = (i===0) ? input.source : canvas;
    let ctx;
    let tmp;
    switch (op.type) {
    case 'crop': 
     canvas.width = op.sw;
     canvas.height = op.sh;
     ctx = canvas.getContext('2d');
     ctx.save();
     ctx.drawImage(src,op.cropx,op.cropy,op.cropw,op.croph,0,0,op.sw,op.sh);
     ctx.restore();
     break;
    case 'rotate':
     ctx = canvas.getContext('2d');
     ctx.save();
     ctx.translate(src.width / 2, src.height / 2);
     ctx.rotate(op.angle / 180.0 * Math.PI);
     ctx.drawImage(src, -(src.width / 2), -(src.height / 2));
     ctx.restore();
     break;
    }
   });
   return canvas;
  }
  
  forEach() {
    return new TWSplitter(this);
  }
  
  zproject(mode = TWIN.AVERAGE) {
    // Create or re-use a canvas
    let canvas = (document.querySelector('#zproject')) || document.createElement('canvas');
    if (!document.querySelector('#zproject')) {
      canvas.id = 'zproject';
      canvas.style.display = 'none';
      document.body.append(canvas);
    }
    
    let fzero = this.applyTransforms(this.slices[0]);
    canvas.width = fzero.width;
    canvas.height = fzero.height;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    // Init
    let nz = this.slices.length;
    let k = 1.0 / nz;
    let size = canvas.width * canvas.height;
    let accuf32 = new Float32Array(size).fill(0);
    // Accumulate
    for (let i=0; i < nz; i++) {
      // `Flatten` transforms for each slice. Must work on pixels
      let frame = this.applyTransforms(this.slices[i]);
      // Compute the average. Don't know about clamping
      let tmp = frame.getContext('2d').getImageData(0,0,canvas.width,canvas.height);
     //.data;
      for (let i = 0; i < size; i++) {
        // console.log(accu.data[i]);
        accuf32[i] += tmp.data[i * 4] * k;
      }
    }
    // Convert float32 to rgba pixels
    let idata = new ImageData(to_rgba(accuf32),canvas.width,canvas.height);
    ctx.putImageData(idata,0,0);
    let output = new TWImage(canvas,0,0,canvas.width,canvas.height);
    output.raw = accuf32;
    output.type = 1; // Gray-level
    return output;
  }
} // End of class TWStack


class TWImage {
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
  
  show() {
    let canvas = document.createElement('canvas');
    canvas.id = `show`;
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


} // End of class Image




/*
$("#submitGraphic").click( function(){
  var canvas = document.getElementsByTagName("canvas");
  // canvas context
  var context = canvas[0].getContext("2d");
  // get the current ImageData for the canvas
  var data = context.getImageData(0, 0, canvas[0].width, canvas[0].height);
  // store the current globalCompositeOperation
  var compositeOperation = context.globalCompositeOperation;
  // set to draw behind current content
  context.globalCompositeOperation = "destination-over";
  //set background color
  context.fillStyle = "#FFFFFF";
  // draw background/rectangle on entire canvas
  context.fillRect(0,0,canvas[0].width,canvas[0].height);

  var tempCanvas = document.createElement("canvas"),
    tCtx = tempCanvas.getContext("2d");

  tempCanvas.width = 640;
  tempCanvas.height = 480;

  tCtx.drawImage(canvas[0],0,0);

  // write on screen
  var img = tempCanvas.toDataURL("image/png");
  document.write('<a href="'+img+'"><img src="'+img+'"/></a>');
})​
*/
