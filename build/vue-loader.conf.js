'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

const vueLoader = (isWeex) => {
  return {
    loaders: utils.cssLoaders({
      sourceMap: sourceMapEnabled,
      extract: false // isProduction
    }, isWeex),
    transformToRequire: {
      video: ['src', 'poster'],
      source: 'src',
      img: 'src',
      image: 'xlink:href'
    }
  }
}

module.exports = vueLoader
