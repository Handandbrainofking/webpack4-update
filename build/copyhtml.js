/**
 * function: 拷贝模板文件
 * author  : wq
 * update  : 2018/11/21 15:30
 */
const path = require("path")
const glob = require("glob")
const fs = require("fs")
const {spawn} = require("child_process")
const rm = require('rimraf')
// 获取对应的入口文件
const entryFiles = glob.sync('./src/entry/*.js', {'nodir': true})
// 删除当前文件夹中的文件
const distPath = path.resolve('./web')
function doStart () {
  rm(distPath + '/*.html', err => {
    if (err) throw err;
    writeFile()
  })
}
doStart()
async function removeFile (path) {
  await spawn('rm', ['-rf', path])
}
async function readTemplate (template, name) {
  return new Promise((res) => {
    let text = fs.readFileSync(template).toString().replace()
    text = text.replace(/\<\/body\>/g, `<script src="../dist/${name}.web.js"></script></body>`).replace('<%= htmlWebpackPlugin.options.title %>', '大道蜂鸟')
    res(text)
  })
}
function writeFile () {
  const readFile = path.resolve('./build', 'index.tpl.html')
  return new Promise((resolve, reject) => {
    (async function () {
      for (let i in entryFiles) {
        const item = entryFiles[i]
        const name = path.relative('./src/entry', item).replace('.js', '')
        const file = await readTemplate(readFile, name)
        const writePath = path.resolve('./web', `${name}.html`)
        await fs.writeFile(writePath, file, (err => {
          if (err) reject(err)
        }))
      }
      resolve('succ')
    }())
  })
}