const configs = require('./webpack.config.js');
const webpack = require('webpack');
const ip = require('quick-local-ip').getLocalIP4();
const pathTo = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var copy = require('copy-webpack-plugin');
let [config, weexConfig] = configs;

//配置调试服务器
config.devServer = {
	clientLogLevel: 'warning',
	compress: false,
	contentBase: pathTo.join(__dirname, './'),  //设置服务器的目录
	watchContentBase: true,	//监听目录变更
	port: 8081,
	host: ip,
	open: true,
	inline:true,
	public: `http://${ip}:8081`,
	openPage: `dev/index.html`,	//默认打开页面
	watchOptions: {
		ignored: /node_modules/,
		aggregateTimeout: 300,
		poll: false
	},

  proxy:{
    '/bpmsx/sys/notice/v1/getNoticeDetail': {
      target: 'http://120.25.130.236:58001/bpmsx-api',
      changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('accessToken', req.query.accessToken)
      }
    }
	}
};

//SOURCE MAP
config.devtool = 'eval-source-map';

//批量添加插件
function addPlugin(config, ...items) {
	for (let item of items) {
		config.plugins.push(item)
	}
}

//添加dev环境需要的插件
addPlugin(
  config,
	//把entry的所有文件对应生成一个html页面，这个页面是我们devServer托管的对象
	...Object.keys(config.entry).map(name => {
		return new HtmlWebpackPlugin({
			title: '大道蜂鸟',
			filename: `dev/${name}.html`,
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
	new copy([
		//把资源拷贝到devServer中，否则图片字体会丢失
		{ from: './src/image', to: "./dev/dist/image" }
	]),
	//用于声明环境变量
	new webpack.DefinePlugin({
		'process.env': { NODE_ENV: JSON.stringify('development'), server: JSON.stringify(`http://${ip}:8081`)},
		DEBUG: true,
	})
);

module.exports = config;
