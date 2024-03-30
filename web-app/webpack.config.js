const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    index: './src/index.js'
  },
  // Can add 'eval-source-map' instead of 'inline-source-map' for development. 
  // This is faster but less verbose and doesn't include the original source code.
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  devServer: {
    static: './dist',
    open: true,
    hot: true
  },
  watchOptions: {
    ignored: /node_modules/, // Ignore node_modules by default
    poll: true, // Use polling if necessary (use as a last resort)
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Pulse Scaling Calibration Management',
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    new CompressionPlugin(),
    ...(isProduction ? [new MiniCssExtractPlugin()] : [])
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader'
      ],
    }, {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    }],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: 'single',
  },
};