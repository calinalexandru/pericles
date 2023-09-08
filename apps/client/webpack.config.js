const { spawn } = require('child_process');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

const optimization = {
  usedExports: true,
  splitChunks: {
    filename: 'vendors.[chunkhash].js',
    chunks: 'all',
  },
};

if (isProduction) {
  optimization.minimizer = [
    new TerserPlugin({
      terserOptions: {
        mangle: true,
        ecma: 2020,
        compress: {
          drop_console: true,
        },
      },
    }),
  ];
}

module.exports = {
  mode,
  performance: false,
  devtool: isProduction ? false : 'inline-source-map',
  watch: !isProduction,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // transpileOnly: true,
              compilerOptions: {
                skipLibCheck: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
  optimization,
  resolve: {
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/primitives': path.resolve(__dirname, 'src/primitives'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/store': path.resolve(__dirname, 'src/store'),
    },
  },
  target: ['web'],
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      ...(isProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : {}),
    }),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('Dev Bundle Runner Plugin', (stats) => {
          if (stats.hasErrors()) {
            console.log('Build failed, not running bundle task.');
          } else {
            console.log('Running bundle task...');
            const child = spawn('npm', ['run', 'bundle'], {
              stdio: 'inherit',
            });

            child.on('close', (code) => {
              if (code !== 0) {
                console.error(`dev:bundle process exited with code ${code}`);
              }
            });
          }
        });
      },
    },
  ],
};
