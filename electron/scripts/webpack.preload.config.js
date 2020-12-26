const MinifyPlugin = require("babel-minify-webpack-plugin")
const path = require('path')
const webpack = require('webpack')

const { dependencies } = require('../package.json')


module.exports = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    'inject-daum': path.resolve(__dirname, '../src/entries/inject-daum.ts'),
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../dist/electron'),
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../src'),
    },
    extensions: [
      '.ts',
      '.js',
      '.json',
    ],
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  target: 'electron-preload',
}

// Development
if (process.env.NODE_ENV !== 'production') {
  module.exports.mode = 'development'
}

// Production
if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = ''
  module.exports.plugins.push(
    new MinifyPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
  )
}
