const chokidar = require('chokidar')
const path = require('path')
const { spawn } = require('child_process')

const { build } = require('./esbuild.server.js')

const cwd = path.resolve(__dirname, '..')

const watcher = chokidar.watch(['server/**/*'], { cwd })

watcher.on('ready', () => {
  watcher.on('add', onChange)
  watcher.on('change', onChange)
  watcher.on('unlink', onChange)

  onChange()
})

function debounce(fn, ms) {
  let timeout = null
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      fn.apply(this, arguments)
    }, ms)
  }
}

let proc = null

const onChange = debounce(async () => {
  console.log('Change detected')
  try {
    await build()
  } catch (e) {
    console.log(e)
    return
  }

  if (proc && proc.kill) {
    try {
      await new Promise((ok, fail) => {
        try {
          proc.unref()
          proc.on('exit', ok)
          process.kill(proc.pid)
        } catch (e) {
          fail(e)
        }
      })
    } catch (e) {
      console.log('Error occured', e.name)
    }
    proc = null
  }

  proc = spawn('node', ['dist-server/entries/dev.js'], {
    cwd,
    env: { ...process.env, FORCE_COLOR: "1" },
  })
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
}, 500)
