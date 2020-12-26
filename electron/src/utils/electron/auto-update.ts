import { BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

import { logger, log } from '~/utils/electron/logger'

const DURATION_15MIN = 15 * 60 * 1000

let mainWindow: BrowserWindow | null = null

autoUpdater.autoDownload = false
autoUpdater.logger = logger

autoUpdater.on('error', (error) => {
  let content = 'unknown'
  if (error !== null) {
    if (error.stack) {
      content = [error.message || '', error.stack.toString()].join('\n\n').trim()
    } else {
      content = error.toString()
    }
  }
  dialog.showErrorBox('Error: ', content)
})

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    message: '새로운 업데이트가 있습니다. 업데이트를 진행하시겠습니까?',
    buttons: ['네', '아니오'],
  }).then(({ response }) => {
    if (response === 0) {
      mainWindow?.webContents.send('app_update', {
        progress: null,
      })
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('download-progress', (progress: { transferred: number, total: number, bytesPerSecond: number }) => {
  mainWindow?.setProgressBar(progress.transferred / progress.total)
  log(`send app_update${progress.transferred}, ${progress.total}`)
  mainWindow?.webContents.send('app_update', {
    progress: progress.transferred / progress.total,
  })
})

autoUpdater.on('update-downloaded', () => {
  mainWindow?.setProgressBar(1)
  mainWindow?.webContents.send('app_update', {
    progress: 1,
  })
  dialog.showMessageBox({
    type: 'info',
    message: '앱 다운로드가 완료되었습니다. 앱을 재시작합니다.',
  }).then(_ => {
    autoUpdater.quitAndInstall()
  })
})

export function setMainWindowToAutoUpdate(window: BrowserWindow | null) {
  mainWindow = window
}

export function checkForUpdateIntervally() {
  autoUpdater.checkForUpdates()
  setInterval(() => { autoUpdater.checkForUpdates() }, DURATION_15MIN)
}

export {
  autoUpdater,
}
