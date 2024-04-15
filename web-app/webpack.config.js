const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {
  PurgeCSSPlugin
} = require('purgecss-webpack-plugin');

const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');

const PATHS = {
  src: path.join(__dirname, "src"),
};

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
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, {
        nodir: true
      }),
    }),
    // new BundleAnalyzerPlugin({
    //   filename: 'bundle-report.html',
    //   analyzerMode: 'static', // Generates a static HTML file with the report.
    //   openAnalyzer: true, // Automatically open the report in the default browser
    // }),
    new CompressionPlugin({
      test: /\.(js|css|html|svg)$/, // Target file types to compress
      algorithm: 'gzip',
      filename: '[path][base].gz', // Output format for gzipped files
      compressionOptions: {
        level: 9
      },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: true, // This will remove the original uncompressed files
    }),
  ],
  module: {
    rules: [{
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../data/www'),
    clean: true,
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    usedExports: true,
    sideEffects: true,
    splitChunks: {
      chunks: 'all', // Apply optimizations to both dynamic and non-dynamic imported modules.
      minSize: 20000, // Minimum size, in bytes, for a chunk to be generated.
      minChunks: 1, // Minimum number of chunks that must share a module before splitting.
      maxAsyncRequests: 30, // Maximum number of simultaneous requests for async chunks.
      maxInitialRequests: 30, // Maximum number of simultaneous requests at an entry point.
      enforceSizeThreshold: 50000, // Force splitting for chunks larger than this size (bytes).
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // Priority for the vendors group.
          // reuseExistingChunk: true,
          name(module) {
            // Get the name of the node module being imported
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            // Return a custom chunk name based on the package name
            return `npm.${packageName.replace('@', '')}`;
          },
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      models: path.resolve(__dirname, 'src/models/'),
      services: path.resolve(__dirname, 'src/services/'),
      icons: path.resolve(__dirname, 'src/components/icons/'),
      pages: path.resolve(__dirname, 'src/components/pages/'),
      layouts: path.resolve(__dirname, 'src/layouts/')
    }
  },
  cache: {
    type: 'filesystem', // or 'memory' for in-memory caching
    allowCollectingMemory: true, // This enables caching for node_modules (recommended for performance)
  }
};