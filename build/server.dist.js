/**
 * function: server.dist
 * author  : wq
 * update  : 2019/4/25 10:55
 */
const chalk = require('chalk');
const server = require('pushstate-server');
const portfinder = require('portfinder')
const config = require('../config')
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  const host = process.env.HOST || config.dev.host
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      server.start({
        port: port,
        directory: config.build.assetsRoot,
      })
      const url = `http://${host}:${port}`;
      // openBrowser(url);

      console.log(chalk.green(`Dist server listening on ${url} ...`));
    }
  })
})

