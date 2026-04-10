import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const isDev: boolean = !app.isPackaged && process.env['NODE_ENV'] === 'development';

let win: BrowserWindow | null;

function createWindow(): void {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  });

  if (isDev) {
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    win.loadFile(
      path.join(__dirname, '..', 'dist', 'net-scan-desktop-application', 'browser', 'index.html'),
    );
  }

  win.once('ready-to-show', () => {
    win!.show();
  });

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
