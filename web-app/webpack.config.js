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
const DEVELOPMENT_SERVER_PORT = 8080;
const DEVELOPMENT_WEBSOCKET_PORT = 8085;
// const TIMING_PROFILE_REPORT_FILENAME = path.resolve(__dirname, 'timingProfileReport.json'); // Used with the profiling plugin
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
      liveReload: true,
      port: DEVELOPMENT_SERVER_PORT,
      proxy: [{
          context: ['/api'],
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          logLevel: 'debug'
        },
        {
          context: ['/ws'],
          target: `ws://localhost:${DEVELOPMENT_WEBSOCKET_PORT}`,
          changeOrigin: true,
          secure: false,
          logLevel: 'debug',
          ws: true
        }
      ],
    },
    watchOptions: {
      ignored: ['node_modules/**', 'dist/**'],
      poll: true, // Use polling if necessary (use as a last resort)
    },
    plugins: [
      isProduction && new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
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
      ] : []),
      // new webpack.debug.ProfilingPlugin({
      //   outputPath: TIMING_PROFILE_REPORT_FILENAME
      // }),
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
      }, {
        test: /\.s?css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
        ],
      }],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
        new CssMinimizerPlugin({
          parallel: true,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 500000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
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
      },
      extensions: ['.js', '.jsx'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      unsafeCache: true,
    },
    cache: {
      type: 'filesystem', // or 'memory' for in-memory caching
      allowCollectingMemory: true, // This enables caching for node_modules (recommended for performance)
      buildDependencies: {
        config: [__filename],
      },
    },
  }

  return config;
};

console.log('Webpack configuration setup complete.');