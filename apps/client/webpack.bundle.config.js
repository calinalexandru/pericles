const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

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

module.exports = {
  mode,
  watch: mode === 'development',
  performance: false,
  entry: path.resolve(__dirname, 'noop.js'),
  plugins: [
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
        compiler.hooks.done.tap('Prepare manifest hook\n', prepareManifest);
      },
    },
  ],
};
