const { executeJavaScript } = require('../utils/executeJavaScript')

exports.StartLoadingHandle = (win) => {
    win.webContents.on('did-start-loading', (event) => {
        executeJavaScript(win, `console.log('页面开始加载')`)
    });
}