
const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')

let electronProcess = null
let manualRestart = false

function log(name, color, data) {
  const prefix = chalk[color].bold(`[${name}] `)
  data = data instanceof Buffer
    ? data.toString()
    : typeof data === 'object'
      ? data.toString({ colors: true, chunks: false })
      : `${data}`
  console.log(data.split(/\r?\n/).map(line => `${prefix}${line}`).join('\n'))
}

function startWebpack(name, color, config, hook) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)

    compiler.hooks.watchRun.tap('watch-run', () => {
      log(name, color, chalk.cyan('compiling...'))
    })
    compiler.hooks.done.tap('done', stats => {
      log(name, color, stats)
    })
    compiler.watch({}, (err, stats) => {
      if (err) {
        return reject(err)
      }
      hook && hook()
      resolve()
    })
  })
}

function startElectron() {
  const args = [
    '--inspect=5858',
    path.resolve(__dirname, '../dist/electron/main.js')
  ]

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args.push(...process.argv.slice(3))
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args.push(...process.argv.slice(2))
  }

  electronProcess = spawn(electron, args, {
    // cwd: path.resolve(__dirname, '../dist/electron')
  })

  electronProcess.stdout.on('data', data => {
    log('Electron', 'blue', data)
  })
  electronProcess.stderr.on('data', data => {
    log('Electron', 'red', data)
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}

Promise.all([
  startWebpack('Renderer', 'yellow', require('./webpack.renderer.config')),
  startWebpack('Preload', 'yellow', require('./webpack.preload.config')),
  startWebpack('Main', 'yellow', require('./webpack.main.config'), () => {
    if (electronProcess && electronProcess.kill) {
      manualRestart = true
      process.kill(electronProcess.pid)
      electronProcess = null
      startElectron()

      setTimeout(() => {
        manualRestart = false
      }, 5000)
    }
  }),
]).then(() => startElectron())
