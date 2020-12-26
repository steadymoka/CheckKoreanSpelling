
const chalk = require('chalk')
const webpack = require('webpack')

function log(name, color, data) {
  const prefix = chalk[color].bold(`[${name}] `)
  data = data instanceof Buffer
    ? data.toString()
    : typeof data === 'object'
      ? data.toString({ colors: true, chunks: false })
      : `${data}`
  console.log(data.split(/\r?\n/).map(line => `${prefix}${line}`).join('\n'))
}

function buildWebpack(name, color, config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)

    compiler.hooks.done.tap('done', stats => {
      log(name, color, stats)
    })

    log(name, color, chalk.cyan('compiling...'))
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

Promise.all([
  buildWebpack('Renderer', 'yellow', require('./webpack.renderer.config')),
  buildWebpack('Preload', 'yellow', require('./webpack.preload.config')),
  buildWebpack('Main', 'yellow', require('./webpack.main.config')),
])
