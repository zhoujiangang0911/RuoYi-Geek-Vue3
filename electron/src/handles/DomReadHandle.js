const { executeJavaScript } = require('../utils/executeJavaScript')
exports.DomReadHandle = (win) => {
    win.webContents.on('did-finish-load', () => {
        executeJavaScript(win, `console.log('dom加载完成')`)
    })
}