module.exports = {
  entry: __dirname + "/main.js",
  output: {
    path:  __dirname + "/dist/js",
    publicPath: "/js/",
    filename: 'timepoint-selection.var.js',
    library: 'selection',
    libraryTarget: 'var'
  },
  devtool: "#source-map",
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};