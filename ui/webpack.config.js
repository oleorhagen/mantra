const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'app', 'main.jsx'),
  // babel will run and put all the files in .dist
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tetra.bundle.js'
  },
  devServer: {
    port: 80,
    host: '0.0.0.0'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        resolve: {
          extensions: ['.js', '.jsx']
        }
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebPackPlugin({
      // icon is from http://www.iconsdb.com/custom-color/fish-icon.html
      favicon: './favicon.ico',
      // this gets our favicon to refresh when changed
      hash: true,
      template: './index.html',
      filename: './index.html'
    })
  ]
};
