var webpack = require("webpack")
var path = require("path")
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  debug: true,
  devtool: "#eval-source-map",
  entry: "./src/entry.js",
  output: {
    path: __dirname,
    filename: "./build/bundle.js",
  },
  resolve: {
    extensions: ["", ".js", ".css"]
  },
  module: {
    preLoaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: "eslint" },
    ],
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.svg$/, loader: "file?name=build/[name].[ext]" },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new ExtractTextPlugin('./build/bundle.css'),
  ]
}
