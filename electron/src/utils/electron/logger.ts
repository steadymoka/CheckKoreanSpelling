import { BrowserWindow, ipcMain as ipc } from 'electron'
import { Logger } from 'electron-updater'
import moment from 'moment-timezone'

let mainWindow: BrowserWindow | null = null
let unresolvedMessages = [] as any[][]

ipc.handle('resolveLogs', _ => {
  if (mainWindow) {
    for (const unresolvedMessage of unresolvedMessages) {
      mainWindow.webContents.executeJavaScript(`console.log('%c[main]', 'color: blue', ${unresolvedMessage.map(m => JSON.stringify(m)).join(', ')})`)
    }
    unresolvedMessages = []
  }
})

function sendLog(...message: any[]) {
  if (mainWindow) {
    if (unresolvedMessages.length > 0) {
      for (const unresolvedMessage of unresolvedMessages) {
        mainWindow.webContents.executeJavaScript(`console.log('%c[main]', 'color: blue', ${unresolvedMessage.map(m => JSON.stringify(m)).join(', ')})`)
      }
      unresolvedMessages = []
    }
    mainWindow.webContents.executeJavaScript(`console.log('%c[main]', 'color: blue', ${message.map(m => JSON.stringify(m)).join(', ')})`)
  } else {
    unresolvedMessages.push(message)
  }
}

export function setMainWindowToLog(window: BrowserWindow | null) {
  mainWindow = window
}

export function log(...message: any[]) {
  sendLog(`[${moment().format('YYYYMMDD_HHmmss.SSS')}]`, ...message)
}

export const logger: Logger = {
  debug: (message) => sendLog(`[${moment().format('YYYYMMDD_HHmmss.SSS')}][debug] ${message}`),
  info: (message) => sendLog(`[${moment().format('YYYYMMDD_HHmmss.SSS')}][info] ${message}`),
  warn: (message) => sendLog(`[${moment().format('YYYYMMDD_HHmmss.SSS')}][warn] ${message}`),
  error: (message) => sendLog(`[${moment().format('YYYYMMDD_HHmmss.SSS')}][error] ${message}`),
}
