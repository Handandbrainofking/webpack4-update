const pathTo = require('path')
const fs = require('fs-extra')
var glob = require('glob')
const webpack = require('webpack')

function getEntries() {
  var entryFiles = glob.sync('./src/entry/**', { nodir: true })
  var entrReg = /\/src\/entry\/[^\/]+.js$/
  var entries = {}
  for (let filePath of entryFiles) {
    const extname = pathTo.extname(filePath)
    if (extname === '.js' && entrReg.test(filePath)) {
      console.log('entry file ===>', filePath)
      var filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
      entries[filename] = filePath
    }
  }
  return entries
}

var copy = require('copy-webpack-plugin')
// web need vue-loader
const plugins = [
  new webpack.optimize.UglifyJsPlugin({
    minimize: false
  }),
  new webpack.BannerPlugin({
    banner: '// { "framework": ' + '"Vue" ' + /*(fileType === '.vue' ? '"Vue"' : '"Weex"') + */ '} \n',
    raw: true,
    exclude: 'Vue'
  }),
  new copy([
    { from: './src/image', to: './image' },
    { from: './static', to: './static' },
    { from: './system_config.txt', to: './system_config.txt' }
  ])
]

console.log('Building..., Please wait a moment.')

// 生成webpack配置
function getBaseConfig() {
  return {
    entry: getEntries(),
    output: {
      path: pathTo.join(__dirname, 'dist'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        {
          test: /\.vue(\?[^?]+)?$/
        },
        {
          test: /\.scss$/,
          loader: 'style-loader!css-loader!sass-loader'
        },
        {
          test: /\.css$/,
          loader: 'css-loader'
        }
      ]
    },
    plugins: plugins,
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        //给src目录声明别名
        '@': pathTo.join(__dirname, 'src'),
        '@page': pathTo.join(__dirname, 'src/page'),
        '@dui': '@ddjf/ddpad/packages/'
      }
    }
  }
}

let scssResLoader = {
  loader: 'sass-resources-loader',
  options: {
    resources: [pathTo.join(__dirname, '/src/css/common.scss')]
  }
}

var webConfig = getBaseConfig();
(webConfig.context = pathTo.join(__dirname, '')), (webConfig.output.filename = '[name].web.js')
webConfig.module.loaders[1].loader = 'vue-loader'
webConfig.module.loaders[1].options = {
  loaders: {
    scss: ['vue-style-loader', 'css-loader', 'sass-loader', scssResLoader],
    sass: ['vue-style-loader', 'css-loader', 'sass-loader', scssResLoader]
  }
}

//*.weex.js
var weexConfig = getBaseConfig(true)
weexConfig.output.filename = '[name].js'
weexConfig.module.loaders[1].loader = 'weex-loader'
weexConfig.module.loaders[1].options = {
  loaders: {
    scss: ['sass-loader', scssResLoader],
    sass: ['sass-loader', scssResLoader]
  }
}

var exports = [webConfig, weexConfig]

module.exports = exports
