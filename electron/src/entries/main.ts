import { app, BrowserWindow, ipcMain as ipc } from 'electron'
import ElectronStore from 'electron-store'
import { PersistStore } from '~/interfaces/store'
import { setMainWindowToLog } from '~/utils/electron/logger'

let mainWindow: BrowserWindow | null = null

const store = new ElectronStore<PersistStore>()

ipc.handle('getStore', (_, key: keyof PersistStore) => store.get(key))
ipc.handle('getStoreAll', _ => store.store)
ipc.handle('setStore', (_, key: keyof PersistStore, value: any) => store.set(key, value))

function createMainWindow () {
  mainWindow = new BrowserWindow({
    height: 400,
    width: 1000,
    minWidth: 1000,
    minHeight: 400,
    useContentSize: false,
    fullscreen: false,
    titleBarStyle: 'hidden', // on OSX
    webPreferences: {
      devTools: process.env.NODE_ENV !== 'production',
      webviewTag: true,
      nodeIntegration: true,
    },
  })

  if (process.platform === 'darwin') {
    mainWindow.loadFile(`${__dirname}/index_mac.html`)
  } else {
    mainWindow.loadFile(`${__dirname}/index_win.html`)
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  setMainWindowToLog(mainWindow)
}

app.on('ready', () => {
  createMainWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})
