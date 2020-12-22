const configs = require('./webpack.config.js');
let [config, weexConfig] = configs;
weexConfig.devtool = '#inline-source-map';

delete weexConfig.entry
module.exports = weexConfig;