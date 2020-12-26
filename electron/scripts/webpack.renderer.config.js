/* eslint-disable unicorn/no-unsafe-regex */

const MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const { dependencies } = require('../package.json')

module.exports = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    renderer: path.resolve(__dirname, '../src/entries/renderer.ts'),
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../dist/electron'),
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '../src'),
      'package.json': path.resolve(__dirname, '../package.json'),
    },
    extensions: [
      '.ts',
      '.js',
      '.json',
      '.vue',
    ],
  },
  externals: [
    ...Object.keys(dependencies || {}),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
      },
      {
        test: /\.gql$/,
        exclude: /node_modules/,
        loaders: 'graphql-tag/loader',
      },
      {
        test: /\.(css|postcss)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        test: /\.(js|ts)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'images/[name]--[folder].[ext]',
            esModule: false,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]',
          },
        },
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      global: 'window',
    }),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new HtmlWebpackPlugin({
      filename: 'index_mac.html',
      template: path.resolve(__dirname, '../src/templates/index_mac.html'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      nodeModules: process.env.NODE_ENV !== 'production'
        ? path.resolve(__dirname, '../node_modules')
        : false,
    }),
    new HtmlWebpackPlugin({
      filename: 'index_win.html',
      template: path.resolve(__dirname, '../src/templates/index_win.html'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      nodeModules: process.env.NODE_ENV !== 'production'
        ? path.resolve(__dirname, '../node_modules')
        : false,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']), // 'API_URL'
  ],
  target: 'electron-renderer',
}

// Deelopment
if (process.env.NODE_ENV !== 'production') {
  module.exports.mode = 'development'
}

// Production
if (process.env.NODE_ENV === 'production') {
  // module.exports.devtool = ''
  module.exports.plugins.push(
    new MinifyPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/electron/static'),
        ignore: ['.*'],
      },
    ]),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    })
  )
}
