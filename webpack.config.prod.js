const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'twin.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true
  }
};
