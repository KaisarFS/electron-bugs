import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { v4 as uuidv4 } from 'uuid'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/icon.png'), // Path to the application icon
    webPreferences: {
      webSecurity: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  // Open DevTools in development mode
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  // Show the window when ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the renderer
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    console.log(join(__dirname, '../renderer/index.html==============='))
    console.log(process.env['ELECTRON_RENDERER_URL'])
    console.log(is.dev, 'is_dev')
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', async () => {
    console.log('pong')
    // const PouchDB = require('pouchdb')
    // const localDB = new PouchDB('transaction')
    // const remoteDB = new PouchDB('http://admin:newPos9892@68.183.184.176:5984/transaction')

    // const doc = {
    //   _id: uuidv4(),
    //   name: 'Mittens',
    //   occupation: 'kitten',
    //   age: 3,
    //   hobbies: ['playing with balls of yarn', 'chasing laser pointers', "lookin' hella cute"]
    // }
    // localDB.put(doc)
    // localDB.sync(remoteDB)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

let customerWindow: BrowserWindow | null = null

function createCustomerView(): void {
  if (customerWindow) {
    customerWindow.focus()
    return
  }

  customerWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Customer View',
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    customerWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/customer-view`)
  } else {
    customerWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#/customer-view'
    })
  }

  customerWindow.on('closed', () => {
    customerWindow = null
  })
}

ipcMain.on('open-customer-view', () => {
  createCustomerView()
})

ipcMain.on('update-products', (_, products) => {
  // if (!customerWindow || customerWindow.isDestroyed()) {
  //   createCustomerView()
  // }

  if (customerWindow) {
    customerWindow.webContents.send('product-updated', products)
  } else {
    console.warn('Customer View is not available. Update skipped.')
  }
})

ipcMain.on('update-member', (_, updatedMember) => {
  if (customerWindow && !customerWindow.isDestroyed()) {
    customerWindow.webContents.send('update-member', updatedMember)
  } else {
    console.warn('Customer View is not available. Member update skipped.')
  }
})

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

export default { createCustomerView }
