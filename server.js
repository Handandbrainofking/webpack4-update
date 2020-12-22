const webpack = require('webpack');
const ip = require('quick-local-ip').getLocalIP4();
const pathTo = require('path');

const config = {
  entry: {
    index: pathTo.resolve('./src/utils/utils.js')
  },
  output: {
    filename: '[name].js',
  }
}
//配置调试服务器
config.devServer = {
  clientLogLevel: 'warning',
  compress: false,
  contentBase: pathTo.join(__dirname, './'),  //设置服务器的目录
//	watchContentBase: true,	//监听目录变更
  port: 8081,
  host: ip,
  open: true,
  inline: true,
  // hot:true,
  public: `http://${ip}:8081`,
  openPage: `web/index.html`,	//默认打开页面
//	watchOptions: {
//		ignored: /node_modules/,
//		aggregateTimeout: 300,
//		poll: false
//	},
  proxy: {
    '/bpmsx': 'http://10.1.108.112:11001',
    '/mobileapp': 'http://10.1.108.104:10100'
  }
};

module.exports = config;