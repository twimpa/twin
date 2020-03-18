// Functional Programming Tools

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const map = f => step => (accu, c, index) => step(accu, f(c,index));
  
const filter = predicate => step => (accu, c, index) => predicate(c) ? step(accu, c, index) : accu;


const range = (start,end,step=1) => Array.from({length: Math.abs(Math.floor((end - start) / step))}, (_,i) => start + i * step);


const TWIN = {
  NONE: -1,
  NEAREST: 10,
  BILINEAR: 11,
  SUM: 20,
  AVERAGE: 21,
  STD: 22,
  MAX: 23,
  MIN: 24,
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
  



/**
 * From MDN
 *
 * La fonction composeAsync accepte autant de fonctions que nécessaire comme arguments 
 * et renvoie une nouvelle fonction qui prend une valeur initiale pour la passer 
 * à travers ces étapes de compositions. Cette façon de faire garantit que les fonctions, 
 * qu'elles soient synchrones ou asynchrones, sont exécutées dans le bon ordre :
 *
 *  const transformData = composeAsync(func1, asyncFunc1, asyncFunc2, func2);
 *  transformData(data);
 * 
 * Avec ECMAScript 2017, on peut obtenir une composition séquentielle plus 
 * simplement avec les opérateurs await/async :
 * 
 * let result;
 * for(const f of [func1, func2, func3]) {
 *   result = await f(result); 
 * }
 */
 
 
const applyAsync = (acc, val) => acc.then(val);
const composeAsync = (...funcs) => x => funcs.reduce(applyAsync, Promise.resolve(x));






