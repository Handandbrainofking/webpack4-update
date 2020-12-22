'use strict'
const path = require('path')
const config = require('../config')
const packageConfig = require('../package.json')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options, isWeex) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  function resolveSassResourceLoader(name) {
    return path.resolve(__dirname, '../src/css/' + name);
  }
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = isWeex ? [] : [cssLoader]
    if (options.usePostCSS) {
      loaders.push(postcssLoader)
    }
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    if (loader === 'sass') {
      loaders.push({
        loader: 'sass-resources-loader',
        options: {
          resources: [resolveSassResourceLoader('common.scss')]
        }
      })
    }

    // Extract CSS when that option is specified
    if (!isWeex && options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    }
    if (!isWeex) {
      return ['vue-style-loader'].concat(loaders)
    }
    return loaders;
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  const loadersMap = {
    less: generateLoaders('less'),
    sass: generateLoaders('sass'),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
  if (!isWeex) {
    loadersMap['css'] = generateLoaders()
  }
  console.log(111111111, loadersMap)
  return loadersMap
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options, isWeex) {
  const output = []
  const loaders = exports.cssLoaders(options, isWeex)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
