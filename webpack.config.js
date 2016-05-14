module.exports = {
  entry: __dirname + "/main.js",
  output: {
    path:  __dirname + "/dist/js",
    filename: 'timepoint-selection.var.js',
    library: 'TimepointSelection',
    libraryTarget: 'var'
  },
  devtool: "cheap-module-eval-source-map",
  debug: true,
  contentBase: "dist/",
  publicPath: "/js/",
  stats: {
    colors: true
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};