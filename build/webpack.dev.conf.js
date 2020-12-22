'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')(false)
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: utils.styleLoaders({
      hotReload: false,
      extract: false,
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: false
    }, false)
  },
  // cheap-module-eval-source-map is faster for development
  // devtool: config.dev.devtool,
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
    //   ],
    // },
    hot: true,
    contentBase: path.join(__dirname, '../'), // since we use CopyWebpackPlugin.
    compress: false,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    // public: `http://${PORT || config.dev.port}:8085`,
    openPage: `dev/index.html`,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    // quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // https://github.com/ampedandwired/html-webpack-plugin
    ...Object.keys(baseWebpackConfig.entry).map(name => {
      return new HtmlWebpackPlugin({
        title: '大道蜂鸟',
        filename: `${name}.html`,
        template: './build/index.tpl.html',
        isDevServer: true,
        chunksSortMode: 'dependency',
        inject: true,
        chunks: [name, 'vendor', 'manifest'],
        devScripts:`
        <script>
          window.addEventListener('load', function () {
          var is_touch_device = function () {
            return 'ontouchstart' in window // works on most browsers
              || 'onmsgesturechange' in window; // works on ie10
          };
          if(!is_touch_device()) {
            if (window.parent === window) { // not in iframe.
            window.phantomLimb.stop()
            }
          }
          })
        </script>
        `
      })
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/image'),
        to: 'dist/image',
        ignore: ['.*']
      }
    ])
  ]
})
