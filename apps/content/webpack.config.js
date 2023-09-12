const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isEnvProduction = mode === 'production';
const config = {
  performance: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'chrome-extension://nghplkbgebgjnkjloimiphpmgbofdgdh/',
    filename: 'content-bundle.js',
  },
  mode,
  devtool: mode === 'development' ? 'inline-source-map' : false,
  watch: mode === 'development',
  optimization: {
    usedExports: true,
    flagIncludedChunks: isEnvProduction,
    concatenateModules: isEnvProduction,
    minimize: isEnvProduction,
    splitChunks: {
      filename: 'content-vendors.[contenthash].js',
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            configFile: process.env.SWC_CONFIG_FILE || '.swcrc',
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insert: 'head',
              injectType: 'singletonStyleTag',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin(), new CleanWebpackPlugin()],
  resolve: {
    // symlinks: false,
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@/core': path.resolve(__dirname, 'src/core'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/util': path.resolve(__dirname, 'src/util'),
      '@/features': path.resolve(__dirname, 'src/features'),
      '@/tests': path.resolve(__dirname, 'src/tests'),
      '@/interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@/strategy': path.resolve(__dirname, 'src/strategy'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  stats: {
    errorDetails: true,
  },
};

module.exports = config;
