const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs');

const mode = process.env.NODE_ENV || 'development';
const isEnvProduction = mode === 'production';
// const isEnvDevelopment = mode === 'development';

const prepareManifest = () => {
  const manifest = JSON.parse(
    fs.readFileSync('./public/manifest.json', {
      encoding: 'utf8',
      flag: 'r',
    }),
  );

  const contentVendors = fs
    .readdirSync(path.resolve('../content/dist/'))
    .filter((file) =>
      file.match(
        /^content-vendors(\.[a-z0-9]+)?\.js$|MiniPlayer|^[0-9]+\.content-bundle\.js$/,
      ),
    );

  const contentLazyAssets = fs
    .readdirSync(path.resolve('../content/dist'))
    .filter((file) => file.indexOf('MiniPlayer') !== -1);
  manifest.content_scripts[0].js = [
    ...contentLazyAssets,
    ...contentVendors,
    'content-bundle.js',
  ];
  manifest.web_accessible_resources = [];
  console.log('content_scripts', manifest.content_scripts);

  fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest));
};

const config = {
  performance: false,
  mode,
  devtool: mode === 'development' ? 'inline-source-map' : false,
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
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  optimization: {
    usedExports: true,
    flagIncludedChunks: isEnvProduction,
    concatenateModules: isEnvProduction,
    minimize: isEnvProduction,
    splitChunks: {
      filename: 'vendors.[chunkhash].js',
      chunks: 'all',
    },
    minimizer: [],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
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
      ...(isEnvProduction
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
        : undefined),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/icon'),
          to: 'icon',
        },
        {
          from: path.resolve(__dirname, '../content/dist'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(
            __dirname,
            '../content/src/util/googleDocsInject.js',
          ),
          to: path.resolve(__dirname, 'dist/content-google-docs-inject.js'),
        },
        {
          from: path.resolve(__dirname, '../background/dist'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('Prepare manifest hook\n', () => {
          prepareManifest();
        });
      },
    },
  ],
};

if (isEnvProduction) {
  config.optimization.minimizer.push(
    new TerserPlugin({
      terserOptions: {
        mangle: true,
        ecma: 2020,
        compress: {
          drop_console: true,
        },
      },
    }),
  );
}

module.exports = config;
