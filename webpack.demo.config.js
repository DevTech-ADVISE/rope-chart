//config for webpack build
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./src/ropeChart.js",
    output: {
        library: 'RopeChart',
        libraryTarget: 'umd',
        path: path.join(__dirname, "demo/"),
        filename: "ropeChart.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                presets: ['es2015']
              }
            },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.scss$/, loader: "style!css!sass"}
        ]
    },
    externals: {
        d3: {
            root: 'd3',
            commonjs: 'd3',
            commonjs2: 'd3',
            amd: 'd3'
        }
    }
};