const {app, globalShortcut, BrowserWindow, Menu, Tray} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

// globals to avoid being GC'ed
let launcher, tray;

function createWindow() {
    launcher = new BrowserWindow({
        width: 750,
        height: 450,
        frame: false,
        alwaysOnTop: true,
        center: true,
        closable: false,
        minimizable: false,
        maximizable: false,
        moveable: false,
        skipTaskbar: true,
        show: false,
    });
    launcher.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    launcher.on('ready-to-show', () => launcher.show());
    launcher.on('blur', () => launcher.hide());
    launcher.on('closed', () => launcher = tray = null);

    setupShortcuts();
    setupTray();
}

function setupShortcuts () {
    globalShortcut.register('Alt+Space', toggleLauncher);
}

function setupTray() {
    const iconName = process.platform === 'win32' ? './icons/tray-32.ico' : './icons/tray-32.png';
    const iconPath = path.join(__dirname, iconName);
    tray = new Tray(iconPath);
    tray.on('click', toggleLauncher);
    tray.setToolTip('YouTube Launcher is running');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Toggle YouTube Launcher', click: toggleLauncher },
        { label: 'Quit', click: () => app.quit() },
    ]);
    tray.setContextMenu(contextMenu);
}

function toggleLauncher() {
    launcher.isVisible() ? launcher.hide() : launcher.show();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (launcher === null) {
        createWindow();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
