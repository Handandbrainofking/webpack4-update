'use strict'
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
const entry = (function getEntries() {
  var entryFiles = glob.sync('./src/entry/**.js', { nodir: true })
  var entrReg = /\/src\/entry\/[^\/]+.js$/
  var entries = {}
  for (let filePath of entryFiles) {
    const extname = path.extname(filePath)
    if (extname === '.js' && entrReg.test(filePath)) {
      console.log('entry file ===>', filePath)
      var filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
      entries[filename] = filePath
    }
  }
  return entries
})()
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const plugins = []

const getConfig = (isWeex) => {
  const vueLoader = isWeex ? 'weex-loader' : 'vue-loader'
  if (!isWeex) {
    plugins.push(
      new VueLoaderPlugin()
    )
  }
  plugins.push(
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" } \r\n',
      raw: true,
      exclude: 'Vue'
    })
  )
  plugins.push(
    new CopyWebpackPlugin([
      { from: resolve('src/image'), to: './image' },
      { from: resolve('static'), to: './static' },
      { from: resolve('system_config.txt'), to: './system_config.txt' }
    ])
  )
  return {
    context: path.resolve(__dirname, '../'),
    entry: entry,
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        '@page': resolve('src/page'),
        '@dui': '@ddjf/ddpad/packages'
      }
    },
    module: {
      rules: [
        ...(config.dev.useEslint ? [createLintingRule()] : []),
        {
          test: /\.vue$/,
          loader: vueLoader,
          options: vueLoaderConfig(isWeex)
        },
        {
          test: /\.js$/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: plugins,
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    }
  }
}

module.exports = getConfig
