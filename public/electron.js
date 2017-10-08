const {
    app, globalShortcut, ipcMain,
    BrowserWindow, Menu, MenuItem, Tray
} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

const config = { isDev };
if (config.isDev) {
    config.launcherUrl = 'http://localhost:3000/index.html?root=launcher';
    config.playerUrl = `http://localhost:3000/index.html?root=player`;
} else {
    config.launcherUrl = `file://${path.join(__dirname, '../build/index.html?root=launcher')}`;
    config.playerUrl = `file://${path.join(__dirname, `../build/index.html?root=player`)}`;
}
Object.freeze(config);

// globals to avoid being GC'ed
let launcher = null,
    player = null,
    tray = null;

function createWindow() {
    launcher = new BrowserWindow({
        width: 751,
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
    launcher.loadURL(config.launcherUrl);
    launcher.on('ready-to-show', () => launcher.show());
    launcher.on('blur', () => launcher.hide());
    launcher.on('closed', () => launcher = tray = null);

    setupShortcuts();
    setupTray();
    if (config.isDev) {
        setupDevTools();
    }

    const { screen } = require('electron');
    ipcMain.on('add-to-queue', (_, video) => {
        if (player === null) {
            const { x, y, width, height } = screen.getPrimaryDisplay().workArea;
            player = new BrowserWindow({
                width: 640,
                height: 360,
                frame: false,
                alwaysOnTop: true,
                minimizable: false,
                maximizable: false,
                // skipTaskbar: true,
                x: x + width - 20,
                y: y + height - 20,
                show: false,
                menu: Menu.getApplicationMenu(),
            });
            player.loadURL(config.playerUrl);
            player.on('ready-to-show', () => {
                player.webContents.send('add-to-queue', video);
                player.show();
            });
            player.on('closed', () => player = null);
            const menu = new Menu();
            menu.append(new MenuItem({
                label: 'Toggle DevTools',
                accelerator: 'F12',
                click: () => player.toggleDevTools()
            }));
            player.setMenu(menu);
        } else {
            player.webContents.send('add-to-queue', video);
            player.focus(); // alwaysOnTop doesn't seem to work... (on Linux/MATE)
        }
    });
}

function setupShortcuts() {
    // global shortcuts
    globalShortcut.register('Alt+Space', toggleLauncher);

    // shortcuts usable when the window is focused
    // NOTE: this only includes shortcuts that apply to the BrowserWindow as a whole, not to DOM elements inside it
    const menu = new Menu();
    menu.append(new MenuItem({
        label: 'Hide',
        accelerator: 'Esc',
        click: () => launcher.hide()
    }));
    menu.append(new MenuItem({
        label: 'Toggle DevTools',
        accelerator: 'F12',
        click: () => launcher.toggleDevTools()
    }));
    launcher.setMenu(menu);
}

function setupTray() {
    const iconName = process.platform === 'win32' ? './icons/tray-32.ico' : './icons/tray-32.png';
    const iconPath = path.join(__dirname, iconName);
    tray = new Tray(iconPath);
    tray.on('click', toggleLauncher);
    tray.setToolTip('YouTube Launcher is running');
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Toggle YouTube Launcher', click: toggleLauncher},
        {label: 'Quit', click: () => app.quit()},
    ]);
    tray.setContextMenu(contextMenu);
}

function setupDevTools() {
    // install DevTools extensions
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    require('devtron').install();
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
    launcher = player = tray = null;
});
