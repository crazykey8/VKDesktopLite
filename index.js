const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { setup: setupPushReceiver } = require('electron-push-receiver');

let window;
let isQuiting;
let tray;

app.on('before-quit', function () {
    isQuiting = true;
});

app.on('ready', () => {
    tray = new Tray(path.join(__dirname, 'electron.png'));

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Показать приложение', click: function () {
                window.show();
            }
        },
        {
            label: 'Выход', click: function () {
                isQuiting = true;
                app.quit();
            }
        }
    ]));

    window = new BrowserWindow({
        width: 800,
        height: 600,
        show: true,
    });

    window.loadURL('https://m.vk.com')

    window.webContents.on('did-finish-load', () => {
        setupPushReceiver(window.webContents)
    })

    window.setMenuBarVisibility(false)

    window.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            window.hide();
            event.returnValue = false;
        }
    });
});