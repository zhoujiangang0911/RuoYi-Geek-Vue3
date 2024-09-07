const { executeJavaScript } = require('../utils/executeJavaScript')
exports.WillNavigateHandle = (win) => {
    win.webContents.on('will-navigate', (event) => {
        executeJavaScript(win, `console.log('页面即将加载')`)
    });
}