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
