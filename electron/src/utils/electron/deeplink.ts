import { app, BrowserWindow } from 'electron'
import qs from 'qs'
import { parse as parseUrl } from 'url'

import { log } from './logger'

const PROTOCOL = 'hulab'

let mainWindow: BrowserWindow | null = null

function runDeepLink(url: string) {
  const { host, pathname: originPath, query: originQuery } = parseUrl(url)
  if (!originPath || !originQuery) {
    return
  }
  const path = originPath.replace(/(^\/+)|(\/+$)/g, '')
  const query = qs.parse(originQuery) as Record<string, string>
  if (host === 'auth') {
    if (path === 'signin') {
      mainWindow?.webContents.send('signin', query)
      return
    }
  }
  log('unknown event', host, path, query)
}

if (!app.isDefaultProtocolClient(PROTOCOL)) {
  app.setAsDefaultProtocolClient(PROTOCOL)
}

app.on('open-url', (event, data) => {
  event.preventDefault()
  runDeepLink(data)
})

app.on('second-instance', (e, argv) => {
  if (process.platform === 'win32') {
    const url = argv.find(arg => arg.startsWith(`${PROTOCOL}://`))
    if (url) {
      runDeepLink(url)
    }
  }
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }
})

export function setMainWindowToDeepLink(window: BrowserWindow | null) {
  mainWindow = window
}
