const fs = require('fs');
exports.getJavaScript = (data) => {
    return new Promise((resolve, reject) => {
        if (data.startsWith('file:///')) {
            fs.readFile(
                data[8] == '.' ? path.join(__dirname, data.substring(8)) : data.substring(8),
                { encoding: 'utf-8' },
                (err, script) => {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve(script);
                    }
                })
        } else if (data.startsWith('http://') || data.startsWith('https://')) {
            net.fetch(data).then(async (res) => {
                const script = await res.text();
                resolve(script);
            })
        } else {
            resolve(data);
        }
    })
}
exports.executeJavaScript = (win, script) => {
    if (!!win) {
        win.webContents.executeJavaScript(script);
    } else {
        eval(script)
    }
}