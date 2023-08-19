const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

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
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  optimization: {
    usedExports: true,
    flagIncludedChunks: isEnvProduction,
    concatenateModules: isEnvProduction,
    minimize: isEnvProduction,
    splitChunks: {
      filename: 'background-vendors.js',
      chunks: 'all',
    },
    minimizer: [],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@/core': path.resolve(__dirname, 'src/core'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/speech': path.resolve(__dirname, 'src/speech'),
      '@/util': path.resolve(__dirname, 'src/util'),
    },
  },
};

if (mode === 'production') {
  config.optimization.minimizer.push(
    new TerserPlugin({
      terserOptions: {
        mangle: true,
        ecma: 2020,
        compress: {
          drop_console: true,
        },
      },
    })
  );
}

module.exports = config;
