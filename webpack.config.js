const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist/js')
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings, handles browser injection
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader?sourceMap" // compiles Sass to CSS
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
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: [
      //     'file-loader'
      //   ]
      // }
    ]
  }
};
