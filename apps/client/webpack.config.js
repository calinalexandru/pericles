const chokidar = require('chokidar');
const { spawn } = require('child_process');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

const optimization = {
  usedExports: true,
  splitChunks: {
    filename: 'vendors.[chunkhash].js',
    chunks: 'all',
  },
};

function runBundle() {
  console.log('Running bundle task...');
  const child = spawn('npm', ['run', 'bundle'], { stdio: 'inherit' });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`dev:bundle process exited with code ${code}`);
    }
  });
}

module.exports = {
  mode,
  performance: false,
  devtool: isProduction ? false : 'inline-source-map',
  watch: !isProduction,
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
    new ForkTsCheckerWebpackPlugin(),
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
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          if (!compiler.watcher) {
            const watcher = chokidar.watch([
              '../background/src',
              '../content/src',
            ]);

            watcher.on('change', (changedPath) => {
              console.log(
                `File ${changedPath} was changed, running bundle task...`,
              );
              runBundle();
            });

            compiler.watcher = watcher;
          }
        });

        compiler.hooks.done.tap('Dev Bundle Runner Plugin', (stats) => {
          if (!stats.hasErrors()) {
            runBundle();
          } else {
            console.log('Build failed, not running bundle task.');
          }
        });
      },
    },
  ],
};
