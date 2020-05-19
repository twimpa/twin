export class TWStack {
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
    return new TWStackSplitter(this);
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
