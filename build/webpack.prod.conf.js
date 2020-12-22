'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')(true)

const env = require('../config/prod.env')
const UglifyJsPlugin = require('terser-webpack-plugin')



const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  watch: true,
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        // extractComments: {
        //   banner: '// { "framework": "Vue" } \n'
        // },
        terserOptions: {
          mangle: true,
          compress: {
            unused: true,
            warnings: false,
            drop_debugger: true
          },
          output: {
            comments: /^\**!|\"framework\"/i
          }
        }
      })
    ]
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: false,
      usePostCSS: false
    }, true)
  },
  // devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('[name].js')/*,
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')*/
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own fil
    // keep module.id stable when vendor modules does not change
    // new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // copy custom static assets
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
