const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
// const StatsPlugin = require('stats-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
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

// Settings
const PRODUCTION_OUTPUT_PATH = path.resolve(__dirname, '../data/www');
const DEVELOPMENT_OUTPUT_PATH = path.resolve(__dirname, 'dist');
const ENABLE_BUNDLE_ANALYZER = false; // Set to `true` to enable bundle analysis
const TIMING_PROFILE_REPORT_FILENAME = path.resolve(__dirname, 'timingProfileReport.json'); // Used with the profiling plugin
// const BUILD_STATS_FILENAME = 'buildStats.json'; //path.resolve(__dirname, 'buildStats.json'); // Used with the stats plugin

console.log('Starting Webpack configuration setup...');

module.exports = (env) => {
  const isProduction = env.mode === 'production' ? true : false;
  console.log('Build mode:', env.mode);
  console.log('Files will be output to:', isProduction ? PRODUCTION_OUTPUT_PATH : DEVELOPMENT_OUTPUT_PATH);
  ENABLE_BUNDLE_ANALYZER ? console.log('Bundle analysis enabled. Check output folder for analysis report.') : null;

  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: {
      index: './src/index.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: isProduction ? PRODUCTION_OUTPUT_PATH : DEVELOPMENT_OUTPUT_PATH,
      publicPath: '/',
      clean: true
    },
    // Can add 'eval-source-map' instead of 'inline-source-map' for development. 
    // This is faster but less verbose and doesn't include the original source code.
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      static: './dist',
      open: true,
      hot: true,
      proxy: [{
          context: ['/api'],
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          logLevel: 'debug'
        },
        {
          context: ['/websocket'],
          target: 'ws://localhost:8081',
          changeOrigin: true,
          secure: false,
          logLevel: 'debug',
          // ws: true
        }
      ],
    },
    watchOptions: {
      ignored: /node_modules/,
      poll: true, // Use polling if necessary (use as a last resort)
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new WebpackBar(), // For progress bar
      new HtmlWebpackPlugin({
        title: 'Pulse Scaling Calibration Management',
        template: 'public/index.html',
        favicon: 'public/favicon.ico'
      }),
      ...(isProduction ? [
        new PurgeCSSPlugin({
          paths: glob.sync(`${PATHS.src}/**/*`, {
            nodir: true
          }),
        }),
        new CompressionPlugin({
          test: /\.(js|css|html|svg)$/,
          algorithm: 'gzip',
          filename: '[path][base].gz',
          compressionOptions: {
            level: 9
          },
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: true,
        }),
        new CssMinimizerPlugin(),
        new TerserPlugin()
      ] : []),
      new webpack.debug.ProfilingPlugin({
        outputPath: TIMING_PROFILE_REPORT_FILENAME
      }),
      // new StatsPlugin(BUILD_STATS_FILENAME, {
      //   chunkModules: true,
      //   exclude: [/node_modules[\\\/]react/]
      // }),
      ENABLE_BUNDLE_ANALYZER ? new BundleAnalyzerPlugin({
        filename: 'bundle-report.html',
        analyzerMode: 'static', // Generates a static HTML file with the report.
        openAnalyzer: true, // Automatically open the report in the default browser
      }) : null,
    ].filter(Boolean),
    module: {
      rules: [{
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        }, {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
      ],
    },
    optimization: isProduction ? {
      minimize: true,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      usedExports: true,
      sideEffects: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
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
    } : {}, // Disable optimizations for development
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
  }

  return config;
};

console.log('Webpack configuration setup complete.');