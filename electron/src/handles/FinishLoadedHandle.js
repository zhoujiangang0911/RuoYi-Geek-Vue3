const { executeJavaScript } = require('../utils/executeJavaScript')
exports.FinishLoadedHandle = (win) => {
    win.webContents.on('did-finish-load', () => {
        executeJavaScript(win, `console.log('页面加载完成')`)
    })
}