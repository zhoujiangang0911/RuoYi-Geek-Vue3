const { app, protocol, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
//const {createProtocol} = require('vue-cli-plugin-electron-builder/lib')
const { VUEJS_DEVTOOLS } = require('electron-devtools-installer')
const installExtension = require('electron-devtools-installer').default
const { FinishLoadedHandle } = require('./handles/FinishLoadedHandle');
const { StartLoadingHandle } = require('./handles/StartLoadingHandle');
const { WillNavigateHandle } = require('./handles/WillNavigateHandle');
const { DomReadHandle } = require('./handles/DomReadHandle');
const isDevelopment = process.env.NODE_ENV !== 'production'
const Store = require('electron-store');
const path = require('path');

// 在应用程序准备就绪之前，必须注册方案
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])
process.env.WEBPACK_DEV_SERVER_URL = true

async function createWindow() {
    // 创建浏览器窗口。
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, './html/logo/logo.png'),
        webPreferences: {
            contextIsolation: false,                        // 上下文隔离
            enableRemoteModule: true,                       // 启用远程模块
            nodeIntegration: true,                          // 开启自带node环境
            webviewTag: true,                               // 开启webview
            contextIsolation: true,                         // 开启context上下文
            preload: path.join(__dirname, './preload.js'),  // 指定预加载脚本 创建窗口时注入脚本
            webSecurity: false,                             // 开启网络安全
            allowDisplayingInsecureContent: true,           // 允许显示不安全的内容
            allowRunningInsecureContent: true               // 允许运行不安全内容
        }
    })

    FinishLoadedHandle(win); // 在页面加载完成后注入脚本
    StartLoadingHandle(win); // 在页面开始加载时注入脚本
    WillNavigateHandle(win); // 在页面即将加载时注入脚本
    // 在页面 DOM 准备就绪时注入脚本
    win.once('ready-to-show', () => {
        win.show();
        DomReadHandle(win);
    });
    win.openDevTools()
    ipcMain.on('getPrinterList', (event) => {
        //主线程获取打印机列表
        win.webContents.getPrintersAsync().then(data => {
            win.webContents.send('getPrinterList', data);
        });
        //通过webContents发送事件到渲染线程，同时将打印机列表也传过去

    });
    win.maximize()
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // 如果处于开发模式，则加载开发服务器的url
        await win.loadURL("http://127.0.0.1/")
    } else {
        //createProtocol('app')
        // 不在开发中时加载索引.html
        await win.loadFile(path.resolve(__dirname, './html/index.html'))
    }

}
// 当所有窗口关闭时退出。
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

//当Electron完成后将调用此方法
//初始化并准备好创建浏览器窗口。
//某些API只有在此事件发生后才能使用。
app.on('ready', async () => {
    Store.initRenderer();
    if (isDevelopment && !process.env.IS_TEST) {
        // 安装 Vue Devtools 开发工具扩展
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e)
        }
    }
    await createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {

    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
