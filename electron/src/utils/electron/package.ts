
let _isPackaged = false

if ((process as any).mainModule?.filename.indexOf('app.asar') !== -1) {
  _isPackaged = true
} else if ((process as any).argv.filter((a: string) => a.includes('app.asar')).length > 0) {
  _isPackaged = true
}

export const isPackaged = _isPackaged
