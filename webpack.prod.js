const configs = require('./webpack.config.js');
const webpack = require('webpack');
const ip = require('quick-local-ip').getLocalIP4();
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs');
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
  config,
  //用于声明环境变量
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify('production.web') },
    DEBUG: true,
  })
);

//添加dev环境需要的插件
addPlugin(
  weexConfig,
  //用于声明环境变量
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify('production') , server: JSON.stringify('http://10.1.108.112:11001')},
    DEBUG: true,
  })
);

module.exports = [config, weexConfig];