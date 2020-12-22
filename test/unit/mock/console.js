/**
 * 模拟系统的consloe，并生成相关的测试数据
 * by bowen
 */
const oriConsole = window.console

window.console = {
  ...oriConsole,
  logs: [],
  warns: [],
  errors: [],
  clear() {
    this.logs.length = 0
    this.warns.length = 0
    this.errors.length = 0
  },
  log(...args) {
    this.logs.push(args)
    // oriConsole.log(...args)
  },
  warn(...args) {
    this.warns.push(args)
    oriConsole.warn(...args)
  },
  error(...args) {
    this.errors.push(args)
    oriConsole.error(...args)
  }
}
