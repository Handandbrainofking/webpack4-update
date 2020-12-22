const configs = require('./webpack.config.js');
const webpack = require('webpack');
const path = require('path');
const CopyBuildResultPlugin = require('./build/copy-build-result-plugin')

let [config, weexConfig] = configs;

//批量添加插件
function addPlugin(target, ...items) {
  for (let item of items) {
    target.plugins.push(item)
  }
}


//添加dev环境需要的插件
addPlugin(
  weexConfig,
  //把生成的文件目录(dist)拷贝到android目录
  // new CopyBuildResultPlugin(path.join(__dirname, './dist'), path.join(__dirname, '/platforms/android/app/src/main/assets')),
  //用于声明环境变量
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('andriod'),
      server: JSON.stringify('http://10.1.108.112:11001'),
      authServer:JSON.stringify('http://10.1.108.173:10100')
    }
  })
);

module.exports = weexConfig;