const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isEnvProduction = mode === 'production';
// const fs = require('fs');

// const appDirectory = fs.realpathSync(process.cwd());
// const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const config = {
  performance: false,
  mode,
  target: ['web'],
  devtool: mode === 'development' ? 'inline-source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'background-bundle.js',
  },
  watch: mode === 'development',
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
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './background-service-worker.js'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
  optimization: {
    usedExports: true,
    flagIncludedChunks: isEnvProduction,
    concatenateModules: isEnvProduction,
    minimize: isEnvProduction,
    splitChunks: {
      filename: 'background-vendors.js',
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@/core': path.resolve(__dirname, 'src/core'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/speech': path.resolve(__dirname, 'src/speech'),
      '@/util': path.resolve(__dirname, 'src/util'),
    },
  },
};

module.exports = config;
