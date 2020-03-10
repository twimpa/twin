///////////: N O D E S :///////////

const start = async (args) => {
  args.time_start = performance.now();
  return args;
}

const end = async (args) => {
  args.performance = performance.now() - args.time_start;
  console.info(`Performance: ${args.performance} milliseconds.`);
  return args;
}

const nrange = (start,end,step=1) => async (args) => {
  args.array = Array.from({length: Math.abs(Math.floor((end - start) / step))}, (_,i) => start + i * step);
  return args;
};

const forEach = async (args) => {
  // TODO Check `input`is a stack
  args.input = new TWSplitter(args.input);
  return args;
}

const info = async (args) => {
  args.width = args.input.width;
  args.height = args.input.height
  return args;
};
    
/*
 *
 *
 */
const load = async (args) => {

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
      console.error('There has been a problem with your fetch operation:', error);
    });

  }
  
  // Main
  console.log(args);
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

/*
 *
 *
 */
const normalize = (roi) => async (args) => {
  // TODO Check if `input`is an image
  args.input = args.input.normalize(roi);
  return args;
}

/*
 *
 *
 */
const toStack = (nRows,nCols,border) => async (args) => {
  console.log(args);
  // TODO Check if `input`is an image
  args.input = args.input.toStack(nRows,nCols,border);
  return args;
}

/*
 *
 *
 */
const resize = (new_width,new_height,type=-1) => async (args) => {
  // TODO Check if `input` is an image
  args.input = args.input.resize(new_width, new_height, type);
  return args;
}

/*
 *
 *
 */
const rotate = async (args) =>{
  // TODO Check `input`is an image
  args.input = args.input.rotate(args.array);
  return args;
}

/*
 *
 *
 */
const saveInStack = async (args) =>{
  // TODO Check `input`is an image
  args.input = args.input.saveInStack();
  return args;
}

/*
 *
 *
 */
const show = async (args) => {
  console.log(args);
  console.log(args.input);
  args.input.show();
}

/*
 *
 *
 */
const zproject = async (args) => {
  // TODO Check `input`is an image
  args.input = args.input.zproject();
  return args;
}

