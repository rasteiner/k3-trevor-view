const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin');
const InjectPlugin = require('webpack-inject-plugin').default;

const env = process.env.NODE_ENV !== 'production'
  ? 'development'
  : 'production';

const production = env === 'production';
const development = env === 'development';

module.exports = {
  mode: env,
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          production ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css'
    }),
    new VueLoaderPlugin(),
  ]
}

if(development) {
  const lrp = new LiveReloadPlugin({
    hostname: 'localhost'
  })

  module.exports.plugins.push(
    lrp,
    new InjectPlugin(() => lrp.autoloadJs(), {
      'entryName': 'index.js'
    })
  )
}
