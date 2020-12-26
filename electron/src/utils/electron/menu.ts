import { app, Menu, MenuItemConstructorOptions, dialog } from 'electron'

import { autoUpdater } from './auto-update'

const isMac = process.platform === 'darwin'

function checkForUpdate() {
  autoUpdater.checkForUpdates().then((update) => {
    if (!update.cancellationToken) {
      dialog.showMessageBox({
        type: 'info',
        message: '업데이트할 내용이 없습니다.',
        buttons: ['확인'],
      })
    }
  })
}

const appMenus: MenuItemConstructorOptions[] = isMac ? [
  {
    label: app.name,
    submenu: [
      { role: 'about' },
      { label: 'Check for Updates...', click: checkForUpdate },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
] : [
  {
    label: 'File',
    submenu: [
      { role: 'about' },
      { label: 'Check for Updates...', click: checkForUpdate },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
]

export const menu = Menu.buildFromTemplate([
  ...appMenus,
  {
    label: 'Edit',
    submenu: isMac ? [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
    ] : [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      // { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
    ],
  },
])
