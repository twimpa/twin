class TWStackSplitter {
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

