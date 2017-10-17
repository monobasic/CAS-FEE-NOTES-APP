const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'js/bundle.js',
    path: path.join(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      { from: 'src/index.html' },
      { from: 'src/templates', to: 'templates'}
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings, handles browser injection
        }, {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              sourceMap: true
            }
        }, {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              sourceMap: true
            }
        }]
      },
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        use: [{
          loader: "file-loader",
          options: {
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  }
};
